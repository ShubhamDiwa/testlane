export async function GET(){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL||'',key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||'';
 return Response.json({url,key,enabled:Boolean(url&&key)},{headers:{'Cache-Control':'no-store'}});
}
