import { supabase, slug, sessaoLocalId } from "./supabase.js";
import { iniciarAuth } from "./auth.js";
import {
  montarEstruturaEstatica,
  registrarOuvintesDeEventos,
  carregarFicha,
  sincronizarDadosDoBanco,
} from "./sheet.js";

const isMesaValida = iniciarAuth();

if (isMesaValida) {
  montarEstruturaEstatica();
  registrarOuvintesDeEventos();

  supabase
    .channel("canal-ficha")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "personagens",
        filter: `slug=eq.${slug}`,
      },
      (payload) => {
        const d = payload.new.dados;
        if (!d || d._remetente === sessaoLocalId) return;

        sincronizarDadosDoBanco(d);

        const status = document.getElementById("status-msg");
        if (status) {
          status.style.color = "#00aaff";
          status.textContent = "Mesa Sincronizada";
          setTimeout(() => {
            status.textContent = "";
          }, 1500);
        }
      },
    )
    .subscribe();

  carregarFicha();
}
