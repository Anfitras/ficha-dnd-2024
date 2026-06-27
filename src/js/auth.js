import { slug } from "./supabase.js";

export const mesa = [
  { id: "arthur", nome: "Arthur", pin: "4189" },
  { id: "duda", nome: "Duda", pin: "7392" },
  { id: "pedro", nome: "Pedro", pin: "1054" },
  { id: "natasha", nome: "Natasha", pin: "8839" },
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
      mesa.forEach((p) => {
        const link = document.createElement("a");
        link.className = "player-card";
        link.href = `/?char=${p.id}`;
        link.innerHTML = `<h3>${p.nome}</h3><span>Acessar Grimório</span>`;
        gridPlayers.appendChild(link);
      });
    }
    return false;
  }

  const pAtual = mesa.find((p) => p.id === slug);
  const pinOk = localStorage.getItem(`auth_ok_${slug}`);

  if (pAtual && pinOk !== pAtual.pin) {
    if (mainApp) mainApp.style.display = "none";
    if (pinModal) pinModal.style.display = "flex";

    const targetName = document.getElementById("pin-target-name");
    if (targetName)
      targetName.innerText = `GRIMÓRIO DE ${pAtual.nome.toUpperCase()}`;

    const inp = document.getElementById("pin-input");
    const err = document.getElementById("pin-error");

    const validarPin = () => {
      if (!inp) return;
      if (inp.value === pAtual.pin) {
        localStorage.setItem(`auth_ok_${slug}`, pAtual.pin);
        if (pinModal) pinModal.style.display = "none";
        if (mainApp) mainApp.style.display = "block";
      } else {
        if (err) err.innerText = "CÓDIGO INVÁLIDO";
        inp.value = "";
      }
    };

    document
      .getElementById("pin-submit")
      ?.addEventListener("click", validarPin);
    inp?.addEventListener("keyup", (e) => {
      if (e.key === "Enter") validarPin();
    });
  }
  return true;
}
