import {Header,Footer} from '../ui';
import {chatGPTSignInPath} from '../chatgpt-auth';
import {identity,memberProfile,usesGoogle} from '../community/google-data';
export const dynamic='force-dynamic';
export const metadata={title:'Log in',robots:{index:false,follow:false}};
export default async function Page({searchParams}:{searchParams:Promise<{error?:string}>}){
 const user=await identity();
 const {error}=await searchParams;
 const member=user?await memberProfile(user):null;
 const google=usesGoogle(),provider=google?'Google':'ChatGPT';
 return <><Header/><main className="wrap page-shell"><section className="panel login-panel">
 <h1>{member?'Welcome back':user?'You’re signed in':'Log in to Testlane'}</h1>
 {error==='google'&&!user&&<p role="alert" className="form-error">Google sign-in could not finish. Please try again from this page.</p>}
 <p>{member?'Your Testlane account is ready.':user?'Your '+provider+' sign-in is active. Create a Testlane profile once to post an app or request a tester spot.':'Use your '+provider+' account to access your Testlane workspace.'}</p>
 {member?<a className="button full" href="/community#workspace">Open my workspace</a>:user?<a className="button full" href="/signup">Create my profile</a>:<a className="button full" target="_top" href={google?'/auth/google/start':chatGPTSignInPath('/login')}>Continue with {provider}</a>}
 {!user&&<div className="login-divider">New here? <a href="/signup">Join for free</a></div>}
 </section></main><Footer/></>;
}
