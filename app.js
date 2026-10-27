var CATALOGO = {
  "Língua Portuguesa": {
    D1: "Localizar informações explícitas em um texto.",
    D2: "Estabelecer relações entre partes de um texto, identificando repetições ou substituições que contribuem para a continuidade de um texto.",
    D3: "Inferir o sentido de uma palavra ou expressão.",
    D4: "Inferir uma informação implícita em um texto.",
    D5: "Interpretar texto com auxílio de material gráfico diverso (propagandas, quadrinhos, foto etc.).",
    D6: "Identificar o tema de um texto.",
    D7: "Identificar o conflito gerador do enredo e os elementos que constroem a narrativa.",
    D8: "Estabelecer relação causa/consequência entre partes e elementos do texto.",
    D9: "Identificar a finalidade de textos de diferentes gêneros.",
    D10: "Identificar as marcas linguísticas que evidenciam o locutor e o interlocutor de um texto.",
    D11: "Distinguir um fato da opinião relativa a esse fato.",
    D12: "Estabelecer relações lógico-discursivas presentes no texto, marcadas por conjunções, advérbios etc.",
    D13: "Identificar efeitos de ironia ou humor em textos variados.",
    D14: "Identificar o efeito de sentido decorrente do uso da pontuação e de outras notações.",
    D15: "Reconhecer diferentes formas de tratar uma informação na comparação de textos que tratam do mesmo tema."
  },
  "Matemática": {
    D1: "Identificar a localização/movimentação de objeto em mapas, croquis e outras representações gráficas.",
    D2: "Identificar propriedades comuns e diferenças entre poliedros e corpos redondos, relacionando figuras tridimensionais com suas planificações.",
    D3: "Identificar propriedades comuns e diferenças entre polígonos, usando como critérios o número de lados e os tipos de ângulos.",
    D4: "Identificar quadriláteros observando as posições relativas entre seus lados (paralelos, concorrentes, perpendiculares).",
    D5: "Reconhecer a conservação ou modificação de medidas dos lados, do perímetro e da área em ampliação e/ou redução de figuras em malhas quadriculadas.",
    D6: "Estimar a medida de grandezas utilizando unidades de medida convencionais ou não.",
    D7: "Resolver problemas significativos utilizando unidades de medida padronizadas como km/m/cm/mm, kg/g/mg, L/mL.",
    D8: "Estabelecer relações entre unidades de medida de tempo.",
    D9: "Estabelecer relações entre o horário de início e término e/ou o intervalo da duração de um evento ou acontecimento.",
    D10: "Num problema, estabelecer trocas entre cédulas e moedas do sistema monetário brasileiro, em função de seus valores.",
    D11: "Resolver problema envolvendo o cálculo do perímetro de figuras planas, desenhadas em malhas quadriculadas.",
    D12: "Resolver problema envolvendo o cálculo ou estimativa de áreas de figuras planas, desenhadas em malhas quadriculadas.",
    D13: "Reconhecer e utilizar características do sistema de numeração decimal, tais como agrupamentos e trocas na base 10 e princípio do valor posicional.",
    D14: "Identificar a localização de números naturais na reta numérica.",
    D15: "Reconhecer a decomposição de números naturais nas suas diversas ordens.",
    D16: "Reconhecer a composição e a decomposição de números naturais em sua forma polinomial.",
    D17: "Calcular o resultado de uma adição ou subtração de números naturais.",
    D18: "Calcular o resultado de uma multiplicação ou divisão de números naturais.",
    D19: "Resolver problema com números naturais, envolvendo diferentes significados da adição ou subtração.",
    D20: "Resolver problema com números naturais, envolvendo diferentes significados da multiplicação ou divisão.",
    D21: "Identificar diferentes representações de um mesmo número racional.",
    D22: "Identificar a localização de números racionais representados na forma decimal na reta numérica.",
    D23: "Resolver problema utilizando a escrita decimal de cédulas e moedas do sistema monetário brasileiro.",
    D24: "Identificar fração como representação que pode estar associada a diferentes significados.",
    D25: "Resolver problema com números racionais expressos na forma decimal envolvendo diferentes significados da adição ou subtração.",
    D26: "Resolver problema envolvendo noções de porcentagem (25%, 50%, 100%).",
    D27: "Ler informações e dados apresentados em tabelas.",
    D28: "Ler informações e dados apresentados em gráficos (particularmente em gráficos de colunas)."
  }
};
var ANOS = ["4º ano", "5º ano"];
var CATALOGO_URL = "simulados/catalogo.json";

(function () {
  "use strict";
  var KEY = "leitor_gabaritos_v1";
  var LETRAS = OMR.LETRAS;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var uid = function () { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); };
  var pad = function (n) { return String(n).padStart(2, "0"); };

  // ---------- dados ----------
  var D;
  function novoBanco() {
    return {
      config: { escola: "Escola Municipal Gedor de Assunção - Assunção de Goiás", logo: LOGO_PADRAO, forte: 70, fraco: 50, rede: true, tutorial: false },
      turmas: [], provas: [], resultados: {}
    };
  }
  function carregar() {
    try { D = JSON.parse(localStorage.getItem(KEY)); } catch (e) { D = null; }
    if (!D || !D.config) D = novoBanco();
    normalizar();
  }
  function normalizar() {
    D.resultados = D.resultados || {};
    D.turmas = D.turmas || []; D.provas = D.provas || [];
    if (D.config.rede === undefined) D.config.rede = true;
    if (!D.config.logo) D.config.logo = LOGO_PADRAO;
    D.provas.forEach(function (p) { if (!p.folha) p.folha = "a4"; });
  }
  function salvar() {
    try { localStorage.setItem(KEY, JSON.stringify(D)); }
    catch (e) { aviso("Não foi possível salvar no aparelho. Faça um backup em Configurações.", true); }
  }
  carregar();
  function atualizaTopo() {
    var im = document.getElementById("logoTopo"), es = document.getElementById("escolaTopo");
    if (im) { if (D.config.logo) { im.src = D.config.logo; im.hidden = false; } else im.hidden = true; }
    if (es) es.textContent = D.config.escola || "";
  }
  atualizaTopo();

  function turma(id) { return D.turmas.find(function (t) { return t.id === id; }); }
  function prova(id) { return D.provas.find(function (p) { return p.id === id; }); }
  function chaveRes(pid, tid) { return pid + "|" + tid; }
  function semGabarito(p) { return !!p && p.questoes.every(function (q) { return !q.gab; }); }
  var AVISO_SEM_GAB = '<p class="tag alerta">Gabarito ainda não liberado pela rede. As leituras ficam guardadas e as notas aparecem sozinhas quando o gabarito chegar (abra o app com internet no dia da prova).</p>';
  function resultados(pid, tid) { var k = chaveRes(pid, tid); D.resultados[k] = D.resultados[k] || {}; return D.resultados[k]; }
  function contagem(p, t) {
    var r = resultados(p.id, t.id), c = 0, a = 0;
    t.alunos.forEach(function (x) { var v = r[x.id]; if (v) { if (v.ausente) a++; else c++; } });
    return { corrigidos: c, ausentes: a, pendentes: t.alunos.length - c - a };
  }
  function nomeProva(p) { return p.nome + (p.ano ? " · " + p.ano : ""); }
  function provasOrdenadas() {
    return D.provas.slice().sort(function (a, b) {
      var da = a.data || "", db = b.data || "";
      if (da !== db) return da < db ? 1 : -1;
      return 0;
    });
  }

  // ---------- aviso ----------
  var tAviso;
  function aviso(msg, erro) {
    var el = $("#aviso"); el.textContent = msg; el.className = "aviso on" + (erro ? " erro" : "");
    clearTimeout(tAviso); tAviso = setTimeout(function () { el.className = "aviso"; }, 3800);
  }

  // ---------- navegação ----------
  var abaAtual = "corrigir";
  var RENDER = {};
  function irPara(aba) {
    abaAtual = aba;
    document.querySelectorAll("nav button").forEach(function (b) { b.classList.toggle("ativo", b.dataset.aba === aba); });
    document.querySelectorAll("section.aba").forEach(function (s) { s.hidden = s.id !== "aba-" + aba; });
    RENDER[aba]();
    window.scrollTo(0, 0);
  }
  document.querySelectorAll("nav button").forEach(function (b) { b.onclick = function () { irPara(b.dataset.aba); }; });

  function opcoes(lista, sel, vazio, rot) {
    return (vazio ? '<option value="">' + vazio + "</option>" : "") + lista.map(function (x) {
      return '<option value="' + esc(x.id) + '"' + (x.id === sel ? " selected" : "") + ">" + esc(rot ? rot(x) : x.nome) + "</option>";
    }).join("");
  }
  var selProva = "", selTurma = "";
  function seletores(onchange) {
    var lista = provasOrdenadas();
    if (!turma(selTurma) && D.turmas[0]) selTurma = D.turmas[0].id;
    var t = turma(selTurma);
    if (!prova(selProva)) {
      var pref = t && t.ano ? lista.find(function (p) { return p.ano === t.ano; }) : null;
      selProva = pref ? pref.id : (lista[0] ? lista[0].id : "");
    }
    var h = '<div class="linha2"><label>Turma<select id="sT">' + opcoes(D.turmas, selTurma, D.turmas.length ? null : "— cadastre uma turma —", function (x) { return x.nome + (x.ano ? " (" + x.ano + ")" : ""); }) + "</select></label>" +
      '<label>Avaliação<select id="sP">' + opcoes(lista, selProva, lista.length ? null : "— nenhuma avaliação —", nomeProva) + "</select></label></div>";
    var p = prova(selProva);
    if (p && t && p.ano && t.ano && p.ano !== t.ano) h += '<p class="tag alerta">Atenção: esta avaliação é do ' + esc(p.ano) + " e a turma é do " + esc(t.ano) + ".</p>";
    setTimeout(function () {
      $("#sP") && ($("#sP").onchange = function () { selProva = this.value; atual = null; onchange(); });
      $("#sT") && ($("#sT").onchange = function () {
        selTurma = this.value; atual = null;
        var tt = turma(selTurma), pp = prova(selProva);
        if (tt && tt.ano && pp && pp.ano && pp.ano !== tt.ano) { var m = provasOrdenadas().find(function (x) { return x.ano === tt.ano; }); if (m) selProva = m.id; }
        onchange();
      });
    });
    return h;
  }

  // ================= TURMAS =================
  var turmaEdit = null;
  RENDER.turmas = function rTurmas() {
    var el = $("#aba-turmas");
    if (turmaEdit) return rTurmaEdit(el);
    el.innerHTML = '<h2>Turmas</h2><p class="dica">Cadastre cada turma com a lista de alunos. Cada aluno recebe um código que vai impresso na folha de respostas, para a identificação automática.</p>' +
      '<div class="lista">' + (D.turmas.length ? D.turmas.map(function (t) {
        return '<div class="item"><div><b>' + esc(t.nome) + "</b><small>" + (t.ano ? esc(t.ano) + " · " : "") + t.alunos.length + ' alunos</small></div><button data-e="' + t.id + '">Editar</button></div>';
      }).join("") : '<p class="vazio">Nenhuma turma cadastrada.</p>') + "</div>" +
      '<button class="prim" id="novaT">+ Nova turma</button>';
    el.querySelectorAll("[data-e]").forEach(function (b) { b.onclick = function () { turmaEdit = b.dataset.e; RENDER.turmas(); }; });
    $("#novaT").onclick = function () { var t = { id: uid(), nome: "Nova turma", ano: "", alunos: [] }; D.turmas.push(t); salvar(); turmaEdit = t.id; RENDER.turmas(); };
  };
  function rTurmaEdit(el) {
    var t = turma(turmaEdit);
    if (!t) { turmaEdit = null; return RENDER.turmas(); }
    el.innerHTML = '<h2>Editar turma</h2><div class="linha2"><label>Nome da turma<input id="tNome" value="' + esc(t.nome) + '" placeholder="Ex.: 4º ano A - vespertino"></label>' +
      '<label>Ano escolar<select id="tAno"><option value="">—</option>' + ANOS.map(function (a) { return "<option" + (t.ano === a ? " selected" : "") + ">" + a + "</option>"; }).join("") + "</select></label></div>" +
      '<label>Alunos (um nome por linha, até 63)<textarea id="tAl" rows="14" placeholder="Ana Clara Souza&#10;Bruno Lima&#10;...">' + esc(t.alunos.map(function (a) { return a.nome; }).join("\n")) + "</textarea></label>" +
      '<p class="dica">Pode colar a lista direto da planilha ou do diário. Alunos que já têm resultados mantêm o mesmo código. O ano escolar faz o app sugerir os simulados certos para a turma.</p>' +
      '<div class="botoes"><button class="prim" id="tSalvar">Salvar</button><button id="tVoltar">Voltar</button><button class="perigo" id="tExcluir">Excluir turma</button></div>';
    $("#tSalvar").onclick = function () {
      var nomes = $("#tAl").value.split(/\r?\n/).map(function (s) { return s.trim(); }).filter(Boolean);
      if (nomes.length > 63) { aviso("Máximo de 63 alunos por turma.", true); return; }
      var antigos = t.alunos.slice(), usados = {}, novos = [];
      nomes.forEach(function (n) {
        var a = antigos.find(function (x) { return x.nome.toLowerCase() === n.toLowerCase() && !usados[x.id]; });
        if (a) { usados[a.id] = 1; novos.push({ id: a.id, nome: n }); } else novos.push({ id: 0, nome: n });
      });
      novos.forEach(function (a) { if (!a.id) { var k = 1; while (usados[k]) k++; usados[k] = 1; a.id = k; } });
      t.alunos = novos; t.nome = $("#tNome").value.trim() || "Turma"; t.ano = $("#tAno").value;
      salvar(); aviso("Turma salva."); turmaEdit = null; RENDER.turmas();
    };
    $("#tVoltar").onclick = function () { turmaEdit = null; RENDER.turmas(); };
    $("#tExcluir").onclick = function () {
      if (!confirm("Excluir a turma " + t.nome + " e todos os resultados dela?")) return;
      D.turmas = D.turmas.filter(function (x) { return x !== t; });
      Object.keys(D.resultados).forEach(function (k) { if (k.split("|")[1] === t.id) delete D.resultados[k]; });
      salvar(); turmaEdit = null; RENDER.turmas();
    };
  }

  // ================= AVALIAÇÕES =================
  var provaEdit = null;
  RENDER.provas = function rProvas() {
    var el = $("#aba-provas");
    if (provaEdit) return rProvaEdit(el);
    var lista = provasOrdenadas();
    el.innerHTML = '<h2>Avaliações</h2><p class="dica">Os simulados da rede chegam sozinhos, com gabarito, descritores e habilidades prontos. Você também pode cadastrar avaliações próprias.</p>' +
      '<div class="botoes"><button id="pSync">↻ Buscar simulados da rede</button></div>' +
      (D.config.ultimaSync ? '<p class="dica">Última atualização: ' + new Date(D.config.ultimaSync).toLocaleString("pt-BR") + "</p>" : "") +
      '<div class="lista">' + (lista.length ? lista.map(function (p) {
        return '<div class="item"><div><b>' + esc(p.nome) + "</b>" + (p.rede ? '<span class="tag rede">Rede</span>' : "") +
          "<small>" + (p.ano ? esc(p.ano) + " · " : "") + p.questoes.length + " questões · " + p.alts + " alternativas · folha " + (p.folha === "compacta" ? "compacta" : "A4") + "</small></div>" +
          '<div class="mini"><button data-c="' + p.id + '">Duplicar</button><button data-e="' + p.id + '">' + (p.rede ? "Ver" : "Editar") + "</button></div></div>";
      }).join("") : '<p class="vazio">Nenhuma avaliação ainda. Toque em "Buscar simulados da rede" ou crie uma nova.</p>') + "</div>" +
      '<button class="prim" id="novaP">+ Nova avaliação própria</button>';
    $("#pSync").onclick = function () { sincronizar(true); };
    el.querySelectorAll("[data-e]").forEach(function (b) { b.onclick = function () { provaEdit = b.dataset.e; RENDER.provas(); }; });
    el.querySelectorAll("[data-c]").forEach(function (b) {
      b.onclick = function () {
        var p = JSON.parse(JSON.stringify(prova(b.dataset.c))); p.id = uid(); p.nome += " (cópia)"; delete p.rede; delete p.versao;
        D.provas.push(p); salvar(); RENDER.provas();
      };
    });
    $("#novaP").onclick = function () {
      var p = { id: uid(), nome: "Nova avaliação", alts: 4, folha: "compacta", ano: "", data: new Date().toISOString().slice(0, 10), questoes: [] };
      for (var i = 0; i < 20; i++) p.questoes.push({ gab: "", disc: "", desc: "", hab: "" });
      D.provas.push(p); salvar(); provaEdit = p.id; RENDER.provas();
    };
  };
  function temResultados(pid) { return Object.keys(D.resultados).some(function (k) { return k.split("|")[0] === pid && Object.keys(D.resultados[k]).length; }); }
  function rProvaVer(el, p) {
    el.innerHTML = "<h2>" + esc(p.nome) + '</h2><p class="dica"><span class="tag rede">Simulado da rede</span> ' + (p.ano ? esc(p.ano) + " · " : "") + p.questoes.length + " questões" +
      (p.data ? " · aplicação em " + esc(p.data.split("-").reverse().join("/")) : "") + "</p>" +
      (p.descricao ? '<p class="dica">' + esc(p.descricao) + "</p>" : "") +
      '<p class="dica">O gabarito dos simulados da rede é atualizado pela própria rede e não pode ser alterado aqui. Para fazer mudanças, use "Duplicar".</p>' +
      '<div class="botoes">' + (p.pdf ? '<a class="botao prim" href="' + esc(p.pdf) + '" target="_blank" rel="noopener">📄 Abrir a prova (PDF)</a>' : "") + '<button id="vVoltar">Voltar</button></div>' +
      '<div class="tabela-rolagem"><table class="res"><thead><tr><th>Nº</th><th>Resp.</th><th>Disciplina</th><th>Descritor</th><th>Habilidade</th></tr></thead><tbody>' +
      p.questoes.map(function (q, i) { return "<tr><td>" + pad(i + 1) + "</td><td><b>" + esc(q.gab) + "</b></td><td>" + esc(q.disc) + "</td><td>" + esc(q.desc) + '</td><td><small class="hab">' + esc(q.hab) + "</small></td></tr>"; }).join("") +
      "</tbody></table></div>";
    $("#vVoltar").onclick = function () { provaEdit = null; RENDER.provas(); };
  }
  function rProvaEdit(el) {
    var p = prova(provaEdit);
    if (!p) { provaEdit = null; return RENDER.provas(); }
    if (p.rede) return rProvaVer(el, p);
    var bloqueio = temResultados(p.id);
    var discs = Object.keys(CATALOGO);
    var linhas = p.questoes.map(function (q, i) {
      return '<tr><td class="n">' + pad(i + 1) + '</td><td><select data-i="' + i + '" data-f="gab"><option value=""></option>' +
        LETRAS.slice(0, p.alts).split("").map(function (l) { return "<option" + (q.gab === l ? " selected" : "") + ">" + l + "</option>"; }).join("") +
        '</select></td><td><input list="dl-disc" data-i="' + i + '" data-f="disc" value="' + esc(q.disc) + '"></td>' +
        '<td><input class="curto" data-i="' + i + '" data-f="desc" value="' + esc(q.desc) + '"></td>' +
        '<td><input data-i="' + i + '" data-f="hab" value="' + esc(q.hab) + '"></td></tr>';
    }).join("");
    el.innerHTML = '<h2>Editar avaliação</h2>' +
      '<label>Nome da avaliação<input id="pNome" value="' + esc(p.nome) + '"></label>' +
      '<div class="linha2"><label>Ano escolar<select id="pAno"><option value="">—</option>' + ANOS.map(function (a) { return "<option" + (p.ano === a ? " selected" : "") + ">" + a + "</option>"; }).join("") + '</select></label>' +
      '<label>Data de aplicação<input id="pData" type="date" value="' + esc(p.data || "") + '"></label></div>' +
      '<div class="linha2"><label>Número de questões (1 a 60)<input id="pN" type="number" min="1" max="60" value="' + p.questoes.length + '"' + (bloqueio ? " disabled" : "") + '></label>' +
      '<label>Alternativas<select id="pA"' + (bloqueio ? " disabled" : "") + '><option value="4"' + (p.alts === 4 ? " selected" : "") + '>A a D</option><option value="5"' + (p.alts === 5 ? " selected" : "") + ">A a E</option></select></label></div>" +
      '<label>Modelo da folha de respostas<select id="pF"' + (bloqueio ? " disabled" : "") + '><option value="compacta"' + (p.folha === "compacta" ? " selected" : "") + '>Compacta (recomendada, mais fácil de fotografar)</option><option value="a4"' + (p.folha !== "compacta" ? " selected" : "") + ">A4 inteira (modelo antigo)</option></select></label>" +
      (bloqueio ? '<p class="dica">Esta avaliação já tem correções salvas, então o número de questões, as alternativas e o modelo da folha ficaram travados. Para mudar, use "Duplicar".</p>' : "") +
      '<details class="ferr" open><summary>Preenchimento rápido</summary>' +
      '<label>Colar gabarito (ex.: BCADBCAD...)<input id="rGab" placeholder="letras em sequência, espaços são ignorados"></label><button id="rGabOk">Aplicar gabarito</button>' +
      '<div class="linha3"><label>Da questão<input id="rDe" type="number" min="1" value="1"></label><label>até<input id="rAte" type="number" min="1" value="' + p.questoes.length + '"></label>' +
      '<label>Disciplina<input id="rDisc" list="dl-disc"></label></div><button id="rDiscOk">Aplicar disciplina</button>' +
      '<label>Descritores em sequência (ex.: D1, D8, D3, D4...)<input id="rDesc"></label><button id="rDescOk">Aplicar descritores</button>' +
      '<p class="dica">Com a disciplina Língua Portuguesa ou Matemática, a habilidade do descritor (matriz SAEB do 5º ano) é preenchida sozinha. Você pode editar o texto.</p></details>' +
      '<div class="tabela-rolagem"><table class="ed"><thead><tr><th>Nº</th><th>Resp.</th><th>Disciplina</th><th>Descritor</th><th>Habilidade</th></tr></thead><tbody>' + linhas + "</tbody></table></div>" +
      '<datalist id="dl-disc">' + discs.map(function (d) { return "<option>" + esc(d) + "</option>"; }).join("") + "</datalist>" +
      '<div class="botoes fixo"><button class="prim" id="pSalvar">Salvar</button><button id="pVoltar">Voltar</button><button class="perigo" id="pExcluir">Excluir</button></div>';
    function autoHab(q) {
      var c = CATALOGO[q.disc]; var k = (q.desc || "").toUpperCase().replace(/\s/g, "");
      if (c && c[k] && !q.hab) q.hab = c[k];
    }
    el.querySelectorAll("[data-f]").forEach(function (inp) {
      inp.onchange = function () {
        var q = p.questoes[+inp.dataset.i], f = inp.dataset.f;
        q[f] = f === "desc" ? inp.value.toUpperCase().replace(/\s/g, "") : inp.value.trim();
        if (f === "desc" || f === "disc") { var antes = q.hab; autoHab(q); if (q.hab !== antes) el.querySelector('[data-i="' + inp.dataset.i + '"][data-f="hab"]').value = q.hab; }
        if (f === "desc") inp.value = q.desc;
      };
    });
    function lerCabecalho() {
      p.nome = $("#pNome").value.trim() || "Avaliação";
      p.ano = $("#pAno").value; p.data = $("#pData").value;
      if (!bloqueio) {
        var n = Math.max(1, Math.min(60, parseInt($("#pN").value, 10) || 1));
        while (p.questoes.length < n) p.questoes.push({ gab: "", disc: "", desc: "", hab: "" });
        p.questoes.length = n;
        p.alts = +$("#pA").value; p.folha = $("#pF").value;
        p.questoes.forEach(function (q) { if (LETRAS.indexOf(q.gab) >= p.alts) q.gab = ""; });
      }
    }
    $("#pN") && ($("#pN").onchange = function () { lerCabecalho(); salvar(); RENDER.provas(); });
    $("#pA").onchange = function () { lerCabecalho(); salvar(); RENDER.provas(); };
    $("#rGabOk").onclick = function () {
      var s = $("#rGab").value.toUpperCase().replace(/[^A-E]/g, "");
      if (!s) return aviso("Digite as letras do gabarito.", true);
      if (!bloqueio) {
        var n = Math.min(60, s.length);
        while (p.questoes.length < n) p.questoes.push({ gab: "", disc: "", desc: "", hab: "" });
        p.questoes.length = n; $("#pN").value = n;
        if (s.indexOf("E") >= 0) { p.alts = 5; $("#pA").value = "5"; }
      }
      s.split("").forEach(function (l, i) { if (p.questoes[i] && LETRAS.indexOf(l) < p.alts) p.questoes[i].gab = l; });
      lerCabecalho(); salvar(); RENDER.provas(); aviso("Gabarito aplicado em " + Math.min(s.length, p.questoes.length) + " questões.");
    };
    $("#rDiscOk").onclick = function () {
      var de = +$("#rDe").value, ate = +$("#rAte").value, d = $("#rDisc").value.trim();
      for (var i = de - 1; i < ate && i < p.questoes.length; i++) if (i >= 0) { p.questoes[i].disc = d; autoHab(p.questoes[i]); }
      lerCabecalho(); salvar(); RENDER.provas();
    };
    $("#rDescOk").onclick = function () {
      var l = $("#rDesc").value.split(/[,;\s]+/).filter(Boolean);
      l.forEach(function (d, i) { var q = p.questoes[i]; if (q) { var nd = d.toUpperCase(); if (nd !== q.desc) { q.desc = nd; q.hab = ""; } autoHab(q); } });
      lerCabecalho(); salvar(); RENDER.provas();
    };
    $("#pSalvar").onclick = function () { lerCabecalho(); salvar(); aviso("Avaliação salva."); provaEdit = null; RENDER.provas(); };
    $("#pVoltar").onclick = function () { lerCabecalho(); salvar(); provaEdit = null; RENDER.provas(); };
    $("#pExcluir").onclick = function () {
      if (!confirm("Excluir a avaliação " + p.nome + " e todas as correções dela?")) return;
      D.provas = D.provas.filter(function (x) { return x !== p; });
      Object.keys(D.resultados).forEach(function (k) { if (k.split("|")[0] === p.id) delete D.resultados[k]; });
      salvar(); provaEdit = null; RENDER.provas();
    };
  }

  // ================= SIMULADOS DA REDE =================
  var sincronizando = false;
  function sincronizar(manual) {
    if (!/^https?:/.test(location.protocol)) { if (manual) aviso("Para receber os simulados da rede, abra o app pelo endereço da internet.", true); return; }
    if (sincronizando) return; sincronizando = true;
    fetch(CATALOGO_URL + "?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (cat) {
        sincronizando = false;
        var novos = 0, atual = 0, avisos = [];
        (cat.simulados || []).forEach(function (s) {
          if (!s || !s.id || !Array.isArray(s.questoes) || !s.questoes.length) return;
          var dados = {
            id: s.id, nome: String(s.nome || "Simulado"), ano: s.ano || "", data: s.data || "", alts: s.alts === 5 ? 5 : 4,
            folha: s.folha === "a4" ? "a4" : "compacta", versao: +s.versao || 1, pdf: s.pdf || "", descricao: s.descricao || "", rede: true,
            questoes: s.questoes.map(function (q) { return { gab: String(q.gab || "").toUpperCase().slice(0, 1), disc: q.disc || "", desc: q.desc || "", hab: q.hab || "" }; })
          };
          var local = prova(s.id);
          if (!local) { D.provas.push(dados); novos++; return; }
          if (dados.versao <= (local.versao || 1)) return;
          var mesmaEstrutura = local.questoes.length === dados.questoes.length && local.alts === dados.alts && local.folha === dados.folha;
          if (mesmaEstrutura || !temResultados(local.id)) { Object.assign(local, dados); atual++; }
          else avisos.push(local.nome);
        });
        D.config.ultimaSync = new Date().toISOString();
        salvar();
        var msg = [];
        if (novos) msg.push(novos + (novos > 1 ? " simulados novos" : " simulado novo"));
        if (atual) msg.push(atual + (atual > 1 ? " simulados atualizados" : " simulado atualizado"));
        if (msg.length) aviso("Rede: " + msg.join(" e ") + ".");
        else if (manual) aviso("Você já tem todos os simulados da rede.");
        if (avisos.length) aviso("Não foi possível atualizar " + avisos.join(", ") + ": já há correções com o formato antigo.", true);
        if (msg.length || manual) RENDER[abaAtual]();
      })
      .catch(function () { sincronizando = false; if (manual) aviso("Sem conexão com a rede agora. Tente de novo mais tarde.", true); });
  }

  // ================= FOLHAS =================
  RENDER.folhas = function rFolhas() {
    var el = $("#aba-folhas");
    el.innerHTML = '<h2>Folhas de respostas</h2><p class="dica">Gera um PDF com uma folha por aluno, com nome e código impressos. Imprima em A4, <b>sem ajustar à página</b> (escala 100%).</p>' +
      seletores(RENDER.folhas) +
      '<label class="chk"><input type="checkbox" id="fNomes" checked> Uma folha com o nome de cada aluno da turma</label>' +
      '<label>Folhas extras em branco (sem nome)<input type="number" id="fExtra" min="0" max="60" value="2"></label>' +
      '<div class="botoes"><button class="prim" id="fGerar">Baixar folhas em PDF</button></div>' +
      '<div class="previa-folha"><canvas id="fPrev"></canvas></div>';
    $("#fGerar").onclick = gerarFolhas;
    var p = prova(selProva); if (p) previaFolha(p);
  };
  function previaFolha(p) {
    var cv = $("#fPrev"), s = 1.6; cv.width = 210 * s; cv.height = 297 * s;
    var c = cv.getContext("2d"); c.fillStyle = "#fff"; c.fillRect(0, 0, cv.width, cv.height); c.fillStyle = "#000";
    var G = OMR.geometria(p);
    G.markers.forEach(function (m) { c.fillRect((m[0] - G.mk / 2) * s, (m[1] - G.mk / 2) * s, G.mk * s, G.mk * s); });
    c.fillRect(G.bar.x * s, G.bar.y * s, G.bar.w * s, G.bar.h * s);
    c.font = (3 * s) + "px sans-serif"; c.lineWidth = 1;
    G.labels.forEach(function (lb) { c.fillText(pad(lb.q + 1), lb.x * s, (lb.y + 1) * s); });
    G.bubbles.forEach(function (r) { r.forEach(function (b) { c.beginPath(); c.arc(b.x * s, b.y * s, G.r * s, 0, 7); c.stroke(); }); });
    c.font = "bold " + (4 * s) + "px sans-serif"; c.fillText("FOLHA DE RESPOSTAS", (G.tipo === "compacta" ? 17 : 24) * s, (G.tipo === "compacta" ? 23 : 34) * s);
  }
  function gerarFolhas() {
    var p = prova(selProva), t = turma(selTurma);
    if (!p) return aviso("Escolha uma avaliação.", true);
    var comNomes = $("#fNomes").checked && t, extra = Math.max(0, Math.min(60, +$("#fExtra").value || 0));
    var lista = [];
    if (comNomes) t.alunos.forEach(function (a) { lista.push({ aluno: a.nome, alunoId: a.id }); });
    for (var i = 0; i < extra; i++) lista.push({ aluno: "", alunoId: 0 });
    if (!lista.length) return aviso("Nada para gerar.", true);
    var doc = new jspdf.jsPDF({ unit: "mm", format: "a4" });
    lista.forEach(function (it, i) {
      if (i) doc.addPage();
      desenharFolha(doc, { escola: D.config.escola, logo: D.config.logo, prova: p, turma: t ? t.nome : "", aluno: it.aluno, alunoId: it.alunoId });
    });
    entregar(doc, "Folhas de respostas - " + p.nome + (t ? " - " + t.nome : "") + ".pdf", false);
  }
  function nomeArquivo(n) { return n.replace(/[\\/:*?"<>|]/g, "-"); }
  function entregar(doc, nome, compartilhar) {
    nome = nomeArquivo(nome);
    if (compartilhar && navigator.canShare) {
      try {
        var file = new File([doc.output("blob")], nome, { type: "application/pdf" });
        if (navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], title: nome }).catch(function () {});
          return;
        }
      } catch (e) {}
    }
    try { doc.save(nome); } catch (e) { window.open(doc.output("bloburl"), "_blank"); }
  }

  // ================= CORRIGIR =================
  var fila = [], atual = null, pendAberto = false;
  RENDER.corrigir = function rCorrigir() {
    var el = $("#aba-corrigir");
    var sel = seletores(RENDER.corrigir);
    var p = prova(selProva), t = turma(selTurma);
    var h = '<h2>Corrigir</h2>' + sel;
    if (!t) h += '<p class="dica">Cadastre uma turma na aba Turmas.</p>';
    else if (p) {
      var c = contagem(p, t);
      h += '<div class="placar pequeno"><div class="ok"><b>' + c.corrigidos + "</b><small>corrigidos</small></div><div><b>" + c.ausentes + "</b><small>ausentes</small></div><div" + (c.pendentes ? ' class="alerta"' : "") + "><b>" + c.pendentes + "</b><small>pendentes</small></div></div>";
    }
    var compacta = p && p.folha === "compacta";
    h += '<div class="botoes grandes"><label class="botao prim">📷 Fotografar folha<input type="file" accept="image/*" capture="environment" id="cFoto" hidden></label>' +
      '<label class="botao">🖼️ Escolher fotos<input type="file" accept="image/*" multiple id="cFotos" hidden></label>' +
      '<button id="cManual">✍️ Lançar à mão</button></div>' +
      '<p class="dica">' + (compacta ? "Dica: enquadre <b>só o retângulo</b> com os 4 quadrados pretos, ocupando quase toda a tela, com boa luz e sem sombra. A foto pode estar inclinada." :
        "Dicas: folha inteira na foto, os 4 quadrados pretos visíveis, boa luz e sem sombra forte. A foto pode estar inclinada.") + "</p>";
    if (p && t) {
      var r = resultados(p.id, t.id), pend = t.alunos.filter(function (a) { return !r[a.id]; });
      if (pend.length) h += '<details class="ferr" id="cPend"' + (pendAberto ? " open" : "") + '><summary>Alunos pendentes (' + pend.length + ') — marcar quem faltou</summary><p class="dica">Aluno ausente não entra nas médias e aparece como "ausente" no relatório.</p><div class="lista">' +
        pend.map(function (a) { return '<div class="item"><div>' + esc(a.nome) + '</div><div class="mini"><button data-aus="' + a.id + '">Ausente</button><button data-lan="' + a.id + '">Lançar</button></div></div>'; }).join("") + "</div></details>";
    }
    h += '<div id="cArea"></div>';
    el.innerHTML = h;
    $("#cFoto").onchange = function () { enfileirar(this.files); this.value = ""; };
    $("#cFotos").onchange = function () { enfileirar(this.files); this.value = ""; };
    $("#cManual").onclick = function () {
      if (!p || !t) return aviso("Escolha avaliação e turma.", true);
      mostrarLeitura(leituraManual(p, proximoSemNota(p, t)));
    };
    $("#cPend") && ($("#cPend").ontoggle = function () { pendAberto = this.open; });
    el.querySelectorAll("[data-aus]").forEach(function (b) { b.onclick = function () { marcarAusente(p, t, +b.dataset.aus); RENDER.corrigir(); }; });
    el.querySelectorAll("[data-lan]").forEach(function (b) { b.onclick = function () { mostrarLeitura(leituraManual(p, +b.dataset.lan)); }; });
    if (atual) desenharLeitura();
  };
  function leituraManual(p, alunoId, resp) {
    return { manual: true, respostas: resp ? resp.slice() : p.questoes.map(function () { return ""; }), confianca: p.questoes.map(function () { return "ok"; }), alunoId: alunoId };
  }
  function marcarAusente(p, t, alunoId) {
    var a = t.alunos.find(function (x) { return x.id === alunoId; });
    var r = resultados(p.id, t.id);
    if (r[alunoId] && !r[alunoId].ausente && !confirm(a.nome + " já tem correção salva. Marcar como ausente vai apagar a correção. Continuar?")) return false;
    r[alunoId] = { ausente: true, data: new Date().toISOString() };
    salvar(); aviso(a.nome + " marcado(a) como ausente.");
    return true;
  }
  function proximoSemNota(p, t) {
    var r = resultados(p.id, t.id);
    var a = t.alunos.find(function (x) { return !r[x.id]; });
    return a ? a.id : (t.alunos[0] ? t.alunos[0].id : 0);
  }
  function enfileirar(files) {
    var p = prova(selProva), t = turma(selTurma);
    if (!p || !t) return aviso("Escolha avaliação e turma antes.", true);
    fila = fila.concat(Array.prototype.slice.call(files));
    if (!atual) proximaFoto();
  }
  function proximaFoto() {
    atual = null;
    var f = fila.shift();
    if (!f) { $("#cArea") && ($("#cArea").innerHTML = ""); return; }
    $("#cArea").innerHTML = '<div class="processando">Lendo a folha…</div>';
    carregarImagem(f, function (err, img) {
      if (err) { aviso("Não consegui abrir a imagem.", true); return proximaFoto(); }
      setTimeout(function () {
        var p = prova(selProva);
        var r = OMR.read(img, p);
        if (!r.ok) {
          $("#cArea").innerHTML = '<div class="cartao erro"><b>' + esc(r.erro) + '</b><div class="botoes"><button id="cPular">' + (fila.length ? "Próxima foto" : "Fechar") + "</button></div></div>";
          $("#cPular").onclick = proximaFoto;
          return;
        }
        r.img = img;
        var t = turma(selTurma);
        if (!(r.alunoId > 0 && t.alunos.some(function (a) { return a.id === r.alunoId; }))) { r.idDetectado = false; r.alunoId = proximoSemNota(p, t); }
        else r.idDetectado = true;
        mostrarLeitura(r);
      }, 30);
    });
  }
  function carregarImagem(file, cb) {
    var url = URL.createObjectURL(file), im = new Image();
    im.onload = function () {
      var MAX = 1600, s = Math.min(1, MAX / Math.max(im.naturalWidth, im.naturalHeight));
      var w = Math.round(im.naturalWidth * s), h = Math.round(im.naturalHeight * s);
      var cv = document.createElement("canvas"); cv.width = w; cv.height = h;
      var c = cv.getContext("2d"); c.drawImage(im, 0, 0, w, h);
      URL.revokeObjectURL(url);
      var data = c.getImageData(0, 0, w, h).data, g = new Uint8Array(w * h);
      for (var i = 0, j = 0; i < g.length; i++, j += 4) g[i] = (data[j] * 0.299 + data[j + 1] * 0.587 + data[j + 2] * 0.114) | 0;
      cb(null, { w: w, h: h, gray: g, rgba: data });
    };
    im.onerror = function () { cb(true); };
    im.src = url;
  }
  function mostrarLeitura(r) { atual = r; desenharLeitura(); var a = $("#cArea"); if (a) a.scrollIntoView({ behavior: "smooth", block: "start" }); }

  function desenharLeitura() {
    var r = atual, p = prova(selProva), t = turma(selTurma);
    if (!p || !t || p.questoes.length !== r.respostas.length || !$("#cArea")) { atual = null; return; }
    var res = resultados(p.id, t.id);
    var acertos = r.respostas.filter(function (x, i) { return x && x === p.questoes[i].gab; }).length;
    var duvidas = r.confianca.filter(function (c) { return c !== "ok"; }).length;
    var aluno = t.alunos.find(function (a) { return a.id === r.alunoId; });
    var html = '<div class="cartao">';
    html += '<label>Aluno(a)' + (r.manual ? "" : r.idDetectado ? ' <span class="tag ok">identificado pela folha</span>' : ' <span class="tag alerta">confira o nome</span>') +
      '<select id="lAluno">' + t.alunos.map(function (a) {
        var v = res[a.id];
        return '<option value="' + a.id + '"' + (a.id === r.alunoId ? " selected" : "") + ">" + esc(a.nome) + (v ? (v.ausente ? " (ausente)" : " ✓") : "") + "</option>";
      }).join("") + "</select></label>";
    if (aluno && res[aluno.id]) html += '<p class="tag alerta">' + (res[aluno.id].ausente ? "Este aluno está marcado como ausente. Salvar vai registrar a correção no lugar." : "Este aluno já tem correção salva. Salvar vai substituir.") + "</p>";
    if (semGabarito(p)) html += AVISO_SEM_GAB;
    html += '<div class="placar"><div><b>' + acertos + "</b>/" + p.questoes.length + "<small>acertos</small></div>" +
      (duvidas ? '<div class="alerta"><b>' + duvidas + "</b><small>para conferir</small></div>" : '<div class="ok"><b>✓</b><small>leitura segura</small></div>') + "</div>";
    if (r.img) html += '<p class="dica">Toque numa bolinha da imagem ou use os botões abaixo para corrigir a leitura. Linhas em laranja: confira.</p><div class="previa"><canvas id="lCanvas"></canvas></div>';
    html += '<div class="grade">' + p.questoes.map(function (q, i) {
      var a = r.respostas[i], cls = r.confianca[i] !== "ok" ? " duv" : "";
      return '<div class="gq' + cls + '"><span class="gn">' + pad(i + 1) + "</span>" + LETRAS.slice(0, p.alts).split("").map(function (l) {
        var c = a === l ? (l === q.gab ? "sel certo" : "sel errado") : (l === q.gab && a !== l ? "gab" : "");
        return '<button data-q="' + i + '" data-l="' + l + '" class="' + c + '">' + l + "</button>";
      }).join("") + '<button data-q="' + i + '" data-l="" class="br' + (a === "" ? " sel" : "") + '" title="Em branco">–</button>' +
        (a === "*" ? '<span class="dupla">dupla</span>' : "") + "</div>";
    }).join("") + "</div>";
    html += '<p class="dica legenda"><span class="sw certo"></span>marcou e acertou <span class="sw errado"></span>marcou e errou <span class="sw gab"></span>resposta certa</p>';
    html += '<div class="botoes fixo"><button class="prim" id="lSalvar">Salvar' + (fila.length ? " e próxima (" + fila.length + ")" : "") + '</button><button id="lAus">Aluno ausente</button><button id="lDesc">Descartar</button></div></div>';
    $("#cArea").innerHTML = html;
    $("#lAluno").onchange = function () { r.alunoId = +this.value; desenharLeitura(); };
    $("#cArea").querySelectorAll(".grade button").forEach(function (b) {
      b.onclick = function () { var i = +b.dataset.q; r.respostas[i] = b.dataset.l; r.confianca[i] = "ok"; desenharLeitura(); };
    });
    $("#lSalvar").onclick = function () {
      if (!r.alunoId) return aviso("Escolha o aluno.", true);
      if (!r.manual && r.respostas.every(function (x) { return x === ""; }) && !confirm("Nenhuma bolinha foi marcada nesta folha. Se o aluno faltou, use \"Aluno ausente\". Salvar mesmo assim com nota zero?")) return;
      if (r.manual && r.respostas.every(function (x) { return x === ""; }) && !confirm("Nenhuma resposta foi lançada. Se o aluno faltou, use \"Aluno ausente\". Salvar com nota zero?")) return;
      res[r.alunoId] = { resp: r.respostas.slice(), data: new Date().toISOString() };
      salvar(); aviso("Salvo: " + (aluno ? aluno.nome : "") + " — " + acertos + " acertos.");
      atual = null;
      if (fila.length) proximaFoto(); else RENDER.corrigir();
    };
    $("#lAus").onclick = function () {
      if (!r.alunoId) return aviso("Escolha o aluno.", true);
      if (marcarAusente(p, t, r.alunoId)) { atual = null; if (fila.length) proximaFoto(); else RENDER.corrigir(); }
    };
    $("#lDesc").onclick = function () { if (fila.length) proximaFoto(); else { atual = null; RENDER.corrigir(); } };
    if (r.img) desenharPrevia(r, p);
  }

  function desenharPrevia(r, p) {
    var cv = $("#lCanvas"); if (!cv) return;
    var G = r.G || OMR.geometria(p), V = G.view;
    var W = Math.min(560, cv.parentNode.clientWidth || 360), s = W / V.w, Hh = Math.round(V.h * s);
    cv.width = W; cv.height = Hh;
    var c = cv.getContext("2d");
    if (!r.prev) {
      var out = c.createImageData(W, Hh), o = out.data, img = r.img, H = r.H;
      for (var y = 0; y < Hh; y++) for (var x = 0; x < W; x++) {
        var pt = OMR.apply(H, V.x + x / s, V.y + y / s), ix = pt[0] | 0, iy = pt[1] | 0, k = (y * W + x) * 4;
        if (ix >= 0 && iy >= 0 && ix < img.w && iy < img.h) { var j = (iy * img.w + ix) * 4; o[k] = img.rgba[j]; o[k + 1] = img.rgba[j + 1]; o[k + 2] = img.rgba[j + 2]; }
        else { o[k] = o[k + 1] = o[k + 2] = 200; }
        o[k + 3] = 255;
      }
      r.prev = out;
    }
    c.putImageData(r.prev, 0, 0);
    var X = function (v) { return (v - V.x) * s; }, Y = function (v) { return (v - V.y) * s; };
    G.bubbles.forEach(function (row, i) {
      var a = r.respostas[i], g = p.questoes[i].gab;
      if (r.confianca[i] !== "ok") {
        c.strokeStyle = "rgba(230,120,0,.95)"; c.lineWidth = 2;
        c.strokeRect(X(row[0].x - 4.5), Y(row[0].y - 4), ((row[row.length - 1].x - row[0].x) + 9) * s, 8 * s);
      }
      row.forEach(function (b, k) {
        var l = LETRAS[k];
        c.beginPath(); c.arc(X(b.x), Y(b.y), (G.r + 0.6) * s, 0, 7);
        if (a === l) { c.lineWidth = 3; c.strokeStyle = l === g ? "#1a9c3c" : "#d0302a"; c.stroke(); }
        else if (l === g) { c.lineWidth = 1.5; c.setLineDash([3, 2]); c.strokeStyle = "#1a9c3c"; c.stroke(); c.setLineDash([]); }
      });
    });
    cv.onclick = function (ev) {
      var rc = cv.getBoundingClientRect();
      var mx = V.x + (ev.clientX - rc.left) * (cv.width / rc.width) / s, my = V.y + (ev.clientY - rc.top) * (cv.height / rc.height) / s;
      var best = null;
      G.bubbles.forEach(function (row, i) { row.forEach(function (b, k) { var d = Math.hypot(b.x - mx, b.y - my); if (d < G.r * 1.7 && (!best || d < best.d)) best = { d: d, i: i, l: LETRAS[k] }; }); });
      if (!best) return;
      r.respostas[best.i] = r.respostas[best.i] === best.l ? "" : best.l; r.confianca[best.i] = "ok";
      desenharLeitura();
    };
  }

  // ================= RESULTADOS =================
  function calcular(p, t) {
    var res = resultados(p.id, t.id), cf = D.config;
    var alunos = t.alunos.map(function (a) {
      var r = res[a.id];
      if (!r) return { aluno: a, avaliado: false, ausente: false };
      if (r.ausente) return { aluno: a, avaliado: false, ausente: true };
      var ac = r.resp.map(function (x, i) { return x !== "" && x === p.questoes[i].gab; });
      return { aluno: a, avaliado: true, resp: r.resp, ac: ac, total: ac.filter(Boolean).length };
    });
    var av = alunos.filter(function (x) { return x.avaliado; });
    var aus = alunos.filter(function (x) { return x.ausente; });
    var nq = p.questoes.length;
    var questoes = p.questoes.map(function (q, i) {
      var dist = {}; LETRAS.slice(0, p.alts).split("").concat(["", "*"]).forEach(function (l) { dist[l] = 0; });
      av.forEach(function (x) { var v = x.resp[i] || ""; dist[v] = (dist[v] || 0) + 1; });
      var ok = av.filter(function (x) { return x.ac[i]; }).length;
      return { i: i, q: q, pct: av.length ? ok / av.length * 100 : 0, dist: dist };
    });
    var mapa = {}, ordem = [];
    p.questoes.forEach(function (q, i) {
      var rot = q.desc || ("Questão " + pad(i + 1));
      var k = (q.disc || "Geral") + "|" + rot;
      if (!mapa[k]) { mapa[k] = { chave: k, disc: q.disc || "Geral", desc: rot, hab: q.hab || (q.desc ? "" : "Resposta correta: " + (q.gab || "-")), itens: [] }; ordem.push(k); }
      mapa[k].itens.push(i);
      if (!mapa[k].hab && q.hab) mapa[k].hab = q.hab;
    });
    var descritores = ordem.map(function (k) {
      var d = mapa[k], tot = 0, ok = 0;
      av.forEach(function (x) { d.itens.forEach(function (i) { tot++; if (x.ac[i]) ok++; }); });
      d.pct = tot ? ok / tot * 100 : 0;
      d.classe = classe(d.pct);
      return d;
    });
    var discs = [];
    p.questoes.forEach(function (q) { var d = q.disc || "Geral"; if (discs.indexOf(d) < 0) discs.push(d); });
    var porDisc = discs.map(function (d) {
      var idx = p.questoes.map(function (q, i) { return (q.disc || "Geral") === d ? i : -1; }).filter(function (i) { return i >= 0; });
      var tot = 0, ok = 0;
      av.forEach(function (x) { idx.forEach(function (i) { tot++; if (x.ac[i]) ok++; }); });
      return { disc: d, idx: idx, pct: tot ? ok / tot * 100 : 0 };
    });
    var media = av.length ? av.reduce(function (s, x) { return s + x.total; }, 0) / av.length : 0;
    return { alunos: alunos, av: av, aus: aus, pend: alunos.length - av.length - aus.length, nq: nq, questoes: questoes, descritores: descritores, porDisc: porDisc, media: media, pctMedia: nq ? media / nq * 100 : 0, cf: cf };
  }
  function classe(pct) {
    if (pct >= D.config.forte) return "forte";
    if (pct >= D.config.fraco) return "medio";
    return "fraco";
  }
  var NOME_CLASSE = { forte: "Ponto forte", medio: "Em desenvolvimento", fraco: "Ponto fraco" };
  var COR = { forte: [46, 160, 67], medio: [242, 180, 0], fraco: [214, 56, 48] };
  var COR_CLARA = { forte: [220, 243, 225], medio: [255, 243, 204], fraco: [250, 222, 220] };
  var fmt = function (v) { return (Math.round(v * 10) / 10).toString().replace(".", ",") + "%"; };
  var selComp = "";

  RENDER.resultados = function rResultados() {
    var el = $("#aba-resultados"), p = prova(selProva), t = turma(selTurma);
    var h = "<h2>Resultados</h2>" + seletores(RENDER.resultados);
    if (semGabarito(prova(selProva))) h += AVISO_SEM_GAB;
    if (!p || !t) { el.innerHTML = h + '<p class="vazio">Escolha avaliação e turma.</p>'; return; }
    var R = calcular(p, t);
    h += '<div class="placar"><div><b>' + R.av.length + "</b>/" + t.alunos.length + "<small>avaliados</small></div>" +
      "<div><b>" + R.aus.length + "</b><small>ausentes</small></div>" +
      (R.pend ? '<div class="alerta"><b>' + R.pend + "</b><small>pendentes</small></div>" : "") +
      (R.av.length ? "<div><b>" + fmt(R.pctMedia) + "</b><small>média geral</small></div>" +
        R.porDisc.map(function (d) { return '<div class="' + classe(d.pct) + '"><b>' + fmt(d.pct) + "</b><small>" + esc(d.disc) + "</small></div>"; }).join("") : "") + "</div>";
    if (R.av.length) {
      h += '<div class="botoes"><button class="prim" id="rPdf">📄 Baixar relatório (PDF)</button>' +
        (navigator.canShare ? '<button class="prim" id="rEnviar">📤 Enviar relatório</button>' : "") +
        '<button id="rCsv">Baixar planilha (CSV)</button></div>' +
        '<label class="chk"><input type="checkbox" id="rInd" checked> Incluir uma página individual por aluno</label>' +
        (R.pend ? '<p class="dica">Há alunos pendentes. Corrija as folhas ou marque quem faltou como ausente antes de enviar o relatório.</p>' : "");
      h += '<h3>Por descritor</h3><div class="tabela-rolagem"><table class="res"><thead><tr><th>Disciplina</th><th>Descritor</th><th>Questões</th><th>Acerto</th><th>Situação</th></tr></thead><tbody>' +
        R.descritores.map(function (d) {
          return '<tr class="' + d.classe + '"><td>' + esc(d.disc) + "</td><td><b>" + esc(d.desc) + '</b><small class="hab">' + esc(d.hab) + "</small></td><td>" + d.itens.map(function (i) { return i + 1; }).join(", ") +
            '</td><td><div class="barra"><span style="width:' + d.pct.toFixed(0) + '%"></span></div>' + fmt(d.pct) + "</td><td>" + NOME_CLASSE[d.classe] + "</td></tr>";
        }).join("") + "</tbody></table></div>";
      h += comparativo(p, t, R);
    } else h += '<p class="vazio">Nenhuma folha corrigida ainda para esta turma.</p>';
    h += '<h3>Por aluno</h3><div class="tabela-rolagem"><table class="res"><thead><tr><th>Aluno</th>' + R.porDisc.map(function (d) { return "<th>" + esc(d.disc) + "</th>"; }).join("") + '<th>Total</th><th>Ações</th></tr></thead><tbody>' +
      R.alunos.map(function (x) {
        var id = x.aluno.id, cols = R.porDisc.length + 1;
        if (x.ausente) return '<tr class="na"><td>' + esc(x.aluno.nome) + '</td><td colspan="' + cols + '">ausente</td><td class="acoes"><button class="mini-x" data-und="' + id + '">Desfazer</button></td></tr>';
        if (!x.avaliado) return '<tr class="na"><td>' + esc(x.aluno.nome) + '</td><td colspan="' + cols + '">não corrigido</td><td class="acoes"><button class="mini-x" data-aus="' + id + '">Ausente</button><button class="mini-x" data-lan="' + id + '">Lançar</button></td></tr>';
        var pct = x.total / R.nq * 100;
        return "<tr><td>" + esc(x.aluno.nome) + "</td>" + R.porDisc.map(function (d) { return "<td>" + d.idx.filter(function (i) { return x.ac[i]; }).length + "/" + d.idx.length + "</td>"; }).join("") +
          '<td class="' + classe(pct) + '"><b>' + x.total + "/" + R.nq + "</b> (" + fmt(pct) + ')</td><td class="acoes"><button class="mini-x" data-ed="' + id + '">Editar</button><button class="mini-x" data-aus="' + id + '">Ausente</button><button class="mini-x" data-del="' + id + '">Apagar</button></td></tr>';
      }).join("") + "</tbody></table></div>";
    if (R.av.length) h += '<h3>Por questão</h3><div class="tabela-rolagem"><table class="res"><thead><tr><th>Nº</th><th>Gab.</th><th>Descritor</th><th>Acerto</th>' +
      LETRAS.slice(0, p.alts).split("").map(function (l) { return "<th>" + l + "</th>"; }).join("") + "<th>Branco</th></tr></thead><tbody>" +
      R.questoes.map(function (q) {
        return '<tr><td>' + pad(q.i + 1) + "</td><td><b>" + esc(q.q.gab) + "</b></td><td>" + esc(q.q.desc) + '</td><td class="' + classe(q.pct) + '">' + fmt(q.pct) + "</td>" +
          LETRAS.slice(0, p.alts).split("").map(function (l) { return "<td" + (l === q.q.gab ? ' class="gabcel"' : "") + ">" + q.dist[l] + "</td>"; }).join("") + "<td>" + ((q.dist[""] || 0) + (q.dist["*"] || 0)) + "</td></tr>";
      }).join("") + "</tbody></table></div>";
    el.innerHTML = h;
    if (R.av.length) {
      $("#rPdf").onclick = function () { relatorioPDF(p, t, R, $("#rInd").checked, false); };
      $("#rEnviar") && ($("#rEnviar").onclick = function () { relatorioPDF(p, t, R, $("#rInd").checked, true); });
      $("#rCsv").onclick = function () { csv(p, t, R); };
      $("#rComp") && ($("#rComp").onchange = function () { selComp = this.value; RENDER.resultados(); });
    }
    var nomeDe = function (id) { var a = t.alunos.find(function (x) { return x.id === id; }); return a ? a.nome : ""; };
    el.querySelectorAll("[data-del]").forEach(function (b) {
      b.onclick = function () { var id = +b.dataset.del; if (!confirm("Apagar a correção de " + nomeDe(id) + "? O aluno volta para pendente.")) return; delete resultados(p.id, t.id)[id]; salvar(); RENDER.resultados(); };
    });
    el.querySelectorAll("[data-aus]").forEach(function (b) { b.onclick = function () { if (marcarAusente(p, t, +b.dataset.aus)) RENDER.resultados(); }; });
    el.querySelectorAll("[data-und]").forEach(function (b) { b.onclick = function () { delete resultados(p.id, t.id)[+b.dataset.und]; salvar(); aviso("Ausência desfeita: o aluno voltou para pendente."); RENDER.resultados(); }; });
    el.querySelectorAll("[data-ed]").forEach(function (b) {
      b.onclick = function () { var id = +b.dataset.ed, r = resultados(p.id, t.id)[id]; atual = leituraManual(p, id, r.resp); atual.editando = true; irPara("corrigir"); mostrarLeitura(atual); };
    });
    el.querySelectorAll("[data-lan]").forEach(function (b) { b.onclick = function () { atual = leituraManual(p, +b.dataset.lan); irPara("corrigir"); mostrarLeitura(atual); }; });
  };

  function comparativo(p, t, R) {
    var outras = provasOrdenadas().filter(function (o) { return o.id !== p.id && calcular(o, t).av.length; });
    if (!outras.length) return "";
    if (!outras.some(function (o) { return o.id === selComp; })) selComp = "";
    var h = '<h3>Evolução por descritor</h3><label>Comparar com<select id="rComp"><option value="">— escolha uma avaliação anterior —</option>' + opcoes(outras, selComp, null, nomeProva) + "</select></label>";
    if (!selComp) return h;
    var o = prova(selComp), R2 = calcular(o, t), mapa = {};
    R2.descritores.forEach(function (d) { mapa[d.chave] = d; });
    var linhas = R.descritores.filter(function (d) { return mapa[d.chave] && !/^Questão /.test(d.desc); });
    if (!linhas.length) return h + '<p class="vazio">As duas avaliações não têm descritores em comum.</p>';
    h += '<div class="tabela-rolagem"><table class="res"><thead><tr><th>Disciplina</th><th>Descritor</th><th>' + esc(o.nome) + "</th><th>" + esc(p.nome) + "</th><th>Variação</th></tr></thead><tbody>" +
      linhas.map(function (d) {
        var a = mapa[d.chave].pct, v = d.pct - a, cls = v >= 5 ? "forte" : v <= -5 ? "fraco" : "medio";
        return "<tr><td>" + esc(d.disc) + "</td><td><b>" + esc(d.desc) + "</b></td><td>" + fmt(a) + '</td><td class="' + d.classe + '">' + fmt(d.pct) + '</td><td class="' + cls + '"><b>' + (v > 0 ? "▲ +" : v < 0 ? "▼ " : "= ") + fmt(v) + "</b></td></tr>";
      }).join("") + "</tbody></table></div><p class=\"dica\">▲ melhorou 5 pontos ou mais · ▼ piorou 5 pontos ou mais.</p>";
    return h;
  }

  function csv(p, t, R) {
    var sep = ";", linhas = [];
    linhas.push(["Aluno"].concat(p.questoes.map(function (q, i) { return "Q" + (i + 1); })).concat(R.porDisc.map(function (d) { return d.disc; })).concat(["Total", "%"]).join(sep));
    linhas.push(["GABARITO"].concat(p.questoes.map(function (q) { return q.gab; })).join(sep));
    R.alunos.forEach(function (x) {
      if (x.ausente) { linhas.push([x.aluno.nome, "ausente"].join(sep)); return; }
      if (!x.avaliado) { linhas.push([x.aluno.nome, "não corrigido"].join(sep)); return; }
      linhas.push([x.aluno.nome].concat(x.resp.map(function (v) { return v === "*" ? "dupla" : v; }))
        .concat(R.porDisc.map(function (d) { return d.idx.filter(function (i) { return x.ac[i]; }).length; }))
        .concat([x.total, (x.total / R.nq * 100).toFixed(1).replace(".", ",")]).join(sep));
    });
    var blob = new Blob(["﻿" + linhas.join("\r\n")], { type: "text/csv;charset=utf-8" });
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = nomeArquivo("Resultados - " + p.nome + " - " + t.nome + ".csv");
    document.body.appendChild(a); a.click(); a.remove();
  }

  // ---------- relatório PDF ----------
  function relatorioPDF(p, t, R, individual, compartilhar) {
    var doc = new jspdf.jsPDF({ unit: "mm", format: "a4" });
    var hoje = new Date().toLocaleDateString("pt-BR");
    var M = 14, PW = 210;
    function cab(titulo, sub) {
      if (D.config.logo) { try { doc.addImage(D.config.logo, "PNG", PW - M - 18, 10, 18, 18); } catch (e) {} }
      doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(60);
      doc.text(String(D.config.escola || "").toUpperCase(), M, 15, { maxWidth: 150 });
      doc.setTextColor(0); doc.setFontSize(15); doc.text(titulo, M, 23);
      doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); doc.setTextColor(70);
      var ls = doc.splitTextToSize(sub, 160);
      doc.text(ls, M, 28.5);
      var yl = 28.5 + (ls.length - 1) * 4 + 3.5;
      doc.setDrawColor(200); doc.setLineWidth(0.4); doc.line(M, yl, PW - M, yl); doc.setTextColor(0);
      return yl + 6;
    }
    function legenda(y) {
      doc.setFontSize(8.5); var x = M;
      ["forte", "medio", "fraco"].forEach(function (k) {
        doc.setFillColor.apply(doc, COR[k]); doc.roundedRect(x, y - 3, 4, 4, 0.8, 0.8, "F");
        var txt = NOME_CLASSE[k] + (k === "forte" ? " (>= " + D.config.forte + "%)" : k === "medio" ? " (" + D.config.fraco + "% a " + (D.config.forte - 1) + "%)" : " (< " + D.config.fraco + "%)");
        doc.text(txt, x + 5.5, y); x += doc.getTextWidth(txt) + 12;
      });
      return y + 6;
    }
    function titulo(txt, y) {
      if (y > 260) { doc.addPage(); y = 18; }
      doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.text(txt, M, y); doc.setFont("helvetica", "normal");
      return y + 3;
    }
    var sub = "Avaliação: " + p.nome + "   |   Turma: " + t.nome + "   |   Gerado em " + hoje;
    var y = cab("Relatório de Desempenho da Turma", sub);
    var presentes = t.alunos.length - R.aus.length;
    var cards = [{ v: R.av.length + "/" + presentes, l: "alunos avaliados" + (R.aus.length ? " (" + R.aus.length + " ausente" + (R.aus.length > 1 ? "s" : "") + ")" : ""), c: null },
      { v: fmt(R.pctMedia), l: "média geral (" + (Math.round(R.media * 10) / 10).toString().replace(".", ",") + " de " + R.nq + ")", c: classe(R.pctMedia) }]
      .concat(R.porDisc.map(function (d) { return { v: fmt(d.pct), l: d.disc, c: classe(d.pct) }; }));
    var cw = (PW - 2 * M - (cards.length - 1) * 4) / cards.length;
    cards.forEach(function (k, i) {
      var x = M + i * (cw + 4);
      doc.setFillColor.apply(doc, k.c ? COR_CLARA[k.c] : [236, 240, 245]); doc.roundedRect(x, y, cw, 18, 2, 2, "F");
      if (k.c) { doc.setFillColor.apply(doc, COR[k.c]); doc.rect(x, y + 2, 1.4, 14, "F"); }
      doc.setFont("helvetica", "bold"); doc.setFontSize(15); doc.text(k.v, x + cw / 2, y + 9, { align: "center" });
      doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.text(k.l, x + cw / 2, y + 14.5, { align: "center", maxWidth: cw - 4 });
    });
    y += 25;
    if (R.aus.length || R.pend) {
      doc.setFontSize(8.5); doc.setTextColor(90);
      var nota = [];
      if (R.aus.length) nota.push("Ausentes (fora das médias): " + R.aus.map(function (x) { return x.aluno.nome; }).join(", ") + ".");
      if (R.pend) nota.push(R.pend + " aluno(s) ainda sem correção.");
      var ln = doc.splitTextToSize(nota.join(" "), PW - 2 * M);
      doc.text(ln, M, y); y += ln.length * 4 + 3; doc.setTextColor(0);
    }
    y = legenda(y);
    y = titulo(p.questoes.some(function (q) { return q.desc; }) ? "Acerto por descritor" : "Acerto por questão", y + 2);
    var bx = M + 30, bw = PW - M - bx - 14, bh = 5.2;
    doc.setFontSize(8);
    var discAtual = null;
    R.descritores.forEach(function (d) {
      if (y > 275) { doc.addPage(); y = 18; }
      if (d.disc !== discAtual) { discAtual = d.disc; y += 2; doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.text(d.disc, M, y + 3); y += 5; doc.setFontSize(8); }
      doc.setFont("helvetica", "bold"); doc.text(d.desc + " (" + d.itens.length + "q)", M + 2, y + 3.8);
      doc.setFillColor(238, 238, 238); doc.rect(bx, y, bw, bh, "F");
      doc.setFillColor.apply(doc, COR[d.classe]); doc.rect(bx, y, Math.max(0.3, bw * d.pct / 100), bh, "F");
      doc.setFont("helvetica", "normal"); doc.text(fmt(d.pct), bx + bw + 1.5, y + 3.8);
      y += bh + 1.6;
    });
    y += 3;
    var fortes = R.descritores.filter(function (d) { return d.classe === "forte"; }).sort(function (a, b) { return b.pct - a.pct; });
    var fracos = R.descritores.filter(function (d) { return d.classe === "fraco"; }).sort(function (a, b) { return a.pct - b.pct; });
    var medios = R.descritores.filter(function (d) { return d.classe === "medio"; }).sort(function (a, b) { return a.pct - b.pct; });
    function blocoLista(tit, k, lista) {
      if (y > 250) { doc.addPage(); y = 18; }
      var body = lista.length ? lista.map(function (d) { return [(d.disc === "Geral" ? "" : d.disc + " - ") + d.desc, d.hab, fmt(d.pct)]; }) : [["Nada nesta faixa.", "", ""]];
      doc.autoTable({
        startY: y, margin: { left: M, right: M }, head: [[{ content: tit, colSpan: 3 }]], body: body,
        styles: { fontSize: 8, cellPadding: 1.6, valign: "middle" },
        headStyles: { fillColor: COR[k], textColor: k === "medio" ? 30 : 255, fontSize: 10 },
        bodyStyles: { fillColor: COR_CLARA[k] }, alternateRowStyles: { fillColor: COR_CLARA[k] },
        columnStyles: { 0: { cellWidth: 38, fontStyle: "bold" }, 2: { cellWidth: 18, halign: "center", fontStyle: "bold" } }
      });
      y = doc.lastAutoTable.finalY + 5;
    }
    if (y > 240) { doc.addPage(); y = 18; }
    blocoLista("PONTOS FORTES", "forte", fortes);
    blocoLista("EM DESENVOLVIMENTO", "medio", medios);
    blocoLista("PONTOS FRACOS - PRIORIDADE DE INTERVENÇÃO", "fraco", fracos);
    y = titulo("Desempenho por questão", y + 2);
    var alts = LETRAS.slice(0, p.alts).split("");
    doc.autoTable({
      startY: y + 1, margin: { left: M, right: M },
      head: [["Nº", "Disciplina", "Descritor", "Gab."].concat(alts).concat(["Branco/dupla", "Acerto"])],
      body: R.questoes.map(function (q) {
        return [pad(q.i + 1), q.q.disc || "", q.q.desc || "", q.q.gab].concat(alts.map(function (l) { return q.dist[l]; })).concat([(q.dist[""] || 0) + (q.dist["*"] || 0), fmt(q.pct)]);
      }),
      styles: { fontSize: 7.5, cellPadding: 1.2, halign: "center" }, headStyles: { fillColor: [55, 65, 81] },
      columnStyles: { 1: { halign: "left" } },
      didParseCell: function (dd) {
        if (dd.section !== "body") return;
        var q = R.questoes[dd.row.index], last = 4 + alts.length + 1;
        if (dd.column.index === last) { var k = classe(q.pct); dd.cell.styles.fillColor = COR_CLARA[k]; dd.cell.styles.textColor = COR[k].map(function (v) { return v * 0.6; }); dd.cell.styles.fontStyle = "bold"; }
        if (dd.column.index >= 4 && dd.column.index < 4 + alts.length && alts[dd.column.index - 4] === q.q.gab) { dd.cell.styles.fontStyle = "bold"; dd.cell.styles.fillColor = [225, 240, 228]; }
      }
    });
    y = doc.lastAutoTable.finalY + 4;
    doc.setFontSize(7.5); doc.setTextColor(90);
    if (y > 280) { doc.addPage(); y = 18; }
    doc.text("Nas colunas das alternativas: número de alunos que marcaram cada letra (a resposta correta aparece em verde).", M, y); doc.setTextColor(0);

    doc.addPage(); y = cab("Desempenho por Aluno", sub);
    doc.autoTable({
      startY: y, margin: { left: M, right: M },
      head: [["Aluno"].concat(R.porDisc.map(function (d) { return d.disc; })).concat(["Total", "%"])],
      body: R.alunos.map(function (x) {
        if (x.ausente) return [x.aluno.nome].concat(R.porDisc.map(function () { return "-"; })).concat(["ausente", ""]);
        if (!x.avaliado) return [x.aluno.nome].concat(R.porDisc.map(function () { return "-"; })).concat(["não corrigido", ""]);
        return [x.aluno.nome].concat(R.porDisc.map(function (d) { var k = d.idx.filter(function (i) { return x.ac[i]; }).length; return k + "/" + d.idx.length; }))
          .concat([x.total + "/" + R.nq, fmt(x.total / R.nq * 100)]);
      }),
      styles: { fontSize: 8.5, cellPadding: 1.6, halign: "center" }, headStyles: { fillColor: [55, 65, 81] },
      columnStyles: { 0: { halign: "left" } },
      didParseCell: function (dd) {
        if (dd.section !== "body") return;
        var x = R.alunos[dd.row.index]; if (!x.avaliado) { dd.cell.styles.textColor = 150; return; }
        var ci = dd.column.index, k = null;
        if (ci >= 1 && ci <= R.porDisc.length) { var d = R.porDisc[ci - 1]; k = classe(d.idx.filter(function (i) { return x.ac[i]; }).length / d.idx.length * 100); }
        if (ci === R.porDisc.length + 2) k = classe(x.total / R.nq * 100);
        if (k) { dd.cell.styles.fillColor = COR_CLARA[k]; dd.cell.styles.fontStyle = "bold"; }
      }
    });
    y = doc.lastAutoTable.finalY + 6;
    var discMapa = [];
    R.descritores.forEach(function (d) { if (discMapa.indexOf(d.disc) < 0) discMapa.push(d.disc); });
    discMapa.forEach(function (disc, n) {
      var dcols = R.descritores.filter(function (d) { return d.disc === disc; });
      if (y > 230) { doc.addPage(); y = 18; }
      y = titulo("Mapa de habilidades (aluno x descritor) - " + disc, y + (n ? 4 : 0));
      var fs = dcols.length > 22 ? 6 : 7.5;
      doc.autoTable({
        startY: y + 1, margin: { left: M, right: M },
        head: [["Aluno"].concat(dcols.map(function (d) { return d.desc; }))],
        body: R.av.map(function (x) {
          return [x.aluno.nome].concat(dcols.map(function (d) { var k = d.itens.filter(function (i) { return x.ac[i]; }).length; return k + "/" + d.itens.length; }));
        }),
        styles: { fontSize: fs, cellPadding: 0.9, halign: "center" }, headStyles: { fillColor: [55, 65, 81], fontSize: fs },
        columnStyles: { 0: { halign: "left", cellWidth: 40 } },
        didParseCell: function (dd) {
          if (dd.section !== "body" || dd.column.index === 0) return;
          var x = R.av[dd.row.index], d = dcols[dd.column.index - 1];
          var k = classe(d.itens.filter(function (i) { return x.ac[i]; }).length / d.itens.length * 100);
          dd.cell.styles.fillColor = COR_CLARA[k]; dd.cell.styles.textColor = COR[k].map(function (v) { return v * 0.55; });
        }
      });
      y = doc.lastAutoTable.finalY + 4;
    });
    doc.setFontSize(7.5); doc.setTextColor(90);
    if (y > 285) { doc.addPage(); y = 18; }
    doc.text("Cada célula mostra acertos/questões do descritor, com a cor da faixa de desempenho.", M, y); doc.setTextColor(0);

    if (individual) R.av.forEach(function (x) {
      doc.addPage();
      var pct = x.total / R.nq * 100;
      var yy = cab("Boletim Individual", "Aluno(a): " + x.aluno.nome + "   |   Turma: " + t.nome + "   |   Avaliação: " + p.nome);
      var cs = [{ v: x.total + "/" + R.nq, l: "acertos", c: classe(pct) }, { v: fmt(pct), l: "aproveitamento", c: classe(pct) }]
        .concat(R.porDisc.map(function (d) { var k = d.idx.filter(function (i) { return x.ac[i]; }).length; var pc = k / d.idx.length * 100; return { v: k + "/" + d.idx.length, l: d.disc, c: classe(pc) }; }));
      var w2 = (PW - 2 * M - (cs.length - 1) * 4) / cs.length;
      cs.forEach(function (k, i) {
        var xx = M + i * (w2 + 4);
        doc.setFillColor.apply(doc, COR_CLARA[k.c]); doc.roundedRect(xx, yy, w2, 16, 2, 2, "F");
        doc.setFillColor.apply(doc, COR[k.c]); doc.rect(xx, yy + 2, 1.4, 12, "F");
        doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.text(k.v, xx + w2 / 2, yy + 8, { align: "center" });
        doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.text(k.l, xx + w2 / 2, yy + 13, { align: "center", maxWidth: w2 - 3 });
      });
      yy = legenda(yy + 23);
      var linhasD = R.descritores.map(function (d) {
        var k = d.itens.filter(function (i) { return x.ac[i]; }).length, pc = k / d.itens.length * 100;
        return { d: d, k: k, pc: pc, c: classe(pc) };
      });
      doc.autoTable({
        startY: yy, margin: { left: M, right: M },
        head: [["Descritor", "Habilidade", "Questões", "Acertos", "Situação"]],
        body: linhasD.map(function (l) {
          return [(l.d.disc === "Matemática" ? "MAT " : l.d.disc === "Língua Portuguesa" ? "LP " : "") + l.d.desc, l.d.hab, l.d.itens.map(function (i) { return (x.ac[i] ? "" : "x") + (i + 1); }).join(" "), l.k + "/" + l.d.itens.length, NOME_CLASSE[l.c]];
        }),
        styles: { fontSize: 7.8, cellPadding: 1.4, valign: "middle" }, headStyles: { fillColor: [55, 65, 81] },
        columnStyles: { 0: { cellWidth: 18, fontStyle: "bold" }, 2: { cellWidth: 24, halign: "center" }, 3: { cellWidth: 15, halign: "center" }, 4: { cellWidth: 30, halign: "center" } },
        didParseCell: function (dd) {
          if (dd.section !== "body") return;
          var c = linhasD[dd.row.index].c;
          if (dd.column.index === 4 || dd.column.index === 3) { dd.cell.styles.fillColor = COR_CLARA[c]; dd.cell.styles.fontStyle = "bold"; dd.cell.styles.textColor = COR[c].map(function (v) { return v * 0.6; }); }
        }
      });
      yy = doc.lastAutoTable.finalY + 4;
      doc.setFontSize(7.5); doc.setTextColor(90);
      doc.text("Na coluna Questões, o \"x\" antes do número indica questão errada.", M, yy); doc.setTextColor(0);
      yy += 7;
      function resumo(rot, cor, lista) {
        doc.setFontSize(9.5);
        var linhas = doc.splitTextToSize(lista.length ? lista.join(", ") : "-", PW - 2 * M - 33);
        if (yy + linhas.length * 4.5 > 285) { doc.addPage(); yy = 18; }
        doc.setFont("helvetica", "bold"); doc.setTextColor.apply(doc, cor); doc.text(rot, M, yy);
        doc.setFont("helvetica", "normal"); doc.setTextColor(0); doc.text(linhas, M + 33, yy);
        yy += linhas.length * 4.5 + 3;
      }
      var lp = function (l) { return (l.d.disc === "Matemática" ? "MAT " : l.d.disc === "Língua Portuguesa" ? "LP " : "") + l.d.desc; };
      resumo("Pontos fortes:", COR.forte.map(function (v) { return v * 0.7; }), linhasD.filter(function (l) { return l.c === "forte"; }).map(lp));
      resumo("Precisa reforçar:", COR.fraco.map(function (v) { return v * 0.8; }), linhasD.filter(function (l) { return l.c === "fraco"; }).map(lp));
    });
    var n = doc.getNumberOfPages();
    for (var i = 1; i <= n; i++) {
      doc.setPage(i); doc.setFontSize(7.5); doc.setTextColor(130);
      doc.text("Página " + i + " de " + n, PW / 2, 291, { align: "center" });
    }
    entregar(doc, "Relatório - " + p.nome + " - " + t.nome + ".pdf", compartilhar);
  }

  // ================= CONFIGURAÇÕES =================
  var promptInstalar = null;
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); promptInstalar = e; if (abaAtual === "config") RENDER.config(); mostrarFaixaInstalar(); });
  function instalado() { return window.matchMedia && window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone; }
  function ehIOS() { return /iphone|ipad|ipod/i.test(navigator.userAgent); }
  function blocoInstalar() {
    if (instalado()) return '<p class="dica">✓ O app já está instalado neste aparelho.</p>';
    if (promptInstalar) return '<button class="prim" id="kInst">📲 Instalar o app neste aparelho</button>';
    if (ehIOS()) return '<p class="dica">No iPhone: abra no Safari, toque em <b>Compartilhar</b> (quadrado com seta) e depois em <b>Adicionar à Tela de Início</b>.</p>';
    return '<p class="dica">No Android: abra no Chrome, toque no menu <b>⋮</b> e escolha <b>Instalar app</b> ou <b>Adicionar à tela inicial</b>.</p>';
  }
  function instalar() { if (!promptInstalar) return; promptInstalar.prompt(); promptInstalar.userChoice.then(function () { promptInstalar = null; var f = $("#faixaInst"); if (f) f.hidden = true; if (abaAtual === "config") RENDER.config(); }); }
  function mostrarFaixaInstalar() {
    var f = $("#faixaInst"); if (!f || instalado() || !promptInstalar) return;
    f.hidden = false; $("#faixaInstBtn").onclick = instalar; $("#faixaInstX").onclick = function () { f.hidden = true; };
  }

  RENDER.config = function rConfig() {
    var el = $("#aba-config"), c = D.config;
    el.innerHTML = "<h2>Configurações</h2>" +
      "<h3>Instalar</h3>" + blocoInstalar() +
      '<h3>Ajuda</h3><div class="botoes"><button id="kTut">❓ Ver o passo a passo</button></div>' +
      "<h3>Escola</h3>" +
      '<label>Nome da escola (sai nas folhas e nos relatórios)<input id="kEsc" value="' + esc(c.escola) + '"></label>' +
      '<label>Logotipo</label><div class="logo-linha">' + (c.logo ? '<img src="' + c.logo + '" alt="">' : '<span class="vazio">sem logotipo</span>') +
      '<label class="botao">Trocar imagem<input type="file" accept="image/*" id="kLogo" hidden></label><button id="kSemLogo">Remover</button></div>' +
      '<div class="linha2"><label>Ponto forte a partir de (%)<input type="number" id="kF" min="1" max="100" value="' + c.forte + '"></label>' +
      '<label>Ponto fraco abaixo de (%)<input type="number" id="kW" min="0" max="99" value="' + c.fraco + '"></label></div>' +
      '<label class="chk"><input type="checkbox" id="kRede"' + (c.rede ? " checked" : "") + '> Receber automaticamente os simulados da rede</label>' +
      '<button class="prim" id="kSalvar">Salvar configurações</button>' +
      "<h3>Cópia de segurança</h3><p class=\"dica\">Turmas, nomes e correções ficam guardados só neste aparelho. Faça backups com frequência e use o arquivo para passar os dados para outro aparelho ou para a versão nova do app.</p>" +
      '<div class="botoes"><button id="kExp">Baixar backup</button><label class="botao">Restaurar backup<input type="file" accept=".json,application/json" id="kImp" hidden></label></div>' +
      '<h3>Zona de perigo</h3><button class="perigo" id="kZerar">Apagar todos os dados</button>' +
      '<p class="dica versao">Versão ' + VERSAO_APP + "</p>";
    $("#kInst") && ($("#kInst").onclick = instalar);
    $("#kTut").onclick = function () { tutorial(0); };
    $("#kSalvar").onclick = function () {
      c.escola = $("#kEsc").value.trim();
      var f = +$("#kF").value, w = +$("#kW").value;
      if (!(w < f)) return aviso("O limite de ponto fraco deve ser menor que o de ponto forte.", true);
      c.forte = f; c.fraco = w; c.rede = $("#kRede").checked; salvar(); atualizaTopo(); aviso("Configurações salvas.");
    };
    $("#kLogo").onchange = function () {
      var f = this.files[0]; if (!f) return;
      var im = new Image(), u = URL.createObjectURL(f);
      im.onload = function () {
        var s = Math.min(1, 300 / Math.max(im.width, im.height)), cv = document.createElement("canvas");
        cv.width = Math.round(im.width * s); cv.height = Math.round(im.height * s);
        var cx = cv.getContext("2d"); cx.fillStyle = "#fff"; cx.fillRect(0, 0, cv.width, cv.height); cx.drawImage(im, 0, 0, cv.width, cv.height);
        c.logo = cv.toDataURL("image/png"); salvar(); atualizaTopo(); RENDER.config();
      };
      im.src = u;
    };
    $("#kSemLogo").onclick = function () { c.logo = null; salvar(); atualizaTopo(); RENDER.config(); };
    $("#kExp").onclick = function () {
      var blob = new Blob([JSON.stringify(D)], { type: "application/json" });
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = "backup-gabaritos-" + new Date().toISOString().slice(0, 10) + ".json"; document.body.appendChild(a); a.click(); a.remove();
    };
    $("#kImp").onchange = function () {
      var f = this.files[0]; if (!f) return;
      var fr = new FileReader();
      fr.onload = function () {
        try {
          var x = JSON.parse(fr.result);
          if (!x.config || !x.provas || !x.turmas) throw 0;
          if (!confirm("Substituir todos os dados deste aparelho pelo backup?")) return;
          D = x; normalizar(); D.config.tutorial = true; salvar(); atualizaTopo(); aviso("Backup restaurado."); RENDER.config();
          if (D.config.rede) sincronizar(false);
        } catch (e) { aviso("Arquivo de backup inválido.", true); }
      };
      fr.readAsText(f);
    };
    $("#kZerar").onclick = function () {
      if (!confirm("Apagar TODAS as turmas, avaliações e correções deste aparelho?")) return;
      if (!confirm("Tem certeza? Esta ação não pode ser desfeita.")) return;
      D = novoBanco(); D.config.tutorial = true; salvar(); atualizaTopo(); aviso("Dados apagados."); RENDER.config();
    };
  };

  // ================= PASSO A PASSO =================
  var PASSOS = [
    { t: "Bem-vindo(a)!", x: "Este app corrige as folhas de respostas pela câmera do celular e mostra o desempenho da turma por descritor. Veja em 4 passos como usar." },
    { t: "1. Cadastre a turma", x: "Na aba <b>Turmas</b>, crie a turma, escolha o ano escolar e cole a lista de alunos, um nome por linha." },
    { t: "2. Imprima as folhas", x: "Os simulados da rede aparecem sozinhos em <b>Avaliações</b>. Na aba <b>Folhas</b>, escolha turma e simulado e baixe o PDF. Imprima em A4, escala 100%." },
    { t: "3. Corrija pela câmera", x: "Na aba <b>Corrigir</b>, toque em <b>Fotografar folha</b> e enquadre só o retângulo com os 4 quadrados pretos. Confira as linhas em laranja e salve. Quem faltou, marque como <b>ausente</b>: não entra nas médias." },
    { t: "4. Veja e envie os resultados", x: "Em <b>Resultados</b> você vê o acerto por descritor, a evolução entre simulados e pode baixar ou enviar o relatório em PDF para a coordenação." }
  ];
  function tutorial(i) {
    var cx = $("#tutorial");
    if (i >= PASSOS.length) { cx.hidden = true; D.config.tutorial = true; salvar(); return; }
    var s = PASSOS[i];
    cx.innerHTML = '<div class="tut-cartao"><div class="tut-pontos">' + PASSOS.map(function (x, k) { return '<span class="' + (k === i ? "on" : "") + '"></span>'; }).join("") + "</div><h2>" + s.t + "</h2><p>" + s.x + '</p><div class="botoes"><button class="prim" id="tutProx">' + (i === PASSOS.length - 1 ? "Começar" : "Próximo") + '</button><button id="tutPular">Pular</button></div></div>';
    cx.hidden = false;
    $("#tutProx").onclick = function () { tutorial(i + 1); };
    $("#tutPular").onclick = function () { tutorial(PASSOS.length); };
  }

  irPara(D.turmas.length ? "corrigir" : "turmas");
  if (!D.config.tutorial) tutorial(0);
  if (D.config.rede) setTimeout(function () { sincronizar(false); }, 400);
  if ("serviceWorker" in navigator && /^https?:/.test(location.protocol)) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }
})();
