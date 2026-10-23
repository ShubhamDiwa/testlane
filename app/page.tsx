import Link from 'next/link';
import { ArrowRight, Check, CheckCheck, ShieldCheck, MessageSquareText, MousePointer2, Activity, ArrowUpRight, Smartphone, Clock3, Bug, Users, Sparkles } from 'lucide-react';
import { Header, Footer, Brand } from './ui';
import { FAQ } from './faq';

export default function Home() {
  return <><Header/><main>
    <section className="hero wrap">
      <div className="hero-copy"><div className="eyebrow"><span className="status-dot"/> BUILT FOR INDEPENDENT DEVELOPERS</div>
        <h1>You built the app.<br/>We'll bring<br/><span className="purple">the testers.</span><span className="headline-spark">✳</span></h1>
        <p className="hero-description">12 real testers. 14 days of closed testing. Meaningful feedback. Get your Android app one step closer to launch.</p>
        <div className="hero-actions"><Link className="button" href="/start">Start your closed test <ArrowUpRight size={18}/></Link><a className="text-link" href="#how-it-works">See how it works <ArrowRight size={17}/></a></div>
        <div className="hero-assurances"><span><Check size={15}/> Real Android users</span><span><Check size={15}/> No Play Console password needed</span></div>
      </div>
      <div className="hero-art" aria-label="Illustrative preview of a closed testing dashboard">
        <div className="art-grid"/><div className="orbit orbit-one"/><div className="orbit orbit-two"/>
        <div className="art-label"><span className="status-dot"/> YOUR NEXT LAUNCH, IN MOTION</div>
        <div className="floating-note"><span className="note-icon"><CheckCheck size={18}/></span><div><b>Small team. Big next step.</b><span>Built around your launch.</span></div><Sparkles size={17}/></div>
        <div className="preview-window"><div className="window-top"><Brand small/><span className="sample-tag">SAMPLE PROJECT</span></div>
          <div className="preview-project"><span className="app-icon"><Activity size={24}/></span><div><b>Habit Garden</b><small>Android · Closed testing</small></div><span className="badge green">In progress</span></div>
          <div className="preview-stats"><div><small>Testers enrolled</small><strong>12<span>/12</span></strong><span className="tiny-green"><Check size={12}/> Test group ready</span></div><div><small>Testing progress</small><strong>08<span>/14 days</span></strong><span className="muted tiny">Illustrative timeline</span></div></div>
          <div className="day-bars">{Array.from({length:14},(_,i)=><i key={i} className={i<8?'filled':''}/>)}</div>
          <div className="preview-bottom"><div className="avatars">{['JD','AM','SK','RL'].map((s,i)=><span className={'avatar avatar-'+i} key={s}>{s}</span>)}<span className="avatar extra">+8</span></div><span><span className="status-dot"/> Real people, real feedback</span></div>
        </div>
        <div className="feedback-float"><span className="feedback-icon"><MessageSquareText size={18}/></span><div><b>Feedback that moves you forward</b><span>Reproduce it. Fix it. Retest it.</span></div></div>
        <div className="art-caption"><span>12 PEOPLE. ONE STEP CLOSER.</span><MousePointer2 size={18}/></div>
      </div>
    </section>
    <section className="facts-strip"><div className="wrap facts-inner"><span className="facts-intro">Your code deserves<br/><b>a proper test drive.</b></span><div><Users/><span><strong>12 real testers</strong><small>A dedicated closed-test group</small></span></div><div><Clock3/><span><strong>14 continuous days</strong><small>A clear, coordinated test period</small></span></div><div><MessageSquareText/><span><strong>Useful feedback</strong><small>Find friction before your users do</small></span></div></div></section>
    <section id="how-it-works" className="section wrap"><div className="section-top"><div><div className="eyebrow">LESS CHASING. MORE BUILDING.</div><h2>From “almost ready”<br/>to ready for the next step.</h2></div><p>You focus on improving your app.<br/>We help coordinate the people testing it.</p></div>
      <div className="steps-grid">{[
        ['01',<Smartphone key="a"/>, 'Tell us about your app', 'Share your closed-testing link, target users, and the workflows you want tested. Your Play Console stays yours.'],
        ['02',<Users key="b"/>, 'Meet your test group', 'We coordinate your tester group and confirm setup before the testing period begins.'],
        ['03',<Bug key="c"/>, 'Test, learn, improve', 'Follow progress, review structured feedback, and make improvements throughout the test.'],
        ['04',<ArrowUpRight key="d"/>, 'Take your next step', 'Use your testing summary to prepare an honest production-access application in Play Console.']
      ].map(([n,icon,title,copy])=><article className="step" key={String(n)}><div className="step-top"><span>{n}</span>{icon}</div><h3>{title}</h3><p>{copy}</p></article>)}</div>
    </section>
    <section className="benefits-section"><div className="wrap benefits-grid"><div className="benefit-visual"><div className="mini-label"><span className="status-dot"/> THE FEEDBACK LOOP</div><div className="issue-card"><div className="issue-head"><span className="bug-icon"><Bug size={20}/></span><span className="badge amber">Usability</span></div><h3>A fresh pair of eyes<br/>changes everything.</h3><p>“The save button is hidden behind the keyboard on a smaller screen.”</p><div className="issue-device"><Smartphone size={15}/> Example feedback · Android device</div><div className="issue-resolution"><CheckCheck size={17}/> Find it before launch.</div></div><span className="decor-cross">✳</span></div><div className="benefit-copy"><div className="eyebrow">MORE THAN AN INSTALL COUNT</div><h2>Real testing.<br/>A clearer path forward.</h2><p>A closed test should teach you something about your app. Every part of Testlane is designed to make that learning easier.</p><ul className="feature-list"><li><ShieldCheck/><div><b>Your account stays yours</b><span>Share a testing link, never your Google password.</span></div></li><li><MessageSquareText/><div><b>Feedback you can act on</b><span>Clear descriptions, device details, and reproduction steps.</span></div></li><li><Activity/><div><b>Progress without the guesswork</b><span>See the timeline, reported activity, and next steps in one place.</span></div></li></ul><Link href="/dashboard" className="text-link">Explore the sample dashboard <ArrowRight size={17}/></Link></div></div></section>
    <section id="pricing" className="section wrap pricing-section"><div className="pricing-copy"><div className="eyebrow">ONE APP. ONE FOCUSED TEST.</div><h2>A small step<br/>for your next<br/><span className="purple">big launch.</span></h2><p>A straightforward closed-testing package for independent Android developers.</p><div className="quiet-note"><ShieldCheck size={20}/><span>We support your testing process. Google makes the final production-access decision.</span></div></div><div className="pricing-card"><div className="price-heading"><span className="package-icon"><Smartphone size={23}/></span><span className="badge purple-badge">FOUNDING PACKAGE</span></div><h3>Launch essentials</h3><p>Everything to get your closed test moving.</p><div className="price"><strong>12 testers.</strong><span>14 days. One focused test.</span></div><ul className="check-list">{['Real Android testers for one app','Coordinated closed-testing setup','14-day testing timeline','Structured bug and usability feedback','Progress dashboard and final summary'].map(t=><li key={t}><Check size={17}/>{t}</li>)}</ul><Link href="/start" className="button full">Request your test <ArrowUpRight size={18}/></Link><p className="pricing-footnote">Pricing is being finalized. No payment is collected in this preview.</p></div></section>
    <section id="faq" className="section faq-section wrap"><div className="section-top"><div><div className="eyebrow">A FEW THINGS, EXPLAINED</div><h2>Before you hit launch.</h2></div><a className="text-link" href="/guides/google-play-closed-testing">Read the testing guide <ArrowUpRight size={17}/></a></div><FAQ/></section>
    <section className="wrap"><div className="final-cta"><div className="cta-star">✳</div><div><div className="eyebrow">YOU'VE DONE THE BUILDING.</div><h2>Let's make room for the testing.</h2><p>Your next launch starts with a fresh pair of eyes. Or twelve.</p></div><Link className="button light-button" href="/start">Get your app ready <ArrowUpRight size={18}/></Link></div></section>
  </main><Footer/></>;
}
