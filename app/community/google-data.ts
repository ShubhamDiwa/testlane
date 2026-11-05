import {googleConfig,googleUser,params,supaData} from '../../lib/community-supabase';
import {getChatGPTUser} from '../chatgpt-auth';
import {communityDb,type Listing} from './data';
export const usesGoogle=()=>Boolean(googleConfig());
export async function identity(){return usesGoogle()?googleUser():getChatGPTUser()}
export async function memberProfile(user:{userId:string;token?:string}){
 if(!usesGoogle())return communityDb().prepare('SELECT name FROM members WHERE id=?').bind(user.userId).first<{name:string}>();
 return (await supaData<{name:string}[]>('community_members?'+params({select:'name',id:'eq.'+user.userId,limit:'1'}),user.token))[0]??null;
}
type GoogleApp={id:string;owner:string;name:string;description:string;android:string;spots:number;community_members:{name:string}|null};
export async function googleDirectory(user?:{userId:string;token?:string}|null):Promise<Listing[]>{
 const [apps,requests,availability]=await Promise.all([
  supaData<GoogleApp[]>('community_apps?'+params({select:'id,owner,name,description,android,spots,community_members!community_apps_owner_fkey(name)',order:'created_at.desc',limit:'100'}),user?.token),
  user?supaData<{app:string;status:string}[]>('community_requests?'+params({select:'app,status',member:'eq.'+user.userId}),user.token):[],
  supaData<{app:string;open_spots:number}[]>('rpc/community_open_spots',user?.token)
 ]);
 const states=new Map(requests.map(r=>[r.app,r.status]));
 const spots=new Map(availability.map(r=>[r.app,r.open_spots]));
 return apps.map(({community_members,...a})=>({...a,developer:community_members?.name??'Community member',approved:a.spots-(spots.get(a.id)??0),status:states.get(a.id)??null}));
}
export async function googleWorkspace(user:{userId:string;token?:string}){
 const [incoming,joined,notes]=await Promise.all([
  supaData<{app:string;member:string;play_email:string;status:string;community_apps:{name:string};community_members:{name:string}}[]>('community_requests?'+params({select:'app,member,play_email,status,community_apps!inner(name,owner),community_members(name)','community_apps.owner':'eq.'+user.userId,status:'in.(pending,approved)'}),user.token),
  supaData<{app:string;community_apps:{name:string;community_app_details:{link:string;instructions:string}|null}}[]>('community_requests?'+params({select:'app,community_apps(name,community_app_details(link,instructions))',member:'eq.'+user.userId,status:'eq.approved'}),user.token),
  supaData<{id:string;member:string;body:string;community_requests:{community_apps:{name:string}}}[]>('community_feedback?'+params({select:'id,member,body,community_requests!inner(community_apps!inner(name,owner))','community_requests.community_apps.owner':'eq.'+user.userId,order:'created_at.desc',limit:'100'}),user.token)
 ]);
 const ids=[...new Set(notes.map(n=>n.member))];
 const people=ids.length?await supaData<{id:string;name:string}[]>('community_members?'+params({select:'id,name',id:'in.('+ids.join(',')+')'}),user.token):[];
 const names=new Map(people.map(p=>[p.id,p.name]));
 return [
  {results:incoming.map(r=>({app:r.app,member:r.member,email:r.play_email,status:r.status,tester:r.community_members.name,name:r.community_apps.name}))},
  {results:joined.flatMap(r=>{const d=r.community_apps.community_app_details;return d?[{id:r.app,name:r.community_apps.name,...d}]:[]})},
  {results:notes.map(r=>({id:r.id,name:r.community_requests.community_apps.name,tester:names.get(r.member)??'Community member',body:r.body}))}
 ] as const;
}
