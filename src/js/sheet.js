import { supabase, slug, sessaoLocalId } from "./supabase.js";

export const atributosLista = [
  { id: "forca", nome: "Força" },
  { id: "destreza", nome: "Destreza" },
  { id: "constituicao", nome: "Constituição" },
  { id: "inteligencia", nome: "Inteligência" },
  { id: "sabedoria", nome: "Sabedoria" },
  { id: "carisma", nome: "Carisma" },
];

export const periciasLista = [
  { id: "acrobacia", nome: "Acrobacia", attr: "destreza", sigla: "DES" },
  { id: "arcanismo", nome: "Arcanismo", attr: "inteligencia", sigla: "INT" },
  { id: "atletismo", nome: "Atletismo", attr: "forca", sigla: "FOR" },
  { id: "atuacao", nome: "Atuação", attr: "carisma", sigla: "CAR" },
  { id: "enganacao", nome: "Enganação", attr: "carisma", sigla: "CAR" },
  { id: "furtividade", nome: "Furtividade", attr: "destreza", sigla: "DES" },
  { id: "historia", nome: "História", attr: "inteligencia", sigla: "INT" },
  { id: "intimidacao", nome: "Intimidação", attr: "carisma", sigla: "CAR" },
  { id: "intuicao", nome: "Intuição", attr: "sabedoria", sigla: "SAB" },
  {
    id: "investigacao",
    nome: "Investigação",
    attr: "inteligencia",
    sigla: "INT",
  },
  {
    id: "lidar_animais",
    nome: "Lidar com Animais",
    attr: "sabedoria",
    sigla: "SAB",
  },
  { id: "medicina", nome: "Medicina", attr: "sabedoria", sigla: "SAB" },
  { id: "natureza", nome: "Natureza", attr: "inteligencia", sigla: "INT" },
  { id: "percepcao", nome: "Percepção", attr: "sabedoria", sigla: "SAB" },
  { id: "persuasao", nome: "Persuasão", attr: "carisma", sigla: "CAR" },
  {
    id: "prestidigitacao",
    nome: "Prestidigitação",
    attr: "destreza",
    sigla: "DES",
  },
  { id: "religiao", nome: "Religião", attr: "inteligencia", sigla: "INT" },
  {
    id: "sobrevivencia",
    nome: "Sobrevivência",
    attr: "sabedoria",
    sigla: "SAB",
  },
];

export const deathSavesLista = [
  "death-s-1",
  "death-s-2",
  "death-s-3",
  "death-f-1",
  "death-f-2",
  "death-f-3",
];

export let listaAtaques = [];
export const listasDinamicas = {
  "def-res": [],
  "def-imun": [],
  "def-vuln": [],
  "prof-armas": [],
  "prof-armaduras": [],
  "prof-ferramentas": [],
  "prof-idiomas": [],
};

let timerSalvar = null;
let mudancaPendente = false;

export const toInt = (val) => {
  const n = parseInt(val, 10);
  return isNaN(n) ? 0 : n;
};

export const formatMod = (val) => (val >= 0 ? `+${val}` : `${val}`);
export const getProfBonus = (nivel) => Math.ceil(nivel / 4) + 1;

export const setCampo = (id, valor) => {
  const el = document.getElementById(id);
  if (!el || document.activeElement === el) return;
  if (el.type === "checkbox") {
    el.checked = !!valor;
  } else {
    el.value = valor;
  }
};

const tentarAdicionarTag = (inp) => {
  const alvo = inp.parentElement?.dataset.target;
  if (!alvo) return;
  const val = inp.value.trim();
  if (val && !listasDinamicas[alvo].includes(val)) {
    listasDinamicas[alvo].push(val);
    inp.value = "";
    renderizarTags(alvo);
    mudancaPendente = true;
    dispararSalvoImediato();
  } else if (!val) {
    inp.value = "";
  }
};

export function montarEstruturaEstatica() {
  const gridAttr = document.getElementById("attributes-grid");
  const gridSaves = document.getElementById("saves-grid");
  const skillsContainer = document.getElementById("skills-list");
  const headerSkills = document.querySelector(".skills-table-header");

  if (headerSkills) {
    headerSkills.innerHTML = `<span>PERÍCIA</span><span></span><span>TOTAL</span><span>PROF</span>`;
  }

  atributosLista.forEach((attr) => {
    if (gridAttr) {
      const cardA = document.createElement("div");
      cardA.className = "attr-box";
      cardA.innerHTML = `
        <span class="attr-label">${attr.nome}</span>
        <input type="number" id="attr-${attr.id}" value="10" />
        <span class="attr-mod" id="mod-${attr.id}">+0</span>
      `;
      gridAttr.appendChild(cardA);
    }

    if (gridSaves) {
      const cardS = document.createElement("div");
      cardS.className = "save-box";
      cardS.innerHTML = `
        <input type="checkbox" id="save-prof-${attr.id}" />
        <span>${attr.nome.slice(0, 3).toUpperCase()}</span>
        <span id="save-val-${attr.id}">+0</span>
      `;
      gridSaves.appendChild(cardS);
    }
  });

  if (skillsContainer) {
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
        dispararSalvoImediato();
      });
    });
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
      listaAtaques.push({ nome: "", bonus: "", dano: "", alcance: "" });
      renderizarAtaques();
      mudancaPendente = true;
      dispararSalvoImediato();
    };
  }

  document.querySelectorAll(".tag-adder").forEach((inp) => {
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

export const renderizarAtaques = () => {
  const tbody = document.getElementById("attacks-list");
  if (!tbody) return;
  tbody.innerHTML = "";
  listaAtaques.forEach((atk, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="text" value="${atk.nome || ""}" data-field="nome" data-idx="${idx}" /></td>
      <td><input type="text" value="${atk.bonus || ""}" data-field="bonus" data-idx="${idx}" /></td>
      <td><input type="text" value="${atk.dano || ""}" data-field="dano" data-idx="${idx}" /></td>
      <td><input type="text" value="${atk.alcance || ""}" data-field="alcance" data-idx="${idx}" /></td>
      <td style="text-align:center;"><span class="tag-remove" data-del-atk="${idx}">×</span></td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("input").forEach((inp) => {
    inp.oninput = (e) => {
      const i = parseInt(e.target.dataset.idx);
      const f = e.target.dataset.field;
      listaAtaques[i][f] = e.target.value;
      agendarSalvoSilencioso();
    };
  });

  tbody.querySelectorAll("[data-del-atk]").forEach((btn) => {
    btn.onclick = (e) => {
      listaAtaques.splice(parseInt(e.target.dataset.delAtk), 1);
      renderizarAtaques();
      mudancaPendente = true;
      dispararSalvoImediato();
    };
  });
};

export const renderizarTags = (chave) => {
  const el = document.getElementById(`list-${chave}`);
  if (!el) return;
  el.innerHTML = "";
  listasDinamicas[chave].forEach((texto, idx) => {
    const tag = document.createElement("div");
    tag.className = "sheet-tag";
    tag.innerHTML = `<span>${texto}</span><span class="tag-remove" data-key="${chave}" data-idx="${idx}">×</span>`;
    el.appendChild(tag);
  });
  document.querySelectorAll(".tag-remove[data-key]").forEach((btn) => {
    btn.onclick = (e) => {
      const k = e.target.dataset.key;
      const i = parseInt(e.target.dataset.idx);
      listasDinamicas[k].splice(i, 1);
      renderizarTags(k);
      mudancaPendente = true;
      dispararSalvoImediato();
    };
  });
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
  if (hdMaxEl) hdMaxEl.innerText = nivel;

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
    hdMirror.innerText = classeVal ? `(${classeVal})` : "";
  }

  const desVal = toInt(document.getElementById("attr-destreza")?.value);
  const desMod = Math.floor((desVal - 10) / 2);
  const initEl = document.getElementById("char-init-val");
  if (initEl) initEl.innerText = formatMod(desMod);

  atributosLista.forEach((attr) => {
    const val = toInt(document.getElementById(`attr-${attr.id}`)?.value);
    const mod = Math.floor((val - 10) / 2);
    const modEl = document.getElementById(`mod-${attr.id}`);
    if (modEl) modEl.innerText = formatMod(mod);

    const isProfSave = document.getElementById(`save-prof-${attr.id}`)?.checked;
    const saveTotal = mod + (isProfSave ? profBonus : 0);
    const saveEl = document.getElementById(`save-val-${attr.id}`);
    if (saveEl) saveEl.innerText = formatMod(saveTotal);
  });

  periciasLista.forEach((p) => {
    const dotEl = document.getElementById(`skill-prof-${p.id}`);
    const profMult = toInt(dotEl?.getAttribute("data-state"));

    const attrVal = toInt(document.getElementById(`attr-${p.attr}`)?.value);
    const attrMod = Math.floor((attrVal - 10) / 2);

    const total = attrMod + profMult * profBonus;
    const totalEl = document.getElementById(`skill-total-${p.id}`);
    if (totalEl) {
      totalEl.innerText = formatMod(total);
      totalEl.setAttribute("data-prof", profMult > 0 ? "true" : "false");
    }
  });
};

export async function carregarFicha() {
  if (slug === "home") return;
  const { data, error } = await supabase
    .from("personagens")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    const fichaInicial = {
      nome: "",
      classe: "",
      subclasse: "",
      nivel: 1,
      especie: "",
      antecedente: "",
      xp: "",
      ca: 10,
      deslocamento: "9m",
      hp_atual: 10,
      hp_max: 10,
      hp_temp: 0,
      hd_atual: 1,
      hd_type: "1d8",
      inspiracao: false,
      notas: "",
      sobre: "",
      death_saves: {},
      ataques: [],
      atributos: {
        forca: 10,
        destreza: 10,
        constituicao: 10,
        inteligencia: 10,
        sabedoria: 10,
        carisma: 10,
      },
      saves: {},
      skills: { prof: {} },
      tags: {
        "def-res": [],
        "def-imun": [],
        "def-vuln": [],
        "prof-armas": [],
        "prof-armaduras": [],
        "prof-ferramentas": [],
        "prof-idiomas": [],
      },
    };
    await supabase
      .from("personagens")
      .insert([{ slug: slug, dados: fichaInicial }]);
    recalcularTudo();
    return;
  }

  const d = data.dados;
  const setIf = (id, val, fallback) => {
    const el = document.getElementById(id);
    if (el) el.value = val !== undefined ? val : fallback;
  };

  setIf("char-name", d.nome, "");
  setIf("char-class", d.classe, "");
  setIf("char-subclass", d.subclasse, "");
  setIf("char-level", d.nivel, 1);
  setIf("char-species", d.especie, "");
  setIf("char-background", d.antecedente, "");
  setIf("char-xp", d.xp, "");
  setIf("char-ac", d.ca, 10);
  setIf("char-speed", d.deslocamento, "9m");
  setIf("char-hp-atual", d.hp_atual, 10);
  setIf("char-hp-max", d.hp_max, 10);
  setIf("char-hp-temp", d.hp_temp, 0);
  setIf("char-hd-atual", d.hd_atual, d.nivel || 1);
  setIf("char-hd-type", d.hd_type, "1d8");
  setIf("char-notes", d.notas, "");
  setIf("char-about", d.sobre, "");

  const inspEl = document.getElementById("char-inspiration");
  if (inspEl) inspEl.checked = !!d.inspiracao;

  atributosLista.forEach((attr) => {
    const el = document.getElementById(`attr-${attr.id}`);
    if (el && d.atributos?.[attr.id] !== undefined)
      el.value = d.atributos[attr.id];
    const saveEl = document.getElementById(`save-prof-${attr.id}`);
    if (saveEl && d.saves?.[attr.id] !== undefined)
      saveEl.checked = d.saves[attr.id];
  });

  periciasLista.forEach((p) => {
    const dotEl = document.getElementById(`skill-prof-${p.id}`);
    if (dotEl && d.skills?.prof?.[p.id] !== undefined) {
      let val = d.skills.prof[p.id];
      if (val === true) val = 1;
      if (val === false) val = 0;
      val = toInt(val);
      dotEl.setAttribute("data-state", val);
      dotEl.value = val;
    }
  });

  deathSavesLista.forEach((id) => {
    const el = document.getElementById(id);
    if (el && d.death_saves) el.checked = !!d.death_saves[id];
  });

  listaAtaques = d.ataques || [];
  renderizarAtaques();

  if (d.tags) {
    Object.keys(listasDinamicas).forEach((k) => {
      listasDinamicas[k] = d.tags[k] || [];
      renderizarTags(k);
    });
  }

  recalcularTudo();
}

export async function executarSalvar() {
  const status = document.getElementById("status-msg");
  if (!status) return;
  status.style.color = "#ffaa00";
  status.innerText = "☁️ Sincronizando...";

  const savesEstado = {};
  const atributosAtualizados = {};
  atributosLista.forEach((attr) => {
    const elSave = document.getElementById(`save-prof-${attr.id}`);
    const elAttr = document.getElementById(`attr-${attr.id}`);
    if (elSave && elAttr) {
      savesEstado[attr.id] = elSave.checked;
      atributosAtualizados[attr.id] = toInt(elAttr.value);
    }
  });

  const periciasProf = {};
  periciasLista.forEach((p) => {
    const elProf = document.getElementById(`skill-prof-${p.id}`);
    if (elProf) {
      periciasProf[p.id] = toInt(elProf.getAttribute("data-state"));
    }
  });

  const deathSavesEstado = {};
  deathSavesLista.forEach((id) => {
    const el = document.getElementById(id);
    if (el) deathSavesEstado[id] = el.checked;
  });

  const dadosNovos = {
    nome: document.getElementById("char-name")?.value || "",
    classe: document.getElementById("char-class")?.value || "",
    subclasse: document.getElementById("char-subclass")?.value || "",
    nivel: toInt(document.getElementById("char-level")?.value),
    especie: document.getElementById("char-species")?.value || "",
    antecedente: document.getElementById("char-background")?.value || "",
    xp: document.getElementById("char-xp")?.value || "",
    ca: toInt(document.getElementById("char-ac")?.value),
    deslocamento: document.getElementById("char-speed")?.value || "9m",
    hp_atual: toInt(document.getElementById("char-hp-atual")?.value),
    hp_max: toInt(document.getElementById("char-hp-max")?.value),
    hp_temp: toInt(document.getElementById("char-hp-temp")?.value),
    hd_atual: toInt(document.getElementById("char-hd-atual")?.value),
    hd_type: document.getElementById("char-hd-type")?.value || "1d8",
    inspiracao: document.getElementById("char-inspiration")?.checked || false,
    notas: document.getElementById("char-notes")?.value || "",
    sobre: document.getElementById("char-about")?.value || "",
    death_saves: deathSavesEstado,
    ataques: listaAtaques,
    atributos: atributosAtualizados,
    saves: savesEstado,
    skills: { prof: periciasProf },
    tags: listasDinamicas,
    _remetente: sessaoLocalId,
  };

  const { error } = await supabase
    .from("personagens")
    .update({ dados: dadosNovos })
    .eq("slug", slug);

  if (!error) {
    status.style.color = "#00cc66";
    status.innerText = "✓ Salvo";
    setTimeout(() => {
      status.innerText = "";
    }, 1500);
  } else {
    console.error(error);
    status.style.color = "#ff4444";
    status.innerText = "Erro ao salvar";
  }
}

export function agendarSalvoSilencioso() {
  mudancaPendente = true;
  const status = document.getElementById("status-msg");
  if (status) {
    status.style.color = "#888";
    status.innerText = "alterações pendentes...";
  }
  clearTimeout(timerSalvar);
  timerSalvar = setTimeout(() => {
    dispararSalvoImediato();
  }, 3500);
}

export function dispararSalvoImediato() {
  if (!mudancaPendente) return;
  clearTimeout(timerSalvar);
  mudancaPendente = false;
  executarSalvar();
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
    if (document.visibilityState === "hidden" && mudancaPendente) {
      dispararSalvoImediato();
    }
  });
}

export function sincronizarDadosDoBanco(d) {
  setCampo("char-name", d.nome || "");
  setCampo("char-class", d.classe || "");
  setCampo("char-subclass", d.subclasse || "");
  setCampo("char-level", d.nivel || 1);
  setCampo("char-species", d.especie || "");
  setCampo("char-background", d.antecedente || "");
  setCampo("char-xp", d.xp || "");
  setCampo("char-ac", d.ca !== undefined ? d.ca : 10);
  setCampo("char-speed", d.deslocamento || "9m");
  setCampo("char-hp-atual", d.hp_atual || 10);
  setCampo("char-hp-max", d.hp_max || 10);
  setCampo("char-hp-temp", d.hp_temp || 0);
  setCampo(
    "char-hd-atual",
    d.hd_atual !== undefined ? d.hd_atual : d.nivel || 1,
  );
  setCampo("char-hd-type", d.hd_type || "1d8");
  setCampo("char-inspiration", d.inspiracao);
  setCampo("char-notes", d.notas || "");
  setCampo("char-about", d.sobre || "");

  atributosLista.forEach((attr) => {
    if (d.atributos?.[attr.id] !== undefined)
      setCampo(`attr-${attr.id}`, d.atributos[attr.id]);
    if (d.saves?.[attr.id] !== undefined)
      setCampo(`save-prof-${attr.id}`, d.saves[attr.id]);
  });

  periciasLista.forEach((p) => {
    if (d.skills?.prof?.[p.id] !== undefined) {
      let val = d.skills.prof[p.id];
      if (val === true) val = 1;
      if (val === false) val = 0;
      val = toInt(val);
      const el = document.getElementById(`skill-prof-${p.id}`);
      if (el) {
        el.setAttribute("data-state", val);
        el.value = val;
      }
    }
  });

  deathSavesLista.forEach((id) => {
    if (d.death_saves?.[id] !== undefined) setCampo(id, d.death_saves[id]);
  });

  if (d.tags) {
    Object.keys(listasDinamicas).forEach((k) => {
      listasDinamicas[k] = d.tags[k] || [];
      renderizarTags(k);
    });
  }

  listaAtaques = d.ataques || [];
  renderizarAtaques();
  recalcularTudo();
}
