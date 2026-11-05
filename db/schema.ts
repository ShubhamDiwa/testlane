import { integer, primaryKey, sqliteTable, text, index } from 'drizzle-orm/sqlite-core';
export const members = sqliteTable('members', {id:text().primaryKey(),name:text().notNull()});
export const apps = sqliteTable('community_apps', {
 id:text().primaryKey(), owner:text().notNull().references(()=>members.id), name:text().notNull(),
 description:text().notNull(), android:text().notNull(), spots:integer().notNull(), link:text().notNull(),
 instructions:text().notNull(), created:integer().notNull()
}, t=>[index('community_apps_created').on(t.created)]);
export const requests = sqliteTable('community_requests', {
 app:text().notNull().references(()=>apps.id), member:text().notNull().references(()=>members.id), playEmail:text('play_email').notNull(),
 status:text({enum:['pending','approved','declined']}).notNull().default('pending')
}, t=>[primaryKey({columns:[t.app,t.member]}),index('community_requests_member').on(t.member)]);
export const feedback = sqliteTable('community_feedback',{
 id:text().primaryKey(),app:text().notNull().references(()=>apps.id),member:text().notNull().references(()=>members.id),
 body:text().notNull(),created:integer().notNull()
});
