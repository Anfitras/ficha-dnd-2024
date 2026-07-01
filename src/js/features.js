import { estado } from "./state.js";
import { origensHabilidadeLista } from "./constants.js";

export const lerValoresModalHabilidade = () => ({
  id: estado.habilidadeEmEdicaoId || crypto.randomUUID(),
  nome: estado.modalFeatRefs.nome?.value.trim() || "",
  acao: estado.modalFeatRefs.acao?.value || "Nenhuma",
  origem: estado.modalFeatRefs.origem?.value || "Habilidade de Classe",
  desc: estado.modalFeatRefs.desc?.value.trim() || "",
});

export const abrirModalHabilidade = (id) => {
  estado.habilidadeEmEdicaoId = id;
  if (!estado.modalFeatRefs.modal) return;
  const h = estado.listaHabilidades.find((feat) => feat.id === id);
  if (estado.modalFeatRefs.origem) {
    estado.modalFeatRefs.origem.innerHTML = origensHabilidadeLista
      .map((o) => `<option value="${o}">${o}</option>`)
      .join("");
  }
  if (h) {
    if (estado.modalFeatRefs.titulo)
      estado.modalFeatRefs.titulo.textContent = "EDITAR HABILIDADE / TRAÇO";
    if (estado.modalFeatRefs.nome)
      estado.modalFeatRefs.nome.value = h.nome || "";
    if (estado.modalFeatRefs.acao)
      estado.modalFeatRefs.acao.value = h.acao || "Nenhuma";
    if (estado.modalFeatRefs.origem)
      estado.modalFeatRefs.origem.value = h.origem || "Habilidade de Classe";
    if (estado.modalFeatRefs.desc)
      estado.modalFeatRefs.desc.value = h.desc || "";
  } else {
    if (estado.modalFeatRefs.titulo)
      estado.modalFeatRefs.titulo.textContent = "NOVA HABILIDADE / TRAÇO";
    if (estado.modalFeatRefs.nome) estado.modalFeatRefs.nome.value = "";
    if (estado.modalFeatRefs.acao) estado.modalFeatRefs.acao.value = "Nenhuma";
    if (estado.modalFeatRefs.origem)
      estado.modalFeatRefs.origem.value = "Habilidade de Classe";
    if (estado.modalFeatRefs.desc) estado.modalFeatRefs.desc.value = "";
  }
  estado.modalFeatRefs.modal.style.display = "flex";
};

export const renderizarHabilidades = () => {
  const container = document.getElementById("features-lists");
  if (!container) return;
  container.innerHTML = "";
  const grupos = {};
  origensHabilidadeLista.forEach((o) => (grupos[o] = []));
  estado.listaHabilidades.forEach((h) => {
    if (grupos[h.origem]) grupos[h.origem].push(h);
  });
  origensHabilidadeLista.forEach((origem) => {
    const itens = grupos[origem];
    if (!itens || itens.length === 0) return;
    itens.sort((a, b) => (a.nome || "").localeCompare(b.nome || "", "pt-BR"));
    const sec = document.createElement("div");
    sec.className = "spell-level-section";
    const header = document.createElement("div");
    header.className = "spell-level-header";
    header.innerHTML = `<span class="spell-level-title">${origem.toUpperCase()}</span>`;
    sec.appendChild(header);
    itens.forEach((h, idx) => {
      const rowWrap = document.createElement("div");
      rowWrap.className = "spell-row-wrapper";
      const uid = `feat-drawer-${origem.replace(/\s+/g, "")}-${idx}`;
      const mainRow = document.createElement("div");
      mainRow.className = "spell-main-row";
      let badges = [];
      if (h.acao && h.acao !== "Nenhuma") {
        badges.push(`<span class="spell-tag-badge conc">${h.acao}</span>`);
      }
      mainRow.innerHTML = `
        <div class="spell-name-side">
          <span class="spell-title-txt">${h.nome || "Nova Habilidade"}</span>
          ${badges.join(" ")}
        </div>
        <div class="spell-actions-side">
          <button type="button" class="action-icon" data-edit-fea="${h.id}"><span class="icon-edit"></span></button>
          <span class="tag-remove" role="button" data-del-fea="${h.id}">×</span>
          <button type="button" class="spell-drawer-toggle" aria-expanded="false" aria-controls="${uid}">▼</button>
        </div>
      `;
      const drawer = document.createElement("div");
      drawer.id = uid;
      drawer.className = "spell-detail-drawer";
      if (h.desc) {
        drawer.innerHTML = `<div class="spell-prop full-desc"><label>Descrição</label><span>${h.desc}</span></div>`;
      }
      const toggleBtn = mainRow.querySelector(".spell-drawer-toggle");
      mainRow.addEventListener("click", (e) => {
        if (
          e.target.closest("[data-edit-fea]") ||
          e.target.closest("[data-del-fea]")
        )
          return;
        const isOpen = drawer.classList.toggle("open");
        toggleBtn.classList.toggle("expanded", isOpen);
        toggleBtn.setAttribute("aria-expanded", isOpen);
      });
      rowWrap.appendChild(mainRow);
      if (h.desc) {
        rowWrap.appendChild(drawer);
      } else {
        toggleBtn.style.display = "none";
      }
      sec.appendChild(rowWrap);
    });
    container.appendChild(sec);
  });
  container.querySelectorAll("[data-edit-fea]").forEach((btn) => {
    btn.onclick = (e) => abrirModalHabilidade(e.currentTarget.dataset.editFea);
  });
  container.querySelectorAll("[data-del-fea]").forEach((btn) => {
    btn.onclick = (e) => {
      if (window.confirm("Tem certeza que deseja excluir esta habilidade?")) {
        estado.listaHabilidades = estado.listaHabilidades.filter(
          (h) => h.id !== e.currentTarget.dataset.delFea,
        );
        window.dispatchEvent(new CustomEvent("recalc"));
        window.dispatchEvent(new CustomEvent("save-immediate"));
      }
    };
  });
};
