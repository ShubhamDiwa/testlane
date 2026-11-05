import { readFileSync, writeFileSync } from "node:fs";

const buildConfig = new URL("../dist/server/wrangler.json", import.meta.url);
const deployConfig = new URL("../dist/server/wrangler.public.json", import.meta.url);
const settings = JSON.parse(readFileSync(new URL("../wrangler.jsonc", import.meta.url), "utf8"));
const generated = JSON.parse(readFileSync(buildConfig, "utf8"));

writeFileSync(deployConfig, JSON.stringify({
  ...generated,
  ...settings,
  topLevelName: settings.name,
  // Production community data lives in Supabase. The generated D1 binding is for local Sites development.
  d1_databases: [],
  // Keep the Supabase runtime variables already configured on the production Worker.
  keep_vars: true,
  observability: { enabled: false },
}));
