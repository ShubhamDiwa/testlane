import {identity,memberProfile,usesGoogle} from '../../community/google-data';
import {supaData} from '../../../lib/community-supabase';
import {playStoreLink,playTestingLink} from '../../../lib/play-testing-link';
import {communityDb} from '../../community/data';

export async function POST(req:Request){
 const origin=new URL(req.url).origin;
 if(req.headers.get('origin')!==origin || req.headers.get('sec-fetch-site')==='cross-site')return new Response('Forbidden',{status:403});
 const user=await identity();
 if(!user)return new Response(null,{status:303,headers:{Location:'/login?error=session','Cache-Control':'no-store'}});
 function back(message:string,section='workspace'){return new Response(null,{status:303,headers:{Location:'/community?notice='+encodeURIComponent(message)+'#'+section,'Cache-Control':'no-store'}})}
 let signup=false;
 const signupError=(reason:string)=>new Response(null,{status:303,headers:{Location:'/signup?error='+reason,'Cache-Control':'no-store'}});
 try{
  const form=await req.formData(),google=usesGoogle(),db=google?null:communityDb();
  const token='token' in user?user.token:undefined;
  const val=(key:string,max:number)=>{const v=form.get(key);if(typeof v!=='string'||v.length>max)throw new Error('invalid');return v.trim()};
  const action=val('action',20),id=user.userId;
  if(action==='register'){
   signup=form.get('from')==='signup';
   const name=val('name',40);if(name.length<2)return signup?signupError('name'):back('Enter a display name of at least two characters.','post');
   if(google){if(!await memberProfile(user))await supaData('community_members',token,{name})}
   else await db!.prepare('INSERT INTO members (id,name) VALUES (?,?) ON CONFLICT(id) DO NOTHING').bind(id,name).run();
   return back('You joined Testlane.');
  }
  if(!await memberProfile(user))return back('Register as a member first.','post');
  if(action==='post-live'&&google){
   const name=val('name',80),description=val('description',600),android=val('android',80);
   if(!name||!description||!android)return back('Enter the app name, description, and Android requirements.','post');
   const url=playStoreLink(val('link',500));
   if(!url)return back('Paste the official Play Store app link, starting with https://play.google.com/store/apps/details?id=','post');
   await supaData('rpc/community_post_live_app',token,{p_name:name,p_description:description,p_android:android,p_link:url});
   return back('Your Google Play app is listed.','try-apps');
  }
  if(action==='post'){
   const name=val('name',80),description=val('description',600),android=val('android',80),link=val('link',500),instructions=val('instructions',1500),spots=Number(val('spots',3));
   if(!name||!description||!android||!instructions)return back('Enter the app name, description, Android requirements, and testing instructions.','post');
   if(!Number.isInteger(spots)||spots<1||spots>100)return back('Tester spots must be a whole number from 1 to 100.','post');
   const url=playTestingLink(link);
   if(!url)return back('Paste a Google Play app listing URL with an id, or a closed-testing web link from Play Console.','post');
   if(google)await supaData('rpc/community_post_app',token,{p_name:name,p_description:description,p_android:android,p_spots:spots,p_link:url,p_instructions:instructions});
   else await db!.prepare('INSERT INTO community_apps (id,owner,name,description,android,spots,link,instructions,created) VALUES (?,?,?,?,?,?,?,?,?)').bind(crypto.randomUUID(),id,name,description,android,spots,url,instructions,Date.now()).run();
   return back('Your app is listed.','closed-tests');
  }
  const app=val('app',50);
  if(action==='comment'&&google){
   if(!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(app))return back('Listing unavailable.','directory');
   const discussion='/community/discussion/'+app;
   let notice='error';
   try{
    const body=val('body',1000);
    if(body.length>=2){
     await supaData('community_comments',token,{app,body});
     notice='sent';
    }
   }catch{}
   return new Response(null,{status:303,headers:{Location:discussion+'?notice='+notice,'Cache-Control':'no-store'}});
  }
  if(action==='remove'&&google){
   if(!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(app))return back('Listing unavailable.','directory');
   const removed=await supaData<boolean>('rpc/community_remove_app',token,{p_app:app});
   return back(removed?'Your listing was removed.':'Listing unavailable or already removed.','directory');
  }
  if(action==='request'){
   const email=val('playEmail',254);
   if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return back('Enter the email you use with Google Play.','closed-tests');
   if(google){
    try{await supaData('community_requests',token,{app,play_email:email})}
    catch{return back('Request not sent. Check if spots are still open or you already requested this app.','closed-tests')}
    return back('Request sent to the developer.','closed-tests')
   }
   const result=await db!.prepare(`INSERT OR IGNORE INTO community_requests(app,member,play_email)
   SELECT id,?,? FROM community_apps a WHERE id=? AND owner<>? AND spots>
   (SELECT count(*) FROM community_requests WHERE app=a.id AND status='approved')`).bind(id,email,app,id).run();
   return back(result.meta.changes?'Request sent to the developer.':'No request was added. Check availability or your existing requests.','closed-tests');
  }
  if(action==='approve'||action==='decline'){
   const member=val('member',150);
   if(google){const changed=await supaData<boolean>('rpc/community_decide_request',token,{p_app:app,p_member:member,p_approve:action==='approve'});return back(changed?'Request updated.':'Request unavailable or no spots remain.')}
   const result=await db!.prepare(`UPDATE community_requests SET status=? WHERE app=? AND member=? AND status='pending'
   AND EXISTS (SELECT 1 FROM community_apps a WHERE a.id=? AND a.owner=? AND (?='declined' OR a.spots>
     (SELECT count(*) FROM community_requests WHERE app=a.id AND status='approved')))`)
   .bind(action==='approve'?'approved':'declined',app,member,app,id,action==='approve'?'approved':'declined').run();
   return back(result.meta.changes?'Request updated.':'Request unavailable or no spots remain.');
  }
  if(action==='feedback'){
   const body=val('body',2000);if(body.length<5)return back('Please enter a little more detail.');
   if(google){await supaData('community_feedback',token,{app,body});return back('Feedback sent.')}
   const result=await db!.prepare(`INSERT INTO community_feedback (id,app,member,body,created)
   SELECT ?,app,member,?,? FROM community_requests WHERE app=? AND member=? AND status='approved'`).bind(crypto.randomUUID(),body,Date.now(),app,id).run();
   return back(result.meta.changes?'Feedback sent.':'Only approved testers can submit feedback.');
  }
  return new Response('Unknown action',{status:400});
 }catch{return signup?signupError('save'):back('Could not save your change. Check the fields and try again.','post')}
}
