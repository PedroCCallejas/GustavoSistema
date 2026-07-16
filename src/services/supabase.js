import { createClient } from "@supabase/supabase-js";

// Chave publicavel (nao e segredo): o acesso aos dados e protegido pelo RLS
// no Supabase, entao ela pode ficar no codigo/no bundle do app.
const SUPABASE_URL = "https://yskyylijftyorgbktyfh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_plRhi8Lovu5oiPhs66wncQ_-Bd0XxI3";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
