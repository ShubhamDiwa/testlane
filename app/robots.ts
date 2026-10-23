import type {MetadataRoute} from 'next';
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:'*',allow:'/',disallow:['/dashboard','/admin','/login','/auth/','/api/']},sitemap:(process.env.NEXT_PUBLIC_SITE_URL||'https://testlane-closed-testing.woodsyfield32.chatgpt.site')+'/sitemap.xml'}}
