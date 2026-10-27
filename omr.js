/* Leitura óptica das folhas de respostas.
   Dois modelos de folha:
   - "a4": modelo antigo, quadrados nos cantos da página A4 inteira;
   - "compacta": quadrados só em volta da área das bolinhas (mais fácil de enquadrar). */
var OMR = (function () {
  var LETRAS = "ABCDE";
  var ID_BITS = 6;

  // ===== Geometrias (mm, página A4 210 x 297) =====
  function geoA4(n, alts) {
    var ncol = n <= 20 ? 1 : (n <= 40 ? 2 : 3);
    var rows = Math.ceil(n / ncol);
    var top = 90, bottom = 270;
    var pitchY = Math.min(9.5, (bottom - top) / rows), pitchX = 9, r = 2.8, labelW = 11, gap = 14;
    var colW = labelW + alts * pitchX, totalW = ncol * colW + (ncol - 1) * gap, x0 = (210 - totalW) / 2;
    var bubbles = [], labels = [], heads = [];
    for (var c = 0; c < ncol; c++) {
      var cx0 = x0 + c * (colW + gap);
      heads.push({ x: cx0 + labelW, y: top - 5 });
      for (var k = 0; k < rows; k++) {
        var q = c * rows + k; if (q >= n) break;
        var y = top + pitchY * (k + 0.5);
        labels.push({ x: cx0, y: y, q: q });
        var row = []; for (var a = 0; a < alts; a++) row.push({ x: cx0 + labelW + pitchX * (a + 0.5), y: y });
        bubbles.push(row);
      }
    }
    var ids = []; for (var i = 0; i < ID_BITS + 1; i++) ids.push({ x: 140 + i * 7, y: 65, s: 5 });
    return {
      tipo: "a4", n: n, alts: alts, r: r, pitchX: pitchX, pitchY: pitchY, labelW: labelW,
      bubbles: bubbles, labels: labels, heads: heads, ids: ids,
      mk: 10, markers: [[15, 15], [195, 15], [195, 282], [15, 282]],
      bar: { x: 80, y: 12, w: 50, h: 6 }, barOpp: { x: 80, y: 297 - 12 - 6, w: 50, h: 6 },
      white: [[15, 60], [15, 150], [15, 240], [195, 60], [195, 150], [195, 240], [50, 15], [160, 15], [60, 282], [150, 282], [105, 287]],
      fw: 180, fh: 267, view: { x: 0, y: 0, w: 210, h: 297 }
    };
  }

  var C_X0 = 17, C_X1 = 193, C_Y0 = 72, C_MK = 8;
  function geoCompacta(n, alts) {
    var ncol = n <= 10 ? 1 : (n <= 20 ? 2 : 3);
    var rows = Math.ceil(n / ncol);
    var pitchY = 8, pitchX = 8, r = 2.7, labelW = 9, gap = 8;
    var colW = labelW + alts * pitchX, totalW = ncol * colW + (ncol - 1) * gap;
    var x0 = (C_X0 + C_X1) / 2 - totalW / 2;
    var Y0 = C_Y0, firstY = Y0 + 19;
    var Y1 = firstY + (rows - 1) * pitchY + 12;
    var bubbles = [], labels = [], heads = [];
    for (var c = 0; c < ncol; c++) {
      var cx0 = x0 + c * (colW + gap);
      heads.push({ x: cx0 + labelW, y: Y0 + 13 });
      for (var k = 0; k < rows; k++) {
        var q = c * rows + k; if (q >= n) break;
        var y = firstY + pitchY * k;
        labels.push({ x: cx0, y: y, q: q });
        var row = []; for (var a = 0; a < alts; a++) row.push({ x: cx0 + labelW + pitchX * (a + 0.5), y: y });
        bubbles.push(row);
      }
    }
    var idX0 = C_X1 - 8 - (ID_BITS + 1) * 6;
    var ids = []; for (var i = 0; i < ID_BITS + 1; i++) ids.push({ x: idX0 + i * 6, y: Y0 + 2, s: 4.5 });
    var bar = { x: 27, y: Y0 + 2, w: 36, h: 4.5 };
    var midY = (Y0 + Y1) / 2, h3 = (Y1 - Y0) / 3;
    return {
      tipo: "compacta", n: n, alts: alts, r: r, pitchX: pitchX, pitchY: pitchY, labelW: labelW,
      bubbles: bubbles, labels: labels, heads: heads, ids: ids, idX0: idX0,
      mk: C_MK, markers: [[C_X0, Y0], [C_X1, Y0], [C_X1, Y1], [C_X0, Y1]],
      bar: bar, barOpp: { x: bar.x, y: Y0 + Y1 - bar.y - bar.h, w: bar.w, h: bar.h },
      white: [[C_X0, Y0 + h3], [C_X0, midY], [C_X0, Y1 - h3], [C_X1, Y0 + h3], [C_X1, midY], [C_X1, Y1 - h3],
              [92, Y0], [112, Y0], [60, Y1], [105, Y1], [150, Y1]],
      fw: C_X1 - C_X0, fh: Y1 - Y0, Y0: Y0, Y1: Y1, X0: C_X0, X1: C_X1,
      view: { x: 8, y: Y0 - 10, w: 194, h: Y1 - Y0 + 20 }
    };
  }

  function geometria(prova) {
    var n = prova.questoes ? prova.questoes.length : prova.n;
    return prova.folha === "compacta" ? geoCompacta(n, prova.alts) : geoA4(n, prova.alts);
  }

  function encodeId(v) {
    var bits = [], ones = 0;
    for (var i = 0; i < ID_BITS; i++) { var b = (v >> i) & 1; bits.push(b); ones += b; }
    bits.push(ones % 2 === 0 ? 1 : 0);
    return bits;
  }
  function decodeId(bits) {
    var ones = 0, v = 0;
    for (var i = 0; i < bits.length; i++) ones += bits[i];
    if (ones % 2 !== 1) return -1;
    for (var j = 0; j < ID_BITS; j++) v |= bits[j] << j;
    return v;
  }

  // ===== Homografia =====
  function solve(A, b) {
    var n = b.length, M = A.map(function (r, i) { return r.concat([b[i]]); });
    for (var c = 0; c < n; c++) {
      var p = c;
      for (var r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
      var t = M[c]; M[c] = M[p]; M[p] = t;
      if (Math.abs(M[c][c]) < 1e-12) return null;
      for (var r2 = 0; r2 < n; r2++) if (r2 !== c) {
        var f = M[r2][c] / M[c][c];
        for (var k = c; k <= n; k++) M[r2][k] -= f * M[c][k];
      }
    }
    return M.map(function (r, i) { return r[n] / r[i]; });
  }
  function homography(src, dst) {
    var A = [], b = [];
    for (var i = 0; i < 4; i++) {
      var x = src[i][0], y = src[i][1], u = dst[i][0], v = dst[i][1];
      A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
      A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
    }
    var h = solve(A, b); if (!h) return null; h.push(1); return h;
  }
  function apply(H, x, y) {
    var w = H[6] * x + H[7] * y + H[8];
    return [(H[0] * x + H[1] * y + H[2]) / w, (H[3] * x + H[4] * y + H[5]) / w];
  }

  // ===== Imagem =====
  function binarize(img) {
    var w = img.w, h = img.h, g = img.gray;
    var I = new Float64Array((w + 1) * (h + 1));
    for (var y = 0; y < h; y++) {
      var s = 0;
      for (var x = 0; x < w; x++) { s += g[y * w + x]; I[(y + 1) * (w + 1) + x + 1] = I[y * (w + 1) + x + 1] + s; }
    }
    var R = Math.max(8, Math.round(Math.max(w, h) / 25));
    var out = new Uint8Array(w * h);
    for (var y2 = 0; y2 < h; y2++) {
      var y0 = Math.max(0, y2 - R), y1 = Math.min(h, y2 + R + 1);
      for (var x2 = 0; x2 < w; x2++) {
        var xa = Math.max(0, x2 - R), xb = Math.min(w, x2 + R + 1);
        var sum = I[y1 * (w + 1) + xb] - I[y0 * (w + 1) + xb] - I[y1 * (w + 1) + xa] + I[y0 * (w + 1) + xa];
        var mean = sum / ((y1 - y0) * (xb - xa));
        out[y2 * w + x2] = (g[y2 * w + x2] < mean * 0.72 && g[y2 * w + x2] < 150) ? 1 : 0;
      }
    }
    return out;
  }
  function components(bin, w, h) {
    var lab = new Int32Array(w * h), comps = [], stack = new Int32Array(w * h);
    var minA = Math.pow(Math.max(w, h) / 200, 2), cur = 0;
    for (var i = 0; i < w * h; i++) {
      if (!bin[i] || lab[i]) continue;
      cur++;
      var sp = 0; stack[sp++] = i; lab[i] = cur;
      var area = 0, sx = 0, sy = 0, x0 = w, y0 = h, x1 = 0, y1 = 0;
      while (sp) {
        var p = stack[--sp], px = p % w, py = (p - px) / w;
        area++; sx += px; sy += py;
        if (px < x0) x0 = px; if (px > x1) x1 = px; if (py < y0) y0 = py; if (py > y1) y1 = py;
        if (px > 0 && bin[p - 1] && !lab[p - 1]) { lab[p - 1] = cur; stack[sp++] = p - 1; }
        if (px < w - 1 && bin[p + 1] && !lab[p + 1]) { lab[p + 1] = cur; stack[sp++] = p + 1; }
        if (py > 0 && bin[p - w] && !lab[p - w]) { lab[p - w] = cur; stack[sp++] = p - w; }
        if (py < h - 1 && bin[p + w] && !lab[p + w]) { lab[p + w] = cur; stack[sp++] = p + w; }
      }
      if (area < minA) continue;
      var bw = x1 - x0 + 1, bh = y1 - y0 + 1;
      comps.push({ id: cur, area: area, cx: sx / area, cy: sy / area, x0: x0, y0: y0, bw: bw, bh: bh, fill: area / (bw * bh) });
    }
    comps.lab = lab;
    return comps;
  }
  // quadrado: (distância máx. do centro)² / área ≈ 0,5; círculo ≈ 0,32
  function quadratura(c, lab, w) {
    var m = 0;
    for (var y = c.y0; y < c.y0 + c.bh; y++) for (var x = c.x0; x < c.x0 + c.bw; x++) {
      if (lab[y * w + x] !== c.id) continue;
      var d = (x - c.cx) * (x - c.cx) + (y - c.cy) * (y - c.cy); if (d > m) m = d;
    }
    return m / c.area;
  }
  function orderQuad(pts) {
    var cx = 0, cy = 0;
    pts.forEach(function (p) { cx += p[0]; cy += p[1]; }); cx /= 4; cy /= 4;
    pts = pts.slice().sort(function (a, b) { return Math.atan2(a[1] - cy, a[0] - cx) - Math.atan2(b[1] - cy, b[0] - cx); });
    var k = 0, best = 1e18;
    pts.forEach(function (p, i) { if (p[0] + p[1] < best) { best = p[0] + p[1]; k = i; } });
    return pts.slice(k).concat(pts.slice(0, k));
  }
  function dist(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }
  function convex(q) {
    var s = 0;
    for (var i = 0; i < 4; i++) {
      var a = q[i], b = q[(i + 1) % 4], c = q[(i + 2) % 4];
      var z = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
      if (i === 0) s = Math.sign(z); else if (Math.sign(z) !== s) return false;
    }
    return true;
  }
  function findMarkers(img, G) {
    var bin = binarize(img);
    var comps = components(bin, img.w, img.h);
    var maxA = img.w * img.h * 0.03;
    var cand = comps.filter(function (c) {
      var ar = c.bw / c.bh;
      if (!(c.fill > 0.5 && ar > 0.4 && ar < 2.5 && c.area < maxA)) return false;
      var q = quadratura(c, comps.lab, img.w);
      return q > 0.4 && q < 0.75;
    }).sort(function (a, b) { return b.area - a.area; }).slice(0, 14);
    if (cand.length < 4) return null;
    var expected = Math.min(G.fw, G.fh) / Math.max(G.fw, G.fh), mkRel = G.mk / Math.min(G.fw, G.fh), list = [];
    for (var a = 0; a < cand.length; a++) for (var b = a + 1; b < cand.length; b++)
      for (var c = b + 1; c < cand.length; c++) for (var d = c + 1; d < cand.length; d++) {
        var set = [cand[a], cand[b], cand[c], cand[d]];
        var areas = set.map(function (s) { return s.area; });
        var amin = Math.min.apply(null, areas), amax = Math.max.apply(null, areas);
        if (amin / amax < 0.3) continue;
        var q = orderQuad(set.map(function (s) { return [s.cx, s.cy]; }));
        if (!convex(q)) continue;
        var s1 = (dist(q[0], q[1]) + dist(q[2], q[3])) / 2, s2 = (dist(q[1], q[2]) + dist(q[3], q[0])) / 2;
        var ratio = Math.min(s1, s2) / Math.max(s1, s2);
        var side = Math.sqrt(amax), expSide = Math.min(s1, s2) * mkRel;
        var sizeErr = Math.abs(Math.log(side / expSide));
        if (sizeErr > 0.9) continue;
        var score = Math.abs(Math.log(ratio / expected)) * 3 + (1 - amin / amax) * 0.5 + sizeErr - Math.log(Math.min(s1, s2)) * 0.3;
        list.push({ score: score, q: q });
      }
    list.sort(function (a, b) { return a.score - b.score; });
    return list.length ? list.slice(0, 20).map(function (x) { return x.q; }) : null;
  }
  function sampler(img) {
    var w = img.w, h = img.h, g = img.gray;
    return function (x, y) {
      if (x < 0 || y < 0 || x >= w - 1 || y >= h - 1) return 255;
      var x0 = x | 0, y0 = y | 0, fx = x - x0, fy = y - y0, i = y0 * w + x0;
      return (g[i] * (1 - fx) + g[i + 1] * fx) * (1 - fy) + (g[i + w] * (1 - fx) + g[i + w + 1] * fx) * fy;
    };
  }
  function discMean(H, S, cx, cy, rad) {
    var s = 0, n = 0, st = rad / 4;
    for (var dy = -rad; dy <= rad + 1e-9; dy += st) for (var dx = -rad; dx <= rad + 1e-9; dx += st) {
      if (dx * dx + dy * dy > rad * rad) continue;
      var p = apply(H, cx + dx, cy + dy); s += S(p[0], p[1]); n++;
    }
    return s / n;
  }
  function ringMedian(H, S, cx, cy, rad) {
    var v = [];
    for (var k = 0; k < 16; k++) { var t = k * Math.PI / 8, p = apply(H, cx + rad * Math.cos(t), cy + rad * Math.sin(t)); v.push(S(p[0], p[1])); }
    v.sort(function (a, b) { return a - b; });
    return v[11];
  }
  function rectMean(H, S, x, y, w, h) {
    var s = 0, n = 0;
    for (var yy = y + h * 0.2; yy <= y + h * 0.8; yy += h * 0.15) for (var xx = x + w * 0.1; xx <= x + w * 0.9; xx += w * 0.1) {
      var p = apply(H, xx, yy); s += S(p[0], p[1]); n++;
    }
    return s / n;
  }

  // img: {w,h,gray}; prova: {questoes|n, alts, folha}
  function read(img, prova) {
    var G = geometria(prova);
    var quads = findMarkers(img, G);
    var msg = G.tipo === "compacta"
      ? "Não encontrei os 4 quadrados pretos em volta das bolinhas. Enquadre o retângulo inteiro, de cima, com boa luz."
      : "Não encontrei os 4 quadrados pretos dos cantos. Fotografe a folha inteira, de cima, com boa luz.";
    if (!quads) return { ok: false, erro: msg };
    var S = sampler(img), best = null, landscape = G.fw > G.fh, squareish = Math.abs(Math.log(G.fw / G.fh)) < 0.2;
    quads.forEach(function (q) {
      for (var rot = 0; rot < 4; rot++) {
        var dst = [0, 1, 2, 3].map(function (i) { return q[(i + rot) % 4]; });
        if (!squareish) {
          var e1 = (dist(dst[0], dst[1]) + dist(dst[2], dst[3])) / 2, e2 = (dist(dst[1], dst[2]) + dist(dst[3], dst[0])) / 2;
          if ((e1 > e2) !== landscape) continue;
        }
        var H = homography(G.markers, dst); if (!H) continue;
        var bar = rectMean(H, S, G.bar.x, G.bar.y, G.bar.w, G.bar.h);
        var opp = rectMean(H, S, G.barOpp.x, G.barOpp.y, G.barOpp.w, G.barOpp.h);
        var wv = G.white.map(function (p) { return discMean(H, S, p[0], p[1], 2); });
        var wmin = Math.min.apply(null, wv), wavg = wv.reduce(function (a, b) { return a + b; }, 0) / wv.length;
        // em volta de cada quadrado do canto o papel deve ser branco (evita confundir com os quadradinhos do código)
        var anel = 0, na = 0;
        G.markers.forEach(function (m) {
          for (var k = 0; k < 12; k++) { var t = k * Math.PI / 6, pp = apply(H, m[0] + G.mk * 0.8 * Math.cos(t), m[1] + G.mk * 0.8 * Math.sin(t)); anel += S(pp[0], pp[1]); na++; }
        });
        anel /= na;
        var sc = (wavg - bar) + Math.min(0, wmin - bar * 1.0 - 40) * 2 - Math.max(0, wavg - opp) * 0.5 + (opp - bar) * 0.5 - Math.max(0, wavg - anel - 10) * 1.5;
        if (!best || sc > best.sc) best = { sc: sc, H: H, corners: dst };
      }
    });
    if (!best) return { ok: false, erro: "Não consegui alinhar a folha. Tente outra foto." };
    var H2 = best.H, res = [], conf = [], fills = [];
    G.bubbles.forEach(function (row) {
      var f = row.map(function (b) {
        var white = ringMedian(H2, S, b.x, b.y, G.r * 1.45);
        var m = discMean(H2, S, b.x, b.y, G.r * 0.62);
        return Math.max(0, Math.min(1, (white - m) / Math.max(40, white * 0.8)));
      });
      fills.push(f);
      var idx = f.map(function (v, i) { return i; }).sort(function (a, b) { return f[b] - f[a]; });
      var b1 = f[idx[0]], b2 = f[idx[1]], ans, c;
      if (b1 < 0.22) { ans = ""; c = b1 < 0.12 ? "ok" : "duvida"; }
      else if (b2 > 0.35 && b2 > b1 * 0.6) { ans = "*"; c = "duvida"; }
      else { ans = LETRAS[idx[0]]; c = (b1 > 0.38 && b1 - b2 > 0.2) ? "ok" : "duvida"; }
      res.push(ans); conf.push(c);
    });
    var bits = G.ids.map(function (s) {
      var m = rectMean(H2, S, s.x, s.y, s.s, s.s);
      var white = ringMedian(H2, S, s.x + s.s / 2, s.y + s.s / 2, s.s * 0.95);
      return (white - m) / Math.max(40, white) > 0.4 ? 1 : 0;
    });
    return { ok: true, respostas: res, confianca: conf, fills: fills, alunoId: decodeId(bits), H: H2, corners: best.corners, G: G };
  }

  return { geometria: geometria, encodeId: encodeId, decodeId: decodeId, read: read, homography: homography, apply: apply, LETRAS: LETRAS };
})();
if (typeof module !== "undefined") module.exports = OMR;

/* ===== Desenho da folha de respostas (jsPDF, mm) ===== */
function desenharFolha(doc, opt) {
  // opt: {escola, logo, prova:{nome, questoes, alts, folha}, turma, aluno, alunoId}
  var G = OMR.geometria(opt.prova);
  if (G.tipo === "compacta") return desenharFolhaCompacta(doc, opt, G);
  var mk = G.mk;
  doc.setFillColor(0, 0, 0);
  G.markers.forEach(function (m) { doc.rect(m[0] - mk / 2, m[1] - mk / 2, mk, mk, "F"); });
  doc.rect(G.bar.x, G.bar.y, G.bar.w, G.bar.h, "F");
  var hx = 24, hy = 26;
  if (opt.logo) { try { doc.addImage(opt.logo, "PNG", 168, 23, 20, 20); } catch (e) {} }
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold"); doc.setFontSize(10.5);
  doc.text(String(opt.escola || "").toUpperCase(), hx, hy, { maxWidth: 140 });
  doc.setFontSize(13); doc.text("FOLHA DE RESPOSTAS", hx, hy + 8);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  doc.text("Avaliação: " + (opt.prova.nome || ""), hx, hy + 14, { maxWidth: 140 });
  doc.setDrawColor(0); doc.setLineWidth(0.25);
  var linha = function (rot, val, y, x2, xs) {
    var hx2 = xs || 24;
    doc.setFont("helvetica", "bold"); doc.text(rot, hx2, y);
    var w = doc.getTextWidth(rot) + 1.5;
    doc.setFont("helvetica", "normal");
    if (val) doc.text(val, hx2 + w + 1, y - 0.8, { maxWidth: x2 - hx2 - w - 2 });
    doc.line(hx2 + w, y + 0.6, x2, y + 0.6);
  };
  linha("Aluno(a):", opt.aluno || "", hy + 22, 186);
  linha("Turma:", opt.turma || "", hy + 30, 110);
  linha("Data:", "", hy + 30, 186, 120);
  doc.setFontSize(8.5);
  doc.text(["Pinte TODO o círculo da alternativa escolhida, com caneta azul ou preta.",
    "Marque apenas UMA alternativa por questão. Não rasure e não dobre a folha.",
    "Não escreva perto dos quadrados pretos."], hx, 64);
  doc.setFont("helvetica", "bold"); doc.text("Exemplo:", hx, 77.2);
  doc.setLineWidth(0.3);
  [0, 1, 2, 3].forEach(function (i) { var x = hx + 18 + i * 6.5; if (i === 1) doc.circle(x, 76.2, 2.2, "FD"); else doc.circle(x, 76.2, 2.2, "S"); });
  doc.setFontSize(7); doc.setFont("helvetica", "normal");
  doc.text("Código (não marque)", 140, 63.5);
  desenharCodigo(doc, G, opt.alunoId, 0.15);
  desenharGrade(doc, G, 9, 10);
  var discs = faixasDisc(opt.prova);
  if (discs) { doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.text(discs, 105, 276, { align: "center", maxWidth: 160 }); }
}
function faixasDisc(prova) {
  var discs = [];
  prova.questoes.forEach(function (q, i) {
    var d = q.disc || ""; if (!d) return;
    var last = discs[discs.length - 1];
    if (last && last.d === d) last.fim = i + 1; else discs.push({ d: d, ini: i + 1, fim: i + 1 });
  });
  return discs.length ? discs.map(function (x) { return x.d + ": questões " + x.ini + " a " + x.fim; }).join("     |     ") : "";
}
function desenharCodigo(doc, G, alunoId, lw) {
  var bits = alunoId ? OMR.encodeId(alunoId) : null;
  G.ids.forEach(function (s, i) {
    doc.setLineWidth(lw); doc.setDrawColor(150);
    if (bits && bits[i]) { doc.setFillColor(0, 0, 0); doc.rect(s.x, s.y, s.s, s.s, "F"); } else doc.rect(s.x, s.y, s.s, s.s, "S");
  });
  doc.setDrawColor(0);
}
function desenharGrade(doc, G, fsHead, fsNum) {
  doc.setFont("helvetica", "bold"); doc.setFontSize(fsHead); doc.setTextColor(0);
  G.heads.forEach(function (h) {
    for (var a = 0; a < G.alts; a++) doc.text(OMR.LETRAS[a], h.x + G.pitchX * (a + 0.5), h.y + 1.5, { align: "center" });
  });
  G.labels.forEach(function (lb, i) {
    var k = G.tipo === "compacta" ? Math.round((lb.y - G.labels[0].y) / G.pitchY) : i;
    if (k % 2 === 0) { doc.setFillColor(236, 236, 236); doc.rect(lb.x - 1, lb.y - G.pitchY / 2, G.labelW + G.alts * G.pitchX + 1, G.pitchY, "F"); }
    doc.setFont("helvetica", "bold"); doc.setFontSize(fsNum);
    doc.text(String(lb.q + 1).padStart(2, "0"), lb.x + 0.8, lb.y + 1.3);
  });
  doc.setLineWidth(0.3); doc.setDrawColor(70);
  G.bubbles.forEach(function (row) { row.forEach(function (b) { doc.setFillColor(255, 255, 255); doc.circle(b.x, b.y, G.r, "FD"); }); });
  doc.setDrawColor(0); doc.setFillColor(0, 0, 0);
}
function desenharFolhaCompacta(doc, opt, G) {
  var hx = 17;
  doc.setTextColor(0, 0, 0);
  if (opt.logo) { try { doc.addImage(opt.logo, "PNG", 173, 10, 20, 20); } catch (e) {} }
  doc.setFont("helvetica", "bold"); doc.setFontSize(10);
  doc.text(String(opt.escola || "").toUpperCase(), hx, 15, { maxWidth: 150 });
  doc.setFontSize(13); doc.text("FOLHA DE RESPOSTAS", hx, 23);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9.5);
  doc.text("Avaliação: " + (opt.prova.nome || ""), hx, 29, { maxWidth: 150 });
  doc.setDrawColor(0); doc.setLineWidth(0.25);
  var linha = function (rot, val, y, x1, x2) {
    doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.text(rot, x1, y);
    var w = doc.getTextWidth(rot) + 1.5;
    doc.setFont("helvetica", "normal");
    if (val) doc.text(val, x1 + w + 1, y - 0.8, { maxWidth: x2 - x1 - w - 2 });
    doc.line(x1 + w, y + 0.6, x2, y + 0.6);
  };
  linha("Aluno(a):", opt.aluno || "", 40, hx, 193);
  linha("Turma:", opt.turma || "", 48, hx, 112);
  linha("Data:", "", 48, 120, 193);
  doc.setFontSize(8.2); doc.setFont("helvetica", "normal");
  doc.text("Pinte TODO o círculo da alternativa escolhida, com caneta azul ou preta. Marque apenas UMA alternativa por questão.", hx, 53.5);
  doc.text("Não rasure, não dobre a folha e não escreva dentro do retângulo, a não ser nas bolinhas.", hx, 57);
  doc.setFont("helvetica", "bold"); doc.text("Exemplo:", hx, 62.4);
  doc.setLineWidth(0.3);
  [0, 1, 2, 3].forEach(function (i) { var x = hx + 17 + i * 6; if (i === 1) doc.circle(x, 61.5, 2, "FD"); else doc.circle(x, 61.5, 2, "S"); });
  // marcadores, barra e moldura leve
  var mk = G.mk;
  doc.setFillColor(0, 0, 0);
  G.markers.forEach(function (m) { doc.rect(m[0] - mk / 2, m[1] - mk / 2, mk, mk, "F"); });
  doc.rect(G.bar.x, G.bar.y, G.bar.w, G.bar.h, "F");
  doc.setFontSize(6.5); doc.setFont("helvetica", "normal"); doc.setTextColor(120);
  doc.text("código - não marque", G.idX0 - 2, G.Y0 + 5.5, { align: "right" });
  doc.setTextColor(0);
  desenharCodigo(doc, G, opt.alunoId, 0.15);
  desenharGrade(doc, G, 9, 9.5);
  // abaixo do retângulo
  doc.setFont("helvetica", "normal"); doc.setFontSize(8.2);
  var y = G.Y1 + 9;
  var discs = faixasDisc(opt.prova);
  if (discs) { var dl = doc.splitTextToSize(discs, 176); doc.text(dl, 105, y, { align: "center" }); y += 4 * dl.length + 2; }
  doc.setTextColor(110); doc.setFontSize(7.5);
  doc.text("Para corrigir: fotografe só o retângulo com os 4 quadrados pretos, de cima e com boa luz.", 105, y, { align: "center" });
  doc.setTextColor(0);
}
