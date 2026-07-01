import { supabase, slug, sessaoLocalId } from "./supabase.js";
import { iniciarAuth } from "./auth.js";
import { toInt } from "./utils.js";

let dmDados = { npcs: [] };
let npcsEmEdicaoId = null;
let timerSalvarNPC = null;
let npcsAtivos = [];

const calcularModificador = (valor) => Math.floor((toInt(valor) - 10) / 2);

const getProfBonus = (nivel) => Math.ceil(toInt(nivel) / 4) + 1;

const renderizarJogadores = async () => {
  const container = document.getElementById("players-overview");
  if (!container) return;
  const { data, error } = await supabase
    .from("personagens")
    .select("*")
    .neq("slug", "dm");
  if (error || !data) return;

  container.innerHTML = "";
  data.forEach((char) => {
    const d = char.dados;
    const profBonus = getProfBonus(d.nivel);
    const sabMod = calcularModificador(d.atributos?.sabedoria);
    const intMod = calcularModificador(d.atributos?.inteligencia);

    let percProfMult =
      d.skills?.prof?.percepcao !== undefined
        ? toInt(d.skills.prof.percepcao)
        : 0;
    let invProfMult =
      d.skills?.prof?.investigacao !== undefined
        ? toInt(d.skills.prof.investigacao)
        : 0;

    const passivePerc = 10 + sabMod + percProfMult * profBonus;
    const passiveInv = 10 + intMod + invProfMult * profBonus;
    const acTotal = d.ca || 10;

    container.innerHTML += `
      <div class="player-mini-card">
        <div class="pmc-header">
          <span class="pmc-name">${d.nome || "Sem Nome"}<span class="pmc-player-name">(${char.slug})</span></span>
          <span class="pmc-hp">${d.hp_atual || 0} / ${d.hp_max || 0} PV</span>
        </div>
        <div class="pmc-stats">
          <div class="pmc-stat-box"><label>CA</label><span>${acTotal}</span></div>
          <div class="pmc-stat-box"><label>NÍVEL</label><span>${d.nivel || 1}</span></div>
          <div class="pmc-stat-box"><label>DESLOCAMENTO</label><span>${d.deslocamento || "9m"}</span></div>
        </div>
        <div class="pmc-passives">
          <div><label>PERCEPÇÃO PASSIVA</label><span>${passivePerc}</span></div>
          <div><label>INVESTIGAÇÃO PASSIVA</label><span>${passiveInv}</span></div>
        </div>
      </div>
    `;
  });
};

const renderizarNPCs = () => {
  const sidebar = document.getElementById("npc-sidebar-list");
  const container = document.getElementById("active-npcs-grid");
  if (!sidebar || !container) return;

  sidebar.innerHTML = "";
  container.innerHTML = "";

  dmDados.npcs.forEach((npc) => {
    const li = document.createElement("li");
    li.className = `npc-sidebar-item ${npcsAtivos.includes(npc.id) ? "active" : ""}`;
    li.innerHTML = `
      <span>${npc.nome}</span>
      <span class="tag-remove sidebar-npc-del" role="button">×</span>
    `;

    li.onclick = (e) => {
      if (e.target.closest(".sidebar-npc-del")) return;
      if (npcsAtivos.includes(npc.id)) {
        npcsAtivos = npcsAtivos.filter((id) => id !== npc.id);
      } else {
        if (npcsAtivos.length >= 4) npcsAtivos.shift();
        npcsAtivos.push(npc.id);
      }
      renderizarNPCs();
    };

    const delBtn = li.querySelector(".sidebar-npc-del");
    delBtn.onclick = async (e) => {
      e.stopPropagation();
      if (window.confirm(`Deseja excluir permanentemente o NPC ${npc.nome}?`)) {
        dmDados.npcs = dmDados.npcs.filter((n) => n.id !== npc.id);
        npcsAtivos = npcsAtivos.filter((id) => id !== npc.id);
        renderizarNPCs();
        await salvarDM();
      }
    };

    sidebar.appendChild(li);
  });

  npcsAtivos.forEach((id) => {
    const npc = dmDados.npcs.find((n) => n.id === id);
    if (!npc) return;
    container.innerHTML += `
      <div class="npc-statblock">
        <div class="npc-controls">
          <button type="button" class="action-icon" data-edit-npc="${npc.id}"><span class="icon-edit"></span></button>
          <span class="tag-remove" role="button" data-close-npc="${npc.id}">×</span>
        </div>
        <div class="npc-sb-header">
          <h2>${npc.nome}</h2>
          <p>${npc.tipo}</p>
        </div>
        <div class="npc-sb-divider"></div>
        <div class="npc-sb-basics">
          <p><strong>CA</strong> ${npc.ca}</p>
          <p><strong>PV</strong> ${npc.hp}</p>
          <p><strong>Deslocamento</strong> ${npc.desl}</p>
        </div>
        <div class="npc-sb-divider"></div>
        <div class="npc-sb-attrs">
          <div class="npc-sb-attr-col"><strong>FOR</strong><span>${npc.for} (${calcularModificador(npc.for) >= 0 ? "+" : ""}${calcularModificador(npc.for)})</span></div>
          <div class="npc-sb-attr-col"><strong>DES</strong><span>${npc.des} (${calcularModificador(npc.des) >= 0 ? "+" : ""}${calcularModificador(npc.des)})</span></div>
          <div class="npc-sb-attr-col"><strong>CON</strong><span>${npc.con} (${calcularModificador(npc.con) >= 0 ? "+" : ""}${calcularModificador(npc.con)})</span></div>
          <div class="npc-sb-attr-col"><strong>INT</strong><span>${npc.int} (${calcularModificador(npc.int) >= 0 ? "+" : ""}${calcularModificador(npc.int)})</span></div>
          <div class="npc-sb-attr-col"><strong>SAB</strong><span>${npc.sab} (${calcularModificador(npc.sab) >= 0 ? "+" : ""}${calcularModificador(npc.sab)})</span></div>
          <div class="npc-sb-attr-col"><strong>CAR</strong><span>${npc.car} (${calcularModificador(npc.car) >= 0 ? "+" : ""}${calcularModificador(npc.car)})</span></div>
        </div>
        <div class="npc-sb-divider"></div>
        <div class="npc-sb-details">
          ${npc.pericias ? `<p><strong>Perícias</strong> ${npc.pericias}</p>` : ""}
          ${npc.resistencias ? `<p><strong>Resistências</strong> ${npc.resistencias}</p>` : ""}
          ${npc.sentidos ? `<p><strong>Sentidos</strong> ${npc.sentidos}</p>` : ""}
          ${npc.idiomas ? `<p><strong>Idiomas</strong> ${npc.idiomas}</p>` : ""}
          ${npc.nd ? `<p><strong>ND</strong> ${npc.nd}</p>` : ""}
        </div>
        <div class="npc-sb-divider"></div>
        <div class="npc-sb-traits">
          ${npc.tracos ? `<h3>Traços</h3><p>${npc.tracos.replace(/\n/g, "<br>")}</p>` : ""}
          ${npc.acoes ? `<h3>Ações</h3><p>${npc.acoes.replace(/\n/g, "<br>")}</p>` : ""}
        </div>
      </div>
    `;
  });

  container.querySelectorAll("[data-edit-npc]").forEach((btn) => {
    btn.onclick = (e) => abrirModalNPC(e.currentTarget.dataset.editNpc);
  });

  container.querySelectorAll("[data-close-npc]").forEach((btn) => {
    btn.onclick = (e) => {
      const idParaFechar = e.currentTarget.dataset.closeNpc;
      npcsAtivos = npcsAtivos.filter((id) => id !== idParaFechar);
      renderizarNPCs();
    };
  });
};

const lerFormNPC = () => ({
  id: npcsEmEdicaoId || crypto.randomUUID(),
  nome: document.getElementById("npc-inp-nome").value,
  tipo: document.getElementById("npc-inp-tipo").value,
  ca: document.getElementById("npc-inp-ca").value,
  hp: document.getElementById("npc-inp-hp").value,
  desl: document.getElementById("npc-inp-desl").value,
  for: document.getElementById("npc-inp-for").value || 10,
  des: document.getElementById("npc-inp-des").value || 10,
  con: document.getElementById("npc-inp-con").value || 10,
  int: document.getElementById("npc-inp-int").value || 10,
  sab: document.getElementById("npc-inp-sab").value || 10,
  car: document.getElementById("npc-inp-car").value || 10,
  pericias: document.getElementById("npc-inp-pericias").value,
  resistencias: document.getElementById("npc-inp-res").value,
  sentidos: document.getElementById("npc-inp-sentidos").value,
  idiomas: document.getElementById("npc-inp-idiomas").value,
  nd: document.getElementById("npc-inp-nd").value,
  tracos: document.getElementById("npc-inp-tracos").value,
  acoes: document.getElementById("npc-inp-acoes").value,
});

const registrarNPCEmEdicao = () => {
  const nome = document.getElementById("npc-inp-nome")?.value.trim();
  if (!npcsEmEdicaoId && !nome) return;

  const npc = lerFormNPC();
  const idx = dmDados.npcs.findIndex((x) => x.id === npc.id);
  if (idx > -1) dmDados.npcs[idx] = npc;
  else dmDados.npcs.push(npc);
};

const agendarSalvamentoNPC = () => {
  clearTimeout(timerSalvarNPC);
  timerSalvarNPC = setTimeout(async () => {
    registrarNPCEmEdicao();
    if (dmDados.npcs.length > 0) {
      await salvarDM();
    }
  }, 500);
};

const abrirModalNPC = (id) => {
  npcsEmEdicaoId = id || crypto.randomUUID();
  const modal = document.getElementById("npc-modal");
  const n = dmDados.npcs.find((x) => x.id === id) || {};
  document.getElementById("npc-modal-title").textContent = id
    ? "EDITAR NPC"
    : "CRIAR NOVO NPC";
  document.getElementById("npc-inp-nome").value = n.nome || "";
  document.getElementById("npc-inp-tipo").value = n.tipo || "";
  document.getElementById("npc-inp-ca").value = n.ca || "";
  document.getElementById("npc-inp-hp").value = n.hp || "";
  document.getElementById("npc-inp-desl").value = n.desl || "";
  document.getElementById("npc-inp-for").value = n.for || 10;
  document.getElementById("npc-inp-des").value = n.des || 10;
  document.getElementById("npc-inp-con").value = n.con || 10;
  document.getElementById("npc-inp-int").value = n.int || 10;
  document.getElementById("npc-inp-sab").value = n.sab || 10;
  document.getElementById("npc-inp-car").value = n.car || 10;
  document.getElementById("npc-inp-pericias").value = n.pericias || "";
  document.getElementById("npc-inp-res").value = n.resistencias || "";
  document.getElementById("npc-inp-sentidos").value = n.sentidos || "";
  document.getElementById("npc-inp-idiomas").value = n.idiomas || "";
  document.getElementById("npc-inp-nd").value = n.nd || "";
  document.getElementById("npc-inp-tracos").value = n.tracos || "";
  document.getElementById("npc-inp-acoes").value = n.acoes || "";
  modal.style.display = "flex";
};

const salvarDM = async () => {
  const status = document.getElementById("status-msg");
  if (status) status.textContent = "Salvando...";
  dmDados._remetente = sessaoLocalId;
  const { error } = await supabase
    .from("personagens")
    .upsert([{ slug: "dm", dados: dmDados }], { onConflict: "slug" });
  if (error) {
    if (status) {
      status.style.color = "#ff4444";
      status.textContent = "Erro ao salvar";
    }
    return false;
  }
  if (status) {
    status.style.color = "#00cc66";
    status.textContent = "✓ Salvo";
    setTimeout(() => (status.textContent = ""), 1500);
  }
  return true;
};

const carregarDM = async () => {
  const { data } = await supabase
    .from("personagens")
    .select("*")
    .eq("slug", "dm")
    .single();
  if (data && data.dados) {
    dmDados = data.dados;
    if (!dmDados.npcs) dmDados.npcs = [];
  }
  renderizarNPCs();
  renderizarJogadores();
};

if (iniciarAuth()) {
  carregarDM();

  supabase
    .channel("canal-dm")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "personagens" },
      (p) => {
        if (p.new.slug === "dm" && p.new.dados._remetente !== sessaoLocalId) {
          dmDados = p.new.dados;
          if (!dmDados.npcs) dmDados.npcs = [];
          renderizarNPCs();
        } else if (p.new.slug !== "dm") {
          renderizarJogadores();
        }
      },
    )
    .subscribe();

  document.getElementById("add-npc-btn").onclick = () => abrirModalNPC(null);
  document.getElementById("npc-modal-close").onclick = () =>
    (document.getElementById("npc-modal").style.display = "none");
  document.getElementById("npc-btn-save").onclick = async () => {
    clearTimeout(timerSalvarNPC);
    registrarNPCEmEdicao();
    document.getElementById("npc-modal").style.display = "none";

    if (!npcsAtivos.includes(npcsEmEdicaoId) && npcsEmEdicaoId) {
      if (npcsAtivos.length >= 4) npcsAtivos.shift();
      npcsAtivos.push(npcsEmEdicaoId);
    }

    renderizarNPCs();
    await salvarDM();
  };

  [
    "npc-inp-nome",
    "npc-inp-tipo",
    "npc-inp-ca",
    "npc-inp-hp",
    "npc-inp-desl",
    "npc-inp-for",
    "npc-inp-des",
    "npc-inp-con",
    "npc-inp-int",
    "npc-inp-sab",
    "npc-inp-car",
    "npc-inp-pericias",
    "npc-inp-res",
    "npc-inp-sentidos",
    "npc-inp-idiomas",
    "npc-inp-nd",
    "npc-inp-tracos",
    "npc-inp-acoes",
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", agendarSalvamentoNPC);
    el.addEventListener("change", agendarSalvamentoNPC);
  });
}
