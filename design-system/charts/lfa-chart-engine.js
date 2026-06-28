/* ============================================================================
   LFA Chart Engine — DATA + THEME + RENDER layers
   Lifted from Chart Studio (single source of truth for chart specs & themes).
   Exposes window.LFAChartEngine. No DOM, no deps except window.echarts at draw.

   Spec schema (the one editable shape everything speaks):
     { type, series:[{ name, color, points:[{x,y}|{name,value,children}] }],
       meta:{ title, subtitle, xLabel, yLabel, y2Label, source } }
   ============================================================================ */
(function () {
  'use strict';

  /* ---------------- THEME LAYER ---------------- */
  var THEME_LFA = {
    id: 'lfa', name: 'LFA',
    fonts: {
      display: "'Cormorant Garamond', 'Hoefler Text', Georgia, serif",
      body: "'Mulish', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      mono: "'IBM Plex Mono', ui-monospace, monospace"
    },
    palette: {
      ink: '#23366E', background: '#FFFFFF', grid: '#E0E4EB', axis: '#8C95B2',
      categorical: ['#23366E', '#C24A5E', '#3E7C72', '#B0852F', '#6B5B95', '#5A6678', '#9C2D3A', '#3C6E8F'],
      sequential: ['#EDF2F9', '#5E77AE', '#23366E'],
      positive: '#3E7C72', negative: '#C24A5E'
    },
    axis: { lineWidth: 1, labelSize: 12, tickColor: '#8C95B2' }
  };
  var THEME_LFG_ZEST = {
    id: 'lfg-zest', name: 'LFG·ZEST',
    fonts: {
      display: "'Raleway', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      body: "'Raleway', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      mono: "'IBM Plex Mono', ui-monospace, monospace"
    },
    palette: {
      ink: '#4A0C18', background: '#FFFFFF', grid: '#ECE8E2', axis: '#A39B90',
      categorical: ['#83021A', '#B0852F', '#5A626B', '#3E6E66', '#A65A3A', '#7C5466', '#9E2A36', '#5A0B14'],
      sequential: ['#F7EEE4', '#C25E66', '#83021A'],
      positive: '#3F7A5A', negative: '#9E2A36'
    },
    axis: { lineWidth: 1, labelSize: 12, tickColor: '#B0A89D' }
  };
  var THEME_NEUTRO = {
    id: 'neutro', name: 'Neutro',
    fonts: { display: "'Inter', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif", mono: "'JetBrains Mono', monospace" },
    palette: {
      ink: '#1f2933', background: '#ffffff', grid: '#e4e7eb', axis: '#9aa5b1',
      categorical: ['#2b5d8c', '#c08a3e', '#3f7d6e', '#8c5a7c', '#6b7280', '#a14b4b'],
      sequential: ['#e8f0f7', '#2b5d8c'], positive: '#3f7d6e', negative: '#a14b4b'
    },
    axis: { lineWidth: 1, labelSize: 12, tickColor: '#9aa5b1' }
  };
  var THEMES = { lfa: THEME_LFA, 'lfg-zest': THEME_LFG_ZEST, neutro: THEME_NEUTRO };

  /* ---------------- CHART CATALOG ---------------- */
  var CHART_CATALOG = [
    { group: 'Performance', items: [
      { id: 'line', name: 'Line' }, { id: 'area', name: 'Area' },
      { id: 'rebased', name: 'Rebased to 100' }, { id: 'drawdown', name: 'Drawdown' },
      { id: 'rolling', name: 'Rolling returns' }, { id: 'perfstack', name: 'Cumulative + bars (stacked)' }
    ]},
    { group: 'Allocation', items: [
      { id: 'donut', name: 'Donut / Pie' }, { id: 'stacked', name: 'Stacked bar' },
      { id: 'stackedh', name: 'Stacked bar (horizontal)' },
      { id: 'treemap', name: 'Treemap', hierarchical: true }, { id: 'sunburst', name: 'Sunburst', hierarchical: true }
    ]},
    { group: 'Comparison', items: [
      { id: 'groupbar', name: 'Grouped bars' }, { id: 'barh', name: 'Horizontal bars' },
      { id: 'bullet', name: 'Bullet vs benchmark' }, { id: 'slope', name: 'Slope' },
      { id: 'rangebar', name: 'Range min–max + marker' }, { id: 'combo', name: 'Combo bars + line' }
    ]},
    { group: 'Risk / Distribution', items: [
      { id: 'scatter', name: 'Scatter risk/return' }, { id: 'heatmap', name: 'Heatmap' },
      { id: 'histogram', name: 'Histogram' }, { id: 'boxplot', name: 'Box plot' }
    ]},
    { group: 'Market / Outlook', items: [
      { id: 'candlestick', name: 'Candlestick' }, { id: 'waterfall', name: 'Waterfall' }, { id: 'fan', name: 'Range / Fan' }
    ]}
  ];
  var CHART_META = {};
  CHART_CATALOG.forEach(function (g) { g.items.forEach(function (it) { CHART_META[it.id] = it; }); });
  function isHierarchical(t) { return !!(CHART_META[t] && CHART_META[t].hierarchical); }

  /* ---------------- DATA helpers ---------------- */
  function newMeta(o) { return Object.assign({ title: '', subtitle: '', xLabel: '', yLabel: '', y2Label: '', source: '' }, o || {}); }
  function uniqueX(series) {
    var xs = [], seen = {};
    series.forEach(function (s) { (s.points || []).forEach(function (p) { var k = String(p.x); if (!seen[k]) { seen[k] = 1; xs.push(p.x); } }); });
    return xs;
  }
  function seriesValuesAlongX(s, xs) {
    var map = {}; (s.points || []).forEach(function (p) { map[String(p.x)] = p.y; });
    return xs.map(function (x) { var v = map[String(x)]; return v === undefined ? null : v; });
  }
  function rebaseSeries(s) { var base = s.points.length ? s.points[0].y : 1; return s.points.map(function (p) { return { x: p.x, y: base ? (p.y / base) * 100 : p.y }; }); }
  function drawdownSeries(s) { var peak = -Infinity; return s.points.map(function (p) { peak = Math.max(peak, p.y); var dd = peak ? (p.y / peak - 1) * 100 : 0; return { x: p.x, y: Math.round(dd * 100) / 100 }; }); }
  function rollingReturns(s, w) { var out = []; for (var i = 0; i < s.points.length; i++) { if (i < w) { out.push({ x: s.points[i].x, y: null }); continue; } var a = s.points[i - w].y, b = s.points[i].y; out.push({ x: s.points[i].x, y: a ? Math.round((b / a - 1) * 10000) / 100 : null }); } return out; }
  function asTreeNodes(points) { return (points || []).map(function (p) { if (p && (Array.isArray(p.children) || p.value !== undefined)) return p; return { name: String((p && (p.name !== undefined ? p.name : p.x)) || ''), value: Number((p && (p.y !== undefined ? p.y : p.value)) || 0) }; }); }

  /* ---------------- RENDER helpers ---------------- */
  function baseTextStyle(t) { return { fontFamily: t.fonts.body, color: t.palette.ink }; }
  function titleBlock(d, t) {
    if (!d.meta.title && !d.meta.subtitle) return null;
    return { text: d.meta.title || '', subtext: d.meta.subtitle || '', left: 'center', top: 6,
      textStyle: { fontFamily: t.fonts.display, color: t.palette.ink, fontSize: 20, fontWeight: 700 },
      subtextStyle: { fontFamily: t.fonts.body, color: t.palette.axis, fontSize: 13 } };
  }
  function gridBlock() { return { left: 48, right: 28, top: 70, bottom: 52, containLabel: true }; }
  function axisCommon(t) {
    return {
      nameTextStyle: { color: t.palette.axis, fontFamily: t.fonts.body },
      axisLine: { lineStyle: { color: t.palette.axis, width: t.axis.lineWidth } },
      axisTick: { show: false, lineStyle: { color: t.axis.tickColor } },
      axisLabel: { color: t.palette.ink, fontFamily: t.fonts.body, fontSize: t.axis.labelSize },
      splitLine: { lineStyle: { color: t.palette.grid } }
    };
  }
  function colorFor(t, s, i) { return (s && s.color) || t.palette.categorical[i % t.palette.categorical.length]; }
  function legendBlock(t, names) { return { data: names, bottom: 4, itemWidth: 11, itemHeight: 11, icon: 'roundRect', textStyle: { color: t.palette.ink, fontFamily: t.fonts.body, fontSize: 12 } }; }

  /* ---------------- RENDERERS ---------------- */
  var R = {
    _xyLine: function (d, t, o) {
      o = o || {}; var xs = uniqueX(d.series);
      var series = d.series.map(function (s, i) {
        var pts = o.transform ? o.transform(s) : s.points;
        var vals = seriesValuesAlongX({ points: pts }, xs);
        var col = colorFor(t, s, i);
        return { name: s.name, type: 'line', smooth: o.smooth !== undefined ? o.smooth : true,
          showSymbol: false, symbolSize: 6, lineStyle: { width: 2.4, color: col }, itemStyle: { color: col },
          areaStyle: o.area ? { color: col, opacity: 0.16 } : null, data: vals };
      });
      return { backgroundColor: 'transparent', textStyle: baseTextStyle(t), title: titleBlock(d, t), grid: gridBlock(),
        tooltip: { trigger: 'axis' }, legend: d.series.length > 1 ? legendBlock(t, d.series.map(function (s) { return s.name; })) : undefined,
        xAxis: Object.assign({ type: 'category', boundaryGap: false, data: xs, name: d.meta.xLabel || '' }, axisCommon(t)),
        yAxis: Object.assign({ type: 'value', name: d.meta.yLabel || '', scale: !!o.scaleY }, axisCommon(t)), series: series };
    },
    line: function (d, t) { return R._xyLine(d, t, { scaleY: true }); },
    area: function (d, t) { return R._xyLine(d, t, { area: true, scaleY: true }); },
    rebased: function (d, t) { return R._xyLine(d, t, { transform: rebaseSeries, scaleY: true }); },
    drawdown: function (d, t) { return R._xyLine(d, t, { transform: drawdownSeries, area: true }); },
    rolling: function (d, t) { return R._xyLine(d, t, { transform: function (s) { return rollingReturns(s, 3); }, scaleY: true }); },

    donut: function (d, t) {
      var s = d.series[0] || { points: [] };
      var pts = s.points.map(function (p, i) { return { p: p, i: i }; }).filter(function (o) { return o.p.y != null && Number(o.p.y) !== 0; });
      return { backgroundColor: 'transparent', textStyle: baseTextStyle(t), title: titleBlock(d, t),
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' }, legend: legendBlock(t, pts.map(function (o) { return String(o.p.x); })),
        series: [{ type: 'pie', radius: ['45%', '70%'], center: ['50%', '52%'], avoidLabelOverlap: true,
          itemStyle: { borderColor: t.palette.background, borderWidth: 2 }, label: { color: t.palette.ink, fontFamily: t.fonts.body },
          data: pts.map(function (o) { return { name: String(o.p.x), value: o.p.y, itemStyle: { color: t.palette.categorical[o.i % t.palette.categorical.length] } }; }) }] };
    },
    stacked: function (d, t) { return R._bars(d, t, { stack: true }); },
    stackedh: function (d, t) { return R._bars(d, t, { stack: true, horizontal: true }); },
    groupbar: function (d, t) { return R._bars(d, t, {}); },
    barh: function (d, t) { return R._bars(d, t, { horizontal: true }); },
    _bars: function (d, t, o) {
      var xs = uniqueX(d.series);
      var hasTitle = !!(d.meta.title || d.meta.subtitle), hasLegend = d.series.length > 1;
      var catAxis = Object.assign({ type: 'category', data: xs, name: (o.horizontal ? d.meta.yLabel : d.meta.xLabel) || '' }, axisCommon(t));
      catAxis.axisLabel = Object.assign({}, catAxis.axisLabel, { interval: 0 }); // never drop a category label
      var valAxis = Object.assign({ type: 'value', name: (o.horizontal ? d.meta.xLabel : d.meta.yLabel) || '' }, axisCommon(t));
      var grid = { left: 48, right: 28, top: hasTitle ? 70 : 16, bottom: hasLegend ? 46 : 28, containLabel: true };
      return { backgroundColor: 'transparent', textStyle: baseTextStyle(t), title: titleBlock(d, t), grid: grid,
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } }, legend: hasLegend ? legendBlock(t, d.series.map(function (s) { return s.name; })) : undefined,
        xAxis: o.horizontal ? valAxis : catAxis, yAxis: o.horizontal ? catAxis : valAxis,
        series: d.series.map(function (s, i) { return { name: s.name, type: 'bar', stack: o.stack ? 'total' : undefined,
          itemStyle: { color: colorFor(t, s, i), borderRadius: o.stack ? 0 : (o.horizontal ? [0, 3, 3, 0] : [3, 3, 0, 0]) },
          emphasis: { focus: 'series' }, data: seriesValuesAlongX(s, xs) }; }) };
    },
    treemap: function (d, t) { var s = d.series[0] || { points: [] };
      return { backgroundColor: 'transparent', textStyle: baseTextStyle(t), title: titleBlock(d, t), tooltip: { trigger: 'item' },
        series: [{ type: 'treemap', roam: false, breadcrumb: { show: true, bottom: 6 }, label: { color: '#fff', fontFamily: t.fonts.body },
          levels: [{ itemStyle: { borderColor: t.palette.background, borderWidth: 2, gapWidth: 2 } }], color: t.palette.categorical, data: asTreeNodes(s.points) }] };
    },
    sunburst: function (d, t) { var s = d.series[0] || { points: [] };
      return { backgroundColor: 'transparent', textStyle: baseTextStyle(t), title: titleBlock(d, t), tooltip: { trigger: 'item' }, color: t.palette.categorical,
        series: [{ type: 'sunburst', radius: ['15%', '90%'], center: ['50%', '52%'], label: { color: '#fff', fontFamily: t.fonts.body },
          itemStyle: { borderColor: t.palette.background, borderWidth: 2 }, data: asTreeNodes(s.points) }] };
    },
    bullet: function (d, t) {
      var xs = uniqueX(d.series), main = d.series[0] || { points: [] }, bench = d.series[1];
      var series = [{ name: main.name, type: 'bar', barWidth: '45%', itemStyle: { color: t.palette.categorical[0] }, data: seriesValuesAlongX(main, xs) }];
      if (bench) series.push({ name: bench.name, type: 'scatter', symbol: 'rect', symbolSize: [28, 4], itemStyle: { color: t.palette.negative }, data: seriesValuesAlongX(bench, xs) });
      return { backgroundColor: 'transparent', textStyle: baseTextStyle(t), title: titleBlock(d, t), grid: gridBlock(),
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } }, legend: legendBlock(t, d.series.map(function (s) { return s.name; })),
        xAxis: Object.assign({ type: 'category', data: xs, name: d.meta.xLabel || '' }, axisCommon(t)),
        yAxis: Object.assign({ type: 'value', name: d.meta.yLabel || '' }, axisCommon(t)), series: series };
    },
    slope: function (d, t) {
      var first = d.series[0] && d.series[0].points.length ? d.series[0].points[0].x : 'Start';
      var last = d.series[0] && d.series[0].points.length ? d.series[0].points[d.series[0].points.length - 1].x : 'End';
      return { backgroundColor: 'transparent', textStyle: baseTextStyle(t), title: titleBlock(d, t), grid: gridBlock(),
        tooltip: { trigger: 'item' }, legend: legendBlock(t, d.series.map(function (s) { return s.name; })),
        xAxis: Object.assign({ type: 'category', data: [String(first), String(last)], boundaryGap: true, name: d.meta.xLabel || '' }, axisCommon(t)),
        yAxis: Object.assign({ type: 'value', scale: true, name: d.meta.yLabel || '' }, axisCommon(t)),
        series: d.series.map(function (s, i) { var a = s.points[0], b = s.points[s.points.length - 1];
          return { name: s.name, type: 'line', symbol: 'circle', symbolSize: 9, showSymbol: true, lineStyle: { width: 2.4, color: colorFor(t, s, i) },
            itemStyle: { color: colorFor(t, s, i) }, label: { show: true, color: t.palette.ink, formatter: '{c}' }, data: [a ? a.y : null, b ? b.y : null] }; }) };
    },
    rangebar: function (d, t) {
      var byName = function (re) { return d.series.find(function (s) { return re.test((s.name || '').toLowerCase()); }); };
      var sMin = byName(/min/) || d.series[0], sMax = byName(/max/) || d.series[1], sCur = byName(/cur|attu/) || d.series[2], sBen = byName(/bench|target|saa|strateg/) || d.series[3];
      var cats = (sMin || d.series[0] || { points: [] }).points.map(function (p) { return String(p.x); });
      var along = function (s) { return s ? seriesValuesAlongX(s, cats) : cats.map(function () { return null; }); };
      var minV = along(sMin), maxV = along(sMax), base = minV.map(function (v) { return Number(v) || 0; });
      var span = maxV.map(function (v, i) { return Math.max(0, (Number(v) || 0) - base[i]); });
      var isPct = maxV.concat(minV).every(function (v) { return v == null || Math.abs(Number(v)) <= 1.5; });
      var fmtV = function (v) { if (v == null) return ''; return isPct ? Math.round(v * 100) + '%' : (Math.round(v * 10) / 10) + '%'; };
      var pts = function (s) { return s ? cats.map(function (c, i) { var v = seriesValuesAlongX(s, cats)[i]; return v == null ? null : [Number(v), c]; }).filter(Boolean) : []; };
      var rangeCol = (sMin && sMin.color) || (sMax && sMax.color) || t.palette.categorical[0];
      var markCol = (sBen && sBen.color) || t.palette.negative;
      var series = [
        { type: 'bar', stack: 'r', silent: true, itemStyle: { color: 'transparent' }, data: base },
        { name: 'Tactical range', type: 'bar', stack: 'r', barWidth: '46%', itemStyle: { color: rangeCol, opacity: 0.22, borderColor: rangeCol, borderWidth: 1, borderRadius: 3 }, data: span }
      ];
      if (sCur) series.push({ name: sCur.name || 'Current', type: 'scatter', symbol: 'circle', symbolSize: 12, z: 5, itemStyle: { color: t.palette.categorical[0] }, data: pts(sCur) });
      if (sBen) series.push({ name: sBen.name || 'Benchmark', type: 'scatter', symbol: 'diamond', symbolSize: 14, z: 6, itemStyle: { color: markCol, borderColor: '#fff', borderWidth: 1.5 },
        label: { show: true, position: 'top', distance: 5, color: markCol, fontFamily: t.fonts.body, fontWeight: 700, fontSize: 11, formatter: function (p) { return fmtV(p.value[0]); } }, data: pts(sBen) });
      var hasTitle = !!(d.meta.title || d.meta.subtitle), showLegend = !d.meta.hideLegend;
      var maxX = Math.max.apply(null, maxV.map(function (v) { return Number(v) || 0; }).concat([0]));
      return { backgroundColor: 'transparent', textStyle: baseTextStyle(t), title: titleBlock(d, t),
        grid: { left: 78, right: 30, top: hasTitle ? 64 : 14, bottom: showLegend ? 38 : 14, containLabel: true },
        tooltip: { trigger: 'item' },
        legend: showLegend ? legendBlock(t, ['Tactical range'].concat(sCur ? [sCur.name || 'Current'] : []).concat(sBen ? [sBen.name || 'Benchmark'] : [])) : undefined,
        xAxis: Object.assign({ type: 'value', min: 0, max: isPct ? null : Math.ceil((maxX * 1.12) / 5) * 5, name: d.meta.xLabel || '', axisLabel: { show: false }, splitLine: { show: false } }, axisCommon(t), { axisTick: { show: false } }),
        yAxis: Object.assign({ type: 'category', data: cats, name: d.meta.yLabel || '', inverse: true }, axisCommon(t), { axisLine: { show: false }, splitLine: { show: false }, axisLabel: { color: t.palette.ink, fontFamily: t.fonts.body, fontSize: 12, fontWeight: 600 } }), series: series };
    },
    combo: function (d, t) {
      var xs = uniqueX(d.series), dual = d.series.length > 1;
      var series = d.series.map(function (s, i) { var col = colorFor(t, s, i), vals = seriesValuesAlongX(s, xs);
        if (i === 0) return { name: s.name, type: 'bar', yAxisIndex: 0, barMaxWidth: '46%', itemStyle: { color: col, borderRadius: [2, 2, 0, 0] }, data: vals };
        return { name: s.name, type: 'line', yAxisIndex: dual ? 1 : 0, smooth: true, showSymbol: false, lineStyle: { width: 2.4, color: col }, itemStyle: { color: col }, data: vals }; });
      var yLeft = Object.assign({ type: 'value', name: d.meta.yLabel || '', scale: true }, axisCommon(t));
      var yRight = Object.assign({ type: 'value', name: d.meta.y2Label || '', scale: true }, axisCommon(t), { position: 'right', splitLine: { show: false } });
      return { backgroundColor: 'transparent', textStyle: baseTextStyle(t), title: titleBlock(d, t), grid: { left: 48, right: dual ? 52 : 28, top: 70, bottom: 52, containLabel: true },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } }, legend: legendBlock(t, d.series.map(function (s) { return s.name; })),
        xAxis: Object.assign({ type: 'category', boundaryGap: true, data: xs, name: d.meta.xLabel || '' }, axisCommon(t)), yAxis: dual ? [yLeft, yRight] : yLeft, series: series };
    },
    perfstack: function (d, t) {
      // Two stacked panels sharing ONE time axis: cumulative line on top, period bars below.
      var xs = uniqueX(d.series);
      var isLine = function (s) { return /cum|index|rebas|nav|line/i.test(s.name || ''); };
      var lineS = d.series.find(isLine) || d.series[d.series.length - 1] || { name: 'Cumulative', points: [] };
      var barS = d.series.find(function (s) { return s !== lineS; }) || d.series[0] || { name: 'Period', points: [] };
      var lineCol = lineS.color || t.palette.negative;
      var barCol = barS.color || t.palette.ink;
      var hasTitle = !!(d.meta.title || d.meta.subtitle);
      var topY = hasTitle ? 64 : 24;
      return {
        backgroundColor: 'transparent', textStyle: baseTextStyle(t), title: titleBlock(d, t),
        tooltip: { trigger: 'axis', axisPointer: { type: 'cross', label: { backgroundColor: t.palette.ink } } },
        axisPointer: { link: [{ xAxisIndex: 'all' }] },
        legend: legendBlock(t, [lineS.name, barS.name]),
        grid: [
          { left: 56, right: 50, top: topY, height: '44%', containLabel: true },
          { left: 56, right: 50, top: '63%', bottom: 42, containLabel: true }
        ],
        xAxis: [
          Object.assign({ type: 'category', data: xs, boundaryGap: true, gridIndex: 0, name: '' }, axisCommon(t)),
          Object.assign({ type: 'category', data: xs, boundaryGap: true, gridIndex: 1, name: '' }, axisCommon(t), { axisLabel: { show: false }, axisTick: { show: false }, splitLine: { show: false } })
        ],
        yAxis: [
          Object.assign({ type: 'value', gridIndex: 0, name: d.meta.y2Label || 'Index', scale: true }, axisCommon(t)),
          Object.assign({ type: 'value', gridIndex: 1, name: d.meta.yLabel || 'Annual %' }, axisCommon(t))
        ],
        series: [
          { name: lineS.name, type: 'line', xAxisIndex: 0, yAxisIndex: 0, smooth: true, showSymbol: false, lineStyle: { width: 2.6, color: lineCol }, itemStyle: { color: lineCol }, areaStyle: { color: lineCol, opacity: 0.07 }, data: seriesValuesAlongX(lineS, xs) },
          { name: barS.name, type: 'bar', xAxisIndex: 1, yAxisIndex: 1, barMaxWidth: '52%', itemStyle: { color: barCol, borderRadius: [2, 2, 0, 0] }, data: seriesValuesAlongX(barS, xs) }
        ]
      };
    },
    perfstackmulti: function (d, t) {
      // Same two-panel layout as perfstack but with N currency series:
      // N cumulative LINES on top, N period BARS (grouped) below, one colour per
      // currency shared by its line + bars. meta.nCcy = how many series are lines.
      var xs = uniqueX(d.series);
      var n = (d.meta && d.meta.nCcy) || Math.ceil(d.series.length / 2);
      var lines = d.series.slice(0, n), bars = d.series.slice(n);
      var hasTitle = !!(d.meta.title || d.meta.subtitle);
      var topY = hasTitle ? 64 : 24;
      var col = function (i) { return t.palette.categorical[i % t.palette.categorical.length]; };
      var lineSeries = lines.map(function (s, i) { var c = s.color || col(i);
        return { name: s.name, type: 'line', xAxisIndex: 0, yAxisIndex: 0, smooth: true, showSymbol: false, lineStyle: { width: 2.4, color: c }, itemStyle: { color: c }, data: seriesValuesAlongX(s, xs) }; });
      var barSeries = bars.map(function (s, i) { var c = s.color || col(i);
        return { name: s.name, type: 'bar', xAxisIndex: 1, yAxisIndex: 1, barMaxWidth: 13, barGap: '15%', itemStyle: { color: c, borderRadius: [2, 2, 0, 0] }, data: seriesValuesAlongX(s, xs) }; });
      return {
        backgroundColor: 'transparent', textStyle: baseTextStyle(t), title: titleBlock(d, t),
        tooltip: { trigger: 'axis', axisPointer: { type: 'cross', label: { backgroundColor: t.palette.ink } } },
        axisPointer: { link: [{ xAxisIndex: 'all' }] },
        legend: legendBlock(t, lines.map(function (s) { return s.name; })),
        grid: [
          { left: 56, right: 50, top: topY, height: '44%', containLabel: true },
          { left: 56, right: 50, top: '63%', bottom: 42, containLabel: true }
        ],
        xAxis: [
          Object.assign({ type: 'category', data: xs, boundaryGap: true, gridIndex: 0, name: '' }, axisCommon(t)),
          Object.assign({ type: 'category', data: xs, boundaryGap: true, gridIndex: 1, name: '' }, axisCommon(t), { axisLabel: { show: false }, axisTick: { show: false }, splitLine: { show: false } })
        ],
        yAxis: [
          Object.assign({ type: 'value', gridIndex: 0, name: d.meta.y2Label || 'Index', scale: true }, axisCommon(t)),
          Object.assign({ type: 'value', gridIndex: 1, name: d.meta.yLabel || 'Annual %' }, axisCommon(t))
        ],
        series: lineSeries.concat(barSeries)
      };
    },
    scatter: function (d, t) {
      return { backgroundColor: 'transparent', textStyle: baseTextStyle(t), title: titleBlock(d, t), grid: gridBlock(),
        tooltip: { trigger: 'item', formatter: function (p) { return p.seriesName + '<br/>' + (d.meta.xLabel || 'x') + ': ' + p.value[0] + '<br/>' + (d.meta.yLabel || 'y') + ': ' + p.value[1]; } },
        legend: legendBlock(t, d.series.map(function (s) { return s.name; })),
        xAxis: Object.assign({ type: 'value', scale: true, name: d.meta.xLabel || '' }, axisCommon(t)),
        yAxis: Object.assign({ type: 'value', scale: true, name: d.meta.yLabel || '' }, axisCommon(t)),
        series: d.series.map(function (s, i) { return { name: s.name, type: 'scatter', symbolSize: 16, itemStyle: { color: colorFor(t, s, i) },
          label: { show: true, position: 'top', formatter: s.name, color: t.palette.ink, fontFamily: t.fonts.body, fontSize: 11 },
          data: s.points.map(function (p) { return [Number(p.x), Number(p.y)]; }) }; }) };
    },
    heatmap: function (d, t) {
      var rows = d.series.map(function (s) { return s.name; });
      var cols = d.series.length ? d.series[0].points.map(function (p) { return String(p.x); }) : [];
      var vals = [], min = Infinity, max = -Infinity;
      d.series.forEach(function (s, r) { s.points.forEach(function (p) { var c = cols.indexOf(String(p.x)); if (c < 0) return; var v = Number(p.y); min = Math.min(min, v); max = Math.max(max, v); vals.push([c, r, v]); }); });
      if (!isFinite(min)) { min = 0; max = 1; }
      return { backgroundColor: 'transparent', textStyle: baseTextStyle(t), title: titleBlock(d, t), grid: { left: 70, right: 28, top: 70, bottom: 72, containLabel: true }, tooltip: { position: 'top' },
        xAxis: Object.assign({ type: 'category', data: cols, splitArea: { show: true } }, axisCommon(t)),
        yAxis: Object.assign({ type: 'category', data: rows, splitArea: { show: true } }, axisCommon(t)),
        visualMap: { min: min, max: max, calculable: true, orient: 'horizontal', left: 'center', bottom: 6, inRange: { color: [t.palette.sequential[0], t.palette.sequential[t.palette.sequential.length - 1]] }, textStyle: { color: t.palette.ink } },
        series: [{ type: 'heatmap', data: vals, label: { show: true, color: t.palette.ink, formatter: function (p) { return Math.round(p.value[2] * 100) / 100; } } }] };
    },
    histogram: function (d, t) {
      var s = d.series[0] || { points: [] }, ys = s.points.map(function (p) { return Number(p.y); }).filter(function (v) { return !isNaN(v); });
      var bins = 12, min = Math.min.apply(null, ys), max = Math.max.apply(null, ys);
      if (!isFinite(min)) { min = 0; max = 1; } if (min === max) max = min + 1;
      var w = (max - min) / bins, counts = new Array(bins).fill(0);
      ys.forEach(function (v) { var b = Math.floor((v - min) / w); if (b >= bins) b = bins - 1; if (b < 0) b = 0; counts[b]++; });
      var labels = counts.map(function (_, i) { return (Math.round((min + i * w) * 10) / 10).toString(); });
      return { backgroundColor: 'transparent', textStyle: baseTextStyle(t), title: titleBlock(d, t), grid: gridBlock(), tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        xAxis: Object.assign({ type: 'category', data: labels, name: d.meta.xLabel || '' }, axisCommon(t)),
        yAxis: Object.assign({ type: 'value', name: d.meta.yLabel || 'Frequency' }, axisCommon(t)),
        series: [{ name: 'Frequency', type: 'bar', barCategoryGap: '2%', itemStyle: { color: t.palette.categorical[0] }, data: counts }] };
    },
    boxplot: function (d, t) {
      var names = d.series.map(function (s) { return s.name; });
      var boxData = d.series.map(function (s) { var arr = s.points.map(function (p) { return Number(p.y); }).filter(function (v) { return !isNaN(v); }).sort(function (a, b) { return a - b; });
        var q = function (p) { if (!arr.length) return 0; var idx = (arr.length - 1) * p, lo = Math.floor(idx), hi = Math.ceil(idx); return arr[lo] + (arr[hi] - arr[lo]) * (idx - lo); };
        return [arr[0] || 0, q(0.25), q(0.5), q(0.75), arr[arr.length - 1] || 0]; });
      return { backgroundColor: 'transparent', textStyle: baseTextStyle(t), title: titleBlock(d, t), grid: gridBlock(), tooltip: { trigger: 'item' },
        xAxis: Object.assign({ type: 'category', data: names, name: d.meta.xLabel || '' }, axisCommon(t)),
        yAxis: Object.assign({ type: 'value', scale: true, name: d.meta.yLabel || '' }, axisCommon(t)),
        series: [{ type: 'boxplot', itemStyle: { color: t.palette.categorical[0], borderColor: t.palette.ink }, data: boxData }] };
    },
    candlestick: function (d, t) {
      var s = d.series[0] || { points: [] }, xs = s.points.map(function (p) { return String(p.x); });
      var k = s.points.map(function (p, i, arr) { var y = Number(p.y), prev = i > 0 ? Number(arr[i - 1].y) : y; var open = prev, close = y; return [open, close, Math.min(open, close) * 0.99, Math.max(open, close) * 1.01]; });
      return { backgroundColor: 'transparent', textStyle: baseTextStyle(t), title: titleBlock(d, t), grid: gridBlock(), tooltip: { trigger: 'axis' },
        xAxis: Object.assign({ type: 'category', data: xs, name: d.meta.xLabel || '' }, axisCommon(t)),
        yAxis: Object.assign({ type: 'value', scale: true, name: d.meta.yLabel || '' }, axisCommon(t)),
        series: [{ type: 'candlestick', data: k, itemStyle: { color: t.palette.positive, color0: t.palette.negative, borderColor: t.palette.positive, borderColor0: t.palette.negative } }] };
    },
    waterfall: function (d, t) {
      var s = d.series[0] || { points: [] }, cats = s.points.map(function (p) { return String(p.x); });
      var base = [], rise = [], fall = [], cum = 0;
      s.points.forEach(function (p, i) { var v = Number(p.y) || 0; if (i === 0) { base.push(0); rise.push(v >= 0 ? v : 0); fall.push(v < 0 ? -v : 0); cum = v; return; }
        if (v >= 0) { base.push(cum); rise.push(v); fall.push('-'); cum += v; } else { cum += v; base.push(cum); rise.push('-'); fall.push(-v); } });
      return { backgroundColor: 'transparent', textStyle: baseTextStyle(t), title: titleBlock(d, t), grid: gridBlock(), tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        xAxis: Object.assign({ type: 'category', data: cats, name: d.meta.xLabel || '' }, axisCommon(t)),
        yAxis: Object.assign({ type: 'value', name: d.meta.yLabel || '' }, axisCommon(t)),
        series: [{ type: 'bar', stack: 'wf', itemStyle: { color: 'transparent' }, emphasis: { itemStyle: { color: 'transparent' } }, data: base },
          { name: 'Increase', type: 'bar', stack: 'wf', itemStyle: { color: t.palette.positive }, data: rise },
          { name: 'Decrease', type: 'bar', stack: 'wf', itemStyle: { color: t.palette.negative }, data: fall }] };
    },
    fan: function (d, t) {
      var xs = uniqueX(d.series), find = function (re) { return d.series.find(function (s) { return re.test((s.name || '').toLowerCase()); }); };
      var central = find(/centr|base|mid/) || d.series[0], low = find(/low|min|down/) || d.series[1], high = find(/high|max|up/) || d.series[2];
      var series = [];
      if (low && high) { var lowV = seriesValuesAlongX(low, xs), highV = seriesValuesAlongX(high, xs);
        series.push({ name: '__low', type: 'line', stack: 'band', symbol: 'none', lineStyle: { opacity: 0 }, areaStyle: { opacity: 0 }, data: lowV, silent: true });
        series.push({ name: 'Band', type: 'line', stack: 'band', symbol: 'none', lineStyle: { opacity: 0 }, areaStyle: { color: t.palette.categorical[0], opacity: 0.16 }, data: highV.map(function (v, i) { return v == null || lowV[i] == null ? null : v - lowV[i]; }) }); }
      if (central) series.push({ name: central.name, type: 'line', smooth: true, symbol: 'none', lineStyle: { width: 2.6, color: t.palette.categorical[0] }, itemStyle: { color: t.palette.categorical[0] }, data: seriesValuesAlongX(central, xs) });
      return { backgroundColor: 'transparent', textStyle: baseTextStyle(t), title: titleBlock(d, t), grid: gridBlock(), tooltip: { trigger: 'axis' },
        legend: { data: ['Band', central ? central.name : ''].filter(Boolean), bottom: 4, textStyle: { color: t.palette.ink, fontFamily: t.fonts.body } },
        xAxis: Object.assign({ type: 'category', data: xs, name: d.meta.xLabel || '' }, axisCommon(t)),
        yAxis: Object.assign({ type: 'value', scale: true, name: d.meta.yLabel || '' }, axisCommon(t)), series: series };
    }
  };

  function buildOption(spec, theme) {
    var t = (typeof theme === 'string' ? THEMES[theme] : theme) || THEME_LFA;
    var d = normalize(spec);
    var fn = R[d.type] || R.line;
    return fn(d, t);
  }

  function normalize(spec) {
    var d = spec || {};
    return { type: d.type || 'line', meta: newMeta(d.meta), series: (d.series || []).map(function (s) { return { name: s.name || 'Series', color: s.color || null, points: (s.points || []).slice() }; }) };
  }

  /* ---------------- TSV / table <-> spec ---------------- */
  // Category table: first column = X, each next column a series. Returns {headers, rows}.
  function specToTable(spec) {
    var d = normalize(spec), xs = uniqueX(d.series);
    var headers = ['X'].concat(d.series.map(function (s) { return s.name; }));
    var rows = xs.map(function (x) { var row = [String(x)]; d.series.forEach(function (s) { var v = seriesValuesAlongX(s, [x])[0]; row.push(v == null ? '' : v); }); return row; });
    return { headers: headers, rows: rows };
  }
  function tableToSpec(spec, headers, rows) {
    var d = normalize(spec);
    var nSeries = headers.length - 1;
    var series = [];
    for (var c = 0; c < nSeries; c++) {
      var old = d.series[c] || {};
      series.push({ name: headers[c + 1] || ('Series ' + (c + 1)), color: old.color || null,
        points: rows.filter(function (r) { return String(r[0]).trim() !== ''; }).map(function (r) {
          var raw = r[c + 1]; var num = parseFloat(String(raw).replace(',', '.'));
          var xv = r[0]; var xn = parseFloat(xv); var x = (String(xv).trim() !== '' && !isNaN(xn) && String(xn) === String(xv).trim()) ? xn : xv;
          return { x: x, y: (raw === '' || raw == null || isNaN(num)) ? null : num };
        }) });
    }
    return { type: d.type, meta: d.meta, series: series };
  }
  function parseTSV(text) {
    var lines = String(text).replace(/\r/g, '').split('\n').filter(function (l) { return l.trim() !== ''; });
    if (!lines.length) return { headers: ['X', 'Series 1'], rows: [] };
    var delim = lines[0].indexOf('\t') >= 0 ? '\t' : (lines[0].indexOf(';') >= 0 ? ';' : ',');
    var grid = lines.map(function (l) { return l.split(delim).map(function (c) { return c.trim(); }); });
    return { headers: grid[0], rows: grid.slice(1) };
  }
  function tableToTSV(headers, rows) {
    return [headers.join('\t')].concat(rows.map(function (r) { return r.join('\t'); })).join('\n');
  }

  window.LFAChartEngine = {
    THEMES: THEMES, CHART_CATALOG: CHART_CATALOG, CHART_META: CHART_META, isHierarchical: isHierarchical,
    buildOption: buildOption, normalize: normalize, newMeta: newMeta,
    specToTable: specToTable, tableToSpec: tableToSpec, parseTSV: parseTSV, tableToTSV: tableToTSV
  };
})();
