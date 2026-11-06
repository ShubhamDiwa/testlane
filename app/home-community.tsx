import {googleConfig, supaData} from '../lib/community-supabase';

type Post = {id: string; title: string; body: string; author_name: string; comment_count: number; vote_count: number};

export default async function HomeCommunity() {
  const posts = googleConfig()
    ? await supaData<Post[]>('community_post_feed?select=id,title,body,author_name,comment_count,vote_count&order=created_at.desc,id.desc&limit=3').catch(() => null)
    : null;

  return <section id="community" className="section wrap">
    <div className="section-top">
      <h2>Latest community posts</h2>
      <a className="text-link" href="/community/board">View Community Board →</a>
    </div>
    {posts?.length ? <div className="home-community-grid">
      {posts.map(post => <article className="panel home-community-post" key={post.id}>
        <p className="eyebrow">{post.author_name}</p>
        <h3><a href={'/community/board?post='+post.id}>{post.title}</a></h3>
        <p>{post.body.length > 180 ? post.body.slice(0,180)+'…' : post.body}</p>
        <a className="text-link" href={'/community/board?post='+post.id+'#comments'}>
          {post.comment_count} {post.comment_count === 1 ? 'reply' : 'replies'} · {post.vote_count} helpful
        </a>
      </article>)}
      <article className="panel home-community-post">
        <h3>Start a discussion</h3><p>Share a test, ask a question, or show what you fixed.</p>
        <a className="text-link" href="/community/board?compose=1#new-post">+ New post</a>
      </article>
    </div> : <p>{posts ? 'No posts yet. Start a conversation on the Community Board.' : 'Visit the Community Board to browse posts.'}</p>}
  </section>;
}
