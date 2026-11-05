'use client';

export function DeletePost({id, title}: {id: string; title: string}) {
  return <form action="/api/community/board" method="post" onSubmit={event => {
    if (!window.confirm('Permanently delete “' + title + '” and its comments?')) event.preventDefault();
  }}>
    <input type="hidden" name="post" value={id}/>
    <button className="outline-button" name="action" value="delete-post" aria-label={'Delete ' + title}>Delete</button>
  </form>;
}
