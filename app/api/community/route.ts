import {getChatGPTUser} from '../../chatgpt-auth';
import {communityDb} from '../../community/data';

export async function POST(req:Request){
 const origin=new URL(req.url).origin;
 if(req.headers.get('origin')!==origin || req.headers.get('sec-fetch-site')==='cross-site')return new Response('Forbidden',{status:403});
 const user=await getChatGPTUser();
 if(!user)return new Response('Sign in first.',{status:401});
 function back(message:string,section='workspace'){return new Response(null,{status:303,headers:{Location:'/community?notice='+encodeURIComponent(message)+'#'+section,'Cache-Control':'no-store'}})}
 try{
  const form=await req.formData(),db=communityDb();
  const val=(key:string,max:number)=>{const v=form.get(key);if(typeof v!=='string'||v.length>max)throw new Error('invalid');return v.trim()};
  const action=val('action',20),id=user.userId;
  if(action==='register'){
   const name=val('name',40);if(name.length<2)return back('Enter a display name of at least two characters.');
   await db.prepare('INSERT INTO members (id,name) VALUES (?,?) ON CONFLICT(id) DO NOTHING').bind(id,name).run();
   return back('You joined Testlane.');
  }
  if(!await db.prepare('SELECT id FROM members WHERE id=?').bind(id).first())return back('Register as a member first.');
  if(action==='post'){
   const name=val('name',80),description=val('description',600),android=val('android',80),link=val('link',500),instructions=val('instructions',1500),spots=Number(val('spots',3));
   let url:URL;try{url=new URL(link)}catch{return back('Enter a valid Google Play testing link.','post')}
   if(!name||!description||!android||!instructions||!Number.isInteger(spots)||spots<1||spots>100||url.origin!=='https://play.google.com'||!/^\/apps\/testing\/[a-zA-Z0-9_.]+\/?$/.test(url.pathname))return back('Complete all fields and use a Google Play closed-testing opt-in link.','post');
   await db.prepare('INSERT INTO community_apps (id,owner,name,description,android,spots,link,instructions,created) VALUES (?,?,?,?,?,?,?,?,?)').bind(crypto.randomUUID(),id,name,description,android,spots,url.href,instructions,Date.now()).run();
   return back('Your app is listed.','directory');
  }
  const app=val('app',50);
  if(action==='request'){
   const email=val('playEmail',254);
   if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return back('Enter the email you use with Google Play.','directory');
   const result=await db.prepare(`INSERT OR IGNORE INTO community_requests(app,member,play_email)
   SELECT id,?,? FROM community_apps a WHERE id=? AND owner<>? AND spots>
   (SELECT count(*) FROM community_requests WHERE app=a.id AND status='approved')`).bind(id,email,app,id).run();
   return back(result.meta.changes?'Request sent to the developer.':'No request was added. Check availability or your existing requests.','directory');
  }
  if(action==='approve'||action==='decline'){
   const member=val('member',150);
   const result=await db.prepare(`UPDATE community_requests SET status=? WHERE app=? AND member=? AND status='pending'
   AND EXISTS (SELECT 1 FROM community_apps a WHERE a.id=? AND a.owner=? AND (?='declined' OR a.spots>
     (SELECT count(*) FROM community_requests WHERE app=a.id AND status='approved')))`)
   .bind(action==='approve'?'approved':'declined',app,member,app,id,action==='approve'?'approved':'declined').run();
   return back(result.meta.changes?'Request updated.':'Request unavailable or no spots remain.');
  }
  if(action==='feedback'){
   const body=val('body',2000);if(body.length<5)return back('Please enter a little more detail.');
   const result=await db.prepare(`INSERT INTO community_feedback (id,app,member,body,created)
   SELECT ?,app,member,?,? FROM community_requests WHERE app=? AND member=? AND status='approved'`).bind(crypto.randomUUID(),body,Date.now(),app,id).run();
   return back(result.meta.changes?'Feedback sent.':'Only approved testers can submit feedback.');
  }
  return new Response('Unknown action',{status:400});
 }catch{return back('Could not save your change. Check the fields and try again.')}
}
