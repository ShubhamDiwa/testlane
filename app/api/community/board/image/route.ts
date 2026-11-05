import {Buffer} from 'node:buffer';
import {params, supaData} from '../../../../../lib/community-supabase';

export async function GET(request: Request) {
  const post = new URL(request.url).searchParams.get('post') ?? '';
  if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(post)) return new Response(null, {status: 404});
  const [row] = await supaData<{image_data: string | null}[]>('community_posts?' + params({
    id: 'eq.' + post, select: 'image_data', limit: '1',
  }));
  const image = row?.image_data?.match(/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!image) return new Response(null, {status: 404});
  return new Response(new Uint8Array(Buffer.from(image[2], 'base64')), {headers: {
    'Content-Type': image[1],
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'public, max-age=3600',
  }});
}
