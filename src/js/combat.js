import { estado } from "./state.js";
import {
  atributosLista,
  maestriasDescricoes,
  damageTypesLista,
} from "./constants.js";
import { toInt, getProfBonus } from "./utils.js";

const formatAttackNumber = (val) => {
  if (!Number.isFinite(val)) return "+0";
  const rounded = Math.round(val * 100) / 100;
  const isInteger = Math.abs(rounded - Math.round(rounded)) < 1e-9;
  const text = isInteger
    ? `${Math.round(rounded)}`
    : `${rounded}`.replace(/\.0+$/, "");
  return rounded >= 0 ? `+${text}` : text;
};

const getAttackProfMultiplier = (value) => {
  switch (String(value)) {
    case "0.5":
      return 0.5;
    case "1":
      return 1;
    case "2":
      return 2;
    default:
      return 0;
  }
};

const getCurrentProfBonus = () => {
  const nivelEl = document.getElementById("char-level");
  let nivel = toInt(nivelEl?.value);
  if (nivel < 1) nivel = 1;
  if (nivel > 20) nivel = 20;
  return getProfBonus(nivel);
};

const getAttackAttrMeta = (attrId) =>
  atributosLista.find((attr) => attr.id === attrId) || null;

const getAttackAttrMod = (attrId) => {
  if (!attrId) return 0;
  const el = document.getElementById(`attr-${attrId}`);
  if (!el) return 0;
  return Math.floor((toInt(el.value) - 10) / 2);
};

const extrairDanoLegado = (dano = "") => {
  const texto = `${dano}`.trim();
  if (!texto) return { danoRoll: "", danoTipo: "" };
  const tipoEncontrado = damageTypesLista.find((tipo) =>
    texto.endsWith(` ${tipo}`),
  );
  if (!tipoEncontrado) return { danoRoll: texto, danoTipo: "" };
  return {
    danoRoll: texto.slice(0, -1 * (tipoEncontrado.length + 1)).trim(),
    danoTipo: tipoEncontrado,
  };
};

export const getAttackParts = (atk = {}) => {
  const attrMod = getAttackAttrMod(atk.atributo);
  const profBonus = getCurrentProfBonus();
  const profPart = profBonus * getAttackProfMultiplier(atk.proficiencia);
  const extraPart = toInt(atk.bonusExtra ?? atk.bonus);
  const total = attrMod + profPart + extraPart;
  return { attrMod, profBonus, profPart, extraPart, total };
};

export const getAttackSummary = (atk = {}) => {
  const parts = getAttackParts(atk);
  const attrMeta = getAttackAttrMeta(atk.atributo);
  const detailParts = [];
  if (attrMeta)
    detailParts.push(`${attrMeta.nome} ${formatAttackNumber(parts.attrMod)}`);
  detailParts.push(`Prof ${formatAttackNumber(parts.profPart)}`);
  const bonusExtraRaw = `${atk.bonusExtra ?? atk.bonus ?? ""}`.trim();
  if (bonusExtraRaw || parts.extraPart !== 0)
    detailParts.push(`Bônus ${formatAttackNumber(parts.extraPart)}`);
  return `${detailParts.join(" + ")} = ${formatAttackNumber(parts.total)}`;
};

export const getAttackDamageDisplay = (atk = {}) => {
  const damageRoll = `${atk.danoRoll ?? ""}`.trim();
  const damageType = `${atk.danoTipo ?? ""}`.trim();
  if (damageRoll && damageType) return `${damageRoll} ${damageType}`;
  return damageRoll || damageType || "—";
};

export const normalizarAtaque = (atk = {}) => {
  const legadoDano = extrairDanoLegado(atk.dano ?? "");
  const bonusExtraRaw =
    atk.bonusExtra !== undefined && atk.bonusExtra !== null
      ? atk.bonusExtra
      : (atk.bonus ?? "");
  const base = {
    ...atk,
    atributo: atk.atributo || "",
    proficiencia: `${atk.proficiencia ?? atk.prof ?? 0}`,
    bonusExtra: `${bonusExtraRaw}`.trim(),
    danoRoll: `${atk.danoRoll ?? legadoDano.danoRoll ?? ""}`.trim(),
    danoTipo: `${atk.danoTipo ?? legadoDano.danoTipo ?? ""}`.trim(),
  };
  const parts = getAttackParts(base);
  return {
    ...base,
    bonus: formatAttackNumber(parts.total),
    dano: getAttackDamageDisplay(base),
    bonusTotal: parts.total,
  };
};

export const normalizarListaAtaques = (ataques = []) =>
  ataques.map((atk) => normalizarAtaque(atk));

export const lerValoresModalAtaque = () => ({
  nome: estado.modalAtkRefs.nome?.value.trim() || "",
  atributo: estado.modalAtkRefs.atributo?.value || "",
  proficiencia: estado.modalAtkRefs.proficiencia?.value || "0",
  bonusExtra: estado.modalAtkRefs.bonusExtra?.value.trim() || "",
  danoRoll: estado.modalAtkRefs.danoRoll?.value.trim() || "",
  danoTipo: estado.modalAtkRefs.danoTipo?.value || "",
  alcance: estado.modalAtkRefs.alcance?.value.trim() || "",
  maestria: estado.modalAtkRefs.maestria?.value || "",
  desc: estado.modalAtkRefs.desc?.value.trim() || "",
});

export const atualizarPreviewAtaque = () => {
  if (!estado.modalAtkRefs.bonusTotal) return;
  const valores = lerValoresModalAtaque();
  const partes = getAttackParts(valores);
  estado.modalAtkRefs.bonusTotal.value = formatAttackNumber(partes.total);
  estado.modalAtkRefs.bonusTotal.title = getAttackSummary(valores);
};

export const abrirModalAtaque = (idx) => {
  estado.ataqueEmEdicaoIdx = idx;
  if (!estado.modalAtkRefs.modal) return;
  if (idx !== null && estado.listaAtaques[idx]) {
    const atk = estado.listaAtaques[idx];
    if (estado.modalAtkRefs.titulo)
      estado.modalAtkRefs.titulo.textContent = "EDITAR ATAQUE";
    if (estado.modalAtkRefs.nome)
      estado.modalAtkRefs.nome.value = atk.nome || "";
    if (estado.modalAtkRefs.atributo)
      estado.modalAtkRefs.atributo.value = atk.atributo || "";
    if (estado.modalAtkRefs.proficiencia)
      estado.modalAtkRefs.proficiencia.value = atk.proficiencia || "0";
    if (estado.modalAtkRefs.bonusExtra)
      estado.modalAtkRefs.bonusExtra.value = atk.bonusExtra || "";
    if (estado.modalAtkRefs.danoRoll)
      estado.modalAtkRefs.danoRoll.value = atk.danoRoll || "";
    if (estado.modalAtkRefs.danoTipo)
      estado.modalAtkRefs.danoTipo.value = atk.danoTipo || "";
    if (estado.modalAtkRefs.alcance)
      estado.modalAtkRefs.alcance.value = atk.alcance || "";
    if (estado.modalAtkRefs.maestria)
      estado.modalAtkRefs.maestria.value = atk.maestria || "";
    if (estado.modalAtkRefs.desc)
      estado.modalAtkRefs.desc.value = atk.desc || "";
  } else {
    if (estado.modalAtkRefs.titulo)
      estado.modalAtkRefs.titulo.textContent = "NOVO ATAQUE";
    if (estado.modalAtkRefs.nome) estado.modalAtkRefs.nome.value = "";
    if (estado.modalAtkRefs.atributo) estado.modalAtkRefs.atributo.value = "";
    if (estado.modalAtkRefs.proficiencia)
      estado.modalAtkRefs.proficiencia.value = "0";
    if (estado.modalAtkRefs.bonusExtra)
      estado.modalAtkRefs.bonusExtra.value = "";
    if (estado.modalAtkRefs.danoRoll) estado.modalAtkRefs.danoRoll.value = "";
    if (estado.modalAtkRefs.danoTipo) estado.modalAtkRefs.danoTipo.value = "";
    if (estado.modalAtkRefs.alcance) estado.modalAtkRefs.alcance.value = "";
    if (estado.modalAtkRefs.maestria) estado.modalAtkRefs.maestria.value = "";
    if (estado.modalAtkRefs.desc) estado.modalAtkRefs.desc.value = "";
  }
  atualizarPreviewAtaque();
  estado.modalAtkRefs.modal.style.display = "flex";
};

export const renderizarAtaques = () => {
  const tbody = document.getElementById("attacks-list");
  if (!tbody) return;
  tbody.innerHTML = "";
  estado.listaAtaques.forEach((atk, idx) => {
    const mVal = atk.maestria || "";
    const resumo = getAttackSummary(atk).replace(/"/g, "&quot;");
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="read-only-cell">${atk.nome || "—"}</td>
      <td class="read-only-cell" title="${resumo}">${atk.bonus || "—"}</td>
      <td class="read-only-cell">${atk.dano || "—"}</td>
      <td class="read-only-cell">${atk.alcance || "—"}</td>
      <td>
        <div class="mastery-cell">
          <span class="mastery-badge">${mVal || "—"}</span>
          ${mVal ? `<button type="button" class="eye-btn" data-eye="${idx}">👁</button>` : ""}
        </div>
      </td>
      <td style="text-align:center; white-space:nowrap;">
        <button type="button" class="action-icon" data-edit-atk="${idx}">✏️</button>
        <span class="tag-remove" role="button" data-del-atk="${idx}">×</span>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("[data-edit-atk]").forEach((btn) => {
    btn.onclick = (e) => {
      abrirModalAtaque(parseInt(e.currentTarget.dataset.editAtk, 10));
    };
  });

  tbody.querySelectorAll("[data-eye]").forEach((btn) => {
    btn.onclick = (e) => {
      const i = parseInt(e.currentTarget.dataset.eye, 10);
      const sel = estado.listaAtaques[i]?.maestria || "";
      const modal = document.getElementById("mastery-modal");
      const title = document.getElementById("mastery-title");
      const desc = document.getElementById("mastery-desc");
      if (modal && title && desc) {
        title.textContent = sel ? sel.toUpperCase() : "MAESTRIA";
        desc.textContent = maestriasDescricoes[sel] || maestriasDescricoes[""];
        modal.style.display = "block";
      }
    };
  });

  tbody.querySelectorAll("[data-del-atk]").forEach((btn) => {
    btn.onclick = (e) => {
      estado.listaAtaques.splice(
        parseInt(e.currentTarget.dataset.delAtk, 10),
        1,
      );
      renderizarAtaques();
      window.dispatchEvent(new CustomEvent("save-immediate"));
    };
  });
};
