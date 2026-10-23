import type { Metadata } from 'next';
import { Header,Footer } from '../ui';
import StartForm from './start-form';
export const metadata:Metadata={title:'Start Your Android Closed Test',description:'Share your Android app and testing goals to prepare a 12-tester, 14-day closed test.',alternates:{canonical:'/start'}};
export default function Start(){return <><Header/><main className="wrap page-shell"><div className="page-heading"><div className="eyebrow">YOUR NEXT STEP STARTS HERE</div><h1>Let's meet your app.</h1><p>A few details now. A more focused test later. Tell us what you're building and where you'd like a fresh pair of eyes.</p></div><StartForm/></main><Footer/></>}
