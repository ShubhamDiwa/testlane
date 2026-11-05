/** Accept only official Google Play URLs and strip tracking parameters. */
function playPackage(value:string,allowTesting:boolean):string|null{
 let url:URL;
 try{url=new URL(value.trim())}catch{return null}
 if(url.origin!=='https://play.google.com'||url.username||url.password)return null;
 const path=url.pathname.replace(/\/$/,'');
 const ids=url.searchParams.getAll('id');
 const id=path==='/store/apps/details'&&ids.length===1?ids[0]:
  allowTesting?path.match(/^\/apps\/testing\/([^/]+)$/)?.[1]:null;
 return id&&/^[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)+$/.test(id)?id:null;
}

export function playTestingLink(value:string):string|null{
 const id=playPackage(value,true);
 return id?'https://play.google.com/apps/testing/'+id:null;
}

export function playStoreLink(value:string):string|null{
 const id=playPackage(value,false);
 return id?'https://play.google.com/store/apps/details?id='+id:null;
}
