/* ============================================================================
   LFA Chart Studio — <lfa-chart> element + edit popup
   Depends on: window.echarts (host loads it) and lfa-chart-engine.js.

   Usage in a slide:
     <lfa-chart chart-id="ip-perf-low" theme="lfa"></lfa-chart>
   Default spec is read from window.LFA_CHART_SPECS["ip-perf-low"].
   User edits are persisted to localStorage ("lfa-chart:<chart-id>") and
   re-applied on reload. Hover shows an "Edit" pencil → opens the builder popup.
   Set window.LFA_CHART_EDIT = false to hide the pencil (e.g. final export).
   ============================================================================ */
(function () {
  'use strict';
  var E = function () { return window.LFAChartEngine; };
  window.LFA_CHART_SPECS = window.LFA_CHART_SPECS || {};

  function ready(cb) {
    var tries = 0;
    (function tick() { if (window.echarts && window.LFAChartEngine) return cb(); if (tries++ < 120) setTimeout(tick, 80); })();
  }
  function specKey(id) { return 'lfa-chart:' + id; }
  function loadOverride(id) { try { var s = localStorage.getItem(specKey(id)); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
  function saveOverride(id, spec) { try { localStorage.setItem(specKey(id), JSON.stringify(spec)); } catch (e) {} }
  function clearOverride(id) { try { localStorage.removeItem(specKey(id)); } catch (e) {} }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* ---------------- <lfa-chart> ---------------- */
  function defineElementClass() {
    if (customElements.get('lfa-chart')) return;
    class LFAChartEl extends HTMLElement {
      connectedCallback() {
        var self = this;
        this.style.display = 'block'; this.style.position = 'relative';
        if (!this.style.width) this.style.width = '100%';
        this._mount = document.createElement('div'); this._mount.style.cssText = 'position:absolute;inset:0;';
        this.appendChild(this._mount);
        this._btn = document.createElement('button'); this._btn.type = 'button'; this._btn.setAttribute('aria-label', 'Edit chart');
        this._btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg><span style="margin-left:5px">Edit</span>';
        this._btn.style.cssText = 'position:absolute;top:8px;right:8px;z-index:5;display:none;align-items:center;border:1px solid rgba(35,54,110,.18);background:rgba(255,255,255,.94);color:#23366E;font:600 10.5px/1 Mulish,system-ui,sans-serif;letter-spacing:.05em;text-transform:uppercase;padding:6px 10px;border-radius:6px;cursor:pointer;box-shadow:0 2px 8px rgba(26,42,85,.14);';
        this._btn.addEventListener('click', function (e) { e.stopPropagation(); self.openEditor(); });
        this.appendChild(this._btn);
        this.addEventListener('mouseenter', function () { if (window.LFA_CHART_EDIT !== false) self._btn.style.display = 'inline-flex'; });
        this.addEventListener('mouseleave', function () { self._btn.style.display = 'none'; });
        ready(function () {
          if (!self.isConnected) return;
          self._chart = window.echarts.init(self._mount, null, { renderer: 'svg' });
          self.render();
          self._ro = new ResizeObserver(function () { if (self._chart) self._chart.resize(); });
          self._ro.observe(self._mount);
        });
      }
      disconnectedCallback() { if (this._ro) this._ro.disconnect(); if (this._chart) { this._chart.dispose(); this._chart = null; } }
      currentSpec() {
        var id = this.getAttribute('chart-id') || '';
        var ov = id ? loadOverride(id) : null; if (ov) return ov;
        if (this._inlineSpec) return this._inlineSpec;
        var attr = this.getAttribute('spec'); if (attr) { try { this._inlineSpec = JSON.parse(attr); return this._inlineSpec; } catch (e) {} }
        if (id && window.LFA_CHART_SPECS[id]) return window.LFA_CHART_SPECS[id];
        return { type: 'line', meta: { title: 'Chart' }, series: [{ name: 'Series 1', points: [{ x: 'A', y: 1 }, { x: 'B', y: 2 }, { x: 'C', y: 3 }] }] };
      }
      themeName() { return this.getAttribute('theme') || 'lfa'; }
      render() { if (!this._chart) return; try { this._chart.setOption(E().buildOption(this.currentSpec(), this.themeName()), true); this._chart.resize(); } catch (e) { console.warn('lfa-chart render', e); } }
      openEditor() {
        var self = this, id = this.getAttribute('chart-id') || '';
        window.LFAChartStudio.openEditor(this.currentSpec(), {
          theme: this.themeName(),
          hasOverride: !!(id && loadOverride(id)),
          onApply: function (spec) { if (id) saveOverride(id, spec); else self._inlineSpec = spec; self.render(); self.dispatchEvent(new CustomEvent('chart-change', { bubbles: true, detail: { id: id, spec: spec } })); },
          onReset: function () { if (id) clearOverride(id); self._inlineSpec = null; self.render(); }
        });
      }
    }
    customElements.define('lfa-chart', LFAChartEl);
    window.LFAChart = { redrawAll: function () { document.querySelectorAll('lfa-chart').forEach(function (el) { el.render && el.render(); }); } };
  }

  /* ---------------- EDIT POPUP ---------------- */
  var UI = { bg: '#0f1419', panel: '#171d26', panel2: '#1e2630', border: '#2a3340', text: '#e4e7eb', dim: '#9aa5b1', accent: '#2b5d8c', danger: '#a14b4b' };
  function el(tag, css, html) { var e = document.createElement(tag); if (css) e.style.cssText = css; if (html != null) e.innerHTML = html; return e; }

  function openEditor(spec, opts) {
    opts = opts || {};
    var eng = E();
    var working = eng.normalize(clone(spec));
    var themeName = opts.theme || 'lfa';

    // overlay
    var overlay = el('div', 'position:fixed;inset:0;z-index:99999;background:rgba(10,14,20,.62);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(3px);font-family:Inter,system-ui,-apple-system,sans-serif;');
    var modal = el('div', 'width:min(1180px,95vw);height:min(760px,92vh);background:' + UI.bg + ';color:' + UI.text + ';border:1px solid ' + UI.border + ';border-radius:12px;display:grid;grid-template-rows:auto 1fr auto;overflow:hidden;box-shadow:0 30px 90px rgba(0,0,0,.5);font-size:13px;');
    overlay.appendChild(modal);

    // header
    var header = el('div', 'display:flex;align-items:center;gap:14px;padding:14px 18px;background:' + UI.panel + ';border-bottom:1px solid ' + UI.border + ';');
    header.appendChild(el('div', 'font-weight:700;font-size:15px;letter-spacing:.3px;', 'Chart <span style="color:' + UI.accent + '">Studio</span>'));
    var typeWrap = el('div', 'display:flex;align-items:center;gap:7px;');
    typeWrap.appendChild(el('label', 'color:' + UI.dim + ';font-size:11px;text-transform:uppercase;letter-spacing:.5px;', 'Type'));
    var typeSel = el('select', selCss() + 'width:210px;');
    eng.CHART_CATALOG.forEach(function (g) { var og = document.createElement('optgroup'); og.label = g.group; g.items.forEach(function (it) { var o = document.createElement('option'); o.value = it.id; o.textContent = it.name; og.appendChild(o); }); typeSel.appendChild(og); });
    typeSel.value = working.type;
    typeWrap.appendChild(typeSel);
    header.appendChild(typeWrap);
    header.appendChild(el('div', 'flex:1;'));
    var closeX = el('button', btnCss('ghost'), 'Close');
    header.appendChild(closeX);
    modal.appendChild(header);

    // body: left meta+data, right preview
    var body = el('div', 'display:grid;grid-template-columns:380px 1fr;overflow:hidden;');
    var left = el('div', 'overflow-y:auto;padding:16px;border-right:1px solid ' + UI.border + ';background:' + UI.panel + ';');
    var right = el('div', 'display:flex;flex-direction:column;background:' + UI.bg + ';overflow:hidden;');
    body.appendChild(left); body.appendChild(right);
    modal.appendChild(body);

    // --- meta fields ---
    function field(label, key, ph) {
      var w = el('div', 'margin-bottom:10px;');
      w.appendChild(el('label', 'display:block;margin-bottom:4px;color:' + UI.dim + ';font-size:11px;text-transform:uppercase;letter-spacing:.4px;', label));
      var inp = el('input', inpCss()); inp.type = 'text'; inp.value = working.meta[key] || ''; if (ph) inp.placeholder = ph;
      inp.addEventListener('input', function () { working.meta[key] = inp.value; schedule(); });
      w.appendChild(inp); return w;
    }
    left.appendChild(sectionLabel('Titles & labels'));
    left.appendChild(field('Title', 'title'));
    left.appendChild(field('Subtitle', 'subtitle'));
    var row2 = el('div', 'display:grid;grid-template-columns:1fr 1fr;gap:8px;');
    row2.appendChild(field('X label', 'xLabel')); row2.appendChild(field('Y label', 'yLabel'));
    left.appendChild(row2);
    var y2f = field('Secondary Y (combo)', 'y2Label'); left.appendChild(y2f);

    // --- data editor ---
    left.appendChild(sectionLabel('Data'));
    var dataHint = el('div', 'color:' + UI.dim + ';font-size:11px;line-height:1.5;margin-bottom:8px;', 'First column = X (category). Each further column = a series. Edit cells, rename series in the header row, add/remove rows & series.');
    left.appendChild(dataHint);

    var tableHost = el('div', 'border:1px solid ' + UI.border + ';border-radius:8px;overflow:auto;max-height:220px;background:' + UI.panel2 + ';');
    left.appendChild(tableHost);

    var tblBtns = el('div', 'display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;');
    var addRow = el('button', btnCss('sm'), '+ Row');
    var addSeries = el('button', btnCss('sm'), '+ Series');
    tblBtns.appendChild(addRow); tblBtns.appendChild(addSeries);
    left.appendChild(tblBtns);

    // paste box
    left.appendChild(sectionLabel('Paste data (TSV / CSV)'));
    var pasteHint = el('div', 'color:' + UI.dim + ';font-size:11px;line-height:1.5;margin-bottom:6px;', 'Paste from Excel/Sheets. First row = header (X, Series…). Then click Load.');
    left.appendChild(pasteHint);
    var pasteTa = el('textarea', inpCss() + 'height:74px;resize:vertical;font-family:' + 'ui-monospace,monospace;font-size:12px;');
    left.appendChild(pasteTa);
    var loadPaste = el('button', btnCss('sm') + 'margin-top:6px;', 'Load pasted data');
    left.appendChild(loadPaste);

    // hierarchical / json escape hatch
    left.appendChild(sectionLabel('Advanced (JSON spec)'));
    var jsonTa = el('textarea', inpCss() + 'height:90px;resize:vertical;font-family:ui-monospace,monospace;font-size:11.5px;');
    left.appendChild(jsonTa);
    var loadJson = el('button', btnCss('sm') + 'margin-top:6px;', 'Apply JSON');
    left.appendChild(loadJson);

    // --- preview ---
    var pvHead = el('div', 'padding:10px 16px;border-bottom:1px solid ' + UI.border + ';color:' + UI.dim + ';font-size:11px;text-transform:uppercase;letter-spacing:.5px;', 'Live preview · theme: ' + (eng.THEMES[themeName] ? eng.THEMES[themeName].name : themeName));
    right.appendChild(pvHead);
    var pvCard = el('div', 'flex:1;margin:16px;background:#fff;border-radius:8px;overflow:hidden;position:relative;min-height:0;');
    var pvMount = el('div', 'position:absolute;inset:10px;');
    pvCard.appendChild(pvMount); right.appendChild(pvCard);
    var pv = null;

    // footer
    var footer = el('div', 'display:flex;align-items:center;gap:10px;padding:12px 18px;background:' + UI.panel + ';border-top:1px solid ' + UI.border + ';');
    var resetBtn = el('button', btnCss('ghost'), 'Reset to default');
    if (!opts.hasOverride) resetBtn.style.opacity = '.45';
    footer.appendChild(resetBtn);
    var exportBtn = el('button', btnCss('ghost'), 'Export spec');
    exportBtn.title = 'Copy this chart\u2019s JSON spec to the clipboard, to paste back into the template as the new default.';
    var pngBtn = el('button', btnCss('ghost'), 'PNG');
    pngBtn.title = 'Download this chart as a PNG image.';
    footer.appendChild(exportBtn); footer.appendChild(pngBtn);
    footer.appendChild(el('div', 'flex:1;'));
    var cancelBtn = el('button', btnCss('ghost'), 'Cancel');
    var applyBtn = el('button', btnCss('primary'), 'Apply');
    footer.appendChild(cancelBtn); footer.appendChild(applyBtn);
    modal.appendChild(footer);

    document.body.appendChild(overlay);

    /* ---- behaviour ---- */
    var tableState = eng.specToTable(working); // {headers, rows}

    function rebuildTable() {
      tableHost.innerHTML = '';
      var tbl = el('table', 'border-collapse:collapse;width:100%;font-size:12px;');
      var thead = el('thead'); var htr = el('tr');
      tableState.headers.forEach(function (h, ci) {
        var th = el('th', 'padding:0;border:1px solid ' + UI.border + ';background:' + UI.panel + ';position:sticky;top:0;');
        if (ci === 0) { th.appendChild(el('div', 'padding:6px 8px;color:' + UI.dim + ';font-size:10px;text-transform:uppercase;letter-spacing:.5px;', 'X')); }
        else {
          var wrap = el('div', 'display:flex;align-items:center;');
          var sidx = ci - 1;
          var pal = (eng.THEMES[themeName] && eng.THEMES[themeName].palette.categorical) || ['#23366E'];
          var curCol = (working.series[sidx] && working.series[sidx].color) || pal[sidx % pal.length];
          var sw = el('input', 'width:20px;height:20px;min-width:20px;border:0;background:transparent;padding:0;margin-left:5px;cursor:pointer;flex:none;'); sw.type = 'color'; sw.title = 'Series colour';
          try { sw.value = /^#[0-9a-f]{6}$/i.test(curCol) ? curCol : '#23366E'; } catch (e) {}
          sw.addEventListener('input', function () { if (!working.series[sidx]) working.series[sidx] = { name: tableState.headers[ci], points: [] }; working.series[sidx].color = sw.value; schedule(); });
          wrap.appendChild(sw);
          var hi = el('input', 'width:100%;background:transparent;border:0;color:' + UI.text + ';padding:6px 8px;font:600 12px/1 Inter,sans-serif;'); hi.value = h;
          hi.addEventListener('input', function () { tableState.headers[ci] = hi.value; schedule(); });
          wrap.appendChild(hi);
          var del = el('button', 'border:0;background:transparent;color:' + UI.danger + ';cursor:pointer;padding:0 7px;font-size:14px;', '×'); del.title = 'Remove series';
          del.addEventListener('click', function () { if (tableState.headers.length <= 2) return; tableState.headers.splice(ci, 1); tableState.rows.forEach(function (r) { r.splice(ci, 1); }); if (working.series) working.series.splice(sidx, 1); rebuildTable(); schedule(); });
          wrap.appendChild(del); th.appendChild(wrap);
        }
        htr.appendChild(th);
      });
      thead.appendChild(htr); tbl.appendChild(thead);
      var tbody = el('tbody');
      tableState.rows.forEach(function (row, ri) {
        var tr = el('tr');
        tableState.headers.forEach(function (_, ci) {
          var td = el('td', 'padding:0;border:1px solid ' + UI.border + ';');
          var ci2 = ci;
          var inp = el('input', 'width:100%;min-width:54px;background:transparent;border:0;color:' + UI.text + ';padding:6px 8px;font:400 12px/1 ' + (ci === 0 ? 'Inter' : 'ui-monospace') + ',monospace;'); inp.value = row[ci] == null ? '' : row[ci];
          inp.addEventListener('input', function () { tableState.rows[ri][ci2] = inp.value; schedule(); });
          td.appendChild(inp); tr.appendChild(td);
        });
        var tdDel = el('td', 'border:1px solid ' + UI.border + ';');
        var del = el('button', 'border:0;background:transparent;color:' + UI.danger + ';cursor:pointer;padding:4px 8px;font-size:14px;', '×'); del.title = 'Remove row';
        del.addEventListener('click', function () { tableState.rows.splice(ri, 1); rebuildTable(); schedule(); });
        tdDel.appendChild(del); tr.appendChild(tdDel);
        tbody.appendChild(tr);
      });
      tbl.appendChild(tbody); tableHost.appendChild(tbl);
    }

    function syncFromTable() {
      working = eng.tableToSpec({ type: typeSel.value, meta: working.meta, series: working.series }, tableState.headers, tableState.rows);
      working.type = typeSel.value;
    }

    var schedTimer = null;
    function schedule() { clearTimeout(schedTimer); schedTimer = setTimeout(drawPreview, 120); }
    function drawPreview() {
      syncFromTable();
      jsonTa.value = JSON.stringify({ type: working.type, meta: working.meta, series: working.series }, null, 1);
      if (!pv) { ready(function () { pv = window.echarts.init(pvMount, null, { renderer: 'svg' }); applyOpt(); }); }
      else applyOpt();
      function applyOpt() { try { pv.setOption(eng.buildOption(working, themeName), true); pv.resize(); } catch (e) { console.warn(e); } }
    }

    typeSel.addEventListener('change', function () { working.type = typeSel.value; schedule(); });
    addRow.addEventListener('click', function () { var r = ['']; for (var i = 1; i < tableState.headers.length; i++) r.push(''); tableState.rows.push(r); rebuildTable(); schedule(); });
    addSeries.addEventListener('click', function () { tableState.headers.push('Series ' + tableState.headers.length); tableState.rows.forEach(function (r) { r.push(''); }); rebuildTable(); schedule(); });
    loadPaste.addEventListener('click', function () { if (!pasteTa.value.trim()) return; var p = eng.parseTSV(pasteTa.value); tableState = { headers: p.headers, rows: p.rows }; rebuildTable(); schedule(); });
    loadJson.addEventListener('click', function () { try { var o = JSON.parse(jsonTa.value); working = eng.normalize(o); typeSel.value = working.type; tableState = eng.specToTable(working); rebuildTable(); drawPreview(); } catch (e) { alert('Invalid JSON: ' + e.message); } });

    function close() { try { if (pv) pv.dispose(); } catch (e) {} overlay.remove(); }
    closeX.addEventListener('click', close);
    cancelBtn.addEventListener('click', close);
    overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); } });
    resetBtn.addEventListener('click', function () { if (!opts.hasOverride) return; if (opts.onReset) opts.onReset(); close(); });
    exportBtn.addEventListener('click', function () {
      syncFromTable();
      var json = JSON.stringify({ type: working.type, meta: working.meta, series: working.series }, null, 2);
      var done = function () { var old = exportBtn.textContent; exportBtn.textContent = 'Copied \u2713'; setTimeout(function () { exportBtn.textContent = old; }, 1400); };
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(json).then(done, function () { jsonTa.value = json; jsonTa.focus(); jsonTa.select(); done(); }); }
      else { jsonTa.value = json; jsonTa.focus(); jsonTa.select(); try { document.execCommand('copy'); } catch (e) {} done(); }
    });
    pngBtn.addEventListener('click', function () {
      if (!pv) return;
      try {
        var url = pv.getDataURL({ type: 'png', pixelRatio: 2.5, backgroundColor: '#fff' });
        var a = document.createElement('a');
        var name = (working.meta.title || 'chart').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'chart';
        a.href = url; a.download = 'lfa-' + name + '.png'; document.body.appendChild(a); a.click(); a.remove();
      } catch (e) { console.warn('png export', e); }
    });
    applyBtn.addEventListener('click', function () { syncFromTable(); if (opts.onApply) opts.onApply(clone(working)); close(); });

    rebuildTable();
    var ro = new ResizeObserver(function () { if (pv) pv.resize(); }); ro.observe(pvCard);
    drawPreview();
  }

  /* ---- small style helpers ---- */
  function selCss() { return 'background:' + UI.panel2 + ';border:1px solid ' + UI.border + ';color:' + UI.text + ';border-radius:6px;padding:6px 8px;font:inherit;'; }
  function inpCss() { return 'width:100%;background:' + UI.panel2 + ';border:1px solid ' + UI.border + ';color:' + UI.text + ';border-radius:6px;padding:7px 9px;font:inherit;box-sizing:border-box;'; }
  function btnCss(kind) {
    var base = 'border-radius:7px;padding:8px 14px;font:600 12px/1 Inter,system-ui,sans-serif;cursor:pointer;border:1px solid ' + UI.border + ';';
    if (kind === 'primary') return base + 'background:' + UI.accent + ';border-color:' + UI.accent + ';color:#fff;';
    if (kind === 'ghost') return base + 'background:transparent;color:' + UI.text + ';';
    if (kind === 'sm') return 'border-radius:6px;padding:6px 10px;font:600 11px/1 Inter,sans-serif;cursor:pointer;border:1px solid ' + UI.border + ';background:' + UI.panel2 + ';color:' + UI.text + ';';
    return base;
  }
  function sectionLabel(txt) { return el('div', 'margin:16px 0 8px;color:#cfd6de;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.7px;border-top:1px solid ' + UI.border + ';padding-top:12px;', txt); }

  window.LFAChartStudio = { openEditor: openEditor };

  /* ---------------- boot ---------------- */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', defineElementClass);
  else defineElementClass();
})();
