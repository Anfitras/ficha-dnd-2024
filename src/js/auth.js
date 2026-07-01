import { slug } from "./supabase.js";

export const mesa = [
  { id: "arthur", nome: "Arthur", pin: "4189" },
  { id: "duda", nome: "Duda", pin: "7392" },
  { id: "pedro", nome: "Pedro", pin: "1054" },
  { id: "natasha", nome: "Natasha", pin: "8839" },
  { id: "dm", nome: "Mestre", pin: "1546" },
];

export function iniciarAuth() {
  const mainApp = document.getElementById("app");
  const homeHub = document.getElementById("home-hub");
  const pinModal = document.getElementById("pin-modal");

  if (slug === "home") {
    if (mainApp) mainApp.style.display = "none";
    if (homeHub) homeHub.style.display = "flex";
    const gridPlayers = document.getElementById("players-grid");
    if (gridPlayers) {
      gridPlayers.innerHTML = "";
      mesa.forEach((p) => {
        const link = document.createElement("a");
        link.className = "player-card";
        if (p.id === "dm") link.classList.add("player-card-dm");
        link.href = p.id === "dm" ? `/dm.html?char=dm` : `/?char=${p.id}`;
        link.innerHTML = `<h3>${p.nome}</h3><span>${p.id === "dm" ? "Acessar Painel" : "Acessar Ficha"}</span>`;
        gridPlayers.appendChild(link);
      });
    }
    return false;
  }

  const pAtual = mesa.find((p) => p.id === slug);

  if (!pAtual) {
    window.location.href = "/";
    return false;
  }

  const pinOk = localStorage.getItem(`auth_ok_${slug}`);

  // FIX: Se o PIN já estiver no cache, garante que o app fique visível e encerra a checagem.
  if (pinOk === pAtual.pin) {
    if (mainApp) mainApp.style.display = "block";
    if (pinModal) pinModal.style.display = "none";
    return true;
  }

  // Se o PIN não estiver no cache, esconde o app e mostra o modal
  if (mainApp) mainApp.style.display = "none";
  if (pinModal) pinModal.style.display = "flex";

  const targetName = document.getElementById("pin-target-name");
  if (targetName)
    targetName.textContent =
      pAtual.id === "dm"
        ? "ESCUDO DO MESTRE SELADO"
        : `GRIMÓRIO DE ${pAtual.nome.toUpperCase()}`;

  const inp = document.getElementById("pin-input");
  const err = document.getElementById("pin-error");

  const validarPin = () => {
    if (!inp) return;
    if (inp.value === pAtual.pin) {
      localStorage.setItem(`auth_ok_${slug}`, pAtual.pin);
      if (pinModal) pinModal.style.display = "none";
      if (mainApp) mainApp.style.display = "block";
    } else {
      if (err) err.textContent = "CÓDIGO INVÁLIDO";
      inp.value = "";
    }
  };

  document.getElementById("pin-submit")?.addEventListener("click", validarPin);
  inp?.addEventListener("keyup", (e) => {
    if (e.key === "Enter") validarPin();
  });

  return true;
}
