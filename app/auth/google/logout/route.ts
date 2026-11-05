import {NextResponse} from 'next/server';
import {authCookie,sessionCookie} from '../../../../lib/community-supabase';
export async function POST(req:Request){
 if(req.headers.get('origin')!==new URL(req.url).origin)return new Response('Forbidden',{status:403});
 const r=NextResponse.redirect(new URL('/login',req.url),303);
 r.cookies.set(authCookie,'',sessionCookie(req,0));r.headers.set('Cache-Control','no-store');return r;
}
