import {notFound} from 'next/navigation';
import {Header, Footer} from '../../../ui';
import {params, supaData} from '../../../../lib/community-supabase';
import {identity, memberProfile, usesGoogle} from '../../google-data';

export const dynamic = 'force-dynamic';
export const metadata = {title: 'App comments', robots: {index: false}};

type Comment = {
 id: string;
 body: string;
 created_at: string;
 community_members: {name: string};
};

export default async function Discussion({params: route, searchParams}: {
 params: Promise<{id: string}>;
 searchParams: Promise<{notice?: string}>;
}) {
 const {id} = await route;
 if (!usesGoogle() || !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id)) notFound();
 const [apps, comments, user, query] = await Promise.all([
  supaData<{name: string}[]>('community_apps?' + params({select:'name', id:'eq.'+id})),
  supaData<Comment[]>('community_comments?' + params({select:'id,body,created_at,community_members(name)', app:'eq.'+id, order:'created_at.desc,id.desc', limit:'50'})),
  identity(),
  searchParams,
 ]);
 if (!apps[0]) notFound();
 const member = user ? await memberProfile(user) : null;
 return <><Header session={user?{name:member?.name||user.displayName||'Member',google:true}:null}/>
 <main className="wrap page-shell community-page"><article className="panel prose">
 <a className="text-link" href="/community#directory">← App directory</a>
 <h1>{apps[0].name}</h1><h2>Comments</h2>
 {query.notice === 'sent' && <p role="status">Your comment was posted.</p>}
 {query.notice === 'error' && <p role="status">Could not post your comment. Enter 2–1,000 characters and try again.</p>}
 {member ? <form action="/api/community" method="post" className="community-form">
 <input type="hidden" name="action" value="comment"/><input type="hidden" name="app" value={id}/>
 <label className="field">Public comment<textarea name="body" required minLength={2} maxLength={1000}/></label>
 <button className="button" type="submit">Post comment</button>
 </form> : <p><a href={user?'/community#post':'/login'}>{user?'Create your member profile':'Sign in'}</a> to comment.</p>}
 <section aria-label="Recent comments"><h2>Recent comments</h2>
 {comments.length === 0 && <p>No comments yet.</p>}
 {comments.map(comment => <article key={comment.id} className="community-record">
 <strong>{comment.community_members.name}</strong><p className="community-text">{comment.body}</p>
 </article>)}
 </section></article></main><Footer/></>;
}
