import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://skrfdygwqkjxcbtiifnd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrcmZkeWd3cWtqeGNidGlpZm5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MzYwMTksImV4cCI6MjA5ODAxMjAxOX0.CycfJgnGMgi7lru_OinwOECXGKrugQrPLwgg-ZUlc3c";
const supabase = createClient(supabaseUrl, supabaseKey);

const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get("char") || "grom";

const atributosLista = [
  "Força",
  "Destreza",
  "Constituição",
  "Inteligência",
  "Sabedoria",
  "Carisma",
];
const grid = document.getElementById("attributes-grid");

atributosLista.forEach((attr) => {
  const idClean = attr
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const div = document.createElement("div");
  div.className = "attr-card";
  div.innerHTML = `
    <span>${attr}</span>
    <input type="number" id="attr-${idClean}" value="10" step="1" />
  `;
  grid.appendChild(div);
});

// Trava matemática: força qualquer coisa virar um número inteiro absoluto
const toInt = (val) => {
  const n = parseInt(val, 10);
  return isNaN(n) ? 0 : n;
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
      ca: 10,
      hp_atual: 10,
      hp_max: 10,
      atributos: {
        forca: 10,
        destreza: 10,
        constituicao: 10,
        inteligencia: 10,
        sabedoria: 10,
        carisma: 10,
      },
    };
    await supabase
      .from("personagens")
      .insert([{ slug: slug, dados: fichaInicial }]);
    return;
  }

  const d = data.dados;
  document.getElementById("char-name").value = d.nome || "";
  document.getElementById("char-class").value = d.classe || "";
  document.getElementById("char-ac").value = d.ca || 10;
  document.getElementById("char-hp-atual").value = d.hp_atual || 10;
  document.getElementById("char-hp-max").value = d.hp_max || 10;

  atributosLista.forEach((attr) => {
    const idClean = attr
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    if (d.atributos && d.atributos[idClean] !== undefined) {
      document.getElementById(`attr-${idClean}`).value = d.atributos[idClean];
    }
  });
}

async function executarSalvar() {
  const status = document.getElementById("status-msg");
  status.style.color = "#ffaa00";
  status.innerText = "☁️ Salvando...";

  const hpAtualEl = document.getElementById("char-hp-atual");
  const hpMaxEl = document.getElementById("char-hp-max");
  const caEl = document.getElementById("char-ac");

  // Aplica a trava de inteiros no visual da tela antes de mandar pro banco
  hpAtualEl.value = toInt(hpAtualEl.value);
  hpMaxEl.value = toInt(hpMaxEl.value);
  caEl.value = toInt(caEl.value);

  const atributosAtualizados = {};
  atributosLista.forEach((attr) => {
    const idClean = attr
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const el = document.getElementById(`attr-${idClean}`);
    el.value = toInt(el.value);
    atributosAtualizados[idClean] = toInt(el.value);
  });

  const dadosNovos = {
    nome: document.getElementById("char-name").value,
    classe: document.getElementById("char-class").value,
    ca: toInt(caEl.value),
    hp_atual: toInt(hpAtualEl.value),
    hp_max: toInt(hpMaxEl.value),
    atributos: atributosAtualizados,
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

// --- MÁGICA DO AUTO-SAVE COM DEBOUNCE ---
let timerSalvar;
function gatilhoDigitacao() {
  clearTimeout(timerSalvar);
  const status = document.getElementById("status-msg");
  status.style.color = "#888";
  status.innerText = "digitando...";

  // Se passar 800ms sem nenhuma nova digitação, ele efetiva o save
  timerSalvar = setTimeout(executarSalvar, 800);
}

// O site passa a escutar digitações em QUALQUER lugar da ficha
document.getElementById("app").addEventListener("input", gatilhoDigitacao);

// Mantemos o botão visível só como "conforto psicológico" pro jogador
document.getElementById("save-btn").addEventListener("click", () => {
  clearTimeout(timerSalvar);
  executarSalvar();
});

// --- REALTIME INTELIGENTE (Não rouba o foco do teclado) ---
const atualizarSeLivre = (id, valor) => {
  const el = document.getElementById(id);
  if (document.activeElement !== el) {
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

      atualizarSeLivre("char-name", d.nome || "");
      atualizarSeLivre("char-class", d.classe || "");
      atualizarSeLivre("char-ac", d.ca || 10);
      atualizarSeLivre("char-hp-atual", d.hp_atual || 10);
      atualizarSeLivre("char-hp-max", d.hp_max || 10);

      atributosLista.forEach((attr) => {
        const idClean = attr
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        if (d.atributos && d.atributos[idClean] !== undefined) {
          atualizarSeLivre(`attr-${idClean}`, d.atributos[idClean]);
        }
      });

      const status = document.getElementById("status-msg");
      status.style.color = "#00aaff";
      status.innerText = "⚡ Sincronizado";
      setTimeout(() => {
        status.innerText = "";
      }, 1500);
    },
  )
  .subscribe();

carregarFicha();
