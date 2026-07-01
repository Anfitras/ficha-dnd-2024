import { estado } from "./state.js";
import { circulosNomesMap } from "./constants.js";
import { toInt } from "./utils.js";

export const gerenciarVisibilidadeComponentesMagia = () => {
  if (!estado.modalSplRefs.mChk || !estado.modalSplRefs.mMat) return;
  estado.modalSplRefs.mMat.classList.toggle(
    "visible",
    estado.modalSplRefs.mChk.checked,
  );
};

export const gerenciarVisibilidadeCombateMagia = () => {
  if (
    !estado.modalSplRefs.dmgChk ||
    !estado.modalSplRefs.saveChk ||
    !estado.modalSplRefs.healChk
  )
    return;
  const showDmg = estado.modalSplRefs.dmgChk.checked;
  const showHeal = estado.modalSplRefs.healChk.checked;
  const showSave = estado.modalSplRefs.saveChk.checked;
  if (estado.modalSplRefs.danoContainer)
    estado.modalSplRefs.danoContainer.style.display = showDmg ? "flex" : "none";
  if (estado.modalSplRefs.healContainer)
    estado.modalSplRefs.healContainer.style.display = showHeal
      ? "flex"
      : "none";
  if (estado.modalSplRefs.saveContainer)
    estado.modalSplRefs.saveContainer.style.display = showSave
      ? "flex"
      : "none";
  if (estado.modalSplRefs.combatGroup) {
    estado.modalSplRefs.combatGroup.style.display =
      showDmg || showHeal || showSave ? "flex" : "none";
  }
};

export const lerValoresModalMagia = () => ({
  id: estado.magiaEmEdicaoId || crypto.randomUUID(),
  nome: estado.modalSplRefs.nome?.value.trim() || "",
  nivel: estado.modalSplRefs.nivel?.value || "0",
  escola: estado.modalSplRefs.escola?.value || "",
  alcance: estado.modalSplRefs.alcance?.value.trim() || "",
  tempo: estado.modalSplRefs.tempo?.value || "Ação",
  atributo: estado.modalSplRefs.atributo?.value || "",
  alvo: estado.modalSplRefs.alvo?.value.trim() || "",
  duracao: estado.modalSplRefs.duracao?.value.trim() || "",
  aoe_size: estado.modalSplRefs.aoeSize?.value.trim() || "",
  aoe_shape: estado.modalSplRefs.aoeShape?.value || "",
  componentes: {
    v: estado.modalSplRefs.vChk?.checked || false,
    s: estado.modalSplRefs.sChk?.checked || false,
    m: estado.modalSplRefs.mChk?.checked
      ? estado.modalSplRefs.mMat?.value.trim() || "Sim"
      : false,
  },
  flags: {
    ritual: estado.modalSplRefs.ritualChk?.checked || false,
    concentracao: estado.modalSplRefs.concChk?.checked || false,
    preparada: estado.modalSplRefs.prepChk?.checked || false,
    dano: estado.modalSplRefs.dmgChk?.checked || false,
    cura: estado.modalSplRefs.healChk?.checked || false,
    dano_roll: estado.modalSplRefs.dmgChk?.checked
      ? estado.modalSplRefs.danoRoll?.value.trim()
      : "",
    heal_roll: estado.modalSplRefs.healChk?.checked
      ? estado.modalSplRefs.healRoll?.value.trim()
      : "",
  },
  salvaguarda: estado.modalSplRefs.saveChk?.checked
    ? estado.modalSplRefs.saveAttr?.value || "destreza"
    : false,
  desc: estado.modalSplRefs.desc?.value.trim() || "",
});

export const abrirModalMagia = (splId, circuloPreSelecionado = null) => {
  estado.magiaEmEdicaoId = splId;
  if (!estado.modalSplRefs.modal) return;
  const m = estado.listaMagias.find((item) => item.id === splId);
  if (m) {
    if (estado.modalSplRefs.titulo)
      estado.modalSplRefs.titulo.textContent = "EDITAR MAGIA";
    if (estado.modalSplRefs.nome) estado.modalSplRefs.nome.value = m.nome || "";
    if (estado.modalSplRefs.nivel)
      estado.modalSplRefs.nivel.value = m.nivel || "0";
    if (estado.modalSplRefs.escola)
      estado.modalSplRefs.escola.value = m.escola || "";
    if (estado.modalSplRefs.alcance)
      estado.modalSplRefs.alcance.value = m.alcance || "";
    if (estado.modalSplRefs.tempo)
      estado.modalSplRefs.tempo.value = m.tempo || "Ação";
    if (estado.modalSplRefs.atributo)
      estado.modalSplRefs.atributo.value = m.atributo || "";
    if (estado.modalSplRefs.alvo) estado.modalSplRefs.alvo.value = m.alvo || "";
    if (estado.modalSplRefs.duracao)
      estado.modalSplRefs.duracao.value = m.duracao || "";
    if (estado.modalSplRefs.aoeSize)
      estado.modalSplRefs.aoeSize.value = m.aoe_size || "";
    if (estado.modalSplRefs.aoeShape)
      estado.modalSplRefs.aoeShape.value = m.aoe_shape || "";
    if (estado.modalSplRefs.vChk)
      estado.modalSplRefs.vChk.checked = !!m.componentes?.v;
    if (estado.modalSplRefs.sChk)
      estado.modalSplRefs.sChk.checked = !!m.componentes?.s;
    if (estado.modalSplRefs.mChk)
      estado.modalSplRefs.mChk.checked = !!m.componentes?.m;
    if (estado.modalSplRefs.mMat)
      estado.modalSplRefs.mMat.value =
        typeof m.componentes?.m === "string" && m.componentes.m !== "Sim"
          ? m.componentes.m
          : "";
    if (estado.modalSplRefs.ritualChk)
      estado.modalSplRefs.ritualChk.checked = !!m.flags?.ritual;
    if (estado.modalSplRefs.concChk)
      estado.modalSplRefs.concChk.checked = !!m.flags?.concentracao;
    if (estado.modalSplRefs.prepChk)
      estado.modalSplRefs.prepChk.checked = !!m.flags?.preparada;
    if (estado.modalSplRefs.dmgChk)
      estado.modalSplRefs.dmgChk.checked =
        !!m.flags?.dano || !!m.flags?.dano_puro || !!m.ataque;
    if (estado.modalSplRefs.healChk)
      estado.modalSplRefs.healChk.checked = !!m.flags?.cura;
    if (estado.modalSplRefs.danoRoll)
      estado.modalSplRefs.danoRoll.value = m.flags?.dano_roll || "";
    if (estado.modalSplRefs.healRoll)
      estado.modalSplRefs.healRoll.value = m.flags?.heal_roll || "";
    if (estado.modalSplRefs.saveChk)
      estado.modalSplRefs.saveChk.checked = !!m.salvaguarda;
    if (estado.modalSplRefs.saveAttr && m.salvaguarda)
      estado.modalSplRefs.saveAttr.value = m.salvaguarda;
    if (estado.modalSplRefs.desc) estado.modalSplRefs.desc.value = m.desc || "";
  } else {
    if (estado.modalSplRefs.titulo)
      estado.modalSplRefs.titulo.textContent = "ADICIONAR NOVA MAGIA";
    if (estado.modalSplRefs.nome) estado.modalSplRefs.nome.value = "";
    if (estado.modalSplRefs.nivel)
      estado.modalSplRefs.nivel.value =
        circuloPreSelecionado !== null ? `${circuloPreSelecionado}` : "0";
    if (estado.modalSplRefs.escola) estado.modalSplRefs.escola.value = "";
    if (estado.modalSplRefs.alcance) estado.modalSplRefs.alcance.value = "";
    if (estado.modalSplRefs.tempo) estado.modalSplRefs.tempo.value = "Ação";
    if (estado.modalSplRefs.atributo) estado.modalSplRefs.atributo.value = "";
    if (estado.modalSplRefs.alvo) estado.modalSplRefs.alvo.value = "";
    if (estado.modalSplRefs.duracao) estado.modalSplRefs.duracao.value = "";
    if (estado.modalSplRefs.aoeSize) estado.modalSplRefs.aoeSize.value = "";
    if (estado.modalSplRefs.aoeShape) estado.modalSplRefs.aoeShape.value = "";
    if (estado.modalSplRefs.vChk) estado.modalSplRefs.vChk.checked = false;
    if (estado.modalSplRefs.sChk) estado.modalSplRefs.sChk.checked = false;
    if (estado.modalSplRefs.mChk) estado.modalSplRefs.mChk.checked = false;
    if (estado.modalSplRefs.mMat) estado.modalSplRefs.mMat.value = "";
    if (estado.modalSplRefs.ritualChk)
      estado.modalSplRefs.ritualChk.checked = false;
    if (estado.modalSplRefs.concChk)
      estado.modalSplRefs.concChk.checked = false;
    if (estado.modalSplRefs.prepChk)
      estado.modalSplRefs.prepChk.checked = false;
    if (estado.modalSplRefs.dmgChk) estado.modalSplRefs.dmgChk.checked = false;
    if (estado.modalSplRefs.healChk)
      estado.modalSplRefs.healChk.checked = false;
    if (estado.modalSplRefs.danoRoll) estado.modalSplRefs.danoRoll.value = "";
    if (estado.modalSplRefs.healRoll) estado.modalSplRefs.healRoll.value = "";
    if (estado.modalSplRefs.saveChk)
      estado.modalSplRefs.saveChk.checked = false;
    if (estado.modalSplRefs.saveAttr)
      estado.modalSplRefs.saveAttr.value = "destreza";
    if (estado.modalSplRefs.desc) estado.modalSplRefs.desc.value = "";
  }
  gerenciarVisibilidadeComponentesMagia();
  gerenciarVisibilidadeCombateMagia();
  estado.modalSplRefs.modal.style.display = "flex";
};

export function renderizarMagias() {
  const container = document.getElementById("spells-container");
  if (!container) return;
  container.innerHTML = "";
  const grupos = {};
  for (let i = 0; i <= 9; i++) {
    grupos[i] = [];
  }
  estado.listaMagias.forEach((m) => {
    const niv = toInt(m.nivel);
    if (grupos[niv]) grupos[niv].push(m);
  });
  Object.keys(grupos).forEach((nivKey) => {
    const magiasDoCirculo = grupos[nivKey];
    if (!magiasDoCirculo || magiasDoCirculo.length === 0) return;
    magiasDoCirculo.sort((a, b) =>
      (a.nome || "").localeCompare(b.nome || "", "pt-BR"),
    );
    const sec = document.createElement("div");
    sec.className = "spell-level-section";
    const header = document.createElement("div");
    header.className = "spell-level-header";
    header.innerHTML = `<span class="spell-level-title"> ${circulosNomesMap[nivKey]}</span><button type="button" class="spell-add-placeholder" data-add-spell="${nivKey}">+</button>`;
    sec.appendChild(header);
    magiasDoCirculo.forEach((mg, mIdx) => {
      const rowWrap = document.createElement("div");
      rowWrap.className = "spell-row-wrapper";
      const uid = `spell-drawer-${nivKey}-${mIdx}`;
      const mainRow = document.createElement("div");
      mainRow.className = "spell-main-row";
      const badges = [];
      if (mg.flags?.concentracao)
        badges.push('<span class="spell-tag-badge conc">C</span>');
      if (mg.flags?.ritual)
        badges.push('<span class="spell-tag-badge ritual">R</span>');
      mainRow.innerHTML = `
        <div class="spell-name-side">
          <span class="spell-icon"></span>
          <span class="spell-title-txt">${mg.nome || "Magia Sem Nome"}</span>
          ${badges.join(" ")}
        </div>
        <div class="spell-actions-side">
          <button type="button" class="action-icon" data-edit-spell="${mg.id}"><span class="icon-edit"></span></button>
          <span class="tag-remove" role="button" data-del-spell="${mg.id}">×</span>
          <button type="button" class="spell-drawer-toggle" aria-expanded="false" aria-controls="${uid}">▼</button>
        </div>
      `;
      const drawer = document.createElement("div");
      drawer.id = uid;
      drawer.className = "spell-detail-drawer";
      const compList = [];
      if (mg.componentes?.v) compList.push("V");
      if (mg.componentes?.s) compList.push("S");
      if (mg.componentes?.m) compList.push(`M (${mg.componentes.m})`);
      const compStr = compList.join(", ");
      const props = [
        mg.tempo
          ? `<div class="spell-prop"><label>Tempo</label><span>${mg.tempo}</span></div>`
          : "",
        mg.alcance
          ? `<div class="spell-prop"><label>Alcance</label><span>${mg.alcance}</span></div>`
          : "",
        mg.duracao
          ? `<div class="spell-prop"><label>Duração</label><span>${mg.duracao}</span></div>`
          : "",
        mg.alvo
          ? `<div class="spell-prop"><label>Alvo</label><span>${mg.alvo}</span></div>`
          : "",
        mg.atributo
          ? `<div class="spell-prop"><label>Atributo</label><span>${mg.atributo.toUpperCase()}</span></div>`
          : "",
        mg.escola
          ? `<div class="spell-prop"><label>Escola</label><span>${mg.escola}</span></div>`
          : "",
        mg.aoe_size
          ? `<div class="spell-prop"><label>Área (Tamanho)</label><span>${mg.aoe_size}</span></div>`
          : "",
        mg.aoe_shape
          ? `<div class="spell-prop"><label>Área (Forma)</label><span>${mg.aoe_shape}</span></div>`
          : "",
        compStr
          ? `<div class="spell-prop"><label>Componentes</label><span>${compStr}</span></div>`
          : "",
        mg.salvaguarda
          ? `<div class="spell-prop"><label>Salvaguarda</label><span>${mg.salvaguarda.toUpperCase()}</span></div>`
          : "",
        mg.flags?.dano_roll
          ? `<div class="spell-prop"><label>Dano</label><span>${mg.flags.dano_roll}</span></div>`
          : "",
        mg.flags?.heal_roll
          ? `<div class="spell-prop"><label>Cura</label><span>${mg.flags.heal_roll}</span></div>`
          : "",
      ];
      drawer.innerHTML = props.filter(Boolean).join("");
      if (mg.desc) {
        drawer.innerHTML += `<div class="spell-prop full-desc"><label>Descrição</label><span>${mg.desc}</span></div>`;
      }
      const toggleBtn = mainRow.querySelector(".spell-drawer-toggle");
      mainRow.addEventListener("click", (e) => {
        if (
          e.target.closest("[data-edit-spell]") ||
          e.target.closest("[data-del-spell]")
        )
          return;
        const isOpen = drawer.classList.toggle("open");
        toggleBtn.classList.toggle("expanded", isOpen);
        toggleBtn.setAttribute("aria-expanded", isOpen);
      });
      rowWrap.appendChild(mainRow);
      rowWrap.appendChild(drawer);
      sec.appendChild(rowWrap);
    });
    container.appendChild(sec);
  });

  container.querySelectorAll("[data-add-spell]").forEach((btn) => {
    btn.onclick = (e) => {
      abrirModalMagia(null, toInt(e.currentTarget.dataset.addSpell));
    };
  });
  container.querySelectorAll("[data-edit-spell]").forEach((btn) => {
    btn.onclick = (e) => {
      abrirModalMagia(e.currentTarget.dataset.editSpell);
    };
  });
  container.querySelectorAll("[data-del-spell]").forEach((btn) => {
    btn.onclick = (e) => {
      if (window.confirm("Tem certeza que deseja excluir esta magia?")) {
        const idAlvo = e.currentTarget.dataset.delSpell;
        estado.listaMagias = estado.listaMagias.filter(
          (mg) => mg.id !== idAlvo,
        );
        renderizarMagias();
        window.dispatchEvent(new CustomEvent("save-immediate"));
      }
    };
  });
}
NativeEventModule: true;
