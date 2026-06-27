import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://skrfdygwqkjxcbtiifnd.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrcmZkeWd3cWtqeGNidGlpZm5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MzYwMTksImV4cCI6MjA5ODAxMjAxOX0.CycfJgnGMgi7lru_OinwOECXGKrugQrPLwgg-ZUlc3c";

export const supabase = createClient(supabaseUrl, supabaseKey);
export const sessaoLocalId = Math.random().toString(36).substring(2, 15);
export const urlParams = new URLSearchParams(window.location.search);
export const slug = urlParams.get("char") || "home";
