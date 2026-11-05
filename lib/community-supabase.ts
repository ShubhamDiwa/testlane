import {cookies} from 'next/headers';
import {env} from 'cloudflare:workers';

const runtime=env as typeof env & {TESTLANE_SUPABASE_URL?:string;TESTLANE_SUPABASE_KEY?:string};
export const authCookie='tl_google_session';
export const verifierCookie='tl_google_pkce';
export const googleCallback='/auth/google/callback';
export function googleConfig(){
 const url=runtime.TESTLANE_SUPABASE_URL,key=runtime.TESTLANE_SUPABASE_KEY;
 if(!url||!key)return null;
 if(!/^https:\/\/[a-z0-9]+\.supabase\.co$/.test(url)||!key.startsWith('sb_publishable_'))throw new Error('Invalid Supabase configuration');
 return {url,key};
}
export async function supaFetch(path:string,token?:string,init:RequestInit={}){
 const c=googleConfig();if(!c)throw new Error('Supabase unavailable');
 const headers=new Headers(init.headers);headers.set('apikey',c.key);
 if(token)headers.set('Authorization','Bearer '+token);
 if(init.body)headers.set('Content-Type','application/json');
 return fetch(c.url+path,{...init,headers,cache:'no-store'});
}
export async function googleUser(){
 const token=(await cookies()).get(authCookie)?.value;
 if(!token)return null;
 const response=await supaFetch('/auth/v1/user',token);
 if(response.status===401||response.status===403)return null;
 if(!response.ok)throw new Error('Could not verify session');
 const user=await response.json() as {id?:string;user_metadata?:{full_name?:unknown;name?:unknown}};
 const name=user.user_metadata?.full_name??user.user_metadata?.name;
 return user.id?{userId:user.id,token,displayName:typeof name==='string'?name.trim().slice(0,80):''}:null;
}
export async function supaData<T>(resource:string,token?:string,body?:object):Promise<T>{
 const r=await supaFetch('/rest/v1/'+resource,token,body?{method:'POST',body:JSON.stringify(body)}:{});
 if(!r.ok)throw new Error('Community operation failed');
 if(r.status===204||r.headers.get('content-length')==='0')return undefined as T;
 const data=await r.text();
 return data?JSON.parse(data) as T:undefined as T;
}
export function params(values:Record<string,string>){return new URLSearchParams(values).toString()}
export function sessionCookie(req:Request,maxAge:number){return {httpOnly:true,secure:new URL(req.url).protocol==='https:',sameSite:'lax' as const,path:'/',maxAge}}
