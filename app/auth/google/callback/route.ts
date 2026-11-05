import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {authCookie,sessionCookie,supaFetch,verifierCookie} from '../../../../lib/community-supabase';
export async function GET(req:Request){
 const code=new URL(req.url).searchParams.get('code');
 const verifier=(await cookies()).get(verifierCookie)?.value;
 let session:{access_token:string;expires_in:number}|undefined;
 try{
  if(code&&verifier){
   const result=await supaFetch('/auth/v1/token?grant_type=pkce',undefined,{method:'POST',body:JSON.stringify({auth_code:code,code_verifier:verifier})});
   if(result.ok)session=await result.json() as typeof session;
  }
 }catch{/* Return a generic message without exposing provider diagnostics. */}
 const response=NextResponse.redirect(new URL(session?.access_token?'/community#post':'/login?error=google',req.url),303);
 response.cookies.set(verifierCookie,'',sessionCookie(req,0));
 if(session?.access_token)response.cookies.set(authCookie,session.access_token,sessionCookie(req,Math.max(0,Math.min(3600,session.expires_in||0))));
 response.headers.set('Cache-Control','no-store');
 response.headers.set('Referrer-Policy','no-referrer');
 return response;
}
