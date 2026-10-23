import type {MetadataRoute} from 'next';
export default function sitemap():MetadataRoute.Sitemap{const root=process.env.NEXT_PUBLIC_SITE_URL||'https://testlane-closed-testing.woodsyfield32.chatgpt.site';return ['','/start','/guides/google-play-closed-testing'].map(p=>({url:root+p,changeFrequency:'monthly',priority:p?0.7:1}))}
