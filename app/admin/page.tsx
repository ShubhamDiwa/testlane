import type {Metadata} from 'next';
import {Header,Footer} from '../ui';
import Admin from './workspace';
export const metadata:Metadata={title:'Testing Operations',robots:{index:false,follow:false},alternates:{canonical:'/admin'}};
export default function Page(){return <><Header/><main className="wrap page-shell"><Admin/></main><Footer/></>}
