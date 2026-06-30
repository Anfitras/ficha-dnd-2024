export const toInt = (val) => {
  const n = parseInt(val, 10);
  return isNaN(n) ? 0 : n;
};

export const formatMod = (val) => (val >= 0 ? `+${val}` : `${val}`);

export const getProfBonus = (nivel) => Math.ceil(nivel / 4) + 1;
