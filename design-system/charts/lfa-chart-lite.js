/* ============================================================================
   LFA Chart Lite — zero-dependency <lfa-chart> renderer (replaces echarts)
   ----------------------------------------------------------------------------
   Drop-in for lfa-chart-engine.js + lfa-chart-studio.js + the echarts CDN.
   Renders pure inline SVG, so pages paint instantly and never block/crash on a
   2 MB library download. Same public contract everything already uses:
     <lfa-chart chart-id="…" theme="lfa|lfg-zest"></lfa-chart>
     window.LFA_CHART_SPECS[id] = spec
     window.LFAChart.redrawAll()
     localStorage "lfa-chart:<id>" overrides   ·   window.LFA_CHART_EDIT
   Spec schema (unchanged):
     { type, meta:{title,xLabel,yLabel,y2Label,nCcy,hideLegend},
       series:[{ name, color, points:[{x,y}] }] }
   Supported types: barh, groupbar/bar/stacked, rangebar, perfstack,
   perfstackmulti, line/area. (The deck + Data Master use these.)
   ============================================================================ */
(function () {
  'use strict';

  var THEMES = {
    lfa: { ink: '#23366E', grid: '#E0E4EB', axis: '#8C95B2', neg: '#C24A5E', pos: '#3E7C72',
      font: "'Mulish','Helvetica Neue',Arial,sans-serif",
      cat: ['#23366E', '#C24A5E', '#3E7C72', '#B0852F', '#6B5B95', '#5A6678', '#9C2D3A', '#3C6E8F'] },
    'lfg-zest': { ink: '#4A0C18', grid: '#ECE8E2', axis: '#A39B90', neg: '#9E2A36', pos: '#3F7A5A',
      font: "'Raleway','Helvetica Neue',Arial,sans-serif",
      cat: ['#83021A', '#B0852F', '#5A626B', '#3E6E66', '#A65A3A', '#7C5466', '#9E2A36', '#5A0B14'] },
    neutro: { ink: '#1f2933', grid: '#e4e7eb', axis: '#9aa5b1', neg: '#a14b4b', pos: '#3f7d6e',
      font: "'Inter',system-ui,sans-serif",
      cat: ['#2b5d8c', '#c08a3e', '#3f7d6e', '#8c5a7c', '#6b7280', '#a14b4b'] }
  };

  window.LFA_CHART_SPECS = window.LFA_CHART_SPECS || {};

  /* ---------- data helpers ---------- */
  function normalize(spec) {
    var d = spec || {};
    return { type: d.type || 'line', meta: d.meta || {},
      series: (d.series || []).map(function (s) { return { name: s.name || 'Series', color: s.color || null, points: (s.points || []).slice() }; }) };
  }
  function uniqueX(series) { var xs = [], seen = {}; series.forEach(function (s) { (s.points || []).forEach(function (p) { var k = String(p.x); if (!seen[k]) { seen[k] = 1; xs.push(p.x); } }); }); return xs; }
  function along(s, xs) { var m = {}; ((s && s.points) || []).forEach(function (p) { m[String(p.x)] = p.y; }); return xs.map(function (x) { var v = m[String(x)]; return v === undefined ? null : v; }); }
  function niceStep(raw) { if (raw <= 0) return 1; var p = Math.pow(10, Math.floor(Math.log10(raw))); var f = raw / p; var nf = f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10; return nf * p; }
  function niceCeil(v) { if (v <= 0) return 1; var step = niceStep(v / 4); return Math.ceil(v / step) * step; }
  function ticks(min, max, n) { n = n || 4; if (min === max) max = min + 1; var step = niceStep((max - min) / n); var start = Math.ceil(min / step) * step; var out = []; for (var v = start; v <= max + 1e-9; v += step) out.push(Math.round(v * 1e6) / 1e6); if (!out.length) out.push(min); return out; }

  /* ---------- svg string helpers ---------- */
  var _font = THEMES.lfa.font;
  function r2(n) { return Math.round(n * 100) / 100; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function fmtTick(v) { var r = Math.round(v * 10) / 10; return (r === Math.round(r)) ? String(Math.round(r)) : r.toFixed(1); }
  function ln(x1, y1, x2, y2, c, w) { return '<line x1="' + r2(x1) + '" y1="' + r2(y1) + '" x2="' + r2(x2) + '" y2="' + r2(y2) + '" stroke="' + c + '" stroke-width="' + (w || 1) + '"/>'; }
  function rect(x, y, w, h, c, rad, opts) { return '<rect x="' + r2(x) + '" y="' + r2(y) + '" width="' + r2(Math.max(0, w)) + '" height="' + r2(Math.max(0, h)) + '" rx="' + (rad || 0) + '" fill="' + c + '"' + (opts || '') + '/>'; }
  function txt(x, y, str, c, anchor, size, weight) { return '<text x="' + r2(x) + '" y="' + r2(y) + '" fill="' + c + '" font-family="' + _font + '" font-size="' + (size || 11) + '" font-weight="' + (weight || 400) + '" text-anchor="' + (anchor || 'start') + '">' + esc(str) + '</text>'; }
  function approxW(s, size) { return String(s).length * (size || 11) * 0.58; }
  function toHex(c) { if (!c) return '#83021A'; c = String(c).trim(); if (/^#[0-9a-f]{6}$/i.test(c)) return c; if (/^#[0-9a-f]{3}$/i.test(c)) return '#' + c[1] + c[1] + c[2] + c[2] + c[3] + c[3]; var m = c.match(/\d+(\.\d+)?/g); if (m && m.length >= 3) return '#' + m.slice(0, 3).map(function (n) { return ('0' + Math.round(+n).toString(16)).slice(-2); }).join(''); return '#83021A'; }
  function legend(items, x, y, t) { var out = '', cx = x; items.forEach(function (it) { out += rect(cx, y, 11, 11, it.color, 2); out += txt(cx + 15, y + 10, it.name, t.ink, 'start', 11, 600); cx += 15 + approxW(it.name, 11) + 18; }); return out; }
  function wrap(W, H, inner) { return '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" style="display:block">' + inner + '</svg>'; }

  /* ---------- renderers ---------- */
  function buildSVG(spec, t, W, H) {
    _font = t.font;
    var d = normalize(spec);
    if (d.type === 'rangebar') return rangeSVG(d, t, W, H);
    if (d.type === 'perfstack' || d.type === 'perfstackmulti') return perfSVG(d, t, W, H);
    if (d.type === 'barh' || d.type === 'stackedh') return barsSVG(d, t, W, H, true);
    if (d.type === 'line' || d.type === 'area' || d.type === 'rebased') return lineSVG(d, t, W, H);
    return barsSVG(d, t, W, H, false);
  }

  function barsSVG(d, t, W, H, horizontal) {
    var xs = uniqueX(d.series), nc = xs.length, ns = d.series.length, multi = ns > 1;
    var mat = d.series.map(function (s) { return along(s, xs); });
    var maxV = 0, minV = 0;
    mat.forEach(function (r) { r.forEach(function (v) { if (v != null) { if (v > maxV) maxV = v; if (v < minV) minV = v; } }); });
    if (maxV === 0 && minV === 0) maxV = 1;
    var s = [], legendH = multi ? 22 : 0;
    if (horizontal) {
      var padL = 96, padR = 46, padT = 8 + legendH, padB = 22;
      var pW = Math.max(10, W - padL - padR), pH = Math.max(10, H - padT - padB);
      var xmax = niceCeil(maxV), sx = function (v) { return padL + (v / xmax) * pW; };
      ticks(0, xmax, 4).forEach(function (tk) { var x = sx(tk); s.push(ln(x, padT, x, padT + pH, t.grid)); s.push(txt(x, padT + pH + 13, fmtTick(tk), t.axis, 'middle', 10)); });
      var band = pH / Math.max(1, nc);
      for (var i = 0; i < nc; i++) {
        var yTop = padT + i * band;
        s.push(txt(padL - 8, yTop + band / 2 + 4, String(xs[i]), t.ink, 'end', 11.5, 600));
        var inner = Math.min(band * 0.66, 64), gap = ns > 1 ? inner * 0.16 : 0, bh = (inner - gap * (ns - 1)) / ns, y0 = yTop + (band - inner) / 2;
        for (var j = 0; j < ns; j++) {
          var v = mat[j][i]; if (v == null) continue;
          var col = d.series[j].color || t.cat[j % t.cat.length], by = y0 + j * (bh + gap);
          s.push(rect(sx(0), by, sx(v) - sx(0), bh, col, 3));
          if (v !== 0 && v != null) s.push(txt(sx(v) + 5, by + bh / 2 + 4, fmtTick(v), t.ink, 'start', 10.5, 600));
        }
      }
    } else {
      var padL2 = 44, padR2 = 16, padT2 = 8 + legendH, padB2 = 38;
      var pW2 = Math.max(10, W - padL2 - padR2), pH2 = Math.max(10, H - padT2 - padB2);
      var ymax = niceCeil(maxV), ymin = minV < 0 ? -niceCeil(-minV) : 0; if (ymax === ymin) ymax = ymin + 1;
      var sy = function (v) { return padT2 + pH2 - ((v - ymin) / (ymax - ymin)) * pH2; };
      ticks(ymin, ymax, 4).forEach(function (tk) { var y = sy(tk); s.push(ln(padL2, y, padL2 + pW2, y, t.grid)); s.push(txt(padL2 - 6, y + 4, fmtTick(tk), t.axis, 'end', 10)); });
      var band2 = pW2 / Math.max(1, nc);
      for (var i2 = 0; i2 < nc; i2++) {
        var xL = padL2 + i2 * band2;
        s.push(txt(xL + band2 / 2, padT2 + pH2 + 15, String(xs[i2]), t.ink, 'middle', 11));
        var inner2 = band2 * 0.64, gap2 = ns > 1 ? inner2 * 0.12 : 0, bw2 = (inner2 - gap2 * (ns - 1)) / ns, x0 = xL + (band2 - inner2) / 2;
        for (var j2 = 0; j2 < ns; j2++) {
          var v2 = mat[j2][i2]; if (v2 == null) continue;
          var c2 = d.series[j2].color || t.cat[j2 % t.cat.length], yv = sy(v2), yz = sy(0);
          s.push(rect(x0 + j2 * (bw2 + gap2), Math.min(yv, yz), bw2, Math.abs(yv - yz), c2, 2));
        }
      }
    }
    if (multi) s.push(legend(d.series.map(function (ss, i) { return { name: ss.name, color: ss.color || t.cat[i % t.cat.length] }; }), 6, 4, t));
    return wrap(W, H, s.join(''));
  }

  function rangeSVG(d, t, W, H) {
    var find = function (re) { return d.series.filter(function (s) { return re.test((s.name || '').toLowerCase()); })[0]; };
    var sMin = find(/min/) || d.series[0], sMax = find(/max/) || d.series[1], sBen = find(/bench|saa|target|strateg/) || d.series[2];
    var cats = ((sMin || { points: [] }).points).map(function (p) { return String(p.x); });
    var minV = along(sMin, cats), maxV = along(sMax, cats), benV = along(sBen, cats);
    var maxAll = 0; maxV.concat(benV).forEach(function (v) { if (v != null && v > maxAll) maxAll = v; });
    var xmax = niceCeil(maxAll || 1);
    var padL = 92, padR = 52, padT = 10, padB = 26;
    var pW = Math.max(10, W - padL - padR), pH = Math.max(10, H - padT - padB);
    var sx = function (v) { return padL + (v / xmax) * pW; };
    var s = [], nc = cats.length, band = pH / Math.max(1, nc);
    var rangeCol = (sMin && sMin.color) || t.cat[0], markCol = (sBen && sBen.color) || t.neg;
    // x-axis: 0 → max scale with gridlines + tick labels
    ticks(0, xmax, 4).forEach(function (tk) { var x = sx(tk); s.push(ln(x, padT, x, padT + pH, t.grid)); s.push(txt(x, padT + pH + 14, fmtTick(tk) + '%', t.axis, 'middle', 9.5)); });
    for (var i = 0; i < nc; i++) {
      var yC = padT + i * band + band / 2;
      s.push(txt(padL - 8, yC + 4, cats[i], t.ink, 'end', 11.5, 600));
      var mn = minV[i] || 0, mx = maxV[i] || 0, bh = Math.min(band * 0.46, 26);
      s.push('<rect x="' + r2(sx(mn)) + '" y="' + r2(yC - bh / 2) + '" width="' + r2(Math.max(2, sx(mx) - sx(mn))) + '" height="' + r2(bh) + '" rx="3" fill="' + rangeCol + '" fill-opacity="0.20" stroke="' + rangeCol + '" stroke-width="1"/>');
      if (benV[i] != null) {
        var bx = sx(benV[i]), dz = 7, lbl = fmtTick(benV[i]) + '%', lw = approxW(lbl, 10);
        s.push('<path d="M ' + r2(bx) + ' ' + r2(yC - dz) + ' L ' + r2(bx + dz) + ' ' + r2(yC) + ' L ' + r2(bx) + ' ' + r2(yC + dz) + ' L ' + r2(bx - dz) + ' ' + r2(yC) + ' Z" fill="' + markCol + '" stroke="#fff" stroke-width="1.5"/>');
        // SAA value beside the diamond (right by default, flip left if it would overflow)
        if (bx + dz + 4 + lw <= padL + pW + padR) s.push(txt(bx + dz + 4, yC + 4, lbl, markCol, 'start', 10, 700));
        else s.push(txt(bx - dz - 4, yC + 4, lbl, markCol, 'end', 10, 700));
      }
    }
    return wrap(W, H, s.join(''));
  }

  function perfSVG(d, t, W, H) {
    var xs = uniqueX(d.series);
    var lines, bars;
    if (d.type === 'perfstackmulti') { var n = (d.meta && d.meta.nCcy) || Math.ceil(d.series.length / 2); lines = d.series.slice(0, n); bars = d.series.slice(n); }
    else { var isL = function (s) { return /cum|index|rebas|nav|line/i.test(s.name || ''); }; var L = d.series.filter(isL)[0] || d.series[d.series.length - 1] || { points: [] }; lines = [L]; bars = d.series.filter(function (s) { return s !== L; }); }
    var s = [];
    var legendItems = lines.map(function (ss, i) { return { name: ss.name, color: ss.color || t.cat[i % t.cat.length] }; });
    s.push(legend(legendItems, 46, 6, t));
    var padL = 46, padR = 46, padT = 24, legendH = 18, gap = 10, bottomH = 40;
    var pW = Math.max(10, W - padL - padR);
    var topY = padT + legendH, availH = Math.max(20, H - topY - bottomH - gap);
    var topH = availH * 0.62, botH = availH * 0.38, botY = topY + topH + gap;
    var nc = xs.length, xc = function (i) { return padL + (nc <= 1 ? pW / 2 : (i / (nc - 1)) * pW); };
    // top: lines
    var lmat = lines.map(function (ss) { return along(ss, xs); });
    var lmax = -Infinity, lmin = Infinity;
    lmat.forEach(function (r) { r.forEach(function (v) { if (v != null) { if (v > lmax) lmax = v; if (v < lmin) lmin = v; } }); });
    if (!isFinite(lmax)) { lmax = 100; lmin = 100; } if (lmin === lmax) { lmin -= 1; lmax += 1; }
    var lp = (lmax - lmin) * 0.12 || 1, lo = lmin - lp, hi = lmax + lp;
    var syT = function (v) { return topY + topH - ((v - lo) / (hi - lo)) * topH; };
    ticks(lo, hi, 4).forEach(function (tk) { var y = syT(tk); s.push(ln(padL, y, padL + pW, y, t.grid)); s.push(txt(padL - 6, y + 4, fmtTick(tk), t.axis, 'end', 9.5)); });
    lines.forEach(function (ss, li) {
      var col = ss.color || t.cat[li % t.cat.length], vals = lmat[li], dp = '';
      vals.forEach(function (v, i) { if (v == null) return; dp += (dp ? 'L' : 'M') + r2(xc(i)) + ' ' + r2(syT(v)) + ' '; });
      if (dp) s.push('<path d="' + dp + '" fill="none" stroke="' + col + '" stroke-width="2.2" stroke-linejoin="round"/>');
    });
    // bottom: bars
    var bmat = bars.map(function (ss) { return along(ss, xs); });
    var bmax = 0, bmin = 0; bmat.forEach(function (r) { r.forEach(function (v) { if (v != null) { if (v > bmax) bmax = v; if (v < bmin) bmin = v; } }); });
    if (bmax === 0 && bmin === 0) bmax = 1;
    var bymax = niceCeil(bmax), bymin = bmin < 0 ? -niceCeil(-bmin) : 0; if (bymax === bymin) bymax = bymin + 1;
    var syB = function (v) { return botY + botH - ((v - bymin) / (bymax - bymin)) * botH; };
    ticks(bymin, bymax, 3).forEach(function (tk) { var y = syB(tk); s.push(ln(padL, y, padL + pW, y, t.grid)); s.push(txt(padL - 6, y + 4, fmtTick(tk), t.axis, 'end', 9.5)); });
    var band = pW / Math.max(1, nc), nb = bars.length;
    for (var i = 0; i < nc; i++) {
      var xL = padL + i * band;
      s.push(txt(xL + band / 2, botY + botH + 14, String(xs[i]), t.ink, 'middle', 9.5));
      var inner = band * 0.6, g = nb > 1 ? inner * 0.12 : 0, bw = (inner - g * (nb - 1)) / nb, x0 = xL + (band - inner) / 2;
      for (var j = 0; j < nb; j++) { var v = bmat[j][i]; if (v == null) continue; var col = bars[j].color || t.cat[j % t.cat.length], yv = syB(v), yz = syB(0); s.push(rect(x0 + j * (bw + g), Math.min(yv, yz), bw, Math.max(1, Math.abs(yv - yz)), col, 1));
        // value label above (or below, for negatives) each bar — shown when the bar is wide enough to be legible
        if (v !== 0 && bw >= 13) { var lyB = v >= 0 ? yv - 3 : yv + 9; s.push(txt(x0 + j * (bw + g) + bw / 2, lyB, fmtTick(v), t.ink, 'middle', 8, 600)); } }
    }
    return wrap(W, H, s.join(''));
  }

  function lineSVG(d, t, W, H) {
    var xs = uniqueX(d.series), s = [], multi = d.series.length > 1, legendH = multi ? 20 : 0;
    var padL = 46, padR = 20, padT = 10 + legendH, padB = 26;
    var pW = Math.max(10, W - padL - padR), pH = Math.max(10, H - padT - padB);
    var mat = d.series.map(function (ss) { return along(ss, xs); });
    var mx = -Infinity, mn = Infinity; mat.forEach(function (r) { r.forEach(function (v) { if (v != null) { if (v > mx) mx = v; if (v < mn) mn = v; } }); });
    if (!isFinite(mx)) { mx = 1; mn = 0; } if (mn === mx) { mn -= 1; mx += 1; }
    var pad = (mx - mn) * 0.1 || 1, lo = mn - pad, hi = mx + pad;
    var sy = function (v) { return padT + pH - ((v - lo) / (hi - lo)) * pH; };
    var nc = xs.length, xc = function (i) { return padL + (nc <= 1 ? pW / 2 : (i / (nc - 1)) * pW); };
    ticks(lo, hi, 4).forEach(function (tk) { var y = sy(tk); s.push(ln(padL, y, padL + pW, y, t.grid)); s.push(txt(padL - 6, y + 4, fmtTick(tk), t.axis, 'end', 10)); });
    for (var i = 0; i < nc; i += Math.ceil(nc / 8) || 1) s.push(txt(xc(i), padT + pH + 14, String(xs[i]), t.ink, 'middle', 10));
    d.series.forEach(function (ss, li) { var col = ss.color || t.cat[li % t.cat.length], vals = mat[li], dp = ''; vals.forEach(function (v, i) { if (v == null) return; dp += (dp ? 'L' : 'M') + r2(xc(i)) + ' ' + r2(sy(v)) + ' '; }); if (dp) s.push('<path d="' + dp + '" fill="none" stroke="' + col + '" stroke-width="2.4" stroke-linejoin="round"/>'); });
    if (multi) s.push(legend(d.series.map(function (ss, i) { return { name: ss.name, color: ss.color || t.cat[i % t.cat.length] }; }), 6, 4, t));
    return wrap(W, H, s.join(''));
  }

  /* ---------- overrides ---------- */
  function key(id) { return 'lfa-chart:' + id; }
  function loadOverride(id) { try { var s = localStorage.getItem(key(id)); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
  function saveOverride(id, spec) { try { localStorage.setItem(key(id), JSON.stringify(spec)); } catch (e) {} }
  function clearOverride(id) { try { localStorage.removeItem(key(id)); } catch (e) {} }

  /* ---------- <lfa-chart> element ---------- */
  function defineEl() {
    if (customElements.get('lfa-chart')) return;
    class El extends HTMLElement {
      static get observedAttributes() { return ['chart-id', 'theme', 'spec']; }
      connectedCallback() {
        this.style.display = 'block'; this.style.position = 'relative'; if (!this.style.width) this.style.width = '100%';
        this._mount = document.createElement('div'); this._mount.style.cssText = 'position:absolute;inset:0;overflow:hidden;';
        this.appendChild(this._mount);
        var self = this;
        // hover toolbar: Colours (quick palette) + Edit (full editor)
        this._bar = document.createElement('div');
        this._bar.style.cssText = 'position:absolute;top:8px;right:8px;z-index:5;display:none;gap:6px;';
        function mkBtn(label, svg) { var b = document.createElement('button'); b.type = 'button';
          b.innerHTML = svg + '<span style="margin-left:5px">' + label + '</span>';
          b.style.cssText = 'display:inline-flex;align-items:center;border:1px solid rgba(74,12,24,.18);background:rgba(255,255,255,.94);color:#83021A;font:600 10.5px/1 ' + THEMES.lfa.font + ';letter-spacing:.05em;text-transform:uppercase;padding:6px 10px;border-radius:6px;cursor:pointer;box-shadow:0 2px 8px rgba(26,42,85,.14);';
          return b; }
        this._colBtn = mkBtn('Colours', '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="6.5" cy="12" r="2.5"/><circle cx="17" cy="13" r="2.5"/><path d="M12 2a10 10 0 1 0 0 20 2 2 0 0 0 0-4 2 2 0 0 1 2-2h2a4 4 0 0 0 4-4 10 10 0 0 0-10-10Z"/></svg>');
        this._btn = mkBtn('Edit', '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>');
        this._colBtn.addEventListener('click', function (e) { e.stopPropagation(); self.openColours(); });
        this._btn.addEventListener('click', function (e) { e.stopPropagation(); if (self._cpop) { self._cpop.remove(); self._cpop = null; } self.openEditor(); });
        this._bar.appendChild(this._colBtn); this._bar.appendChild(this._btn);
        this.appendChild(this._bar);
        this.addEventListener('mouseenter', function () { if (window.LFA_CHART_EDIT !== false) self._bar.style.display = 'flex'; });
        this.addEventListener('mouseleave', function () { self._bar.style.display = 'none'; });
        this._ro = new ResizeObserver(function () { self.render(); }); this._ro.observe(this);
        requestAnimationFrame(function () { self.render(); });
      }
      disconnectedCallback() { if (this._ro) this._ro.disconnect(); }
      attributeChangedCallback() { if (this.isConnected) this.render(); }
      themeName() { return this.getAttribute('theme') || 'lfa'; }
      currentSpec() {
        var id = this.getAttribute('chart-id') || '';
        var ov = id ? loadOverride(id) : null; if (ov) return ov;
        if (this._inlineSpec) return this._inlineSpec;
        var attr = this.getAttribute('spec'); if (attr) { try { this._inlineSpec = JSON.parse(attr); return this._inlineSpec; } catch (e) {} }
        if (id && window.LFA_CHART_SPECS[id]) return window.LFA_CHART_SPECS[id];
        return { type: 'barh', meta: {}, series: [{ name: 'Series', points: [{ x: 'A', y: 1 }, { x: 'B', y: 2 }, { x: 'C', y: 3 }] }] };
      }
      render() {
        if (!this._mount || !this.isConnected) return;
        var W = this.clientWidth || this._mount.clientWidth, H = this.clientHeight || this._mount.clientHeight;
        if (!W || !H) return;
        try { this._mount.innerHTML = buildSVG(this.currentSpec(), THEMES[this.themeName()] || THEMES.lfa, W, H); }
        catch (e) { console.warn('lfa-chart render', e); }
      }
      openEditor() {
        var self = this, id = this.getAttribute('chart-id') || '';
        openEditor(this.currentSpec(), this.themeName(), {
          hasOverride: !!(id && loadOverride(id)),
          onApply: function (spec) { if (id) saveOverride(id, spec); else self._inlineSpec = spec; self.render(); self.dispatchEvent(new CustomEvent('chart-change', { bubbles: true, detail: { id: id, spec: spec } })); },
          onReset: function () { if (id) clearOverride(id); self._inlineSpec = null; self.render(); }
        });
      }
      openColours() {
        var self = this, id = this.getAttribute('chart-id') || '';
        if (this._cpop) { this._cpop.remove(); this._cpop = null; return; }
        var t = THEMES[this.themeName()] || THEMES.lfa;
        var spec = normalize(JSON.parse(JSON.stringify(this.currentSpec())));
        var colors = spec.series.map(function (s, i) { return s.color || t.cat[i % t.cat.length]; });
        var pop = document.createElement('div');
        pop.style.cssText = 'position:absolute;top:40px;right:8px;z-index:6;background:#fff;border:1px solid rgba(74,12,24,.18);border-radius:9px;box-shadow:0 10px 30px rgba(26,42,85,.22);padding:11px 13px;width:212px;font:600 11px/1.3 ' + t.font + ';color:' + t.ink + ';';
        pop.addEventListener('click', function (e) { e.stopPropagation(); });
        pop.innerHTML = '<div style="font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#999;margin-bottom:9px;">Colours</div>';
        function apply() { var out = { type: spec.type, meta: spec.meta, series: spec.series.map(function (s, i) { return { name: s.name, color: colors[i], points: s.points }; }) }; if (id) saveOverride(id, out); else self._inlineSpec = out; self.render(); }
        spec.series.forEach(function (s, i) {
          var row = document.createElement('div'); row.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:7px;';
          var c = document.createElement('input'); c.type = 'color'; c.style.cssText = 'width:24px;height:24px;border:1px solid #ddd;border-radius:6px;padding:0;cursor:pointer;flex:none;';
          try { c.value = toHex(colors[i]); } catch (e) {}
          var lab = document.createElement('span'); lab.textContent = s.name || ('Series ' + (i + 1)); lab.style.cssText = 'flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
          c.addEventListener('input', function () { colors[i] = c.value; apply(); });
          row.appendChild(c); row.appendChild(lab); pop.appendChild(row);
        });
        var reset = document.createElement('button'); reset.textContent = 'Reset colours';
        reset.style.cssText = 'margin-top:4px;width:100%;border:1px solid #ddd;background:#fff;border-radius:6px;padding:6px;font:700 10.5px/1 ' + t.font + ';color:#54618C;cursor:pointer;';
        reset.addEventListener('click', function () { if (id) clearOverride(id); self._inlineSpec = null; self.render(); pop.remove(); self._cpop = null; });
        pop.appendChild(reset);
        this.appendChild(pop); this._cpop = pop;
      }
    }
    customElements.define('lfa-chart', El);
    window.LFAChart = { redrawAll: function () { document.querySelectorAll('lfa-chart').forEach(function (el) { el.render && el.render(); }); }, THEMES: THEMES, buildSVG: buildSVG };
  }

  /* ---------- lightweight editor (no echarts; previews with the same SVG) ---------- */
  function elx(tag, css, html) { var e = document.createElement(tag); if (css) e.style.cssText = css; if (html != null) e.innerHTML = html; return e; }
  function openEditor(spec, themeName, opts) {
    opts = opts || {};
    var t = THEMES[themeName] || THEMES.lfa;
    var work = normalize(JSON.parse(JSON.stringify(spec)));
    var TYPES = [['barh', 'Horizontal bars'], ['groupbar', 'Grouped bars'], ['rangebar', 'Range + marker'], ['perfstackmulti', 'Performance (lines+bars)'], ['perfstack', 'Performance (single)'], ['line', 'Line']];
    var xs = uniqueX(work.series);
    var names = work.series.map(function (s) { return s.name; });
    var colors = work.series.map(function (s, i) { return s.color || t.cat[i % t.cat.length]; });
    var vals = work.series.map(function (s) { return along(s, xs); });

    var ov = elx('div', 'position:fixed;inset:0;z-index:99999;background:rgba(20,12,14,.5);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(3px);font-family:' + t.font + ';');
    var panel = elx('div', 'width:min(940px,95vw);height:min(640px,92vh);background:#fff;border-radius:12px;display:grid;grid-template-rows:auto 1fr auto;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.4);');
    ov.appendChild(panel);
    var head = elx('div', 'display:flex;align-items:center;gap:14px;padding:13px 18px;border-bottom:1px solid #eee;');
    head.appendChild(elx('div', 'font-weight:800;letter-spacing:.04em;color:' + t.ink + ';', 'Chart editor'));
    var typeSel = elx('select', 'border:1px solid #ddd;border-radius:7px;padding:6px 9px;font:inherit;color:' + t.ink + ';');
    TYPES.forEach(function (tp) { var o = document.createElement('option'); o.value = tp[0]; o.textContent = tp[1]; typeSel.appendChild(o); });
    typeSel.value = work.type; head.appendChild(typeSel);
    head.appendChild(elx('div', 'flex:1;'));
    panel.appendChild(head);

    var body = elx('div', 'display:grid;grid-template-columns:1fr 1fr;overflow:hidden;');
    var left = elx('div', 'overflow:auto;padding:16px;border-right:1px solid #eee;');
    var right = elx('div', 'display:flex;flex-direction:column;background:#faf8f5;');
    body.appendChild(left); body.appendChild(right);
    panel.appendChild(body);
    var pvCard = elx('div', 'flex:1;margin:16px;background:#fff;border:1px solid #eee;border-radius:8px;position:relative;overflow:hidden;');
    var pvMount = elx('div', 'position:absolute;inset:12px;');
    pvCard.appendChild(pvMount); right.appendChild(pvCard);

    // series header (name + colour)
    left.appendChild(elx('div', 'font-size:10.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#999;margin-bottom:8px;', 'Series & colours'));
    var sHost = elx('div', 'display:flex;flex-direction:column;gap:7px;margin-bottom:16px;');
    left.appendChild(sHost);
    left.appendChild(elx('div', 'font-size:10.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#999;margin-bottom:8px;', 'Values'));
    var tHost = elx('div', 'border:1px solid #eee;border-radius:8px;overflow:auto;max-height:260px;');
    left.appendChild(tHost);

    function num(v) { var n = parseFloat(String(v).replace(',', '.')); return isNaN(n) ? null : n; }
    function draw() {
      var W = pvCard.clientWidth - 24, H = pvCard.clientHeight - 24;
      pvMount.innerHTML = buildSVG(toSpec(), t, Math.max(40, W), Math.max(40, H));
    }
    function toSpec() {
      return { type: typeSel.value, meta: work.meta, series: names.map(function (nm, si) { return { name: nm, color: colors[si], points: xs.map(function (x, xi) { return { x: x, y: vals[si][xi] }; }) }; }) };
    }
    function rebuildSeries() {
      sHost.innerHTML = '';
      names.forEach(function (nm, si) {
        var row = elx('div', 'display:flex;align-items:center;gap:8px;');
        var c = elx('input', 'width:26px;height:26px;border:1px solid #ddd;border-radius:6px;padding:0;cursor:pointer;flex:none;'); c.type = 'color'; try { c.value = /^#[0-9a-f]{6}$/i.test(colors[si]) ? colors[si] : '#83021A'; } catch (e) {}
        c.addEventListener('input', function () { colors[si] = c.value; draw(); });
        var n = elx('input', 'flex:1;border:1px solid #ddd;border-radius:6px;padding:6px 9px;font:inherit;'); n.value = nm;
        n.addEventListener('input', function () { names[si] = n.value; draw(); });
        row.appendChild(c); row.appendChild(n); sHost.appendChild(row);
      });
    }
    function rebuildTable() {
      tHost.innerHTML = '';
      var tbl = elx('table', 'border-collapse:collapse;width:100%;font-size:12px;');
      var thr = elx('tr'); thr.appendChild(elx('th', 'padding:6px 8px;border:1px solid #eee;background:#faf8f5;text-align:left;font-size:10px;text-transform:uppercase;color:#999;', 'X'));
      names.forEach(function (nm) { thr.appendChild(elx('th', 'padding:6px 8px;border:1px solid #eee;background:#faf8f5;text-align:right;font-size:10px;text-transform:uppercase;color:#999;', esc(nm))); });
      tbl.appendChild(thr);
      xs.forEach(function (x, xi) {
        var tr = elx('tr');
        var xc = elx('td', 'border:1px solid #eee;'); var xin = elx('input', 'width:100%;border:0;padding:6px 8px;font:600 12px/1 ' + t.font + ';'); xin.value = x;
        xin.addEventListener('input', function () { xs[xi] = xin.value; draw(); }); xc.appendChild(xin); tr.appendChild(xc);
        names.forEach(function (nm, si) {
          var td = elx('td', 'border:1px solid #eee;'); var inp = elx('input', 'width:100%;border:0;padding:6px 8px;text-align:right;font:400 12px/1 ui-monospace,monospace;'); inp.value = vals[si][xi] == null ? '' : vals[si][xi];
          inp.addEventListener('input', function () { vals[si][xi] = num(inp.value); draw(); }); td.appendChild(inp); tr.appendChild(td);
        });
        tbl.appendChild(tr);
      });
      tHost.appendChild(tbl);
    }

    var foot = elx('div', 'display:flex;align-items:center;gap:10px;padding:12px 18px;border-top:1px solid #eee;');
    var resetB = elx('button', btn('ghost', t), 'Reset to data'); if (!opts.hasOverride) resetB.style.opacity = '.45';
    foot.appendChild(resetB); foot.appendChild(elx('div', 'flex:1;'));
    var cancelB = elx('button', btn('ghost', t), 'Cancel'); var applyB = elx('button', btn('primary', t), 'Apply');
    foot.appendChild(cancelB); foot.appendChild(applyB); panel.appendChild(foot);

    document.body.appendChild(ov);
    typeSel.addEventListener('change', function () { draw(); });
    function close() { ov.remove(); }
    cancelB.addEventListener('click', close);
    ov.addEventListener('mousedown', function (e) { if (e.target === ov) close(); });
    document.addEventListener('keydown', function k(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', k); } });
    resetB.addEventListener('click', function () { if (!opts.hasOverride) return; if (opts.onReset) opts.onReset(); close(); });
    applyB.addEventListener('click', function () { if (opts.onApply) opts.onApply(toSpec()); close(); });
    rebuildSeries(); rebuildTable();
    new ResizeObserver(function () { draw(); }).observe(pvCard);
    requestAnimationFrame(draw);
  }
  function btn(kind, t) {
    var base = 'border-radius:7px;padding:8px 15px;font:700 12px/1 ' + t.font + ';cursor:pointer;border:1px solid #ddd;';
    if (kind === 'primary') return base + 'background:' + t.cat[0] + ';border-color:' + t.cat[0] + ';color:#fff;';
    return base + 'background:#fff;color:' + t.ink + ';';
  }
  window.LFAChartStudio = { openEditor: function (spec, opts) { openEditor(spec, (opts && opts.theme) || 'lfa', opts || {}); } };

  /* ---------- boot ---------- */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', defineEl);
  else defineEl();
})();
