import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://skrfdygwqkjxcbtiifnd.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrcmZkeWd3cWtqeGNidGlpZm5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MzYwMTksImV4cCI6MjA5ODAxMjAxOX0.CycfJgnGMgi7lru_OinwOECXGKrugQrPLwgg-ZUlc3c";
const supabase = createClient(supabaseUrl, supabaseKey);

const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get("char") || "grom";

const atributosLista = [
  { id: "forca", nome: "Força" },
  { id: "destreza", nome: "Destreza" },
  { id: "constituicao", nome: "Constituição" },
  { id: "inteligencia", nome: "Inteligência" },
  { id: "sabedoria", nome: "Sabedoria" },
  { id: "carisma", nome: "Carisma" },
];

const periciasLista = [
  { id: "acrobacia", nome: "Acrobacia" },
  { id: "arcanismo", nome: "Arcanismo" },
  { id: "atletismo", nome: "Atletismo" },
  { id: "atuacao", nome: "Atuação" },
  { id: "enganacao", nome: "Enganação" },
  { id: "furtividade", nome: "Furtividade" },
  { id: "historia", nome: "História" },
  { id: "intimidacao", nome: "Intimidação" },
  { id: "intuicao", nome: "Intuição" },
  { id: "investigacao", nome: "Investigação" },
  { id: "lidar_animais", nome: "Lidar com Animais" },
  { id: "medicina", nome: "Medicina" },
  { id: "natureza", nome: "Natureza" },
  { id: "percepcao", nome: "Percepção" },
  { id: "persuasao", nome: "Persuasão" },
  { id: "prestidigitacao", nome: "Prestidigitação" },
  { id: "religiao", nome: "Religião" },
  { id: "sobrevivencia", nome: "Sobrevivência" },
];

const gridAttr = document.getElementById("attributes-grid");
const gridSaves = document.getElementById("saves-grid");
const skillsContainer = document.getElementById("skills-list");

const toInt = (val) => {
  const n = parseInt(val, 10);
  return isNaN(n) ? 0 : n;
};

const formatMod = (val) => (val >= 0 ? `+${val}` : `${val}`);

const getProfBonus = (nivel) => Math.ceil(nivel / 4) + 1;

atributosLista.forEach((attr) => {
  const cardA = document.createElement("div");
  cardA.className = "attr-box";
  cardA.innerHTML = `
    <span class="attr-label">${attr.nome}</span>
    <input type="number" id="attr-${attr.id}" value="10" />
    <span class="attr-mod" id="mod-${attr.id}">+0</span>
  `;
  gridAttr.appendChild(cardA);

  const cardS = document.createElement("div");
  cardS.className = "save-box";
  cardS.innerHTML = `
    <input type="checkbox" id="save-prof-${attr.id}" />
    <span>${attr.nome.slice(0, 3).toUpperCase()}</span>
    <span id="save-val-${attr.id}">+0</span>
  `;
  gridSaves.appendChild(cardS);
});

periciasLista.forEach((p) => {
  const row = document.createElement("div");
  row.className = "skill-row";
  row.innerHTML = `
    <input type="checkbox" id="skill-prof-${p.id}" />
    <span>${p.nome}</span>
    <input type="number" id="skill-extra-${p.id}" class="skill-extra" value="0" />
    <span id="skill-total-${p.id}" class="skill-total">+0</span>
  `;
  skillsContainer.appendChild(row);
});

const abas = document.querySelectorAll(".tab-btn");
abas.forEach((btn) => {
  btn.addEventListener("click", () => {
    abas.forEach((b) => b.classList.remove("active"));
    document
      .querySelectorAll(".tab-content")
      .forEach((c) => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.target).classList.add("active");
  });
});

const recalcularTudo = () => {
  const nivelEl = document.getElementById("char-level");
  let nivel = toInt(nivelEl.value);
  if (nivel < 1) nivel = 1;
  if (nivel > 20) nivel = 20;
  if (document.activeElement !== nivelEl) nivelEl.value = nivel;

  const profBonus = getProfBonus(nivel);
  document.getElementById("char-prof-bonus").value = formatMod(profBonus);
  document.getElementById("hd-max-label").innerText = nivel;

  const desVal = toInt(document.getElementById("attr-destreza").value);
  const desMod = Math.floor((desVal - 10) / 2);
  const initOutro = toInt(document.getElementById("char-init-outro").value);
  document.getElementById("char-init-val").innerText = formatMod(
    desMod + initOutro,
  );

  atributosLista.forEach((attr) => {
    const val = toInt(document.getElementById(`attr-${attr.id}`).value);
    const mod = Math.floor((val - 10) / 2);
    document.getElementById(`mod-${attr.id}`).innerText = formatMod(mod);

    const isProfSave = document.getElementById(`save-prof-${attr.id}`).checked;
    const saveTotal = mod + (isProfSave ? profBonus : 0);
    document.getElementById(`save-val-${attr.id}`).innerText =
      formatMod(saveTotal);
  });

  periciasLista.forEach((p) => {
    const isProf = document.getElementById(`skill-prof-${p.id}`).checked;
    const extra = toInt(document.getElementById(`skill-extra-${p.id}`).value);
    const total = (isProf ? profBonus : 0) + extra;
    document.getElementById(`skill-total-${p.id}`).innerText = formatMod(total);
  });
};

async function carregarFicha() {
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
      init_outro: 0,
      hp_atual: 10,
      hp_max: 10,
      hp_temp: 0,
      hd_atual: 1,
      hd_type: "1d8",
      inspiracao: false,
      atributos: {
        forca: 10,
        destreza: 10,
        constituicao: 10,
        inteligencia: 10,
        sabedoria: 10,
        carisma: 10,
      },
      saves: {},
      skills: { prof: {}, extra: {} },
    };
    await supabase
      .from("personagens")
      .insert([{ slug: slug, dados: fichaInicial }]);
    recalcularTudo();
    return;
  }

  const d = data.dados;
  document.getElementById("char-name").value = d.nome || "";
  document.getElementById("char-class").value = d.classe || "";
  document.getElementById("char-subclass").value = d.subclasse || "";
  document.getElementById("char-level").value = d.nivel || 1;
  document.getElementById("char-species").value = d.especie || "";
  document.getElementById("char-background").value = d.antecedente || "";
  document.getElementById("char-xp").value = d.xp || "";
  document.getElementById("char-ac").value = d.ca !== undefined ? d.ca : 10;
  document.getElementById("char-speed").value = d.deslocamento || "9m";
  document.getElementById("char-init-outro").value = d.init_outro || 0;
  document.getElementById("char-hp-atual").value = d.hp_atual || 10;
  document.getElementById("char-hp-max").value = d.hp_max || 10;
  document.getElementById("char-hp-temp").value = d.hp_temp || 0;
  document.getElementById("char-hd-atual").value =
    d.hd_atual !== undefined ? d.hd_atual : d.nivel || 1;
  document.getElementById("char-hd-type").value = d.hd_type || "1d8";
  document.getElementById("char-inspiration").checked = !!d.inspiracao;

  atributosLista.forEach((attr) => {
    const el = document.getElementById(`attr-${attr.id}`);
    if (d.atributos && d.atributos[attr.id] !== undefined)
      el.value = d.atributos[attr.id];
    if (d.saves && d.saves[attr.id] !== undefined)
      document.getElementById(`save-prof-${attr.id}`).checked =
        d.saves[attr.id];
  });

  periciasLista.forEach((p) => {
    if (d.skills && d.skills.prof && d.skills.prof[p.id] !== undefined)
      document.getElementById(`skill-prof-${p.id}`).checked =
        d.skills.prof[p.id];
    if (d.skills && d.skills.extra && d.skills.extra[p.id] !== undefined)
      document.getElementById(`skill-extra-${p.id}`).value =
        d.skills.extra[p.id];
  });

  recalcularTudo();
}

async function executarSalvar() {
  const status = document.getElementById("status-msg");
  status.style.color = "#ffaa00";
  status.innerText = "☁️ Sincronizando...";

  const savesEstado = {};
  const atributosAtualizados = {};
  atributosLista.forEach((attr) => {
    savesEstado[attr.id] = document.getElementById(
      `save-prof-${attr.id}`,
    ).checked;
    atributosAtualizados[attr.id] = toInt(
      document.getElementById(`attr-${attr.id}`).value,
    );
  });

  const periciasProf = {};
  const periciasExtra = {};
  periciasLista.forEach((p) => {
    periciasProf[p.id] = document.getElementById(`skill-prof-${p.id}`).checked;
    periciasExtra[p.id] = toInt(
      document.getElementById(`skill-extra-${p.id}`).value,
    );
  });

  const dadosNovos = {
    nome: document.getElementById("char-name").value,
    classe: document.getElementById("char-class").value,
    subclasse: document.getElementById("char-subclass").value,
    nivel: toInt(document.getElementById("char-level").value),
    especie: document.getElementById("char-species").value,
    antecedente: document.getElementById("char-background").value,
    xp: document.getElementById("char-xp").value,
    ca: toInt(document.getElementById("char-ac").value),
    deslocamento: document.getElementById("char-speed").value,
    init_outro: toInt(document.getElementById("char-init-outro").value),
    hp_atual: toInt(document.getElementById("char-hp-atual").value),
    hp_max: toInt(document.getElementById("char-hp-max").value),
    hp_temp: toInt(document.getElementById("char-hp-temp").value),
    hd_atual: toInt(document.getElementById("char-hd-atual").value),
    hd_type: document.getElementById("char-hd-type").value,
    inspiracao: document.getElementById("char-inspiration").checked,
    atributos: atributosAtualizados,
    saves: savesEstado,
    skills: { prof: periciasProf, extra: periciasExtra },
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
  }
}

let timerSalvar;
function gatilhoAlteracao() {
  clearTimeout(timerSalvar);
  const status = document.getElementById("status-msg");
  status.style.color = "#888";
  status.innerText = "alterando...";
  timerSalvar = setTimeout(executarSalvar, 800);
}

const appEl = document.getElementById("app");
appEl.addEventListener("input", () => {
  recalcularTudo();
  gatilhoAlteracao();
});
appEl.addEventListener("change", () => {
  recalcularTudo();
  gatilhoAlteracao();
});

const setCampo = (id, valor) => {
  const el = document.getElementById(id);
  if (!el || document.activeElement === el) return;
  if (el.type === "checkbox") {
    el.checked = !!valor;
  } else {
    el.value = valor;
  }
};

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

      setCampo("char-name", d.nome || "");
      setCampo("char-class", d.classe || "");
      setCampo("char-subclass", d.subclasse || "");
      setCampo("char-level", d.nivel || 1);
      setCampo("char-species", d.especie || "");
      setCampo("char-background", d.antecedente || "");
      setCampo("char-xp", d.xp || "");
      setCampo("char-ac", d.ca !== undefined ? d.ca : 10);
      setCampo("char-speed", d.deslocamento || "9m");
      setCampo("char-init-outro", d.init_outro || 0);
      setCampo("char-hp-atual", d.hp_atual || 10);
      setCampo("char-hp-max", d.hp_max || 10);
      setCampo("char-hp-temp", d.hp_temp || 0);
      setCampo(
        "char-hd-atual",
        d.hd_atual !== undefined ? d.hd_atual : d.nivel || 1,
      );
      setCampo("char-hd-type", d.hd_type || "1d8");
      setCampo("char-inspiration", d.inspiracao);

      atributosLista.forEach((attr) => {
        if (d.atributos && d.atributos[attr.id] !== undefined)
          setCampo(`attr-${attr.id}`, d.atributos[attr.id]);
        if (d.saves && d.saves[attr.id] !== undefined)
          setCampo(`save-prof-${attr.id}`, d.saves[attr.id]);
      });

      periciasLista.forEach((p) => {
        if (d.skills && d.skills.prof && d.skills.prof[p.id] !== undefined)
          setCampo(`skill-prof-${p.id}`, d.skills.prof[p.id]);
        if (d.skills && d.skills.extra && d.skills.extra[p.id] !== undefined)
          setCampo(`skill-extra-${p.id}`, d.skills.extra[p.id]);
      });

      recalcularTudo();

      const status = document.getElementById("status-msg");
      status.style.color = "#00aaff";
      status.innerText = "⚡ Mesa Sincronizada";
      setTimeout(() => {
        status.innerText = "";
      }, 1500);
    },
  )
  .subscribe();

carregarFicha();
