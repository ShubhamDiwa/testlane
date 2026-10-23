import type {Metadata} from 'next';
import {Header,Footer} from '../ui';
import Dashboard from './workspace';
export const metadata:Metadata={title:'Your Testing Workspace',robots:{index:false,follow:false},alternates:{canonical:'/dashboard'}};
export default function Page(){return <><Header/><main className="wrap page-shell"><Dashboard/></main><Footer/></>}
