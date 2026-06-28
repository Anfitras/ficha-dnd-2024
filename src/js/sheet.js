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

const condicoesDescricoes = {
  Amedrontado:
    "Enquanto tem a condição Amedrontado, você sofre os seguintes efeitos.<br><br><strong>Testes de Atributo e Ataques Afetados.</strong> Você tem Desvantagem em testes de atributo e jogadas de ataque enquanto a fonte do medo estiver dentro da linha de visão.<br><br><strong>Não Pode Se Aproximar.</strong> Você não pode se aproximar voluntariamente da fonte do medo.",
  Atordoado:
    "Enquanto tem a condição Atordoado, você sofre os seguintes efeitos.<br><br><strong>Incapacitado.</strong> Você tem a condição Incapacitado.<br><br><strong>Salvaguardas Afetadas.</strong> Você falha automaticamente em salvaguardas de Força e Destreza.<br><br><strong>Ataques Afetados.</strong> Jogadas de ataque contra você têm Vantagem.",
  Caído:
    "Enquanto tem a condição Caído, você sofre os seguintes efeitos.<br><br><strong>Movimento Restrito.</strong> Suas únicas opções de movimento são rastejar ou gastar uma quantidade de movimento equivalente à metade do seu Deslocamento (arredondado para baixo) para se levantar e, assim, encerrar a condição. Se seu Deslocamento for 0, você não consegue se levantar.<br><br><strong>Ataques Afetados.</strong> Você tem Desvantagem em jogadas de ataque. Uma jogada de ataque contra você tem Vantagem se o atacante estiver a até 1,5 metro de você. Caso contrário, essa jogada de ataque tem Desvantagem.",
  Cego: "Enquanto tem a condição Cego, você sofre os seguintes efeitos.<br><br><strong>Não Pode Ver.</strong> Você não consegue ver e falha automaticamente em qualquer teste de atributo que dependa da visão.<br><br><strong>Ataques Afetados.</strong> Jogadas de ataque contra você têm Vantagem, enquanto suas jogadas de ataque têm Desvantagem.",
  Contido:
    "Enquanto tem a condição Contido, você sofre os seguintes efeitos.<br><br><strong>Deslocamento 0.</strong> Seu Deslocamento é 0 e não pode aumentar.<br><br><strong>Ataques Afetados.</strong> Jogadas de ataque contra você têm Vantagem e suas jogadas de ataque têm Desvantagem.<br><br><strong>Salvaguardas Afetadas.</strong> Você tem Desvantagem em salvaguardas de Destreza.",
  Enfeitiçado:
    "Enquanto tem a condição Enfeitiçado, você sofre os seguintes efeitos:<br><br><strong>Não Pode Atacar Quem o Enfeitiçou.</strong> Você não pode atacar quem o enfeitiçou nem o ter como alvo de ataques que utilizem atributos ou efeitos mágicos.<br><br><strong>Vantagem Social.</strong> Quem o enfeitiçou tem Vantagem em qualquer teste de atributo para interações sociais com você.",
  Envenenado:
    "Enquanto tem a condição Envenenado, você sofre os seguintes efeitos.<br><br><strong>Testes de Atributo e Ataques Afetados.</strong> Você tem Desvantagem em jogadas de ataque e testes de atributo.",
  Exaustão:
    "Enquanto tem a condição Exaustão, você sofre os seguintes efeitos.<br><br><strong>Níveis de Exaustão.</strong> Essa condição é acumulativa. Cada vez que você a adquire, recebe 1 nível de Exaustão. Você morre se seu nível de Exaustão atingir 6.<br><br><strong>Testes de D20 Afetados.</strong> Ao realizar um Teste de D20, o resultado é reduzido em 2 vezes o seu nível de Exaustão.<br><br><strong>Deslocamento Reduzido.</strong> Seu Deslocamento é reduzido por uma quantidade de metros igual a 1,5 vezes o seu nível de Exaustão.<br><br><strong>Remoção de Níveis de Exaustão.</strong> Completar um Descanso Longo remove 1 dos seus níveis de Exaustão. Quando seu nível de Exaustão chega a 0 a condição encerra.",
  Imobilizado:
    "Enquanto tem a condição Imobilizado, você sofre os seguintes efeitos.<br><br><strong>Deslocamento 0.</strong> Seu Deslocamento é 0 e não pode aumentar.<br><br><strong>Ataques Afetados.</strong> Você tem Desvantagem em jogadas de ataque contra qualquer alvo que não seja o imobilizador.<br><br><strong>Móvel.</strong> O imobilizador pode arrastá-lo ou carregá-lo consigo, mas cada metro de movimento custa 1 metro adicional, a menos que você seja Minúsculo ou dois ou mais tamanhos menores que ele.",
  Inconsciente:
    "Enquanto tem a condição Inconsciente, você sofre os seguintes efeitos.<br><br><strong>Inerte.</strong> Você tem as condições Caído e Incapacitado e solta qualquer coisa que estiver segurando. Quando esta condição se encerra, você continua Caído.<br><br><strong>Deslocamento 0.</strong> Seu Deslocamento é 0 e não pode ser aumentado.<br><br><strong>Ataques Afetados.</strong> Jogadas de ataque contra você têm Vantagem.<br><br><strong>Salvaguardas Afetadas.</strong> Você falha automaticamente em salvaguardas de Força e Destreza.<br><br><strong>Acertos Críticos Automáticos.</strong> Qualquer jogada de ataque que o atinge é um Acerto Crítico se o atacante estiver a até 1,5 metro de você.<br><br><strong>Alheio.</strong> Você não está ciente do que está ao seu redor.",
  Invisível:
    "Enquanto tem a condição Invisível, você sofre os seguintes efeitos.<br><br><strong>Surpresa.</strong> Se você está Invisível quando joga Iniciativa, tem Vantagem na jogada.<br><br><strong>Oculto.</strong> Você não é afetado por nenhum efeito que exija que seu alvo seja visto, a menos que o criador do efeito possa vê-lo de alguma forma. Qualquer equipamento que você estiver vestindo ou carregando também está oculto.<br><br><strong>Ataques Afetados.</strong> Jogadas de ataque contra você têm Desvantagem, enquanto suas jogadas de ataque têm Vantagem. Se uma criatura puder vê-lo de alguma forma, você não recebe esse benefício contra ela.",
  Paralisado:
    "Enquanto tem a condição Paralisado, você sofre os seguintes efeitos.<br><br><strong>Incapacitado.</strong> Você adquire a condição Incapacitado.<br><br><strong>Deslocamento 0.</strong> Seu Deslocamento é 0 e não pode aumentar.<br><br><strong>Ataques Afetados.</strong> Jogadas de ataque contra você têm Vantagem.<br><br><strong>Acertos Críticos Automáticos.</strong> Qualquer jogada de ataque que o atinge é um Acerto Crítico se o atacante estiver a até 1,5 metro de você.<br><br><strong>Salvaguardas Afetadas.</strong> Você falha automaticamente em salvaguardas de Força e Destreza.",
  Petrificado:
    "Enquanto tem a condição Petrificado, você sofre os seguintes efeitos.<br><br><strong>Transformado em Substância Inanimada.</strong> Você é transformado, juntamente com qualquer objeto não mágico que esteja vestindo ou carregando, em uma substância sólida e inanimada (geralmente pedra). Seu peso aumenta em dez vezes e você para de envelhecer.<br><br><strong>Incapacitado.</strong> Você adquire a condição Incapacitado.<br><br><strong>Deslocamento 0.</strong> Seu Deslocamento é 0 e não pode aumentar.<br><br><strong>Ataques Afetados.</strong> Jogadas de ataque contra você têm Vantagem.<br><br><strong>Salvaguardas Afetadas.</strong> Você falha automaticamente em salvaguardas de Força e Destreza.<br><br><strong>Resistência a Dano.</strong> Você tem Resistência a todos os danos.<br><br><strong>Imunidade a Veneno.</strong> Você tem Imunidade à condição Envenenado.",
  Surdo:
    "Enquanto estiver na condição Surdo, você sofre o seguinte efeito.<br><br><strong>Não Pode Ouvir.</strong> Você não pode ouvir e falha automaticamente em qualquer teste de atributo que dependa da audição.",
};

const maestriasDescricoes = {
  "": "Nenhuma maestria selecionada para esta arma.",
  Afligir:
    "Se você atingir uma criatura com esta arma e causar dano a ela, você tem Vantagem em sua próxima jogada de ataque contra essa criatura antes do final do seu próximo turno.",
  Ágil: "Ao realizar o ataque adicional da propriedade Leve, você pode fazê-lo como parte da ação Atacar, em vez de uma Ação Bônus. Esse ataque adicional só pode ser realizado uma vez por turno.",
  Derrubar:
    "Se você atingir uma criatura com esta arma, você pode forçar a criatura a realizar uma salvaguarda de Constituição (CD 8 mais o modificador de atributo usado para realizar a jogada de ataque e seu Bônus de Proficiência). Se falhar, a criatura tem a condição Caído.",
  Drenar:
    "Se você atingir uma criatura com esta arma, essa criatura tem Desvantagem na próxima jogada de ataque dela antes do início do seu próximo turno.",
  Empurrar:
    "Se atingir uma criatura com esta arma, você pode empurrá-la até 3 metros para longe de você se a criatura for Grande ou menor.",
  Garantido:
    "Se sua jogada de ataque com esta arma errar uma criatura, você pode causar dano a essa criatura igual ao modificador de atributo que utilizou para realizar a jogada de ataque. Este dano é do mesmo tipo causado pela arma, e só pode ser aumentado se o modificador de atributo for incrementado.",
  Lentidão:
    "Se você atingir uma criatura com esta arma e causar dano a ela, você pode reduzir o Deslocamento da criatura atingida em 3 metros até o início do seu próximo turno. Se a criatura for atingida mais de uma vez por armas que tenham essa propriedade, a redução de Deslocamento não excede 3 metros.",
  Trespassar:
    "Se atingir uma criatura com uma jogada de ataque corpo a corpo usando esta arma, você pode realizar uma jogada de ataque corpo a corpo com a mesma arma contra uma segunda criatura a até 1,5 metro da primeira que também esteja ao seu alcance. Se acertar, a segunda criatura sofre o dano da arma, mas você não adiciona seu modificador de atributo a esse dano, a menos que esse modificador seja negativo. Você pode realizar esse ataque adicional apenas uma vez por turno.",
};

const damageTypesLista = [
  "Ácido",
  "Contundente",
  "Cortante",
  "Elétrico",
  "Energético",
  "Gélido",
  "Ígneo",
  "Necrótico",
  "Perfurante",
  "Psíquico",
  "Radiante",
  "Trovejante",
  "Venenoso",
];

export let listaAtaques = [];
export const listasDinamicas = {
  condicoes: [],
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
let ataqueEmEdicaoIdx = null;
let modalAtkRefs = {};

export const toInt = (val) => {
  const n = parseInt(val, 10);
  return isNaN(n) ? 0 : n;
};

export const formatMod = (val) => (val >= 0 ? `+${val}` : `${val}`);
export const getProfBonus = (nivel) => Math.ceil(nivel / 4) + 1;

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

const getAttackParts = (atk = {}) => {
  const attrMod = getAttackAttrMod(atk.atributo);
  const profBonus = getCurrentProfBonus();
  const profPart = profBonus * getAttackProfMultiplier(atk.proficiencia);
  const extraPart = toInt(atk.bonusExtra ?? atk.bonus);
  const total = attrMod + profPart + extraPart;
  return { attrMod, profBonus, profPart, extraPart, total };
};

const getAttackSummary = (atk = {}) => {
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

const getAttackDamageDisplay = (atk = {}) => {
  const damageRoll = `${atk.danoRoll ?? ""}`.trim();
  const damageType = `${atk.danoTipo ?? ""}`.trim();
  if (damageRoll && damageType) return `${damageRoll} ${damageType}`;
  return damageRoll || damageType || "—";
};

const normalizarAtaque = (atk = {}) => {
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

const normalizarListaAtaques = (ataques = []) =>
  ataques.map((atk) => normalizarAtaque(atk));

const lerValoresModalAtaque = () => ({
  nome: modalAtkRefs.nome?.value.trim() || "",
  atributo: modalAtkRefs.atributo?.value || "",
  proficiencia: modalAtkRefs.proficiencia?.value || "0",
  bonusExtra: modalAtkRefs.bonusExtra?.value.trim() || "",
  danoRoll: modalAtkRefs.danoRoll?.value.trim() || "",
  danoTipo: modalAtkRefs.danoTipo?.value || "",
  alcance: modalAtkRefs.alcance?.value.trim() || "",
  maestria: modalAtkRefs.maestria?.value || "",
  desc: modalAtkRefs.desc?.value.trim() || "",
});

const atualizarPreviewAtaque = () => {
  if (!modalAtkRefs.bonusTotal) return;
  const valores = lerValoresModalAtaque();
  const partes = getAttackParts(valores);
  modalAtkRefs.bonusTotal.value = formatAttackNumber(partes.total);
  modalAtkRefs.bonusTotal.title = getAttackSummary(valores);
};

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

const abrirModalAtaque = (idx) => {
  ataqueEmEdicaoIdx = idx;
  if (!modalAtkRefs.modal) return;
  if (idx !== null && listaAtaques[idx]) {
    const atk = listaAtaques[idx];
    if (modalAtkRefs.titulo) modalAtkRefs.titulo.textContent = "EDITAR ATAQUE";
    if (modalAtkRefs.nome) modalAtkRefs.nome.value = atk.nome || "";
    if (modalAtkRefs.atributo) modalAtkRefs.atributo.value = atk.atributo || "";
    if (modalAtkRefs.proficiencia)
      modalAtkRefs.proficiencia.value = atk.proficiencia || "0";
    if (modalAtkRefs.bonusExtra)
      modalAtkRefs.bonusExtra.value = atk.bonusExtra || "";
    if (modalAtkRefs.danoRoll) modalAtkRefs.danoRoll.value = atk.danoRoll || "";
    if (modalAtkRefs.danoTipo) modalAtkRefs.danoTipo.value = atk.danoTipo || "";
    if (modalAtkRefs.alcance) modalAtkRefs.alcance.value = atk.alcance || "";
    if (modalAtkRefs.maestria) modalAtkRefs.maestria.value = atk.maestria || "";
    if (modalAtkRefs.desc) modalAtkRefs.desc.value = atk.desc || "";
  } else {
    if (modalAtkRefs.titulo) modalAtkRefs.titulo.textContent = "NOVO ATAQUE";
    if (modalAtkRefs.nome) modalAtkRefs.nome.value = "";
    if (modalAtkRefs.atributo) modalAtkRefs.atributo.value = "";
    if (modalAtkRefs.proficiencia) modalAtkRefs.proficiencia.value = "0";
    if (modalAtkRefs.bonusExtra) modalAtkRefs.bonusExtra.value = "";
    if (modalAtkRefs.danoRoll) modalAtkRefs.danoRoll.value = "";
    if (modalAtkRefs.danoTipo) modalAtkRefs.danoTipo.value = "";
    if (modalAtkRefs.alcance) modalAtkRefs.alcance.value = "";
    if (modalAtkRefs.maestria) modalAtkRefs.maestria.value = "";
    if (modalAtkRefs.desc) modalAtkRefs.desc.value = "";
  }
  atualizarPreviewAtaque();
  modalAtkRefs.modal.style.display = "flex";
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
        <button type="button" role="button" aria-label="Proficiência em ${p.nome}" id="skill-prof-${p.id}" class="skill-dot" data-state="0"></button>
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
        mudancaPendente = true;
        dispararSalvoImediato();
      });
    });
  }

  const condSelect = document.getElementById("condition-adder");
  if (condSelect) {
    Object.keys(condicoesDescricoes).forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      condSelect.appendChild(opt);
    });

    condSelect.addEventListener("change", (e) => {
      const val = e.target.value;
      if (!val) return;
      if (!listasDinamicas["condicoes"].includes(val)) {
        listasDinamicas["condicoes"].push(val);
        renderizarTags("condicoes");
        mudancaPendente = true;
        dispararSalvoImediato();
      }
      e.target.value = "";
    });
  }

  modalAtkRefs = {
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

  if (modalAtkRefs.danoTipo) {
    modalAtkRefs.danoTipo.innerHTML =
      `<option value="">—</option>` +
      damageTypesLista
        .map((t) => `<option value="${t}">${t}</option>`)
        .join("");
  }

  if (modalAtkRefs.maestria) {
    modalAtkRefs.maestria.innerHTML =
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
    const evt = el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(evt, atualizarPreviewAtaque);
  });

  if (closeAtk && modalAtkRefs.modal) {
    closeAtk.onclick = () => {
      modalAtkRefs.modal.style.display = "none";
      ataqueEmEdicaoIdx = null;
    };
  }

  if (saveAtkBtn && modalAtkRefs.modal) {
    saveAtkBtn.onclick = () => {
      const novoAtk = normalizarAtaque(lerValoresModalAtaque());
      if (ataqueEmEdicaoIdx === null) {
        listaAtaques.push(novoAtk);
      } else {
        listaAtaques[ataqueEmEdicaoIdx] = novoAtk;
      }
      modalAtkRefs.modal.style.display = "none";
      ataqueEmEdicaoIdx = null;
      renderizarAtaques();
      mudancaPendente = true;
      dispararSalvoImediato();
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

export const renderizarAtaques = () => {
  const tbody = document.getElementById("attacks-list");
  if (!tbody) return;
  tbody.innerHTML = "";
  listaAtaques.forEach((atk, idx) => {
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
          ${mVal ? `<button type="button" class="eye-btn" aria-label="Ver descrição de maestria" data-eye="${idx}">👁</button>` : ""}
        </div>
      </td>
      <td style="text-align:center; white-space:nowrap;">
        <button type="button" class="action-icon" aria-label="Editar ataque ${atk.nome || ""}" data-edit-atk="${idx}">✏️</button>
        <span class="tag-remove" role="button" aria-label="Eliminar ataque ${atk.nome || ""}" data-del-atk="${idx}">×</span>
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
      const sel = listaAtaques[i]?.maestria || "";
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
      listaAtaques.splice(parseInt(e.currentTarget.dataset.delAtk, 10), 1);
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
    const isCond = chave === "condicoes";
    tag.innerHTML = `<span>${texto}</span>${isCond ? `<button type="button" class="eye-btn" aria-label="Ver descrição de ${texto}" data-cond-eye="${texto}">👁</button>` : ""}<span class="tag-remove" role="button" aria-label="Excluir tag ${texto}" data-key="${chave}" data-idx="${idx}">×</span>`;
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

    const isProfSave = document.getElementById(`save-prof-${attr.id}`)?.checked;
    const saveTotal = mod + (isProfSave ? profBonus : 0);
    const saveEl = document.getElementById(`save-val-${attr.id}`);
    if (saveEl) saveEl.textContent = formatMod(saveTotal);
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

  renderizarAtaques();
  atualizarPreviewAtaque();
};

const popularCampos = (d, protegerFoco) => {
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

  const inspEl = document.getElementById("char-inspiration");
  if (inspEl && !(protegerFoco && document.activeElement === inspEl)) {
    inspEl.checked = !!d.inspiracao;
  }

  setVal("char-notes", d.notas, "");
  setVal("char-about", d.sobre, "");

  atributosLista.forEach((attr) => {
    if (d.atributos?.[attr.id] !== undefined)
      setVal(`attr-${attr.id}`, d.atributos[attr.id]);
    if (d.saves?.[attr.id] !== undefined)
      setVal(`save-prof-${attr.id}`, d.saves[attr.id]);
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
    Object.keys(listasDinamicas).forEach((k) => {
      listasDinamicas[k] = d.tags[k] || [];
      renderizarTags(k);
    });
  }

  listaAtaques = normalizarListaAtaques(d.ataques || []);
  recalcularTudo();
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
    recalcularTudo();
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
    ataques: normalizarListaAtaques(listaAtaques),
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
    status.textContent = "✓ Salvo";
    setTimeout(() => {
      status.textContent = "";
    }, 1500);
  } else {
    console.error(error);
    status.style.color = "#ff4444";
    status.textContent = "Erro ao salvar";
  }
}

export function agendarSalvoSilencioso() {
  mudancaPendente = true;
  const status = document.getElementById("status-msg");
  if (status) {
    status.style.color = "#888";
    status.textContent = "alterações pendentes...";
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
  popularCampos(d, true);
}
