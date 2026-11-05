import { ArrowUpRight, Layers2, UserRound } from 'lucide-react';
import { identity, memberProfile, usesGoogle } from './community/google-data';
import { chatGPTSignOutPath } from './chatgpt-auth';
import { ThemeToggle } from './site-theme';
export function Brand({small=false}:{small?:boolean}) {return <a href="/" className={'brand '+(small?'brand-small':'')} aria-label="Testlane home"><span className="brand-mark"><Layers2 size={small?15:21}/></span>testlane<span className="brand-period">.</span></a>}
export async function Header({ session }: { session?: { name: string; google: boolean } | null } = {}) {
  if (session === undefined) {
    const google = usesGoogle();
    const user = await identity().catch(() => null);
    if (user) {
      const member = await memberProfile(user).catch(() => null);
      session = { name: member?.name || user.displayName || 'Member', google };
    }
  }
  return <header className="header"><div className="wrap header-inner">
    <Brand/>
    <nav aria-label="Main navigation"><a href="/#how-it-works">How it works</a><a href="/community#directory">App directory</a><a href="/#faq">FAQs</a></nav>
    <div className="header-actions">
      <ThemeToggle/>
      {session ? <>
        <a href="/community#post" className="header-profile" title={session.name}>
          <span className="profile-icon"><UserRound size={17} aria-hidden="true"/></span>
          <span className="profile-name">{session.name}</span>
        </a>
        {session.google
          ? <form action="/auth/google/logout" method="post"><button className="header-logout" type="submit">Log out</button></form>
          : <a className="header-logout" href={chatGPTSignOutPath('/')}>Log out</a>}
      </> : <>
        <a href="/login" className="login-link">Sign in</a>
        <a href="/signup" className="button button-small">Join free <ArrowUpRight size={16}/></a>
      </>}
    </div>
  </div></header>;
}
export function Footer(){return <footer className="footer wrap"><div className="footer-top"><div><Brand/><p>A little testing.<br/>A better launch.</p></div><div className="footer-links"><div><b>Explore</b><a href="/#how-it-works">How it works</a><a href="/community#directory">App directory</a><a href="/community#workspace">Member workspace</a></div><div><b>Resources</b><a href="/guides/google-play-closed-testing">Closed-testing guide</a><a href="/#faq">FAQs</a><a href="/policies">Privacy & service terms</a></div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Testlane. Built for your next step.</span><span>Independent service. Not affiliated with Google.</span></div></footer>}
