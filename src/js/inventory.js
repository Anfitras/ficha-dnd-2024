import { estado } from "./state.js";
import { tiposItemLista } from "./constants.js";
import { toInt } from "./utils.js";

export const gerenciarVisibilidadeCamposItem = () => {
  const tipo = estado.modalItemRefs.tipo?.value;
  if (estado.modalItemRefs.armorGroup) {
    estado.modalItemRefs.armorGroup.style.display =
      tipo === "Armadura" ? "flex" : "none";
  }
  if (estado.modalItemRefs.shieldGroup) {
    estado.modalItemRefs.shieldGroup.style.display =
      tipo === "Escudo" ? "flex" : "none";
  }
};

export const lerValoresModalItem = () => {
  const itmBase =
    estado.listaInventario.find((i) => i.id === estado.itemEmEdicaoId) || {};
  return {
    id: estado.itemEmEdicaoId || crypto.randomUUID(),
    equipado: itmBase.equipado || false,
    nome: estado.modalItemRefs.nome?.value.trim() || "",
    tipo: estado.modalItemRefs.tipo?.value || "Equipamento de Aventura",
    quantidade: estado.modalItemRefs.qtd?.value || "1",
    peso: estado.modalItemRefs.peso?.value.trim() || "0",
    desc: estado.modalItemRefs.desc?.value.trim() || "",
    caBase:
      estado.modalItemRefs.tipo?.value === "Armadura"
        ? estado.modalItemRefs.caBase?.value
        : "",
    forMin:
      estado.modalItemRefs.tipo?.value === "Armadura"
        ? estado.modalItemRefs.forMin?.value
        : "",
    somaDes:
      estado.modalItemRefs.tipo?.value === "Armadura"
        ? estado.modalItemRefs.desChk?.checked
        : false,
    stealthDis:
      estado.modalItemRefs.tipo?.value === "Armadura"
        ? estado.modalItemRefs.stealthChk?.checked
        : false,
    bonusCap:
      estado.modalItemRefs.tipo?.value === "Armadura"
        ? estado.modalItemRefs.cap?.value
        : "",
    caBonus:
      estado.modalItemRefs.tipo?.value === "Escudo"
        ? estado.modalItemRefs.caBonus?.value
        : "",
  };
};

export const abrirModalItem = (id) => {
  estado.itemEmEdicaoId = id;
  if (!estado.modalItemRefs.modal) return;
  const i = estado.listaInventario.find((item) => item.id === id);
  if (estado.modalItemRefs.tipo) {
    estado.modalItemRefs.tipo.innerHTML = tiposItemLista
      .map((t) => `<option value="${t}">${t}</option>`)
      .join("");
  }
  if (i) {
    if (estado.modalItemRefs.titulo)
      estado.modalItemRefs.titulo.textContent = "EDITAR ITEM";
    if (estado.modalItemRefs.nome)
      estado.modalItemRefs.nome.value = i.nome || "";
    if (estado.modalItemRefs.tipo)
      estado.modalItemRefs.tipo.value = i.tipo || "Equipamento de Aventura";
    if (estado.modalItemRefs.qtd)
      estado.modalItemRefs.qtd.value = i.quantidade || "1";
    if (estado.modalItemRefs.peso)
      estado.modalItemRefs.peso.value = i.peso || "0";
    if (estado.modalItemRefs.desc)
      estado.modalItemRefs.desc.value = i.desc || "";
    if (estado.modalItemRefs.caBase)
      estado.modalItemRefs.caBase.value = i.caBase || "";
    if (estado.modalItemRefs.forMin)
      estado.modalItemRefs.forMin.value = i.forMin || "";
    if (estado.modalItemRefs.cap)
      estado.modalItemRefs.cap.value = i.bonusCap || "";
    if (estado.modalItemRefs.desChk)
      estado.modalItemRefs.desChk.checked = !!i.somaDes;
    if (estado.modalItemRefs.stealthChk)
      estado.modalItemRefs.stealthChk.checked = !!i.stealthDis;
    if (estado.modalItemRefs.caBonus)
      estado.modalItemRefs.caBonus.value = i.caBonus || "";
  } else {
    if (estado.modalItemRefs.titulo)
      estado.modalItemRefs.titulo.textContent = "NOVO ITEM";
    if (estado.modalItemRefs.nome) estado.modalItemRefs.nome.value = "";
    if (estado.modalItemRefs.tipo)
      estado.modalItemRefs.tipo.value = "Equipamento de Aventura";
    if (estado.modalItemRefs.qtd) estado.modalItemRefs.qtd.value = "1";
    if (estado.modalItemRefs.peso) estado.modalItemRefs.peso.value = "0";
    if (estado.modalItemRefs.desc) estado.modalItemRefs.desc.value = "";
    if (estado.modalItemRefs.caBase) estado.modalItemRefs.caBase.value = "";
    if (estado.modalItemRefs.forMin) estado.modalItemRefs.forMin.value = "";
    if (estado.modalItemRefs.cap) estado.modalItemRefs.cap.value = "";
    if (estado.modalItemRefs.desChk)
      estado.modalItemRefs.desChk.checked = false;
    if (estado.modalItemRefs.stealthChk)
      estado.modalItemRefs.stealthChk.checked = false;
    if (estado.modalItemRefs.caBonus) estado.modalItemRefs.caBonus.value = "";
  }
  gerenciarVisibilidadeCamposItem();
  estado.modalItemRefs.modal.style.display = "flex";
};

export const renderizarInventario = () => {
  const container = document.getElementById("inventory-lists");
  if (!container) return;
  container.innerHTML = "";
  const grupos = {};
  tiposItemLista.forEach((t) => (grupos[t] = []));
  estado.listaInventario.forEach((i) => {
    if (grupos[i.tipo]) grupos[i.tipo].push(i);
  });
  tiposItemLista.forEach((tipo) => {
    const itens = grupos[tipo];
    if (!itens || itens.length === 0) return;
    itens.sort((a, b) => (a.nome || "").localeCompare(b.nome || "", "pt-BR"));
    const sec = document.createElement("div");
    sec.className = "spell-level-section";
    const header = document.createElement("div");
    header.className = "spell-level-header";
    header.innerHTML = `<span class="spell-level-title">${tipo.toUpperCase()}</span>`;
    sec.appendChild(header);
    itens.forEach((itm, idx) => {
      const rowWrap = document.createElement("div");
      rowWrap.className = "spell-row-wrapper";
      const uid = `itm-drawer-${tipo.replace(/\s+/g, "")}-${idx}`;
      const mainRow = document.createElement("div");
      mainRow.className = "spell-main-row";

      let switchHtml = "";
      if (tipo === "Armadura" || tipo === "Escudo") {
        switchHtml = `<label class="equip-switch"><input type="checkbox" data-equip="${itm.id}" ${itm.equipado ? "checked" : ""}><span class="equip-slider"></span></label>`;
      }

      let badges = [];
      if (itm.quantidade > 1)
        badges.push(
          `<span class="spell-tag-badge conc">x${itm.quantidade}</span>`,
        );

      mainRow.innerHTML = `
        <div class="spell-name-side" style="gap: 1rem;">
          ${switchHtml}
          <span class="spell-title-txt" style="${(tipo === "Armadura" || tipo === "Escudo") && itm.equipado ? "color: var(--gold-bright);" : ""}">${itm.nome || "Novo Item"}</span>
          ${badges.join(" ")}
        </div>
        <div class="spell-actions-side">
          <button type="button" class="action-icon" data-edit-itm="${itm.id}">✏️</button>
          <span class="tag-remove" role="button" data-del-itm="${itm.id}">×</span>
          <button type="button" class="spell-drawer-toggle" aria-expanded="false" aria-controls="${uid}">▼</button>
        </div>
      `;

      const drawer = document.createElement("div");
      drawer.id = uid;
      drawer.className = "spell-detail-drawer";

      const props = [];
      if (tipo === "Armadura") {
        props.push(
          `<div class="spell-prop"><label>CA Base</label><span>${itm.caBase || "—"}</span></div>`,
        );
        if (itm.forMin)
          props.push(
            `<div class="spell-prop"><label>Força Min</label><span>${itm.forMin}</span></div>`,
          );
        props.push(
          `<div class="spell-prop"><label>Furtividade</label><span>${itm.stealthDis ? "Desvantagem" : "Normal"}</span></div>`,
        );
        props.push(
          `<div class="spell-prop"><label>Destreza</label><span>${itm.somaDes ? (itm.bonusCap ? `Soma (Max ${itm.bonusCap})` : "Soma (Sem limite)") : "Não soma"}</span></div>`,
        );
      }
      if (tipo === "Escudo") {
        props.push(
          `<div class="spell-prop"><label>Bônus CA</label><span>${itm.caBonus || "—"}</span></div>`,
        );
      }
      drawer.innerHTML = props.join("");
      if (itm.desc) {
        drawer.innerHTML += `<div class="spell-prop full-desc"><label>Descrição</label><span>${itm.desc}</span></div>`;
      }

      const toggleBtn = mainRow.querySelector(".spell-drawer-toggle");
      mainRow.addEventListener("click", (e) => {
        if (
          e.target.closest("[data-edit-itm]") ||
          e.target.closest("[data-del-itm]") ||
          e.target.closest(".equip-switch")
        )
          return;
        const isOpen = drawer.classList.toggle("open");
        toggleBtn.classList.toggle("expanded", isOpen);
        toggleBtn.setAttribute("aria-expanded", isOpen);
      });
      rowWrap.appendChild(mainRow);
      if (drawer.innerHTML.trim() !== "") {
        rowWrap.appendChild(drawer);
      } else {
        toggleBtn.style.display = "none";
      }
      sec.appendChild(rowWrap);
    });
    container.appendChild(sec);
  });

  container.querySelectorAll("[data-equip]").forEach((chk) => {
    chk.addEventListener("change", (e) => {
      const itm = estado.listaInventario.find(
        (i) => i.id === e.target.dataset.equip,
      );
      if (itm) {
        itm.equipado = e.target.checked;
        window.dispatchEvent(new CustomEvent("recalc"));
        window.dispatchEvent(new CustomEvent("save-immediate"));
      }
    });
  });
  container.querySelectorAll("[data-edit-itm]").forEach((btn) => {
    btn.onclick = (e) => abrirModalItem(e.currentTarget.dataset.editItm);
  });
  container.querySelectorAll("[data-del-itm]").forEach((btn) => {
    btn.onclick = (e) => {
      if (window.confirm("Tem certeza que deseja excluir este item?")) {
        estado.listaInventario = estado.listaInventario.filter(
          (i) => i.id !== e.currentTarget.dataset.delItm,
        );
        window.dispatchEvent(new CustomEvent("recalc"));
        window.dispatchEvent(new CustomEvent("save-immediate"));
      }
    };
  });
};
