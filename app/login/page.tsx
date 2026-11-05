import {Header,Footer} from '../ui';
import {getChatGPTUser,chatGPTSignInPath} from '../chatgpt-auth';
import {communityDb} from '../community/data';
export const dynamic='force-dynamic';
export const metadata={title:'Log in',robots:{index:false,follow:false}};
export default async function Page(){
 const user=await getChatGPTUser();
 const member=user?await communityDb().prepare('SELECT id FROM members WHERE id=?').bind(user.userId).first():null;
 return <><Header/><main className="wrap page-shell"><section className="panel login-panel">
 <h1>{member?'Welcome back':user?'You’re signed in':'Log in to Testlane'}</h1>
 <p>{member?'Your Testlane account is ready.':user?'Your ChatGPT sign-in is active. Create a Testlane profile once to post an app or request a tester spot.':'Use your ChatGPT account to access your Testlane workspace.'}</p>
 {member?<a className="button full" href="/community#workspace">Open my workspace</a>:user?<a className="button full" href="/signup">Create my profile</a>:<a className="button full" target="_top" href={chatGPTSignInPath('/login')}>Continue with ChatGPT</a>}
 {!user&&<div className="login-divider">New here? <a href="/signup">Join for free</a></div>}
 </section></main><Footer/></>;
}
