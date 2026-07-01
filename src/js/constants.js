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

export const condicoesDescricoes = {
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
    "Enquanto tem a condição Exaustão, você sofre os seguintes efeitos.<br><br><strong>Níveis de Exaustão.</strong> Essa condição é acumulativa. Cada vez que você a adquire, recebe 1 nível de Exaustão. Você morre se seu nível de Exaustão atingir 6.<br><br><strong>Testes de D20 Afetados.</strong> Ao realizar um Teste de D20, o resultado é reduzido em 2 vezes o seu nível de Exaustão.<br><br><strong>Deslocamento Reduzido.</strong> Seu Deslocamento é reduced por uma quantidade de metros igual a 1,5 vezes o seu nível de Exaustão.<br><br><strong>Remoção de Níveis de Exaustão.</strong> Completar um Descanso Longo remove 1 dos seus níveis de Exaustão. Quando seu nível de Exaustão chega a 0 a condição encerra.",
  Imobilizado:
    "Enquanto tem a condição Imobilizado, você sofre os seguintes efeitos.<br><br><strong>Deslocamento 0.</strong> Seu Deslocamento é 0 e não pode aumentar.<br><br><strong>Ataques Afetados.</strong> Você tem Desvantagem em jogadas de ataque contra qualquer alvo que não seja o imobilizador.<br><br><strong>Móvel.</strong> O imobilizador pode arrastá-lo ou carregá-lo consigo, mas cada metro de movimento custa 1 metro adicional, a menos que você seja Minúsculo ou dois ou mais tamanhos menores que ele.",
  Inconsciente:
    "Enquanto tem a condição Inconsciente, você sofre os seguintes efeitos.<br><br><strong>Inerte.</strong> Você tem as condições Caído e Incapacitado e solta qualquer coisa que estiver segurando. Quando esta condição se encerra, você continua Caído.<br><br><strong>Deslocamento 0.</strong> Seu Deslocamento é 0 e não pode ser aumentado.<br><br><strong>Ataques Afetados.</strong> Jogadas de ataque contra você têm Vantagem.<br><br><strong>Salvaguardas Afetadas.</strong> Você falha automaticamente em salvaguardas de Força e Destreza.<br><br><strong>Acertos Críticos Automáticos.</strong> Qualquer jogada de ataque que o atinge é um Acerto Crítico se o atacante estiver a até 1,5 metro de você.<br><br><strong>Alheio.</strong> Você não está ciente do que está ao seu redor.",
  Invisível:
    "Enquanto tem a condição Invisível, você sofre os seguintes efeitos.<br><br><strong>Surpresa.</strong> Se você está Invisível quando joga Iniciativa, tem Vantagem na jogada.<br><br><strong>Oculto.</strong> Você não é afetado por nenhum efeito que exija que seu alvo seja visto, a menos que o criador do efeito possa vê-lo de alguma forma. Qualquer equipamento que você estiver vestindo ou carregando também está oculto.<br><br><strong>Ataques Afetados.</strong> Jogadas de ataque contra você têm Desvantagem, enquanto suas jogadas de ataque têm Vantagem. Se uma criatura puder vê-lo de alguma forma, você não recebe esse benefício contra ela.",
  Paralisado:
    "Enquanto tem a condição Paralisado, você sofre os seguintes efeitos.<br><br><strong>Incapacitado.</strong> Você adquire a condição Incapacitado.<br><br><strong>Deslocamento 0.</strong> Seu Deslocamento é 0 e não pode aumentar.<br><br><strong>Ataques Afetados.</strong> Jogadas de ataque contra você têm Vantagem.<br><br><strong>Acertos Críticos Automáticos.</strong> Qualquer jogada de ataque que o atinge é um Acerto Crítico se o atacante estiver a até 1,5 metro de você.<br><br><strong>Salvaguardas Afetadas.</strong> Você falha automaticamente em salvaguardas de Força e Destreza.",
  Petrificado:
    "Enquanto tem a condição Petrificado, você sofre os seguintes efeitos.<br><br><strong>Transformado in Substância Inanimada.</strong> Você é transformado, juntamente com qualquer objeto não mágico que esteja vestindo ou carregando, em uma substância sólida e inanimada (geralmente pedra). Seu peso aumenta em dez vezes e você para de envelhecer.<br><br><strong>Incapacitado.</strong> Você adquire a condição Incapacitado.<br><br><strong>Deslocamento 0.</strong> Seu Deslocamento é 0 e não pode aumentar.<br><br><strong>Ataques Afetados.</strong> Jogadas de ataque contra você têm Vantagem.<br><br><strong>Salvaguardas Afetadas.</strong> Você falha automaticamente em salvaguardas de Força e Destreza.<br><br><strong>Resistência a Dano.</strong> Você tem Resistência a todos os danos.<br><br><strong>Imunidade a Veneno.</strong> Você tem Imunidade à condição Envenenado.",
  Surdo:
    "Enquanto estiver na condição Surdo, você sofre o seguinte efeito.<br><br><strong>Não Pode Ouvir.</strong> Você não pode ouvir e falha automaticamente em qualquer teste de atributo que dependa da audição.",
};

export const maestriasDescricoes = {
  "": "Nenhuma maestria selecionada para esta arma.",
  Afligir:
    "Se você atingir uma criatura com esta arma e causar dano a ela, você tem Vantagem em sua próxima jogada de ataque contra essa criatura antes do final do seu próximo turno.",
  Ágil: "Ao realizar o ataque adicional da propriedade Leve, você pode fazêlo como parte da ação Atacar, em vez de uma Ação Bônus. Esse ataque adicional só pode ser realizado uma vez por turno.",
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

export const damageTypesLista = [
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

export const circulosNomesMap = {
  0: "TRUQUES",
  1: "1° CÍRCULO",
  2: "2° CÍRCULO",
  3: "3° CÍRCULO",
  4: "4° CÍRCULO",
  5: "5° CÍRCULO",
  6: "6° CÍRCULO",
  7: "7° CÍRCULO",
  8: "8° CÍRCULO",
  9: "9° CÍRCULO",
};

export const tiposItemLista = [
  "Arma",
  "Armadura",
  "Escudo",
  "Ferramenta",
  "Equipamento de Aventura",
];

export const origensHabilidadeLista = [
  "Talento",
  "Habilidade de Classe",
  "Traço de Espécie",
];
