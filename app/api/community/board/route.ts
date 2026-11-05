import {NextResponse} from 'next/server';
import {googleUser, supaData, supaFetch} from '../../../../lib/community-supabase';
import {memberProfile} from '../../../community/google-data';

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  if (request.headers.get('origin') !== origin) return new Response(null, {status: 403});
  const user = await googleUser();
  if (!user || !await memberProfile(user)) {
    return NextResponse.redirect(new URL('/community#post', origin), 303);
  }

  const form = await request.formData();
  const field = (name: string) => String(form.get(name) ?? '').trim();
  const action = field('action');
  const post = field('post');
  const target = new URL('/community/board', origin);
  const finish = (notice: string) => {
    if (notice) target.searchParams.set('notice', notice);
    return NextResponse.redirect(target, 303);
  };

  try {
    if (action === 'post') {
      const kind = field('kind'), title = field('title'), body = field('body');
      if (!['web-test', 'ui', 'code', 'fixed'].includes(kind) ||
          title.length < 5 || title.length > 120 || body.length < 10 || body.length > 4000) {
        return finish('invalid-post');
      }
      let testUrl = null;
      if (kind === 'web-test') {
        const url = URL.parse(field('test_url'));
        if (!url || !['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.href.length > 2048) {
          return finish('invalid-link');
        }
        testUrl = url.href;
      }
      await supaData('community_posts', user.token, {kind, title, body, test_url: testUrl});
      return finish('posted');
    }

    if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(post)) return finish('failed');
    target.searchParams.set('post', post);
    if (action === 'comment') {
      const body = field('body');
      if (body.length < 2 || body.length > 2000) return finish('invalid-comment');
      await supaData('community_post_comments', user.token, {post, body});
      return finish('');
    }

    if (action === 'helpful' || action === 'remove-vote') {
      const response = action === 'helpful'
        ? await supaFetch('/rest/v1/community_post_votes?on_conflict=post,member', user.token, {
            method: 'POST', headers: {Prefer: 'resolution=ignore-duplicates'}, body: JSON.stringify({post}),
          })
        : await supaFetch('/rest/v1/community_post_votes?post=eq.' + post, user.token, {method: 'DELETE'});
      return finish(response.ok ? '' : 'failed');
    }
    return finish('failed');
  } catch {
    return finish('failed');
  }
}
