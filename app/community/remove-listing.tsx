'use client';

export function RemoveListing({ id, name }: { id: string; name: string }) {
  return <form action="/api/community" method="post"
    onSubmit={event => {
      if (!window.confirm(`Remove “${name}” from Testlane?`)) event.preventDefault();
    }}>
    <input type="hidden" name="action" value="remove"/>
    <input type="hidden" name="app" value={id}/>
    <button className="outline-button" type="submit" aria-label={`Remove ${name}`}>Remove</button>
  </form>;
}
