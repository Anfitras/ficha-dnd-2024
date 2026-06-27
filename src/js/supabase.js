import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
export const sessaoLocalId = crypto.randomUUID();
export const urlParams = new URLSearchParams(window.location.search);
export const slug = urlParams.get("char") || "home";
