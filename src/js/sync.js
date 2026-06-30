import { supabase, slug, sessaoLocalId } from "./supabase.js";
import { estado } from "./state.js";
import { atributosLista, periciasLista, deathSavesLista } from "./constants.js";
import { toInt } from "./utils.js";
import { normalizarListaAtaques } from "./combat.js";

export const setCampo = (id, valor) => {
  const el = document.getElementById(id);
  if (!el || document.activeElement === el) return;
  if (el.type === "checkbox") {
    el.checked = !!valor;
  } else {
    el.value = valor;
  }
};

export const popularCampos = (d, protegerFoco) => {
  const setVal = (id, val, fb) => {
    const el = document.getElementById(id);
    if (!el || (protegerFoco && document.activeElement === el)) return;
    const v = val !== undefined && val !== null ? val : fb;
    if (el.type === "checkbox") {
      el.checked = !!v;
    } else {
      el.value = v !== undefined ? v : "";
    }
  };
  setVal("char-name", d.nome, "");
  setVal("char-class", d.classe, "");
  setVal("char-subclass", d.subclasse, "");
  setVal("char-level", d.nivel, 1);
  setVal("char-species", d.especie, "");
  setVal("char-background", d.antecedente, "");
  setVal("char-xp", d.xp, "");
  setVal("char-ac", d.ca, 10);
  setVal("char-speed", d.deslocamento, "9m");
  setVal("char-hp-atual", d.hp_atual, 10);
  setVal("char-hp-max", d.hp_max, 10);
  setVal("char-hp-temp", d.hp_temp, 0);
  setVal("char-hd-atual", d.hd_atual, d.nivel || 1);
  setVal("char-hd-type", d.hd_type, "1d8");
  setVal("char-spell-attr", d.spell_attr, "inteligencia");
  const c = d.caracteristicas || {};
  setVal("char-gender", c.genero, "");
  setVal("char-eyes", c.olhos, "");
  setVal("char-size", c.tamanho, "Médio");
  setVal("char-height", c.altura, "");
  setVal("char-hair", c.cabelo, "");
  setVal("char-skin", c.pele, "");
  setVal("char-age", c.idade, "");
  setVal("char-weight", c.peso, "");
  const inspEl = document.getElementById("char-inspiration");
  if (inspEl && !(protegerFoco && document.activeElement === inspEl)) {
    inspEl.checked = !!d.inspiracao;
  }
  setVal("char-notes", d.notas, "");
  setVal("char-about", d.sobre, "");
  atributosLista.forEach((attr) => {
    if (d.atributos?.[attr.id] !== undefined)
      setVal(`attr-${attr.id}`, d.atributos[attr.id]);
    if (d.saves?.[attr.id] !== undefined) {
      let val = d.saves[attr.id];
      if (val === true) val = 1;
      if (val === false) val = 0;
      val = toInt(val);
      const el = document.getElementById(`save-prof-${attr.id}`);
      if (el && !(protegerFoco && document.activeElement === el)) {
        el.setAttribute("data-state", val);
        el.value = val;
      }
    }
  });
  periciasLista.forEach((p) => {
    if (d.skills?.prof?.[p.id] !== undefined) {
      let val = d.skills.prof[p.id];
      if (val === true) val = 1;
      if (val === false) val = 0;
      val = toInt(val);
      const el = document.getElementById(`skill-prof-${p.id}`);
      if (el && !(protegerFoco && document.activeElement === el)) {
        el.setAttribute("data-state", val);
        el.value = val;
      }
    }
  });
  deathSavesLista.forEach((id) => {
    if (d.death_saves?.[id] !== undefined) setVal(id, d.death_saves[id]);
  });
  if (d.tags) {
    Object.keys(estado.listasDinamicas).forEach((k) => {
      estado.listasDinamicas[k] = d.tags[k] || [];
      window.dispatchEvent(
        new CustomEvent("render-tag", { detail: { chave: k } }),
      );
    });
  }
  estado.listaAtaques = normalizarListaAtaques(d.ataques || []);
  estado.listaMagias = d.magias || [];
  estado.listaInventario = d.inventario || [];
  setVal("coin-pc", d.moedas?.pc, 0);
  setVal("coin-pp", d.moedas?.pp, 0);
  setVal("coin-pe", d.moedas?.pe, 0);
  setVal("coin-po", d.moedas?.po, 0);
  setVal("coin-pl", d.moedas?.pl, 0);
  window.dispatchEvent(new CustomEvent("recalc"));
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
      spell_attr: "inteligencia",
      inspiracao: false,
      notas: "",
      sobre: "",
      caracteristicas: {
        genero: "",
        olhos: "",
        tamanho: "Médio",
        altura: "",
        cabelo: "",
        pele: "",
        idade: "",
        peso: "",
      },
      death_saves: {},
      ataques: [],
      magias: [],
      inventario: [],
      moedas: { pc: 0, pp: 0, pe: 0, po: 0, pl: 0 },
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
        condicoes: [],
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
    window.dispatchEvent(new CustomEvent("recalc"));
    return;
  }
  popularCampos(data.dados, false);
}

export async function executarSalvar() {
  const status = document.getElementById("status-msg");
  if (!status) return;
  status.style.color = "#ffaa00";
  status.textContent = "☁️ Sincronizando...";
  const savesEstado = {};
  const atributosAtualizados = {};
  atributosLista.forEach((attr) => {
    const elSave = document.getElementById(`save-prof-${attr.id}`);
    const elAttr = document.getElementById(`attr-${attr.id}`);
    if (elSave && elAttr) {
      savesEstado[attr.id] = toInt(elSave.getAttribute("data-state"));
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
    moedas: {
      pc: toInt(document.getElementById("coin-pc")?.value),
      pp: toInt(document.getElementById("coin-pp")?.value),
      pe: toInt(document.getElementById("coin-pe")?.value),
      po: toInt(document.getElementById("coin-po")?.value),
      pl: toInt(document.getElementById("coin-pl")?.value),
    },
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
    spell_attr:
      document.getElementById("char-spell-attr")?.value || "inteligencia",
    inspiracao: document.getElementById("char-inspiration")?.checked || false,
    notas: document.getElementById("char-notes")?.value || "",
    sobre: document.getElementById("char-about")?.value || "",
    caracteristicas: {
      genero: document.getElementById("char-gender")?.value || "",
      olhos: document.getElementById("char-eyes")?.value || "",
      tamanho: document.getElementById("char-size")?.value || "Médio",
      altura: document.getElementById("char-height")?.value || "",
      cabelo: document.getElementById("char-hair")?.value || "",
      pele: document.getElementById("char-skin")?.value || "",
      idade: document.getElementById("char-age")?.value || "",
      peso: document.getElementById("char-weight")?.value || "",
    },
    death_saves: deathSavesEstado,
    ataques: normalizarListaAtaques(estado.listaAtaques),
    magias: estado.listaMagias,
    inventario: estado.listaInventario,
    atributos: atributosAtualizados,
    saves: savesEstado,
    skills: { prof: periciasProf },
    tags: estado.listasDinamicas,
    _remetente: sessaoLocalId,
  };
  const { error } = await supabase
    .from("personagens")
    .update({ dados: dadosNovos })
    .eq("slug", slug);
  if (!error) {
    status.style.color = "#00cc66";
    status.textContent = "✓ Salvo";
    setTimeout(() => {
      status.textContent = "";
    }, 1500);
  } else {
    status.style.color = "#ff4444";
    status.textContent = "Erro ao salvar";
  }
}

export function agendarSalvoSilencioso() {
  estado.mudancaPendente = true;
  const status = document.getElementById("status-msg");
  if (status) {
    status.style.color = "#888";
    status.textContent = "alterações pendentes...";
  }
  clearTimeout(estado.timerSalvar);
  estado.timerSalvar = setTimeout(() => {
    dispararSalvoImediato();
  }, 3500);
}

export function dispararSalvoImediato() {
  if (!estado.mudancaPendente) return;
  clearTimeout(estado.timerSalvar);
  estado.mudancaPendente = false;
  executarSalvar();
}

export function sincronizarDadosDoBanco(d) {
  popularCampos(d, true);
}
