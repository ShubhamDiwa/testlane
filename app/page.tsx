import { ArrowRight, Check, CheckCheck, ShieldCheck, MessageSquareText, Activity, ArrowUpRight, Smartphone, Clock3, Bug, Users } from 'lucide-react';
import { Header, Footer } from './ui';
import { FAQ } from './faq';
import TestingAnimation from './testing-animation';
import MotionEnhancements from './motion-enhancements';
import './premium.css';

export default function Home() {
  return <><Header/><main><MotionEnhancements/>
    <section className="hero wrap">
      <div className="hero-copy"><div className="eyebrow"><span className="status-dot"/> FREE ANDROID TESTING COMMUNITY</div>
        <h1>Discover apps.<br/>Share feedback.<br/><span className="purple">Launch together.</span><span className="headline-spark">✳</span></h1>
        <p className="hero-description">Post your Android app for free or try something new and share feedback. Join with one account and do either.</p>
        <div className="hero-actions"><a className="button" href="/community#post">Get my app tested <ArrowUpRight size={18}/></a><a className="text-link" href="/community#directory">Try new apps <ArrowRight size={17}/></a></div>
        <div className="hero-assurances"><span><Check size={15}/> Real Android users</span><span><Check size={15}/> No Play Console password needed</span></div>
      </div>
      <TestingAnimation/>
    </section>
    <section className="facts-strip"><div className="wrap facts-inner"><span className="facts-intro">Your code deserves<br/><b>a proper test drive.</b></span><div><Users/><span><strong>Free to join</strong><small>Recruit volunteer testers</small></span></div><div><Clock3/><span><strong>Closed testing</strong><small>Set your own testing goals</small></span></div><div><MessageSquareText/><span><strong>Useful feedback</strong><small>Find friction before your users do</small></span></div></div></section>
    <section id="how-it-works" className="section wrap"><div className="section-top"><div><div className="eyebrow">LESS CHASING. MORE BUILDING.</div><h2>From “almost ready”<br/>to ready for the next step.</h2></div><p>You focus on improving your app.<br/>Find volunteers and coordinate testing together.</p></div>
      <div className="steps-grid">{[
        ['01',<Smartphone key="a"/>, 'Tell us about your app', 'Share your closed-testing link, target users, and the workflows you want tested. Your Play Console stays yours.'],
        ['02',<Users key="b"/>, 'Meet your test group', 'Approve volunteer requests and add your testers in Play Console.'],
        ['03',<Bug key="c"/>, 'Test, learn, improve', 'Follow progress, review structured feedback, and make improvements throughout the test.'],
        ['04',<ArrowUpRight key="d"/>, 'Take your next step', 'Use your testing summary to prepare an honest production-access application in Play Console.']
      ].map(([n,icon,title,copy])=><article className="step" key={String(n)}><div className="step-top"><span>{n}</span>{icon}</div><h3>{title}</h3><p>{copy}</p></article>)}</div>
    </section>
    <section className="benefits-section"><div className="wrap benefits-grid"><div className="benefit-visual"><div className="mini-label"><span className="status-dot"/> THE FEEDBACK LOOP</div><div className="issue-card"><div className="issue-head"><span className="bug-icon"><Bug size={20}/></span><span className="badge amber">Usability</span></div><h3>A fresh pair of eyes<br/>changes everything.</h3><p>“The save button is hidden behind the keyboard on a smaller screen.”</p><div className="issue-device"><Smartphone size={15}/> Example feedback · Android device</div><div className="issue-resolution"><CheckCheck size={17}/> Find it before launch.</div></div><span className="decor-cross">✳</span></div><div className="benefit-copy"><div className="eyebrow">MORE THAN AN INSTALL COUNT</div><h2>Real testing.<br/>A clearer path forward.</h2><p>A closed test should teach you something about your app. Every part of Testlane is designed to make that learning easier.</p><ul className="feature-list"><li><ShieldCheck/><div><b>Your account stays yours</b><span>Share a testing link, never your Google password.</span></div></li><li><MessageSquareText/><div><b>Feedback you can act on</b><span>Clear descriptions, device details, and reproduction steps.</span></div></li><li><Activity/><div><b>Progress without the guesswork</b><span>See the timeline, reported activity, and next steps in one place.</span></div></li></ul><a href="/community#workspace" className="text-link">Open the community workspace <ArrowRight size={17}/></a></div></div></section>
    <section id="apps" className="section wrap"><div className="eyebrow">TEST TOGETHER</div><h2>Find your next app.</h2><p>Browse Android apps looking for volunteer testers. Anyone can browse; join for free to post or request a spot.</p><a className="button" href="/community#directory">Browse the app directory <ArrowUpRight size={18}/></a></section>
    <section id="faq" className="section faq-section wrap"><div className="section-top"><div><div className="eyebrow">A FEW THINGS, EXPLAINED</div><h2>Before you hit launch.</h2></div><a className="text-link" href="/guides/google-play-closed-testing">Read the testing guide <ArrowUpRight size={17}/></a></div><FAQ/></section>
    <section className="wrap"><div className="final-cta"><div className="cta-star">✳</div><div><div className="eyebrow">YOU'VE DONE THE BUILDING.</div><h2>Let's make room for the testing.</h2><p>Try a new app or share yours with the community.</p></div><a className="button light-button" href="/community#post">Join Testlane <ArrowUpRight size={18}/></a></div></section>
  </main><Footer/></>;
}
