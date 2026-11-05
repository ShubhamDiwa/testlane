/** Convert Play Console testing links and Play Store app links to the web opt-in URL. */
export function playTestingLink(value:string):string|null{
 let url:URL;
 try{url=new URL(value.trim())}catch{return null}
 if(url.origin!=='https://play.google.com'||url.username||url.password)return null;
 const path=url.pathname.replace(/\/$/,'');
 const ids=url.searchParams.getAll('id');
 const id=path==='/store/apps/details'&&ids.length===1?ids[0]:path.match(/^\/apps\/testing\/([^/]+)$/)?.[1];
 if(!id||!/^[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)+$/.test(id))return null;
 return 'https://play.google.com/apps/testing/'+id;
}
