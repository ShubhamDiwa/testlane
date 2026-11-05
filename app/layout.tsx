import MotionEnhancements from './motion-enhancements';
import type { Metadata } from 'next';
import './globals.css';
import './redesign.css';
import './site-theme.css';
import { SiteTheme } from './site-theme';
const origin=process.env.NEXT_PUBLIC_SITE_URL||'https://testlane-closed-testing.woodsyfield32.chatgpt.site';
export const metadata:Metadata={metadataBase:new URL(origin),title:{default:'Testlane — Free Android App Testing Community',template:'%s | Testlane'},description:'Find Android apps to try, recruit volunteer testers, and share feedback for free.',alternates:{canonical:'/'},openGraph:{type:'website',siteName:'Testlane',title:'Discover apps. Share feedback. Launch together.',description:'Join the free Android app testing community.',url:'/'},twitter:{card:'summary_large_image'},icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><body><SiteTheme><MotionEnhancements/><a href="#main-content" className="skip-link">Skip to content</a><div id="main-content">{children}</div></SiteTheme></body></html>}
