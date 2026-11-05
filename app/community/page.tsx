import {supaData} from '../../lib/community-supabase';
import {RemoveListing} from './remove-listing';
import { ArrowUpRight, MessageCircle, Smartphone } from 'lucide-react';
import {Header,Footer} from '../ui';
import {chatGPTSignInPath} from '../chatgpt-auth';
import {communityDb,listApps} from './data';
import './community.css';
import {identity,memberProfile,googleDirectory,googleWorkspace,usesGoogle} from './google-data';
export const dynamic='force-dynamic';
export const metadata={title:'App Testing Community',alternates:{canonical:'/community'}};
const endpoint='/api/community';
const hidden=(name:string,value:string)=><input type="hidden" name={name} value={value}/>;
export default async function Community({searchParams}:{searchParams:Promise<{notice?:string}>}){
 const google=usesGoogle(),user=await identity(),db=google?null:communityDb(),id=user?.userId??'';
 const [directory,member,params,signupCount]=await Promise.all([google?googleDirectory(user):listApps(id),user?memberProfile(user):null,searchParams,google?supaData<number>('rpc/community_signup_count'):null]);
 const [incoming,joined,notes]=member&&user?(google?await googleWorkspace(user):await Promise.all([
 db!.prepare("SELECT a.name,a.id AS app,m.name AS tester,r.member,r.play_email AS email,r.status FROM community_requests r JOIN community_apps a ON a.id=r.app JOIN members m ON m.id=r.member WHERE a.owner=? AND r.status IN ('pending','approved')").bind(id).all<{name:string;app:string;tester:string;member:string;email:string;status:string}>(),
 db!.prepare("SELECT a.id,a.name,a.link,a.instructions FROM community_requests r JOIN community_apps a ON a.id=r.app WHERE r.member=? AND r.status='approved'").bind(id).all<{id:string;name:string;link:string;instructions:string}>(),
 db!.prepare("SELECT f.id,a.name,m.name AS tester,f.body FROM community_feedback f JOIN community_apps a ON a.id=f.app JOIN members m ON m.id=f.member WHERE a.owner=? ORDER BY f.created DESC LIMIT 100").bind(id).all<{id:string;name:string;tester:string;body:string}>()
 ])):[null,null,null];
 const liveApps=directory.filter(app=>app.play_store_url);
 const closedTests=directory.filter(app=>!app.play_store_url);
 return <><Header session={user?{name:member?.name||user.displayName||'Member',google}:null}/><main className="wrap page-shell community-page">
 <div className="page-heading community-masthead"><div><div className="eyebrow">TESTLANE / COMMUNITY</div><h1>Find your next test.</h1><p>Explore Android apps, recruit volunteer testers, and share useful feedback.</p><div className="hero-actions"><a className="button" href="#try-apps">Try new apps</a><a className="outline-button" href="#post">Post my app</a></div></div><aside className="community-metrics" aria-label="Directory overview"><div><strong>{directory.length}</strong><span>Apps in this view</span></div>{signupCount!==null&&<div><strong>{signupCount.toLocaleString('en-US')}</strong><span>Total signups</span></div>}<div><strong>{directory.reduce((sum,app)=>sum+(app.play_store_url?0:Math.max(0,app.spots-app.approved)),0)}</strong><span>Open tester spots</span></div></aside></div>
 <nav className="community-nav" aria-label="Community sections"><a href="#try-apps">Try new apps</a><a href="#closed-tests">Closed tests</a><a href="#post">Post an app</a>{member&&<a href="#workspace">My workspace</a>}</nav>
 {typeof params.notice==='string'&&<p role="status" className="preview-banner">{params.notice.slice(0,180)}</p>}
 <div id="directory"><section id="try-apps" className="community-section">
 <div className="eyebrow">ON GOOGLE PLAY</div><h2>Try new apps</h2>
 {liveApps.length?<div className="community-grid live-app-grid">{liveApps.map(app=><article className="panel listing-card" key={app.id}>
 <div className="listing-heading"><span className="listing-icon"><Smartphone size={21} aria-hidden="true"/></span><div><div className="eyebrow">Live on Google Play</div><h3>{app.name}</h3></div></div>
 <p className="community-text">{app.description}</p>
 {google&&<a className="outline-button comments-link" href={'/community/discussion/'+app.id}><MessageCircle size={19} aria-hidden="true"/> Comments</a>}
 <div className="listing-footer"><p>Posted by <strong>{app.developer}</strong><br/>Android {app.android.replace(/^android\s+/i,'')}</p>
 <a className="outline-button" href={app.play_store_url!} target="_blank" rel="noopener noreferrer">View on Google Play <ArrowUpRight size={15} aria-hidden="true"/></a>{google&&app.owner===id&&<RemoveListing id={app.id} name={app.name}/>}</div>
 </article>)}</div>:<p>No live apps yet. <a className="text-link" href="#post">List your Play Store app</a></p>}
 </section>
 <section id="closed-tests" className="community-section"><div className="eyebrow">HELP DEVELOPERS LAUNCH</div><h2>Closed tests</h2>
 {closedTests.length===0?<div className="panel"><h3>No closed tests listed yet</h3><p>Post a closed test to request volunteer testers for free.</p><a className="outline-button" href="#post">Get my app tested</a></div>:<div className="community-grid">{closedTests.map(app=><article key={app.id} className="panel listing-card"><div className="eyebrow">{Math.max(0,app.spots-app.approved)} tester spots open</div><h3>{app.name}</h3><p className="community-text">{app.description}</p><p>{app.android} · Posted by {app.developer}</p>
 {app.owner===id?<div className="hero-actions"><span className="badge purple-badge">Your app</span>{google&&<RemoveListing id={app.id} name={app.name}/>}</div>:app.status==='approved'?<a className="outline-button" href="#workspace">Open testing instructions</a>:app.status?<span className="badge purple-badge">Request {app.status}</span>:app.approved>=app.spots?<span className="badge purple-badge">No spots left</span>:member?<form action={endpoint} method="post" className="community-form">{hidden('action','request')}{hidden('app',app.id)}<label className="field">Google Play email<input type="email" name="playEmail" required maxLength={254}/></label><p>Sending a request shares this email with the developer so they can add you in Play Console.</p><button className="button button-small">Request to test</button></form>:<a className="outline-button" href="#post">Join to request a spot</a>}
 {google&&<a className="outline-button comments-link" href={'/community/discussion/'+app.id}><MessageCircle size={19} aria-hidden="true"/> Comments</a>}
 </article>)}</div>}</section></div>
 <section id="post" className="panel">
 {!user?<><h2>Join Testlane</h2><p>Sign in to register, post an app, or request to test.</p><a className="button" target="_top" href={google?'/auth/google/start':chatGPTSignInPath('/community#post')}>Continue with {google?'Google':'ChatGPT'}</a></>:!member?<><h2>Create your member profile</h2><p>Your display name appears to other members. Your account email stays private.</p><form action={endpoint} method="post" className="community-form">{hidden('action','register')}<label className="field">Display name<input name="name" required minLength={2} maxLength={40}/></label><button className="button">Join for free</button></form></>:<>
 <h2>Post an app</h2><div className="post-options"><section className="post-option"><h3>Request closed testers</h3><p>Request volunteer testers for free. Approved testers can see your opt-in link and instructions.</p>
 <form action={endpoint} method="post" className="community-form">{hidden('action','post')}<div className="form-grid">
 <label className="field">App name<input name="name" required maxLength={80}/></label><label className="field">Tester spots<input name="spots" type="number" required min={1} max={100} defaultValue={12}/></label>
 <label className="field wide">Public description<textarea name="description" required maxLength={600}/></label><label className="field">Android requirements<input name="android" required maxLength={80} placeholder="Android 12 or later"/></label>
 <label className="field">Google Play link<input name="link" type="url" required maxLength={500} placeholder="https://play.google.com/store/apps/details?id=…" aria-describedby="play-link-help"/><small id="play-link-help">Paste a Play Store listing or closed-testing web link. Approved testers get the opt-in link. Make sure your closed test is active in Play Console.</small></label><label className="field wide">Private testing instructions<textarea name="instructions" required maxLength={1500} placeholder="Which flows should testers try?"/></label>
 </div><button className="button">Publish closed test</button></form></section>
 {google&&<section className="post-option"><h3>List an app already live on Google Play</h3><p>Share your public listing so visitors can open Google Play and install your app.</p>
 <form action={endpoint} method="post" className="community-form">{hidden('action','post-live')}<div className="form-grid">
 <label className="field">App name<input name="name" required maxLength={80}/></label>
 <label className="field">Android requirements<input name="android" required maxLength={80} placeholder="Android 12 or later"/></label>
 <label className="field wide">Public description<textarea name="description" required maxLength={600}/></label>
 <label className="field wide">Official Play Store app link<input name="link" type="url" required maxLength={500} placeholder="https://play.google.com/store/apps/details?id=…" /></label>
 </div><button className="button">Publish Play Store listing</button></form></section>}</div>
 </>}</section>
 {member&&<section id="workspace" className="community-section"><div className="eyebrow">MEMBER WORKSPACE</div><h2>Hi, {member.name}.</h2><div className="community-grid">
 <section className="panel"><h3>Incoming tester requests</h3>{!incoming?.results.length&&<p>No tester requests yet.</p>}{incoming?.results.map(r=><form className="community-form community-record" key={r.app+r.member} action={endpoint} method="post">{hidden('app',r.app)}{hidden('member',r.member)}<p><strong>{r.tester}</strong> · {r.name} · {r.status}<br/>{r.email}</p>{r.status==='pending'&&<div className="hero-actions"><button className="button button-small" name="action" value="approve">Approve</button><button className="outline-button" name="action" value="decline">Decline</button></div>}</form>)}</section>
 <section className="panel"><h3>Apps you're testing</h3>{!joined?.results.length&&<p>Approved tests will appear here.</p>}{joined?.results.map(a=><article className="community-record" key={a.id}><h3>{a.name}</h3><p className="community-text">{a.instructions}</p><a className="text-link" href={a.link} target="_blank" rel="noopener noreferrer">Open Google Play opt-in ↗</a><form className="community-form" action={endpoint} method="post">{hidden('action','feedback')}{hidden('app',a.id)}<label className="field">Send feedback<textarea required minLength={5} maxLength={2000} name="body" placeholder="What happened? What did you expect?"/></label><button className="button button-small">Send feedback</button></form></article>)}</section>
 <section className="panel"><h3>Feedback on your apps</h3>{!notes?.results.length&&<p>No feedback yet.</p>}{notes?.results.map(n=><article className="community-record" key={n.id}><strong>{n.name} · {n.tester}</strong><p className="community-text">{n.body}</p></article>)}</section>
 </div></section>}
 </main><Footer/></>;
}
