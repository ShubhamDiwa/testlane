import { env } from 'cloudflare:workers';
export function communityDb(){if(!env.DB)throw new Error('Community database unavailable');return env.DB}
export type Listing={id:string;owner:string;name:string;description:string;android:string;spots:number;approved:number;developer:string;status:string|null};
export async function listApps(user:string){
 return (await communityDb().prepare(`SELECT a.id,a.owner,a.name,a.description,a.android,a.spots,m.name AS developer,
 (SELECT count(*) FROM community_requests r WHERE r.app=a.id AND r.status='approved') AS approved,
 (SELECT status FROM community_requests r WHERE r.app=a.id AND r.member=?) AS status
 FROM community_apps a JOIN members m ON m.id=a.owner ORDER BY a.created DESC LIMIT 100`).bind(user).all<Listing>()).results;
}
