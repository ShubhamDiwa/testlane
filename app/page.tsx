import {TestingStory, TestingTimeline} from './home-testing-story';
import './home-testing-story.css';
import HomeCommunity from './home-community';
import { ArrowRight, Check, ShieldCheck, MessageSquareText, ArrowUpRight, Smartphone, Clock3, Users } from 'lucide-react';
import { Header, Footer } from './ui';
import { FAQ } from './faq';
import TestingAnimation from './testing-animation';
import './premium.css';
import './future.css';

export default function Home() {
  return <><Header/><main className="home-redesign">
    <div className="launch-hero"><section className="hero wrap">
      <div className="hero-copy"><div className="eyebrow"><span className="status-dot"/> A FREE COMMUNITY FOR DEVELOPERS &amp; TESTERS</div>
        <h1>Better apps.<br/><span className="purple">Built together.</span></h1>
        <p className="hero-description">Try an app from the community today. When you are ready to launch, share yours and get feedback from people who know what it takes to build.</p>
        <div className="hero-actions"><a className="button" href="/community#post">Get my app tested <ArrowUpRight size={18}/></a><a className="text-link" href="/community#try-apps">Try new apps <ArrowRight size={17}/></a><a className="text-link" href="/community/board">Community Board <ArrowRight size={17}/></a></div>
        <div className="hero-assurances"><span><Check size={15}/> Real Android users</span><span><Check size={15}/> No Play Console password needed</span></div>
      </div>
      <TestingAnimation/>
    </section></div>
    <section className="facts-strip"><div className="wrap facts-inner"><span className="facts-intro">Small acts of feedback.<br/><b>Better apps for everyone.</b></span><div><Users/><span><strong>Free to join</strong><small>Recruit volunteer testers</small></span></div><div><Clock3/><span><strong>Closed testing</strong><small>Set your own testing goals</small></span></div><div><MessageSquareText/><span><strong>Useful feedback</strong><small>Find friction before your users do</small></span></div></div></section>
    <HomeCommunity/>
    <TestingStory/>
    <section className="section wrap">
      <div className="eyebrow">THE FEEDBACK LOOP · DEMO</div><h2>Real testing. A clearer path forward.</h2>
      <div className="home-testing-bento">
        <article className="panel"><div className="test-progress">11 / 12</div><h3>Testing progress</h3><p>Example of a test group taking shape.</p></article>
        <article className="panel"><div className="eyebrow">USABILITY · ANDROID</div><h3>The keyboard hides Save.</h3><p>“The save button is hidden behind the keyboard on a smaller screen.”</p></article>
        <article className="panel"><Users aria-hidden="true"/><h3>Fresh eyes on your app</h3><p>Share a build with volunteers and ask them to try a specific task.</p></article>
        <article className="panel wide"><ShieldCheck aria-hidden="true"/><h3>Your account stays yours.</h3><p>Manage tester access in Play Console and share the opt-in link with approved volunteers.</p></article>
      </div>
    </section>
    <TestingTimeline/>
    <section id="apps" className="section wrap choose-lane"><div className="eyebrow">FIND YOUR LANE</div><h2>Two ways to get involved.</h2><div className="lane-grid"><article className="lane-card developer-lane"><div className="lane-icon"><Smartphone size={24}/></div><div className="eyebrow">FOR DEVELOPERS</div><h3>Put your app in real hands.</h3><p>Post a closed test, approve volunteers, and learn where users get stuck.</p><a className="button" href="/community#post">Post an app <ArrowUpRight size={17}/></a></article><article className="lane-card tester-lane"><div className="lane-icon"><Users size={24}/></div><div className="eyebrow">FOR TESTERS</div><h3>Try what’s being built.</h3><p>Browse Android apps, request a testing spot, and share what worked and what didn’t.</p><a className="button" href="/community#directory">Explore the directory <ArrowUpRight size={17}/></a></article></div></section>
    <section id="faq" className="section faq-section wrap"><div className="section-top"><div><div className="eyebrow">A FEW THINGS, EXPLAINED</div><h2>Before you hit launch.</h2></div><a className="text-link" href="/guides/google-play-closed-testing">Read the testing guide <ArrowUpRight size={17}/></a></div><FAQ/></section>
    <section className="wrap"><div className="final-cta"><div className="cta-star">✳</div><div><div className="eyebrow">YOU'VE DONE THE BUILDING.</div><h2>Let's make room for the testing.</h2><p>Try a new app or share yours with the community.</p></div><a className="button light-button" href="/community#post">Join Testlane <ArrowUpRight size={18}/></a></div></section>
  </main><Footer/></>;
}
