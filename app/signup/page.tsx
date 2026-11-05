import {Header,Footer} from '../ui';
import {chatGPTSignInPath} from '../chatgpt-auth';
import {identity,memberProfile,usesGoogle} from '../community/google-data';
export const dynamic='force-dynamic';
export const metadata={title:'Join for free',robots:{index:false,follow:false}};
export default async function Page({searchParams}:{searchParams:Promise<{error?:string}>}){
 const [user,params]=await Promise.all([identity(),searchParams]);
 const member=user?await memberProfile(user):null;
 const google=usesGoogle(),provider=google?'Google':'ChatGPT';
 return <><Header/><main className="wrap page-shell"><section className="panel login-panel">
 <h1>{member?'You’re already a member':'Join Testlane for free'}</h1>
 {member?<><p>Your profile is ready to use.</p><a className="button full" href="/community#workspace">Open my workspace</a></>:user?<><p>Signed in with {provider}. Choose a public display name to finish your one-time Testlane signup.</p>
 {params.error&&<p role="alert" className="form-error">{params.error==='name'?'Enter a display name between 2 and 40 characters.':'Could not create your profile. Please try again.'}</p>}
 <form action="/api/community" method="post"><input type="hidden" name="action" value="register"/><input type="hidden" name="from" value="signup"/><label className="field">Display name<input name="name" required minLength={2} maxLength={40} autoComplete="nickname" placeholder="At least 2 characters"/></label><button className="button full">Create my Testlane profile</button></form></>:<><p>Sign in with {provider} first, then choose a display name for the community.</p><a className="button full" target="_top" href={google?'/auth/google/start':chatGPTSignInPath('/signup')}>Continue with {provider}</a></>}
 </section></main><Footer/></>;
}
