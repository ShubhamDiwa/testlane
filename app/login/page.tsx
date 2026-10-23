import type { Metadata } from 'next';
import {Header,Footer} from '../ui';
import Login from './sign-in';
export const metadata:Metadata={title:'Log In',robots:{index:false,follow:false},alternates:{canonical:'/login'}};
export default function Page(){return <><Header/><main className="wrap page-shell"><Login/></main><Footer/></>}
