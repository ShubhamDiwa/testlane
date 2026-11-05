import {NextResponse} from 'next/server';
import {googleCallback,googleConfig,sessionCookie,verifierCookie} from '../../../../lib/community-supabase';
const base64url=(bytes:Uint8Array)=>btoa(String.fromCharCode(...bytes)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
export async function GET(req:Request){
 const config=googleConfig();if(!config)return new Response('Google sign-in is not configured.',{status:503});
 const verifier=base64url(crypto.getRandomValues(new Uint8Array(32)));
 const challenge=base64url(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(verifier))));
 const url=new URL(config.url+'/auth/v1/authorize');
 url.search=new URLSearchParams({provider:'google',redirect_to:new URL(googleCallback,req.url).href,code_challenge:challenge,code_challenge_method:'s256'}).toString();
 const response=NextResponse.redirect(url,303);
 response.cookies.set(verifierCookie,verifier,sessionCookie(req,600));
 response.headers.set('Cache-Control','no-store');
 return response;
}
