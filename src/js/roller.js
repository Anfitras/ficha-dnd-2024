import { toInt } from "./utils.js";

export const rolarDado = (titulo, modificadorTexto) => {
  const chkAdv = document.getElementById("roll-adv");
  const chkDis = document.getElementById("roll-dis");
  const adv = chkAdv?.checked;
  const dis = chkDis?.checked;

  const roll1 = Math.floor(Math.random() * 20) + 1;
  const roll2 = Math.floor(Math.random() * 20) + 1;

  let dadoFinal = roll1;
  let tipoRolagem = "Normal";

  if (adv && !dis) {
    dadoFinal = Math.max(roll1, roll2);
    tipoRolagem = `Vantagem (${roll1}, ${roll2})`;
  } else if (dis && !adv) {
    dadoFinal = Math.min(roll1, roll2);
    tipoRolagem = `Desvantagem (${roll1}, ${roll2})`;
  }

  const mod = toInt(modificadorTexto);
  const total = dadoFinal + mod;

  const modal = document.getElementById("roll-modal");
  const elTitle = document.getElementById("roll-title");
  const elDice = document.getElementById("roll-dice-res");
  const elMod = document.getElementById("roll-mod-res");
  const elTotal = document.getElementById("roll-total-res");
  const elDetails = document.getElementById("roll-details");

  if (elTitle) elTitle.textContent = titulo.toUpperCase();
  if (elDice) {
    elDice.textContent = dadoFinal;
    elDice.classList.toggle("crit", dadoFinal === 1 || dadoFinal === 20);
  }
  if (elMod) elMod.textContent = mod >= 0 ? `+ ${mod}` : `- ${Math.abs(mod)}`;
  if (elTotal) elTotal.textContent = `= ${total}`;
  if (elDetails) elDetails.textContent = tipoRolagem;

  if (modal) {
    document.querySelectorAll(".pin-overlay").forEach((m) => {
      m.style.display = "none";
    });
    const masteryModal = document.getElementById("mastery-modal");
    if (masteryModal) masteryModal.style.display = "none";

    modal.style.display = "block";
  }

  if (chkAdv) chkAdv.checked = false;
  if (chkDis) chkDis.checked = false;
};
