import {Header, Footer} from '../../ui';
import {googleConfig, googleUser, params, supaData} from '../../../lib/community-supabase';
import {memberProfile} from '../google-data';
import '../community.css';

export const dynamic = 'force-dynamic';
export const metadata = {title: 'Community Board'};
const board = '/community/board';
const endpoint = '/api/community/board';
const categories = [
  ['web-test', 'Web testing'],
  ['ui', 'UI critique & appreciation'],
  ['code', 'Coding questions & review'],
  ['fixed', 'Tested & fixed'],
] as const;
const notices = new Map([
  ['posted', 'Your post is live.'],
  ['invalid-post', 'Choose a post type and check the title and description lengths.'],
  ['invalid-link', 'Enter a public HTTP or HTTPS test link without login credentials.'],
  ['invalid-comment', 'Comments must be 2 to 2,000 characters.'],
  ['failed', 'That action could not be saved. Please try again.'],
]);
type Post = {
  id: string; kind: string; title: string; body: string; test_url: string | null;
  author_name: string; vote_count: number; comment_count: number;
};
type Comment = {id: string; body: string; community_members: {name: string}};

export default async function CommunityBoard({searchParams}: {
  searchParams: Promise<{kind?: string; post?: string; notice?: string}>;
}) {
  const query = await searchParams;
  const enabled = Boolean(googleConfig());
  const user = enabled ? await googleUser() : null;
  const member = user ? await memberProfile(user) : null;
  const selected = categories.find(([id]) => id === query.kind)?.[0];
  const post = typeof query.post === 'string' && /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(query.post)
    ? query.post : undefined;
  const filters: Record<string,string> = {order: 'created_at.desc,id.desc', limit: '50'};
  if (post) filters.id = 'eq.' + post;
  else if (query.kind === 'unanswered') { filters.kind = 'eq.code'; filters.comment_count = 'eq.0'; }
  else if (selected) filters.kind = 'eq.' + selected;

  const [posts, votes, comments] = enabled ? await Promise.all([
    supaData<Post[]>('community_post_feed?' + params(filters), user?.token),
    member ? supaData<{post: string}[]>('community_post_votes?select=post', user?.token) : [],
    post ? supaData<Comment[]>('community_post_comments?' + params({
      post: 'eq.' + post, select: 'id,body,community_members(name)', order: 'created_at.asc,id.asc', limit: '100',
    }), user?.token) : [],
  ]) : [[], [], []];
  const voted = new Set(votes.map(vote => vote.post));
  const notice = notices.get(query.notice ?? '');

  return <><Header session={user ? {name: member?.name || user.displayName || 'Member', google: true} : null}/>
    <main className="wrap page-shell community-page">
      <div className="page-heading"><h1>Community Board</h1>
        <p>Get feedback from real people. Share a design, ask a coding question, or give someone a task to try on your website.</p>
        <a className="text-link" href={post ? board : '/community'}>{post ? 'Back to the board' : 'Back to app testing'}</a>
      </div>
      {notice && <p role="status" className="preview-banner">{notice}</p>}
      {!post && <nav className="community-nav" aria-label="Post filters">
        <a href={board} aria-current={!selected && query.kind !== 'unanswered' ? 'true' : undefined}>All posts</a>
        {categories.map(([id, name]) => <a key={id} href={board+'?kind='+id} aria-current={selected === id ? 'true' : undefined}>{name}</a>)}
        <a href={board+'?kind=unanswered'} aria-current={query.kind === 'unanswered' ? 'true' : undefined}>Needs an answer</a>
      </nav>}
      {!post && member && <details className="panel">
        <summary>Create a post</summary>
        <form action={endpoint} method="post" className="community-form">
          <input type="hidden" name="action" value="post"/>
          <label className="field">Post type<select name="kind" defaultValue={selected ?? 'web-test'}>{categories.map(([id, name]) => <option value={id} key={id}>{name}</option>)}</select></label>
          <label className="field">Title<input name="title" required minLength={5} maxLength={120}/></label>
          <label className="field">Details<textarea name="body" required minLength={10} maxLength={4000} rows={5} placeholder="For web testing, include one task and what you want people to pay attention to."/></label>
          <label className="field">Test link (required for web testing)<input type="url" name="test_url" maxLength={2048} placeholder="https://example.com"/></label>
          <button className="button">Publish post</button>
        </form>
      </details>}
      {!member && enabled && <p><a className="text-link" href="/community#post">Join Testlane to post, comment or vote</a></p>}
      {!enabled && <p>The board is available on the Google sign-in deployment.</p>}
      <section className="community-section" aria-label={post ? 'Post' : 'Post feed'}>
        {!posts.length && enabled && <p>{post ? 'Post not found.' : 'No posts in this view yet.'}</p>}
        {posts.map(item => <article key={item.id} className="panel community-record">
          <div className="eyebrow">{categories.find(([id]) => id === item.kind)?.[1]} · {item.author_name}</div>
          <h2><a href={board+'?post='+item.id}>{item.title}</a></h2>
          <p className="community-text" style={{overflowWrap: 'anywhere'}}>{post ? item.body : item.body.slice(0, 360) + (item.body.length > 360 ? '…' : '')}</p>
          {item.test_url && /^https?:\/\//i.test(item.test_url) && <p><a className="text-link" href={item.test_url} target="_blank" rel="noopener noreferrer nofollow ugc">Open website to test ↗</a></p>}
          <div className="hero-actions">
            {member ? <form action={endpoint} method="post">
              <input type="hidden" name="post" value={item.id}/>
              <button className="outline-button" name="action" value={voted.has(item.id) ? 'remove-vote' : 'helpful'} aria-pressed={voted.has(item.id)}>Helpful · {item.vote_count}</button>
            </form> : <span>Helpful · {item.vote_count}</span>}
            <a className="outline-button" href={board+'?post='+item.id+'#comments'}>Comments · {item.comment_count}</a>
          </div>
        </article>)}
      </section>
      {post && posts.length > 0 && <section id="comments" className="community-section panel">
        <h2>Comments</h2>
        {!comments.length && <p>No comments yet.</p>}
        {comments.map(comment => <article className="community-record" key={comment.id}>
          <strong>{comment.community_members.name}</strong><p className="community-text" style={{overflowWrap: 'anywhere'}}>{comment.body}</p>
        </article>)}
        {member && <form action={endpoint} method="post" className="community-form">
          <input type="hidden" name="action" value="comment"/><input type="hidden" name="post" value={post}/>
          <label className="field">Your comment<textarea name="body" required minLength={2} maxLength={2000} placeholder="For testing feedback, tell us your device, what you tried and what happened."/></label>
          <button className="button">Post comment</button>
        </form>}
      </section>}
    </main><Footer/></>;
}
