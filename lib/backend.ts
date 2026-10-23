export type Config={url:string;key:string;enabled:boolean};
export type Session={access_token:string;refresh_token:string;expires_at:number;user:{id:string;email?:string}};
export type TestRequest={id:string;app_name:string;package_name:string;test_url:string;contact_name:string;contact_email:string;description:string;workflows:string;countries:string;android_version:string;status:string;created_at:string;user_id?:string;start_date?:string|null};
let cached:Config|undefined;
export async function configuration():Promise<Config>{if(cached)return cached;const r=await fetch('/api/config');if(!r.ok)throw new Error('Could not load connection settings. Please reload.');cached=await r.json();return cached!;}
export async function session():Promise<Session|null>{
 const raw=localStorage.getItem('testlane.session');if(!raw)return null;
 let s:Session;try{s=JSON.parse(raw)}catch{localStorage.removeItem('testlane.session');return null}
 if(s.expires_at>Date.now()/1000+60)return s;
 const c=await configuration();if(!c.enabled)return null;
 const r=await fetch(c.url+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{apikey:c.key,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:s.refresh_token})});
 if(!r.ok){localStorage.removeItem('testlane.session');return null;}const next=await r.json() as Session & {expires_in:number};next.expires_at=Math.floor(Date.now()/1000)+next.expires_in;localStorage.setItem('testlane.session',JSON.stringify(next));return next;
}
export async function api<T>(resource:string,options:RequestInit={}):Promise<T>{
 const c=await configuration(),s=await session();if(!c.enabled)throw new Error('Supabase is not connected yet.');if(!s)throw new Error('Please sign in to continue.');
 const r=await fetch(c.url+'/rest/v1/'+resource,{...options,headers:{apikey:c.key,Authorization:'Bearer '+s.access_token,'Content-Type':'application/json',Prefer:'return=representation',...options.headers}});
 if(!r.ok){const e=await r.json().catch(()=>({})) as {message?:string};throw new Error(e.message||'Could not save your changes. Please try again.');}if(r.status===204)return null as T;return r.json() as Promise<T>;
}
export function drafts():TestRequest[]{try{return JSON.parse(localStorage.getItem('testlane.drafts')||'[]')}catch{return []}}
export function saveDraft(draft:TestRequest){const current=drafts();localStorage.setItem('testlane.drafts',JSON.stringify([draft,...current]));}
export function removeDraft(id:string){localStorage.setItem('testlane.drafts',JSON.stringify(drafts().filter(d=>d.id!==id)));}
export async function signOut(){const c=await configuration(),s=await session();if(c.enabled&&s)await fetch(c.url+'/auth/v1/logout',{method:'POST',headers:{apikey:c.key,Authorization:'Bearer '+s.access_token}});localStorage.removeItem('testlane.session');location.href='/login';}
