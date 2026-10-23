import Link from 'next/link';
import {Header,Footer} from './ui';
export default function NotFound(){return <><Header/><main className="wrap page-shell"><div className="empty-state"><div className="eyebrow" style={{justifyContent:'center'}}>404 · A SMALL DETOUR</div><h1 style={{fontSize:44,marginTop:20}}>This page hasn't launched.</h1><p>Let's get you back on the right path.</p><Link className="button" href="/">Back to Testlane →</Link></div></main><Footer/></>}
