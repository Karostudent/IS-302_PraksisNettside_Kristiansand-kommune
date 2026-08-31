const SUPABASE_URL = 'https://rgylotvnjxlmfddxnxkj.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_sFIkTzo1f1f0d26-d6XyXQ_xul48coL';
const DIARY_ACCOUNT_EMAIL = 'dagbok@praksisnettside.no';

window.diaryDatabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
window.diaryAccountEmail = DIARY_ACCOUNT_EMAIL;
