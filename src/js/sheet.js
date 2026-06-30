import { estado } from "./state.js";
import {
  atributosLista,
  periciasLista,
  condicoesDescricoes,
  maestriasDescricoes,
  damageTypesLista,
} from "./constants.js";
import { toInt, formatMod, getProfBonus } from "./utils.js";
import {
  normalizarListaAtaques,
  renderizarAtaques,
  abrirModalAtaque,
  atualizarPreviewAtaque,
  lerValoresModalAtaque,
  normalizarAtaque,
} from "./combat.js";
import {
  renderizarMagias,
  abrirModalMagia,
  gerenciarVisibilidadeComponentesMagia,
  gerenciarVisibilidadeCombateMagia,
  lerValoresModalMagia,
} from "./spells.js";
import {
  carregarFicha,
  dispararSalvoImediato,
  agendarSalvoSilencioso,
} from "./sync.js";

export const renderizarTags = (chave) => {
  const el = document.getElementById(`list-${chave}`);
  if (!el) return;
  el.innerHTML = "";
  estado.listasDinamicas[chave].forEach((texto, idx) => {
    const tag = document.createElement("div");
    tag.className = "sheet-tag";
    const isCond = chave === "condicoes";
    tag.innerHTML = `<span>${texto}</span>${isCond ? `<button type="button" class="eye-btn" data-cond-eye="${texto}">👁</button>` : ""}<span class="tag-remove" role="button" data-key="${chave}" data-idx="${idx}">×</span>`;
    el.appendChild(tag);
  });
  if (chave === "condicoes") {
    el.querySelectorAll("[data-cond-eye]").forEach((btn) => {
      btn.onclick = (e) => {
        const nome = e.currentTarget.dataset.condEye;
        const modal = document.getElementById("mastery-modal");
        const title = document.getElementById("mastery-title");
        const desc = document.getElementById("mastery-desc");
        if (modal && title && desc) {
          title.textContent = nome.toUpperCase();
          desc.innerHTML =
            condicoesDescricoes[nome] || "Descrição indisponível.";
          modal.style.display = "block";
        }
      };
    });
  }
  el.querySelectorAll(".tag-remove[data-key]").forEach((btn) => {
    btn.onclick = (e) => {
      const k = e.currentTarget.dataset.key;
      const i = parseInt(e.currentTarget.dataset.idx, 10);
      estado.listasDinamicas[k].splice(i, 1);
      renderizarTags(k);
      estado.mudancaPendente = true;
      window.dispatchEvent(new CustomEvent("save-immediate"));
    };
  });
};

const tentarAdicionarTag = (inp) => {
  const alvo = inp.parentElement?.dataset.target;
  if (!alvo) return;
  const val = inp.value.trim();
  if (val && !estado.listasDinamicas[alvo].includes(val)) {
    estado.listasDinamicas[alvo].push(val);
    inp.value = "";
    renderizarTags(alvo);
    estado.mudancaPendente = true;
    window.dispatchEvent(new CustomEvent("save-immediate"));
  } else if (!val) {
    inp.value = "";
  }
};

export const recalcularTudo = () => {
  const nivelEl = document.getElementById("char-level");
  if (!nivelEl) return;
  let nivel = toInt(nivelEl.value);
  if (nivel < 1) nivel = 1;
  if (nivel > 20) nivel = 20;
  if (document.activeElement !== nivelEl) nivelEl.value = nivel;
  const profBonus = getProfBonus(nivel);
  const profEl = document.getElementById("char-prof-bonus");
  if (profEl) profEl.value = formatMod(profBonus);
  const hdMaxEl = document.getElementById("hd-max-label");
  if (hdMaxEl) hdMaxEl.textContent = nivel;
  const hpAtual = toInt(document.getElementById("char-hp-atual")?.value);
  const hpMax = toInt(document.getElementById("char-hp-max")?.value);
  const hpBar = document.getElementById("hp-bar-fill");
  if (hpBar) {
    let pct = hpMax > 0 ? (hpAtual / hpMax) * 100 : 0;
    pct = Math.max(0, Math.min(100, pct));
    hpBar.style.width = `${pct}%`;
    if (pct > 50) {
      hpBar.style.backgroundColor = "#00cc66";
    } else if (pct > 25) {
      hpBar.style.backgroundColor = "#ffaa00";
    } else {
      hpBar.style.backgroundColor = "#ff3b3b";
    }
  }
  const classeVal = document.getElementById("char-class")?.value.trim();
  const hdMirror = document.getElementById("hd-class-mirror");
  if (hdMirror) {
    hdMirror.textContent = classeVal ? `(${classeVal})` : "";
  }
  const desVal = toInt(document.getElementById("attr-destreza")?.value);
  const desMod = Math.floor((desVal - 10) / 2);
  const initEl = document.getElementById("char-init-val");
  if (initEl) initEl.textContent = formatMod(desMod);
  atributosLista.forEach((attr) => {
    const val = toInt(document.getElementById(`attr-${attr.id}`)?.value);
    const mod = Math.floor((val - 10) / 2);
    const modEl = document.getElementById(`mod-${attr.id}`);
    if (modEl) modEl.textContent = formatMod(mod);
    const dotSave = document.getElementById(`save-prof-${attr.id}`);
    const saveMult = toInt(dotSave?.getAttribute("data-state"));
    const saveTotal = mod + saveMult * profBonus;
    const saveEl = document.getElementById(`save-val-${attr.id}`);
    if (saveEl) saveEl.textContent = formatMod(saveTotal);
    const boxSave = document.getElementById(`save-box-${attr.id}`);
    if (boxSave)
      boxSave.setAttribute("data-prof", saveMult > 0 ? "true" : "false");
  });
  periciasLista.forEach((p) => {
    const dotEl = document.getElementById(`skill-prof-${p.id}`);
    const profMult = toInt(dotEl?.getAttribute("data-state"));
    const attrVal = toInt(document.getElementById(`attr-${p.attr}`)?.value);
    const attrMod = Math.floor((attrVal - 10) / 2);
    const total = attrMod + profMult * profBonus;
    const totalEl = document.getElementById(`skill-total-${p.id}`);
    if (totalEl) {
      totalEl.textContent = formatMod(total);
      totalEl.setAttribute("data-prof", profMult > 0 ? "true" : "false");
    }
  });
  const spellAttrSel = document.getElementById("char-spell-attr");
  const attrKey = spellAttrSel ? spellAttrSel.value : "inteligencia";
  const spellAttrVal = toInt(document.getElementById(`attr-${attrKey}`)?.value);
  const spellMod = Math.floor((spellAttrVal - 10) / 2);
  const elDC = document.getElementById("spell-dc-val");
  const elAtk = document.getElementById("spell-atk-val");
  if (elDC) elDC.textContent = 8 + profBonus + spellMod;
  if (elAtk) elAtk.textContent = formatMod(profBonus + spellMod);
  estado.listaAtaques = normalizarListaAtaques(estado.listaAtaques);
  renderizarAtaques();
  renderizarMagias();
  atualizarPreviewAtaque();
};

export function montarEstruturaEstatica() {
  const uGridAttr = document.getElementById("universal-attrs-grid");
  const skillsContainer = document.getElementById("skills-list");
  const headerSkills = document.querySelector(".skills-table-header");
  if (headerSkills) {
    headerSkills.innerHTML = `<span>PERÍCIA</span><span></span><span>TOTAL</span><span>PROF</span>`;
  }
  if (uGridAttr) {
    uGridAttr.innerHTML = "";
    atributosLista.forEach((attr) => {
      const sigla = attr.nome.slice(0, 3).toUpperCase();
      const card = document.createElement("div");
      card.className = "u-attr-card";
      card.innerHTML = `
        <div class="u-attr-top">
          <span class="u-attr-label">${sigla}</span>
          <input type="number" id="attr-${attr.id}" value="10" class="u-attr-input" />
        </div>
        <div class="u-attr-bottom">
          <div class="u-stat-unit">
            <div class="u-mod-box"><span id="mod-${attr.id}">+0</span></div>
            <span class="u-sub-label">Mod</span>
          </div>
          <div class="u-stat-unit">
            <div id="save-box-${attr.id}" class="u-save-box" data-prof="false">
              <span id="save-val-${attr.id}">+0</span>
              <span class="u-dot-wrapper">
                <button type="button" id="save-prof-${attr.id}" class="skill-dot u-save-dot" data-state="0"></button>
              </span>
            </div>
            <span class="u-sub-label">Save</span>
          </div>
        </div>
      `;
      uGridAttr.appendChild(card);
    });
    uGridAttr.querySelectorAll(".u-save-dot").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const atual = toInt(e.currentTarget.getAttribute("data-state"));
        const proximo = (atual + 1) % 3;
        e.currentTarget.setAttribute("data-state", proximo);
        e.currentTarget.value = proximo;
        recalcularTudo();
        estado.mudancaPendente = true;
        window.dispatchEvent(new CustomEvent("save-immediate"));
      });
    });
  }
  if (skillsContainer) {
    skillsContainer.innerHTML = "";
    periciasLista.forEach((p) => {
      const row = document.createElement("div");
      row.className = "skill-row";
      row.innerHTML = `
        <span class="skill-name" title="${p.nome}">${p.nome}</span>
        <span class="skill-attr-badge">${p.sigla}</span>
        <span id="skill-total-${p.id}" class="skill-total">+0</span>
        <button type="button" id="skill-prof-${p.id}" class="skill-dot" data-state="0"></button>
      `;
      skillsContainer.appendChild(row);
    });
    skillsContainer.querySelectorAll(".skill-dot").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const atual = toInt(e.currentTarget.getAttribute("data-state"));
        const proximo = (atual + 1) % 3;
        e.currentTarget.setAttribute("data-state", proximo);
        e.currentTarget.value = proximo;
        recalcularTudo();
        estado.mudancaPendente = true;
        window.dispatchEvent(new CustomEvent("save-immediate"));
      });
    });
  }
  const condSelect = document.getElementById("condition-adder");
  if (condSelect) {
    condSelect.innerHTML = `<option value="">+ Adicionar</option>`;
    Object.keys(condicoesDescricoes).forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      condSelect.appendChild(opt);
    });
    condSelect.addEventListener("change", (e) => {
      const val = e.target.value;
      if (!val) return;
      if (!estado.listasDinamicas["condicoes"].includes(val)) {
        estado.listasDinamicas["condicoes"].push(val);
        renderizarTags("condicoes");
        estado.mudancaPendente = true;
        window.dispatchEvent(new CustomEvent("save-immediate"));
      }
      e.target.value = "";
    });
  }
  estado.modalAtkRefs = {
    modal: document.getElementById("attack-modal"),
    titulo: document.getElementById("attack-modal-title"),
    nome: document.getElementById("atk-inp-nome"),
    atributo: document.getElementById("atk-inp-atributo"),
    proficiencia: document.getElementById("atk-inp-proficiencia"),
    bonusExtra: document.getElementById("atk-inp-bonus-extra"),
    bonusTotal: document.getElementById("atk-inp-bonus-total"),
    danoRoll: document.getElementById("atk-inp-dano-roll"),
    danoTipo: document.getElementById("atk-inp-dano-tipo"),
    alcance: document.getElementById("atk-inp-alcance"),
    maestria: document.getElementById("atk-inp-maestria"),
    desc: document.getElementById("atk-inp-desc"),
  };
  estado.modalSplRefs = {
    modal: document.getElementById("spell-modal"),
    titulo: document.getElementById("spell-modal-title"),
    nome: document.getElementById("spl-inp-nome"),
    nivel: document.getElementById("spl-inp-nivel"),
    escola: document.getElementById("spl-inp-escola"),
    alcance: document.getElementById("spl-inp-alcance"),
    tempo: document.getElementById("spl-inp-tempo"),
    atributo: document.getElementById("spl-inp-atributo"),
    alvo: document.getElementById("spl-inp-alvo"),
    duracao: document.getElementById("spl-inp-duracao"),
    aoSize: document.getElementById("spl-inp-aoe-size"),
    aoShape: document.getElementById("spl-inp-aoe-shape"),
    vChk: document.getElementById("spl-chk-v"),
    sChk: document.getElementById("spl-chk-s"),
    mChk: document.getElementById("spl-chk-m"),
    mMat: document.getElementById("spl-inp-m-mat"),
    ritualChk: document.getElementById("spl-chk-ritual"),
    concChk: document.getElementById("spl-chk-conc"),
    prepChk: document.getElementById("spl-chk-prep"),
    dmgChk: document.getElementById("spl-chk-dano"),
    healChk: document.getElementById("spl-chk-heal"),
    saveChk: document.getElementById("spl-chk-save"),
    combatGroup: document.getElementById("spl-combat-details-group"),
    danoContainer: document.getElementById("spl-dano-container"),
    healContainer: document.getElementById("spl-heal-container"),
    saveContainer: document.getElementById("spl-save-attr-container"),
    danoRoll: document.getElementById("spl-inp-dano-roll"),
    healRoll: document.getElementById("spl-inp-heal-roll"),
    saveAttr: document.getElementById("spl-inp-save-attr"),
    desc: document.getElementById("spl-inp-desc"),
  };
  if (estado.modalAtkRefs.danoTipo) {
    estado.modalAtkRefs.danoTipo.innerHTML =
      `<option value="">—</option>` +
      damageTypesLista
        .map((t) => `<option value="${t}">${t}</option>`)
        .join("");
  }
  if (estado.modalAtkRefs.maestria) {
    estado.modalAtkRefs.maestria.innerHTML =
      `<option value="">—</option>` +
      Object.keys(maestriasDescricoes)
        .filter(Boolean)
        .map((m) => `<option value="${m}">${m}</option>`)
        .join("");
  }
  const abas = document.querySelectorAll(".tab-btn");
  abas.forEach((btn) => {
    btn.addEventListener("click", () => {
      abas.forEach((b) => b.classList.remove("active"));
      document
        .querySelectorAll(".tab-content")
        .forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      const targetEl = document.getElementById(btn.dataset.target);
      if (targetEl) targetEl.classList.add("active");
    });
  });
  const btnAddAtk = document.getElementById("add-attack-btn");
  if (btnAddAtk) {
    btnAddAtk.onclick = (e) => {
      e.preventDefault();
      abrirModalAtaque(null);
    };
  }
  const btnAddSpl = document.getElementById("add-spell-btn");
  if (btnAddSpl) {
    btnAddSpl.onclick = (e) => {
      e.preventDefault();
      abrirModalMagia(null);
    };
  }
  const modalMastery = document.getElementById("mastery-modal");
  const closeMastery = document.getElementById("mastery-close");
  if (closeMastery && modalMastery) {
    closeMastery.onclick = () => {
      modalMastery.style.display = "none";
    };
  }
  const closeAtk = document.getElementById("attack-modal-close");
  const saveAtkBtn = document.getElementById("atk-btn-save");
  const attackModalInputsIds = [
    "atk-inp-nome",
    "atk-inp-atributo",
    "atk-inp-proficiencia",
    "atk-inp-bonus-extra",
    "atk-inp-dano-roll",
    "atk-inp-dano-tipo",
    "atk-inp-alcance",
    "atk-inp-maestria",
    "atk-inp-desc",
  ];
  attackModalInputsIds.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener(
      el.tagName === "SELECT" ? "change" : "input",
      atualizarPreviewAtaque,
    );
  });
  if (closeAtk && estado.modalAtkRefs.modal) {
    closeAtk.onclick = () => {
      estado.modalAtkRefs.modal.style.display = "none";
      estado.ataqueEmEdicaoIdx = null;
    };
  }
  if (saveAtkBtn && estado.modalAtkRefs.modal) {
    saveAtkBtn.onclick = () => {
      const novoAtk = normalizarAtaque(lerValoresModalAtaque());
      if (estado.ataqueEmEdicaoIdx === null) {
        estado.listaAtaques.push(novoAtk);
      } else {
        estado.listaAtaques[estado.ataqueEmEdicaoIdx] = novoAtk;
      }
      estado.modalAtkRefs.modal.style.display = "none";
      estado.ataqueEmEdicaoIdx = null;
      renderizarAtaques();
      estado.mudancaPendente = true;
      window.dispatchEvent(new CustomEvent("save-immediate"));
    };
  }
  const closeSpl = document.getElementById("spell-modal-close");
  const saveSplBtn = document.getElementById("spl-btn-save");
  if (estado.modalSplRefs.mChk)
    estado.modalSplRefs.mChk.addEventListener(
      "change",
      gerenciarVisibilidadeComponentesMagia,
    );
  if (estado.modalSplRefs.dmgChk)
    estado.modalSplRefs.dmgChk.checkedEventListener
      ? null
      : estado.modalSplRefs.dmgChk.addEventListener(
          "change",
          gerenciarVisibilidadeCombateMagia,
        );
  if (estado.modalSplRefs.healChk)
    estado.modalSplRefs.healChk.addEventListener(
      "change",
      gerenciarVisibilidadeCombateMagia,
    );
  if (estado.modalSplRefs.saveChk)
    estado.modalSplRefs.saveChk.addEventListener(
      "change",
      gerenciarVisibilidadeCombateMagia,
    );
  if (closeSpl && estado.modalSplRefs.modal) {
    closeSpl.onclick = () => {
      estado.modalSplRefs.modal.style.display = "none";
      estado.magiaEmEdicaoId = null;
    };
  }
  if (saveSplBtn && estado.modalSplRefs.modal) {
    saveSplBtn.onclick = () => {
      const novaMg = lerValoresModalMagia();
      const idxExistente = estado.listaMagias.findIndex(
        (mg) => mg.id === novaMg.id,
      );
      if (idxExistente === -1) {
        estado.listaMagias.push(novaMg);
      } else {
        estado.listaMagias[idxExistente] = novaMg;
      }
      estado.modalSplRefs.modal.style.display = "none";
      estado.magiaEmEdicaoId = null;
      renderizarMagias();
      estado.mudancaPendente = true;
      window.dispatchEvent(new CustomEvent("save-immediate"));
    };
  }
  document.querySelectorAll(".tag-adder:not(select)").forEach((inp) => {
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        tentarAdicionarTag(inp);
      }
    });
    inp.addEventListener("blur", () => {
      tentarAdicionarTag(inp);
    });
  });
}

export function registrarOuvintesDeEventos() {
  const appEl = document.getElementById("app");
  if (appEl) {
    appEl.addEventListener("input", () => {
      recalcularTudo();
      agendarSalvoSilencioso();
    });
    appEl.addEventListener("focusout", () => {
      dispararSalvoImediato();
    });
    appEl.addEventListener("change", () => {
      recalcularTudo();
      dispararSalvoImediato();
    });
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && estado.mudancaPendente) {
      dispararSalvoImediato();
    }
  });
  window.addEventListener("recalc", () => recalcularTudo());
  window.addEventListener("render-tag", (e) => {
    if (e.detail?.chave) renderizarTags(e.detail.chave);
  });
  window.addEventListener("save-immediate", () => dispararSalvoImediato());
  window.addEventListener("save-lazy", () => agendarSalvoSilencioso());
}

window.addEventListener("DOMContentLoaded", () => {
  window.dispatchEvent(new CustomEvent("recalc"));
});
