/* @ds-bundle: {"format":3,"namespace":"LFADesignSystem_f7f6ac","components":[{"name":"FeatureCard","sourcePath":"components/cards/FeatureCard.jsx"},{"name":"StatCard","sourcePath":"components/cards/StatCard.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"RoseSection","sourcePath":"components/layout/RoseSection.jsx"},{"name":"SectionHeading","sourcePath":"components/layout/SectionHeading.jsx"},{"name":"MandateTabs","sourcePath":"components/navigation/MandateTabs.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"}],"sourceHashes":{"charts/lfa-chart-engine.js":"74ba1f67f8c1","charts/lfa-chart-lite.js":"187698fd01bf","charts/lfa-chart-studio.js":"58e14f635982","components/cards/FeatureCard.jsx":"f271767982ff","components/cards/StatCard.jsx":"b94bdcc46213","components/core/Button.jsx":"d50643d23a62","components/core/Eyebrow.jsx":"28ae0cb695a6","components/core/Tag.jsx":"6eaaf0272426","components/layout/RoseSection.jsx":"7791b95f72be","components/layout/SectionHeading.jsx":"55baad746165","components/navigation/MandateTabs.jsx":"2289e61892a3","components/navigation/NavBar.jsx":"eba06057b9f8","exports/brochure-handoff/template/ds-base.js":"95f57e267e9f","exports/lfg-handoff/01-institutional-brochure/LFA/brochure/ds-base.js":"c6db80d89673","exports/lfg-handoff/01-institutional-brochure/LFG-ZEST/brochure-en/ds-base.js":"c11701906ec4","exports/lfg-handoff/01-institutional-brochure/LFG-ZEST/brochure-it/ds-base.js":"c11701906ec4","exports/lfg-handoff/01-institutional-brochure/charts/lfa-chart-engine.js":"74ba1f67f8c1","exports/lfg-handoff/01-institutional-brochure/charts/lfa-chart-studio.js":"58e14f635982","exports/lfg-handoff/02-factsheet-editor/factsheet/ChartEditor.jsx":"0f7bacd05c37","exports/lfg-handoff/02-factsheet-editor/factsheet/Charts.jsx":"5110c67fea06","exports/lfg-handoff/02-factsheet-editor/factsheet/FactsheetHive.jsx":"af2d54f33096","exports/lfg-handoff/02-factsheet-editor/factsheet/FactsheetVG.jsx":"4c2d898ba925","exports/lfg-handoff/02-factsheet-editor/factsheet/FactsheetZest.jsx":"af59a7876e25","exports/lfg-handoff/02-factsheet-editor/factsheet/chart-bridge.js":"400c04bf0912","exports/lfg-handoff/02-factsheet-editor/factsheet/data.js":"10f428258f42","exports/lfg-handoff/02-factsheet-editor/factsheet/echarts-kit.js":"5eca3cfad840","exports/lfg-handoff/02-factsheet-editor/factsheet/excel.js":"75b05005d16f","exports/lfg-handoff/02-factsheet-editor/factsheet/layout-kit.jsx":"85d929ca40eb","exports/lfg-handoff/02-factsheet-editor/zest-napr-template/ds-base.js":"fc734738f422","exports/lfg-handoff/02-factsheet-editor/zest-napr-template/napr-data.js":"32c2a76a6b21","exports/lfg-handoff/03-one-pager/ds-base.js":"20ae0857bffb","list-template/data.js":"9e7c9f9965c9","proposals/investment-process/ds-base.js":"c6db80d89673","proposals/investment-process/ip-master-data.js":"cd4d73fd2612","proposals/investment-process/ip-master-gm-defaults.js":"a6e2336e1f9f","proposals/investment-process/ip-master-gm.js":"3013aa46cf31","proposals/investment-process/ip-master-lfgz-defaults.js":"4fb2d423a39b","proposals/investment-process/ip-master-lfgz.js":"780cc7a13f67","ui_kits/website/About.jsx":"9d59ab74677a","ui_kits/website/Footer.jsx":"509e3567aceb","ui_kits/website/Home.jsx":"99839b4923c5","ui_kits/website/WhatWeDo.jsx":"43d4e11033f8","ui_kits/website/shared.jsx":"a9a1cc10acac"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.LFADesignSystem_f7f6ac = window.LFADesignSystem_f7f6ac || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// charts/lfa-chart-engine.js
try { (() => {
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
    id: 'lfa',
    name: 'LFA',
    fonts: {
      display: "'Cormorant Garamond', 'Hoefler Text', Georgia, serif",
      body: "'Mulish', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      mono: "'IBM Plex Mono', ui-monospace, monospace"
    },
    palette: {
      ink: '#23366E',
      background: '#FFFFFF',
      grid: '#E0E4EB',
      axis: '#8C95B2',
      categorical: ['#23366E', '#C24A5E', '#3E7C72', '#B0852F', '#6B5B95', '#5A6678', '#9C2D3A', '#3C6E8F'],
      sequential: ['#EDF2F9', '#5E77AE', '#23366E'],
      positive: '#3E7C72',
      negative: '#C24A5E'
    },
    axis: {
      lineWidth: 1,
      labelSize: 12,
      tickColor: '#8C95B2'
    }
  };
  var THEME_LFG_ZEST = {
    id: 'lfg-zest',
    name: 'LFG·ZEST',
    fonts: {
      display: "'Raleway', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      body: "'Raleway', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      mono: "'IBM Plex Mono', ui-monospace, monospace"
    },
    palette: {
      ink: '#4A0C18',
      background: '#FFFFFF',
      grid: '#ECE8E2',
      axis: '#A39B90',
      categorical: ['#83021A', '#B0852F', '#5A626B', '#3E6E66', '#A65A3A', '#7C5466', '#9E2A36', '#5A0B14'],
      sequential: ['#F7EEE4', '#C25E66', '#83021A'],
      positive: '#3F7A5A',
      negative: '#9E2A36'
    },
    axis: {
      lineWidth: 1,
      labelSize: 12,
      tickColor: '#B0A89D'
    }
  };
  var THEME_NEUTRO = {
    id: 'neutro',
    name: 'Neutro',
    fonts: {
      display: "'Inter', system-ui, sans-serif",
      body: "'Inter', system-ui, sans-serif",
      mono: "'JetBrains Mono', monospace"
    },
    palette: {
      ink: '#1f2933',
      background: '#ffffff',
      grid: '#e4e7eb',
      axis: '#9aa5b1',
      categorical: ['#2b5d8c', '#c08a3e', '#3f7d6e', '#8c5a7c', '#6b7280', '#a14b4b'],
      sequential: ['#e8f0f7', '#2b5d8c'],
      positive: '#3f7d6e',
      negative: '#a14b4b'
    },
    axis: {
      lineWidth: 1,
      labelSize: 12,
      tickColor: '#9aa5b1'
    }
  };
  var THEMES = {
    lfa: THEME_LFA,
    'lfg-zest': THEME_LFG_ZEST,
    neutro: THEME_NEUTRO
  };

  /* ---------------- CHART CATALOG ---------------- */
  var CHART_CATALOG = [{
    group: 'Performance',
    items: [{
      id: 'line',
      name: 'Line'
    }, {
      id: 'area',
      name: 'Area'
    }, {
      id: 'rebased',
      name: 'Rebased to 100'
    }, {
      id: 'drawdown',
      name: 'Drawdown'
    }, {
      id: 'rolling',
      name: 'Rolling returns'
    }, {
      id: 'perfstack',
      name: 'Cumulative + bars (stacked)'
    }]
  }, {
    group: 'Allocation',
    items: [{
      id: 'donut',
      name: 'Donut / Pie'
    }, {
      id: 'stacked',
      name: 'Stacked bar'
    }, {
      id: 'stackedh',
      name: 'Stacked bar (horizontal)'
    }, {
      id: 'treemap',
      name: 'Treemap',
      hierarchical: true
    }, {
      id: 'sunburst',
      name: 'Sunburst',
      hierarchical: true
    }]
  }, {
    group: 'Comparison',
    items: [{
      id: 'groupbar',
      name: 'Grouped bars'
    }, {
      id: 'barh',
      name: 'Horizontal bars'
    }, {
      id: 'bullet',
      name: 'Bullet vs benchmark'
    }, {
      id: 'slope',
      name: 'Slope'
    }, {
      id: 'rangebar',
      name: 'Range min–max + marker'
    }, {
      id: 'combo',
      name: 'Combo bars + line'
    }]
  }, {
    group: 'Risk / Distribution',
    items: [{
      id: 'scatter',
      name: 'Scatter risk/return'
    }, {
      id: 'heatmap',
      name: 'Heatmap'
    }, {
      id: 'histogram',
      name: 'Histogram'
    }, {
      id: 'boxplot',
      name: 'Box plot'
    }]
  }, {
    group: 'Market / Outlook',
    items: [{
      id: 'candlestick',
      name: 'Candlestick'
    }, {
      id: 'waterfall',
      name: 'Waterfall'
    }, {
      id: 'fan',
      name: 'Range / Fan'
    }]
  }];
  var CHART_META = {};
  CHART_CATALOG.forEach(function (g) {
    g.items.forEach(function (it) {
      CHART_META[it.id] = it;
    });
  });
  function isHierarchical(t) {
    return !!(CHART_META[t] && CHART_META[t].hierarchical);
  }

  /* ---------------- DATA helpers ---------------- */
  function newMeta(o) {
    return Object.assign({
      title: '',
      subtitle: '',
      xLabel: '',
      yLabel: '',
      y2Label: '',
      source: ''
    }, o || {});
  }
  function uniqueX(series) {
    var xs = [],
      seen = {};
    series.forEach(function (s) {
      (s.points || []).forEach(function (p) {
        var k = String(p.x);
        if (!seen[k]) {
          seen[k] = 1;
          xs.push(p.x);
        }
      });
    });
    return xs;
  }
  function seriesValuesAlongX(s, xs) {
    var map = {};
    (s.points || []).forEach(function (p) {
      map[String(p.x)] = p.y;
    });
    return xs.map(function (x) {
      var v = map[String(x)];
      return v === undefined ? null : v;
    });
  }
  function rebaseSeries(s) {
    var base = s.points.length ? s.points[0].y : 1;
    return s.points.map(function (p) {
      return {
        x: p.x,
        y: base ? p.y / base * 100 : p.y
      };
    });
  }
  function drawdownSeries(s) {
    var peak = -Infinity;
    return s.points.map(function (p) {
      peak = Math.max(peak, p.y);
      var dd = peak ? (p.y / peak - 1) * 100 : 0;
      return {
        x: p.x,
        y: Math.round(dd * 100) / 100
      };
    });
  }
  function rollingReturns(s, w) {
    var out = [];
    for (var i = 0; i < s.points.length; i++) {
      if (i < w) {
        out.push({
          x: s.points[i].x,
          y: null
        });
        continue;
      }
      var a = s.points[i - w].y,
        b = s.points[i].y;
      out.push({
        x: s.points[i].x,
        y: a ? Math.round((b / a - 1) * 10000) / 100 : null
      });
    }
    return out;
  }
  function asTreeNodes(points) {
    return (points || []).map(function (p) {
      if (p && (Array.isArray(p.children) || p.value !== undefined)) return p;
      return {
        name: String(p && (p.name !== undefined ? p.name : p.x) || ''),
        value: Number(p && (p.y !== undefined ? p.y : p.value) || 0)
      };
    });
  }

  /* ---------------- RENDER helpers ---------------- */
  function baseTextStyle(t) {
    return {
      fontFamily: t.fonts.body,
      color: t.palette.ink
    };
  }
  function titleBlock(d, t) {
    if (!d.meta.title && !d.meta.subtitle) return null;
    return {
      text: d.meta.title || '',
      subtext: d.meta.subtitle || '',
      left: 'center',
      top: 6,
      textStyle: {
        fontFamily: t.fonts.display,
        color: t.palette.ink,
        fontSize: 20,
        fontWeight: 700
      },
      subtextStyle: {
        fontFamily: t.fonts.body,
        color: t.palette.axis,
        fontSize: 13
      }
    };
  }
  function gridBlock() {
    return {
      left: 48,
      right: 28,
      top: 70,
      bottom: 52,
      containLabel: true
    };
  }
  function axisCommon(t) {
    return {
      nameTextStyle: {
        color: t.palette.axis,
        fontFamily: t.fonts.body
      },
      axisLine: {
        lineStyle: {
          color: t.palette.axis,
          width: t.axis.lineWidth
        }
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: t.axis.tickColor
        }
      },
      axisLabel: {
        color: t.palette.ink,
        fontFamily: t.fonts.body,
        fontSize: t.axis.labelSize
      },
      splitLine: {
        lineStyle: {
          color: t.palette.grid
        }
      }
    };
  }
  function colorFor(t, s, i) {
    return s && s.color || t.palette.categorical[i % t.palette.categorical.length];
  }
  function legendBlock(t, names) {
    return {
      data: names,
      bottom: 4,
      itemWidth: 11,
      itemHeight: 11,
      icon: 'roundRect',
      textStyle: {
        color: t.palette.ink,
        fontFamily: t.fonts.body,
        fontSize: 12
      }
    };
  }

  /* ---------------- RENDERERS ---------------- */
  var R = {
    _xyLine: function (d, t, o) {
      o = o || {};
      var xs = uniqueX(d.series);
      var series = d.series.map(function (s, i) {
        var pts = o.transform ? o.transform(s) : s.points;
        var vals = seriesValuesAlongX({
          points: pts
        }, xs);
        var col = colorFor(t, s, i);
        return {
          name: s.name,
          type: 'line',
          smooth: o.smooth !== undefined ? o.smooth : true,
          showSymbol: false,
          symbolSize: 6,
          lineStyle: {
            width: 2.4,
            color: col
          },
          itemStyle: {
            color: col
          },
          areaStyle: o.area ? {
            color: col,
            opacity: 0.16
          } : null,
          data: vals
        };
      });
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        grid: gridBlock(),
        tooltip: {
          trigger: 'axis'
        },
        legend: d.series.length > 1 ? legendBlock(t, d.series.map(function (s) {
          return s.name;
        })) : undefined,
        xAxis: Object.assign({
          type: 'category',
          boundaryGap: false,
          data: xs,
          name: d.meta.xLabel || ''
        }, axisCommon(t)),
        yAxis: Object.assign({
          type: 'value',
          name: d.meta.yLabel || '',
          scale: !!o.scaleY
        }, axisCommon(t)),
        series: series
      };
    },
    line: function (d, t) {
      return R._xyLine(d, t, {
        scaleY: true
      });
    },
    area: function (d, t) {
      return R._xyLine(d, t, {
        area: true,
        scaleY: true
      });
    },
    rebased: function (d, t) {
      return R._xyLine(d, t, {
        transform: rebaseSeries,
        scaleY: true
      });
    },
    drawdown: function (d, t) {
      return R._xyLine(d, t, {
        transform: drawdownSeries,
        area: true
      });
    },
    rolling: function (d, t) {
      return R._xyLine(d, t, {
        transform: function (s) {
          return rollingReturns(s, 3);
        },
        scaleY: true
      });
    },
    donut: function (d, t) {
      var s = d.series[0] || {
        points: []
      };
      var pts = s.points.map(function (p, i) {
        return {
          p: p,
          i: i
        };
      }).filter(function (o) {
        return o.p.y != null && Number(o.p.y) !== 0;
      });
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: legendBlock(t, pts.map(function (o) {
          return String(o.p.x);
        })),
        series: [{
          type: 'pie',
          radius: ['45%', '70%'],
          center: ['50%', '52%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderColor: t.palette.background,
            borderWidth: 2
          },
          label: {
            color: t.palette.ink,
            fontFamily: t.fonts.body
          },
          data: pts.map(function (o) {
            return {
              name: String(o.p.x),
              value: o.p.y,
              itemStyle: {
                color: t.palette.categorical[o.i % t.palette.categorical.length]
              }
            };
          })
        }]
      };
    },
    stacked: function (d, t) {
      return R._bars(d, t, {
        stack: true
      });
    },
    stackedh: function (d, t) {
      return R._bars(d, t, {
        stack: true,
        horizontal: true
      });
    },
    groupbar: function (d, t) {
      return R._bars(d, t, {});
    },
    barh: function (d, t) {
      return R._bars(d, t, {
        horizontal: true
      });
    },
    _bars: function (d, t, o) {
      var xs = uniqueX(d.series);
      var hasTitle = !!(d.meta.title || d.meta.subtitle),
        hasLegend = d.series.length > 1;
      var catAxis = Object.assign({
        type: 'category',
        data: xs,
        name: (o.horizontal ? d.meta.yLabel : d.meta.xLabel) || ''
      }, axisCommon(t));
      catAxis.axisLabel = Object.assign({}, catAxis.axisLabel, {
        interval: 0
      }); // never drop a category label
      var valAxis = Object.assign({
        type: 'value',
        name: (o.horizontal ? d.meta.xLabel : d.meta.yLabel) || ''
      }, axisCommon(t));
      var grid = {
        left: 48,
        right: 28,
        top: hasTitle ? 70 : 16,
        bottom: hasLegend ? 46 : 28,
        containLabel: true
      };
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        grid: grid,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: hasLegend ? legendBlock(t, d.series.map(function (s) {
          return s.name;
        })) : undefined,
        xAxis: o.horizontal ? valAxis : catAxis,
        yAxis: o.horizontal ? catAxis : valAxis,
        series: d.series.map(function (s, i) {
          return {
            name: s.name,
            type: 'bar',
            stack: o.stack ? 'total' : undefined,
            itemStyle: {
              color: colorFor(t, s, i),
              borderRadius: o.stack ? 0 : o.horizontal ? [0, 3, 3, 0] : [3, 3, 0, 0]
            },
            emphasis: {
              focus: 'series'
            },
            data: seriesValuesAlongX(s, xs)
          };
        })
      };
    },
    treemap: function (d, t) {
      var s = d.series[0] || {
        points: []
      };
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        tooltip: {
          trigger: 'item'
        },
        series: [{
          type: 'treemap',
          roam: false,
          breadcrumb: {
            show: true,
            bottom: 6
          },
          label: {
            color: '#fff',
            fontFamily: t.fonts.body
          },
          levels: [{
            itemStyle: {
              borderColor: t.palette.background,
              borderWidth: 2,
              gapWidth: 2
            }
          }],
          color: t.palette.categorical,
          data: asTreeNodes(s.points)
        }]
      };
    },
    sunburst: function (d, t) {
      var s = d.series[0] || {
        points: []
      };
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        tooltip: {
          trigger: 'item'
        },
        color: t.palette.categorical,
        series: [{
          type: 'sunburst',
          radius: ['15%', '90%'],
          center: ['50%', '52%'],
          label: {
            color: '#fff',
            fontFamily: t.fonts.body
          },
          itemStyle: {
            borderColor: t.palette.background,
            borderWidth: 2
          },
          data: asTreeNodes(s.points)
        }]
      };
    },
    bullet: function (d, t) {
      var xs = uniqueX(d.series),
        main = d.series[0] || {
          points: []
        },
        bench = d.series[1];
      var series = [{
        name: main.name,
        type: 'bar',
        barWidth: '45%',
        itemStyle: {
          color: t.palette.categorical[0]
        },
        data: seriesValuesAlongX(main, xs)
      }];
      if (bench) series.push({
        name: bench.name,
        type: 'scatter',
        symbol: 'rect',
        symbolSize: [28, 4],
        itemStyle: {
          color: t.palette.negative
        },
        data: seriesValuesAlongX(bench, xs)
      });
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        grid: gridBlock(),
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: legendBlock(t, d.series.map(function (s) {
          return s.name;
        })),
        xAxis: Object.assign({
          type: 'category',
          data: xs,
          name: d.meta.xLabel || ''
        }, axisCommon(t)),
        yAxis: Object.assign({
          type: 'value',
          name: d.meta.yLabel || ''
        }, axisCommon(t)),
        series: series
      };
    },
    slope: function (d, t) {
      var first = d.series[0] && d.series[0].points.length ? d.series[0].points[0].x : 'Start';
      var last = d.series[0] && d.series[0].points.length ? d.series[0].points[d.series[0].points.length - 1].x : 'End';
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        grid: gridBlock(),
        tooltip: {
          trigger: 'item'
        },
        legend: legendBlock(t, d.series.map(function (s) {
          return s.name;
        })),
        xAxis: Object.assign({
          type: 'category',
          data: [String(first), String(last)],
          boundaryGap: true,
          name: d.meta.xLabel || ''
        }, axisCommon(t)),
        yAxis: Object.assign({
          type: 'value',
          scale: true,
          name: d.meta.yLabel || ''
        }, axisCommon(t)),
        series: d.series.map(function (s, i) {
          var a = s.points[0],
            b = s.points[s.points.length - 1];
          return {
            name: s.name,
            type: 'line',
            symbol: 'circle',
            symbolSize: 9,
            showSymbol: true,
            lineStyle: {
              width: 2.4,
              color: colorFor(t, s, i)
            },
            itemStyle: {
              color: colorFor(t, s, i)
            },
            label: {
              show: true,
              color: t.palette.ink,
              formatter: '{c}'
            },
            data: [a ? a.y : null, b ? b.y : null]
          };
        })
      };
    },
    rangebar: function (d, t) {
      var byName = function (re) {
        return d.series.find(function (s) {
          return re.test((s.name || '').toLowerCase());
        });
      };
      var sMin = byName(/min/) || d.series[0],
        sMax = byName(/max/) || d.series[1],
        sCur = byName(/cur|attu/) || d.series[2],
        sBen = byName(/bench|target|saa|strateg/) || d.series[3];
      var cats = (sMin || d.series[0] || {
        points: []
      }).points.map(function (p) {
        return String(p.x);
      });
      var along = function (s) {
        return s ? seriesValuesAlongX(s, cats) : cats.map(function () {
          return null;
        });
      };
      var minV = along(sMin),
        maxV = along(sMax),
        base = minV.map(function (v) {
          return Number(v) || 0;
        });
      var span = maxV.map(function (v, i) {
        return Math.max(0, (Number(v) || 0) - base[i]);
      });
      var isPct = maxV.concat(minV).every(function (v) {
        return v == null || Math.abs(Number(v)) <= 1.5;
      });
      var fmtV = function (v) {
        if (v == null) return '';
        return isPct ? Math.round(v * 100) + '%' : Math.round(v * 10) / 10 + '%';
      };
      var pts = function (s) {
        return s ? cats.map(function (c, i) {
          var v = seriesValuesAlongX(s, cats)[i];
          return v == null ? null : [Number(v), c];
        }).filter(Boolean) : [];
      };
      var rangeCol = sMin && sMin.color || sMax && sMax.color || t.palette.categorical[0];
      var markCol = sBen && sBen.color || t.palette.negative;
      var series = [{
        type: 'bar',
        stack: 'r',
        silent: true,
        itemStyle: {
          color: 'transparent'
        },
        data: base
      }, {
        name: 'Tactical range',
        type: 'bar',
        stack: 'r',
        barWidth: '46%',
        itemStyle: {
          color: rangeCol,
          opacity: 0.22,
          borderColor: rangeCol,
          borderWidth: 1,
          borderRadius: 3
        },
        data: span
      }];
      if (sCur) series.push({
        name: sCur.name || 'Current',
        type: 'scatter',
        symbol: 'circle',
        symbolSize: 12,
        z: 5,
        itemStyle: {
          color: t.palette.categorical[0]
        },
        data: pts(sCur)
      });
      if (sBen) series.push({
        name: sBen.name || 'Benchmark',
        type: 'scatter',
        symbol: 'diamond',
        symbolSize: 14,
        z: 6,
        itemStyle: {
          color: markCol,
          borderColor: '#fff',
          borderWidth: 1.5
        },
        label: {
          show: true,
          position: 'top',
          distance: 5,
          color: markCol,
          fontFamily: t.fonts.body,
          fontWeight: 700,
          fontSize: 11,
          formatter: function (p) {
            return fmtV(p.value[0]);
          }
        },
        data: pts(sBen)
      });
      var hasTitle = !!(d.meta.title || d.meta.subtitle),
        showLegend = !d.meta.hideLegend;
      var maxX = Math.max.apply(null, maxV.map(function (v) {
        return Number(v) || 0;
      }).concat([0]));
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        grid: {
          left: 78,
          right: 30,
          top: hasTitle ? 64 : 14,
          bottom: showLegend ? 38 : 14,
          containLabel: true
        },
        tooltip: {
          trigger: 'item'
        },
        legend: showLegend ? legendBlock(t, ['Tactical range'].concat(sCur ? [sCur.name || 'Current'] : []).concat(sBen ? [sBen.name || 'Benchmark'] : [])) : undefined,
        xAxis: Object.assign({
          type: 'value',
          min: 0,
          max: isPct ? null : Math.ceil(maxX * 1.12 / 5) * 5,
          name: d.meta.xLabel || '',
          axisLabel: {
            show: false
          },
          splitLine: {
            show: false
          }
        }, axisCommon(t), {
          axisTick: {
            show: false
          }
        }),
        yAxis: Object.assign({
          type: 'category',
          data: cats,
          name: d.meta.yLabel || '',
          inverse: true
        }, axisCommon(t), {
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            color: t.palette.ink,
            fontFamily: t.fonts.body,
            fontSize: 12,
            fontWeight: 600
          }
        }),
        series: series
      };
    },
    combo: function (d, t) {
      var xs = uniqueX(d.series),
        dual = d.series.length > 1;
      var series = d.series.map(function (s, i) {
        var col = colorFor(t, s, i),
          vals = seriesValuesAlongX(s, xs);
        if (i === 0) return {
          name: s.name,
          type: 'bar',
          yAxisIndex: 0,
          barMaxWidth: '46%',
          itemStyle: {
            color: col,
            borderRadius: [2, 2, 0, 0]
          },
          data: vals
        };
        return {
          name: s.name,
          type: 'line',
          yAxisIndex: dual ? 1 : 0,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2.4,
            color: col
          },
          itemStyle: {
            color: col
          },
          data: vals
        };
      });
      var yLeft = Object.assign({
        type: 'value',
        name: d.meta.yLabel || '',
        scale: true
      }, axisCommon(t));
      var yRight = Object.assign({
        type: 'value',
        name: d.meta.y2Label || '',
        scale: true
      }, axisCommon(t), {
        position: 'right',
        splitLine: {
          show: false
        }
      });
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        grid: {
          left: 48,
          right: dual ? 52 : 28,
          top: 70,
          bottom: 52,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: legendBlock(t, d.series.map(function (s) {
          return s.name;
        })),
        xAxis: Object.assign({
          type: 'category',
          boundaryGap: true,
          data: xs,
          name: d.meta.xLabel || ''
        }, axisCommon(t)),
        yAxis: dual ? [yLeft, yRight] : yLeft,
        series: series
      };
    },
    perfstack: function (d, t) {
      // Two stacked panels sharing ONE time axis: cumulative line on top, period bars below.
      var xs = uniqueX(d.series);
      var isLine = function (s) {
        return /cum|index|rebas|nav|line/i.test(s.name || '');
      };
      var lineS = d.series.find(isLine) || d.series[d.series.length - 1] || {
        name: 'Cumulative',
        points: []
      };
      var barS = d.series.find(function (s) {
        return s !== lineS;
      }) || d.series[0] || {
        name: 'Period',
        points: []
      };
      var lineCol = lineS.color || t.palette.negative;
      var barCol = barS.color || t.palette.ink;
      var hasTitle = !!(d.meta.title || d.meta.subtitle);
      var topY = hasTitle ? 64 : 24;
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: t.palette.ink
            }
          }
        },
        axisPointer: {
          link: [{
            xAxisIndex: 'all'
          }]
        },
        legend: legendBlock(t, [lineS.name, barS.name]),
        grid: [{
          left: 56,
          right: 50,
          top: topY,
          height: '44%',
          containLabel: true
        }, {
          left: 56,
          right: 50,
          top: '63%',
          bottom: 42,
          containLabel: true
        }],
        xAxis: [Object.assign({
          type: 'category',
          data: xs,
          boundaryGap: true,
          gridIndex: 0,
          name: ''
        }, axisCommon(t)), Object.assign({
          type: 'category',
          data: xs,
          boundaryGap: true,
          gridIndex: 1,
          name: ''
        }, axisCommon(t), {
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          }
        })],
        yAxis: [Object.assign({
          type: 'value',
          gridIndex: 0,
          name: d.meta.y2Label || 'Index',
          scale: true
        }, axisCommon(t)), Object.assign({
          type: 'value',
          gridIndex: 1,
          name: d.meta.yLabel || 'Annual %'
        }, axisCommon(t))],
        series: [{
          name: lineS.name,
          type: 'line',
          xAxisIndex: 0,
          yAxisIndex: 0,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2.6,
            color: lineCol
          },
          itemStyle: {
            color: lineCol
          },
          areaStyle: {
            color: lineCol,
            opacity: 0.07
          },
          data: seriesValuesAlongX(lineS, xs)
        }, {
          name: barS.name,
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          barMaxWidth: '52%',
          itemStyle: {
            color: barCol,
            borderRadius: [2, 2, 0, 0]
          },
          data: seriesValuesAlongX(barS, xs)
        }]
      };
    },
    perfstackmulti: function (d, t) {
      // Same two-panel layout as perfstack but with N currency series:
      // N cumulative LINES on top, N period BARS (grouped) below, one colour per
      // currency shared by its line + bars. meta.nCcy = how many series are lines.
      var xs = uniqueX(d.series);
      var n = d.meta && d.meta.nCcy || Math.ceil(d.series.length / 2);
      var lines = d.series.slice(0, n),
        bars = d.series.slice(n);
      var hasTitle = !!(d.meta.title || d.meta.subtitle);
      var topY = hasTitle ? 64 : 24;
      var col = function (i) {
        return t.palette.categorical[i % t.palette.categorical.length];
      };
      var lineSeries = lines.map(function (s, i) {
        var c = s.color || col(i);
        return {
          name: s.name,
          type: 'line',
          xAxisIndex: 0,
          yAxisIndex: 0,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2.4,
            color: c
          },
          itemStyle: {
            color: c
          },
          data: seriesValuesAlongX(s, xs)
        };
      });
      var barSeries = bars.map(function (s, i) {
        var c = s.color || col(i);
        return {
          name: s.name,
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          barMaxWidth: 13,
          barGap: '15%',
          itemStyle: {
            color: c,
            borderRadius: [2, 2, 0, 0]
          },
          data: seriesValuesAlongX(s, xs)
        };
      });
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: t.palette.ink
            }
          }
        },
        axisPointer: {
          link: [{
            xAxisIndex: 'all'
          }]
        },
        legend: legendBlock(t, lines.map(function (s) {
          return s.name;
        })),
        grid: [{
          left: 56,
          right: 50,
          top: topY,
          height: '44%',
          containLabel: true
        }, {
          left: 56,
          right: 50,
          top: '63%',
          bottom: 42,
          containLabel: true
        }],
        xAxis: [Object.assign({
          type: 'category',
          data: xs,
          boundaryGap: true,
          gridIndex: 0,
          name: ''
        }, axisCommon(t)), Object.assign({
          type: 'category',
          data: xs,
          boundaryGap: true,
          gridIndex: 1,
          name: ''
        }, axisCommon(t), {
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          }
        })],
        yAxis: [Object.assign({
          type: 'value',
          gridIndex: 0,
          name: d.meta.y2Label || 'Index',
          scale: true
        }, axisCommon(t)), Object.assign({
          type: 'value',
          gridIndex: 1,
          name: d.meta.yLabel || 'Annual %'
        }, axisCommon(t))],
        series: lineSeries.concat(barSeries)
      };
    },
    scatter: function (d, t) {
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        grid: gridBlock(),
        tooltip: {
          trigger: 'item',
          formatter: function (p) {
            return p.seriesName + '<br/>' + (d.meta.xLabel || 'x') + ': ' + p.value[0] + '<br/>' + (d.meta.yLabel || 'y') + ': ' + p.value[1];
          }
        },
        legend: legendBlock(t, d.series.map(function (s) {
          return s.name;
        })),
        xAxis: Object.assign({
          type: 'value',
          scale: true,
          name: d.meta.xLabel || ''
        }, axisCommon(t)),
        yAxis: Object.assign({
          type: 'value',
          scale: true,
          name: d.meta.yLabel || ''
        }, axisCommon(t)),
        series: d.series.map(function (s, i) {
          return {
            name: s.name,
            type: 'scatter',
            symbolSize: 16,
            itemStyle: {
              color: colorFor(t, s, i)
            },
            label: {
              show: true,
              position: 'top',
              formatter: s.name,
              color: t.palette.ink,
              fontFamily: t.fonts.body,
              fontSize: 11
            },
            data: s.points.map(function (p) {
              return [Number(p.x), Number(p.y)];
            })
          };
        })
      };
    },
    heatmap: function (d, t) {
      var rows = d.series.map(function (s) {
        return s.name;
      });
      var cols = d.series.length ? d.series[0].points.map(function (p) {
        return String(p.x);
      }) : [];
      var vals = [],
        min = Infinity,
        max = -Infinity;
      d.series.forEach(function (s, r) {
        s.points.forEach(function (p) {
          var c = cols.indexOf(String(p.x));
          if (c < 0) return;
          var v = Number(p.y);
          min = Math.min(min, v);
          max = Math.max(max, v);
          vals.push([c, r, v]);
        });
      });
      if (!isFinite(min)) {
        min = 0;
        max = 1;
      }
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        grid: {
          left: 70,
          right: 28,
          top: 70,
          bottom: 72,
          containLabel: true
        },
        tooltip: {
          position: 'top'
        },
        xAxis: Object.assign({
          type: 'category',
          data: cols,
          splitArea: {
            show: true
          }
        }, axisCommon(t)),
        yAxis: Object.assign({
          type: 'category',
          data: rows,
          splitArea: {
            show: true
          }
        }, axisCommon(t)),
        visualMap: {
          min: min,
          max: max,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: 6,
          inRange: {
            color: [t.palette.sequential[0], t.palette.sequential[t.palette.sequential.length - 1]]
          },
          textStyle: {
            color: t.palette.ink
          }
        },
        series: [{
          type: 'heatmap',
          data: vals,
          label: {
            show: true,
            color: t.palette.ink,
            formatter: function (p) {
              return Math.round(p.value[2] * 100) / 100;
            }
          }
        }]
      };
    },
    histogram: function (d, t) {
      var s = d.series[0] || {
          points: []
        },
        ys = s.points.map(function (p) {
          return Number(p.y);
        }).filter(function (v) {
          return !isNaN(v);
        });
      var bins = 12,
        min = Math.min.apply(null, ys),
        max = Math.max.apply(null, ys);
      if (!isFinite(min)) {
        min = 0;
        max = 1;
      }
      if (min === max) max = min + 1;
      var w = (max - min) / bins,
        counts = new Array(bins).fill(0);
      ys.forEach(function (v) {
        var b = Math.floor((v - min) / w);
        if (b >= bins) b = bins - 1;
        if (b < 0) b = 0;
        counts[b]++;
      });
      var labels = counts.map(function (_, i) {
        return (Math.round((min + i * w) * 10) / 10).toString();
      });
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        grid: gridBlock(),
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: Object.assign({
          type: 'category',
          data: labels,
          name: d.meta.xLabel || ''
        }, axisCommon(t)),
        yAxis: Object.assign({
          type: 'value',
          name: d.meta.yLabel || 'Frequency'
        }, axisCommon(t)),
        series: [{
          name: 'Frequency',
          type: 'bar',
          barCategoryGap: '2%',
          itemStyle: {
            color: t.palette.categorical[0]
          },
          data: counts
        }]
      };
    },
    boxplot: function (d, t) {
      var names = d.series.map(function (s) {
        return s.name;
      });
      var boxData = d.series.map(function (s) {
        var arr = s.points.map(function (p) {
          return Number(p.y);
        }).filter(function (v) {
          return !isNaN(v);
        }).sort(function (a, b) {
          return a - b;
        });
        var q = function (p) {
          if (!arr.length) return 0;
          var idx = (arr.length - 1) * p,
            lo = Math.floor(idx),
            hi = Math.ceil(idx);
          return arr[lo] + (arr[hi] - arr[lo]) * (idx - lo);
        };
        return [arr[0] || 0, q(0.25), q(0.5), q(0.75), arr[arr.length - 1] || 0];
      });
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        grid: gridBlock(),
        tooltip: {
          trigger: 'item'
        },
        xAxis: Object.assign({
          type: 'category',
          data: names,
          name: d.meta.xLabel || ''
        }, axisCommon(t)),
        yAxis: Object.assign({
          type: 'value',
          scale: true,
          name: d.meta.yLabel || ''
        }, axisCommon(t)),
        series: [{
          type: 'boxplot',
          itemStyle: {
            color: t.palette.categorical[0],
            borderColor: t.palette.ink
          },
          data: boxData
        }]
      };
    },
    candlestick: function (d, t) {
      var s = d.series[0] || {
          points: []
        },
        xs = s.points.map(function (p) {
          return String(p.x);
        });
      var k = s.points.map(function (p, i, arr) {
        var y = Number(p.y),
          prev = i > 0 ? Number(arr[i - 1].y) : y;
        var open = prev,
          close = y;
        return [open, close, Math.min(open, close) * 0.99, Math.max(open, close) * 1.01];
      });
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        grid: gridBlock(),
        tooltip: {
          trigger: 'axis'
        },
        xAxis: Object.assign({
          type: 'category',
          data: xs,
          name: d.meta.xLabel || ''
        }, axisCommon(t)),
        yAxis: Object.assign({
          type: 'value',
          scale: true,
          name: d.meta.yLabel || ''
        }, axisCommon(t)),
        series: [{
          type: 'candlestick',
          data: k,
          itemStyle: {
            color: t.palette.positive,
            color0: t.palette.negative,
            borderColor: t.palette.positive,
            borderColor0: t.palette.negative
          }
        }]
      };
    },
    waterfall: function (d, t) {
      var s = d.series[0] || {
          points: []
        },
        cats = s.points.map(function (p) {
          return String(p.x);
        });
      var base = [],
        rise = [],
        fall = [],
        cum = 0;
      s.points.forEach(function (p, i) {
        var v = Number(p.y) || 0;
        if (i === 0) {
          base.push(0);
          rise.push(v >= 0 ? v : 0);
          fall.push(v < 0 ? -v : 0);
          cum = v;
          return;
        }
        if (v >= 0) {
          base.push(cum);
          rise.push(v);
          fall.push('-');
          cum += v;
        } else {
          cum += v;
          base.push(cum);
          rise.push('-');
          fall.push(-v);
        }
      });
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        grid: gridBlock(),
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: Object.assign({
          type: 'category',
          data: cats,
          name: d.meta.xLabel || ''
        }, axisCommon(t)),
        yAxis: Object.assign({
          type: 'value',
          name: d.meta.yLabel || ''
        }, axisCommon(t)),
        series: [{
          type: 'bar',
          stack: 'wf',
          itemStyle: {
            color: 'transparent'
          },
          emphasis: {
            itemStyle: {
              color: 'transparent'
            }
          },
          data: base
        }, {
          name: 'Increase',
          type: 'bar',
          stack: 'wf',
          itemStyle: {
            color: t.palette.positive
          },
          data: rise
        }, {
          name: 'Decrease',
          type: 'bar',
          stack: 'wf',
          itemStyle: {
            color: t.palette.negative
          },
          data: fall
        }]
      };
    },
    fan: function (d, t) {
      var xs = uniqueX(d.series),
        find = function (re) {
          return d.series.find(function (s) {
            return re.test((s.name || '').toLowerCase());
          });
        };
      var central = find(/centr|base|mid/) || d.series[0],
        low = find(/low|min|down/) || d.series[1],
        high = find(/high|max|up/) || d.series[2];
      var series = [];
      if (low && high) {
        var lowV = seriesValuesAlongX(low, xs),
          highV = seriesValuesAlongX(high, xs);
        series.push({
          name: '__low',
          type: 'line',
          stack: 'band',
          symbol: 'none',
          lineStyle: {
            opacity: 0
          },
          areaStyle: {
            opacity: 0
          },
          data: lowV,
          silent: true
        });
        series.push({
          name: 'Band',
          type: 'line',
          stack: 'band',
          symbol: 'none',
          lineStyle: {
            opacity: 0
          },
          areaStyle: {
            color: t.palette.categorical[0],
            opacity: 0.16
          },
          data: highV.map(function (v, i) {
            return v == null || lowV[i] == null ? null : v - lowV[i];
          })
        });
      }
      if (central) series.push({
        name: central.name,
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 2.6,
          color: t.palette.categorical[0]
        },
        itemStyle: {
          color: t.palette.categorical[0]
        },
        data: seriesValuesAlongX(central, xs)
      });
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        grid: gridBlock(),
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['Band', central ? central.name : ''].filter(Boolean),
          bottom: 4,
          textStyle: {
            color: t.palette.ink,
            fontFamily: t.fonts.body
          }
        },
        xAxis: Object.assign({
          type: 'category',
          data: xs,
          name: d.meta.xLabel || ''
        }, axisCommon(t)),
        yAxis: Object.assign({
          type: 'value',
          scale: true,
          name: d.meta.yLabel || ''
        }, axisCommon(t)),
        series: series
      };
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
    return {
      type: d.type || 'line',
      meta: newMeta(d.meta),
      series: (d.series || []).map(function (s) {
        return {
          name: s.name || 'Series',
          color: s.color || null,
          points: (s.points || []).slice()
        };
      })
    };
  }

  /* ---------------- TSV / table <-> spec ---------------- */
  // Category table: first column = X, each next column a series. Returns {headers, rows}.
  function specToTable(spec) {
    var d = normalize(spec),
      xs = uniqueX(d.series);
    var headers = ['X'].concat(d.series.map(function (s) {
      return s.name;
    }));
    var rows = xs.map(function (x) {
      var row = [String(x)];
      d.series.forEach(function (s) {
        var v = seriesValuesAlongX(s, [x])[0];
        row.push(v == null ? '' : v);
      });
      return row;
    });
    return {
      headers: headers,
      rows: rows
    };
  }
  function tableToSpec(spec, headers, rows) {
    var d = normalize(spec);
    var nSeries = headers.length - 1;
    var series = [];
    for (var c = 0; c < nSeries; c++) {
      var old = d.series[c] || {};
      series.push({
        name: headers[c + 1] || 'Series ' + (c + 1),
        color: old.color || null,
        points: rows.filter(function (r) {
          return String(r[0]).trim() !== '';
        }).map(function (r) {
          var raw = r[c + 1];
          var num = parseFloat(String(raw).replace(',', '.'));
          var xv = r[0];
          var xn = parseFloat(xv);
          var x = String(xv).trim() !== '' && !isNaN(xn) && String(xn) === String(xv).trim() ? xn : xv;
          return {
            x: x,
            y: raw === '' || raw == null || isNaN(num) ? null : num
          };
        })
      });
    }
    return {
      type: d.type,
      meta: d.meta,
      series: series
    };
  }
  function parseTSV(text) {
    var lines = String(text).replace(/\r/g, '').split('\n').filter(function (l) {
      return l.trim() !== '';
    });
    if (!lines.length) return {
      headers: ['X', 'Series 1'],
      rows: []
    };
    var delim = lines[0].indexOf('\t') >= 0 ? '\t' : lines[0].indexOf(';') >= 0 ? ';' : ',';
    var grid = lines.map(function (l) {
      return l.split(delim).map(function (c) {
        return c.trim();
      });
    });
    return {
      headers: grid[0],
      rows: grid.slice(1)
    };
  }
  function tableToTSV(headers, rows) {
    return [headers.join('\t')].concat(rows.map(function (r) {
      return r.join('\t');
    })).join('\n');
  }
  window.LFAChartEngine = {
    THEMES: THEMES,
    CHART_CATALOG: CHART_CATALOG,
    CHART_META: CHART_META,
    isHierarchical: isHierarchical,
    buildOption: buildOption,
    normalize: normalize,
    newMeta: newMeta,
    specToTable: specToTable,
    tableToSpec: tableToSpec,
    parseTSV: parseTSV,
    tableToTSV: tableToTSV
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "charts/lfa-chart-engine.js", error: String((e && e.message) || e) }); }

// charts/lfa-chart-lite.js
try { (() => {
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
    lfa: {
      ink: '#23366E',
      grid: '#E0E4EB',
      axis: '#8C95B2',
      neg: '#C24A5E',
      pos: '#3E7C72',
      font: "'Mulish','Helvetica Neue',Arial,sans-serif",
      cat: ['#23366E', '#C24A5E', '#3E7C72', '#B0852F', '#6B5B95', '#5A6678', '#9C2D3A', '#3C6E8F']
    },
    'lfg-zest': {
      ink: '#4A0C18',
      grid: '#ECE8E2',
      axis: '#A39B90',
      neg: '#9E2A36',
      pos: '#3F7A5A',
      font: "'Raleway','Helvetica Neue',Arial,sans-serif",
      cat: ['#83021A', '#B0852F', '#5A626B', '#3E6E66', '#A65A3A', '#7C5466', '#9E2A36', '#5A0B14']
    },
    neutro: {
      ink: '#1f2933',
      grid: '#e4e7eb',
      axis: '#9aa5b1',
      neg: '#a14b4b',
      pos: '#3f7d6e',
      font: "'Inter',system-ui,sans-serif",
      cat: ['#2b5d8c', '#c08a3e', '#3f7d6e', '#8c5a7c', '#6b7280', '#a14b4b']
    }
  };
  window.LFA_CHART_SPECS = window.LFA_CHART_SPECS || {};

  /* ---------- data helpers ---------- */
  function normalize(spec) {
    var d = spec || {};
    return {
      type: d.type || 'line',
      meta: d.meta || {},
      series: (d.series || []).map(function (s) {
        return {
          name: s.name || 'Series',
          color: s.color || null,
          points: (s.points || []).slice()
        };
      })
    };
  }
  function uniqueX(series) {
    var xs = [],
      seen = {};
    series.forEach(function (s) {
      (s.points || []).forEach(function (p) {
        var k = String(p.x);
        if (!seen[k]) {
          seen[k] = 1;
          xs.push(p.x);
        }
      });
    });
    return xs;
  }
  function along(s, xs) {
    var m = {};
    (s && s.points || []).forEach(function (p) {
      m[String(p.x)] = p.y;
    });
    return xs.map(function (x) {
      var v = m[String(x)];
      return v === undefined ? null : v;
    });
  }
  function niceStep(raw) {
    if (raw <= 0) return 1;
    var p = Math.pow(10, Math.floor(Math.log10(raw)));
    var f = raw / p;
    var nf = f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10;
    return nf * p;
  }
  function niceCeil(v) {
    if (v <= 0) return 1;
    var step = niceStep(v / 4);
    return Math.ceil(v / step) * step;
  }
  function ticks(min, max, n) {
    n = n || 4;
    if (min === max) max = min + 1;
    var step = niceStep((max - min) / n);
    var start = Math.ceil(min / step) * step;
    var out = [];
    for (var v = start; v <= max + 1e-9; v += step) out.push(Math.round(v * 1e6) / 1e6);
    if (!out.length) out.push(min);
    return out;
  }

  /* ---------- svg string helpers ---------- */
  var _font = THEMES.lfa.font;
  function r2(n) {
    return Math.round(n * 100) / 100;
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function fmtTick(v) {
    var r = Math.round(v * 10) / 10;
    return r === Math.round(r) ? String(Math.round(r)) : r.toFixed(1);
  }
  function ln(x1, y1, x2, y2, c, w) {
    return '<line x1="' + r2(x1) + '" y1="' + r2(y1) + '" x2="' + r2(x2) + '" y2="' + r2(y2) + '" stroke="' + c + '" stroke-width="' + (w || 1) + '"/>';
  }
  function rect(x, y, w, h, c, rad, opts) {
    return '<rect x="' + r2(x) + '" y="' + r2(y) + '" width="' + r2(Math.max(0, w)) + '" height="' + r2(Math.max(0, h)) + '" rx="' + (rad || 0) + '" fill="' + c + '"' + (opts || '') + '/>';
  }
  function txt(x, y, str, c, anchor, size, weight) {
    return '<text x="' + r2(x) + '" y="' + r2(y) + '" fill="' + c + '" font-family="' + _font + '" font-size="' + (size || 11) + '" font-weight="' + (weight || 400) + '" text-anchor="' + (anchor || 'start') + '">' + esc(str) + '</text>';
  }
  function approxW(s, size) {
    return String(s).length * (size || 11) * 0.58;
  }
  function toHex(c) {
    if (!c) return '#83021A';
    c = String(c).trim();
    if (/^#[0-9a-f]{6}$/i.test(c)) return c;
    if (/^#[0-9a-f]{3}$/i.test(c)) return '#' + c[1] + c[1] + c[2] + c[2] + c[3] + c[3];
    var m = c.match(/\d+(\.\d+)?/g);
    if (m && m.length >= 3) return '#' + m.slice(0, 3).map(function (n) {
      return ('0' + Math.round(+n).toString(16)).slice(-2);
    }).join('');
    return '#83021A';
  }
  function legend(items, x, y, t) {
    var out = '',
      cx = x;
    items.forEach(function (it) {
      out += rect(cx, y, 11, 11, it.color, 2);
      out += txt(cx + 15, y + 10, it.name, t.ink, 'start', 11, 600);
      cx += 15 + approxW(it.name, 11) + 18;
    });
    return out;
  }
  function wrap(W, H, inner) {
    return '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" style="display:block">' + inner + '</svg>';
  }

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
    var xs = uniqueX(d.series),
      nc = xs.length,
      ns = d.series.length,
      multi = ns > 1;
    var mat = d.series.map(function (s) {
      return along(s, xs);
    });
    var maxV = 0,
      minV = 0;
    mat.forEach(function (r) {
      r.forEach(function (v) {
        if (v != null) {
          if (v > maxV) maxV = v;
          if (v < minV) minV = v;
        }
      });
    });
    if (maxV === 0 && minV === 0) maxV = 1;
    var s = [],
      legendH = multi ? 22 : 0;
    if (horizontal) {
      var padL = 96,
        padR = 46,
        padT = 8 + legendH,
        padB = 22;
      var pW = Math.max(10, W - padL - padR),
        pH = Math.max(10, H - padT - padB);
      var xmax = niceCeil(maxV),
        sx = function (v) {
          return padL + v / xmax * pW;
        };
      ticks(0, xmax, 4).forEach(function (tk) {
        var x = sx(tk);
        s.push(ln(x, padT, x, padT + pH, t.grid));
        s.push(txt(x, padT + pH + 13, fmtTick(tk), t.axis, 'middle', 10));
      });
      var band = pH / Math.max(1, nc);
      for (var i = 0; i < nc; i++) {
        var yTop = padT + i * band;
        s.push(txt(padL - 8, yTop + band / 2 + 4, String(xs[i]), t.ink, 'end', 11.5, 600));
        var inner = Math.min(band * 0.66, 64),
          gap = ns > 1 ? inner * 0.16 : 0,
          bh = (inner - gap * (ns - 1)) / ns,
          y0 = yTop + (band - inner) / 2;
        for (var j = 0; j < ns; j++) {
          var v = mat[j][i];
          if (v == null) continue;
          var col = d.series[j].color || t.cat[j % t.cat.length],
            by = y0 + j * (bh + gap);
          s.push(rect(sx(0), by, sx(v) - sx(0), bh, col, 3));
          if (v !== 0 && v != null) s.push(txt(sx(v) + 5, by + bh / 2 + 4, fmtTick(v), t.ink, 'start', 10.5, 600));
        }
      }
    } else {
      var padL2 = 44,
        padR2 = 16,
        padT2 = 8 + legendH,
        padB2 = 38;
      var pW2 = Math.max(10, W - padL2 - padR2),
        pH2 = Math.max(10, H - padT2 - padB2);
      var ymax = niceCeil(maxV),
        ymin = minV < 0 ? -niceCeil(-minV) : 0;
      if (ymax === ymin) ymax = ymin + 1;
      var sy = function (v) {
        return padT2 + pH2 - (v - ymin) / (ymax - ymin) * pH2;
      };
      ticks(ymin, ymax, 4).forEach(function (tk) {
        var y = sy(tk);
        s.push(ln(padL2, y, padL2 + pW2, y, t.grid));
        s.push(txt(padL2 - 6, y + 4, fmtTick(tk), t.axis, 'end', 10));
      });
      var band2 = pW2 / Math.max(1, nc);
      for (var i2 = 0; i2 < nc; i2++) {
        var xL = padL2 + i2 * band2;
        s.push(txt(xL + band2 / 2, padT2 + pH2 + 15, String(xs[i2]), t.ink, 'middle', 11));
        var inner2 = band2 * 0.64,
          gap2 = ns > 1 ? inner2 * 0.12 : 0,
          bw2 = (inner2 - gap2 * (ns - 1)) / ns,
          x0 = xL + (band2 - inner2) / 2;
        for (var j2 = 0; j2 < ns; j2++) {
          var v2 = mat[j2][i2];
          if (v2 == null) continue;
          var c2 = d.series[j2].color || t.cat[j2 % t.cat.length],
            yv = sy(v2),
            yz = sy(0);
          s.push(rect(x0 + j2 * (bw2 + gap2), Math.min(yv, yz), bw2, Math.abs(yv - yz), c2, 2));
        }
      }
    }
    if (multi) s.push(legend(d.series.map(function (ss, i) {
      return {
        name: ss.name,
        color: ss.color || t.cat[i % t.cat.length]
      };
    }), 6, 4, t));
    return wrap(W, H, s.join(''));
  }
  function rangeSVG(d, t, W, H) {
    var find = function (re) {
      return d.series.filter(function (s) {
        return re.test((s.name || '').toLowerCase());
      })[0];
    };
    var sMin = find(/min/) || d.series[0],
      sMax = find(/max/) || d.series[1],
      sBen = find(/bench|saa|target|strateg/) || d.series[2];
    var cats = (sMin || {
      points: []
    }).points.map(function (p) {
      return String(p.x);
    });
    var minV = along(sMin, cats),
      maxV = along(sMax, cats),
      benV = along(sBen, cats);
    var maxAll = 0;
    maxV.concat(benV).forEach(function (v) {
      if (v != null && v > maxAll) maxAll = v;
    });
    var xmax = niceCeil(maxAll || 1);
    var padL = 92,
      padR = 52,
      padT = 10,
      padB = 26;
    var pW = Math.max(10, W - padL - padR),
      pH = Math.max(10, H - padT - padB);
    var sx = function (v) {
      return padL + v / xmax * pW;
    };
    var s = [],
      nc = cats.length,
      band = pH / Math.max(1, nc);
    var rangeCol = sMin && sMin.color || t.cat[0],
      markCol = sBen && sBen.color || t.neg;
    // x-axis: 0 → max scale with gridlines + tick labels
    ticks(0, xmax, 4).forEach(function (tk) {
      var x = sx(tk);
      s.push(ln(x, padT, x, padT + pH, t.grid));
      s.push(txt(x, padT + pH + 14, fmtTick(tk) + '%', t.axis, 'middle', 9.5));
    });
    for (var i = 0; i < nc; i++) {
      var yC = padT + i * band + band / 2;
      s.push(txt(padL - 8, yC + 4, cats[i], t.ink, 'end', 11.5, 600));
      var mn = minV[i] || 0,
        mx = maxV[i] || 0,
        bh = Math.min(band * 0.46, 26);
      s.push('<rect x="' + r2(sx(mn)) + '" y="' + r2(yC - bh / 2) + '" width="' + r2(Math.max(2, sx(mx) - sx(mn))) + '" height="' + r2(bh) + '" rx="3" fill="' + rangeCol + '" fill-opacity="0.20" stroke="' + rangeCol + '" stroke-width="1"/>');
      if (benV[i] != null) {
        var bx = sx(benV[i]),
          dz = 7,
          lbl = fmtTick(benV[i]) + '%',
          lw = approxW(lbl, 10);
        s.push('<path d="M ' + r2(bx) + ' ' + r2(yC - dz) + ' L ' + r2(bx + dz) + ' ' + r2(yC) + ' L ' + r2(bx) + ' ' + r2(yC + dz) + ' L ' + r2(bx - dz) + ' ' + r2(yC) + ' Z" fill="' + markCol + '" stroke="#fff" stroke-width="1.5"/>');
        // SAA value beside the diamond (right by default, flip left if it would overflow)
        if (bx + dz + 4 + lw <= padL + pW + padR) s.push(txt(bx + dz + 4, yC + 4, lbl, markCol, 'start', 10, 700));else s.push(txt(bx - dz - 4, yC + 4, lbl, markCol, 'end', 10, 700));
      }
    }
    return wrap(W, H, s.join(''));
  }
  function perfSVG(d, t, W, H) {
    var xs = uniqueX(d.series);
    var lines, bars;
    if (d.type === 'perfstackmulti') {
      var n = d.meta && d.meta.nCcy || Math.ceil(d.series.length / 2);
      lines = d.series.slice(0, n);
      bars = d.series.slice(n);
    } else {
      var isL = function (s) {
        return /cum|index|rebas|nav|line/i.test(s.name || '');
      };
      var L = d.series.filter(isL)[0] || d.series[d.series.length - 1] || {
        points: []
      };
      lines = [L];
      bars = d.series.filter(function (s) {
        return s !== L;
      });
    }
    var s = [];
    var legendItems = lines.map(function (ss, i) {
      return {
        name: ss.name,
        color: ss.color || t.cat[i % t.cat.length]
      };
    });
    s.push(legend(legendItems, 46, 6, t));
    var padL = 46,
      padR = 46,
      padT = 24,
      legendH = 18,
      gap = 10,
      bottomH = 40;
    var pW = Math.max(10, W - padL - padR);
    var topY = padT + legendH,
      availH = Math.max(20, H - topY - bottomH - gap);
    var topH = availH * 0.62,
      botH = availH * 0.38,
      botY = topY + topH + gap;
    var nc = xs.length,
      xc = function (i) {
        return padL + (nc <= 1 ? pW / 2 : i / (nc - 1) * pW);
      };
    // top: lines
    var lmat = lines.map(function (ss) {
      return along(ss, xs);
    });
    var lmax = -Infinity,
      lmin = Infinity;
    lmat.forEach(function (r) {
      r.forEach(function (v) {
        if (v != null) {
          if (v > lmax) lmax = v;
          if (v < lmin) lmin = v;
        }
      });
    });
    if (!isFinite(lmax)) {
      lmax = 100;
      lmin = 100;
    }
    if (lmin === lmax) {
      lmin -= 1;
      lmax += 1;
    }
    var lp = (lmax - lmin) * 0.12 || 1,
      lo = lmin - lp,
      hi = lmax + lp;
    var syT = function (v) {
      return topY + topH - (v - lo) / (hi - lo) * topH;
    };
    ticks(lo, hi, 4).forEach(function (tk) {
      var y = syT(tk);
      s.push(ln(padL, y, padL + pW, y, t.grid));
      s.push(txt(padL - 6, y + 4, fmtTick(tk), t.axis, 'end', 9.5));
    });
    lines.forEach(function (ss, li) {
      var col = ss.color || t.cat[li % t.cat.length],
        vals = lmat[li],
        dp = '';
      vals.forEach(function (v, i) {
        if (v == null) return;
        dp += (dp ? 'L' : 'M') + r2(xc(i)) + ' ' + r2(syT(v)) + ' ';
      });
      if (dp) s.push('<path d="' + dp + '" fill="none" stroke="' + col + '" stroke-width="2.2" stroke-linejoin="round"/>');
    });
    // bottom: bars
    var bmat = bars.map(function (ss) {
      return along(ss, xs);
    });
    var bmax = 0,
      bmin = 0;
    bmat.forEach(function (r) {
      r.forEach(function (v) {
        if (v != null) {
          if (v > bmax) bmax = v;
          if (v < bmin) bmin = v;
        }
      });
    });
    if (bmax === 0 && bmin === 0) bmax = 1;
    var bymax = niceCeil(bmax),
      bymin = bmin < 0 ? -niceCeil(-bmin) : 0;
    if (bymax === bymin) bymax = bymin + 1;
    var syB = function (v) {
      return botY + botH - (v - bymin) / (bymax - bymin) * botH;
    };
    ticks(bymin, bymax, 3).forEach(function (tk) {
      var y = syB(tk);
      s.push(ln(padL, y, padL + pW, y, t.grid));
      s.push(txt(padL - 6, y + 4, fmtTick(tk), t.axis, 'end', 9.5));
    });
    var band = pW / Math.max(1, nc),
      nb = bars.length;
    for (var i = 0; i < nc; i++) {
      var xL = padL + i * band;
      s.push(txt(xL + band / 2, botY + botH + 14, String(xs[i]), t.ink, 'middle', 9.5));
      var inner = band * 0.6,
        g = nb > 1 ? inner * 0.12 : 0,
        bw = (inner - g * (nb - 1)) / nb,
        x0 = xL + (band - inner) / 2;
      for (var j = 0; j < nb; j++) {
        var v = bmat[j][i];
        if (v == null) continue;
        var col = bars[j].color || t.cat[j % t.cat.length],
          yv = syB(v),
          yz = syB(0);
        s.push(rect(x0 + j * (bw + g), Math.min(yv, yz), bw, Math.max(1, Math.abs(yv - yz)), col, 1));
        // value label above (or below, for negatives) each bar — shown when the bar is wide enough to be legible
        if (v !== 0 && bw >= 13) {
          var lyB = v >= 0 ? yv - 3 : yv + 9;
          s.push(txt(x0 + j * (bw + g) + bw / 2, lyB, fmtTick(v), t.ink, 'middle', 8, 600));
        }
      }
    }
    return wrap(W, H, s.join(''));
  }
  function lineSVG(d, t, W, H) {
    var xs = uniqueX(d.series),
      s = [],
      multi = d.series.length > 1,
      legendH = multi ? 20 : 0;
    var padL = 46,
      padR = 20,
      padT = 10 + legendH,
      padB = 26;
    var pW = Math.max(10, W - padL - padR),
      pH = Math.max(10, H - padT - padB);
    var mat = d.series.map(function (ss) {
      return along(ss, xs);
    });
    var mx = -Infinity,
      mn = Infinity;
    mat.forEach(function (r) {
      r.forEach(function (v) {
        if (v != null) {
          if (v > mx) mx = v;
          if (v < mn) mn = v;
        }
      });
    });
    if (!isFinite(mx)) {
      mx = 1;
      mn = 0;
    }
    if (mn === mx) {
      mn -= 1;
      mx += 1;
    }
    var pad = (mx - mn) * 0.1 || 1,
      lo = mn - pad,
      hi = mx + pad;
    var sy = function (v) {
      return padT + pH - (v - lo) / (hi - lo) * pH;
    };
    var nc = xs.length,
      xc = function (i) {
        return padL + (nc <= 1 ? pW / 2 : i / (nc - 1) * pW);
      };
    ticks(lo, hi, 4).forEach(function (tk) {
      var y = sy(tk);
      s.push(ln(padL, y, padL + pW, y, t.grid));
      s.push(txt(padL - 6, y + 4, fmtTick(tk), t.axis, 'end', 10));
    });
    for (var i = 0; i < nc; i += Math.ceil(nc / 8) || 1) s.push(txt(xc(i), padT + pH + 14, String(xs[i]), t.ink, 'middle', 10));
    d.series.forEach(function (ss, li) {
      var col = ss.color || t.cat[li % t.cat.length],
        vals = mat[li],
        dp = '';
      vals.forEach(function (v, i) {
        if (v == null) return;
        dp += (dp ? 'L' : 'M') + r2(xc(i)) + ' ' + r2(sy(v)) + ' ';
      });
      if (dp) s.push('<path d="' + dp + '" fill="none" stroke="' + col + '" stroke-width="2.4" stroke-linejoin="round"/>');
    });
    if (multi) s.push(legend(d.series.map(function (ss, i) {
      return {
        name: ss.name,
        color: ss.color || t.cat[i % t.cat.length]
      };
    }), 6, 4, t));
    return wrap(W, H, s.join(''));
  }

  /* ---------- overrides ---------- */
  function key(id) {
    return 'lfa-chart:' + id;
  }
  function loadOverride(id) {
    try {
      var s = localStorage.getItem(key(id));
      return s ? JSON.parse(s) : null;
    } catch (e) {
      return null;
    }
  }
  function saveOverride(id, spec) {
    try {
      localStorage.setItem(key(id), JSON.stringify(spec));
    } catch (e) {}
  }
  function clearOverride(id) {
    try {
      localStorage.removeItem(key(id));
    } catch (e) {}
  }

  /* ---------- <lfa-chart> element ---------- */
  function defineEl() {
    if (customElements.get('lfa-chart')) return;
    class El extends HTMLElement {
      static get observedAttributes() {
        return ['chart-id', 'theme', 'spec'];
      }
      connectedCallback() {
        this.style.display = 'block';
        this.style.position = 'relative';
        if (!this.style.width) this.style.width = '100%';
        this._mount = document.createElement('div');
        this._mount.style.cssText = 'position:absolute;inset:0;overflow:hidden;';
        this.appendChild(this._mount);
        var self = this;
        // hover toolbar: Colours (quick palette) + Edit (full editor)
        this._bar = document.createElement('div');
        this._bar.style.cssText = 'position:absolute;top:8px;right:8px;z-index:5;display:none;gap:6px;';
        function mkBtn(label, svg) {
          var b = document.createElement('button');
          b.type = 'button';
          b.innerHTML = svg + '<span style="margin-left:5px">' + label + '</span>';
          b.style.cssText = 'display:inline-flex;align-items:center;border:1px solid rgba(74,12,24,.18);background:rgba(255,255,255,.94);color:#83021A;font:600 10.5px/1 ' + THEMES.lfa.font + ';letter-spacing:.05em;text-transform:uppercase;padding:6px 10px;border-radius:6px;cursor:pointer;box-shadow:0 2px 8px rgba(26,42,85,.14);';
          return b;
        }
        this._colBtn = mkBtn('Colours', '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="6.5" cy="12" r="2.5"/><circle cx="17" cy="13" r="2.5"/><path d="M12 2a10 10 0 1 0 0 20 2 2 0 0 0 0-4 2 2 0 0 1 2-2h2a4 4 0 0 0 4-4 10 10 0 0 0-10-10Z"/></svg>');
        this._btn = mkBtn('Edit', '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>');
        this._colBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          self.openColours();
        });
        this._btn.addEventListener('click', function (e) {
          e.stopPropagation();
          if (self._cpop) {
            self._cpop.remove();
            self._cpop = null;
          }
          self.openEditor();
        });
        this._bar.appendChild(this._colBtn);
        this._bar.appendChild(this._btn);
        this.appendChild(this._bar);
        this.addEventListener('mouseenter', function () {
          if (window.LFA_CHART_EDIT !== false) self._bar.style.display = 'flex';
        });
        this.addEventListener('mouseleave', function () {
          self._bar.style.display = 'none';
        });
        this._ro = new ResizeObserver(function () {
          self.render();
        });
        this._ro.observe(this);
        requestAnimationFrame(function () {
          self.render();
        });
      }
      disconnectedCallback() {
        if (this._ro) this._ro.disconnect();
      }
      attributeChangedCallback() {
        if (this.isConnected) this.render();
      }
      themeName() {
        return this.getAttribute('theme') || 'lfa';
      }
      currentSpec() {
        var id = this.getAttribute('chart-id') || '';
        var ov = id ? loadOverride(id) : null;
        if (ov) return ov;
        if (this._inlineSpec) return this._inlineSpec;
        var attr = this.getAttribute('spec');
        if (attr) {
          try {
            this._inlineSpec = JSON.parse(attr);
            return this._inlineSpec;
          } catch (e) {}
        }
        if (id && window.LFA_CHART_SPECS[id]) return window.LFA_CHART_SPECS[id];
        return {
          type: 'barh',
          meta: {},
          series: [{
            name: 'Series',
            points: [{
              x: 'A',
              y: 1
            }, {
              x: 'B',
              y: 2
            }, {
              x: 'C',
              y: 3
            }]
          }]
        };
      }
      render() {
        if (!this._mount || !this.isConnected) return;
        var W = this.clientWidth || this._mount.clientWidth,
          H = this.clientHeight || this._mount.clientHeight;
        if (!W || !H) return;
        try {
          this._mount.innerHTML = buildSVG(this.currentSpec(), THEMES[this.themeName()] || THEMES.lfa, W, H);
        } catch (e) {
          console.warn('lfa-chart render', e);
        }
      }
      openEditor() {
        var self = this,
          id = this.getAttribute('chart-id') || '';
        openEditor(this.currentSpec(), this.themeName(), {
          hasOverride: !!(id && loadOverride(id)),
          onApply: function (spec) {
            if (id) saveOverride(id, spec);else self._inlineSpec = spec;
            self.render();
            self.dispatchEvent(new CustomEvent('chart-change', {
              bubbles: true,
              detail: {
                id: id,
                spec: spec
              }
            }));
          },
          onReset: function () {
            if (id) clearOverride(id);
            self._inlineSpec = null;
            self.render();
          }
        });
      }
      openColours() {
        var self = this,
          id = this.getAttribute('chart-id') || '';
        if (this._cpop) {
          this._cpop.remove();
          this._cpop = null;
          return;
        }
        var t = THEMES[this.themeName()] || THEMES.lfa;
        var spec = normalize(JSON.parse(JSON.stringify(this.currentSpec())));
        var colors = spec.series.map(function (s, i) {
          return s.color || t.cat[i % t.cat.length];
        });
        var pop = document.createElement('div');
        pop.style.cssText = 'position:absolute;top:40px;right:8px;z-index:6;background:#fff;border:1px solid rgba(74,12,24,.18);border-radius:9px;box-shadow:0 10px 30px rgba(26,42,85,.22);padding:11px 13px;width:212px;font:600 11px/1.3 ' + t.font + ';color:' + t.ink + ';';
        pop.addEventListener('click', function (e) {
          e.stopPropagation();
        });
        pop.innerHTML = '<div style="font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#999;margin-bottom:9px;">Colours</div>';
        function apply() {
          var out = {
            type: spec.type,
            meta: spec.meta,
            series: spec.series.map(function (s, i) {
              return {
                name: s.name,
                color: colors[i],
                points: s.points
              };
            })
          };
          if (id) saveOverride(id, out);else self._inlineSpec = out;
          self.render();
        }
        spec.series.forEach(function (s, i) {
          var row = document.createElement('div');
          row.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:7px;';
          var c = document.createElement('input');
          c.type = 'color';
          c.style.cssText = 'width:24px;height:24px;border:1px solid #ddd;border-radius:6px;padding:0;cursor:pointer;flex:none;';
          try {
            c.value = toHex(colors[i]);
          } catch (e) {}
          var lab = document.createElement('span');
          lab.textContent = s.name || 'Series ' + (i + 1);
          lab.style.cssText = 'flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
          c.addEventListener('input', function () {
            colors[i] = c.value;
            apply();
          });
          row.appendChild(c);
          row.appendChild(lab);
          pop.appendChild(row);
        });
        var reset = document.createElement('button');
        reset.textContent = 'Reset colours';
        reset.style.cssText = 'margin-top:4px;width:100%;border:1px solid #ddd;background:#fff;border-radius:6px;padding:6px;font:700 10.5px/1 ' + t.font + ';color:#54618C;cursor:pointer;';
        reset.addEventListener('click', function () {
          if (id) clearOverride(id);
          self._inlineSpec = null;
          self.render();
          pop.remove();
          self._cpop = null;
        });
        pop.appendChild(reset);
        this.appendChild(pop);
        this._cpop = pop;
      }
    }
    customElements.define('lfa-chart', El);
    window.LFAChart = {
      redrawAll: function () {
        document.querySelectorAll('lfa-chart').forEach(function (el) {
          el.render && el.render();
        });
      },
      THEMES: THEMES,
      buildSVG: buildSVG
    };
  }

  /* ---------- lightweight editor (no echarts; previews with the same SVG) ---------- */
  function elx(tag, css, html) {
    var e = document.createElement(tag);
    if (css) e.style.cssText = css;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function openEditor(spec, themeName, opts) {
    opts = opts || {};
    var t = THEMES[themeName] || THEMES.lfa;
    var work = normalize(JSON.parse(JSON.stringify(spec)));
    var TYPES = [['barh', 'Horizontal bars'], ['groupbar', 'Grouped bars'], ['rangebar', 'Range + marker'], ['perfstackmulti', 'Performance (lines+bars)'], ['perfstack', 'Performance (single)'], ['line', 'Line']];
    var xs = uniqueX(work.series);
    var names = work.series.map(function (s) {
      return s.name;
    });
    var colors = work.series.map(function (s, i) {
      return s.color || t.cat[i % t.cat.length];
    });
    var vals = work.series.map(function (s) {
      return along(s, xs);
    });
    var ov = elx('div', 'position:fixed;inset:0;z-index:99999;background:rgba(20,12,14,.5);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(3px);font-family:' + t.font + ';');
    var panel = elx('div', 'width:min(940px,95vw);height:min(640px,92vh);background:#fff;border-radius:12px;display:grid;grid-template-rows:auto 1fr auto;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.4);');
    ov.appendChild(panel);
    var head = elx('div', 'display:flex;align-items:center;gap:14px;padding:13px 18px;border-bottom:1px solid #eee;');
    head.appendChild(elx('div', 'font-weight:800;letter-spacing:.04em;color:' + t.ink + ';', 'Chart editor'));
    var typeSel = elx('select', 'border:1px solid #ddd;border-radius:7px;padding:6px 9px;font:inherit;color:' + t.ink + ';');
    TYPES.forEach(function (tp) {
      var o = document.createElement('option');
      o.value = tp[0];
      o.textContent = tp[1];
      typeSel.appendChild(o);
    });
    typeSel.value = work.type;
    head.appendChild(typeSel);
    head.appendChild(elx('div', 'flex:1;'));
    panel.appendChild(head);
    var body = elx('div', 'display:grid;grid-template-columns:1fr 1fr;overflow:hidden;');
    var left = elx('div', 'overflow:auto;padding:16px;border-right:1px solid #eee;');
    var right = elx('div', 'display:flex;flex-direction:column;background:#faf8f5;');
    body.appendChild(left);
    body.appendChild(right);
    panel.appendChild(body);
    var pvCard = elx('div', 'flex:1;margin:16px;background:#fff;border:1px solid #eee;border-radius:8px;position:relative;overflow:hidden;');
    var pvMount = elx('div', 'position:absolute;inset:12px;');
    pvCard.appendChild(pvMount);
    right.appendChild(pvCard);

    // series header (name + colour)
    left.appendChild(elx('div', 'font-size:10.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#999;margin-bottom:8px;', 'Series & colours'));
    var sHost = elx('div', 'display:flex;flex-direction:column;gap:7px;margin-bottom:16px;');
    left.appendChild(sHost);
    left.appendChild(elx('div', 'font-size:10.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#999;margin-bottom:8px;', 'Values'));
    var tHost = elx('div', 'border:1px solid #eee;border-radius:8px;overflow:auto;max-height:260px;');
    left.appendChild(tHost);
    function num(v) {
      var n = parseFloat(String(v).replace(',', '.'));
      return isNaN(n) ? null : n;
    }
    function draw() {
      var W = pvCard.clientWidth - 24,
        H = pvCard.clientHeight - 24;
      pvMount.innerHTML = buildSVG(toSpec(), t, Math.max(40, W), Math.max(40, H));
    }
    function toSpec() {
      return {
        type: typeSel.value,
        meta: work.meta,
        series: names.map(function (nm, si) {
          return {
            name: nm,
            color: colors[si],
            points: xs.map(function (x, xi) {
              return {
                x: x,
                y: vals[si][xi]
              };
            })
          };
        })
      };
    }
    function rebuildSeries() {
      sHost.innerHTML = '';
      names.forEach(function (nm, si) {
        var row = elx('div', 'display:flex;align-items:center;gap:8px;');
        var c = elx('input', 'width:26px;height:26px;border:1px solid #ddd;border-radius:6px;padding:0;cursor:pointer;flex:none;');
        c.type = 'color';
        try {
          c.value = /^#[0-9a-f]{6}$/i.test(colors[si]) ? colors[si] : '#83021A';
        } catch (e) {}
        c.addEventListener('input', function () {
          colors[si] = c.value;
          draw();
        });
        var n = elx('input', 'flex:1;border:1px solid #ddd;border-radius:6px;padding:6px 9px;font:inherit;');
        n.value = nm;
        n.addEventListener('input', function () {
          names[si] = n.value;
          draw();
        });
        row.appendChild(c);
        row.appendChild(n);
        sHost.appendChild(row);
      });
    }
    function rebuildTable() {
      tHost.innerHTML = '';
      var tbl = elx('table', 'border-collapse:collapse;width:100%;font-size:12px;');
      var thr = elx('tr');
      thr.appendChild(elx('th', 'padding:6px 8px;border:1px solid #eee;background:#faf8f5;text-align:left;font-size:10px;text-transform:uppercase;color:#999;', 'X'));
      names.forEach(function (nm) {
        thr.appendChild(elx('th', 'padding:6px 8px;border:1px solid #eee;background:#faf8f5;text-align:right;font-size:10px;text-transform:uppercase;color:#999;', esc(nm)));
      });
      tbl.appendChild(thr);
      xs.forEach(function (x, xi) {
        var tr = elx('tr');
        var xc = elx('td', 'border:1px solid #eee;');
        var xin = elx('input', 'width:100%;border:0;padding:6px 8px;font:600 12px/1 ' + t.font + ';');
        xin.value = x;
        xin.addEventListener('input', function () {
          xs[xi] = xin.value;
          draw();
        });
        xc.appendChild(xin);
        tr.appendChild(xc);
        names.forEach(function (nm, si) {
          var td = elx('td', 'border:1px solid #eee;');
          var inp = elx('input', 'width:100%;border:0;padding:6px 8px;text-align:right;font:400 12px/1 ui-monospace,monospace;');
          inp.value = vals[si][xi] == null ? '' : vals[si][xi];
          inp.addEventListener('input', function () {
            vals[si][xi] = num(inp.value);
            draw();
          });
          td.appendChild(inp);
          tr.appendChild(td);
        });
        tbl.appendChild(tr);
      });
      tHost.appendChild(tbl);
    }
    var foot = elx('div', 'display:flex;align-items:center;gap:10px;padding:12px 18px;border-top:1px solid #eee;');
    var resetB = elx('button', btn('ghost', t), 'Reset to data');
    if (!opts.hasOverride) resetB.style.opacity = '.45';
    foot.appendChild(resetB);
    foot.appendChild(elx('div', 'flex:1;'));
    var cancelB = elx('button', btn('ghost', t), 'Cancel');
    var applyB = elx('button', btn('primary', t), 'Apply');
    foot.appendChild(cancelB);
    foot.appendChild(applyB);
    panel.appendChild(foot);
    document.body.appendChild(ov);
    typeSel.addEventListener('change', function () {
      draw();
    });
    function close() {
      ov.remove();
    }
    cancelB.addEventListener('click', close);
    ov.addEventListener('mousedown', function (e) {
      if (e.target === ov) close();
    });
    document.addEventListener('keydown', function k(e) {
      if (e.key === 'Escape') {
        close();
        document.removeEventListener('keydown', k);
      }
    });
    resetB.addEventListener('click', function () {
      if (!opts.hasOverride) return;
      if (opts.onReset) opts.onReset();
      close();
    });
    applyB.addEventListener('click', function () {
      if (opts.onApply) opts.onApply(toSpec());
      close();
    });
    rebuildSeries();
    rebuildTable();
    new ResizeObserver(function () {
      draw();
    }).observe(pvCard);
    requestAnimationFrame(draw);
  }
  function btn(kind, t) {
    var base = 'border-radius:7px;padding:8px 15px;font:700 12px/1 ' + t.font + ';cursor:pointer;border:1px solid #ddd;';
    if (kind === 'primary') return base + 'background:' + t.cat[0] + ';border-color:' + t.cat[0] + ';color:#fff;';
    return base + 'background:#fff;color:' + t.ink + ';';
  }
  window.LFAChartStudio = {
    openEditor: function (spec, opts) {
      openEditor(spec, opts && opts.theme || 'lfa', opts || {});
    }
  };

  /* ---------- boot ---------- */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', defineEl);else defineEl();
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "charts/lfa-chart-lite.js", error: String((e && e.message) || e) }); }

// charts/lfa-chart-studio.js
try { (() => {
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

  var E = function () {
    return window.LFAChartEngine;
  };
  window.LFA_CHART_SPECS = window.LFA_CHART_SPECS || {};
  function ready(cb) {
    var tries = 0;
    (function tick() {
      if (window.echarts && window.LFAChartEngine) return cb();
      if (tries++ < 120) setTimeout(tick, 80);
    })();
  }
  function specKey(id) {
    return 'lfa-chart:' + id;
  }
  function loadOverride(id) {
    try {
      var s = localStorage.getItem(specKey(id));
      return s ? JSON.parse(s) : null;
    } catch (e) {
      return null;
    }
  }
  function saveOverride(id, spec) {
    try {
      localStorage.setItem(specKey(id), JSON.stringify(spec));
    } catch (e) {}
  }
  function clearOverride(id) {
    try {
      localStorage.removeItem(specKey(id));
    } catch (e) {}
  }
  function clone(o) {
    return JSON.parse(JSON.stringify(o));
  }

  /* ---------------- <lfa-chart> ---------------- */
  function defineElementClass() {
    if (customElements.get('lfa-chart')) return;
    class LFAChartEl extends HTMLElement {
      connectedCallback() {
        var self = this;
        this.style.display = 'block';
        this.style.position = 'relative';
        if (!this.style.width) this.style.width = '100%';
        this._mount = document.createElement('div');
        this._mount.style.cssText = 'position:absolute;inset:0;';
        this.appendChild(this._mount);
        this._btn = document.createElement('button');
        this._btn.type = 'button';
        this._btn.setAttribute('aria-label', 'Edit chart');
        this._btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg><span style="margin-left:5px">Edit</span>';
        this._btn.style.cssText = 'position:absolute;top:8px;right:8px;z-index:5;display:none;align-items:center;border:1px solid rgba(35,54,110,.18);background:rgba(255,255,255,.94);color:#23366E;font:600 10.5px/1 Mulish,system-ui,sans-serif;letter-spacing:.05em;text-transform:uppercase;padding:6px 10px;border-radius:6px;cursor:pointer;box-shadow:0 2px 8px rgba(26,42,85,.14);';
        this._btn.addEventListener('click', function (e) {
          e.stopPropagation();
          self.openEditor();
        });
        this.appendChild(this._btn);
        this.addEventListener('mouseenter', function () {
          if (window.LFA_CHART_EDIT !== false) self._btn.style.display = 'inline-flex';
        });
        this.addEventListener('mouseleave', function () {
          self._btn.style.display = 'none';
        });
        ready(function () {
          if (!self.isConnected) return;
          self._chart = window.echarts.init(self._mount, null, {
            renderer: 'svg'
          });
          self.render();
          self._ro = new ResizeObserver(function () {
            if (self._chart) self._chart.resize();
          });
          self._ro.observe(self._mount);
        });
      }
      disconnectedCallback() {
        if (this._ro) this._ro.disconnect();
        if (this._chart) {
          this._chart.dispose();
          this._chart = null;
        }
      }
      currentSpec() {
        var id = this.getAttribute('chart-id') || '';
        var ov = id ? loadOverride(id) : null;
        if (ov) return ov;
        if (this._inlineSpec) return this._inlineSpec;
        var attr = this.getAttribute('spec');
        if (attr) {
          try {
            this._inlineSpec = JSON.parse(attr);
            return this._inlineSpec;
          } catch (e) {}
        }
        if (id && window.LFA_CHART_SPECS[id]) return window.LFA_CHART_SPECS[id];
        return {
          type: 'line',
          meta: {
            title: 'Chart'
          },
          series: [{
            name: 'Series 1',
            points: [{
              x: 'A',
              y: 1
            }, {
              x: 'B',
              y: 2
            }, {
              x: 'C',
              y: 3
            }]
          }]
        };
      }
      themeName() {
        return this.getAttribute('theme') || 'lfa';
      }
      render() {
        if (!this._chart) return;
        try {
          this._chart.setOption(E().buildOption(this.currentSpec(), this.themeName()), true);
          this._chart.resize();
        } catch (e) {
          console.warn('lfa-chart render', e);
        }
      }
      openEditor() {
        var self = this,
          id = this.getAttribute('chart-id') || '';
        window.LFAChartStudio.openEditor(this.currentSpec(), {
          theme: this.themeName(),
          hasOverride: !!(id && loadOverride(id)),
          onApply: function (spec) {
            if (id) saveOverride(id, spec);else self._inlineSpec = spec;
            self.render();
            self.dispatchEvent(new CustomEvent('chart-change', {
              bubbles: true,
              detail: {
                id: id,
                spec: spec
              }
            }));
          },
          onReset: function () {
            if (id) clearOverride(id);
            self._inlineSpec = null;
            self.render();
          }
        });
      }
    }
    customElements.define('lfa-chart', LFAChartEl);
    window.LFAChart = {
      redrawAll: function () {
        document.querySelectorAll('lfa-chart').forEach(function (el) {
          el.render && el.render();
        });
      }
    };
  }

  /* ---------------- EDIT POPUP ---------------- */
  var UI = {
    bg: '#0f1419',
    panel: '#171d26',
    panel2: '#1e2630',
    border: '#2a3340',
    text: '#e4e7eb',
    dim: '#9aa5b1',
    accent: '#2b5d8c',
    danger: '#a14b4b'
  };
  function el(tag, css, html) {
    var e = document.createElement(tag);
    if (css) e.style.cssText = css;
    if (html != null) e.innerHTML = html;
    return e;
  }
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
    eng.CHART_CATALOG.forEach(function (g) {
      var og = document.createElement('optgroup');
      og.label = g.group;
      g.items.forEach(function (it) {
        var o = document.createElement('option');
        o.value = it.id;
        o.textContent = it.name;
        og.appendChild(o);
      });
      typeSel.appendChild(og);
    });
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
    body.appendChild(left);
    body.appendChild(right);
    modal.appendChild(body);

    // --- meta fields ---
    function field(label, key, ph) {
      var w = el('div', 'margin-bottom:10px;');
      w.appendChild(el('label', 'display:block;margin-bottom:4px;color:' + UI.dim + ';font-size:11px;text-transform:uppercase;letter-spacing:.4px;', label));
      var inp = el('input', inpCss());
      inp.type = 'text';
      inp.value = working.meta[key] || '';
      if (ph) inp.placeholder = ph;
      inp.addEventListener('input', function () {
        working.meta[key] = inp.value;
        schedule();
      });
      w.appendChild(inp);
      return w;
    }
    left.appendChild(sectionLabel('Titles & labels'));
    left.appendChild(field('Title', 'title'));
    left.appendChild(field('Subtitle', 'subtitle'));
    var row2 = el('div', 'display:grid;grid-template-columns:1fr 1fr;gap:8px;');
    row2.appendChild(field('X label', 'xLabel'));
    row2.appendChild(field('Y label', 'yLabel'));
    left.appendChild(row2);
    var y2f = field('Secondary Y (combo)', 'y2Label');
    left.appendChild(y2f);

    // --- data editor ---
    left.appendChild(sectionLabel('Data'));
    var dataHint = el('div', 'color:' + UI.dim + ';font-size:11px;line-height:1.5;margin-bottom:8px;', 'First column = X (category). Each further column = a series. Edit cells, rename series in the header row, add/remove rows & series.');
    left.appendChild(dataHint);
    var tableHost = el('div', 'border:1px solid ' + UI.border + ';border-radius:8px;overflow:auto;max-height:220px;background:' + UI.panel2 + ';');
    left.appendChild(tableHost);
    var tblBtns = el('div', 'display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;');
    var addRow = el('button', btnCss('sm'), '+ Row');
    var addSeries = el('button', btnCss('sm'), '+ Series');
    tblBtns.appendChild(addRow);
    tblBtns.appendChild(addSeries);
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
    pvCard.appendChild(pvMount);
    right.appendChild(pvCard);
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
    footer.appendChild(exportBtn);
    footer.appendChild(pngBtn);
    footer.appendChild(el('div', 'flex:1;'));
    var cancelBtn = el('button', btnCss('ghost'), 'Cancel');
    var applyBtn = el('button', btnCss('primary'), 'Apply');
    footer.appendChild(cancelBtn);
    footer.appendChild(applyBtn);
    modal.appendChild(footer);
    document.body.appendChild(overlay);

    /* ---- behaviour ---- */
    var tableState = eng.specToTable(working); // {headers, rows}

    function rebuildTable() {
      tableHost.innerHTML = '';
      var tbl = el('table', 'border-collapse:collapse;width:100%;font-size:12px;');
      var thead = el('thead');
      var htr = el('tr');
      tableState.headers.forEach(function (h, ci) {
        var th = el('th', 'padding:0;border:1px solid ' + UI.border + ';background:' + UI.panel + ';position:sticky;top:0;');
        if (ci === 0) {
          th.appendChild(el('div', 'padding:6px 8px;color:' + UI.dim + ';font-size:10px;text-transform:uppercase;letter-spacing:.5px;', 'X'));
        } else {
          var wrap = el('div', 'display:flex;align-items:center;');
          var sidx = ci - 1;
          var pal = eng.THEMES[themeName] && eng.THEMES[themeName].palette.categorical || ['#23366E'];
          var curCol = working.series[sidx] && working.series[sidx].color || pal[sidx % pal.length];
          var sw = el('input', 'width:20px;height:20px;min-width:20px;border:0;background:transparent;padding:0;margin-left:5px;cursor:pointer;flex:none;');
          sw.type = 'color';
          sw.title = 'Series colour';
          try {
            sw.value = /^#[0-9a-f]{6}$/i.test(curCol) ? curCol : '#23366E';
          } catch (e) {}
          sw.addEventListener('input', function () {
            if (!working.series[sidx]) working.series[sidx] = {
              name: tableState.headers[ci],
              points: []
            };
            working.series[sidx].color = sw.value;
            schedule();
          });
          wrap.appendChild(sw);
          var hi = el('input', 'width:100%;background:transparent;border:0;color:' + UI.text + ';padding:6px 8px;font:600 12px/1 Inter,sans-serif;');
          hi.value = h;
          hi.addEventListener('input', function () {
            tableState.headers[ci] = hi.value;
            schedule();
          });
          wrap.appendChild(hi);
          var del = el('button', 'border:0;background:transparent;color:' + UI.danger + ';cursor:pointer;padding:0 7px;font-size:14px;', '×');
          del.title = 'Remove series';
          del.addEventListener('click', function () {
            if (tableState.headers.length <= 2) return;
            tableState.headers.splice(ci, 1);
            tableState.rows.forEach(function (r) {
              r.splice(ci, 1);
            });
            if (working.series) working.series.splice(sidx, 1);
            rebuildTable();
            schedule();
          });
          wrap.appendChild(del);
          th.appendChild(wrap);
        }
        htr.appendChild(th);
      });
      thead.appendChild(htr);
      tbl.appendChild(thead);
      var tbody = el('tbody');
      tableState.rows.forEach(function (row, ri) {
        var tr = el('tr');
        tableState.headers.forEach(function (_, ci) {
          var td = el('td', 'padding:0;border:1px solid ' + UI.border + ';');
          var ci2 = ci;
          var inp = el('input', 'width:100%;min-width:54px;background:transparent;border:0;color:' + UI.text + ';padding:6px 8px;font:400 12px/1 ' + (ci === 0 ? 'Inter' : 'ui-monospace') + ',monospace;');
          inp.value = row[ci] == null ? '' : row[ci];
          inp.addEventListener('input', function () {
            tableState.rows[ri][ci2] = inp.value;
            schedule();
          });
          td.appendChild(inp);
          tr.appendChild(td);
        });
        var tdDel = el('td', 'border:1px solid ' + UI.border + ';');
        var del = el('button', 'border:0;background:transparent;color:' + UI.danger + ';cursor:pointer;padding:4px 8px;font-size:14px;', '×');
        del.title = 'Remove row';
        del.addEventListener('click', function () {
          tableState.rows.splice(ri, 1);
          rebuildTable();
          schedule();
        });
        tdDel.appendChild(del);
        tr.appendChild(tdDel);
        tbody.appendChild(tr);
      });
      tbl.appendChild(tbody);
      tableHost.appendChild(tbl);
    }
    function syncFromTable() {
      working = eng.tableToSpec({
        type: typeSel.value,
        meta: working.meta,
        series: working.series
      }, tableState.headers, tableState.rows);
      working.type = typeSel.value;
    }
    var schedTimer = null;
    function schedule() {
      clearTimeout(schedTimer);
      schedTimer = setTimeout(drawPreview, 120);
    }
    function drawPreview() {
      syncFromTable();
      jsonTa.value = JSON.stringify({
        type: working.type,
        meta: working.meta,
        series: working.series
      }, null, 1);
      if (!pv) {
        ready(function () {
          pv = window.echarts.init(pvMount, null, {
            renderer: 'svg'
          });
          applyOpt();
        });
      } else applyOpt();
      function applyOpt() {
        try {
          pv.setOption(eng.buildOption(working, themeName), true);
          pv.resize();
        } catch (e) {
          console.warn(e);
        }
      }
    }
    typeSel.addEventListener('change', function () {
      working.type = typeSel.value;
      schedule();
    });
    addRow.addEventListener('click', function () {
      var r = [''];
      for (var i = 1; i < tableState.headers.length; i++) r.push('');
      tableState.rows.push(r);
      rebuildTable();
      schedule();
    });
    addSeries.addEventListener('click', function () {
      tableState.headers.push('Series ' + tableState.headers.length);
      tableState.rows.forEach(function (r) {
        r.push('');
      });
      rebuildTable();
      schedule();
    });
    loadPaste.addEventListener('click', function () {
      if (!pasteTa.value.trim()) return;
      var p = eng.parseTSV(pasteTa.value);
      tableState = {
        headers: p.headers,
        rows: p.rows
      };
      rebuildTable();
      schedule();
    });
    loadJson.addEventListener('click', function () {
      try {
        var o = JSON.parse(jsonTa.value);
        working = eng.normalize(o);
        typeSel.value = working.type;
        tableState = eng.specToTable(working);
        rebuildTable();
        drawPreview();
      } catch (e) {
        alert('Invalid JSON: ' + e.message);
      }
    });
    function close() {
      try {
        if (pv) pv.dispose();
      } catch (e) {}
      overlay.remove();
    }
    closeX.addEventListener('click', close);
    cancelBtn.addEventListener('click', close);
    overlay.addEventListener('mousedown', function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') {
        close();
        document.removeEventListener('keydown', esc);
      }
    });
    resetBtn.addEventListener('click', function () {
      if (!opts.hasOverride) return;
      if (opts.onReset) opts.onReset();
      close();
    });
    exportBtn.addEventListener('click', function () {
      syncFromTable();
      var json = JSON.stringify({
        type: working.type,
        meta: working.meta,
        series: working.series
      }, null, 2);
      var done = function () {
        var old = exportBtn.textContent;
        exportBtn.textContent = 'Copied \u2713';
        setTimeout(function () {
          exportBtn.textContent = old;
        }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(json).then(done, function () {
          jsonTa.value = json;
          jsonTa.focus();
          jsonTa.select();
          done();
        });
      } else {
        jsonTa.value = json;
        jsonTa.focus();
        jsonTa.select();
        try {
          document.execCommand('copy');
        } catch (e) {}
        done();
      }
    });
    pngBtn.addEventListener('click', function () {
      if (!pv) return;
      try {
        var url = pv.getDataURL({
          type: 'png',
          pixelRatio: 2.5,
          backgroundColor: '#fff'
        });
        var a = document.createElement('a');
        var name = (working.meta.title || 'chart').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'chart';
        a.href = url;
        a.download = 'lfa-' + name + '.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } catch (e) {
        console.warn('png export', e);
      }
    });
    applyBtn.addEventListener('click', function () {
      syncFromTable();
      if (opts.onApply) opts.onApply(clone(working));
      close();
    });
    rebuildTable();
    var ro = new ResizeObserver(function () {
      if (pv) pv.resize();
    });
    ro.observe(pvCard);
    drawPreview();
  }

  /* ---- small style helpers ---- */
  function selCss() {
    return 'background:' + UI.panel2 + ';border:1px solid ' + UI.border + ';color:' + UI.text + ';border-radius:6px;padding:6px 8px;font:inherit;';
  }
  function inpCss() {
    return 'width:100%;background:' + UI.panel2 + ';border:1px solid ' + UI.border + ';color:' + UI.text + ';border-radius:6px;padding:7px 9px;font:inherit;box-sizing:border-box;';
  }
  function btnCss(kind) {
    var base = 'border-radius:7px;padding:8px 14px;font:600 12px/1 Inter,system-ui,sans-serif;cursor:pointer;border:1px solid ' + UI.border + ';';
    if (kind === 'primary') return base + 'background:' + UI.accent + ';border-color:' + UI.accent + ';color:#fff;';
    if (kind === 'ghost') return base + 'background:transparent;color:' + UI.text + ';';
    if (kind === 'sm') return 'border-radius:6px;padding:6px 10px;font:600 11px/1 Inter,sans-serif;cursor:pointer;border:1px solid ' + UI.border + ';background:' + UI.panel2 + ';color:' + UI.text + ';';
    return base;
  }
  function sectionLabel(txt) {
    return el('div', 'margin:16px 0 8px;color:#cfd6de;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.7px;border-top:1px solid ' + UI.border + ';padding-top:12px;', txt);
  }
  window.LFAChartStudio = {
    openEditor: openEditor
  };

  /* ---------------- boot ---------------- */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', defineElementClass);else defineElementClass();
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "charts/lfa-chart-studio.js", error: String((e && e.message) || e) }); }

// components/cards/FeatureCard.jsx
try { (() => {
/**
 * LFA FeatureCard — the caps-title + one-sentence block used across
 * "What Makes LFA Different" and "Why LFA" (optionally with a line icon).
 * Quiet by default: no heavy borders, lots of air.
 */
function FeatureCard({
  icon,
  title,
  children,
  align = 'left',
  boxed = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: align === 'center' ? 'center' : 'flex-start',
      textAlign: align,
      gap: '12px',
      padding: boxed ? '28px' : 0,
      background: boxed ? 'var(--lfa-white)' : 'transparent',
      border: boxed ? '1px solid var(--lfa-line)' : 'none',
      borderRadius: boxed ? 'var(--radius-md)' : 0,
      boxShadow: boxed ? 'var(--shadow-sm)' : 'none'
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      width: '44px',
      height: '44px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--lfa-rose)'
    },
    "aria-hidden": "true"
  }, icon), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: '14px',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--lfa-navy)',
      lineHeight: 1.4
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--fw-regular) 15px/1.6 var(--font-sans)',
      color: 'var(--lfa-navy-500)',
      maxWidth: '34ch'
    }
  }, children));
}
Object.assign(__ds_scope, { FeatureCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/FeatureCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/StatCard.jsx
try { (() => {
/**
 * LFA StatCard — the serif "facts & figures" figure used in the brochure
 * (AUM, clients, year established). Big italic-serif value, caps label.
 */
function StatCard({
  value,
  label,
  suffix,
  tone = 'navy',
  align = 'left'
}) {
  const color = tone === 'rose' ? 'var(--lfa-rose)' : tone === 'white' ? 'var(--lfa-white)' : 'var(--lfa-navy)';
  const labelColor = tone === 'white' ? 'rgba(255,255,255,0.72)' : 'var(--lfa-navy-500)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: align,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontWeight: 600,
      fontSize: '52px',
      lineHeight: 1,
      letterSpacing: '-0.01em',
      color,
      display: 'flex',
      alignItems: 'baseline',
      gap: '4px',
      justifyContent: align === 'center' ? 'center' : 'flex-start'
    }
  }, value, suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '26px',
      fontStyle: 'italic'
    }
  }, suffix)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: '11px',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: labelColor,
      maxWidth: '22ch',
      margin: align === 'center' ? '0 auto' : 0
    }
  }, label));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * LFA Button — the site's calm, restrained CTA.
 * Variants mirror lfa.ch: outlined rose pill ("GET STARTED"),
 * solid rose, solid navy, and a letterspaced underline link with arrow.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  iconRight,
  disabled = false,
  onClick,
  ...rest
}) {
  const pad = size === 'sm' ? '10px 20px' : size === 'lg' ? '17px 38px' : '14px 30px';
  const fs = size === 'sm' ? '12px' : '13px';
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontFamily: 'var(--font-sans)',
    fontWeight: 700,
    fontSize: fs,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    lineHeight: 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: '1.5px solid transparent',
    transition: 'background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out), gap var(--dur-base) var(--ease-out)',
    textDecoration: 'none',
    opacity: disabled ? 0.45 : 1
  };
  const variants = {
    primary: {
      ...base,
      padding: pad,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--lfa-rose)',
      color: 'var(--lfa-white)'
    },
    outline: {
      ...base,
      padding: pad,
      borderRadius: 'var(--radius-pill)',
      background: 'transparent',
      color: 'var(--lfa-rose)',
      borderColor: 'var(--lfa-rose)'
    },
    navy: {
      ...base,
      padding: pad,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--lfa-navy)',
      color: 'var(--lfa-white)'
    },
    link: {
      ...base,
      padding: '0 0 6px',
      borderRadius: 0,
      background: 'transparent',
      color: 'var(--lfa-rose)',
      borderBottom: '1px solid var(--lfa-rose)'
    }
  };
  const hover = (e, on) => {
    if (disabled) return;
    const s = e.currentTarget.style;
    if (variant === 'primary') s.background = on ? 'var(--lfa-rose-deep)' : 'var(--lfa-rose)';else if (variant === 'navy') s.background = on ? 'var(--lfa-navy-deep)' : 'var(--lfa-navy)';else if (variant === 'outline') {
      s.background = on ? 'var(--lfa-rose)' : 'transparent';
      s.color = on ? 'var(--lfa-white)' : 'var(--lfa-rose)';
    } else if (variant === 'link') {
      s.color = on ? 'var(--lfa-rose-deep)' : 'var(--lfa-rose)';
      s.gap = on ? '14px' : '10px';
    }
  };
  const Tag = href ? 'a' : 'button';
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    onClick: disabled ? undefined : onClick,
    style: variants[variant] || variants.primary,
    onMouseEnter: e => hover(e, true),
    onMouseLeave: e => hover(e, false)
  }, rest), children, iconRight && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      fontSize: '1.1em',
      lineHeight: 0
    }
  }, iconRight));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * LFA Eyebrow — the letterspaced ALL-CAPS label above headings and on
 * feature titles (e.g. "WHAT WE DO", "SEC REGISTERED").
 */
function Eyebrow({
  children,
  tone = 'rose',
  as = 'div',
  ...rest
}) {
  const color = tone === 'navy' ? 'var(--lfa-navy)' : tone === 'muted' ? 'var(--lfa-navy-300)' : tone === 'white' ? 'var(--lfa-white)' : 'var(--lfa-rose)';
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: 'var(--fs-label)',
      letterSpacing: 'var(--ls-label)',
      textTransform: 'uppercase',
      color,
      margin: 0
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * LFA Tag — small pill used for mandate exposures, currencies, risk levels
 * (e.g. "USD", "GLOBAL", "MODERATE"). Quiet by default; rose/navy when active.
 */
function Tag({
  children,
  tone = 'neutral',
  ...rest
}) {
  const tones = {
    neutral: {
      background: 'var(--lfa-mist)',
      color: 'var(--lfa-navy)',
      border: '1px solid var(--lfa-line)'
    },
    navy: {
      background: 'var(--lfa-navy)',
      color: 'var(--lfa-white)',
      border: '1px solid var(--lfa-navy)'
    },
    rose: {
      background: 'var(--lfa-rose)',
      color: 'var(--lfa-white)',
      border: '1px solid var(--lfa-rose)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--lfa-navy)',
      border: '1px solid var(--lfa-line-strong)'
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: '11px',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      padding: '6px 12px',
      borderRadius: 'var(--radius-pill)',
      ...(tones[tone] || tones.neutral)
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/layout/RoseSection.jsx
try { (() => {
/**
 * LFA RoseSection — the full-bleed dusty-rose editorial band (the "What We Do"
 * section). White text on rose, generous vertical padding, faint oversized
 * brand stamp watermark optional.
 */
function RoseSection({
  children,
  watermark = true,
  padding = 'var(--section-y)'
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      background: 'var(--lfa-rose-section)',
      color: 'var(--lfa-white)',
      padding: padding + ' 0',
      overflow: 'hidden'
    }
  }, watermark && /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      right: '-2%',
      bottom: '-30%',
      fontFamily: 'var(--font-serif)',
      fontStyle: 'italic',
      fontWeight: 600,
      fontSize: '420px',
      lineHeight: 1,
      color: 'rgba(255,255,255,0.06)',
      pointerEvents: 'none',
      userSelect: 'none'
    }
  }, "LFA"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 'var(--container)',
      margin: '0 auto',
      padding: '0 var(--gutter)'
    }
  }, children));
}
Object.assign(__ds_scope, { RoseSection });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/RoseSection.jsx", error: String((e && e.message) || e) }); }

// components/layout/SectionHeading.jsx
try { (() => {
/**
 * LFA SectionHeading — eyebrow + italic-serif headline + optional lead.
 * The recurring section opener on lfa.ch (often centered).
 */
function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  tone = 'navy',
  italic = true
}) {
  const onDark = tone === 'white';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      textAlign: align,
      alignItems: align === 'center' ? 'center' : 'flex-start',
      maxWidth: align === 'center' ? '760px' : '640px',
      marginInline: align === 'center' ? 'auto' : 0
    }
  }, eyebrow && /*#__PURE__*/React.createElement(__ds_scope.Eyebrow, {
    tone: onDark ? 'white' : 'rose'
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-serif)',
      fontStyle: italic ? 'italic' : 'normal',
      fontWeight: 500,
      fontSize: 'clamp(28px, 4vw, 40px)',
      lineHeight: 1.18,
      letterSpacing: '-0.01em',
      color: onDark ? 'var(--lfa-white)' : 'var(--lfa-navy)',
      textWrap: 'balance'
    }
  }, title), lead && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--fw-regular) 18px/1.6 var(--font-sans)',
      color: onDark ? 'rgba(255,255,255,0.86)' : 'var(--lfa-navy-500)',
      maxWidth: '60ch'
    }
  }, lead));
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/navigation/MandateTabs.jsx
try { (() => {
/**
 * LFA MandateTabs — the vertical left-rail selector from the Services page.
 * Active item = solid navy fill + white text; the next = pale steel; the
 * rest = faint grey. Controlled or uncontrolled.
 */
function MandateTabs({
  items,
  value,
  defaultValue,
  onChange
}) {
  const [internal, setInternal] = React.useState(defaultValue ?? items[0]);
  const active = value ?? internal;
  const select = item => {
    if (value === undefined) setInternal(item);
    onChange && onChange(item);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      width: '260px'
    }
  }, items.map((item, i) => {
    const isActive = item === active;
    const activeIndex = items.indexOf(active);
    const isNext = i === activeIndex + 1;
    const bg = isActive ? 'var(--lfa-navy)' : isNext ? 'var(--lfa-tint-blue)' : 'var(--lfa-paper)';
    const color = isActive ? 'var(--lfa-white)' : isNext ? 'var(--lfa-navy-500)' : 'var(--lfa-navy-500)';
    return /*#__PURE__*/React.createElement("button", {
      key: item,
      onClick: () => select(item),
      style: {
        textAlign: 'center',
        padding: '18px 16px',
        border: '1px solid ' + (isActive ? 'var(--lfa-navy)' : 'var(--lfa-line)'),
        borderRadius: 'var(--radius-sm)',
        background: bg,
        color,
        fontFamily: 'var(--font-sans)',
        fontSize: '15px',
        fontWeight: isActive ? 700 : 500,
        cursor: 'pointer',
        transition: 'background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out)'
      }
    }, item);
  }));
}
Object.assign(__ds_scope, { MandateTabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/MandateTabs.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
/**
 * LFA NavBar — the sticky white top nav from lfa.ch: links flanking a
 * centered logo lockup, with an outlined rose "GET STARTED" pill at the right.
 */
function NavBar({
  logoSrc = '../../assets/logo-lfa-full.png',
  leftLinks = ['About Us', 'What We Do', 'Who We Serve'],
  rightLinks = ['Why LFA', 'Resources'],
  cta = 'Get Started',
  active,
  onNavigate,
  onCta
}) {
  const link = label => /*#__PURE__*/React.createElement("a", {
    key: label,
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNavigate && onNavigate(label);
    },
    onMouseEnter: e => e.currentTarget.style.color = 'var(--lfa-rose)',
    onMouseLeave: e => e.currentTarget.style.color = active === label ? 'var(--lfa-rose)' : 'var(--lfa-navy)',
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '14px',
      fontWeight: 600,
      color: active === label ? 'var(--lfa-rose)' : 'var(--lfa-navy)',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      transition: 'color var(--dur-base) var(--ease-out)'
    }
  }, label);
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      height: 'var(--nav-h)',
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      gap: '32px',
      padding: '0 40px',
      background: 'var(--lfa-white)',
      borderBottom: '1px solid var(--lfa-line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '30px',
      alignItems: 'center'
    }
  }, leftLinks.map(link)), /*#__PURE__*/React.createElement("img", {
    src: logoSrc,
    alt: "LFA",
    style: {
      height: '58px',
      display: 'block',
      cursor: onNavigate ? 'pointer' : 'default'
    },
    onClick: () => onNavigate && onNavigate('Home')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '30px',
      alignItems: 'center',
      justifyContent: 'flex-end'
    }
  }, rightLinks.map(link), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "outline",
    size: "sm",
    onClick: onCta
  }, cta)));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// exports/brochure-handoff/template/ds-base.js
try { (() => {
// Loads the LFG+ZEST design system into this template.
(() => {
  const base = '../../_ds/lfg-zest-design-system-24bd7dc0-5d8f-47f2-a31f-7cc2ee4422bb';
  for (const p of ["tokens/fonts.css", "tokens/colors.css", "tokens/typography.css", "tokens/spacing.css", "tokens/effects.css", "styles.css"]) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = base + '/' + p;
    document.head.appendChild(l);
  }
  const s = document.createElement('script');
  s.src = base + '/_ds_bundle.js';
  s.onerror = () => console.error('ds-base.js: failed to load ' + s.src);
  document.head.appendChild(s);
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "exports/brochure-handoff/template/ds-base.js", error: String((e && e.message) || e) }); }

// exports/lfg-handoff/01-institutional-brochure/LFA/brochure/ds-base.js
try { (() => {
// Loads this design system into the template. In a consuming project, point
// base at the bound DS folder relative to this file (e.g. '_ds/<folder>' at
// the project root, '../_ds/<folder>' one level down) — one line to edit.
(() => {
  const base = '../..';
  for (const p of ["tokens/fonts.css", "tokens/colors.css", "tokens/typography.css", "tokens/spacing.css", "tokens/base.css", "styles.css"]) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = base + '/' + p;
    document.head.appendChild(l);
  }
  const s = document.createElement('script');
  s.src = base + '/_ds_bundle.js';
  s.onerror = () => console.error('ds-base.js: failed to load ' + s.src + ' — if this is a consuming project, point the base line in ds-base.js at the bound _ds/<folder> tree relative to this page (e.g. _ds/<folder> at the project root, ../_ds/<folder> one level down); in a fresh design system this can just mean the bundle is not compiled yet');
  document.head.appendChild(s);
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "exports/lfg-handoff/01-institutional-brochure/LFA/brochure/ds-base.js", error: String((e && e.message) || e) }); }

// exports/lfg-handoff/01-institutional-brochure/LFG-ZEST/brochure-en/ds-base.js
try { (() => {
// Loads this design system into the template. In a consuming project, point
// base at the bound DS folder relative to this file (e.g. '_ds/<folder>' at
// the project root, '../_ds/<folder>' one level down) — one line to edit.
(() => {
  const base = '../../../../_ds/lfg-zest-design-system-24bd7dc0-5d8f-47f2-a31f-7cc2ee4422bb';
  for (const p of ["tokens/fonts.css", "tokens/colors.css", "tokens/typography.css", "tokens/spacing.css", "tokens/effects.css", "styles.css"]) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = base + '/' + p;
    document.head.appendChild(l);
  }
  const s = document.createElement('script');
  s.src = base + '/_ds_bundle.js';
  s.onerror = () => console.error('ds-base.js: failed to load ' + s.src + ' — if this is a consuming project, point the base line in ds-base.js at the bound _ds/<folder> tree relative to this page (e.g. _ds/<folder> at the project root, ../_ds/<folder> one level down); in a fresh design system this can just mean the bundle is not compiled yet');
  document.head.appendChild(s);
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "exports/lfg-handoff/01-institutional-brochure/LFG-ZEST/brochure-en/ds-base.js", error: String((e && e.message) || e) }); }

// exports/lfg-handoff/01-institutional-brochure/LFG-ZEST/brochure-it/ds-base.js
try { (() => {
// Loads this design system into the template. In a consuming project, point
// base at the bound DS folder relative to this file (e.g. '_ds/<folder>' at
// the project root, '../_ds/<folder>' one level down) — one line to edit.
(() => {
  const base = '../../../../_ds/lfg-zest-design-system-24bd7dc0-5d8f-47f2-a31f-7cc2ee4422bb';
  for (const p of ["tokens/fonts.css", "tokens/colors.css", "tokens/typography.css", "tokens/spacing.css", "tokens/effects.css", "styles.css"]) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = base + '/' + p;
    document.head.appendChild(l);
  }
  const s = document.createElement('script');
  s.src = base + '/_ds_bundle.js';
  s.onerror = () => console.error('ds-base.js: failed to load ' + s.src + ' — if this is a consuming project, point the base line in ds-base.js at the bound _ds/<folder> tree relative to this page (e.g. _ds/<folder> at the project root, ../_ds/<folder> one level down); in a fresh design system this can just mean the bundle is not compiled yet');
  document.head.appendChild(s);
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "exports/lfg-handoff/01-institutional-brochure/LFG-ZEST/brochure-it/ds-base.js", error: String((e && e.message) || e) }); }

// exports/lfg-handoff/01-institutional-brochure/charts/lfa-chart-engine.js
try { (() => {
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
    id: 'lfa',
    name: 'LFA',
    fonts: {
      display: "'Cormorant Garamond', 'Hoefler Text', Georgia, serif",
      body: "'Mulish', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      mono: "'IBM Plex Mono', ui-monospace, monospace"
    },
    palette: {
      ink: '#23366E',
      background: '#FFFFFF',
      grid: '#E0E4EB',
      axis: '#8C95B2',
      categorical: ['#23366E', '#C24A5E', '#3E7C72', '#B0852F', '#6B5B95', '#5A6678', '#9C2D3A', '#3C6E8F'],
      sequential: ['#EDF2F9', '#5E77AE', '#23366E'],
      positive: '#3E7C72',
      negative: '#C24A5E'
    },
    axis: {
      lineWidth: 1,
      labelSize: 12,
      tickColor: '#8C95B2'
    }
  };
  var THEME_LFG_ZEST = {
    id: 'lfg-zest',
    name: 'LFG·ZEST',
    fonts: {
      display: "'Raleway', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      body: "'Raleway', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      mono: "'IBM Plex Mono', ui-monospace, monospace"
    },
    palette: {
      ink: '#4A0C18',
      background: '#FFFFFF',
      grid: '#ECE8E2',
      axis: '#A39B90',
      categorical: ['#83021A', '#B0852F', '#5A626B', '#3E6E66', '#A65A3A', '#7C5466', '#9E2A36', '#5A0B14'],
      sequential: ['#F7EEE4', '#C25E66', '#83021A'],
      positive: '#3F7A5A',
      negative: '#9E2A36'
    },
    axis: {
      lineWidth: 1,
      labelSize: 12,
      tickColor: '#B0A89D'
    }
  };
  var THEME_NEUTRO = {
    id: 'neutro',
    name: 'Neutro',
    fonts: {
      display: "'Inter', system-ui, sans-serif",
      body: "'Inter', system-ui, sans-serif",
      mono: "'JetBrains Mono', monospace"
    },
    palette: {
      ink: '#1f2933',
      background: '#ffffff',
      grid: '#e4e7eb',
      axis: '#9aa5b1',
      categorical: ['#2b5d8c', '#c08a3e', '#3f7d6e', '#8c5a7c', '#6b7280', '#a14b4b'],
      sequential: ['#e8f0f7', '#2b5d8c'],
      positive: '#3f7d6e',
      negative: '#a14b4b'
    },
    axis: {
      lineWidth: 1,
      labelSize: 12,
      tickColor: '#9aa5b1'
    }
  };
  var THEMES = {
    lfa: THEME_LFA,
    'lfg-zest': THEME_LFG_ZEST,
    neutro: THEME_NEUTRO
  };

  /* ---------------- CHART CATALOG ---------------- */
  var CHART_CATALOG = [{
    group: 'Performance',
    items: [{
      id: 'line',
      name: 'Line'
    }, {
      id: 'area',
      name: 'Area'
    }, {
      id: 'rebased',
      name: 'Rebased to 100'
    }, {
      id: 'drawdown',
      name: 'Drawdown'
    }, {
      id: 'rolling',
      name: 'Rolling returns'
    }, {
      id: 'perfstack',
      name: 'Cumulative + bars (stacked)'
    }]
  }, {
    group: 'Allocation',
    items: [{
      id: 'donut',
      name: 'Donut / Pie'
    }, {
      id: 'stacked',
      name: 'Stacked bar'
    }, {
      id: 'stackedh',
      name: 'Stacked bar (horizontal)'
    }, {
      id: 'treemap',
      name: 'Treemap',
      hierarchical: true
    }, {
      id: 'sunburst',
      name: 'Sunburst',
      hierarchical: true
    }]
  }, {
    group: 'Comparison',
    items: [{
      id: 'groupbar',
      name: 'Grouped bars'
    }, {
      id: 'barh',
      name: 'Horizontal bars'
    }, {
      id: 'bullet',
      name: 'Bullet vs benchmark'
    }, {
      id: 'slope',
      name: 'Slope'
    }, {
      id: 'rangebar',
      name: 'Range min–max + marker'
    }, {
      id: 'combo',
      name: 'Combo bars + line'
    }]
  }, {
    group: 'Risk / Distribution',
    items: [{
      id: 'scatter',
      name: 'Scatter risk/return'
    }, {
      id: 'heatmap',
      name: 'Heatmap'
    }, {
      id: 'histogram',
      name: 'Histogram'
    }, {
      id: 'boxplot',
      name: 'Box plot'
    }]
  }, {
    group: 'Market / Outlook',
    items: [{
      id: 'candlestick',
      name: 'Candlestick'
    }, {
      id: 'waterfall',
      name: 'Waterfall'
    }, {
      id: 'fan',
      name: 'Range / Fan'
    }]
  }];
  var CHART_META = {};
  CHART_CATALOG.forEach(function (g) {
    g.items.forEach(function (it) {
      CHART_META[it.id] = it;
    });
  });
  function isHierarchical(t) {
    return !!(CHART_META[t] && CHART_META[t].hierarchical);
  }

  /* ---------------- DATA helpers ---------------- */
  function newMeta(o) {
    return Object.assign({
      title: '',
      subtitle: '',
      xLabel: '',
      yLabel: '',
      y2Label: '',
      source: ''
    }, o || {});
  }
  function uniqueX(series) {
    var xs = [],
      seen = {};
    series.forEach(function (s) {
      (s.points || []).forEach(function (p) {
        var k = String(p.x);
        if (!seen[k]) {
          seen[k] = 1;
          xs.push(p.x);
        }
      });
    });
    return xs;
  }
  function seriesValuesAlongX(s, xs) {
    var map = {};
    (s.points || []).forEach(function (p) {
      map[String(p.x)] = p.y;
    });
    return xs.map(function (x) {
      var v = map[String(x)];
      return v === undefined ? null : v;
    });
  }
  function rebaseSeries(s) {
    var base = s.points.length ? s.points[0].y : 1;
    return s.points.map(function (p) {
      return {
        x: p.x,
        y: base ? p.y / base * 100 : p.y
      };
    });
  }
  function drawdownSeries(s) {
    var peak = -Infinity;
    return s.points.map(function (p) {
      peak = Math.max(peak, p.y);
      var dd = peak ? (p.y / peak - 1) * 100 : 0;
      return {
        x: p.x,
        y: Math.round(dd * 100) / 100
      };
    });
  }
  function rollingReturns(s, w) {
    var out = [];
    for (var i = 0; i < s.points.length; i++) {
      if (i < w) {
        out.push({
          x: s.points[i].x,
          y: null
        });
        continue;
      }
      var a = s.points[i - w].y,
        b = s.points[i].y;
      out.push({
        x: s.points[i].x,
        y: a ? Math.round((b / a - 1) * 10000) / 100 : null
      });
    }
    return out;
  }
  function asTreeNodes(points) {
    return (points || []).map(function (p) {
      if (p && (Array.isArray(p.children) || p.value !== undefined)) return p;
      return {
        name: String(p && (p.name !== undefined ? p.name : p.x) || ''),
        value: Number(p && (p.y !== undefined ? p.y : p.value) || 0)
      };
    });
  }

  /* ---------------- RENDER helpers ---------------- */
  function baseTextStyle(t) {
    return {
      fontFamily: t.fonts.body,
      color: t.palette.ink
    };
  }
  function titleBlock(d, t) {
    if (!d.meta.title && !d.meta.subtitle) return null;
    return {
      text: d.meta.title || '',
      subtext: d.meta.subtitle || '',
      left: 'center',
      top: 6,
      textStyle: {
        fontFamily: t.fonts.display,
        color: t.palette.ink,
        fontSize: 20,
        fontWeight: 700
      },
      subtextStyle: {
        fontFamily: t.fonts.body,
        color: t.palette.axis,
        fontSize: 13
      }
    };
  }
  function gridBlock() {
    return {
      left: 48,
      right: 28,
      top: 70,
      bottom: 52,
      containLabel: true
    };
  }
  function axisCommon(t) {
    return {
      nameTextStyle: {
        color: t.palette.axis,
        fontFamily: t.fonts.body
      },
      axisLine: {
        lineStyle: {
          color: t.palette.axis,
          width: t.axis.lineWidth
        }
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: t.axis.tickColor
        }
      },
      axisLabel: {
        color: t.palette.ink,
        fontFamily: t.fonts.body,
        fontSize: t.axis.labelSize
      },
      splitLine: {
        lineStyle: {
          color: t.palette.grid
        }
      }
    };
  }
  function colorFor(t, s, i) {
    return s && s.color || t.palette.categorical[i % t.palette.categorical.length];
  }
  function legendBlock(t, names) {
    return {
      data: names,
      bottom: 4,
      itemWidth: 11,
      itemHeight: 11,
      icon: 'roundRect',
      textStyle: {
        color: t.palette.ink,
        fontFamily: t.fonts.body,
        fontSize: 12
      }
    };
  }

  /* ---------------- RENDERERS ---------------- */
  var R = {
    _xyLine: function (d, t, o) {
      o = o || {};
      var xs = uniqueX(d.series);
      var series = d.series.map(function (s, i) {
        var pts = o.transform ? o.transform(s) : s.points;
        var vals = seriesValuesAlongX({
          points: pts
        }, xs);
        var col = colorFor(t, s, i);
        return {
          name: s.name,
          type: 'line',
          smooth: o.smooth !== undefined ? o.smooth : true,
          showSymbol: false,
          symbolSize: 6,
          lineStyle: {
            width: 2.4,
            color: col
          },
          itemStyle: {
            color: col
          },
          areaStyle: o.area ? {
            color: col,
            opacity: 0.16
          } : null,
          data: vals
        };
      });
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        grid: gridBlock(),
        tooltip: {
          trigger: 'axis'
        },
        legend: d.series.length > 1 ? legendBlock(t, d.series.map(function (s) {
          return s.name;
        })) : undefined,
        xAxis: Object.assign({
          type: 'category',
          boundaryGap: false,
          data: xs,
          name: d.meta.xLabel || ''
        }, axisCommon(t)),
        yAxis: Object.assign({
          type: 'value',
          name: d.meta.yLabel || '',
          scale: !!o.scaleY
        }, axisCommon(t)),
        series: series
      };
    },
    line: function (d, t) {
      return R._xyLine(d, t, {
        scaleY: true
      });
    },
    area: function (d, t) {
      return R._xyLine(d, t, {
        area: true,
        scaleY: true
      });
    },
    rebased: function (d, t) {
      return R._xyLine(d, t, {
        transform: rebaseSeries,
        scaleY: true
      });
    },
    drawdown: function (d, t) {
      return R._xyLine(d, t, {
        transform: drawdownSeries,
        area: true
      });
    },
    rolling: function (d, t) {
      return R._xyLine(d, t, {
        transform: function (s) {
          return rollingReturns(s, 3);
        },
        scaleY: true
      });
    },
    donut: function (d, t) {
      var s = d.series[0] || {
        points: []
      };
      var pts = s.points.map(function (p, i) {
        return {
          p: p,
          i: i
        };
      }).filter(function (o) {
        return o.p.y != null && Number(o.p.y) !== 0;
      });
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: legendBlock(t, pts.map(function (o) {
          return String(o.p.x);
        })),
        series: [{
          type: 'pie',
          radius: ['45%', '70%'],
          center: ['50%', '52%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderColor: t.palette.background,
            borderWidth: 2
          },
          label: {
            color: t.palette.ink,
            fontFamily: t.fonts.body
          },
          data: pts.map(function (o) {
            return {
              name: String(o.p.x),
              value: o.p.y,
              itemStyle: {
                color: t.palette.categorical[o.i % t.palette.categorical.length]
              }
            };
          })
        }]
      };
    },
    stacked: function (d, t) {
      return R._bars(d, t, {
        stack: true
      });
    },
    stackedh: function (d, t) {
      return R._bars(d, t, {
        stack: true,
        horizontal: true
      });
    },
    groupbar: function (d, t) {
      return R._bars(d, t, {});
    },
    barh: function (d, t) {
      return R._bars(d, t, {
        horizontal: true
      });
    },
    _bars: function (d, t, o) {
      var xs = uniqueX(d.series);
      var hasTitle = !!(d.meta.title || d.meta.subtitle),
        hasLegend = d.series.length > 1;
      var catAxis = Object.assign({
        type: 'category',
        data: xs,
        name: (o.horizontal ? d.meta.yLabel : d.meta.xLabel) || ''
      }, axisCommon(t));
      catAxis.axisLabel = Object.assign({}, catAxis.axisLabel, {
        interval: 0
      }); // never drop a category label
      var valAxis = Object.assign({
        type: 'value',
        name: (o.horizontal ? d.meta.xLabel : d.meta.yLabel) || ''
      }, axisCommon(t));
      var grid = {
        left: 48,
        right: 28,
        top: hasTitle ? 70 : 16,
        bottom: hasLegend ? 46 : 28,
        containLabel: true
      };
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        grid: grid,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: hasLegend ? legendBlock(t, d.series.map(function (s) {
          return s.name;
        })) : undefined,
        xAxis: o.horizontal ? valAxis : catAxis,
        yAxis: o.horizontal ? catAxis : valAxis,
        series: d.series.map(function (s, i) {
          return {
            name: s.name,
            type: 'bar',
            stack: o.stack ? 'total' : undefined,
            itemStyle: {
              color: colorFor(t, s, i),
              borderRadius: o.stack ? 0 : o.horizontal ? [0, 3, 3, 0] : [3, 3, 0, 0]
            },
            emphasis: {
              focus: 'series'
            },
            data: seriesValuesAlongX(s, xs)
          };
        })
      };
    },
    treemap: function (d, t) {
      var s = d.series[0] || {
        points: []
      };
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        tooltip: {
          trigger: 'item'
        },
        series: [{
          type: 'treemap',
          roam: false,
          breadcrumb: {
            show: true,
            bottom: 6
          },
          label: {
            color: '#fff',
            fontFamily: t.fonts.body
          },
          levels: [{
            itemStyle: {
              borderColor: t.palette.background,
              borderWidth: 2,
              gapWidth: 2
            }
          }],
          color: t.palette.categorical,
          data: asTreeNodes(s.points)
        }]
      };
    },
    sunburst: function (d, t) {
      var s = d.series[0] || {
        points: []
      };
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        tooltip: {
          trigger: 'item'
        },
        color: t.palette.categorical,
        series: [{
          type: 'sunburst',
          radius: ['15%', '90%'],
          center: ['50%', '52%'],
          label: {
            color: '#fff',
            fontFamily: t.fonts.body
          },
          itemStyle: {
            borderColor: t.palette.background,
            borderWidth: 2
          },
          data: asTreeNodes(s.points)
        }]
      };
    },
    bullet: function (d, t) {
      var xs = uniqueX(d.series),
        main = d.series[0] || {
          points: []
        },
        bench = d.series[1];
      var series = [{
        name: main.name,
        type: 'bar',
        barWidth: '45%',
        itemStyle: {
          color: t.palette.categorical[0]
        },
        data: seriesValuesAlongX(main, xs)
      }];
      if (bench) series.push({
        name: bench.name,
        type: 'scatter',
        symbol: 'rect',
        symbolSize: [28, 4],
        itemStyle: {
          color: t.palette.negative
        },
        data: seriesValuesAlongX(bench, xs)
      });
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        grid: gridBlock(),
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: legendBlock(t, d.series.map(function (s) {
          return s.name;
        })),
        xAxis: Object.assign({
          type: 'category',
          data: xs,
          name: d.meta.xLabel || ''
        }, axisCommon(t)),
        yAxis: Object.assign({
          type: 'value',
          name: d.meta.yLabel || ''
        }, axisCommon(t)),
        series: series
      };
    },
    slope: function (d, t) {
      var first = d.series[0] && d.series[0].points.length ? d.series[0].points[0].x : 'Start';
      var last = d.series[0] && d.series[0].points.length ? d.series[0].points[d.series[0].points.length - 1].x : 'End';
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        grid: gridBlock(),
        tooltip: {
          trigger: 'item'
        },
        legend: legendBlock(t, d.series.map(function (s) {
          return s.name;
        })),
        xAxis: Object.assign({
          type: 'category',
          data: [String(first), String(last)],
          boundaryGap: true,
          name: d.meta.xLabel || ''
        }, axisCommon(t)),
        yAxis: Object.assign({
          type: 'value',
          scale: true,
          name: d.meta.yLabel || ''
        }, axisCommon(t)),
        series: d.series.map(function (s, i) {
          var a = s.points[0],
            b = s.points[s.points.length - 1];
          return {
            name: s.name,
            type: 'line',
            symbol: 'circle',
            symbolSize: 9,
            showSymbol: true,
            lineStyle: {
              width: 2.4,
              color: colorFor(t, s, i)
            },
            itemStyle: {
              color: colorFor(t, s, i)
            },
            label: {
              show: true,
              color: t.palette.ink,
              formatter: '{c}'
            },
            data: [a ? a.y : null, b ? b.y : null]
          };
        })
      };
    },
    rangebar: function (d, t) {
      var byName = function (re) {
        return d.series.find(function (s) {
          return re.test((s.name || '').toLowerCase());
        });
      };
      var sMin = byName(/min/) || d.series[0],
        sMax = byName(/max/) || d.series[1],
        sCur = byName(/cur|attu/) || d.series[2],
        sBen = byName(/bench|target|saa|strateg/) || d.series[3];
      var cats = (sMin || d.series[0] || {
        points: []
      }).points.map(function (p) {
        return String(p.x);
      });
      var along = function (s) {
        return s ? seriesValuesAlongX(s, cats) : cats.map(function () {
          return null;
        });
      };
      var minV = along(sMin),
        maxV = along(sMax),
        base = minV.map(function (v) {
          return Number(v) || 0;
        });
      var span = maxV.map(function (v, i) {
        return Math.max(0, (Number(v) || 0) - base[i]);
      });
      var isPct = maxV.concat(minV).every(function (v) {
        return v == null || Math.abs(Number(v)) <= 1.5;
      });
      var fmtV = function (v) {
        if (v == null) return '';
        return isPct ? Math.round(v * 100) + '%' : Math.round(v * 10) / 10 + '%';
      };
      var pts = function (s) {
        return s ? cats.map(function (c, i) {
          var v = seriesValuesAlongX(s, cats)[i];
          return v == null ? null : [Number(v), c];
        }).filter(Boolean) : [];
      };
      var rangeCol = sMin && sMin.color || sMax && sMax.color || t.palette.categorical[0];
      var markCol = sBen && sBen.color || t.palette.negative;
      var series = [{
        type: 'bar',
        stack: 'r',
        silent: true,
        itemStyle: {
          color: 'transparent'
        },
        data: base
      }, {
        name: 'Tactical range',
        type: 'bar',
        stack: 'r',
        barWidth: '46%',
        itemStyle: {
          color: rangeCol,
          opacity: 0.22,
          borderColor: rangeCol,
          borderWidth: 1,
          borderRadius: 3
        },
        data: span
      }];
      if (sCur) series.push({
        name: sCur.name || 'Current',
        type: 'scatter',
        symbol: 'circle',
        symbolSize: 12,
        z: 5,
        itemStyle: {
          color: t.palette.categorical[0]
        },
        data: pts(sCur)
      });
      if (sBen) series.push({
        name: sBen.name || 'Benchmark',
        type: 'scatter',
        symbol: 'diamond',
        symbolSize: 14,
        z: 6,
        itemStyle: {
          color: markCol,
          borderColor: '#fff',
          borderWidth: 1.5
        },
        label: {
          show: true,
          position: 'top',
          distance: 5,
          color: markCol,
          fontFamily: t.fonts.body,
          fontWeight: 700,
          fontSize: 11,
          formatter: function (p) {
            return fmtV(p.value[0]);
          }
        },
        data: pts(sBen)
      });
      var hasTitle = !!(d.meta.title || d.meta.subtitle),
        showLegend = !d.meta.hideLegend;
      var maxX = Math.max.apply(null, maxV.map(function (v) {
        return Number(v) || 0;
      }).concat([0]));
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        grid: {
          left: 78,
          right: 30,
          top: hasTitle ? 64 : 14,
          bottom: showLegend ? 38 : 14,
          containLabel: true
        },
        tooltip: {
          trigger: 'item'
        },
        legend: showLegend ? legendBlock(t, ['Tactical range'].concat(sCur ? [sCur.name || 'Current'] : []).concat(sBen ? [sBen.name || 'Benchmark'] : [])) : undefined,
        xAxis: Object.assign({
          type: 'value',
          min: 0,
          max: isPct ? null : Math.ceil(maxX * 1.12 / 5) * 5,
          name: d.meta.xLabel || '',
          axisLabel: {
            show: false
          },
          splitLine: {
            show: false
          }
        }, axisCommon(t), {
          axisTick: {
            show: false
          }
        }),
        yAxis: Object.assign({
          type: 'category',
          data: cats,
          name: d.meta.yLabel || '',
          inverse: true
        }, axisCommon(t), {
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            color: t.palette.ink,
            fontFamily: t.fonts.body,
            fontSize: 12,
            fontWeight: 600
          }
        }),
        series: series
      };
    },
    combo: function (d, t) {
      var xs = uniqueX(d.series),
        dual = d.series.length > 1;
      var series = d.series.map(function (s, i) {
        var col = colorFor(t, s, i),
          vals = seriesValuesAlongX(s, xs);
        if (i === 0) return {
          name: s.name,
          type: 'bar',
          yAxisIndex: 0,
          barMaxWidth: '46%',
          itemStyle: {
            color: col,
            borderRadius: [2, 2, 0, 0]
          },
          data: vals
        };
        return {
          name: s.name,
          type: 'line',
          yAxisIndex: dual ? 1 : 0,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2.4,
            color: col
          },
          itemStyle: {
            color: col
          },
          data: vals
        };
      });
      var yLeft = Object.assign({
        type: 'value',
        name: d.meta.yLabel || '',
        scale: true
      }, axisCommon(t));
      var yRight = Object.assign({
        type: 'value',
        name: d.meta.y2Label || '',
        scale: true
      }, axisCommon(t), {
        position: 'right',
        splitLine: {
          show: false
        }
      });
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        grid: {
          left: 48,
          right: dual ? 52 : 28,
          top: 70,
          bottom: 52,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: legendBlock(t, d.series.map(function (s) {
          return s.name;
        })),
        xAxis: Object.assign({
          type: 'category',
          boundaryGap: true,
          data: xs,
          name: d.meta.xLabel || ''
        }, axisCommon(t)),
        yAxis: dual ? [yLeft, yRight] : yLeft,
        series: series
      };
    },
    perfstack: function (d, t) {
      // Two stacked panels sharing ONE time axis: cumulative line on top, period bars below.
      var xs = uniqueX(d.series);
      var isLine = function (s) {
        return /cum|index|rebas|nav|line/i.test(s.name || '');
      };
      var lineS = d.series.find(isLine) || d.series[d.series.length - 1] || {
        name: 'Cumulative',
        points: []
      };
      var barS = d.series.find(function (s) {
        return s !== lineS;
      }) || d.series[0] || {
        name: 'Period',
        points: []
      };
      var lineCol = lineS.color || t.palette.negative;
      var barCol = barS.color || t.palette.ink;
      var hasTitle = !!(d.meta.title || d.meta.subtitle);
      var topY = hasTitle ? 64 : 24;
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: t.palette.ink
            }
          }
        },
        axisPointer: {
          link: [{
            xAxisIndex: 'all'
          }]
        },
        legend: legendBlock(t, [lineS.name, barS.name]),
        grid: [{
          left: 56,
          right: 50,
          top: topY,
          height: '44%',
          containLabel: true
        }, {
          left: 56,
          right: 50,
          top: '63%',
          bottom: 42,
          containLabel: true
        }],
        xAxis: [Object.assign({
          type: 'category',
          data: xs,
          boundaryGap: true,
          gridIndex: 0,
          name: ''
        }, axisCommon(t)), Object.assign({
          type: 'category',
          data: xs,
          boundaryGap: true,
          gridIndex: 1,
          name: ''
        }, axisCommon(t), {
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          }
        })],
        yAxis: [Object.assign({
          type: 'value',
          gridIndex: 0,
          name: d.meta.y2Label || 'Index',
          scale: true
        }, axisCommon(t)), Object.assign({
          type: 'value',
          gridIndex: 1,
          name: d.meta.yLabel || 'Annual %'
        }, axisCommon(t))],
        series: [{
          name: lineS.name,
          type: 'line',
          xAxisIndex: 0,
          yAxisIndex: 0,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2.6,
            color: lineCol
          },
          itemStyle: {
            color: lineCol
          },
          areaStyle: {
            color: lineCol,
            opacity: 0.07
          },
          data: seriesValuesAlongX(lineS, xs)
        }, {
          name: barS.name,
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          barMaxWidth: '52%',
          itemStyle: {
            color: barCol,
            borderRadius: [2, 2, 0, 0]
          },
          data: seriesValuesAlongX(barS, xs)
        }]
      };
    },
    perfstackmulti: function (d, t) {
      // Same two-panel layout as perfstack but with N currency series:
      // N cumulative LINES on top, N period BARS (grouped) below, one colour per
      // currency shared by its line + bars. meta.nCcy = how many series are lines.
      var xs = uniqueX(d.series);
      var n = d.meta && d.meta.nCcy || Math.ceil(d.series.length / 2);
      var lines = d.series.slice(0, n),
        bars = d.series.slice(n);
      var hasTitle = !!(d.meta.title || d.meta.subtitle);
      var topY = hasTitle ? 64 : 24;
      var col = function (i) {
        return t.palette.categorical[i % t.palette.categorical.length];
      };
      var lineSeries = lines.map(function (s, i) {
        var c = s.color || col(i);
        return {
          name: s.name,
          type: 'line',
          xAxisIndex: 0,
          yAxisIndex: 0,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2.4,
            color: c
          },
          itemStyle: {
            color: c
          },
          data: seriesValuesAlongX(s, xs)
        };
      });
      var barSeries = bars.map(function (s, i) {
        var c = s.color || col(i);
        return {
          name: s.name,
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          barMaxWidth: 13,
          barGap: '15%',
          itemStyle: {
            color: c,
            borderRadius: [2, 2, 0, 0]
          },
          data: seriesValuesAlongX(s, xs)
        };
      });
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: t.palette.ink
            }
          }
        },
        axisPointer: {
          link: [{
            xAxisIndex: 'all'
          }]
        },
        legend: legendBlock(t, lines.map(function (s) {
          return s.name;
        })),
        grid: [{
          left: 56,
          right: 50,
          top: topY,
          height: '44%',
          containLabel: true
        }, {
          left: 56,
          right: 50,
          top: '63%',
          bottom: 42,
          containLabel: true
        }],
        xAxis: [Object.assign({
          type: 'category',
          data: xs,
          boundaryGap: true,
          gridIndex: 0,
          name: ''
        }, axisCommon(t)), Object.assign({
          type: 'category',
          data: xs,
          boundaryGap: true,
          gridIndex: 1,
          name: ''
        }, axisCommon(t), {
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          }
        })],
        yAxis: [Object.assign({
          type: 'value',
          gridIndex: 0,
          name: d.meta.y2Label || 'Index',
          scale: true
        }, axisCommon(t)), Object.assign({
          type: 'value',
          gridIndex: 1,
          name: d.meta.yLabel || 'Annual %'
        }, axisCommon(t))],
        series: lineSeries.concat(barSeries)
      };
    },
    scatter: function (d, t) {
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        grid: gridBlock(),
        tooltip: {
          trigger: 'item',
          formatter: function (p) {
            return p.seriesName + '<br/>' + (d.meta.xLabel || 'x') + ': ' + p.value[0] + '<br/>' + (d.meta.yLabel || 'y') + ': ' + p.value[1];
          }
        },
        legend: legendBlock(t, d.series.map(function (s) {
          return s.name;
        })),
        xAxis: Object.assign({
          type: 'value',
          scale: true,
          name: d.meta.xLabel || ''
        }, axisCommon(t)),
        yAxis: Object.assign({
          type: 'value',
          scale: true,
          name: d.meta.yLabel || ''
        }, axisCommon(t)),
        series: d.series.map(function (s, i) {
          return {
            name: s.name,
            type: 'scatter',
            symbolSize: 16,
            itemStyle: {
              color: colorFor(t, s, i)
            },
            label: {
              show: true,
              position: 'top',
              formatter: s.name,
              color: t.palette.ink,
              fontFamily: t.fonts.body,
              fontSize: 11
            },
            data: s.points.map(function (p) {
              return [Number(p.x), Number(p.y)];
            })
          };
        })
      };
    },
    heatmap: function (d, t) {
      var rows = d.series.map(function (s) {
        return s.name;
      });
      var cols = d.series.length ? d.series[0].points.map(function (p) {
        return String(p.x);
      }) : [];
      var vals = [],
        min = Infinity,
        max = -Infinity;
      d.series.forEach(function (s, r) {
        s.points.forEach(function (p) {
          var c = cols.indexOf(String(p.x));
          if (c < 0) return;
          var v = Number(p.y);
          min = Math.min(min, v);
          max = Math.max(max, v);
          vals.push([c, r, v]);
        });
      });
      if (!isFinite(min)) {
        min = 0;
        max = 1;
      }
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        grid: {
          left: 70,
          right: 28,
          top: 70,
          bottom: 72,
          containLabel: true
        },
        tooltip: {
          position: 'top'
        },
        xAxis: Object.assign({
          type: 'category',
          data: cols,
          splitArea: {
            show: true
          }
        }, axisCommon(t)),
        yAxis: Object.assign({
          type: 'category',
          data: rows,
          splitArea: {
            show: true
          }
        }, axisCommon(t)),
        visualMap: {
          min: min,
          max: max,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: 6,
          inRange: {
            color: [t.palette.sequential[0], t.palette.sequential[t.palette.sequential.length - 1]]
          },
          textStyle: {
            color: t.palette.ink
          }
        },
        series: [{
          type: 'heatmap',
          data: vals,
          label: {
            show: true,
            color: t.palette.ink,
            formatter: function (p) {
              return Math.round(p.value[2] * 100) / 100;
            }
          }
        }]
      };
    },
    histogram: function (d, t) {
      var s = d.series[0] || {
          points: []
        },
        ys = s.points.map(function (p) {
          return Number(p.y);
        }).filter(function (v) {
          return !isNaN(v);
        });
      var bins = 12,
        min = Math.min.apply(null, ys),
        max = Math.max.apply(null, ys);
      if (!isFinite(min)) {
        min = 0;
        max = 1;
      }
      if (min === max) max = min + 1;
      var w = (max - min) / bins,
        counts = new Array(bins).fill(0);
      ys.forEach(function (v) {
        var b = Math.floor((v - min) / w);
        if (b >= bins) b = bins - 1;
        if (b < 0) b = 0;
        counts[b]++;
      });
      var labels = counts.map(function (_, i) {
        return (Math.round((min + i * w) * 10) / 10).toString();
      });
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        grid: gridBlock(),
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: Object.assign({
          type: 'category',
          data: labels,
          name: d.meta.xLabel || ''
        }, axisCommon(t)),
        yAxis: Object.assign({
          type: 'value',
          name: d.meta.yLabel || 'Frequency'
        }, axisCommon(t)),
        series: [{
          name: 'Frequency',
          type: 'bar',
          barCategoryGap: '2%',
          itemStyle: {
            color: t.palette.categorical[0]
          },
          data: counts
        }]
      };
    },
    boxplot: function (d, t) {
      var names = d.series.map(function (s) {
        return s.name;
      });
      var boxData = d.series.map(function (s) {
        var arr = s.points.map(function (p) {
          return Number(p.y);
        }).filter(function (v) {
          return !isNaN(v);
        }).sort(function (a, b) {
          return a - b;
        });
        var q = function (p) {
          if (!arr.length) return 0;
          var idx = (arr.length - 1) * p,
            lo = Math.floor(idx),
            hi = Math.ceil(idx);
          return arr[lo] + (arr[hi] - arr[lo]) * (idx - lo);
        };
        return [arr[0] || 0, q(0.25), q(0.5), q(0.75), arr[arr.length - 1] || 0];
      });
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        grid: gridBlock(),
        tooltip: {
          trigger: 'item'
        },
        xAxis: Object.assign({
          type: 'category',
          data: names,
          name: d.meta.xLabel || ''
        }, axisCommon(t)),
        yAxis: Object.assign({
          type: 'value',
          scale: true,
          name: d.meta.yLabel || ''
        }, axisCommon(t)),
        series: [{
          type: 'boxplot',
          itemStyle: {
            color: t.palette.categorical[0],
            borderColor: t.palette.ink
          },
          data: boxData
        }]
      };
    },
    candlestick: function (d, t) {
      var s = d.series[0] || {
          points: []
        },
        xs = s.points.map(function (p) {
          return String(p.x);
        });
      var k = s.points.map(function (p, i, arr) {
        var y = Number(p.y),
          prev = i > 0 ? Number(arr[i - 1].y) : y;
        var open = prev,
          close = y;
        return [open, close, Math.min(open, close) * 0.99, Math.max(open, close) * 1.01];
      });
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        grid: gridBlock(),
        tooltip: {
          trigger: 'axis'
        },
        xAxis: Object.assign({
          type: 'category',
          data: xs,
          name: d.meta.xLabel || ''
        }, axisCommon(t)),
        yAxis: Object.assign({
          type: 'value',
          scale: true,
          name: d.meta.yLabel || ''
        }, axisCommon(t)),
        series: [{
          type: 'candlestick',
          data: k,
          itemStyle: {
            color: t.palette.positive,
            color0: t.palette.negative,
            borderColor: t.palette.positive,
            borderColor0: t.palette.negative
          }
        }]
      };
    },
    waterfall: function (d, t) {
      var s = d.series[0] || {
          points: []
        },
        cats = s.points.map(function (p) {
          return String(p.x);
        });
      var base = [],
        rise = [],
        fall = [],
        cum = 0;
      s.points.forEach(function (p, i) {
        var v = Number(p.y) || 0;
        if (i === 0) {
          base.push(0);
          rise.push(v >= 0 ? v : 0);
          fall.push(v < 0 ? -v : 0);
          cum = v;
          return;
        }
        if (v >= 0) {
          base.push(cum);
          rise.push(v);
          fall.push('-');
          cum += v;
        } else {
          cum += v;
          base.push(cum);
          rise.push('-');
          fall.push(-v);
        }
      });
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        grid: gridBlock(),
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: Object.assign({
          type: 'category',
          data: cats,
          name: d.meta.xLabel || ''
        }, axisCommon(t)),
        yAxis: Object.assign({
          type: 'value',
          name: d.meta.yLabel || ''
        }, axisCommon(t)),
        series: [{
          type: 'bar',
          stack: 'wf',
          itemStyle: {
            color: 'transparent'
          },
          emphasis: {
            itemStyle: {
              color: 'transparent'
            }
          },
          data: base
        }, {
          name: 'Increase',
          type: 'bar',
          stack: 'wf',
          itemStyle: {
            color: t.palette.positive
          },
          data: rise
        }, {
          name: 'Decrease',
          type: 'bar',
          stack: 'wf',
          itemStyle: {
            color: t.palette.negative
          },
          data: fall
        }]
      };
    },
    fan: function (d, t) {
      var xs = uniqueX(d.series),
        find = function (re) {
          return d.series.find(function (s) {
            return re.test((s.name || '').toLowerCase());
          });
        };
      var central = find(/centr|base|mid/) || d.series[0],
        low = find(/low|min|down/) || d.series[1],
        high = find(/high|max|up/) || d.series[2];
      var series = [];
      if (low && high) {
        var lowV = seriesValuesAlongX(low, xs),
          highV = seriesValuesAlongX(high, xs);
        series.push({
          name: '__low',
          type: 'line',
          stack: 'band',
          symbol: 'none',
          lineStyle: {
            opacity: 0
          },
          areaStyle: {
            opacity: 0
          },
          data: lowV,
          silent: true
        });
        series.push({
          name: 'Band',
          type: 'line',
          stack: 'band',
          symbol: 'none',
          lineStyle: {
            opacity: 0
          },
          areaStyle: {
            color: t.palette.categorical[0],
            opacity: 0.16
          },
          data: highV.map(function (v, i) {
            return v == null || lowV[i] == null ? null : v - lowV[i];
          })
        });
      }
      if (central) series.push({
        name: central.name,
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 2.6,
          color: t.palette.categorical[0]
        },
        itemStyle: {
          color: t.palette.categorical[0]
        },
        data: seriesValuesAlongX(central, xs)
      });
      return {
        backgroundColor: 'transparent',
        textStyle: baseTextStyle(t),
        title: titleBlock(d, t),
        grid: gridBlock(),
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['Band', central ? central.name : ''].filter(Boolean),
          bottom: 4,
          textStyle: {
            color: t.palette.ink,
            fontFamily: t.fonts.body
          }
        },
        xAxis: Object.assign({
          type: 'category',
          data: xs,
          name: d.meta.xLabel || ''
        }, axisCommon(t)),
        yAxis: Object.assign({
          type: 'value',
          scale: true,
          name: d.meta.yLabel || ''
        }, axisCommon(t)),
        series: series
      };
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
    return {
      type: d.type || 'line',
      meta: newMeta(d.meta),
      series: (d.series || []).map(function (s) {
        return {
          name: s.name || 'Series',
          color: s.color || null,
          points: (s.points || []).slice()
        };
      })
    };
  }

  /* ---------------- TSV / table <-> spec ---------------- */
  // Category table: first column = X, each next column a series. Returns {headers, rows}.
  function specToTable(spec) {
    var d = normalize(spec),
      xs = uniqueX(d.series);
    var headers = ['X'].concat(d.series.map(function (s) {
      return s.name;
    }));
    var rows = xs.map(function (x) {
      var row = [String(x)];
      d.series.forEach(function (s) {
        var v = seriesValuesAlongX(s, [x])[0];
        row.push(v == null ? '' : v);
      });
      return row;
    });
    return {
      headers: headers,
      rows: rows
    };
  }
  function tableToSpec(spec, headers, rows) {
    var d = normalize(spec);
    var nSeries = headers.length - 1;
    var series = [];
    for (var c = 0; c < nSeries; c++) {
      var old = d.series[c] || {};
      series.push({
        name: headers[c + 1] || 'Series ' + (c + 1),
        color: old.color || null,
        points: rows.filter(function (r) {
          return String(r[0]).trim() !== '';
        }).map(function (r) {
          var raw = r[c + 1];
          var num = parseFloat(String(raw).replace(',', '.'));
          var xv = r[0];
          var xn = parseFloat(xv);
          var x = String(xv).trim() !== '' && !isNaN(xn) && String(xn) === String(xv).trim() ? xn : xv;
          return {
            x: x,
            y: raw === '' || raw == null || isNaN(num) ? null : num
          };
        })
      });
    }
    return {
      type: d.type,
      meta: d.meta,
      series: series
    };
  }
  function parseTSV(text) {
    var lines = String(text).replace(/\r/g, '').split('\n').filter(function (l) {
      return l.trim() !== '';
    });
    if (!lines.length) return {
      headers: ['X', 'Series 1'],
      rows: []
    };
    var delim = lines[0].indexOf('\t') >= 0 ? '\t' : lines[0].indexOf(';') >= 0 ? ';' : ',';
    var grid = lines.map(function (l) {
      return l.split(delim).map(function (c) {
        return c.trim();
      });
    });
    return {
      headers: grid[0],
      rows: grid.slice(1)
    };
  }
  function tableToTSV(headers, rows) {
    return [headers.join('\t')].concat(rows.map(function (r) {
      return r.join('\t');
    })).join('\n');
  }
  window.LFAChartEngine = {
    THEMES: THEMES,
    CHART_CATALOG: CHART_CATALOG,
    CHART_META: CHART_META,
    isHierarchical: isHierarchical,
    buildOption: buildOption,
    normalize: normalize,
    newMeta: newMeta,
    specToTable: specToTable,
    tableToSpec: tableToSpec,
    parseTSV: parseTSV,
    tableToTSV: tableToTSV
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "exports/lfg-handoff/01-institutional-brochure/charts/lfa-chart-engine.js", error: String((e && e.message) || e) }); }

// exports/lfg-handoff/01-institutional-brochure/charts/lfa-chart-studio.js
try { (() => {
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

  var E = function () {
    return window.LFAChartEngine;
  };
  window.LFA_CHART_SPECS = window.LFA_CHART_SPECS || {};
  function ready(cb) {
    var tries = 0;
    (function tick() {
      if (window.echarts && window.LFAChartEngine) return cb();
      if (tries++ < 120) setTimeout(tick, 80);
    })();
  }
  function specKey(id) {
    return 'lfa-chart:' + id;
  }
  function loadOverride(id) {
    try {
      var s = localStorage.getItem(specKey(id));
      return s ? JSON.parse(s) : null;
    } catch (e) {
      return null;
    }
  }
  function saveOverride(id, spec) {
    try {
      localStorage.setItem(specKey(id), JSON.stringify(spec));
    } catch (e) {}
  }
  function clearOverride(id) {
    try {
      localStorage.removeItem(specKey(id));
    } catch (e) {}
  }
  function clone(o) {
    return JSON.parse(JSON.stringify(o));
  }

  /* ---------------- <lfa-chart> ---------------- */
  function defineElementClass() {
    if (customElements.get('lfa-chart')) return;
    class LFAChartEl extends HTMLElement {
      connectedCallback() {
        var self = this;
        this.style.display = 'block';
        this.style.position = 'relative';
        if (!this.style.width) this.style.width = '100%';
        this._mount = document.createElement('div');
        this._mount.style.cssText = 'position:absolute;inset:0;';
        this.appendChild(this._mount);
        this._btn = document.createElement('button');
        this._btn.type = 'button';
        this._btn.setAttribute('aria-label', 'Edit chart');
        this._btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg><span style="margin-left:5px">Edit</span>';
        this._btn.style.cssText = 'position:absolute;top:8px;right:8px;z-index:5;display:none;align-items:center;border:1px solid rgba(35,54,110,.18);background:rgba(255,255,255,.94);color:#23366E;font:600 10.5px/1 Mulish,system-ui,sans-serif;letter-spacing:.05em;text-transform:uppercase;padding:6px 10px;border-radius:6px;cursor:pointer;box-shadow:0 2px 8px rgba(26,42,85,.14);';
        this._btn.addEventListener('click', function (e) {
          e.stopPropagation();
          self.openEditor();
        });
        this.appendChild(this._btn);
        this.addEventListener('mouseenter', function () {
          if (window.LFA_CHART_EDIT !== false) self._btn.style.display = 'inline-flex';
        });
        this.addEventListener('mouseleave', function () {
          self._btn.style.display = 'none';
        });
        ready(function () {
          if (!self.isConnected) return;
          self._chart = window.echarts.init(self._mount, null, {
            renderer: 'svg'
          });
          self.render();
          self._ro = new ResizeObserver(function () {
            if (self._chart) self._chart.resize();
          });
          self._ro.observe(self._mount);
        });
      }
      disconnectedCallback() {
        if (this._ro) this._ro.disconnect();
        if (this._chart) {
          this._chart.dispose();
          this._chart = null;
        }
      }
      currentSpec() {
        var id = this.getAttribute('chart-id') || '';
        var ov = id ? loadOverride(id) : null;
        if (ov) return ov;
        if (this._inlineSpec) return this._inlineSpec;
        var attr = this.getAttribute('spec');
        if (attr) {
          try {
            this._inlineSpec = JSON.parse(attr);
            return this._inlineSpec;
          } catch (e) {}
        }
        if (id && window.LFA_CHART_SPECS[id]) return window.LFA_CHART_SPECS[id];
        return {
          type: 'line',
          meta: {
            title: 'Chart'
          },
          series: [{
            name: 'Series 1',
            points: [{
              x: 'A',
              y: 1
            }, {
              x: 'B',
              y: 2
            }, {
              x: 'C',
              y: 3
            }]
          }]
        };
      }
      themeName() {
        return this.getAttribute('theme') || 'lfa';
      }
      render() {
        if (!this._chart) return;
        try {
          this._chart.setOption(E().buildOption(this.currentSpec(), this.themeName()), true);
          this._chart.resize();
        } catch (e) {
          console.warn('lfa-chart render', e);
        }
      }
      openEditor() {
        var self = this,
          id = this.getAttribute('chart-id') || '';
        window.LFAChartStudio.openEditor(this.currentSpec(), {
          theme: this.themeName(),
          hasOverride: !!(id && loadOverride(id)),
          onApply: function (spec) {
            if (id) saveOverride(id, spec);else self._inlineSpec = spec;
            self.render();
            self.dispatchEvent(new CustomEvent('chart-change', {
              bubbles: true,
              detail: {
                id: id,
                spec: spec
              }
            }));
          },
          onReset: function () {
            if (id) clearOverride(id);
            self._inlineSpec = null;
            self.render();
          }
        });
      }
    }
    customElements.define('lfa-chart', LFAChartEl);
    window.LFAChart = {
      redrawAll: function () {
        document.querySelectorAll('lfa-chart').forEach(function (el) {
          el.render && el.render();
        });
      }
    };
  }

  /* ---------------- EDIT POPUP ---------------- */
  var UI = {
    bg: '#0f1419',
    panel: '#171d26',
    panel2: '#1e2630',
    border: '#2a3340',
    text: '#e4e7eb',
    dim: '#9aa5b1',
    accent: '#2b5d8c',
    danger: '#a14b4b'
  };
  function el(tag, css, html) {
    var e = document.createElement(tag);
    if (css) e.style.cssText = css;
    if (html != null) e.innerHTML = html;
    return e;
  }
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
    eng.CHART_CATALOG.forEach(function (g) {
      var og = document.createElement('optgroup');
      og.label = g.group;
      g.items.forEach(function (it) {
        var o = document.createElement('option');
        o.value = it.id;
        o.textContent = it.name;
        og.appendChild(o);
      });
      typeSel.appendChild(og);
    });
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
    body.appendChild(left);
    body.appendChild(right);
    modal.appendChild(body);

    // --- meta fields ---
    function field(label, key, ph) {
      var w = el('div', 'margin-bottom:10px;');
      w.appendChild(el('label', 'display:block;margin-bottom:4px;color:' + UI.dim + ';font-size:11px;text-transform:uppercase;letter-spacing:.4px;', label));
      var inp = el('input', inpCss());
      inp.type = 'text';
      inp.value = working.meta[key] || '';
      if (ph) inp.placeholder = ph;
      inp.addEventListener('input', function () {
        working.meta[key] = inp.value;
        schedule();
      });
      w.appendChild(inp);
      return w;
    }
    left.appendChild(sectionLabel('Titles & labels'));
    left.appendChild(field('Title', 'title'));
    left.appendChild(field('Subtitle', 'subtitle'));
    var row2 = el('div', 'display:grid;grid-template-columns:1fr 1fr;gap:8px;');
    row2.appendChild(field('X label', 'xLabel'));
    row2.appendChild(field('Y label', 'yLabel'));
    left.appendChild(row2);
    var y2f = field('Secondary Y (combo)', 'y2Label');
    left.appendChild(y2f);

    // --- data editor ---
    left.appendChild(sectionLabel('Data'));
    var dataHint = el('div', 'color:' + UI.dim + ';font-size:11px;line-height:1.5;margin-bottom:8px;', 'First column = X (category). Each further column = a series. Edit cells, rename series in the header row, add/remove rows & series.');
    left.appendChild(dataHint);
    var tableHost = el('div', 'border:1px solid ' + UI.border + ';border-radius:8px;overflow:auto;max-height:220px;background:' + UI.panel2 + ';');
    left.appendChild(tableHost);
    var tblBtns = el('div', 'display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;');
    var addRow = el('button', btnCss('sm'), '+ Row');
    var addSeries = el('button', btnCss('sm'), '+ Series');
    tblBtns.appendChild(addRow);
    tblBtns.appendChild(addSeries);
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
    pvCard.appendChild(pvMount);
    right.appendChild(pvCard);
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
    footer.appendChild(exportBtn);
    footer.appendChild(pngBtn);
    footer.appendChild(el('div', 'flex:1;'));
    var cancelBtn = el('button', btnCss('ghost'), 'Cancel');
    var applyBtn = el('button', btnCss('primary'), 'Apply');
    footer.appendChild(cancelBtn);
    footer.appendChild(applyBtn);
    modal.appendChild(footer);
    document.body.appendChild(overlay);

    /* ---- behaviour ---- */
    var tableState = eng.specToTable(working); // {headers, rows}

    function rebuildTable() {
      tableHost.innerHTML = '';
      var tbl = el('table', 'border-collapse:collapse;width:100%;font-size:12px;');
      var thead = el('thead');
      var htr = el('tr');
      tableState.headers.forEach(function (h, ci) {
        var th = el('th', 'padding:0;border:1px solid ' + UI.border + ';background:' + UI.panel + ';position:sticky;top:0;');
        if (ci === 0) {
          th.appendChild(el('div', 'padding:6px 8px;color:' + UI.dim + ';font-size:10px;text-transform:uppercase;letter-spacing:.5px;', 'X'));
        } else {
          var wrap = el('div', 'display:flex;align-items:center;');
          var sidx = ci - 1;
          var pal = eng.THEMES[themeName] && eng.THEMES[themeName].palette.categorical || ['#23366E'];
          var curCol = working.series[sidx] && working.series[sidx].color || pal[sidx % pal.length];
          var sw = el('input', 'width:20px;height:20px;min-width:20px;border:0;background:transparent;padding:0;margin-left:5px;cursor:pointer;flex:none;');
          sw.type = 'color';
          sw.title = 'Series colour';
          try {
            sw.value = /^#[0-9a-f]{6}$/i.test(curCol) ? curCol : '#23366E';
          } catch (e) {}
          sw.addEventListener('input', function () {
            if (!working.series[sidx]) working.series[sidx] = {
              name: tableState.headers[ci],
              points: []
            };
            working.series[sidx].color = sw.value;
            schedule();
          });
          wrap.appendChild(sw);
          var hi = el('input', 'width:100%;background:transparent;border:0;color:' + UI.text + ';padding:6px 8px;font:600 12px/1 Inter,sans-serif;');
          hi.value = h;
          hi.addEventListener('input', function () {
            tableState.headers[ci] = hi.value;
            schedule();
          });
          wrap.appendChild(hi);
          var del = el('button', 'border:0;background:transparent;color:' + UI.danger + ';cursor:pointer;padding:0 7px;font-size:14px;', '×');
          del.title = 'Remove series';
          del.addEventListener('click', function () {
            if (tableState.headers.length <= 2) return;
            tableState.headers.splice(ci, 1);
            tableState.rows.forEach(function (r) {
              r.splice(ci, 1);
            });
            if (working.series) working.series.splice(sidx, 1);
            rebuildTable();
            schedule();
          });
          wrap.appendChild(del);
          th.appendChild(wrap);
        }
        htr.appendChild(th);
      });
      thead.appendChild(htr);
      tbl.appendChild(thead);
      var tbody = el('tbody');
      tableState.rows.forEach(function (row, ri) {
        var tr = el('tr');
        tableState.headers.forEach(function (_, ci) {
          var td = el('td', 'padding:0;border:1px solid ' + UI.border + ';');
          var ci2 = ci;
          var inp = el('input', 'width:100%;min-width:54px;background:transparent;border:0;color:' + UI.text + ';padding:6px 8px;font:400 12px/1 ' + (ci === 0 ? 'Inter' : 'ui-monospace') + ',monospace;');
          inp.value = row[ci] == null ? '' : row[ci];
          inp.addEventListener('input', function () {
            tableState.rows[ri][ci2] = inp.value;
            schedule();
          });
          td.appendChild(inp);
          tr.appendChild(td);
        });
        var tdDel = el('td', 'border:1px solid ' + UI.border + ';');
        var del = el('button', 'border:0;background:transparent;color:' + UI.danger + ';cursor:pointer;padding:4px 8px;font-size:14px;', '×');
        del.title = 'Remove row';
        del.addEventListener('click', function () {
          tableState.rows.splice(ri, 1);
          rebuildTable();
          schedule();
        });
        tdDel.appendChild(del);
        tr.appendChild(tdDel);
        tbody.appendChild(tr);
      });
      tbl.appendChild(tbody);
      tableHost.appendChild(tbl);
    }
    function syncFromTable() {
      working = eng.tableToSpec({
        type: typeSel.value,
        meta: working.meta,
        series: working.series
      }, tableState.headers, tableState.rows);
      working.type = typeSel.value;
    }
    var schedTimer = null;
    function schedule() {
      clearTimeout(schedTimer);
      schedTimer = setTimeout(drawPreview, 120);
    }
    function drawPreview() {
      syncFromTable();
      jsonTa.value = JSON.stringify({
        type: working.type,
        meta: working.meta,
        series: working.series
      }, null, 1);
      if (!pv) {
        ready(function () {
          pv = window.echarts.init(pvMount, null, {
            renderer: 'svg'
          });
          applyOpt();
        });
      } else applyOpt();
      function applyOpt() {
        try {
          pv.setOption(eng.buildOption(working, themeName), true);
          pv.resize();
        } catch (e) {
          console.warn(e);
        }
      }
    }
    typeSel.addEventListener('change', function () {
      working.type = typeSel.value;
      schedule();
    });
    addRow.addEventListener('click', function () {
      var r = [''];
      for (var i = 1; i < tableState.headers.length; i++) r.push('');
      tableState.rows.push(r);
      rebuildTable();
      schedule();
    });
    addSeries.addEventListener('click', function () {
      tableState.headers.push('Series ' + tableState.headers.length);
      tableState.rows.forEach(function (r) {
        r.push('');
      });
      rebuildTable();
      schedule();
    });
    loadPaste.addEventListener('click', function () {
      if (!pasteTa.value.trim()) return;
      var p = eng.parseTSV(pasteTa.value);
      tableState = {
        headers: p.headers,
        rows: p.rows
      };
      rebuildTable();
      schedule();
    });
    loadJson.addEventListener('click', function () {
      try {
        var o = JSON.parse(jsonTa.value);
        working = eng.normalize(o);
        typeSel.value = working.type;
        tableState = eng.specToTable(working);
        rebuildTable();
        drawPreview();
      } catch (e) {
        alert('Invalid JSON: ' + e.message);
      }
    });
    function close() {
      try {
        if (pv) pv.dispose();
      } catch (e) {}
      overlay.remove();
    }
    closeX.addEventListener('click', close);
    cancelBtn.addEventListener('click', close);
    overlay.addEventListener('mousedown', function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') {
        close();
        document.removeEventListener('keydown', esc);
      }
    });
    resetBtn.addEventListener('click', function () {
      if (!opts.hasOverride) return;
      if (opts.onReset) opts.onReset();
      close();
    });
    exportBtn.addEventListener('click', function () {
      syncFromTable();
      var json = JSON.stringify({
        type: working.type,
        meta: working.meta,
        series: working.series
      }, null, 2);
      var done = function () {
        var old = exportBtn.textContent;
        exportBtn.textContent = 'Copied \u2713';
        setTimeout(function () {
          exportBtn.textContent = old;
        }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(json).then(done, function () {
          jsonTa.value = json;
          jsonTa.focus();
          jsonTa.select();
          done();
        });
      } else {
        jsonTa.value = json;
        jsonTa.focus();
        jsonTa.select();
        try {
          document.execCommand('copy');
        } catch (e) {}
        done();
      }
    });
    pngBtn.addEventListener('click', function () {
      if (!pv) return;
      try {
        var url = pv.getDataURL({
          type: 'png',
          pixelRatio: 2.5,
          backgroundColor: '#fff'
        });
        var a = document.createElement('a');
        var name = (working.meta.title || 'chart').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'chart';
        a.href = url;
        a.download = 'lfa-' + name + '.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } catch (e) {
        console.warn('png export', e);
      }
    });
    applyBtn.addEventListener('click', function () {
      syncFromTable();
      if (opts.onApply) opts.onApply(clone(working));
      close();
    });
    rebuildTable();
    var ro = new ResizeObserver(function () {
      if (pv) pv.resize();
    });
    ro.observe(pvCard);
    drawPreview();
  }

  /* ---- small style helpers ---- */
  function selCss() {
    return 'background:' + UI.panel2 + ';border:1px solid ' + UI.border + ';color:' + UI.text + ';border-radius:6px;padding:6px 8px;font:inherit;';
  }
  function inpCss() {
    return 'width:100%;background:' + UI.panel2 + ';border:1px solid ' + UI.border + ';color:' + UI.text + ';border-radius:6px;padding:7px 9px;font:inherit;box-sizing:border-box;';
  }
  function btnCss(kind) {
    var base = 'border-radius:7px;padding:8px 14px;font:600 12px/1 Inter,system-ui,sans-serif;cursor:pointer;border:1px solid ' + UI.border + ';';
    if (kind === 'primary') return base + 'background:' + UI.accent + ';border-color:' + UI.accent + ';color:#fff;';
    if (kind === 'ghost') return base + 'background:transparent;color:' + UI.text + ';';
    if (kind === 'sm') return 'border-radius:6px;padding:6px 10px;font:600 11px/1 Inter,sans-serif;cursor:pointer;border:1px solid ' + UI.border + ';background:' + UI.panel2 + ';color:' + UI.text + ';';
    return base;
  }
  function sectionLabel(txt) {
    return el('div', 'margin:16px 0 8px;color:#cfd6de;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.7px;border-top:1px solid ' + UI.border + ';padding-top:12px;', txt);
  }
  window.LFAChartStudio = {
    openEditor: openEditor
  };

  /* ---------------- boot ---------------- */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', defineElementClass);else defineElementClass();
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "exports/lfg-handoff/01-institutional-brochure/charts/lfa-chart-studio.js", error: String((e && e.message) || e) }); }

// exports/lfg-handoff/02-factsheet-editor/factsheet/ChartEditor.jsx
try { (() => {
/* Chart Studio — the on-brand chart editor integrated into the factsheet builder.
   Now driven by the SAME ECharts engine as the factsheet: the live preview is a
   real ECharts chart built with FactsheetECharts.buildOption(model, theme), and
   the type picker offers the full catalog (~21 renderers). Mirrors
   app/chart-studio.html (docs/chart-studio-integration.md §3): edit a chart's
   TYPE / COLORS / series NUMBERS against the locked family palette, then "Apply
   to factsheet" writes the {type,series,meta} model back into the document. */
const {
  useState: useCS,
  useEffect: useCSE
} = React;
const FAMILY_LABEL = {
  vg: 'VG / AQA',
  hive: 'HIVE / LFG·Zest',
  zest: 'Zest AM'
};
function ChartStudioModal() {
  const [open, setOpen] = useCS(false);
  const [seed, setSeed] = useCS(null);
  const [type, setType] = useCS('bar');
  const [series, setSeries] = useCS([]);
  const [family, setFamily] = useCS('vg');
  const [pasteOpen, setPasteOpen] = useCS(false);
  const [pasteText, setPasteText] = useCS('');
  useCSE(() => {
    const handler = e => {
      const s = e.detail;
      setSeed(s);
      setType(s.type || 'bar');
      setFamily(s.family || 'vg');
      setSeries(s.series.map(p => ({
        ...p
      })));
      setOpen(true);
      setPasteOpen(false);
      setPasteText('');
    };
    window.addEventListener('chart:edit', handler);
    return () => window.removeEventListener('chart:edit', handler);
  }, []);
  if (!open) return null;
  const {
    EChart
  } = window.KitCharts;
  const {
    resolveTheme,
    CHART_CATALOG
  } = window.FactsheetECharts;
  const theme = resolveTheme(family);
  const cats = theme.palette.categorical;
  const baseMeta = seed && seed.meta || {};
  // preview uses the chart's OWN meta so number format / sign match the factsheet
  const model = {
    type,
    series,
    color: (series.find(s => s.color) || {}).color,
    meta: Object.assign({}, baseMeta, {
      title: seed.title,
      compact: false,
      noLabel: false
    })
  };
  const valUnit = baseMeta.numFmt === 'num0' || baseMeta.numFmt === 'num' ? '' : '%';
  const setVal = (i, v) => setSeries(s => s.map((p, k) => k === i ? {
    ...p,
    value: v
  } : p));
  const setName = (i, v) => setSeries(s => s.map((p, k) => k === i ? {
    ...p,
    name: v
  } : p));
  const setColor = (i, c) => setSeries(s => s.map((p, k) => k === i ? {
    ...p,
    color: c
  } : p));
  const addRow = () => setSeries(s => [...s, {
    name: 'New',
    value: 0
  }]);
  const delRow = i => setSeries(s => s.filter((_, k) => k !== i));

  /* parse pasted spreadsheet data: lines of "Label <tab|,|;> Value" (Value may carry % or thousands separators) */
  const parsePaste = txt => {
    const rows = [];
    txt.split(/\r?\n/).forEach(line => {
      if (!line.trim()) return;
      const parts = line.split(/\t|;|,(?=\s*-?\d)|\s{2,}/).map(p => p.trim()).filter(Boolean);
      if (!parts.length) return;
      let name, raw;
      if (parts.length === 1) {
        const m = parts[0].match(/^(.*?)[\s]+(-?[\d.,]+%?)$/);
        if (m) {
          name = m[1];
          raw = m[2];
        } else {
          name = parts[0];
          raw = '0';
        }
      } else {
        name = parts.slice(0, -1).join(' ');
        raw = parts[parts.length - 1];
      }
      const val = parseFloat(String(raw).replace(/[^0-9.\-]/g, ''));
      rows.push({
        name: name.trim(),
        value: isNaN(val) ? 0 : val
      });
    });
    return rows;
  };
  const applyPaste = mode => {
    const rows = parsePaste(pasteText);
    if (!rows.length) {
      setPasteOpen(false);
      return;
    }
    setSeries(s => mode === 'append' ? [...s, ...rows] : rows.map((r, i) => ({
      ...r,
      color: (s[i] || {}).color
    })));
    setPasteOpen(false);
    setPasteText('');
  };
  const apply = () => {
    seed.onApply && seed.onApply({
      type,
      series,
      meta: {
        title: seed.title
      }
    });
    setOpen(false);
  };
  const reset = () => {
    seed.onReset && seed.onReset();
    setOpen(false);
  };
  const copyJSON = () => navigator.clipboard && navigator.clipboard.writeText(JSON.stringify(model, null, 2));

  // group the catalog
  const groups = {};
  CHART_CATALOG.forEach(c => {
    (groups[c.group] = groups[c.group] || []).push(c);
  });
  return /*#__PURE__*/React.createElement("div", {
    onClick: () => setOpen(false),
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(20,25,31,.46)',
      backdropFilter: 'blur(2px)',
      zIndex: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    "data-family": family,
    style: {
      width: '960px',
      maxWidth: '95vw',
      maxHeight: '92vh',
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 24px 70px rgba(20,25,31,.4)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '14px 18px',
      borderBottom: '1px solid var(--line)',
      background: 'var(--accent)',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: '14px'
    }
  }, "\u26ED Chart Studio"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '12px',
      opacity: .85
    }
  }, seed.title), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontSize: '10px',
      textTransform: 'uppercase',
      letterSpacing: '.1em',
      opacity: .85,
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: '#fff'
    }
  }), "ECharts \xB7 ", FAMILY_LABEL[family], " palette"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(false),
    style: {
      border: 0,
      background: 'rgba(255,255,255,.16)',
      color: '#fff',
      width: '26px',
      height: '26px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '15px'
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 290px',
      flex: 1,
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px',
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      borderRight: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      textTransform: 'uppercase',
      letterSpacing: '.08em',
      color: 'var(--ink-400)',
      fontWeight: 700,
      marginBottom: '8px'
    }
  }, "Live preview"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-app)',
      borderRadius: '8px',
      padding: '12px',
      height: '300px'
    }
  }, /*#__PURE__*/React.createElement(EChart, {
    key: family,
    model: model,
    theme: theme,
    height: 276
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '12px',
      overflowY: 'auto',
      maxHeight: '150px'
    }
  }, Object.entries(groups).map(([g, items]) => /*#__PURE__*/React.createElement("div", {
    key: g,
    style: {
      marginBottom: '8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '8.5px',
      textTransform: 'uppercase',
      letterSpacing: '.1em',
      color: 'var(--ink-400)',
      fontWeight: 700,
      marginBottom: '5px'
    }
  }, g), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '5px'
    }
  }, items.map(k => /*#__PURE__*/React.createElement("button", {
    key: k.id,
    onClick: () => setType(k.id),
    style: {
      border: '1px solid ' + (type === k.id ? 'var(--accent)' : 'var(--line)'),
      background: type === k.id ? 'var(--accent)' : '#fff',
      color: type === k.id ? '#fff' : 'var(--ink-700)',
      fontWeight: 600,
      fontSize: '10.5px',
      padding: '5px 10px',
      borderRadius: '6px',
      cursor: 'pointer'
    }
  }, k.label))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      textTransform: 'uppercase',
      letterSpacing: '.08em',
      color: 'var(--ink-400)',
      fontWeight: 700,
      marginBottom: '10px'
    }
  }, "Series data ", valUnit && '(' + valUnit + ')'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    }
  }, series.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "color",
    value: (p.color || cats[i % cats.length] || '#888').slice(0, 7),
    onChange: e => setColor(i, e.target.value),
    style: {
      width: '22px',
      height: '26px',
      border: '1px solid var(--line)',
      borderRadius: '5px',
      padding: 0,
      background: 'none',
      cursor: 'pointer',
      flex: '0 0 auto'
    }
  }), /*#__PURE__*/React.createElement("input", {
    value: p.name,
    onChange: e => setName(i, e.target.value),
    style: {
      flex: 1,
      minWidth: 0,
      border: '1px solid var(--line)',
      borderRadius: '5px',
      padding: '5px 7px',
      fontSize: '11px',
      fontFamily: 'var(--font-body)'
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "0.01",
    value: p.value,
    onChange: e => setVal(i, e.target.value),
    style: {
      width: '62px',
      border: '1px solid var(--line)',
      borderRadius: '5px',
      padding: '5px 6px',
      fontSize: '11px',
      fontFamily: 'var(--font-mono)',
      textAlign: 'right'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => delRow(i),
    title: "Remove",
    style: {
      border: 0,
      background: 'none',
      color: 'var(--ink-300)',
      cursor: 'pointer',
      fontSize: '15px',
      flex: '0 0 auto'
    }
  }, "\xD7")))), /*#__PURE__*/React.createElement("button", {
    onClick: addRow,
    style: {
      marginTop: '10px',
      border: '1px dashed var(--line-strong)',
      background: 'none',
      color: 'var(--ink-500)',
      fontSize: '11px',
      fontWeight: 600,
      padding: '7px',
      borderRadius: '6px',
      cursor: 'pointer'
    }
  }, "+ Add row"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPasteOpen(o => !o),
    style: {
      marginTop: '6px',
      border: '1px solid ' + (pasteOpen ? 'var(--accent)' : 'var(--line)'),
      background: pasteOpen ? 'var(--accent)' : '#fff',
      color: pasteOpen ? '#fff' : 'var(--ink-700)',
      fontSize: '11px',
      fontWeight: 600,
      padding: '7px',
      borderRadius: '6px',
      cursor: 'pointer'
    }
  }, "\u232C Paste data from Excel"), pasteOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("textarea", {
    value: pasteText,
    onChange: e => setPasteText(e.target.value),
    autoFocus: true,
    placeholder: 'Paste rows copied from Excel / Sheets:\nInformation Technology\t28.53\nFinancials\t11.25\n…',
    style: {
      width: '100%',
      height: '92px',
      border: '1px solid var(--line)',
      borderRadius: '6px',
      padding: '6px 8px',
      fontSize: '10px',
      fontFamily: 'var(--font-mono)',
      resize: 'vertical'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => applyPaste('replace'),
    style: {
      flex: 1,
      border: 0,
      background: 'var(--accent)',
      color: '#fff',
      fontSize: '10.5px',
      fontWeight: 700,
      padding: '6px',
      borderRadius: '6px',
      cursor: 'pointer'
    }
  }, "Replace"), /*#__PURE__*/React.createElement("button", {
    onClick: () => applyPaste('append'),
    style: {
      flex: 1,
      border: '1px solid var(--line)',
      background: '#fff',
      color: 'var(--ink-700)',
      fontSize: '10.5px',
      fontWeight: 600,
      padding: '6px',
      borderRadius: '6px',
      cursor: 'pointer'
    }
  }, "Append")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '9px',
      color: 'var(--ink-400)',
      lineHeight: 1.4
    }
  }, "One row per line \xB7 label and value separated by Tab, comma or semicolon. The % sign is optional.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      paddingTop: '12px',
      fontSize: '9.5px',
      color: 'var(--ink-400)',
      lineHeight: 1.5
    }
  }, "Colours snap to the ", /*#__PURE__*/React.createElement("b", null, FAMILY_LABEL[family]), " categorical palette unless overridden. Rendered by ECharts 5.5 via the shared ", /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: 'var(--font-mono)'
    }
  }, "buildOption"), "."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 18px',
      borderTop: '1px solid var(--line)',
      background: 'var(--surface-app)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '10px',
      color: 'var(--ink-400)'
    }
  }, "Model = the repo's ", /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: 'var(--font-mono)'
    }
  }, '{type,series,meta}'), " unit"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: '8px'
    }
  }, seed.edited && /*#__PURE__*/React.createElement("button", {
    onClick: reset,
    style: {
      border: '1px solid var(--line)',
      background: '#fff',
      color: 'var(--neg)',
      fontWeight: 600,
      fontSize: '12px',
      padding: '8px 14px',
      borderRadius: '8px',
      cursor: 'pointer'
    }
  }, "\u21BA Reset chart"), /*#__PURE__*/React.createElement("button", {
    onClick: copyJSON,
    style: {
      border: '1px solid var(--line)',
      background: '#fff',
      color: 'var(--ink-700)',
      fontWeight: 600,
      fontSize: '12px',
      padding: '8px 14px',
      borderRadius: '8px',
      cursor: 'pointer'
    }
  }, "Copy model JSON"), /*#__PURE__*/React.createElement("button", {
    onClick: apply,
    style: {
      border: 0,
      background: 'var(--accent)',
      color: '#fff',
      fontWeight: 700,
      fontSize: '12px',
      padding: '8px 18px',
      borderRadius: '8px',
      cursor: 'pointer'
    }
  }, "Apply to factsheet")))));
}
function openChartStudio(detail) {
  window.dispatchEvent(new CustomEvent('chart:edit', {
    detail
  }));
}
window.ChartStudio = {
  ChartStudioModal,
  openChartStudio
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "exports/lfg-handoff/02-factsheet-editor/factsheet/ChartEditor.jsx", error: String((e && e.message) || e) }); }

// exports/lfg-handoff/02-factsheet-editor/factsheet/Charts.jsx
try { (() => {
/* Charts.jsx — ECharts 5.x render layer for the factsheet UI kit.
   Every chart goes through FactsheetECharts.buildOption(model, theme) — the SAME
   function the Chart Studio uses — so the factsheet and the editor speak one
   language (docs/chart-studio-integration.md §2–4).

   Per-chart editing model (matches the sister project):
   ─ every <EChart> with an `id` is individually editable via a ✎ Edit button.
   ─ edits are stored as a per-chart OVERRIDE { type, series, color } keyed by
     `<activeDoc>::<id>`, so they survive re-render and switching pages, and are
     reverted independently. The factsheet reads its own override at render.
   Exposes window.KitCharts (EChart, CumulativeChart, MonthlyBars, Donut, CatChart). */

const {
  useRef: useCR,
  useEffect: useCE,
  useLayoutEffect: useCLE,
  useState: useCSt
} = React;
const {
  buildOption,
  resolveTheme
} = window.FactsheetECharts;
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/* ---------- per-chart override store ---------- */
const OV = window.__chartOv = window.__chartOv || {};
const keyOf = id => (window.__activeDoc || 'doc') + '::' + id;
window.__getChartOv = id => OV[keyOf(id)];
window.__setChartOv = (id, ov) => {
  OV[keyOf(id)] = ov;
  window.__sheetRerender && window.__sheetRerender();
};
window.__clearChartOv = doc => {
  const p = (doc || window.__activeDoc || 'doc') + '::';
  Object.keys(OV).forEach(k => {
    if (k.indexOf(p) === 0) delete OV[k];
  });
  window.__sheetRerender && window.__sheetRerender();
};
window.__hasChartOv = doc => {
  const p = (doc || window.__activeDoc || 'doc') + '::';
  return Object.keys(OV).some(k => k.indexOf(p) === 0);
};
function mergeOverride(model, ov) {
  if (!ov) return model;
  return Object.assign({}, model, {
    type: ov.type || model.type,
    series: ov.series || model.series,
    color: ov.color !== undefined && ov.color !== null ? ov.color : model.color
  });
}
function flattenMonthly(monthly) {
  const out = [];
  Object.keys(monthly).sort().forEach(y => {
    MONTHS.forEach(m => {
      const v = monthly[y][m];
      if (v !== undefined && v !== null) out.push({
        label: `${m} ${y.slice(2)}`,
        year: y,
        m,
        r: v
      });
    });
  });
  return out;
}
function cumulativeSeries(monthly, base = 100) {
  const flat = flattenMonthly(monthly);
  let nav = base;
  const pts = [{
    nav: base,
    label: 'Start'
  }];
  flat.forEach(p => {
    nav = nav * (1 + p.r);
    pts.push({
      nav,
      label: p.label
    });
  });
  return pts;
}

/* ---------- generic ECharts mount + ✎ Edit affordance ---------- */
function EChart({
  id,
  title,
  model,
  family,
  theme,
  height = 150,
  width,
  style,
  editable = true
}) {
  const ref = useCR(null);
  const inst = useCR(null);
  const themeRef = useCR(theme);
  const famRef = useCR(family || 'vg');
  const ov = id ? window.__getChartOv(id) : null;
  const eff = mergeOverride(model, ov);
  const effKey = JSON.stringify(eff);
  useCLE(() => {
    if (!ref.current || !window.echarts) return;
    const fam = family || (ref.current.closest('[data-family]') || {}).dataset?.family || 'vg';
    famRef.current = fam;
    themeRef.current = theme || resolveTheme(fam);
    const chart = window.echarts.init(ref.current, null, {
      renderer: 'svg'
    });
    inst.current = chart;
    chart.setOption(buildOption(eff, themeRef.current), true);
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(ref.current);
    const onPrint = () => {
      try {
        chart.resize();
      } catch (e) {}
    };
    window.addEventListener('beforeprint', onPrint);
    const mq = window.matchMedia && window.matchMedia('print');
    mq && mq.addEventListener && mq.addEventListener('change', onPrint);
    return () => {
      ro.disconnect();
      window.removeEventListener('beforeprint', onPrint);
      mq && mq.removeEventListener && mq.removeEventListener('change', onPrint);
      chart.dispose();
    };
  }, []);
  useCE(() => {
    if (inst.current) inst.current.setOption(buildOption(eff, themeRef.current), true);
  }, [effKey]);
  const onEdit = e => {
    e.stopPropagation();
    window.ChartStudio && window.ChartStudio.openChartStudio({
      id,
      title: title || eff.meta && eff.meta.title || 'Chart',
      family: famRef.current,
      type: eff.type,
      series: (eff.series || []).map(s => Object.assign({}, s)),
      meta: eff.meta || {},
      edited: !!ov,
      onApply: m => window.__setChartOv(id, {
        type: m.type,
        series: m.series,
        color: (m.series.find(s => s.color) || {}).color
      }),
      onReset: () => {
        delete OV[keyOf(id)];
        window.__sheetRerender && window.__sheetRerender();
      }
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: 'ec-wrap' + (ov ? ' ec-edited' : ''),
    style: {
      position: 'relative',
      width: width || '100%',
      height: height + 'px',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      width: '100%',
      height: '100%'
    }
  }), editable && id && /*#__PURE__*/React.createElement("button", {
    className: "ec-edit",
    onClick: onEdit,
    title: "Edit chart in Chart Studio"
  }, "\u270E Edit"));
}

/* ---- Cumulative NAV (line / area / column …) ---- */
function CumulativeChart({
  monthly,
  base = 100,
  height = 150,
  type = 'area',
  id,
  title
}) {
  const pts = cumulativeSeries(monthly, base);
  const model = {
    type: type === 'bars' ? 'column' : type,
    series: pts.map(p => ({
      name: p.label,
      value: +p.nav.toFixed(2)
    })),
    meta: {
      numFmt: 'num0',
      compact: true,
      title: title || 'Performance Since Inception'
    }
  };
  return /*#__PURE__*/React.createElement(EChart, {
    id: id,
    title: title,
    model: model,
    height: height
  });
}

/* ---- Monthly returns vs zero (signed columns) ---- */
function MonthlyBars({
  monthly,
  height = 130,
  year,
  id,
  title
}) {
  const flat = flattenMonthly(monthly);
  const data = year ? flat.filter(p => p.year === String(year)) : flat.slice(-18);
  const model = {
    type: 'column',
    series: data.map(p => ({
      name: p.m,
      value: +(p.r * 100).toFixed(2)
    })),
    meta: {
      numFmt: 'pct',
      compact: true,
      signed: true,
      title: title || 'Monthly Performance vs Zero'
    }
  };
  return /*#__PURE__*/React.createElement(EChart, {
    id: id,
    title: title,
    model: model,
    height: height
  });
}

/* ---- Donut (ring only by default; callers render their own legend) ---- */
function Donut({
  data,
  size = 150,
  thickness = 26,
  labels = false,
  id,
  title
}) {
  const inner = ((size / 2 - thickness) / (size / 2) * 100).toFixed(0);
  const model = {
    type: 'donut',
    series: data.map(d => ({
      name: d.name,
      value: +(d.weight * 100).toFixed(2),
      color: d.color
    })),
    meta: {
      numFmt: 'pct',
      compact: true,
      noLabel: !labels,
      radius: [inner + '%', '80%'],
      title: title || 'Allocation'
    }
  };
  return /*#__PURE__*/React.createElement(EChart, {
    id: id,
    title: title,
    model: model,
    height: size,
    width: size
  });
}

/* ---- Generic categorical chart (defaults to horizontal bars) ---- */
function CatChart({
  data,
  type = 'bar',
  height,
  compact = true,
  id,
  title
}) {
  const h = height || Math.max(58, data.length * (compact ? 19 : 26) + 12);
  const model = {
    type,
    series: data.map(d => ({
      name: d.name || d.sector,
      value: +((d.weight || 0) * 100).toFixed(2),
      color: d.color
    })),
    meta: {
      numFmt: 'pct',
      compact,
      title: title || 'Breakdown'
    }
  };
  return /*#__PURE__*/React.createElement(EChart, {
    id: id,
    title: title,
    model: model,
    height: h
  });
}
window.KitCharts = {
  EChart,
  CumulativeChart,
  MonthlyBars,
  Donut,
  CatChart,
  flattenMonthly,
  cumulativeSeries
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "exports/lfg-handoff/02-factsheet-editor/factsheet/Charts.jsx", error: String((e && e.message) || e) }); }

// exports/lfg-handoff/02-factsheet-editor/factsheet/FactsheetHive.jsx
try { (() => {
/* HIVE / LFG·Zest factsheet — bordeaux cover + 2 serif content pages. */
const DSh = window.FundFactsheetDesignSystem_2d23bc;
const {
  SectionTitle: HSectionTitle,
  Badge: HBadge,
  KpiStat: HKpiStat,
  InfoTable: HInfoTable,
  MonthlyReturnsTable: HMonthly,
  HoldingsTable: HHoldings,
  FundManagerBio: HBio,
  Disclaimer: HDisc,
  PerfValue: HPerf,
  RiskScale: HRisk,
  SfdrBadge: HSfdr
} = DSh;
const HCum = window.KitCharts.CumulativeChart;
const HBars = window.KitCharts.MonthlyBars;
const HCat = window.KitCharts.CatChart;
const {
  A4: HA4,
  DISCLAIMER: HDISC,
  Lead: HLead,
  LOGO: HLOGO,
  PageFoot: HFoot,
  MiniHeader: HMini
} = window.Factsheets;
const {
  ModuleGrid: HGrid,
  Module: HModule,
  CanvasPages: HCanvasPages,
  EditableTable: HEditable
} = window.KitLayout;

/* General Information & Costs as an editable key/value table (+/− rows) — Hive style */
function HGenInfo({
  rows,
  id
}) {
  return /*#__PURE__*/React.createElement(HEditable, {
    id: id,
    noHead: true,
    rows: rows.map(r => ({
      label: r.label,
      value: r.value
    })),
    columns: [{
      key: 'label',
      color: () => 'var(--ink-600)'
    }, {
      key: 'value',
      align: 'right',
      bold: true
    }]
  });
}
const HLabel = ({
  children
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: '9px',
    textTransform: 'uppercase',
    letterSpacing: '.06em',
    color: 'var(--accent-2)',
    fontWeight: 700,
    marginBottom: '5px'
  }
}, children);
function HiveCover({
  d
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "a4",
    "data-family": "hive",
    "data-screen-label": "hive-cover",
    style: {
      width: '210mm',
      height: '297mm',
      background: 'var(--accent)',
      color: '#fff',
      boxShadow: 'var(--shadow-sheet)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 400 400",
    style: {
      position: 'absolute',
      top: '-60px',
      right: '-60px',
      width: '320px',
      opacity: 0.16
    }
  }, Array.from({
    length: 24
  }).map((_, i) => /*#__PURE__*/React.createElement("line", {
    key: i,
    x1: "200",
    y1: "200",
    x2: "200",
    y2: "0",
    stroke: "#b08d3c",
    strokeWidth: "1.2",
    transform: `rotate(${i * 15} 200 200)`
  })), [60, 120, 180].map(r => /*#__PURE__*/React.createElement("circle", {
    key: r,
    cx: "200",
    cy: "200",
    r: r,
    fill: "none",
    stroke: "#b08d3c",
    strokeWidth: "1"
  }))), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 800 200",
    preserveAspectRatio: "none",
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '180px',
      opacity: 0.5
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0,200 L0,120 L120,60 L240,110 L360,40 L500,100 L640,30 L800,90 L800,200 Z",
    fill: "#4f141f"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,200 L0,150 L160,90 L300,140 L460,70 L620,130 L800,80 L800,200 Z",
    fill: "#3a0f17"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24mm 20mm',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      padding: '8px',
      borderRadius: '4px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: HLOGO('lfg-zest-red.png'),
    style: {
      width: '72px',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      fontSize: '10px',
      letterSpacing: '.18em',
      textTransform: 'uppercase',
      color: '#d8b96a'
    }
  }, "LFGZEST.COM")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      padding: '0 20mm 60mm',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '54px',
      height: '2px',
      background: 'var(--accent-2)',
      marginBottom: '20px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: '64px',
      lineHeight: 1.02,
      fontWeight: 600
    }
  }, d.meta.fundName), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '18px',
      fontSize: '14px',
      letterSpacing: '.28em',
      textTransform: 'uppercase',
      color: '#e7d4ae'
    }
  }, d.meta.subtitle), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '6px',
      fontSize: '11px',
      color: '#cbb08a'
    }
  }, d.meta.asOf)));
}
function HiveFactsheet({
  d
}) {
  const isAlloc = d.layout === 'hive-allocation';
  const pageTotal = window.__pageTotal ? window.__pageTotal('hive', [{
    id: 'hive-p2'
  }], 1) : 2;
  const seed2 = [{
    key: 'breakdown',
    kind: 'preset',
    preset: 'breakdown',
    w: 'half'
  }, {
    key: 'manager',
    kind: 'preset',
    preset: 'manager',
    w: 'half'
  }, window.Factsheets.shareClassBlock(d), {
    key: 'disclaimer',
    kind: 'text',
    w: 'full',
    size: 'fine',
    title: 'Disclaimer',
    text: HDISC.map(b => b.heading + ' ' + b.body).join('\n\n')
  }];
  const presets2 = {
    breakdown: () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(HSectionTitle, {
      variant: "bar"
    }, isAlloc ? 'Portfolio Breakdown' : 'Top 10 Holdings'), /*#__PURE__*/React.createElement("div", {
      style: {
        height: '8px'
      }
    }), /*#__PURE__*/React.createElement(HCat, {
      data: isAlloc ? d.strategy : d.holdings,
      id: "holdings",
      title: isAlloc ? 'Portfolio Breakdown' : 'Top 10 Holdings',
      compact: false
    })),
    manager: () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(HSectionTitle, {
      variant: "bar"
    }, isAlloc ? 'The Investment Advisor' : 'The Fund Manager'), /*#__PURE__*/React.createElement("div", {
      style: {
        height: '9px'
      }
    }), isAlloc ? /*#__PURE__*/React.createElement(HBio, {
      name: d.advisor.name,
      role: "Investment Advisor",
      bio: d.advisor.bio,
      photo: HLOGO(d.advisor.logo)
    }) : /*#__PURE__*/React.createElement(HBio, {
      name: d.manager.name,
      role: d.manager.role,
      bio: d.manager.bio
    }))
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(HiveCover, {
    d: d
  }), /*#__PURE__*/React.createElement(HA4, {
    family: "hive"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '2px solid var(--accent)',
      paddingBottom: '8px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '9px',
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'var(--accent-2)',
      fontWeight: 700
    }
  }, d.meta.subtitle), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: '26px',
      fontWeight: 600,
      color: 'var(--accent)',
      lineHeight: 1.1
    }
  }, d.meta.fundName)), /*#__PURE__*/React.createElement("img", {
    src: HLOGO('lfg-zest-red.png'),
    style: {
      height: '40px'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.15fr 1fr',
      gap: '7mm',
      marginTop: '12px',
      alignItems: 'stretch'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(HSectionTitle, {
    variant: "bar"
  }, "The Fund"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '7px'
    }
  }), /*#__PURE__*/React.createElement(HLead, null, d.mission), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: '15px',
      fontWeight: 600,
      color: 'var(--accent)',
      margin: '6px 0 4px'
    }
  }, "The Investment Strategy"), /*#__PURE__*/React.createElement(HLead, null, d.strategyText), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '20px',
      marginTop: 'auto',
      padding: '12px 14px',
      background: 'var(--doc-mist)',
      borderLeft: '3px solid var(--accent-2)'
    }
  }, /*#__PURE__*/React.createElement(HKpiStat, {
    label: "NAV / Share",
    value: d.nutshell.nav
  }), /*#__PURE__*/React.createElement(HKpiStat, {
    label: "YTD",
    value: /*#__PURE__*/React.createElement(HPerf, {
      value: d.nutshell.ytd,
      weight: 800
    }),
    accent: true
  }), /*#__PURE__*/React.createElement(HKpiStat, {
    label: "AuM",
    value: d.nutshell.fundSize
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(HSectionTitle, {
    variant: "bar"
  }, isAlloc ? 'Key Term Sheet' : 'General Information', " & Costs"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '7px'
    }
  }), /*#__PURE__*/React.createElement(HGenInfo, {
    id: d.layout + '-geninfo',
    rows: d.generalInfo
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      columnGap: '18px',
      rowGap: '5px',
      alignItems: 'start',
      marginTop: 'auto',
      paddingTop: '14px'
    }
  }, /*#__PURE__*/React.createElement(HLabel, null, "Risk Category (SRI)"), /*#__PURE__*/React.createElement(HLabel, null, "SFDR"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(HRisk, {
    value: d.risk
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      justifySelf: 'start'
    }
  }, /*#__PURE__*/React.createElement(HSfdr, {
    value: d.sfdr
  }))))), /*#__PURE__*/React.createElement(HGrid, {
    style: {
      marginTop: '10px'
    }
  }, /*#__PURE__*/React.createElement(HModule, {
    id: "h-cum",
    order: 1,
    title: "Performance Since Inception",
    width: "full"
  }, /*#__PURE__*/React.createElement(HSectionTitle, {
    variant: "bar"
  }, "Performance Since Inception"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '7px'
    }
  }), /*#__PURE__*/React.createElement(HCum, {
    monthly: d.monthly,
    base: d.startNav || 100,
    height: 120,
    id: "perf-cum",
    title: "Performance Since Inception"
  })), /*#__PURE__*/React.createElement(HModule, {
    id: "h-bars",
    order: 2,
    title: "Monthly Performance vs Zero",
    width: "full"
  }, /*#__PURE__*/React.createElement(HSectionTitle, {
    variant: "bar"
  }, "Monthly Performance vs Zero"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '7px'
    }
  }), /*#__PURE__*/React.createElement(HBars, {
    monthly: d.monthly,
    height: 92,
    id: "perf-bars",
    title: "Monthly Performance vs Zero"
  })), /*#__PURE__*/React.createElement(HModule, {
    id: "h-table",
    order: 3,
    title: "Monthly Performance (since inception)",
    width: "full",
    swap: ['table', 'chart']
  }, view => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(HSectionTitle, {
    variant: "bar"
  }, "Monthly Performance Since Inception"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '7px'
    }
  }), view === 'chart' ? /*#__PURE__*/React.createElement(HBars, {
    monthly: d.monthly,
    height: 110,
    id: "perf-table-chart",
    title: "Monthly Performance"
  }) : /*#__PURE__*/React.createElement(HMonthly, {
    data: d.monthly
  })))), /*#__PURE__*/React.createElement(HFoot, {
    left: "HIVE ILP (Ireland) \xB7 IM LFG+Zest SA \xB7 ManCo AQA Capital (MT)",
    page: 1,
    total: pageTotal
  })), /*#__PURE__*/React.createElement(HCanvasPages, {
    docKey: "hive",
    family: "hive",
    d: d,
    logo: "lfg-zest-red.png",
    serif: true,
    footerLeft: "More information: info@lfgzest.com \xB7 info@aqa-capital.com",
    presets: presets2,
    pagesSeed: [{
      id: 'hive-p2'
    }],
    blockSeeds: {
      'hive-p2': seed2
    },
    fixedBefore: 1
  }));
}
window.Factsheets.HiveFactsheet = HiveFactsheet;
})(); } catch (e) { __ds_ns.__errors.push({ path: "exports/lfg-handoff/02-factsheet-editor/factsheet/FactsheetHive.jsx", error: String((e && e.message) || e) }); }

// exports/lfg-handoff/02-factsheet-editor/factsheet/FactsheetVG.jsx
try { (() => {
/* Factsheet layouts — VG/AQA.  2-page A4 model shared by all families:
   PAGE 1 → identity, KPIs/costs, line + bar performance, monthly matrix.
   PAGE 2 → breakdown, holdings/share classes, manager, disclaimer.
   Defines shared page helpers on window.Factsheets. */

const DS = window.FundFactsheetDesignSystem_2d23bc;
const {
  PerfValue,
  SectionTitle,
  Badge,
  KpiStat,
  InfoTable,
  MonthlyReturnsTable,
  ShareClassTable,
  HoldingsTable,
  RiskScale,
  SfdrBadge,
  BrandHeader,
  FundManagerBio,
  Disclaimer
} = DS;
const VCum = window.KitCharts.CumulativeChart;
const VBars = window.KitCharts.MonthlyBars;
const VCat = window.KitCharts.CatChart;
const {
  ModuleGrid,
  Module,
  EditableTable,
  ModuleCanvas,
  CanvasPages
} = window.KitLayout;
const LOGO = s => `../../assets/logos/${s}`;
const DISCLAIMER = [{
  heading: 'No distribution, no offer, no advice.',
  body: 'The information herein is purely informative and shall in no way constitute an invitation, offer, recommendation or advice to buy or sell securities or financial instruments. This marketing communication is distributed for information purposes only and does not constitute an offer to subscribe for shares of the Fund.'
}, {
  heading: 'No guarantee.',
  body: 'Every care has been taken in preparing this document; however the content may not always be correct, accurate, complete or up to date. In no circumstance — including negligence — may the Fund or its directors be held liable for any loss deriving from the use of this document.'
}, {
  heading: 'Investment risks.',
  body: 'Past performance is not a guide to future performance. The performance data does not take into account commissions and costs incurred on issue and redemption of units. The value of investments and any income can go down as well as up and may be affected by exchange-rate fluctuations; an investor may not get back the amount invested.'
}];
function A4({
  family,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "a4",
    "data-family": family,
    "data-screen-label": "factsheet-page",
    style: {
      width: '210mm',
      minHeight: '297mm',
      background: 'var(--surface-page)',
      color: 'var(--doc-ink)',
      fontFamily: 'var(--font-body)',
      padding: 'var(--page-margin)',
      boxSizing: 'border-box',
      boxShadow: 'var(--shadow-sheet)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      ...style
    }
  }, children);
}
const Lead = ({
  children
}) => /*#__PURE__*/React.createElement("p", {
  style: {
    fontSize: '11px',
    lineHeight: 1.5,
    color: 'var(--ink-700)',
    margin: '0 0 8px',
    textWrap: 'pretty'
  }
}, children);
const Bullets = ({
  items
}) => /*#__PURE__*/React.createElement("ul", {
  style: {
    margin: '0 0 8px',
    padding: 0,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  }
}, items.map((b, i) => /*#__PURE__*/React.createElement("li", {
  key: i,
  style: {
    display: 'flex',
    gap: '6px',
    fontSize: '10.5px',
    lineHeight: 1.4,
    color: 'var(--ink-700)'
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    color: 'var(--accent)',
    fontWeight: 700
  }
}, "\u2713"), /*#__PURE__*/React.createElement("span", null, b))));
const Foot = ({
  children
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: '8px',
    color: 'var(--ink-400)',
    marginTop: '4px'
  }
}, children);

/* Page footer pinned to bottom of the sheet */
function PageFoot({
  left,
  page,
  total = 2
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      paddingTop: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '8px',
      color: 'var(--ink-400)',
      borderTop: '0.75px solid var(--doc-line)'
    }
  }, /*#__PURE__*/React.createElement("span", null, left), /*#__PURE__*/React.createElement("span", null, "Page ", page, " of ", total));
}
/* Compact running header for continuation pages */
function MiniHeader({
  d,
  variant = 'underline',
  serif = false,
  logo
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '2px solid var(--accent)',
      paddingBottom: '6px',
      marginBottom: '10px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: serif ? 'var(--font-serif)' : 'var(--font-body)',
      fontWeight: serif ? 600 : 800,
      fontSize: serif ? '18px' : '15px',
      color: 'var(--accent)',
      letterSpacing: serif ? 0 : '-0.01em'
    }
  }, d.meta.fundName), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '8px',
      color: 'var(--ink-400)',
      textTransform: 'uppercase',
      letterSpacing: '.08em'
    }
  }, d.meta.asOf, " \xB7 Marketing Material"), logo && /*#__PURE__*/React.createElement("img", {
    src: LOGO(logo),
    style: {
      height: '20px'
    }
  })));
}
function PerfDuo({
  d,
  base = 100
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionTitle, {
    variant: "underline"
  }, "Performance Since Inception"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '6px'
    }
  }), /*#__PURE__*/React.createElement(VCum, {
    monthly: d.monthly,
    base: base,
    height: 132,
    id: "perf-cum",
    title: "Performance Since Inception"
  }), /*#__PURE__*/React.createElement(Foot, null, "Rebased to ", base, " at inception \xB7 net of costs."), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '10px'
    }
  }), /*#__PURE__*/React.createElement(SectionTitle, {
    variant: "underline"
  }, "Monthly Performance vs Zero"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '6px'
    }
  }), /*#__PURE__*/React.createElement(VBars, {
    monthly: d.monthly,
    height: 104,
    id: "perf-bars",
    title: "Monthly Performance vs Zero"
  }));
}

/* Shared "Other Share Classes" table block (dynamic rows AND columns) reused by all families */
function shareClassBlock(d) {
  return {
    key: 'shareclasses',
    kind: 'table',
    w: 'full',
    title: 'Other Share Classes',
    accentHeader: true,
    zebra: true,
    columns: [{
      key: 'name',
      label: 'Class'
    }, {
      key: 'isin',
      label: 'ISIN',
      mono: true
    }, {
      key: 'ccy',
      label: 'Ccy',
      align: 'center'
    }, {
      key: 'nav',
      label: 'NAV',
      type: 'num',
      dp: 2
    }, {
      key: 'ytd',
      label: 'YTD',
      type: 'pct'
    }],
    rows: (d.shareClasses || []).map(s => ({
      name: s.name,
      isin: s.isin,
      ccy: s.ccy,
      nav: s.nav,
      ytd: +((s.ytd || 0) * 100).toFixed(2)
    }))
  };
}

/* ============================================================ VG / AQA ============================================================ */
function VGFactsheet({
  d
}) {
  const isMBC = d.layout === 'vg-mbc';
  const pageTotal = window.__pageTotal ? window.__pageTotal('vg', [{
    id: 'vg-p2'
  }], 1) : 2;

  /* page-2 freeform canvas: seeded preset blocks, plus user-created blocks */
  const seed2 = [{
    key: 'breakdown',
    kind: 'preset',
    preset: 'breakdown',
    w: 'full'
  }, shareClassBlock(d), {
    key: 'disclaimer',
    kind: 'text',
    w: 'full',
    size: 'fine',
    title: 'Disclaimer',
    text: DISCLAIMER.map(b => b.heading + ' ' + b.body).join('\n\n')
  }];
  const presets2 = {
    breakdown: () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionTitle, {
      variant: "underline"
    }, isMBC ? 'Asset Allocation — Strategy Breakdown' : 'Sectorial Allocation — Passive vs Active'), /*#__PURE__*/React.createElement("div", {
      style: {
        height: '8px'
      }
    }), isMBC ? /*#__PURE__*/React.createElement(StrategyTable, {
      rows: d.strategy
    }) : /*#__PURE__*/React.createElement(PassiveActiveTable, {
      rows: d.sectors
    })),
    shareclasses: () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionTitle, {
      variant: "underline"
    }, "Other Share Classes"), /*#__PURE__*/React.createElement("div", {
      style: {
        height: '8px'
      }
    }), /*#__PURE__*/React.createElement(ShareClassEditable, {
      rows: d.shareClasses
    }))
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(A4, {
    family: "vg"
  }, /*#__PURE__*/React.createElement(BrandHeader, {
    date: `Monthly Factsheet · ${d.meta.asOf}`,
    eyebrow: "Marketing Material",
    tag: d.meta.category,
    logos: d.logos.map(l => ({
      ...l,
      src: LOGO(l.src)
    }))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: '12px',
      margin: '12px 0 10px'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 800,
      fontSize: '23px',
      letterSpacing: '-0.02em',
      lineHeight: 1.05,
      margin: 0,
      color: 'var(--accent)'
    }
  }, d.meta.fundName), /*#__PURE__*/React.createElement(Badge, {
    tone: "accent",
    style: {
      flex: '0 0 auto',
      whiteSpace: 'nowrap'
    }
  }, d.meta.shareClass)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '6mm',
      alignItems: 'stretch'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, {
    variant: "underline"
  }, "Fund's Mission"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '6px'
    }
  }), /*#__PURE__*/React.createElement(Lead, null, d.mission), /*#__PURE__*/React.createElement(SectionTitle, {
    variant: "underline"
  }, "Objective & Strategy"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '6px'
    }
  }), /*#__PURE__*/React.createElement(Bullets, {
    items: d.objective
  }), /*#__PURE__*/React.createElement(SectionTitle, {
    variant: "underline"
  }, "Investment Process"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '6px'
    }
  }), /*#__PURE__*/React.createElement(Lead, null, d.process), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '18px',
      marginTop: 'auto',
      paddingTop: '12px',
      padding: '10px 12px',
      background: 'var(--doc-mist)',
      borderRadius: '4px'
    }
  }, /*#__PURE__*/React.createElement(KpiStat, {
    label: "NAV / Share",
    value: d.nutshell.nav
  }), /*#__PURE__*/React.createElement(KpiStat, {
    label: "Perf YTD",
    value: /*#__PURE__*/React.createElement(PerfValue, {
      value: d.nutshell.ytd,
      weight: 800
    }),
    accent: true
  }), /*#__PURE__*/React.createElement(KpiStat, {
    label: "Fund Size",
    value: d.nutshell.fundSize
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, {
    variant: "underline"
  }, "General Information & Costs"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '6px'
    }
  }), /*#__PURE__*/React.createElement(GeneralInfoEditable, {
    rows: d.generalInfo
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      columnGap: '18px',
      rowGap: '5px',
      alignItems: 'start',
      marginTop: 'auto',
      paddingTop: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '9px',
      textTransform: 'uppercase',
      letterSpacing: '.06em',
      color: 'var(--ink-500)',
      fontWeight: 600
    }
  }, "Risk Category (SRI)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '9px',
      textTransform: 'uppercase',
      letterSpacing: '.06em',
      color: 'var(--ink-500)',
      fontWeight: 600
    }
  }, "SFDR"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(RiskScale, {
    value: d.risk
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      justifySelf: 'start'
    }
  }, /*#__PURE__*/React.createElement(SfdrBadge, {
    value: d.sfdr
  }))))), /*#__PURE__*/React.createElement(ModuleGrid, {
    style: {
      marginTop: '10px'
    }
  }, /*#__PURE__*/React.createElement(Module, {
    id: "p1-cum",
    order: 1,
    title: "Performance Since Inception",
    width: "full"
  }, /*#__PURE__*/React.createElement(SectionTitle, {
    variant: "underline"
  }, "Performance Since Inception"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '6px'
    }
  }), /*#__PURE__*/React.createElement(VCum, {
    monthly: d.monthly,
    base: 100,
    height: 132,
    id: "perf-cum",
    title: "Performance Since Inception"
  }), /*#__PURE__*/React.createElement(Foot, null, "Rebased to 100 at inception \xB7 net of costs.")), /*#__PURE__*/React.createElement(Module, {
    id: "p1-bars",
    order: 2,
    title: "Monthly Performance vs Zero",
    width: "full"
  }, /*#__PURE__*/React.createElement(SectionTitle, {
    variant: "underline"
  }, "Monthly Performance vs Zero"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '6px'
    }
  }), /*#__PURE__*/React.createElement(VBars, {
    monthly: d.monthly,
    height: 96,
    id: "perf-bars",
    title: "Monthly Performance vs Zero"
  })), /*#__PURE__*/React.createElement(Module, {
    id: "p1-table",
    order: 3,
    title: "Monthly Performance (since inception)",
    width: "full",
    swap: ['table', 'chart']
  }, view => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionTitle, {
    variant: "underline"
  }, "Monthly Performance (since inception)"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '6px'
    }
  }), view === 'chart' ? /*#__PURE__*/React.createElement(VBars, {
    monthly: d.monthly,
    height: 120,
    id: "perf-table-chart",
    title: "Monthly Performance"
  }) : /*#__PURE__*/React.createElement(MonthlyReturnsTable, {
    data: d.monthly
  })))), /*#__PURE__*/React.createElement(PageFoot, {
    left: "VG SICAV SA \xB7 UCITS \xB7 Luxembourg \u2014 reserved to professional investors",
    page: 1,
    total: pageTotal
  })), /*#__PURE__*/React.createElement(CanvasPages, {
    docKey: "vg",
    family: "vg",
    d: d,
    logo: d.logos[0].src,
    footerLeft: "More information: info@aqa-capital.com \xB7 www.aqa-capital.com",
    presets: presets2,
    pagesSeed: [{
      id: 'vg-p2'
    }],
    blockSeeds: {
      'vg-p2': seed2
    },
    fixedBefore: 1
  }));
}

/* General Information & Costs as an editable key/value table (+/− rows) */
function GeneralInfoEditable({
  rows
}) {
  const data = rows.map(r => ({
    label: r.label,
    value: r.value
  }));
  return /*#__PURE__*/React.createElement(EditableTable, {
    id: "vg-geninfo",
    noHead: true,
    rows: data,
    columns: [{
      key: 'label',
      color: () => 'var(--ink-600)'
    }, {
      key: 'value',
      align: 'right',
      bold: true
    }]
  });
}

/* Passive-vs-Active sectors as an editable table (sector · bar · passive · active · total) */
function PassiveActiveTable({
  rows
}) {
  const data = rows.map(s => ({
    sector: s.sector,
    passive: +(s.passive * 100).toFixed(2),
    active: +(s.active * 100).toFixed(2)
  }));
  const REF = 40; // bar scale reference (%)
  const bar = r => {
    const tot = (+r.passive || 0) + (+r.active || 0);
    const pw = tot ? +r.passive / tot * 100 : 0;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        height: '8px',
        width: `${Math.min(100, tot / REF * 100)}%`,
        borderRadius: '2px',
        overflow: 'hidden',
        minWidth: '4px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${pw}%`,
        background: 'var(--cat-3)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${100 - pw}%`,
        background: 'var(--accent)'
      }
    }));
  };
  return /*#__PURE__*/React.createElement(EditableTable, {
    id: "vg-pa",
    rows: data,
    columns: [{
      key: 'sector',
      label: 'Sector'
    }, {
      key: 'bar',
      label: '',
      compute: bar,
      width: '34%'
    }, {
      key: 'passive',
      label: 'Passive',
      type: 'pct',
      color: () => 'var(--cat-3)'
    }, {
      key: 'active',
      label: 'Active',
      type: 'pct',
      color: () => 'var(--accent)'
    }, {
      key: 'total',
      label: 'Total',
      type: 'pct',
      bold: true,
      compute: r => ((+r.passive || 0) + (+r.active || 0)).toFixed(2) + '%'
    }]
  });
}

/* MBC strategy weights as an editable table */
function StrategyTable({
  rows
}) {
  const data = rows.map(s => ({
    name: s.name,
    weight: +(s.weight * 100).toFixed(2)
  }));
  const max = Math.max(...data.map(r => r.weight), 1);
  return /*#__PURE__*/React.createElement(EditableTable, {
    id: "vg-strategy",
    rows: data,
    columns: [{
      key: 'name',
      label: 'Strategy'
    }, {
      key: 'bar',
      label: '',
      width: '34%',
      compute: r => /*#__PURE__*/React.createElement("div", {
        style: {
          height: '8px',
          width: `${r.weight / max * 100}%`,
          minWidth: '4px',
          background: 'var(--accent)',
          borderRadius: '2px'
        }
      })
    }, {
      key: 'weight',
      label: 'Wgt %',
      type: 'pct',
      bold: true
    }]
  });
}

/* Share classes as an editable table */
function ShareClassEditable({
  rows
}) {
  const data = rows.map(s => ({
    name: s.name,
    isin: s.isin,
    ccy: s.ccy,
    nav: s.nav,
    ytd: +(s.ytd * 100).toFixed(2)
  }));
  return /*#__PURE__*/React.createElement(EditableTable, {
    id: "vg-sc",
    accentHeader: true,
    zebra: true,
    rows: data,
    columns: [{
      key: 'name',
      label: 'Class'
    }, {
      key: 'isin',
      label: 'ISIN',
      mono: true
    }, {
      key: 'ccy',
      label: 'Ccy',
      align: 'center'
    }, {
      key: 'nav',
      label: 'NAV',
      type: 'num',
      dp: 2
    }, {
      key: 'ytd',
      label: 'YTD',
      type: 'pct',
      bold: true,
      color: r => +r.ytd >= 0 ? 'var(--pos)' : 'var(--neg)'
    }]
  });
}
window.Factsheets = {
  VGFactsheet,
  A4,
  DISCLAIMER,
  Lead,
  Bullets,
  Foot,
  LOGO,
  PageFoot,
  MiniHeader,
  PerfDuo,
  shareClassBlock
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "exports/lfg-handoff/02-factsheet-editor/factsheet/FactsheetVG.jsx", error: String((e && e.message) || e) }); }

// exports/lfg-handoff/02-factsheet-editor/factsheet/FactsheetZest.jsx
try { (() => {
/* Zest AM SICAV factsheet — navy/teal, dense Morningstar-style module grid. */
const DSz = window.FundFactsheetDesignSystem_2d23bc;
const {
  SectionTitle: ZSection,
  Badge: ZBadge,
  KpiStat: ZKpi,
  InfoTable: ZInfo,
  MonthlyReturnsTable: ZMonthly,
  HoldingsTable: ZHoldings,
  FundManagerBio: ZBio,
  Disclaimer: ZDisc,
  PerfValue: ZPerf,
  RiskScale: ZRisk,
  SfdrBadge: ZSfdr
} = DSz;
const {
  CumulativeChart: ZCum,
  Donut: ZDonut,
  CatChart: ZCat
} = window.KitCharts;
const ZMBars = window.KitCharts.MonthlyBars;
const {
  A4: ZA4,
  DISCLAIMER: ZDISC,
  Lead: ZLead,
  LOGO: ZLOGO,
  Bullets: ZBullets,
  PageFoot: ZFoot,
  MiniHeader: ZMini
} = window.Factsheets;
const {
  CanvasPages: ZCanvasPages,
  EditableTable: ZEditable,
  ModuleGrid: ZGrid,
  Module: ZMod
} = window.KitLayout;

/* General Information & Costs as an editable key/value table — Zest style */
function ZGenInfo({
  rows,
  id
}) {
  return /*#__PURE__*/React.createElement(ZEditable, {
    id: id,
    noHead: true,
    rows: rows.map(r => ({
      label: r.label,
      value: r.value
    })),
    columns: [{
      key: 'label',
      color: () => 'var(--ink-600)'
    }, {
      key: 'value',
      align: 'right',
      bold: true
    }]
  });
}
const ZLabel = ({
  children
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: '8.5px',
    textTransform: 'uppercase',
    letterSpacing: '.06em',
    color: 'var(--accent-2)',
    fontWeight: 700,
    marginBottom: '5px'
  }
}, children);
function ZDonutBlock({
  data,
  id,
  title
}) {
  const cats = ['#14153e', '#2e5f9e', '#0f4c7d', '#5b8cc4', '#8aa9d2', '#b8c6d8'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement(ZDonut, {
    data: data,
    size: 88,
    thickness: 17,
    id: id,
    title: title
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
      flex: 1
    }
  }, data.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '9px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: '9px',
      height: '9px',
      borderRadius: '2px',
      background: r.color || cats[i % cats.length]
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      color: 'var(--doc-ink)'
    }
  }, r.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 700
    }
  }, (r.weight * 100).toFixed(1), "%")))));
}
function Stars({
  n = 4
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent-2)',
      fontSize: '14px',
      letterSpacing: '2px'
    }
  }, '★'.repeat(n), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--line-strong)'
    }
  }, '★'.repeat(5 - n)));
}
function ZModule({
  title,
  children,
  span = 1
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: `span ${span}`,
      border: '1px solid var(--doc-line)',
      borderRadius: '4px',
      overflow: 'hidden',
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--doc-mist)',
      color: 'var(--accent)',
      fontSize: '8.5px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '.06em',
      padding: '5px 8px',
      borderBottom: '1px solid var(--doc-line)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px'
    }
  }, children));
}
function ZBars({
  data,
  id,
  title
}) {
  return /*#__PURE__*/React.createElement(ZCat, {
    data: data,
    type: "bar",
    compact: true,
    id: id,
    title: title
  });
}
function ZSleeveBanner({
  label,
  weight,
  accent
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gridColumn: '1 / -1',
      background: accent ? 'var(--accent)' : 'var(--accent-2)',
      color: '#fff',
      padding: '6px 12px',
      borderRadius: '4px',
      marginTop: '4px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-geometric)',
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '.1em',
      textTransform: 'uppercase'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: '13px',
      fontWeight: 700
    }
  }, (weight * 100).toFixed(1), "% of NAV"));
}
function ZMiniKpi({
  label,
  value
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '7.5px',
      textTransform: 'uppercase',
      letterSpacing: '.05em',
      color: 'var(--ink-500)',
      fontWeight: 600
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: '13px',
      fontWeight: 700,
      color: 'var(--accent)'
    }
  }, value));
}
function ZestFactsheet({
  d
}) {
  const balanced = !!d.balanced;
  const pageTotal = window.__pageTotal ? window.__pageTotal('zest', d.balanced ? [{
    id: 'zest-p2'
  }, {
    id: 'zest-p3'
  }] : [{
    id: 'zest-p2'
  }], 1) : d.balanced ? 3 : 2;

  /* page-2 seed = self-contained, individually copyable blocks (charts/tables/text) */
  const ser = (arr, k = 'weight') => (arr || []).map(r => ({
    name: r.name || r.sector,
    value: +((r[k] || 0) * 100).toFixed(2)
  }));
  const kvCols = [{
    key: 'label'
  }, {
    key: 'value',
    align: 'right',
    bold: true
  }];
  const disclaimerBlock = {
    key: 'disclaimer',
    kind: 'text',
    w: 'full',
    size: 'fine',
    title: 'Disclaimer',
    text: ZDISC.map(b => b.heading + ' ' + b.body).join('\n\n')
  };
  const seed2 = balanced ? [{
    key: 'alloc',
    kind: 'chart',
    w: 'third',
    title: 'Asset Allocation',
    chartType: 'donut',
    series: ser(d.allocation)
  }, {
    key: 'currency',
    kind: 'chart',
    w: 'third',
    title: 'Currency Allocation',
    chartType: 'bar',
    series: ser(d.currency)
  }, {
    key: 'metrics',
    kind: 'table',
    w: 'third',
    title: 'Portfolio Metrics',
    noHead: true,
    columns: kvCols,
    rows: d.metrics.map(r => ({
      ...r
    }))
  }, {
    key: 'eq-head',
    kind: 'banner',
    w: 'full',
    accent: true,
    title: 'Equity Sleeve',
    value: (d.equitySleeve.weight * 100).toFixed(1) + '% of NAV',
    sub: 'Perf MTD ' + (d.equitySleeve.perfMtd * 100).toFixed(2) + '%   ·   Contribution +' + (d.equitySleeve.contribution * 100).toFixed(2) + '%   ·   ' + d.equitySleeve.names + ' holdings'
  }, {
    key: 'eq-sectors',
    kind: 'chart',
    w: 'half',
    title: 'Equity — Sector Exposure',
    chartType: 'bar',
    series: ser(d.equitySleeve.sectors)
  }, {
    key: 'eq-holdings',
    kind: 'chart',
    w: 'half',
    title: 'Top Equity Holdings',
    chartType: 'bar',
    series: ser(d.holdings.slice(0, 8))
  }, {
    key: 'fi-head',
    kind: 'banner',
    w: 'full',
    accent: false,
    title: 'Fixed Income Sleeve',
    value: (d.fiSleeve.weight * 100).toFixed(1) + '% of NAV',
    sub: 'Yield to Maturity ' + (d.fiSleeve.ytm * 100).toFixed(2) + '%   ·   Duration ' + d.fiSleeve.duration + '   ·   ' + d.fiSleeve.issuers + ' issuers'
  }, {
    key: 'fi-ratings',
    kind: 'chart',
    w: 'half',
    title: 'Rating Breakdown',
    chartType: 'bar',
    series: ser(d.fiSleeve.ratings)
  }, {
    key: 'fi-credit',
    kind: 'table',
    w: 'half',
    title: 'Credit Quality',
    noHead: true,
    columns: kvCols,
    rows: [{
      label: 'IG / HY — by Issuer',
      value: d.fiSleeve.igHyIssuer
    }, {
      label: 'IG / HY — by Issue',
      value: d.fiSleeve.igHyIssue
    }, {
      label: 'Average Yield to Maturity',
      value: (d.fiSleeve.ytm * 100).toFixed(2) + '%'
    }, {
      label: 'Modified Duration',
      value: String(d.fiSleeve.duration)
    }]
  }] : d.napr ? [{
    key: 'sectors',
    kind: 'chart',
    w: 'two-thirds',
    title: 'GICS Sector Allocation',
    chartType: 'bar',
    series: ser(d.sectors)
  }, {
    key: 'geography',
    kind: 'chart',
    w: 'third',
    title: 'Geographic Allocation',
    chartType: 'bar',
    series: ser(d.countries)
  }, {
    key: 'holdings',
    kind: 'table',
    w: 'full',
    title: 'Top 10 Holdings — Equity Sleeve',
    accentHeader: true,
    zebra: true,
    columns: [{
      key: 'name',
      label: 'Security'
    }, {
      key: 'sector',
      label: 'GICS Sector'
    }, {
      key: 'ccy',
      label: 'Ccy',
      align: 'center'
    }, {
      key: 'weight',
      label: 'Weight',
      type: 'pct',
      dp: 2
    }],
    rows: (d.holdings || []).map(h => ({
      name: h.name,
      sector: h.sector || '',
      ccy: h.ccy || 'USD',
      weight: +((h.weight || 0) * 100).toFixed(2)
    }))
  }, Object.assign({}, window.Factsheets.shareClassBlock(d), {
    w: 'full'
  }), {
    key: 'fees',
    kind: 'table',
    w: 'half',
    title: 'Fees & Classification',
    noHead: true,
    columns: kvCols,
    rows: d.generalInfo.slice(8).map(r => ({
      label: r.label,
      value: r.value
    }))
  }, {
    key: 'currency',
    kind: 'chart',
    w: 'half',
    title: 'Currency Allocation',
    chartType: 'bar',
    series: ser(d.currency || [{
      name: 'USD',
      weight: 1
    }])
  }, disclaimerBlock] : [{
    key: 'countries',
    kind: 'chart',
    w: 'third',
    title: 'Exposure by Country',
    chartType: 'bar',
    series: ser((d.countries || []).slice(0, 7))
  }, {
    key: 'sectors',
    kind: 'chart',
    w: 'third',
    title: 'Equity Sectors',
    chartType: 'bar',
    series: ser((d.sectors || []).slice(0, 7))
  }, {
    key: 'holdings',
    kind: 'chart',
    w: 'third',
    title: 'Top Holdings',
    chartType: 'bar',
    series: ser(d.holdings || [])
  }, {
    key: 'manager',
    kind: 'text',
    w: 'half',
    title: 'Fund Manager',
    text: d.manager.name + ' — ' + d.manager.role + '\n\n' + d.manager.bio
  }, {
    key: 'fees',
    kind: 'table',
    w: 'half',
    title: 'Fees & Classification',
    noHead: true,
    columns: kvCols,
    rows: d.generalInfo.slice(8).map(r => ({
      label: r.label,
      value: r.value
    }))
  }, window.Factsheets.shareClassBlock(d), disclaimerBlock];
  const presets2 = {};
  /* balanced fund spills share classes + disclaimer onto a second canvas page so each stays within A4 */
  const seed3 = [window.Factsheets.shareClassBlock(d), disclaimerBlock];
  const zPagesSeed = balanced ? [{
    id: 'zest-p2'
  }, {
    id: 'zest-p3'
  }] : [{
    id: 'zest-p2'
  }];
  const zBlockSeeds = balanced ? {
    'zest-p2': seed2,
    'zest-p3': seed3
  } : {
    'zest-p2': seed2
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ZA4, {
    family: "zest"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      borderBottom: '2px solid var(--accent)',
      paddingBottom: '8px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-geometric)',
      fontSize: '24px',
      fontWeight: 600,
      letterSpacing: '.04em',
      textTransform: 'uppercase',
      color: 'var(--accent)',
      lineHeight: 1
    }
  }, d.meta.fundName), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-geometric)',
      fontSize: '12px',
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: 'var(--accent-2)',
      marginTop: '3px'
    }
  }, d.meta.subtitle, " \xB7 ", d.meta.shareClass)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--accent)',
      padding: '6px 8px',
      borderRadius: '4px',
      display: 'inline-block'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: ZLOGO('zest-am-sicav.png'),
    style: {
      height: '26px',
      display: 'block',
      marginLeft: 'auto'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '8px',
      color: 'var(--ink-400)',
      marginTop: '4px'
    }
  }, "As of ", d.meta.asOf, " \xB7 Marketing Material"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '6mm',
      marginTop: '10px',
      alignItems: 'stretch'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(ZSection, {
    variant: "underline"
  }, "Fund's Mission"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '6px'
    }
  }), /*#__PURE__*/React.createElement(ZLead, null, d.mission), balanced && /*#__PURE__*/React.createElement(ZBullets, {
    items: d.objective
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '22px',
      alignItems: 'center',
      marginTop: 'auto',
      padding: '10px 14px',
      background: 'var(--doc-mist)',
      borderRadius: '4px'
    }
  }, /*#__PURE__*/React.createElement(ZKpi, {
    label: "NAV / Share",
    value: d.nutshell.nav
  }), /*#__PURE__*/React.createElement(ZKpi, {
    label: "Perf YTD",
    value: /*#__PURE__*/React.createElement(ZPerf, {
      value: d.nutshell.ytd,
      weight: 800
    }),
    accent: true
  }), /*#__PURE__*/React.createElement(ZKpi, {
    label: "Fund Size",
    value: d.nutshell.fundSize
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(ZSection, {
    variant: "underline"
  }, "General Information & Costs"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '6px'
    }
  }), /*#__PURE__*/React.createElement(ZGenInfo, {
    id: d.layout + '-geninfo',
    rows: d.generalInfo.slice(0, 8)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      columnGap: '18px',
      rowGap: '5px',
      alignItems: 'start',
      marginTop: 'auto',
      paddingTop: '14px'
    }
  }, /*#__PURE__*/React.createElement(ZLabel, null, "Risk Category (SRI)"), /*#__PURE__*/React.createElement(ZLabel, null, "SFDR"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ZRisk, {
    value: d.risk
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      justifySelf: 'start'
    }
  }, /*#__PURE__*/React.createElement(ZSfdr, {
    value: d.sfdr
  }))))), /*#__PURE__*/React.createElement(ZGrid, {
    style: {
      marginTop: '10px'
    }
  }, /*#__PURE__*/React.createElement(ZMod, {
    id: "zp1-cum",
    order: 1,
    title: "Performance Since Inception",
    width: "full"
  }, /*#__PURE__*/React.createElement(ZModule, {
    title: "Performance Since Inception"
  }, /*#__PURE__*/React.createElement(ZCum, {
    monthly: d.monthly,
    base: d.startNav || 100,
    height: 148,
    id: "perf-cum",
    title: "Performance Since Inception"
  }))), /*#__PURE__*/React.createElement(ZMod, {
    id: "zp1-bars",
    order: 2,
    title: "Monthly Performance vs Zero",
    width: "full"
  }, /*#__PURE__*/React.createElement(ZModule, {
    title: "Monthly Performance vs Zero"
  }, /*#__PURE__*/React.createElement(ZMBars, {
    monthly: d.monthly,
    height: 132,
    id: "perf-bars",
    title: "Monthly Performance vs Zero"
  }))), /*#__PURE__*/React.createElement(ZMod, {
    id: "zp1-table",
    order: 3,
    title: "Monthly Performance (since inception)",
    width: "full",
    swap: ['table', 'chart']
  }, view => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ZSection, {
    variant: "underline"
  }, "Monthly Performance (since inception)"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '6px'
    }
  }), view === 'chart' ? /*#__PURE__*/React.createElement(ZMBars, {
    monthly: d.monthly,
    height: 110,
    id: "perf-table-chart",
    title: "Monthly Performance"
  }) : /*#__PURE__*/React.createElement(ZMonthly, {
    data: d.monthly
  })))), /*#__PURE__*/React.createElement(ZFoot, {
    left: "Zest Asset Management SICAV \xB7 UCITS \xB7 Luxembourg (RCS B 130156)",
    page: 1,
    total: pageTotal
  })), /*#__PURE__*/React.createElement(ZCanvasPages, {
    docKey: "zest",
    family: "zest",
    d: d,
    logo: "zest-am-sicav.png",
    footerLeft: "Source: Official NAV & Bloomberg \xB7 Distributed by LFG+Zest SA \xB7 info@lfgzest.com",
    presets: presets2,
    pagesSeed: zPagesSeed,
    blockSeeds: zBlockSeeds,
    fixedBefore: 1
  }));
}
window.Factsheets.ZestFactsheet = ZestFactsheet;
})(); } catch (e) { __ds_ns.__errors.push({ path: "exports/lfg-handoff/02-factsheet-editor/factsheet/FactsheetZest.jsx", error: String((e && e.message) || e) }); }

// exports/lfg-handoff/02-factsheet-editor/factsheet/chart-bridge.js
try { (() => {
/* Bridge between the factsheet data object and Chart Studio.
   - editableSeries(d): list the charts in a fund that can be opened in the studio.
   - applyModel(d, slot, model): write a studio model back into the fund object
     (mutates a clone the caller owns) and return it. Categorical edits change the
     underlying numbers; the performance slot maps month rows back to d.monthly and
     records type/colour in window.__perfStyle for the cumulative chart to honour. */
(function () {
  const MUP = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  function getDeep(o, path) {
    return path.split('.').reduce((t, k) => t ? t[k] : undefined, o);
  }
  function setDeep(o, path, v) {
    const ks = path.split('.');
    let t = o;
    while (ks.length > 1) {
      const k = ks.shift();
      t = t[k] = t[k] || {};
    }
    t[ks[0]] = v;
  }
  const CAT = (field, title, type) => ({
    field,
    title,
    type
  });
  const CANDIDATES = [CAT('allocation', 'Asset Allocation', 'donut'), CAT('currency', 'Currency Allocation', 'donut'), CAT('sectors', 'Equity Sectors', 'bar'), CAT('countries', 'Exposure by Country', 'bar'), CAT('strategy', 'Strategy Breakdown', 'bar'), CAT('holdings', 'Top Holdings', 'bar'), CAT('equitySleeve.sectors', 'Equity Sleeve — Sectors', 'bar'), CAT('fiSleeve.ratings', 'Fixed Income — Ratings', 'column')];
  function flatMonthly(monthly) {
    const out = [];
    Object.keys(monthly).sort().forEach(y => MUP.forEach(m => {
      const v = monthly[y][m];
      if (v !== undefined && v !== null) out.push({
        y,
        m,
        name: `${m} ${y.slice(2)}`,
        value: +(v * 100).toFixed(3)
      });
    }));
    return out;
  }
  function editableSeries(d) {
    const list = [{
      slot: 'perf',
      title: 'Performance (monthly returns)',
      type: (window.__perfStyle || {}).type || 'area',
      kinds: ['area', 'line', 'column', 'bar'],
      series: flatMonthly(d.monthly)
    }];
    CANDIDATES.forEach(c => {
      const arr = getDeep(d, c.field);
      if (Array.isArray(arr) && arr.length && typeof arr[0].weight === 'number') {
        list.push({
          slot: c.field,
          title: c.title,
          type: c.type,
          kinds: ['bar', 'column', 'donut', 'pie', 'rose', 'treemap', 'funnel'],
          series: arr.map(r => ({
            name: r.name || r.sector,
            value: +((r.weight || 0) * 100).toFixed(2),
            color: r.color
          }))
        });
      }
    });
    return list;
  }
  function applyModel(d, slot, model) {
    if (slot === 'perf') {
      window.__perfStyle = d._perf = {
        type: model.type,
        color: (model.series.find(s => s.color) || {}).color
      };
      // map edited month rows back into the matrix
      const flat = flatMonthly(d.monthly);
      model.series.forEach((s, i) => {
        const f = flat[i];
        if (f && d.monthly[f.y]) d.monthly[f.y][f.m] = +s.value / 100;
      });
      // recompute YTD per year + nutshell
      Object.keys(d.monthly).forEach(y => {
        let c = 1,
          any = false;
        MUP.forEach(m => {
          const v = d.monthly[y][m];
          if (v != null) {
            c *= 1 + v;
            any = true;
          }
        });
        if (any) d.monthly[y].YTD = +(c - 1).toFixed(6);
      });
      const years = Object.keys(d.monthly).sort();
      const last = d.monthly[years[years.length - 1]];
      if (last && last.YTD != null) d.nutshell.ytd = last.YTD;
      return d;
    }
    // categorical: write weights + colours back
    const arr = getDeep(d, slot) || [];
    const next = model.series.map((s, i) => ({
      ...(arr[i] || {}),
      name: s.name,
      sector: s.name,
      weight: +s.value / 100,
      color: s.color
    }));
    setDeep(d, slot, next);
    return d;
  }
  window.FactsheetCharts = {
    editableSeries,
    applyModel
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "exports/lfg-handoff/02-factsheet-editor/factsheet/chart-bridge.js", error: String((e && e.message) || e) }); }

// exports/lfg-handoff/02-factsheet-editor/factsheet/data.js
try { (() => {
/* ============================================================
   Sample FundData — extracted from the 5 real marketing factsheets.
   Mirrors the FundData schema in ARCHITECTURE.md. Window global.
   Returns are decimal fractions. Demo / marketing figures only.
   ============================================================ */
window.FUND_DATA = {
  /* ---------------- VG / AQA ---------------- */
  'prime-guard': {
    family: 'vg',
    layout: 'vg-prime',
    meta: {
      fundName: 'Prime Guard US Fund',
      shareClass: 'Class I USD',
      asOf: '31.05.2026',
      category: 'Long US Equity',
      navFreq: 'Daily'
    },
    logos: [{
      src: 'aqa-capital.png',
      role: 'ManCo & IM',
      h: 30
    }],
    nutshell: {
      nav: '118.77',
      ytd: 0.099,
      fundSize: 'USD 46.1M'
    },
    mission: 'The Fund provides investors with a strategic mix of passive and active exposure to the largest US stocks, balancing market correlation with targeted alpha generation and risk management.',
    objective: ['Passive Tracking (≈55%) of the largest US stocks', 'Alpha Generation (≈45%) — actively manages 60–100 US stocks via proprietary models', 'Drawdown Control — hedging activated only in extreme market conditions'],
    process: 'The Active Exposure is based on a quantamental approach applied to the largest US companies, ranked through proprietary quant-fundamental models (the sector analyser and the stock selection model). Expected tracking error 2–3%.',
    generalInfo: [{
      label: 'Name',
      value: 'Prime Guard US Fund'
    }, {
      label: 'Legal form',
      value: 'Sub-fund of VG SICAV SA'
    }, {
      label: 'Regulatory status',
      value: 'UCITS'
    }, {
      label: 'Domicile',
      value: 'Luxembourg'
    }, {
      label: 'ManCo & IM',
      value: 'AQA Capital'
    }, {
      label: 'Depositary Bank',
      value: 'Swissquote Bank'
    }, {
      label: 'Fund Currency',
      value: 'USD'
    }, {
      label: 'ISIN',
      value: 'LU2962132416',
      mono: true
    }, {
      label: 'Min. Subscription',
      value: "20'000"
    }, {
      label: 'Management Fees',
      value: '1.20%'
    }, {
      label: 'Performance Fees (HWM)',
      value: '10%'
    }, {
      label: 'Ongoing charges (I)',
      value: '1.83%'
    }],
    risk: 5,
    sfdr: 'Art 6',
    monthly: {
      2025: {
        JAN: 0,
        FEB: -.0209,
        MAR: -.0637,
        APR: -.0022,
        MAY: .059,
        JUN: .0406,
        JUL: .0166,
        AUG: .0192,
        SEP: .0364,
        OCT: .0165,
        NOV: -.0045,
        DEC: -.0096,
        YTD: .085
      },
      2026: {
        JAN: .0227,
        FEB: -.0118,
        MAR: -.0439,
        APR: .0933,
        MAY: .0404,
        YTD: .099
      }
    },
    cumulative: 'monthly',
    // build series from monthly
    shareClasses: [{
      isin: 'LU2962132333',
      name: 'R-EUR',
      ccy: 'EUR',
      aum: 2022465.42,
      nav: 115.12,
      mtd: .0388,
      ytd: .0879
    }, {
      isin: 'LU2962132689',
      name: 'I-EUR',
      ccy: 'EUR',
      aum: 6601855.02,
      nav: 111.21,
      mtd: .0388,
      ytd: .0901
    }, {
      isin: 'LU2962132507',
      name: 'I-CHF',
      ccy: 'CHF',
      aum: 7090811.61,
      nav: 102.41,
      mtd: .0372,
      ytd: .0815
    }, {
      isin: 'LU2962132416',
      name: 'I-USD',
      ccy: 'USD',
      aum: 26994967.69,
      nav: 118.77,
      mtd: .0404,
      ytd: .099
    }],
    sectors: [
    // {sector, fund, passive, active}
    {
      sector: 'Information Technology',
      fund: .3845,
      passive: .2853,
      active: .0992
    }, {
      sector: 'Communication Services',
      fund: .1102,
      passive: .0899,
      active: .0203
    }, {
      sector: 'Financials',
      fund: .1125,
      passive: .0427,
      active: .0698
    }, {
      sector: 'Consumer Discretionary',
      fund: .1005,
      passive: .0608,
      active: .0397
    }, {
      sector: 'Industrials',
      fund: .087,
      passive: .0116,
      active: .0754
    }, {
      sector: 'Health Care',
      fund: .0864,
      passive: .0343,
      active: .0521
    }, {
      sector: 'Consumer Staples',
      fund: .0457,
      passive: .0202,
      active: .0255
    }, {
      sector: 'Energy',
      fund: .0331,
      passive: .015,
      active: .0181
    }, {
      sector: 'Utilities',
      fund: .0215,
      passive: 0,
      active: .0215
    }, {
      sector: 'Materials',
      fund: .0184,
      passive: 0,
      active: .0184
    }]
  },
  'mbc': {
    family: 'vg',
    layout: 'vg-mbc',
    meta: {
      fundName: 'MBC Diversified Fund',
      shareClass: 'I2 USD',
      asOf: '31.05.2026',
      category: 'Fund of Hedge Funds',
      navFreq: 'Daily'
    },
    logos: [{
      src: 'aqa-capital.png',
      role: 'ManCo & IM',
      h: 30
    }, {
      src: 'tages.png',
      role: 'Advisor',
      h: 22
    }],
    nutshell: {
      nav: '119.63',
      ytd: 0.0376,
      fundSize: 'EUR 11.6M'
    },
    mission: 'The MBC Diversified Fund is a UCITS portfolio with daily liquidity, leveraging a well-structured investment process to deliver stable returns.',
    objective: ['Limited beta to the equity market', 'Good protection capability in down markets', 'Expected target return roughly twice the volatility'],
    process: 'The investment strategy involves multi-layered screening and evaluation across manager research, capital allocation and risk management.',
    generalInfo: [{
      label: 'Name',
      value: 'MBC Diversified Fund'
    }, {
      label: 'Legal form',
      value: 'Sub-fund of VG SICAV SA'
    }, {
      label: 'Regulatory status',
      value: 'UCITS'
    }, {
      label: 'Domicile',
      value: 'Luxembourg'
    }, {
      label: 'ManCo & IM',
      value: 'AQA Capital Ltd.'
    }, {
      label: 'Depositary Bank',
      value: 'Swissquote Bank'
    }, {
      label: 'Fund Currency',
      value: 'EUR'
    }, {
      label: 'ISIN (I2 USD)',
      value: 'LU2853682941',
      mono: true
    }, {
      label: 'Min. Subscription',
      value: "50'000"
    }, {
      label: 'Management Fees',
      value: '1.50%'
    }, {
      label: 'Performance Fees (HWM)',
      value: '10%'
    }],
    risk: 4,
    sfdr: 'Art 8',
    monthly: {
      2024: {
        SEP: -.0027,
        OCT: -.0047,
        NOV: -.0029,
        DEC: -.0018,
        YTD: -.02
      },
      2025: {
        JAN: .0091,
        FEB: .0029,
        MAR: -.0037,
        APR: .005,
        MAY: .0224,
        JUN: -.0003,
        JUL: .0002,
        AUG: .0103,
        SEP: .0101,
        OCT: .0017,
        NOV: -.0031,
        DEC: .0098,
        YTD: .066
      },
      2026: {
        JAN: .0255,
        FEB: .0057,
        MAR: -.031,
        APR: .0329,
        MAY: .0053,
        YTD: .0376
      }
    },
    cumulative: 'monthly',
    shareClasses: [{
      isin: 'LU2853682941',
      name: 'I2-USD',
      ccy: 'USD',
      aum: 12381514.66,
      nav: 119.63,
      mtd: .0053,
      ytd: .0376
    }, {
      isin: 'LU2853682784',
      name: 'I2-EUR',
      ccy: 'EUR',
      aum: 201213.70,
      nav: 105.90,
      mtd: .0041,
      ytd: .032
    }],
    strategy: [{
      name: 'Global Macro',
      weight: .1735
    }, {
      name: 'Global Rates',
      weight: .1663
    }, {
      name: 'Engadine Long/Short Equity',
      weight: .1491
    }, {
      name: 'European Equity L/S',
      weight: .143
    }, {
      name: 'North America Long/Short Equity',
      weight: .1031
    }, {
      name: 'Event Driven',
      weight: .0953
    }, {
      name: 'Systematic Trend Following',
      weight: .0748
    }, {
      name: 'Global Bonds',
      weight: .0452
    }, {
      name: 'Global Equity Long Bias',
      weight: .0128
    }]
  },
  /* ---------------- HIVE / LFG·Zest ---------------- */
  'hive-equity': {
    family: 'hive',
    layout: 'hive-equity',
    cover: true,
    meta: {
      fundName: 'The Hive Equity Fund',
      subtitle: 'MONTHLY FACTSHEET',
      shareClass: 'USD',
      asOf: 'May 31, 2026',
      category: 'Long Equity',
      navFreq: 'Daily'
    },
    logos: [{
      src: 'lfg-zest-red.png',
      role: 'Investment Manager',
      h: 38
    }],
    nutshell: {
      nav: '141.31',
      ytd: 0.0919,
      fundSize: 'USD 12.4M'
    },
    risk: 5,
    sfdr: 'Art 6',
    shareClasses: [{
      isin: 'IE000036PHN0',
      name: 'Class USD',
      ccy: 'USD',
      aum: 9100000,
      nav: 141.31,
      mtd: .0387,
      ytd: .0919
    }, {
      isin: 'IE000RFV0ON0',
      name: 'Class EUR (hgd)',
      ccy: 'EUR',
      aum: 3300000,
      nav: 138.04,
      mtd: .0371,
      ytd: .0884
    }],
    mission: 'The Hive Equity Fund is a long equity fund designed as an optimal proposition for US taxable investors categorized as qualified purchasers under 3(c)(7) of the 1940 Act — offering K-1 reporting and remaining outside 40 Act registration and PFIC requirements.',
    strategyText: 'A strategy that blends passive and active investing for high correlation to the largest US companies (expected tracking error 2–3%): ≈55% passive exposure to the largest companies, ≈45% actively managed across 60–100 names (min. mkt cap $5bn), with drawdown control hedging activated only in extreme circumstances.',
    generalInfo: [{
      label: 'Investment Manager',
      value: 'LFG+Zest SA (CH)'
    }, {
      label: 'Portfolio Managers',
      value: 'A. Conca, G. Nicodemo'
    }, {
      label: 'Launch Date',
      value: 'September 2023'
    }, {
      label: 'AuM',
      value: 'USD 12.4 M'
    }, {
      label: 'Jurisdiction',
      value: 'Ireland'
    }, {
      label: 'Structure',
      value: 'ILP QIAIF'
    }, {
      label: 'Depositary & Admin',
      value: 'Caceis (IR)'
    }, {
      label: 'ManCo',
      value: 'AQA Capital (MT)'
    }, {
      label: 'Class USD ISIN',
      value: 'IE000036PHN0',
      mono: true
    }, {
      label: 'Class EUR (hgd) ISIN',
      value: 'IE000RFV0ON0',
      mono: true
    }, {
      label: 'Management Fees',
      value: '1.40% p.a.'
    }, {
      label: 'Performance Fees (HWM)',
      value: '10%'
    }],
    manager: {
      name: 'Alberto Conca',
      role: 'CIO of LFG+Zest SA',
      bio: 'Alberto joined LFG+Zest in 2018 and has over 20 years in investment management. He co-managed long-short equity funds at Lemanik and Sequoia, the global long-short fund at Pioneer Alternative Investments, and was a partner at Kairos Alternative Investments. Graduated in Economics at the University of Pavia.'
    },
    monthly: {
      2023: {
        SEP: -.0184,
        OCT: -.0356,
        NOV: .0742,
        DEC: .0375,
        YTD: .055
      },
      2024: {
        JAN: .0064,
        FEB: .0397,
        MAR: .0257,
        APR: -.0415,
        MAY: .0407,
        JUN: .0111,
        JUL: .0049,
        AUG: .0179,
        SEP: .0095,
        OCT: -.0165,
        NOV: .0318,
        DEC: -.0205,
        YTD: .1112
      },
      2025: {
        JAN: .0241,
        FEB: -.0191,
        MAR: -.0652,
        APR: -.0016,
        MAY: .06,
        JUN: .0361,
        JUL: .0158,
        AUG: .019,
        SEP: .0361,
        OCT: .0145,
        NOV: -.0033,
        DEC: -.0114,
        YTD: .104
      },
      2026: {
        JAN: .0217,
        FEB: -.0117,
        MAR: -.046,
        APR: .0913,
        MAY: .0387,
        YTD: .0919
      }
    },
    cumulative: 'monthly',
    startNav: 100,
    holdings: [{
      name: 'NVIDIA Corp',
      weight: .0791
    }, {
      name: 'Apple Inc',
      weight: .0713
    }, {
      name: 'Alphabet Inc-A',
      weight: .0642
    }, {
      name: 'Microsoft Corp',
      weight: .0499
    }, {
      name: 'Amazon.com Inc',
      weight: .0414
    }, {
      name: 'Broadcom Inc',
      weight: .0312
    }, {
      name: 'Meta Platforms-A',
      weight: .0216
    }, {
      name: 'Tesla Inc',
      weight: .0203
    }, {
      name: 'Micron Tech',
      weight: .0159
    }, {
      name: 'Eli Lilly & Co',
      weight: .0149
    }]
  },
  'hive-allocation': {
    family: 'hive',
    layout: 'hive-allocation',
    cover: true,
    meta: {
      fundName: 'Hive Funds Allocation',
      subtitle: 'MONTHLY REPORT',
      shareClass: 'A USD',
      asOf: 'April 30, 2026',
      category: 'Fund of Hedge Funds',
      navFreq: 'Daily'
    },
    logos: [{
      src: 'lfg-zest-red.png',
      role: 'Investment Manager',
      h: 38
    }],
    nutshell: {
      nav: '—',
      ytd: 0.0669,
      fundSize: 'USD 16.4M'
    },
    risk: 4,
    sfdr: 'Art 8',
    shareClasses: [{
      isin: 'IE000A1USD00',
      name: 'Class A USD',
      ccy: 'USD',
      aum: 11200000,
      nav: 112.40,
      mtd: .0102,
      ytd: .0669
    }, {
      isin: 'IE000A1EUR00',
      name: 'Class A EUR',
      ccy: 'EUR',
      aum: 5200000,
      nav: 109.85,
      mtd: .0094,
      ytd: .0631
    }],
    mission: 'The Hive Funds Allocation is a Fund of Hedge Funds providing diversification by strategy, exposure, geography and functionality, to create an attractive risk-adjusted return stream across a full market cycle — including bear markets — via an all-weather, uncorrelated approach.',
    strategyText: 'The methodology combines a top-down environment assessment with bottom-up manager selection to dynamically build a portfolio that is both quantitatively and qualitatively robust.',
    generalInfo: [{
      label: 'Investment Manager',
      value: 'LFG+Zest SA (CH)'
    }, {
      label: 'Fund Manager',
      value: 'Alberto Conca'
    }, {
      label: 'Investment Advisor',
      value: 'Tages Capital (UK)'
    }, {
      label: 'Launch Date',
      value: 'September 2023'
    }, {
      label: 'AuM (USD)',
      value: "16'420'511"
    }, {
      label: 'Structure',
      value: 'ILP (IE)'
    }, {
      label: 'Depo & Admin',
      value: 'Caceis (Ireland)'
    }, {
      label: 'Management Company',
      value: 'AQA Capital (Malta)'
    }, {
      label: 'Class A USD ISIN',
      value: 'IE000BEFF4J2',
      mono: true
    }, {
      label: 'Management Fees',
      value: '1.40% p.a.'
    }, {
      label: 'Perf. Fees (HWM)',
      value: '10%'
    }],
    advisor: {
      name: 'Tages Capital',
      logo: 'tages.png',
      bio: 'Part of Investcorp-Tages, a specialist investor, manager and advisor of liquid alternative strategies with over 25 years of experience and $4.7B in revenue-generating assets, with offices in London, New York and Milan.'
    },
    monthly: {
      2023: {
        SEP: -.0009,
        OCT: -.0059,
        NOV: -.0109,
        DEC: -.0108,
        YTD: -.0282
      },
      2024: {
        JAN: .0082,
        FEB: .0134,
        MAR: -.0003,
        APR: .0132,
        MAY: .0039,
        JUN: .0056,
        JUL: -.0103,
        AUG: -.0139,
        SEP: .0015,
        OCT: -.001,
        NOV: .0145,
        DEC: .002,
        YTD: .0369
      },
      2025: {
        JAN: -.0001,
        FEB: -.0155,
        MAR: .0003,
        APR: -.0074,
        MAY: .008,
        JUN: .0027,
        JUL: .0032,
        AUG: .0074,
        SEP: .0057,
        OCT: .0049,
        NOV: .0016,
        DEC: .0114,
        YTD: .0222
      },
      2026: {
        JAN: .0166,
        FEB: .0202,
        MAR: -.0158,
        APR: .0452,
        YTD: .0669
      }
    },
    cumulative: 'monthly',
    startNav: 100,
    strategy: [{
      name: 'Merger Arbitrage',
      weight: .166
    }, {
      name: 'Market Neutral Credit',
      weight: .145
    }, {
      name: 'Fundamental L/S',
      weight: .132
    }, {
      name: 'Activist Event Driven',
      weight: .121
    }, {
      name: 'Emerging Credit',
      weight: .098
    }, {
      name: 'Global Rates Macro',
      weight: .091
    }, {
      name: 'Commodities L/S',
      weight: .088
    }, {
      name: 'NA SMID L/S',
      weight: .087
    }, {
      name: 'US Equity L/S',
      weight: .051
    }, {
      name: 'Systematic EM Macro',
      weight: .019
    }]
  },
  /* ---------------- Zest AM SICAV ---------------- */
  'zest-med': {
    family: 'zest',
    layout: 'zest-morningstar',
    cover: false,
    meta: {
      fundName: 'Zest Mediterraneus',
      subtitle: 'Absolute Value',
      shareClass: 'I Acc',
      asOf: '31.05.2026',
      category: 'EAA Fund Long/Short Equity Europe',
      navFreq: 'Daily',
      rating: 4
    },
    logos: [{
      src: 'zest-am-sicav.svg',
      role: 'Investment Manager',
      h: 34
    }],
    nutshell: {
      nav: '118.43',
      rating: 'QQQQ',
      ytd: 0.0599,
      fundSize: 'EUR 68.9M'
    },
    shareClasses: [{
      isin: 'LU1216091261',
      name: 'I Acc',
      ccy: 'EUR',
      aum: 52400000,
      nav: 118.43,
      mtd: .0121,
      ytd: .0599
    }, {
      isin: 'LU1216091428',
      name: 'R Acc',
      ccy: 'EUR',
      aum: 16500000,
      nav: 113.07,
      mtd: .0112,
      ytd: .0541
    }],
    mission: 'Zest Mediterraneus Absolute Value is an open-end fund incorporated in Luxembourg. It seeks a consistent, absolute return while emphasising capital preservation in the medium term, investing long and short primarily in liquid European equities — focused on Italy, Spain, France and Portugal.',
    generalInfo: [{
      label: 'Name',
      value: 'Zest Mediterraneus Abs. Value'
    }, {
      label: 'ISIN',
      value: 'LU1216091261',
      mono: true
    }, {
      label: 'Manager',
      value: 'Gianrito Nicodemo'
    }, {
      label: 'Category',
      value: 'L/S Equity Europe'
    }, {
      label: 'Fund Size',
      value: "68'898'030 EUR"
    }, {
      label: 'Total Ret YTD',
      value: '5.99%'
    }, {
      label: 'Morningstar Rating',
      value: 'QQQQ'
    }, {
      label: 'Ret Annlzd 3 Yr',
      value: '8.50%'
    }, {
      label: 'Sharpe 3 Yr',
      value: '0.78'
    }, {
      label: 'Management Fee',
      value: '1.00%'
    }, {
      label: 'Performance Fee',
      value: '20.00%'
    }, {
      label: 'PRIIPS Ongoing Costs',
      value: '1.59%'
    }],
    risk: 4,
    sfdr: 'Art 8',
    manager: {
      name: 'Gianrito Nicodemo',
      role: 'Portfolio Manager',
      bio: 'Manages the Mediterraneus Absolute Value strategy, focused on liquid European equities across Italy, Spain, France and Portugal, with an absolute-return, capital-preservation mandate.'
    },
    monthly: {
      2023: {
        JAN: .0454,
        FEB: .0164,
        MAR: .0248,
        APR: .0015,
        MAY: .0212,
        JUN: .0124,
        JUL: .0235,
        AUG: .0102,
        SEP: .0145,
        OCT: .0316,
        NOV: .0475,
        DEC: .0162,
        YTD: .0551
      },
      2024: {
        JAN: .0008,
        FEB: .0034,
        MAR: .0286,
        APR: .0041,
        MAY: .0351,
        JUN: .0296,
        JUL: .0075,
        AUG: .0101,
        SEP: .0061,
        OCT: .0208,
        NOV: .0178,
        DEC: .0137,
        YTD: .0255
      },
      2025: {
        JAN: .0147,
        FEB: .0272,
        MAR: .0152,
        APR: .0119,
        MAY: .0339,
        JUN: .0042,
        JUL: .0053,
        AUG: .0172,
        SEP: .004,
        OCT: .0013,
        NOV: .0029,
        DEC: .0255,
        YTD: .1279
      },
      2026: {
        JAN: .0247,
        FEB: .0001,
        MAR: .0349,
        APR: .0437,
        MAY: .0269,
        YTD: .0599
      }
    },
    cumulative: 'monthly',
    startNav: 100,
    countries: [{
      name: 'Italy',
      weight: .445
    }, {
      name: 'France',
      weight: .166
    }, {
      name: 'Netherlands',
      weight: .099
    }, {
      name: 'Spain',
      weight: .09
    }, {
      name: 'Germany',
      weight: .071
    }, {
      name: 'Greece',
      weight: .048
    }, {
      name: 'Singapore',
      weight: .024
    }, {
      name: 'Finland',
      weight: .022
    }, {
      name: 'Belgium',
      weight: .019
    }, {
      name: 'United States',
      weight: .016
    }],
    sectors: [{
      name: 'Financial Services',
      weight: .233
    }, {
      name: 'Technology',
      weight: .196
    }, {
      name: 'Industrials',
      weight: .179
    }, {
      name: 'Utilities',
      weight: .109
    }, {
      name: 'Consumer Cyclical',
      weight: .099
    }, {
      name: 'Healthcare',
      weight: .049
    }, {
      name: 'Communication Services',
      weight: .049
    }, {
      name: 'Consumer Defensive',
      weight: .041
    }, {
      name: 'Real Estate',
      weight: .024
    }, {
      name: 'Basic Materials',
      weight: .02
    }],
    holdings: [{
      name: 'LUVE SpA',
      weight: .0522
    }, {
      name: 'Intesa Sanpaolo',
      weight: .0446
    }, {
      name: 'EssilorLuxottica',
      weight: .0297
    }, {
      name: 'Generali',
      weight: .029
    }, {
      name: 'Banca MPS',
      weight: .026
    }, {
      name: 'Schneider Electric SE',
      weight: .0259
    }, {
      name: 'Banco BPM SpA',
      weight: .0258
    }]
  },
  'zest-napr': {
    family: "zest",
    layout: "zest-morningstar",
    cover: false,
    meta: {
      fundName: "Zest North America Pairs Relative",
      subtitle: "Equity Market Neutral",
      shareClass: "R EUR",
      asOf: "31.05.2026",
      category: "EAA Fund Equity Market Neutral",
      navFreq: "Daily"
    },
    logos: [{
      src: "zest-am-sicav.svg",
      role: "Investment Manager",
      h: 34
    }],
    nutshell: {
      nav: "1’243.73",
      mtd: 0.0007,
      ytd: 0.0119,
      fundSize: "EUR 53.5M"
    },
    risk: 3,
    sfdr: "Art 6",
    shareClasses: [{
      isin: "LU1216084993",
      name: "R EUR",
      ccy: "EUR",
      aum: 0,
      nav: 1243.73,
      mtd: 0.0007,
      ytd: 0.0119
    }, {
      isin: "LU1216084308",
      name: "I EUR",
      ccy: "EUR",
      aum: 0,
      nav: 1452.75,
      mtd: 0.0012,
      ytd: 0.0145
    }, {
      isin: "LU1532291983",
      name: "R USD",
      ccy: "USD",
      aum: 0,
      nav: 142.79,
      mtd: 0.0019,
      ytd: 0.018
    }, {
      isin: "LU1532291801",
      name: "I USD",
      ccy: "USD",
      aum: 0,
      nav: 123.92,
      mtd: 0.0024,
      ytd: 0.0197
    }, {
      isin: "LU2510449965",
      name: "I CHF",
      ccy: "CHF",
      aum: 0,
      nav: 109.98,
      mtd: -0.0009,
      ytd: 0.0036
    }],
    mission: "Zest North America Pairs Relative seeks consistent, low-volatility absolute returns largely independent of the direction of equity markets. The strategy invests in North-American equities through a market-neutral, pairs-relative approach — pairing long and short positions of comparable size within the same sector, so that performance is driven by relative stock selection rather than broad market exposure.",
    generalInfo: [{
      label: "Name",
      value: "Zest N. America Pairs Relative"
    }, {
      label: "ISIN",
      value: "LU1216084993",
      mono: true
    }, {
      label: "Manager",
      value: "Pasquale Corvino"
    }, {
      label: "Category",
      value: "Equity Market Neutral"
    }, {
      label: "Fund Size",
      value: "EUR 53.5M"
    }, {
      label: "Currency",
      value: "EUR"
    }, {
      label: "Total Ret YTD",
      value: "1.19%"
    }, {
      label: "Ret Annlzd 3 Yr",
      value: "4.30%"
    }, {
      label: "Management Fee",
      value: "1.50%"
    }, {
      label: "Performance Fee",
      value: "20.00%"
    }, {
      label: "Max Front Load",
      value: "3.00%"
    }, {
      label: "Domicile",
      value: "Luxembourg"
    }],
    manager: {
      name: "Pasquale Corvino",
      role: "Portfolio Manager",
      bio: "Manages the North America Pairs Relative strategy, an equity-market-neutral book of paired long/short positions in liquid large-cap US equities, targeting low correlation to equity indices across market regimes."
    },
    monthly: {
      2019: {
        JAN: 0.0899,
        FEB: 0.0073,
        MAR: -0.0027,
        APR: 0.0107,
        MAY: -0.033,
        JUN: 0.0533,
        JUL: 0.008,
        AUG: -0.005,
        SEP: 0.0059,
        OCT: 0.009,
        NOV: -0.0013,
        DEC: 0.0015,
        YTD: 0.1476
      },
      2020: {
        JAN: -0.0005,
        FEB: 0.0343,
        MAR: 0.0026,
        APR: 0.0346,
        MAY: 0.0257,
        JUN: 0.0159,
        JUL: 0.0026,
        AUG: -0.0094,
        SEP: 0.0344,
        OCT: -0.0054,
        NOV: 0.0442,
        DEC: 0.0008,
        YTD: 0.1931
      },
      2021: {
        JAN: 0.0028,
        FEB: 0.0002,
        MAR: 0.0182,
        APR: 0.0014,
        MAY: 0.0122,
        JUN: 0.0091,
        JUL: -0.0081,
        AUG: 0.0028,
        SEP: 0.0087,
        OCT: 0.0068,
        NOV: -0.019,
        DEC: 0.01,
        YTD: 0.0455
      },
      2022: {
        JAN: -0.0348,
        FEB: 0.0009,
        MAR: 0.0016,
        APR: -0.0661,
        MAY: 0.0215,
        JUN: -0.0936,
        JUL: 0.0845,
        AUG: -0.0204,
        SEP: -0.0614,
        OCT: 0.0811,
        NOV: 0.0638,
        DEC: -0.0489,
        YTD: -0.0874
      },
      2023: {
        JAN: 0.067,
        FEB: 0.0058,
        MAR: 0.009,
        APR: 0.014,
        MAY: -0.0062,
        JUN: 0.018,
        JUL: -0.0048,
        AUG: 0.0133,
        SEP: -0.002,
        OCT: -0.0229,
        NOV: 0.0454,
        DEC: -0.0058,
        YTD: 0.1353
      },
      2024: {
        JAN: 0.0182,
        FEB: 0.006,
        MAR: 0.0068,
        APR: 0.0065,
        MAY: 0.0059,
        JUN: 0.0068,
        JUL: 0.0028,
        AUG: 0.0015,
        SEP: 0.0114,
        OCT: 0.0068,
        NOV: 0.0116,
        DEC: -0.0136,
        YTD: 0.0727
      },
      2025: {
        JAN: 0.0252,
        FEB: -0.0032,
        MAR: -0.0257,
        APR: -0.0262,
        MAY: 0.0243,
        JUN: 0.0139,
        JUL: 0.0032,
        AUG: 0.0116,
        SEP: -0.0077,
        OCT: -0.0028,
        NOV: -0.0034,
        DEC: -0.0033,
        YTD: 0.0044
      },
      2026: {
        JAN: -0.0188,
        FEB: 0.0021,
        MAR: 0.0042,
        APR: 0.0241,
        MAY: 0.0007,
        YTD: 0.0119
      }
    },
    cumulative: "monthly",
    startNav: 100,
    countries: [{
      name: "United States",
      weight: 0.8739
    }, {
      name: "Cayman Islands",
      weight: 0.0695
    }, {
      name: "Liberia",
      weight: 0.0309
    }, {
      name: "Canada",
      weight: 0.0257
    }],
    sectors: [{
      name: "Consumer Discretionary",
      weight: 0.3351
    }, {
      name: "Information Technology",
      weight: 0.221
    }, {
      name: "Communication Services",
      weight: 0.1352
    }, {
      name: "Financials",
      weight: 0.0966
    }, {
      name: "Industrials",
      weight: 0.0745
    }, {
      name: "Health Care",
      weight: 0.0616
    }, {
      name: "Consumer Staples",
      weight: 0.0608
    }, {
      name: "Real Estate",
      weight: 0.0152
    }],
    holdings: [{
      name: "Lam Research",
      sector: "Information Technology",
      ccy: "USD",
      weight: 0.0357
    }, {
      name: "Alphabet Class A",
      sector: "Communication Services",
      ccy: "USD",
      weight: 0.0335
    }, {
      name: "Delta Air Lines",
      sector: "Industrials",
      ccy: "USD",
      weight: 0.0306
    }, {
      name: "Alibaba Group ADR",
      sector: "Consumer Discretionary",
      ccy: "USD",
      weight: 0.0296
    }, {
      name: "Applied Materials",
      sector: "Information Technology",
      ccy: "USD",
      weight: 0.0288
    }, {
      name: "Wayfair Class A",
      sector: "Consumer Discretionary",
      ccy: "USD",
      weight: 0.0266
    }, {
      name: "Target",
      sector: "Consumer Staples",
      ccy: "USD",
      weight: 0.0262
    }, {
      name: "Adobe",
      sector: "Information Technology",
      ccy: "USD",
      weight: 0.0249
    }, {
      name: "Walt Disney",
      sector: "Communication Services",
      ccy: "USD",
      weight: 0.0245
    }, {
      name: "FedEx",
      sector: "Industrials",
      ccy: "USD",
      weight: 0.0244
    }],
    currency: [{
      name: "USD",
      weight: 1
    }],
    napr: true,
    defaultClass: "R_EUR",
    classData: {
      R_EUR: {
        meta: {
          shareClass: "R EUR"
        },
        startNav: 100,
        nutshell: {
          nav: "1’243.73",
          mtd: 0.0007,
          ytd: 0.0119,
          fundSize: "EUR 53.5M"
        },
        monthly: {
          2019: {
            JAN: 0.0899,
            FEB: 0.0073,
            MAR: -0.0027,
            APR: 0.0107,
            MAY: -0.033,
            JUN: 0.0533,
            JUL: 0.008,
            AUG: -0.005,
            SEP: 0.0059,
            OCT: 0.009,
            NOV: -0.0013,
            DEC: 0.0015,
            YTD: 0.1476
          },
          2020: {
            JAN: -0.0005,
            FEB: 0.0343,
            MAR: 0.0026,
            APR: 0.0346,
            MAY: 0.0257,
            JUN: 0.0159,
            JUL: 0.0026,
            AUG: -0.0094,
            SEP: 0.0344,
            OCT: -0.0054,
            NOV: 0.0442,
            DEC: 0.0008,
            YTD: 0.1931
          },
          2021: {
            JAN: 0.0028,
            FEB: 0.0002,
            MAR: 0.0182,
            APR: 0.0014,
            MAY: 0.0122,
            JUN: 0.0091,
            JUL: -0.0081,
            AUG: 0.0028,
            SEP: 0.0087,
            OCT: 0.0068,
            NOV: -0.019,
            DEC: 0.01,
            YTD: 0.0455
          },
          2022: {
            JAN: -0.0348,
            FEB: 0.0009,
            MAR: 0.0016,
            APR: -0.0661,
            MAY: 0.0215,
            JUN: -0.0936,
            JUL: 0.0845,
            AUG: -0.0204,
            SEP: -0.0614,
            OCT: 0.0811,
            NOV: 0.0638,
            DEC: -0.0489,
            YTD: -0.0874
          },
          2023: {
            JAN: 0.067,
            FEB: 0.0058,
            MAR: 0.009,
            APR: 0.014,
            MAY: -0.0062,
            JUN: 0.018,
            JUL: -0.0048,
            AUG: 0.0133,
            SEP: -0.002,
            OCT: -0.0229,
            NOV: 0.0454,
            DEC: -0.0058,
            YTD: 0.1353
          },
          2024: {
            JAN: 0.0182,
            FEB: 0.006,
            MAR: 0.0068,
            APR: 0.0065,
            MAY: 0.0059,
            JUN: 0.0068,
            JUL: 0.0028,
            AUG: 0.0015,
            SEP: 0.0114,
            OCT: 0.0068,
            NOV: 0.0116,
            DEC: -0.0136,
            YTD: 0.0727
          },
          2025: {
            JAN: 0.0252,
            FEB: -0.0032,
            MAR: -0.0257,
            APR: -0.0262,
            MAY: 0.0243,
            JUN: 0.0139,
            JUL: 0.0032,
            AUG: 0.0116,
            SEP: -0.0077,
            OCT: -0.0028,
            NOV: -0.0034,
            DEC: -0.0033,
            YTD: 0.0044
          },
          2026: {
            JAN: -0.0188,
            FEB: 0.0021,
            MAR: 0.0042,
            APR: 0.0241,
            MAY: 0.0007,
            YTD: 0.0119
          }
        },
        generalInfo: [{
          label: "Name",
          value: "Zest N. America Pairs Relative"
        }, {
          label: "ISIN",
          value: "LU1216084993",
          mono: true
        }, {
          label: "Manager",
          value: "Pasquale Corvino"
        }, {
          label: "Category",
          value: "Equity Market Neutral"
        }, {
          label: "Fund Size",
          value: "EUR 53.5M"
        }, {
          label: "Currency",
          value: "EUR"
        }, {
          label: "Total Ret YTD",
          value: "1.19%"
        }, {
          label: "Ret Annlzd 3 Yr",
          value: "4.30%"
        }, {
          label: "Management Fee",
          value: "1.50%"
        }, {
          label: "Performance Fee",
          value: "20.00%"
        }, {
          label: "Max Front Load",
          value: "3.00%"
        }, {
          label: "Domicile",
          value: "Luxembourg"
        }]
      },
      R_USD: {
        meta: {
          shareClass: "R USD"
        },
        startNav: 100,
        nutshell: {
          nav: "142.79",
          mtd: 0.0019,
          ytd: 0.018,
          fundSize: "USD 62.1M"
        },
        monthly: {
          2020: {
            JAN: 0.0011,
            FEB: 0.036,
            MAR: 0.0059,
            APR: 0.0302,
            MAY: 0.0214,
            JUN: 0.0119,
            JUL: 0.001,
            AUG: -0.0087,
            SEP: 0.0319,
            OCT: -0.0069,
            NOV: 0.0406,
            DEC: 0.0013,
            YTD: 0.177
          },
          2021: {
            JAN: 0.0031,
            FEB: 0.0004,
            MAR: 0.0181,
            APR: 0.0016,
            MAY: 0.0123,
            JUN: 0.009,
            JUL: -0.0078,
            AUG: 0.003,
            SEP: 0.0088,
            OCT: 0.0069,
            NOV: -0.0195,
            DEC: 0.0112,
            YTD: 0.0476
          },
          2022: {
            JAN: -0.034,
            FEB: 0.0011,
            MAR: 0.0039,
            APR: -0.0651,
            MAY: 0.0231,
            JUN: -0.0903,
            JUL: 0.0862,
            AUG: -0.0186,
            SEP: -0.0579,
            OCT: 0.0843,
            NOV: 0.0674,
            DEC: -0.0456,
            YTD: -0.0629
          },
          2023: {
            JAN: 0.0693,
            FEB: 0.007,
            MAR: 0.0095,
            APR: 0.012,
            MAY: -0.0058,
            JUN: 0.0173,
            JUL: -0.0038,
            AUG: 0.014,
            SEP: -0.0009,
            OCT: -0.0216,
            NOV: 0.0461,
            DEC: -0.0053,
            YTD: 0.1432
          },
          2024: {
            JAN: 0.0187,
            FEB: 0.0067,
            MAR: 0.0076,
            APR: 0.0072,
            MAY: 0.0068,
            JUN: 0.0075,
            JUL: 0.0037,
            AUG: 0.0024,
            SEP: 0.0121,
            OCT: 0.0078,
            NOV: 0.012,
            DEC: -0.0112,
            YTD: 0.0841
          },
          2025: {
            JAN: 0.0257,
            FEB: -0.0022,
            MAR: -0.0244,
            APR: -0.024,
            MAY: 0.0254,
            JUN: 0.0153,
            JUL: 0.0052,
            AUG: 0.0136,
            SEP: -0.0061,
            OCT: -0.001,
            NOV: -0.0021,
            DEC: -0.0016,
            YTD: 0.0226
          },
          2026: {
            JAN: -0.0176,
            FEB: 0.0028,
            MAR: 0.0059,
            APR: 0.0254,
            MAY: 0.0019,
            YTD: 0.0181
          }
        },
        generalInfo: [{
          label: "Name",
          value: "Zest N. America Pairs Relative"
        }, {
          label: "ISIN",
          value: "LU1532291983",
          mono: true
        }, {
          label: "Manager",
          value: "Pasquale Corvino"
        }, {
          label: "Category",
          value: "Equity Market Neutral"
        }, {
          label: "Fund Size",
          value: "USD 62.1M"
        }, {
          label: "Currency",
          value: "USD"
        }, {
          label: "Total Ret YTD",
          value: "1.80%"
        }, {
          label: "Ret Annlzd 3 Yr",
          value: "5.66%"
        }, {
          label: "Management Fee",
          value: "1.50%"
        }, {
          label: "Performance Fee",
          value: "20.00%"
        }, {
          label: "Max Front Load",
          value: "3.00%"
        }, {
          label: "Domicile",
          value: "Luxembourg"
        }]
      },
      I_USD: {
        meta: {
          shareClass: "I USD"
        },
        startNav: 100,
        nutshell: {
          nav: "123.92",
          mtd: 0.0024,
          ytd: 0.0197,
          fundSize: "USD 62.1M"
        },
        monthly: {
          2024: {
            JAN: 0.0191,
            FEB: 0.0072,
            MAR: 0.0081,
            APR: 0.0075,
            MAY: 0.0073,
            JUN: 0.0078,
            JUL: 0.0042,
            AUG: 0.0029,
            SEP: 0.0125,
            OCT: 0.0083,
            NOV: 0.0124,
            DEC: -0.0106,
            YTD: 0.0899
          },
          2025: {
            JAN: 0.026,
            FEB: -0.0017,
            MAR: -0.0239,
            APR: -0.0235,
            MAY: 0.026,
            JUN: 0.0159,
            JUL: 0.0057,
            AUG: 0.0141,
            SEP: -0.0055,
            OCT: -0.0006,
            NOV: -0.0021,
            DEC: -0.0011,
            YTD: 0.0282
          },
          2026: {
            JAN: -0.0171,
            FEB: 0.0033,
            MAR: 0.0065,
            APR: 0.0249,
            MAY: 0.0024,
            YTD: 0.0197
          }
        },
        generalInfo: [{
          label: "Name",
          value: "Zest N. America Pairs Relative"
        }, {
          label: "ISIN",
          value: "LU1532291801",
          mono: true
        }, {
          label: "Manager",
          value: "Pasquale Corvino"
        }, {
          label: "Category",
          value: "Equity Market Neutral"
        }, {
          label: "Fund Size",
          value: "USD 62.1M"
        }, {
          label: "Currency",
          value: "USD"
        }, {
          label: "Total Ret YTD",
          value: "1.97%"
        }, {
          label: "Ret Annlzd 3 Yr",
          value: "n/a"
        }, {
          label: "Management Fee",
          value: "0.90%"
        }, {
          label: "Performance Fee",
          value: "20.00%"
        }, {
          label: "Max Front Load",
          value: "n/a"
        }, {
          label: "Domicile",
          value: "Luxembourg"
        }]
      }
    }
  },
  'zest-butterfly': {
    family: 'zest',
    layout: 'zest-balanced',
    cover: false,
    balanced: true,
    meta: {
      fundName: 'Zest Butterfly II',
      subtitle: 'Balanced UCITS — Equity & Fixed Income',
      shareClass: 'I Acc',
      asOf: '30.04.2026',
      category: 'Balanced UCITS',
      navFreq: 'Daily'
    },
    logos: [{
      src: 'zest-am-sicav.png',
      role: 'Investment Manager',
      h: 30
    }],
    nutshell: {
      nav: '120.65',
      mtd: 0.0333,
      ytd: 0.0156,
      since: 0.2065,
      fundSize: 'EUR 15.6M'
    },
    shareClasses: [{
      isin: 'LU2516090001',
      name: 'I Acc',
      ccy: 'EUR',
      aum: 11800000,
      nav: 120.65,
      mtd: .0333,
      ytd: .0156
    }, {
      isin: 'LU2516090183',
      name: 'R Acc',
      ccy: 'EUR',
      aum: 3800000,
      nav: 116.22,
      mtd: .0325,
      ytd: .0118
    }],
    mission: 'The Fund is designed to provide a balanced UCITS strategy combining equity alpha generation with fixed income carry, stability and diversification. The portfolio blends a quantamental equity process with a disciplined bond allocation, seeking resilient participation across market cycles.',
    objective: ['Equity — quantamental stock selection across global large and mid-cap companies', 'Fixed Income — diversified credit managed by issuer quality, duration and yield-to-maturity', 'Portfolio construction — dynamic allocation between growth, income and risk control'],
    generalInfo: [{
      label: 'Name',
      value: 'Zest Butterfly II'
    }, {
      label: 'Legal form',
      value: 'Sub-fund of Zest AM SICAV'
    }, {
      label: 'Regulatory status',
      value: 'UCITS'
    }, {
      label: 'Domicile',
      value: 'Luxembourg'
    }, {
      label: 'Investment Manager',
      value: 'LFG+Zest SA'
    }, {
      label: 'ManCo, Admin & Depo',
      value: 'Pictet Group'
    }, {
      label: 'Fund Currency',
      value: 'EUR'
    }, {
      label: 'Benchmark',
      value: '40% Eq / 60% FI'
    }],
    metrics: [{
      label: 'Equity / Fixed Income',
      value: '40.3% / 58.1%'
    }, {
      label: 'Yield to Maturity',
      value: '4.60%'
    }, {
      label: 'Duration',
      value: '2.73'
    }, {
      label: 'IG / HY — Issuer',
      value: '72% / 28%'
    }, {
      label: 'IG / HY — Issue',
      value: '33% / 67%'
    }],
    risk: 3,
    sfdr: 'Art 8',
    monthly: {
      2022: {
        DEC: -.0223,
        YTD: -.0223
      },
      2023: {
        JAN: .0167,
        FEB: -.009,
        MAR: .0057,
        APR: .003,
        MAY: .007,
        JUN: .0154,
        JUL: .0144,
        AUG: -.0053,
        SEP: -.0121,
        OCT: -.0112,
        NOV: .0432,
        DEC: .0305,
        YTD: .1013
      },
      2024: {
        JAN: .0018,
        FEB: .0095,
        MAR: .0125,
        APR: -.0167,
        MAY: .0159,
        JUN: .0073,
        JUL: .0078,
        AUG: .0124,
        SEP: .0064,
        OCT: -.0049,
        NOV: .0158,
        DEC: -.0127,
        YTD: .0558
      },
      2025: {
        JAN: .0169,
        FEB: -.0036,
        MAR: -.0322,
        APR: .0033,
        MAY: .0298,
        JUN: .0125,
        JUL: .0064,
        AUG: .001,
        SEP: .0131,
        OCT: -.0016,
        NOV: .0008,
        DEC: -.001,
        YTD: .045
      },
      2026: {
        JAN: .0153,
        FEB: .0103,
        MAR: -.0419,
        APR: .0333,
        YTD: .0156
      }
    },
    cumulative: 'monthly',
    startNav: 100,
    allocation: [{
      name: 'Fixed Income',
      weight: .581
    }, {
      name: 'Equity',
      weight: .403
    }, {
      name: 'Other / Cash',
      weight: .016
    }],
    currency: [{
      name: 'EUR',
      weight: .55
    }, {
      name: 'USD',
      weight: .345
    }, {
      name: 'R.O.W.',
      weight: .088
    }, {
      name: 'Other',
      weight: .017
    }],
    holdings: [{
      name: 'JPMorgan Chase & Co',
      weight: .0089
    }, {
      name: 'Roper Technologies',
      weight: .0087
    }, {
      name: 'Salesforce Inc',
      weight: .0087
    }, {
      name: 'Oracle Corp',
      weight: .0086
    }, {
      name: 'Microsoft Corp',
      weight: .0085
    }, {
      name: 'HCA Healthcare',
      weight: .0081
    }, {
      name: 'Alphabet Inc-A',
      weight: .008
    }, {
      name: 'AP Moller-Maersk-B',
      weight: .0078
    }, {
      name: 'Ubiquiti Inc',
      weight: .0077
    }, {
      name: 'Arista Networks',
      weight: .0076
    }],
    equityNote: {
      mtd: '8.15%',
      contribution: '3.28%'
    },
    // ---- Equity sleeve (40.3% of NAV) ----
    equitySleeve: {
      weight: .403,
      perfMtd: .0815,
      contribution: .0328,
      names: 62,
      sectors: [{
        name: 'Information Technology',
        weight: .118
      }, {
        name: 'Financials',
        weight: .071
      }, {
        name: 'Health Care',
        weight: .058
      }, {
        name: 'Industrials',
        weight: .054
      }, {
        name: 'Communication Services',
        weight: .041
      }, {
        name: 'Consumer Disc.',
        weight: .036
      }, {
        name: 'Other',
        weight: .025
      }]
    },
    // ---- Fixed income sleeve (58.1% of NAV) ----
    fiSleeve: {
      weight: .581,
      ytm: .046,
      duration: 2.73,
      issuers: 94,
      igHyIssuer: '72% / 28%',
      igHyIssue: '33% / 67%',
      ratings: [{
        name: 'AAA',
        weight: .064
      }, {
        name: 'AA',
        weight: .071
      }, {
        name: 'A',
        weight: .118
      }, {
        name: 'BBB',
        weight: .203
      }, {
        name: 'BB',
        weight: .083
      }, {
        name: 'B',
        weight: .031
      }, {
        name: 'NR / Cash',
        weight: .011
      }]
    }
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "exports/lfg-handoff/02-factsheet-editor/factsheet/data.js", error: String((e && e.message) || e) }); }

// exports/lfg-handoff/02-factsheet-editor/factsheet/echarts-kit.js
try { (() => {
/* echarts-kit.js — the shared ECharts render layer for the Factsheet Builder.
   Mirrors the repo's contract (docs/chart-studio-integration.md §2–4):
     • THEME  = themes/<family>.json → {fonts, palette, doc.chart}
     • MODEL  = { type, series:[{name,value,color?}], meta:{title,numFmt,…} }
     • buildOption(model, theme) → an ECharts 5.x option (single source of truth
       for BOTH the factsheet charts and the Chart Studio editor).
   No build step, no dependencies beyond global `echarts`. */
(function () {
  // Embedded themes (kept in sync with /themes/*.json). Hydrated from those JSON
  // files at load when served over http; embedded copy keeps file:// working.
  const THEMES = {
    vg: {
      id: 'vg-aqa',
      fonts: {
        display: "'Inter', system-ui, sans-serif",
        body: "'Inter', system-ui, sans-serif",
        mono: "'JetBrains Mono', ui-monospace, monospace"
      },
      palette: {
        ink: '#1f2933',
        grid: '#eef3f8',
        axis: '#5a6470',
        categorical: ['#2b5d8c', '#1f4e79', '#7fa8d0', '#c08a3e', '#3f7d6e', '#8c5a7c'],
        positive: '#2f7d5b',
        negative: '#b1503f'
      },
      chart: {
        line: '#2b5d8c',
        lineDeep: '#1f4e79',
        lineSoft: '#7fa8d0',
        axisLabel: '#5a6470',
        axisLabelInk: '#3a4250',
        axisLine: '#d8dee6',
        splitLine: '#eef3f8',
        labelLine: '#c9d2dc',
        gradientFrom: 'rgba(43,93,140,.18)',
        gradientTo: 'rgba(43,93,140,0)',
        positive: '#2f7d5b',
        negative: '#b1503f'
      }
    },
    hive: {
      id: 'hive-lfgzest',
      fonts: {
        display: "'Cormorant Garamond', Georgia, serif",
        body: "'Inter', system-ui, sans-serif",
        mono: "'JetBrains Mono', ui-monospace, monospace"
      },
      palette: {
        ink: '#2a2326',
        grid: '#efe6e8',
        axis: '#6a6065',
        categorical: ['#6d1f2e', '#8a3340', '#a85a4f', '#b08d3c', '#c7a55a', '#5a6b5e', '#7c8a6e', '#9a4a5a', '#bb7a4a', '#4f141f', '#cf9b6a', '#7a5a6e'],
        positive: '#2f7d5b',
        negative: '#b1503f'
      },
      chart: {
        line: '#6d1f2e',
        lineDeep: '#4f141f',
        lineSoft: '#a85a4f',
        axisLabel: '#6a6065',
        axisLabelInk: '#3a3338',
        axisLine: '#d8ccce',
        splitLine: '#efe6e8',
        labelLine: '#c9bdc0',
        gradientFrom: 'rgba(176,141,60,.18)',
        gradientTo: 'rgba(176,141,60,0)',
        positive: '#2f7d5b',
        negative: '#b1503f'
      }
    },
    zest: {
      id: 'zest-am',
      fonts: {
        display: "'Jost', system-ui, sans-serif",
        body: "'Inter', system-ui, sans-serif",
        mono: "'JetBrains Mono', ui-monospace, monospace"
      },
      palette: {
        ink: '#14153e',
        grid: '#e8edf3',
        axis: '#7a8499',
        categorical: ['#14153e', '#2e5f9e', '#0f4c7d', '#5b8cc4', '#8aa9d2', '#b8c6d8'],
        positive: '#1b7a1b',
        negative: '#c00000'
      },
      chart: {
        line: '#14153e',
        lineDeep: '#0f2447',
        lineSoft: '#2e5f9e',
        axisLabel: '#7a8499',
        axisLabelInk: '#3a4356',
        axisLine: '#d0d7e2',
        splitLine: '#e8edf3',
        labelLine: '#c2c9d4',
        gradientFrom: 'rgba(46,95,158,.18)',
        gradientTo: 'rgba(46,95,158,0)',
        positive: '#1b7a1b',
        negative: '#c00000'
      }
    }
  };
  const FAMILY_BY_ID = {
    'vg-aqa': 'vg',
    'hive-lfgzest': 'hive',
    'zest-am': 'zest'
  };

  // Optional async hydrate from the canonical JSON (keeps embedded + JSON aligned)
  (function hydrate() {
    if (location.protocol === 'file:') return;
    const map = {
      vg: '../../themes/vg-aqa.json',
      hive: '../../themes/hive-lfgzest.json',
      zest: '../../themes/zest-am.json'
    };
    Object.entries(map).forEach(([fam, url]) => {
      fetch(url).then(r => r.ok ? r.json() : null).then(j => {
        if (!j) return;
        THEMES[fam] = {
          id: j.id,
          fonts: j.fonts || THEMES[fam].fonts,
          palette: j.palette || THEMES[fam].palette,
          chart: j.doc && j.doc.chart || THEMES[fam].chart
        };
      }).catch(() => {});
    });
  })();
  function resolveTheme(family) {
    return THEMES[FAMILY_BY_ID[family] || family] || THEMES.vg;
  }

  // ---- Catalog of chart types the Studio offers (≈ the studio's 25 renderers) ----
  const CHART_CATALOG = [{
    id: 'line',
    label: 'Line',
    group: 'Trend'
  }, {
    id: 'smooth',
    label: 'Smooth line',
    group: 'Trend'
  }, {
    id: 'step',
    label: 'Step line',
    group: 'Trend'
  }, {
    id: 'area',
    label: 'Area',
    group: 'Trend'
  }, {
    id: 'area-smooth',
    label: 'Smooth area',
    group: 'Trend'
  }, {
    id: 'column',
    label: 'Columns',
    group: 'Bar'
  }, {
    id: 'bar',
    label: 'Bars (horizontal)',
    group: 'Bar'
  }, {
    id: 'stacked',
    label: '100% stacked',
    group: 'Bar'
  }, {
    id: 'lollipop',
    label: 'Lollipop',
    group: 'Bar'
  }, {
    id: 'lollipop-h',
    label: 'Lollipop (horizontal)',
    group: 'Bar'
  }, {
    id: 'polar',
    label: 'Polar bars',
    group: 'Bar'
  }, {
    id: 'waterfall',
    label: 'Waterfall',
    group: 'Bar'
  }, {
    id: 'donut',
    label: 'Donut',
    group: 'Part-to-whole'
  }, {
    id: 'pie',
    label: 'Pie',
    group: 'Part-to-whole'
  }, {
    id: 'rose',
    label: 'Rose',
    group: 'Part-to-whole'
  }, {
    id: 'funnel',
    label: 'Funnel',
    group: 'Part-to-whole'
  }, {
    id: 'treemap',
    label: 'Treemap',
    group: 'Part-to-whole'
  }, {
    id: 'radar',
    label: 'Radar',
    group: 'Advanced'
  }, {
    id: 'scatter',
    label: 'Scatter',
    group: 'Advanced'
  }, {
    id: 'heatmap',
    label: 'Heat strip',
    group: 'Advanced'
  }, {
    id: 'gauge',
    label: 'Gauge',
    group: 'Advanced'
  }];
  const ALIAS = {
    bars: 'bar',
    'h-bar': 'bar'
  };
  function buildOption(model, theme) {
    const t = theme || THEMES.vg;
    const C = t.chart,
      P = t.palette;
    const type = ALIAS[model.type] || model.type || 'line';
    const series = (model.series || []).filter(s => s && s.value !== '' && s.value != null);
    const meta = model.meta || {};
    const names = series.map(s => String(s.name));
    const vals = series.map(s => +s.value || 0);
    const cat = P.categorical;
    const colorAt = i => series[i].color || cat[i % cat.length];
    const fmt = v => meta.numFmt === 'pct' ? (+v).toFixed(2) + '%' : meta.numFmt === 'num0' ? Math.round(v).toString() : (+v).toFixed(meta.numFmt === 'num' ? 2 : 1);
    const fS = {
      fontFamily: t.fonts.body
    };
    const axL = {
      color: C.axisLabel,
      fontFamily: t.fonts.mono,
      fontSize: meta.compact ? 9 : 10
    };
    const grad = (a, b) => ({
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{
        offset: 0,
        color: a
      }, {
        offset: 1,
        color: b
      }]
    });
    const base = {
      textStyle: fS,
      animationDuration: 420,
      grid: {
        left: meta.compact ? 2 : 8,
        right: meta.compact ? 8 : 14,
        top: meta.compact ? 12 : 16,
        bottom: 4,
        containLabel: true
      },
      tooltip: {
        trigger: ['donut', 'pie', 'rose', 'funnel', 'treemap'].includes(type) ? 'item' : 'axis',
        valueFormatter: fmt,
        textStyle: {
          fontFamily: t.fonts.body,
          fontSize: 11
        }
      }
    };
    const catAxis = extra => Object.assign({
      type: 'category',
      data: names,
      axisLabel: Object.assign({}, axL),
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: C.axisLine
        }
      }
    }, extra || {});
    const valAxis = extra => Object.assign({
      type: 'value',
      axisLabel: Object.assign({
        formatter: fmt
      }, axL),
      splitLine: {
        lineStyle: {
          color: C.splitLine
        }
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    }, extra || {});
    const lblPct = {
      fontSize: meta.compact ? 8 : 10,
      fontFamily: t.fonts.mono,
      color: C.axisLabelInk
    };
    switch (type) {
      case 'line':
      case 'smooth':
      case 'step':
      case 'area':
      case 'area-smooth':
        {
          const interval = Math.max(0, Math.ceil(names.length / (meta.compact ? 8 : 12)) - 1);
          const isArea = type.startsWith('area');
          return Object.assign(base, {
            xAxis: catAxis({
              boundaryGap: false,
              axisLabel: Object.assign({
                interval,
                hideOverlap: true
              }, axL)
            }),
            yAxis: valAxis(),
            series: [{
              type: 'line',
              data: vals,
              smooth: type === 'smooth' || type === 'area-smooth',
              step: type === 'step' ? 'middle' : false,
              symbol: meta.compact ? 'none' : 'circle',
              symbolSize: 5,
              showSymbol: !meta.compact,
              lineStyle: {
                color: model.color || C.line,
                width: 2
              },
              itemStyle: {
                color: model.color || C.line
              },
              areaStyle: isArea ? {
                color: grad(C.gradientFrom || (model.color || C.line) + '2e', C.gradientTo || 'rgba(0,0,0,0)')
              } : null,
              endLabel: meta.compact ? {
                show: false
              } : undefined
            }]
          });
        }
      case 'column':
        {
          return Object.assign(base, {
            xAxis: catAxis({
              axisLabel: Object.assign({
                interval: Math.max(0, Math.ceil(names.length / 12) - 1),
                hideOverlap: true
              }, axL)
            }),
            yAxis: valAxis(),
            series: [{
              type: 'bar',
              barWidth: '62%',
              barMaxWidth: 26,
              data: vals.map((v, i) => ({
                value: v,
                itemStyle: {
                  color: meta.signed ? v >= 0 ? C.positive : C.negative : model.color || colorAt(i),
                  borderRadius: v >= 0 ? [2, 2, 0, 0] : [0, 0, 2, 2]
                }
              })),
              label: meta.showVals ? {
                show: true,
                position: 'top',
                formatter: p => fmt(p.value),
                ...lblPct
              } : undefined
            }]
          });
        }
      case 'bar':
        {
          return Object.assign(base, {
            grid: {
              left: 2,
              right: 34,
              top: 6,
              bottom: 2,
              containLabel: true
            },
            xAxis: valAxis({
              axisLabel: {
                show: false
              },
              splitLine: {
                show: false
              }
            }),
            yAxis: catAxis({
              inverse: true,
              axisLabel: Object.assign({
                width: meta.compact ? 76 : 120,
                overflow: 'truncate',
                fontFamily: t.fonts.body
              }, {
                color: C.axisLabelInk,
                fontSize: meta.compact ? 8.5 : 11
              }),
              axisLine: {
                show: false
              }
            }),
            series: [{
              type: 'bar',
              barWidth: meta.compact ? '58%' : '62%',
              data: vals.map((v, i) => ({
                value: v,
                itemStyle: {
                  color: model.color || colorAt(i),
                  borderRadius: [0, 2, 2, 0]
                }
              })),
              label: {
                show: true,
                position: 'right',
                formatter: p => fmt(p.value),
                ...lblPct
              }
            }]
          });
        }
      case 'stacked':
        {
          return Object.assign(base, {
            grid: {
              left: 2,
              right: 8,
              top: 6,
              bottom: 18,
              containLabel: true
            },
            xAxis: valAxis({
              max: vals.reduce((a, b) => a + b, 0),
              axisLabel: {
                show: false
              },
              splitLine: {
                show: false
              }
            }),
            yAxis: {
              type: 'category',
              data: [''],
              axisLabel: {
                show: false
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              }
            },
            legend: {
              bottom: 0,
              itemWidth: 9,
              itemHeight: 9,
              textStyle: {
                fontSize: 9,
                fontFamily: t.fonts.body
              },
              type: 'scroll'
            },
            series: series.map((s, i) => ({
              name: s.name,
              type: 'bar',
              stack: 'total',
              barWidth: 26,
              data: [vals[i]],
              itemStyle: {
                color: colorAt(i)
              }
            }))
          });
        }
      case 'lollipop':
      case 'lollipop-h':
        {
          const horiz = type === 'lollipop-h';
          const stickCol = C.axisLine,
            dotCol = model.color || C.line;
          const stick = {
            type: 'bar',
            barWidth: 2,
            data: vals.map((v, i) => ({
              value: v,
              itemStyle: {
                color: stickCol
              }
            })),
            z: 1,
            silent: true
          };
          const dots = {
            type: 'scatter',
            data: vals,
            symbolSize: meta.compact ? 8 : 11,
            itemStyle: {
              color: dotCol
            },
            z: 2,
            label: {
              show: !meta.compact,
              position: horiz ? 'right' : 'top',
              formatter: p => fmt(p.value),
              ...lblPct
            }
          };
          return Object.assign(base, horiz ? {
            grid: {
              left: 2,
              right: 30,
              top: 6,
              bottom: 2,
              containLabel: true
            },
            xAxis: valAxis(),
            yAxis: catAxis({
              inverse: true,
              axisLabel: Object.assign({
                width: 80,
                overflow: 'truncate'
              }, {
                color: C.axisLabelInk,
                fontSize: 9,
                fontFamily: t.fonts.body
              }),
              axisLine: {
                show: false
              }
            }),
            series: [stick, dots]
          } : {
            xAxis: catAxis({
              axisLabel: Object.assign({
                interval: Math.max(0, Math.ceil(names.length / 12) - 1)
              }, axL)
            }),
            yAxis: valAxis(),
            series: [stick, dots]
          });
        }
      case 'polar':
        {
          return Object.assign(base, {
            polar: {
              radius: ['18%', '78%']
            },
            angleAxis: {
              type: 'category',
              data: names,
              axisLabel: {
                color: C.axisLabel,
                fontSize: 9,
                fontFamily: t.fonts.body
              },
              axisLine: {
                lineStyle: {
                  color: C.axisLine
                }
              }
            },
            radiusAxis: {
              axisLabel: {
                color: C.axisLabel,
                fontSize: 8,
                fontFamily: t.fonts.mono
              },
              splitLine: {
                lineStyle: {
                  color: C.splitLine
                }
              }
            },
            series: [{
              type: 'bar',
              coordinateSystem: 'polar',
              data: vals.map((v, i) => ({
                value: v,
                itemStyle: {
                  color: colorAt(i)
                }
              }))
            }]
          });
        }
      case 'waterfall':
        {
          const help = [];
          let acc = 0;
          vals.forEach(v => {
            help.push(Math.min(acc, acc + v));
            acc += v;
          });
          return Object.assign(base, {
            xAxis: catAxis({
              axisLabel: Object.assign({
                interval: 0,
                rotate: names.length > 6 ? 30 : 0
              }, axL)
            }),
            yAxis: valAxis(),
            series: [{
              type: 'bar',
              stack: 'wf',
              itemStyle: {
                color: 'transparent'
              },
              emphasis: {
                itemStyle: {
                  color: 'transparent'
                }
              },
              data: help,
              silent: true
            }, {
              type: 'bar',
              stack: 'wf',
              barWidth: '52%',
              data: vals.map(v => ({
                value: Math.abs(v),
                itemStyle: {
                  color: v >= 0 ? C.positive : C.negative,
                  borderRadius: 2
                }
              })),
              label: {
                show: !meta.compact,
                position: 'top',
                formatter: p => fmt(vals[p.dataIndex]),
                ...lblPct
              }
            }]
          });
        }
      case 'donut':
      case 'pie':
      case 'rose':
        {
          const radius = type === 'donut' ? meta.radius || ['52%', '80%'] : type === 'rose' ? ['12%', '82%'] : ['0%', '78%'];
          return Object.assign(base, {
            series: [{
              type: 'pie',
              radius,
              roseType: type === 'rose' ? 'radius' : false,
              center: meta.noLabel ? ['50%', '50%'] : ['38%', '52%'],
              avoidLabelOverlap: true,
              minShowLabelAngle: 6,
              itemStyle: {
                borderColor: '#fff',
                borderWidth: 1.5
              },
              label: meta.noLabel ? {
                show: false
              } : {
                fontSize: meta.compact ? 9 : 11,
                fontFamily: t.fonts.body,
                color: P.ink,
                formatter: p => `${p.name}  ${fmt(p.value)}`
              },
              labelLine: meta.noLabel ? {
                show: false
              } : {
                length: 8,
                length2: 8,
                lineStyle: {
                  color: C.labelLine
                }
              },
              data: series.map((s, i) => ({
                name: s.name,
                value: vals[i],
                itemStyle: {
                  color: colorAt(i)
                }
              }))
            }]
          });
        }
      case 'funnel':
        {
          return Object.assign(base, {
            series: [{
              type: 'funnel',
              left: '6%',
              right: '6%',
              top: 6,
              bottom: 6,
              minSize: '14%',
              gap: 2,
              sort: 'descending',
              label: {
                fontSize: meta.compact ? 9 : 11,
                fontFamily: t.fonts.body,
                color: '#fff',
                formatter: p => `${p.name}`
              },
              data: series.map((s, i) => ({
                name: s.name,
                value: vals[i],
                itemStyle: {
                  color: colorAt(i)
                }
              }))
            }]
          });
        }
      case 'treemap':
        {
          return Object.assign(base, {
            series: [{
              type: 'treemap',
              roam: false,
              nodeClick: false,
              breadcrumb: {
                show: false
              },
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              label: {
                fontSize: meta.compact ? 9 : 11,
                fontFamily: t.fonts.body,
                color: '#fff',
                formatter: p => `${p.name}\n${fmt(p.value)}`
              },
              itemStyle: {
                borderColor: '#fff',
                borderWidth: 2,
                gapWidth: 2
              },
              data: series.map((s, i) => ({
                name: s.name,
                value: vals[i],
                itemStyle: {
                  color: colorAt(i)
                }
              }))
            }]
          });
        }
      case 'radar':
        {
          const max = Math.max(...vals, 0.01) * 1.15;
          return Object.assign(base, {
            radar: {
              indicator: names.map(n => ({
                name: n,
                max
              })),
              radius: '64%',
              axisName: {
                color: C.axisLabelInk,
                fontSize: 9,
                fontFamily: t.fonts.body
              },
              splitLine: {
                lineStyle: {
                  color: C.splitLine
                }
              },
              splitArea: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: C.axisLine
                }
              }
            },
            series: [{
              type: 'radar',
              data: [{
                value: vals
              }],
              areaStyle: {
                color: grad(C.gradientFrom || (model.color || C.line) + '2e', C.gradientTo || 'rgba(0,0,0,0)')
              },
              lineStyle: {
                color: model.color || C.line,
                width: 2
              },
              itemStyle: {
                color: model.color || C.line
              },
              symbolSize: 4
            }]
          });
        }
      case 'scatter':
        {
          return Object.assign(base, {
            xAxis: catAxis({
              axisLabel: Object.assign({
                interval: Math.max(0, Math.ceil(names.length / 10) - 1)
              }, axL)
            }),
            yAxis: valAxis(),
            series: [{
              type: 'scatter',
              symbolSize: meta.compact ? 9 : 13,
              data: vals.map((v, i) => [i, v]),
              itemStyle: {
                color: model.color || C.line,
                opacity: .82
              }
            }]
          });
        }
      case 'heatmap':
        {
          const mx = Math.max(...vals),
            mn = Math.min(...vals);
          return Object.assign(base, {
            grid: {
              left: 2,
              right: 8,
              top: 6,
              bottom: 28,
              containLabel: true
            },
            xAxis: catAxis({
              splitArea: {
                show: true
              },
              axisLabel: Object.assign({
                interval: 0,
                fontSize: 8
              }, axL)
            }),
            yAxis: {
              type: 'category',
              data: [''],
              axisLabel: {
                show: false
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              }
            },
            visualMap: {
              min: mn,
              max: mx,
              calculable: true,
              orient: 'horizontal',
              left: 'center',
              bottom: 0,
              itemHeight: 60,
              itemWidth: 10,
              textStyle: {
                fontSize: 8,
                fontFamily: t.fonts.mono,
                color: C.axisLabel
              },
              inRange: {
                color: [C.lineSoft || '#cdd', C.line]
              }
            },
            series: [{
              type: 'heatmap',
              data: vals.map((v, i) => [i, 0, +v.toFixed(2)]),
              label: {
                show: !meta.compact,
                fontSize: 8,
                formatter: p => fmt(p.value[2])
              }
            }]
          });
        }
      case 'gauge':
        {
          const v = vals[0] || 0,
            mx = Math.max(Math.abs(v) * 1.4, 10);
          return Object.assign(base, {
            series: [{
              type: 'gauge',
              min: 0,
              max: mx,
              radius: '92%',
              progress: {
                show: true,
                width: 10,
                itemStyle: {
                  color: model.color || C.line
                }
              },
              axisLine: {
                lineStyle: {
                  width: 10,
                  color: [[1, C.splitLine]]
                }
              },
              axisTick: {
                show: false
              },
              splitLine: {
                show: false
              },
              axisLabel: {
                show: false
              },
              pointer: {
                width: 4,
                itemStyle: {
                  color: C.lineDeep || C.line
                }
              },
              anchor: {
                show: false
              },
              title: {
                offsetCenter: [0, '64%'],
                fontSize: 10,
                color: C.axisLabel,
                fontFamily: t.fonts.body
              },
              detail: {
                valueAnimation: true,
                formatter: fmt,
                fontSize: 18,
                fontFamily: t.fonts.mono,
                color: P.ink,
                offsetCenter: [0, '34%']
              },
              data: [{
                value: v,
                name: names[0] || ''
              }]
            }]
          });
        }
      default:
        return buildOption(Object.assign({}, model, {
          type: 'line'
        }), t);
    }
  }
  window.FactsheetECharts = {
    THEMES,
    resolveTheme,
    buildOption,
    CHART_CATALOG
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "exports/lfg-handoff/02-factsheet-editor/factsheet/echarts-kit.js", error: String((e && e.message) || e) }); }

// exports/lfg-handoff/02-factsheet-editor/factsheet/excel.js
try { (() => {
/* Excel ↔ Factsheet bridge for the builder.
   Canonical template format (one workbook per fund) that maps 1:1 to the
   FUND_DATA schema in data.js. Uses the global SheetJS (XLSX) loaded in index.html.

   Sheets
   ──────
   Meta          key | value     fund identity, costs, classification
   Text          key | value     marketing prose (Mission / Strategy / Objective_n / Process)
   Monthly       Year | Jan…Dec  monthly returns in PERCENT (e.g. 2.27 = +2.27%)
   Holdings      Name | Weight%   top holdings
   Breakdown     Section | Item | Weight%   donut/bar tables (see SECTION_MAP)
   GeneralInfo   Label | Value    overrides the right-hand info table
   ShareClasses  Class | ISIN | Currency | AuM | NAV | MTD% | YTD%

   The parser is tolerant: header lookup is case-insensitive, blank rows are
   skipped, and any sheet that's missing simply leaves the family default intact.
   Real-world masters (Bloomberg / VG multi-sheet / Morningstar export) are
   converted to THIS canonical workbook by the repo-side parsers — see
   parsers/*.md in github.com/andreamidolo/factsheetbuilder. */
(function () {
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const MUP = MONTHS.map(m => m.toUpperCase());

  // Breakdown "Section" label → field on the fund object.
  const SECTION_MAP = {
    'asset allocation': 'allocation',
    'currency': 'currency',
    'currency allocation': 'currency',
    'equity sectors': 'sectors',
    'sectors': 'sectors',
    'exposure by country': 'countries',
    'country': 'countries',
    'strategy': 'strategy',
    'strategy breakdown': 'strategy',
    'rating breakdown': 'fiSleeve.ratings',
    'equity sleeve sectors': 'equitySleeve.sectors'
  };
  const pct = v => v === '' || v == null || isNaN(+v) ? null : +v / 100;
  const num = v => v === '' || v == null || isNaN(+v) ? null : +v;

  /* ---------- BUILD: fund object → SheetJS workbook ---------- */
  function buildWorkbook(d) {
    const wb = XLSX.utils.book_new();
    const aoa = rows => XLSX.utils.aoa_to_sheet(rows);

    // Meta
    const meta = d.meta || {};
    const fee = label => (d.generalInfo.find(r => r.label.toLowerCase().includes(label)) || {}).value || '';
    const metaRows = [['key', 'value'], ['Family', d.family], ['Layout', d.layout || ''], ['Fund_name', meta.fundName || ''], ['Subtitle', meta.subtitle || ''], ['Share_class', meta.shareClass || ''], ['Category', meta.category || ''], ['As_of', meta.asOf || ''], ['Currency', (d.generalInfo.find(r => /currency/i.test(r.label)) || {}).value || ''], ['NAV', d.nutshell.nav || ''], ['Fund_size', d.nutshell.fundSize || ''], ['Risk_indicator', d.risk || ''], ['SFDR', d.sfdr || ''], ['Morningstar_rating', meta.rating || ''], ['Start_NAV', d.startNav || ''], ['Balanced', d.balanced ? 'Yes' : 'No']];
    XLSX.utils.book_append_sheet(wb, aoa(metaRows), 'Meta');

    // Text
    const textRows = [['key', 'value'], ['Mission', d.mission || '']];
    if (d.strategyText) textRows.push(['Strategy', d.strategyText]);
    if (d.process) textRows.push(['Process', d.process]);
    (d.objective || []).forEach((o, i) => textRows.push([`Objective_${i + 1}`, o]));
    XLSX.utils.book_append_sheet(wb, aoa(textRows), 'Text');

    // Monthly (percent)
    const mRows = [['Year', ...MONTHS]];
    Object.keys(d.monthly).sort().forEach(y => {
      mRows.push([y, ...MUP.map(m => {
        const v = d.monthly[y][m];
        return v === undefined || v === null ? '' : +(v * 100).toFixed(4);
      })]);
    });
    XLSX.utils.book_append_sheet(wb, aoa(mRows), 'Monthly');

    // GeneralInfo
    XLSX.utils.book_append_sheet(wb, aoa([['Label', 'Value'], ...d.generalInfo.map(r => [r.label, r.value])]), 'GeneralInfo');

    // Holdings
    if (d.holdings) XLSX.utils.book_append_sheet(wb, aoa([['Name', 'Weight%'], ...d.holdings.map(h => [h.name, +(h.weight * 100).toFixed(2)])]), 'Holdings');

    // Breakdown
    const brk = [['Section', 'Item', 'Weight%']];
    const push = (section, arr, key = 'name') => (arr || []).forEach(r => brk.push([section, r[key] || r.sector, +(r.weight * 100).toFixed(2)]));
    push('Asset Allocation', d.allocation);
    push('Currency', d.currency);
    push('Strategy', d.strategy);
    if (d.family === 'zest' && !d.balanced) {
      push('Equity Sectors', d.sectors);
      push('Exposure by Country', d.countries);
    }
    if (d.equitySleeve) push('Equity Sleeve Sectors', d.equitySleeve.sectors);
    if (d.fiSleeve) push('Rating Breakdown', d.fiSleeve.ratings);
    if (brk.length > 1) XLSX.utils.book_append_sheet(wb, aoa(brk), 'Breakdown');

    // ShareClasses
    if (d.shareClasses) XLSX.utils.book_append_sheet(wb, aoa([['Class', 'ISIN', 'Currency', 'AuM', 'NAV', 'MTD%', 'YTD%'], ...d.shareClasses.map(s => [s.name, s.isin, s.ccy, s.aum, s.nav, +(s.mtd * 100).toFixed(2), +(s.ytd * 100).toFixed(2)])]), 'ShareClasses');
    return wb;
  }
  function downloadTemplate(d) {
    const wb = buildWorkbook(d);
    const safe = (d.meta.fundName || 'factsheet').replace(/[^\w]+/g, '_');
    XLSX.writeFile(wb, `${safe}__template.xlsx`);
  }

  /* ---------- PARSE: workbook → fund object (merged on a base default) ---------- */
  function sheetRows(wb, name) {
    const ws = wb.Sheets[Object.keys(wb.Sheets).find(s => s.toLowerCase() === name.toLowerCase())];
    return ws ? XLSX.utils.sheet_to_json(ws, {
      header: 1,
      blankrows: false,
      defval: ''
    }) : null;
  }
  function kv(rows) {
    const o = {};
    (rows || []).slice(1).forEach(r => {
      if (r[0] !== '' && r[0] != null) o[String(r[0]).trim().toLowerCase()] = r[1];
    });
    return o;
  }
  function setDeep(obj, path, val) {
    const ks = path.split('.');
    let t = obj;
    while (ks.length > 1) {
      const k = ks.shift();
      t[k] = t[k] || {};
      t = t[k];
    }
    t[ks[0]] = val;
  }
  function parseWorkbook(wb, baseByFamily) {
    const meta = kv(sheetRows(wb, 'Meta'));
    const family = (meta['family'] || 'vg').toString().trim().toLowerCase();
    // clone a same-family default so untouched fields keep rendering
    const baseKey = baseByFamily[family] || Object.keys(window.FUND_DATA).find(k => window.FUND_DATA[k].family === family);
    const d = JSON.parse(JSON.stringify(window.FUND_DATA[baseKey]));
    if (meta['layout']) d.layout = meta['layout'];
    d.balanced = /^y/i.test(String(meta['balanced'] || (d.balanced ? 'yes' : 'no')));
    d.meta.fundName = meta['fund_name'] || d.meta.fundName;
    if (meta['subtitle'] !== undefined && meta['subtitle'] !== '') d.meta.subtitle = meta['subtitle'];
    d.meta.shareClass = meta['share_class'] || d.meta.shareClass;
    d.meta.category = meta['category'] || d.meta.category;
    d.meta.asOf = meta['as_of'] || d.meta.asOf;
    if (meta['morningstar_rating']) d.meta.rating = +meta['morningstar_rating'] || d.meta.rating;
    if (meta['nav']) d.nutshell.nav = String(meta['nav']);
    if (meta['fund_size']) d.nutshell.fundSize = meta['fund_size'];
    if (meta['risk_indicator']) d.risk = +meta['risk_indicator'];
    if (meta['sfdr']) d.sfdr = meta['sfdr'];
    if (meta['start_nav']) d.startNav = +meta['start_nav'];

    // Text
    const text = kv(sheetRows(wb, 'Text'));
    if (text['mission']) d.mission = text['mission'];
    if (text['strategy']) d.strategyText = text['strategy'];
    if (text['process']) d.process = text['process'];
    const objs = Object.keys(text).filter(k => /^objective_\d+/.test(k)).sort().map(k => text[k]).filter(Boolean);
    if (objs.length) d.objective = objs;

    // Monthly → decimals + recompute YTD by compounding (repo behaviour)
    const mr = sheetRows(wb, 'Monthly');
    if (mr && mr.length > 1) {
      const hdr = mr[0].map(h => String(h).trim().toLowerCase());
      const mi = MONTHS.map(m => hdr.indexOf(m.toLowerCase()));
      const yi = hdr.indexOf('year');
      const monthly = {};
      mr.slice(1).forEach(row => {
        const y = String(row[yi]).trim();
        if (!y) return;
        const rec = {};
        let ytd = 1,
          any = false;
        MUP.forEach((M, k) => {
          const v = pct(row[mi[k]]);
          if (v !== null) {
            rec[M] = v;
            ytd *= 1 + v;
            any = true;
          }
        });
        if (any) rec.YTD = +(ytd - 1).toFixed(6);
        monthly[y] = rec;
      });
      if (Object.keys(monthly).length) {
        d.monthly = monthly;
        const years = Object.keys(monthly).sort();
        const last = monthly[years[years.length - 1]];
        if (last && last.YTD != null) d.nutshell.ytd = last.YTD;
        const lastMonth = MUP.filter(M => last[M] != null).pop();
        if (lastMonth) d.nutshell.mtd = last[lastMonth];
      }
    }

    // GeneralInfo
    const gi = sheetRows(wb, 'GeneralInfo');
    if (gi && gi.length > 1) {
      const rows = gi.slice(1).filter(r => r[0] !== '' && r[0] != null).map(r => ({
        label: String(r[0]),
        value: String(r[1]),
        mono: /isin/i.test(String(r[0]))
      }));
      if (rows.length) d.generalInfo = rows;
    }

    // Holdings
    const hr = sheetRows(wb, 'Holdings');
    if (hr && hr.length > 1) {
      const rows = hr.slice(1).filter(r => r[0] !== '' && r[0] != null).map(r => ({
        name: String(r[0]),
        weight: pct(r[1]) || 0
      }));
      if (rows.length) d.holdings = rows;
    }

    // Breakdown
    const br = sheetRows(wb, 'Breakdown');
    if (br && br.length > 1) {
      const buckets = {};
      br.slice(1).forEach(r => {
        const sec = String(r[0] || '').trim().toLowerCase();
        const item = r[1];
        const w = pct(r[2]);
        if (!sec || item === '' || w == null) return;
        const field = SECTION_MAP[sec];
        if (!field) return;
        (buckets[field] = buckets[field] || []).push({
          name: String(item),
          sector: String(item),
          weight: w
        });
      });
      Object.entries(buckets).forEach(([field, arr]) => setDeep(d, field, arr));
    }

    // ShareClasses
    const sc = sheetRows(wb, 'ShareClasses');
    if (sc && sc.length > 1) {
      const rows = sc.slice(1).filter(r => r[0] !== '' && r[0] != null).map(r => ({
        name: String(r[0]),
        isin: String(r[1] || ''),
        ccy: String(r[2] || ''),
        aum: num(r[3]) || 0,
        nav: num(r[4]) || 0,
        mtd: pct(r[5]) || 0,
        ytd: pct(r[6]) || 0
      }));
      if (rows.length) d.shareClasses = rows;
    }
    return {
      fund: d,
      family,
      fundName: d.meta.fundName
    };
  }
  window.FactsheetExcel = {
    buildWorkbook,
    downloadTemplate,
    parseWorkbook,
    SECTION_MAP
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "exports/lfg-handoff/02-factsheet-editor/factsheet/excel.js", error: String((e && e.message) || e) }); }

// exports/lfg-handoff/02-factsheet-editor/factsheet/layout-kit.jsx
try { (() => {
/* layout-kit.jsx — module/block layout + editable tables + freeform canvas.
   Per-document override store (parallel to Charts.jsx window.__chartOv):
     • module overrides → `<doc>::mod::<id>`     { width, orderDelta, hidden, grow, view }
     • table overrides  → `<doc>::tbl::<id>`      rows[]
     • canvas blocks    → `<doc>::blocks::<page>` block[]
   Controls show only in edit mode (window.__chartEditMode); reverted with chart edits.
   Exposes window.KitLayout = { ModuleGrid, Module, EditableTable, ModuleCanvas }. */

const {
  useState: useLState
} = React;
const LZ = window.__layoutOv = window.__layoutOv || {};
const lkey = (id, kind) => (window.__activeDoc || 'doc') + '::' + kind + '::' + id;
const rerender = () => window.__sheetRerender && window.__sheetRerender();
window.__getModOv = id => LZ[lkey(id, 'mod')];
window.__setModOv = (id, patch) => {
  LZ[lkey(id, 'mod')] = Object.assign({}, LZ[lkey(id, 'mod')], patch);
  rerender();
};
window.__getTableOv = id => LZ[lkey(id, 'tbl')];
window.__setTableOv = (id, rows) => {
  LZ[lkey(id, 'tbl')] = rows;
  rerender();
};
window.__getBlocks = (page, seed) => LZ[lkey(page, 'blocks')] || seed || [];
window.__setBlocks = (page, blocks) => {
  LZ[lkey(page, 'blocks')] = blocks;
  rerender();
};
window.__getPages = (docKey, seed) => LZ[lkey(docKey, 'pages')] || seed || [];
window.__setPages = (docKey, pages) => {
  LZ[lkey(docKey, 'pages')] = pages;
  rerender();
};
/* total sheet count for a family doc = fixed pages before the canvas + canvas pages */
window.__pageTotal = (docKey, seed, fixedBefore) => (fixedBefore || 1) + window.__getPages(docKey, seed).length;
window.__clearLayoutOv = doc => {
  const p = (doc || window.__activeDoc || 'doc') + '::';
  Object.keys(LZ).forEach(k => {
    if (k.indexOf(p) === 0) delete LZ[k];
  });
  rerender();
};
window.__hasLayoutOv = doc => {
  const p = (doc || window.__activeDoc || 'doc') + '::';
  return Object.keys(LZ).some(k => k.indexOf(p) === 0);
};
const editing = () => !!window.__chartEditMode;

/* cross-factsheet component clipboard (same-family paste) */
window.__copyBlock = (family, block) => {
  window.__clip = {
    family,
    block: JSON.parse(JSON.stringify(block))
  };
  rerender();
};
window.__getClip = () => window.__clip || null;
/* clone every override (layout + per-chart) from one doc key to another — used by "Duplicate factsheet" */
window.__cloneDocOv = (from, to) => {
  [window.__layoutOv, window.__chartOv].forEach(store => {
    if (!store) return;
    Object.keys(store).forEach(k => {
      if (k.indexOf(from + '::') === 0) store[to + k.slice(from.length)] = JSON.parse(JSON.stringify(store[k]));
    });
  });
};
const WIDTHS = ['full', 'two-thirds', 'half', 'third'];
const basisOf = w => w === 'full' ? '100%' : w === 'two-thirds' ? 'calc(66.666% - var(--mod-gap) / 3)' : w === 'half' ? 'calc(50% - var(--mod-gap) / 2)' : 'calc(33.333% - var(--mod-gap) * 2 / 3)';
const wGlyph = w => w === 'full' ? '▭' : w === 'two-thirds' ? '▥' : w === 'half' ? '◧' : '◰';

/* ---------- ModuleGrid: vertical stack (page-1 perf zone) ---------- */
function ModuleGrid({
  children,
  gap = 8,
  fill = false,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "mod-grid",
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: gap + 'px',
      ['--mod-gap']: gap + 'px',
      ...(fill ? {
        flex: 1,
        minHeight: 0
      } : {}),
      ...style
    }
  }, children);
}

/* ---------- Module: resize / reorder / hide / grow / swap ---------- */
function Module({
  id,
  title,
  order = 0,
  width = 'full',
  grow = false,
  swap,
  children,
  style
}) {
  const ov = id && window.__getModOv(id) || {};
  const ed = editing();
  if (ov.hidden) {
    if (!ed) return null;
    return /*#__PURE__*/React.createElement("div", {
      className: "mod mod-hidden",
      style: {
        width: basisOf(ov.width || width),
        alignSelf: 'flex-start',
        order: order * 10 + (ov.orderDelta || 0)
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "mod-restore",
      onClick: () => window.__setModOv(id, {
        hidden: false
      })
    }, "\uFF0B ", title || 'module', " (hidden) \u2014 restore"));
  }
  const w = ov.width || width;
  const g = ov.grow != null ? ov.grow : grow;
  const eff = order * 10 + (ov.orderDelta || 0);
  const cycleW = () => {
    const i = WIDTHS.indexOf(w);
    window.__setModOv(id, {
      width: WIDTHS[(i + 1) % WIDTHS.length]
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: 'mod' + (ov.width || ov.orderDelta || ov.grow != null ? ' mod-touched' : ''),
    style: {
      width: basisOf(w),
      alignSelf: 'flex-start',
      order: eff,
      flexGrow: g ? 1 : 0,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      minHeight: 0,
      position: 'relative',
      ...style
    }
  }, ed && id && /*#__PURE__*/React.createElement("div", {
    className: "mod-bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mod-name"
  }, title || id), /*#__PURE__*/React.createElement("span", {
    className: "mod-tools"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: cycleW,
    title: "Cycle width"
  }, wGlyph(w), " ", w), swap && /*#__PURE__*/React.createElement("button", {
    onClick: () => window.__setModOv(id, {
      view: (ov.view || swap[0]) === swap[0] ? swap[1] : swap[0]
    }),
    title: "Swap chart / table"
  }, "\u21C4 ", (ov.view || swap[0]) === swap[0] ? swap[1] : swap[0]), /*#__PURE__*/React.createElement("button", {
    onClick: () => window.__setModOv(id, {
      orderDelta: (ov.orderDelta || 0) - 15
    }),
    title: "Move up"
  }, "\u2191"), /*#__PURE__*/React.createElement("button", {
    onClick: () => window.__setModOv(id, {
      orderDelta: (ov.orderDelta || 0) + 15
    }),
    title: "Move down"
  }, "\u2193"), /*#__PURE__*/React.createElement("button", {
    onClick: () => window.__setModOv(id, {
      grow: !g
    }),
    title: "Fill remaining height",
    className: g ? 'on' : ''
  }, "\u2922"), /*#__PURE__*/React.createElement("button", {
    onClick: () => window.__setModOv(id, {
      hidden: true
    }),
    title: "Hide"
  }, "\u2715"))), /*#__PURE__*/React.createElement("div", {
    className: "mod-body",
    style: {
      flex: g ? 1 : 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: g ? 'center' : 'flex-start'
    }
  }, typeof children === 'function' ? children(ov.view || swap && swap[0]) : children));
}

/* ---------- EditableTable: +/− rows & columns, inline cell edit; store OR controlled ---------- */
function EditableTable({
  id,
  columns,
  rows,
  value,
  onChange,
  onColumnsChange,
  accentHeader = false,
  zebra = false,
  footRow,
  dense = true,
  noHead = false
}) {
  const controlled = typeof onChange === 'function';
  const dynCols = typeof onColumnsChange === 'function';
  const ov = !controlled && id && window.__getTableOv(id);
  const data = (controlled ? value || [] : ov || rows).map(r => ({
    ...r
  }));
  const ed = editing();
  const fz = dense ? 10 : 11;
  const fmt = (v, c) => {
    if (v === '' || v == null) return '';
    if (c.type === 'pct') return (+v).toFixed(c.dp != null ? c.dp : 2) + '%';
    if (c.type === 'num') return (+v).toLocaleString(undefined, {
      maximumFractionDigits: c.dp != null ? c.dp : 2
    });
    return v;
  };
  const commit = next => controlled ? onChange(next) : window.__setTableOv(id, next);
  const setCell = (ri, key, val) => commit(data.map((r, i) => i === ri ? {
    ...r,
    [key]: val
  } : r));
  const addRow = () => {
    const blank = {};
    columns.forEach(c => blank[c.key] = c.type === 'pct' || c.type === 'num' ? 0 : '');
    commit([...data, blank]);
  };
  const delRow = ri => commit(data.filter((_, i) => i !== ri));
  const addCol = () => {
    const key = 'c' + Math.random().toString(36).slice(2, 6);
    onColumnsChange([...columns, {
      key,
      label: 'New',
      align: 'right'
    }]);
  };
  const delCol = key => onColumnsChange(columns.filter(c => c.key !== key));
  const renameCol = (key, label) => onColumnsChange(columns.map(c => c.key === key ? {
    ...c,
    label
  } : c));
  const thBase = {
    fontSize: dense ? 9 : 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '.04em',
    padding: '4px 6px'
  };
  const headStyle = accentHeader ? {
    background: 'var(--table-header-bg, var(--accent))',
    color: 'var(--table-header-ink,#fff)'
  } : {
    color: 'var(--ink-500)'
  };
  const cellBorder = '.75px solid var(--doc-line)';
  return /*#__PURE__*/React.createElement("div", {
    className: 'etable' + (ov ? ' etable-edited' : ''),
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: 'var(--font-body)'
    }
  }, !noHead && /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: headStyle
  }, ed && /*#__PURE__*/React.createElement("th", {
    style: {
      ...thBase,
      width: 16
    }
  }), columns.map(c => /*#__PURE__*/React.createElement("th", {
    key: c.key,
    style: {
      ...thBase,
      textAlign: c.align || (c.type ? 'right' : 'left'),
      width: c.width,
      ...(accentHeader ? {} : {
        borderBottom: '1px solid var(--accent)'
      })
    }
  }, ed && dynCols && !c.compute ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 2,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: c.label || '',
    onChange: e => renameCol(c.key, e.target.value),
    style: {
      width: '100%',
      minWidth: 30,
      border: '1px solid ' + (accentHeader ? 'rgba(255,255,255,.4)' : 'var(--line)'),
      borderRadius: 3,
      padding: '1px 3px',
      font: 'inherit',
      fontSize: dense ? 9 : 10,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '.04em',
      textAlign: c.align || 'left',
      background: accentHeader ? 'transparent' : '#fff',
      color: 'inherit'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => delCol(c.key),
    title: "Remove column",
    style: {
      border: 0,
      background: 'none',
      color: 'inherit',
      opacity: .7,
      cursor: 'pointer',
      fontSize: 11,
      lineHeight: 1,
      padding: 0
    }
  }, "\xD7")) : c.label)), ed && dynCols && /*#__PURE__*/React.createElement("th", {
    style: {
      ...thBase,
      width: 22,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: addCol,
    title: "Add column",
    style: {
      border: 0,
      background: 'none',
      color: 'inherit',
      cursor: 'pointer',
      fontSize: 13,
      lineHeight: 1,
      padding: 0
    }
  }, "\uFF0B")))), /*#__PURE__*/React.createElement("tbody", null, data.map((r, ri) => /*#__PURE__*/React.createElement("tr", {
    key: ri,
    style: {
      fontSize: fz,
      background: zebra && ri % 2 ? 'var(--table-zebra, transparent)' : 'transparent'
    }
  }, ed && /*#__PURE__*/React.createElement("td", {
    style: {
      borderBottom: cellBorder,
      textAlign: 'center',
      width: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "row-del",
    onClick: () => delRow(ri),
    title: "Remove row"
  }, "\u2212")), columns.map(c => {
    const val = c.compute ? c.compute(r) : r[c.key];
    const align = c.align || (c.type ? 'right' : 'left');
    const mono = c.type === 'pct' || c.type === 'num' || c.mono;
    return /*#__PURE__*/React.createElement("td", {
      key: c.key,
      style: {
        padding: '3px 6px',
        borderBottom: cellBorder,
        textAlign: align,
        color: c.color ? c.color(r) : 'var(--doc-ink)',
        fontFamily: mono ? 'var(--font-mono)' : 'inherit',
        fontWeight: c.bold ? 700 : 400,
        fontSize: mono ? fz - 1 : fz
      }
    }, ed && !c.compute ? /*#__PURE__*/React.createElement("input", {
      value: r[c.key] ?? '',
      onChange: e => setCell(ri, c.key, e.target.value),
      style: {
        width: c.type ? 56 : '100%',
        border: '1px solid var(--line)',
        borderRadius: 3,
        padding: '2px 4px',
        fontFamily: 'inherit',
        fontSize: fz - 1,
        textAlign: align,
        background: '#fff'
      }
    }) : c.compute ? val : c.type ? fmt(val, c) : val);
  }), ed && dynCols && /*#__PURE__*/React.createElement("td", {
    style: {
      borderBottom: cellBorder
    }
  }))), footRow && !ed && /*#__PURE__*/React.createElement("tr", {
    style: {
      fontSize: fz,
      fontWeight: 700
    }
  }, columns.map(c => /*#__PURE__*/React.createElement("td", {
    key: c.key,
    style: {
      padding: '4px 6px',
      borderTop: '1px solid var(--accent)',
      textAlign: c.align || (c.type ? 'right' : 'left'),
      fontFamily: c.type ? 'var(--font-mono)' : 'inherit'
    }
  }, footRow[c.key] != null ? c.type ? fmt(footRow[c.key], c) : footRow[c.key] : ''))))), ed && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "row-add",
    onClick: addRow
  }, "\uFF0B Add row"), dynCols && /*#__PURE__*/React.createElement("button", {
    className: "row-add",
    onClick: addCol
  }, "\uFF0B Add column")));
}

/* ============================================================
   ModuleCanvas — freeform interior: create / duplicate / move / resize
   blocks (text, table, chart) plus fixed "preset" blocks for seeded content.
   ============================================================ */

function SectionTitleLocal({
  children,
  variant = 'underline'
}) {
  const DS = window.FundFactsheetDesignSystem_2d23bc;
  return /*#__PURE__*/React.createElement(DS.SectionTitle, {
    variant: variant
  }, children);
}

/* Editable section title — SectionTitle in view mode, inline input in edit mode.
   Keeps created blocks' titles aligned with the rest of the document. */
function BlockTitle({
  value,
  onChange,
  placeholder,
  variant = 'underline'
}) {
  if (!editing()) return value ? /*#__PURE__*/React.createElement(SectionTitleLocal, {
    variant: variant
  }, value) : null;
  const bar = variant === 'bar';
  return /*#__PURE__*/React.createElement("input", {
    value: value || '',
    placeholder: placeholder || 'Section title…',
    onChange: e => onChange(e.target.value),
    style: bar ? {
      width: '100%',
      background: 'var(--section-bar-bg, var(--accent))',
      border: 'none',
      color: 'var(--section-bar-ink,#fff)',
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: '11px',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      textAlign: 'center',
      padding: '7px 12px',
      marginBottom: '2px',
      outline: 'none',
      boxSizing: 'border-box'
    } : {
      width: '100%',
      background: 'transparent',
      border: 'none',
      borderBottom: '1.5px solid var(--accent)',
      color: 'var(--accent)',
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: '11px',
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      padding: '0 0 4px',
      marginBottom: '2px',
      outline: 'none'
    }
  });
}

/* Auto-growing textarea so a text block enlarges as you add copy. */
function AutoText({
  value,
  onChange,
  fine
}) {
  const ref = React.useRef(null);
  const fit = el => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.max(44, el.scrollHeight) + 'px';
  };
  React.useEffect(() => {
    fit(ref.current);
  });
  return /*#__PURE__*/React.createElement("textarea", {
    ref: ref,
    value: value,
    onInput: e => fit(e.target),
    onChange: e => onChange(e.target.value),
    style: {
      width: '100%',
      border: '1px solid var(--line)',
      borderRadius: 4,
      padding: '6px 8px',
      font: 'inherit',
      fontSize: fine ? '8.5px' : '11px',
      lineHeight: 1.5,
      color: 'var(--ink-700)',
      resize: 'vertical',
      overflow: 'hidden',
      boxSizing: 'border-box'
    }
  });
}
function CanvasBlock({
  block,
  idx,
  count,
  pageId,
  presets,
  family,
  onUpdate,
  onMove,
  onDup,
  onDel,
  onCopy
}) {
  const ed = editing();
  const _Cat = window.KitCharts.CatChart;
  const titleVariant = family === 'hive' ? 'bar' : 'underline';
  const w = block.w || 'full';
  const cycleW = () => {
    const i = WIDTHS.indexOf(w);
    onUpdate({
      w: WIDTHS[(i + 1) % WIDTHS.length]
    });
  };
  const isPreset = block.kind === 'preset';
  let body = null;
  if (isPreset && presets && presets[block.preset]) {
    body = presets[block.preset](block);
  } else if (block.kind === 'text') {
    body = ed ? /*#__PURE__*/React.createElement(AutoText, {
      value: block.text,
      onChange: text => onUpdate({
        text
      }),
      fine: block.size === 'fine'
    }) : /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: block.size === 'fine' ? '8.5px' : '11px',
        lineHeight: 1.5,
        color: 'var(--ink-700)',
        margin: 0,
        whiteSpace: 'pre-wrap',
        textWrap: 'pretty',
        columnCount: block.size === 'fine' ? 2 : 1,
        columnGap: '7mm'
      }
    }, block.text);
  } else if (block.kind === 'table') {
    body = /*#__PURE__*/React.createElement(EditableTable, {
      id: pageId + ':' + block.key,
      columns: block.columns,
      value: block.rows,
      onChange: rows => onUpdate({
        rows
      }),
      onColumnsChange: block.noHead ? undefined : cols => onUpdate({
        columns: cols
      }),
      dense: true,
      noHead: block.noHead,
      accentHeader: block.accentHeader,
      zebra: block.zebra
    });
  } else if (block.kind === 'chart') {
    const data = (block.series || []).map(s => ({
      name: s.name,
      weight: (+s.value || 0) / 100,
      color: s.color
    }));
    body = /*#__PURE__*/React.createElement(_Cat, {
      data: data,
      type: block.chartType || 'bar',
      id: pageId + ':' + block.key,
      title: block.title || 'Chart',
      compact: false
    });
  } else if (block.kind === 'banner') {
    const bg = block.accent === false ? 'var(--accent-2)' : 'var(--accent)';
    const tw = {
      background: 'transparent',
      border: 'none',
      color: '#fff',
      outline: 'none',
      fontFamily: 'var(--font-body)'
    };
    body = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        background: bg,
        color: '#fff',
        padding: '6px 12px',
        borderRadius: '4px'
      }
    }, ed ? /*#__PURE__*/React.createElement("input", {
      value: block.title || '',
      onChange: e => onUpdate({
        title: e.target.value
      }),
      style: {
        ...tw,
        flex: 1,
        fontWeight: 600,
        fontSize: '11px',
        letterSpacing: '.1em',
        textTransform: 'uppercase'
      }
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600,
        fontSize: '11px',
        letterSpacing: '.1em',
        textTransform: 'uppercase'
      }
    }, block.title), ed ? /*#__PURE__*/React.createElement("input", {
      value: block.value || '',
      onChange: e => onUpdate({
        value: e.target.value
      }),
      style: {
        ...tw,
        width: '120px',
        textAlign: 'right',
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        fontSize: '13px'
      }
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        fontSize: '13px',
        whiteSpace: 'nowrap'
      }
    }, block.value)), (block.sub || ed) && (ed ? /*#__PURE__*/React.createElement("input", {
      value: block.sub || '',
      placeholder: "subtitle (KPIs)\u2026",
      onChange: e => onUpdate({
        sub: e.target.value
      }),
      style: {
        width: '100%',
        marginTop: '5px',
        border: '1px solid var(--line)',
        borderRadius: 4,
        padding: '4px 8px',
        font: 'inherit',
        fontSize: '9px',
        color: 'var(--ink-600)',
        outline: 'none',
        boxSizing: 'border-box'
      }
    }) : /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: '5px',
        padding: '5px 10px',
        background: 'var(--doc-mist)',
        borderRadius: '4px',
        fontSize: '9.5px',
        fontFamily: 'var(--font-mono)',
        color: 'var(--ink-600)'
      }
    }, block.sub)));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "mod mc-block",
    style: {
      width: basisOf(w),
      alignSelf: 'flex-start',
      flexGrow: 0,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      position: 'relative'
    }
  }, ed && /*#__PURE__*/React.createElement("div", {
    className: "mod-bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mod-name"
  }, block.kind, " \xB7 ", block.title || block.key), /*#__PURE__*/React.createElement("span", {
    className: "mod-tools"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: cycleW,
    title: "Cycle width"
  }, wGlyph(w), " ", w), /*#__PURE__*/React.createElement("button", {
    onClick: () => onMove(-1),
    disabled: idx === 0,
    title: "Move earlier"
  }, "\u2191"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onMove(1),
    disabled: idx === count - 1,
    title: "Move later"
  }, "\u2193"), /*#__PURE__*/React.createElement("button", {
    onClick: onDup,
    title: "Duplicate"
  }, "\u29C9"), !isPreset && /*#__PURE__*/React.createElement("button", {
    onClick: onCopy,
    title: "Copy component (paste into another factsheet of this family)"
  }, "\u29C9\u2192"), /*#__PURE__*/React.createElement("button", {
    onClick: onDel,
    title: "Delete"
  }, "\u2715"))), !isPreset && block.kind !== 'banner' && /*#__PURE__*/React.createElement(BlockTitle, {
    value: block.title,
    onChange: title => onUpdate({
      title
    }),
    placeholder: block.kind + ' title…',
    variant: titleVariant
  }), /*#__PURE__*/React.createElement("div", {
    className: "mod-body",
    style: {
      marginTop: !isPreset && block.kind !== 'banner' && (editing() || block.title) ? 6 : 0
    }
  }, body));
}
function ModuleCanvas({
  pageId,
  seed,
  presets,
  family,
  gap = 10
}) {
  const ed = editing();
  const blocks = window.__getBlocks(pageId, seed);
  const set = b => window.__setBlocks(pageId, b);
  const update = (i, patch) => set(blocks.map((b, k) => k === i ? {
    ...b,
    ...patch
  } : b));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const c = blocks.slice();
    const t = c[i];
    c[i] = c[j];
    c[j] = t;
    set(c);
  };
  const dup = i => {
    const copy = JSON.parse(JSON.stringify(blocks[i]));
    copy.key = (copy.kind || 'b') + '-' + Date.now().toString(36);
    set([...blocks.slice(0, i + 1), copy, ...blocks.slice(i + 1)]);
  };
  const del = i => set(blocks.filter((_, k) => k !== i));
  const copyBlock = i => window.__copyBlock(family, blocks[i]);
  const pasteBlock = () => {
    const c = window.__getClip();
    if (!c) return;
    const nb = JSON.parse(JSON.stringify(c.block));
    nb.key = (nb.kind || 'b') + '-' + Date.now().toString(36);
    set([...blocks, nb]);
  };
  const add = kind => {
    const key = kind + '-' + Date.now().toString(36);
    const nb = kind === 'text' ? {
      key,
      kind: 'text',
      w: 'full',
      title: 'New section',
      text: 'New text block — click to edit.'
    } : kind === 'table' ? {
      key,
      kind: 'table',
      w: 'half',
      title: 'New table',
      columns: [{
        key: 'c0',
        label: 'Item'
      }, {
        key: 'c1',
        label: 'Value',
        type: 'num'
      }],
      rows: [{
        c0: 'Row 1',
        c1: 0
      }, {
        c0: 'Row 2',
        c1: 0
      }]
    } : {
      key,
      kind: 'chart',
      w: 'half',
      title: 'New chart',
      chartType: 'bar',
      series: [{
        name: 'A',
        value: 40
      }, {
        name: 'B',
        value: 35
      }, {
        name: 'C',
        value: 25
      }]
    };
    set([...blocks, nb]);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "mcanvas",
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      alignContent: 'flex-start',
      gap: gap + 'px',
      ['--mod-gap']: gap + 'px',
      flex: 1,
      minHeight: 0
    }
  }, blocks.map((b, i) => /*#__PURE__*/React.createElement(CanvasBlock, {
    key: b.key,
    block: b,
    idx: i,
    count: blocks.length,
    pageId: pageId,
    presets: presets,
    family: family,
    onUpdate: patch => update(i, patch),
    onMove: dir => move(i, dir),
    onDup: () => dup(i),
    onDel: () => del(i),
    onCopy: () => copyBlock(i)
  })), ed && /*#__PURE__*/React.createElement("div", {
    className: "mc-addbar",
    style: {
      width: '100%',
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      padding: '8px 10px',
      border: '1px dashed var(--line-strong)',
      borderRadius: 6,
      background: 'repeating-linear-gradient(45deg,transparent,transparent 7px,rgba(20,25,31,.03) 7px,rgba(20,25,31,.03) 14px)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '.08em',
      color: 'var(--ink-400)'
    }
  }, "Add component"), /*#__PURE__*/React.createElement("button", {
    className: "mc-add",
    onClick: () => add('text')
  }, "\uFF0B Text"), /*#__PURE__*/React.createElement("button", {
    className: "mc-add",
    onClick: () => add('table')
  }, "\uFF0B Table"), /*#__PURE__*/React.createElement("button", {
    className: "mc-add",
    onClick: () => add('chart')
  }, "\uFF0B Chart"), window.__getClip() && window.__getClip().family === family && /*#__PURE__*/React.createElement("button", {
    className: "mc-add",
    style: {
      marginLeft: 'auto',
      borderColor: 'var(--accent)',
      color: 'var(--accent)'
    },
    onClick: pasteBlock,
    title: 'Paste copied ' + window.__getClip().block.kind
  }, "\u29C9\u2192 Paste \u201C", window.__getClip().block.title || window.__getClip().block.kind, "\u201D")));
}

/* ============================================================
   CanvasPages — N duplicatable canvas pages (header + canvas + footer).
   Lets the user build multi-page factsheets: add a blank page or duplicate
   an existing one. Page chrome (A4, MiniHeader, PageFoot) comes from
   window.Factsheets so families share one implementation.
   ============================================================ */
function CanvasPages({
  docKey,
  family,
  d,
  logo,
  serif,
  footerLeft,
  presets,
  pagesSeed,
  blockSeeds = {},
  fixedBefore = 1
}) {
  const F = window.Factsheets;
  const ed = editing();
  const pages = window.__getPages(docKey, pagesSeed || [{
    id: docKey + '-p2'
  }]);
  const total = fixedBefore + pages.length;
  const newId = () => docKey + '-pg-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 4);
  const addPage = () => window.__setPages(docKey, [...pages, {
    id: newId()
  }]);
  const dupPage = i => {
    const src = pages[i],
      id = newId();
    const srcBlocks = window.__getBlocks(src.id, blockSeeds[src.id] || []);
    const copy = JSON.parse(JSON.stringify(srcBlocks)).map(b => ({
      ...b,
      key: (b.kind || 'b') + '-' + Math.random().toString(36).slice(2, 6)
    }));
    window.__setBlocks(id, copy);
    const next = pages.slice();
    next.splice(i + 1, 0, {
      id
    });
    window.__setPages(docKey, next);
  };
  const delPage = i => window.__setPages(docKey, pages.filter((_, k) => k !== i));
  return /*#__PURE__*/React.createElement(React.Fragment, null, pages.map((p, i) => /*#__PURE__*/React.createElement(F.A4, {
    family: family,
    key: p.id
  }, /*#__PURE__*/React.createElement(F.MiniHeader, {
    d: d,
    logo: logo,
    serif: serif
  }), ed && /*#__PURE__*/React.createElement("div", {
    className: "page-ctrl",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      margin: '0 0 8px',
      padding: '5px 9px',
      background: 'var(--doc-mist)',
      borderRadius: 5,
      fontSize: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: 'var(--ink-600)'
    }
  }, "Page ", fixedBefore + i + 1, " of ", total), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "mc-add",
    onClick: () => dupPage(i),
    title: "Duplicate this page"
  }, "\u29C9 Duplicate page"), /*#__PURE__*/React.createElement("button", {
    className: "mc-add",
    onClick: () => delPage(i),
    disabled: pages.length <= 1,
    title: "Delete this page"
  }, "\u2715 Delete page")), /*#__PURE__*/React.createElement(ModuleCanvas, {
    pageId: p.id,
    seed: blockSeeds[p.id],
    presets: presets,
    family: family
  }), /*#__PURE__*/React.createElement(F.PageFoot, {
    left: footerLeft,
    page: fixedBefore + i + 1,
    total: total
  }))), ed && /*#__PURE__*/React.createElement("button", {
    className: "add-page",
    onClick: addPage,
    style: {
      width: '210mm',
      maxWidth: '100%',
      padding: '14px',
      border: '2px dashed var(--line-strong)',
      borderRadius: 8,
      background: 'rgba(255,255,255,.6)',
      color: 'var(--ink-500)',
      fontWeight: 700,
      fontSize: 13,
      cursor: 'pointer'
    }
  }, "\uFF0B Add page"));
}
window.KitLayout = {
  ModuleGrid,
  Module,
  EditableTable,
  ModuleCanvas,
  CanvasPages
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "exports/lfg-handoff/02-factsheet-editor/factsheet/layout-kit.jsx", error: String((e && e.message) || e) }); }

// exports/lfg-handoff/02-factsheet-editor/zest-napr-template/ds-base.js
try { (() => {
// Loads this design system into the template. In a consuming project, point
// base at the bound DS folder relative to this file (e.g. '_ds/<folder>' at
// the project root, '../_ds/<folder>' one level down) — one line to edit.
(() => {
  const base = '../../../../_ds/fund-factsheet-design-system-2d23bc75-cba0-423f-987a-67836c8740db';
  for (const p of ["tokens/fonts.css", "tokens/colors.css", "tokens/typography.css", "tokens/spacing.css", "tokens/families.css", "styles.css"]) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = base + '/' + p;
    document.head.appendChild(l);
  }
  const s = document.createElement('script');
  s.src = base + '/_ds_bundle.js';
  s.onerror = () => console.error('ds-base.js: failed to load ' + s.src + ' — if this is a consuming project, point the base line in ds-base.js at the bound _ds/<folder> tree relative to this page (e.g. _ds/<folder> at the project root, ../_ds/<folder> one level down); in a fresh design system this can just mean the bundle is not compiled yet');
  document.head.appendChild(s);
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "exports/lfg-handoff/02-factsheet-editor/zest-napr-template/ds-base.js", error: String((e && e.message) || e) }); }

// exports/lfg-handoff/02-factsheet-editor/zest-napr-template/napr-data.js
try { (() => {
/* Zest North America Pairs Relative — monthly data source.
   Generated from ZEST_NAPR_Factsheet_Update_Template (May 2026 NAV).
   Replace this object on each monthly upload. */
window.ZEST_NAPR = {
  "meta": {
    "fundName": "Zest North America Pairs Relative",
    "fundId": "ZEST_NAPR",
    "manager": "Pasquale Corvino",
    "category": "EAA Fund Equity Market Neutral EUR/USD",
    "benchmark": "N/A",
    "asOf": "31.05.2026",
    "portfolioDate": "29.05.2026",
    "domicile": "Luxembourg",
    "legalForm": "UCITS · Zest Asset Management SICAV",
    "fundSizeEur": 53.5,
    "totalFundSizeEur": 53532227.09,
    "perfFee": 0.2
  },
  "classes": {
    "R_EUR": {
      "label": "R EUR",
      "code": "R_EUR",
      "isin": "LU1216084993",
      "ccy": "EUR",
      "nav": 1243.73,
      "mtd": 0.0007,
      "ytd": 0.0119,
      "oneY": 0.0234,
      "threeY": 0.1347,
      "annReturn3y": 0.043,
      "stdDev3y": 0.0513,
      "sharpe3y": 0.29,
      "sortino3y": null,
      "aum": 23366390.68,
      "fundSizeDisplay": "EUR 53.5M",
      "mgmtFee": 0.015,
      "frontLoad": 0.03,
      "monthly": [{
        "y": 2019,
        "m": 1,
        "ret": 0.08990000000000001
      }, {
        "y": 2019,
        "m": 2,
        "ret": 0.0073
      }, {
        "y": 2019,
        "m": 3,
        "ret": -0.0027
      }, {
        "y": 2019,
        "m": 4,
        "ret": 0.0107
      }, {
        "y": 2019,
        "m": 5,
        "ret": -0.033
      }, {
        "y": 2019,
        "m": 6,
        "ret": 0.0533
      }, {
        "y": 2019,
        "m": 7,
        "ret": 0.008
      }, {
        "y": 2019,
        "m": 8,
        "ret": -0.005
      }, {
        "y": 2019,
        "m": 9,
        "ret": 0.0059
      }, {
        "y": 2019,
        "m": 10,
        "ret": 0.009000000000000001
      }, {
        "y": 2019,
        "m": 11,
        "ret": -0.0013
      }, {
        "y": 2019,
        "m": 12,
        "ret": 0.0015
      }, {
        "y": 2020,
        "m": 1,
        "ret": -0.0005
      }, {
        "y": 2020,
        "m": 2,
        "ret": 0.0343
      }, {
        "y": 2020,
        "m": 3,
        "ret": 0.0026
      }, {
        "y": 2020,
        "m": 4,
        "ret": 0.0346
      }, {
        "y": 2020,
        "m": 5,
        "ret": 0.0257
      }, {
        "y": 2020,
        "m": 6,
        "ret": 0.0159
      }, {
        "y": 2020,
        "m": 7,
        "ret": 0.0026
      }, {
        "y": 2020,
        "m": 8,
        "ret": -0.009399999999999999
      }, {
        "y": 2020,
        "m": 9,
        "ret": 0.0344
      }, {
        "y": 2020,
        "m": 10,
        "ret": -0.0054
      }, {
        "y": 2020,
        "m": 11,
        "ret": 0.0442
      }, {
        "y": 2020,
        "m": 12,
        "ret": 0.0008
      }, {
        "y": 2021,
        "m": 1,
        "ret": 0.0028
      }, {
        "y": 2021,
        "m": 2,
        "ret": 0.0002
      }, {
        "y": 2021,
        "m": 3,
        "ret": 0.0182
      }, {
        "y": 2021,
        "m": 4,
        "ret": 0.0014
      }, {
        "y": 2021,
        "m": 5,
        "ret": 0.0122
      }, {
        "y": 2021,
        "m": 6,
        "ret": 0.0091
      }, {
        "y": 2021,
        "m": 7,
        "ret": -0.008100000000000001
      }, {
        "y": 2021,
        "m": 8,
        "ret": 0.0028
      }, {
        "y": 2021,
        "m": 9,
        "ret": 0.0087
      }, {
        "y": 2021,
        "m": 10,
        "ret": 0.0068
      }, {
        "y": 2021,
        "m": 11,
        "ret": -0.019
      }, {
        "y": 2021,
        "m": 12,
        "ret": 0.01
      }, {
        "y": 2022,
        "m": 1,
        "ret": -0.0348
      }, {
        "y": 2022,
        "m": 2,
        "ret": 0.0009
      }, {
        "y": 2022,
        "m": 3,
        "ret": 0.0016
      }, {
        "y": 2022,
        "m": 4,
        "ret": -0.0661
      }, {
        "y": 2022,
        "m": 5,
        "ret": 0.0215
      }, {
        "y": 2022,
        "m": 6,
        "ret": -0.09359999999999999
      }, {
        "y": 2022,
        "m": 7,
        "ret": 0.08449999999999999
      }, {
        "y": 2022,
        "m": 8,
        "ret": -0.0204
      }, {
        "y": 2022,
        "m": 9,
        "ret": -0.0614
      }, {
        "y": 2022,
        "m": 10,
        "ret": 0.08109999999999999
      }, {
        "y": 2022,
        "m": 11,
        "ret": 0.0638
      }, {
        "y": 2022,
        "m": 12,
        "ret": -0.0489
      }, {
        "y": 2023,
        "m": 1,
        "ret": 0.067
      }, {
        "y": 2023,
        "m": 2,
        "ret": 0.0058
      }, {
        "y": 2023,
        "m": 3,
        "ret": 0.009000000000000001
      }, {
        "y": 2023,
        "m": 4,
        "ret": 0.014
      }, {
        "y": 2023,
        "m": 5,
        "ret": -0.0062
      }, {
        "y": 2023,
        "m": 6,
        "ret": 0.018
      }, {
        "y": 2023,
        "m": 7,
        "ret": -0.0048
      }, {
        "y": 2023,
        "m": 8,
        "ret": 0.0133
      }, {
        "y": 2023,
        "m": 9,
        "ret": -0.002
      }, {
        "y": 2023,
        "m": 10,
        "ret": -0.0229
      }, {
        "y": 2023,
        "m": 11,
        "ret": 0.0454
      }, {
        "y": 2023,
        "m": 12,
        "ret": -0.0058
      }, {
        "y": 2024,
        "m": 1,
        "ret": 0.0182
      }, {
        "y": 2024,
        "m": 2,
        "ret": 0.006
      }, {
        "y": 2024,
        "m": 3,
        "ret": 0.0068
      }, {
        "y": 2024,
        "m": 4,
        "ret": 0.006500000000000001
      }, {
        "y": 2024,
        "m": 5,
        "ret": 0.0059
      }, {
        "y": 2024,
        "m": 6,
        "ret": 0.0068
      }, {
        "y": 2024,
        "m": 7,
        "ret": 0.0028
      }, {
        "y": 2024,
        "m": 8,
        "ret": 0.0015
      }, {
        "y": 2024,
        "m": 9,
        "ret": 0.0114
      }, {
        "y": 2024,
        "m": 10,
        "ret": 0.0068
      }, {
        "y": 2024,
        "m": 11,
        "ret": 0.0116
      }, {
        "y": 2024,
        "m": 12,
        "ret": -0.0136
      }, {
        "y": 2025,
        "m": 1,
        "ret": 0.0252
      }, {
        "y": 2025,
        "m": 2,
        "ret": -0.0032
      }, {
        "y": 2025,
        "m": 3,
        "ret": -0.0257
      }, {
        "y": 2025,
        "m": 4,
        "ret": -0.0262
      }, {
        "y": 2025,
        "m": 5,
        "ret": 0.0243
      }, {
        "y": 2025,
        "m": 6,
        "ret": 0.0139
      }, {
        "y": 2025,
        "m": 7,
        "ret": 0.0032
      }, {
        "y": 2025,
        "m": 8,
        "ret": 0.0116
      }, {
        "y": 2025,
        "m": 9,
        "ret": -0.0077
      }, {
        "y": 2025,
        "m": 10,
        "ret": -0.0028
      }, {
        "y": 2025,
        "m": 11,
        "ret": -0.0034
      }, {
        "y": 2025,
        "m": 12,
        "ret": -0.0033
      }, {
        "y": 2026,
        "m": 1,
        "ret": -0.0188
      }, {
        "y": 2026,
        "m": 2,
        "ret": 0.0021
      }, {
        "y": 2026,
        "m": 3,
        "ret": 0.0042
      }, {
        "y": 2026,
        "m": 4,
        "ret": 0.0241
      }, {
        "y": 2026,
        "m": 5,
        "ret": 0.0007000000000000001
      }],
      "line": [{
        "y": 2019,
        "m": 1,
        "v": 108.99
      }, {
        "y": 2019,
        "m": 2,
        "v": 109.79
      }, {
        "y": 2019,
        "m": 3,
        "v": 109.49
      }, {
        "y": 2019,
        "m": 4,
        "v": 110.66
      }, {
        "y": 2019,
        "m": 5,
        "v": 107.01
      }, {
        "y": 2019,
        "m": 6,
        "v": 112.71
      }, {
        "y": 2019,
        "m": 7,
        "v": 113.61
      }, {
        "y": 2019,
        "m": 8,
        "v": 113.05
      }, {
        "y": 2019,
        "m": 9,
        "v": 113.71
      }, {
        "y": 2019,
        "m": 10,
        "v": 114.74
      }, {
        "y": 2019,
        "m": 11,
        "v": 114.59
      }, {
        "y": 2019,
        "m": 12,
        "v": 114.76
      }, {
        "y": 2020,
        "m": 1,
        "v": 114.7
      }, {
        "y": 2020,
        "m": 2,
        "v": 118.64
      }, {
        "y": 2020,
        "m": 3,
        "v": 118.94
      }, {
        "y": 2020,
        "m": 4,
        "v": 123.06
      }, {
        "y": 2020,
        "m": 5,
        "v": 126.22
      }, {
        "y": 2020,
        "m": 6,
        "v": 128.23
      }, {
        "y": 2020,
        "m": 7,
        "v": 128.56
      }, {
        "y": 2020,
        "m": 8,
        "v": 127.35
      }, {
        "y": 2020,
        "m": 9,
        "v": 131.74
      }, {
        "y": 2020,
        "m": 10,
        "v": 131.02
      }, {
        "y": 2020,
        "m": 11,
        "v": 136.82
      }, {
        "y": 2020,
        "m": 12,
        "v": 136.92
      }, {
        "y": 2021,
        "m": 1,
        "v": 137.31
      }, {
        "y": 2021,
        "m": 2,
        "v": 137.34
      }, {
        "y": 2021,
        "m": 3,
        "v": 139.84
      }, {
        "y": 2021,
        "m": 4,
        "v": 140.03
      }, {
        "y": 2021,
        "m": 5,
        "v": 141.74
      }, {
        "y": 2021,
        "m": 6,
        "v": 143.03
      }, {
        "y": 2021,
        "m": 7,
        "v": 141.87
      }, {
        "y": 2021,
        "m": 8,
        "v": 142.27
      }, {
        "y": 2021,
        "m": 9,
        "v": 143.51
      }, {
        "y": 2021,
        "m": 10,
        "v": 144.48
      }, {
        "y": 2021,
        "m": 11,
        "v": 141.74
      }, {
        "y": 2021,
        "m": 12,
        "v": 143.15
      }, {
        "y": 2022,
        "m": 1,
        "v": 138.17
      }, {
        "y": 2022,
        "m": 2,
        "v": 138.3
      }, {
        "y": 2022,
        "m": 3,
        "v": 138.52
      }, {
        "y": 2022,
        "m": 4,
        "v": 129.36
      }, {
        "y": 2022,
        "m": 5,
        "v": 132.14
      }, {
        "y": 2022,
        "m": 6,
        "v": 119.77
      }, {
        "y": 2022,
        "m": 7,
        "v": 129.9
      }, {
        "y": 2022,
        "m": 8,
        "v": 127.25
      }, {
        "y": 2022,
        "m": 9,
        "v": 119.43
      }, {
        "y": 2022,
        "m": 10,
        "v": 129.12
      }, {
        "y": 2022,
        "m": 11,
        "v": 137.36
      }, {
        "y": 2022,
        "m": 12,
        "v": 130.64
      }, {
        "y": 2023,
        "m": 1,
        "v": 139.39
      }, {
        "y": 2023,
        "m": 2,
        "v": 140.2
      }, {
        "y": 2023,
        "m": 3,
        "v": 141.46
      }, {
        "y": 2023,
        "m": 4,
        "v": 143.44
      }, {
        "y": 2023,
        "m": 5,
        "v": 142.55
      }, {
        "y": 2023,
        "m": 6,
        "v": 145.12
      }, {
        "y": 2023,
        "m": 7,
        "v": 144.42
      }, {
        "y": 2023,
        "m": 8,
        "v": 146.34
      }, {
        "y": 2023,
        "m": 9,
        "v": 146.05
      }, {
        "y": 2023,
        "m": 10,
        "v": 142.71
      }, {
        "y": 2023,
        "m": 11,
        "v": 149.19
      }, {
        "y": 2023,
        "m": 12,
        "v": 148.32
      }, {
        "y": 2024,
        "m": 1,
        "v": 151.02
      }, {
        "y": 2024,
        "m": 2,
        "v": 151.93
      }, {
        "y": 2024,
        "m": 3,
        "v": 152.96
      }, {
        "y": 2024,
        "m": 4,
        "v": 153.95
      }, {
        "y": 2024,
        "m": 5,
        "v": 154.86
      }, {
        "y": 2024,
        "m": 6,
        "v": 155.91
      }, {
        "y": 2024,
        "m": 7,
        "v": 156.35
      }, {
        "y": 2024,
        "m": 8,
        "v": 156.59
      }, {
        "y": 2024,
        "m": 9,
        "v": 158.37
      }, {
        "y": 2024,
        "m": 10,
        "v": 159.45
      }, {
        "y": 2024,
        "m": 11,
        "v": 161.3
      }, {
        "y": 2024,
        "m": 12,
        "v": 159.1
      }, {
        "y": 2025,
        "m": 1,
        "v": 163.11
      }, {
        "y": 2025,
        "m": 2,
        "v": 162.59
      }, {
        "y": 2025,
        "m": 3,
        "v": 158.41
      }, {
        "y": 2025,
        "m": 4,
        "v": 154.26
      }, {
        "y": 2025,
        "m": 5,
        "v": 158.01
      }, {
        "y": 2025,
        "m": 6,
        "v": 160.21
      }, {
        "y": 2025,
        "m": 7,
        "v": 160.72
      }, {
        "y": 2025,
        "m": 8,
        "v": 162.58
      }, {
        "y": 2025,
        "m": 9,
        "v": 161.33
      }, {
        "y": 2025,
        "m": 10,
        "v": 160.88
      }, {
        "y": 2025,
        "m": 11,
        "v": 160.33
      }, {
        "y": 2025,
        "m": 12,
        "v": 159.8
      }, {
        "y": 2026,
        "m": 1,
        "v": 156.8
      }, {
        "y": 2026,
        "m": 2,
        "v": 157.13
      }, {
        "y": 2026,
        "m": 3,
        "v": 157.79
      }, {
        "y": 2026,
        "m": 4,
        "v": 161.59
      }, {
        "y": 2026,
        "m": 5,
        "v": 161.71
      }],
      "annual": [{
        "year": 2019,
        "ret": 0.1475925502137372,
        "months": 12
      }, {
        "year": 2020,
        "ret": 0.1931492966885637,
        "months": 12
      }, {
        "year": 2021,
        "ret": 0.04549080797303429,
        "months": 12
      }, {
        "year": 2022,
        "ret": -0.0874180401782857,
        "months": 12
      }, {
        "year": 2023,
        "ret": 0.1353405814440816,
        "months": 12
      }, {
        "year": 2024,
        "ret": 0.07270274976966418,
        "months": 12
      }, {
        "year": 2025,
        "ret": 0.004403787681767968,
        "months": 12
      }, {
        "year": 2026,
        "ret": 0.01189414876867634,
        "months": 5
      }]
    },
    "R_USD": {
      "label": "R USD",
      "code": "R_USD",
      "isin": "LU1532291983",
      "ccy": "USD",
      "nav": 142.79,
      "mtd": 0.0019,
      "ytd": 0.018,
      "oneY": 0.0417,
      "threeY": 0.1796,
      "annReturn3y": 0.0566,
      "stdDev3y": 0.0504,
      "sharpe3y": 0.19,
      "sortino3y": 0.28,
      "aum": 4981786.11,
      "fundSizeDisplay": "USD 62.1M",
      "mgmtFee": 0.015,
      "frontLoad": 0.03,
      "monthly": [{
        "y": 2020,
        "m": 1,
        "ret": 0.0011
      }, {
        "y": 2020,
        "m": 2,
        "ret": 0.036
      }, {
        "y": 2020,
        "m": 3,
        "ret": 0.0059
      }, {
        "y": 2020,
        "m": 4,
        "ret": 0.0302
      }, {
        "y": 2020,
        "m": 5,
        "ret": 0.0214
      }, {
        "y": 2020,
        "m": 6,
        "ret": 0.0119
      }, {
        "y": 2020,
        "m": 7,
        "ret": 0.001
      }, {
        "y": 2020,
        "m": 8,
        "ret": -0.0087
      }, {
        "y": 2020,
        "m": 9,
        "ret": 0.0319
      }, {
        "y": 2020,
        "m": 10,
        "ret": -0.0069
      }, {
        "y": 2020,
        "m": 11,
        "ret": 0.0406
      }, {
        "y": 2020,
        "m": 12,
        "ret": 0.0013
      }, {
        "y": 2021,
        "m": 1,
        "ret": 0.0031
      }, {
        "y": 2021,
        "m": 2,
        "ret": 0.0004
      }, {
        "y": 2021,
        "m": 3,
        "ret": 0.0181
      }, {
        "y": 2021,
        "m": 4,
        "ret": 0.0016
      }, {
        "y": 2021,
        "m": 5,
        "ret": 0.0123
      }, {
        "y": 2021,
        "m": 6,
        "ret": 0.009000000000000001
      }, {
        "y": 2021,
        "m": 7,
        "ret": -0.007800000000000001
      }, {
        "y": 2021,
        "m": 8,
        "ret": 0.003
      }, {
        "y": 2021,
        "m": 9,
        "ret": 0.0088
      }, {
        "y": 2021,
        "m": 10,
        "ret": 0.0069
      }, {
        "y": 2021,
        "m": 11,
        "ret": -0.0195
      }, {
        "y": 2021,
        "m": 12,
        "ret": 0.0112
      }, {
        "y": 2022,
        "m": 1,
        "ret": -0.034
      }, {
        "y": 2022,
        "m": 2,
        "ret": 0.0011
      }, {
        "y": 2022,
        "m": 3,
        "ret": 0.0039
      }, {
        "y": 2022,
        "m": 4,
        "ret": -0.06509999999999999
      }, {
        "y": 2022,
        "m": 5,
        "ret": 0.0231
      }, {
        "y": 2022,
        "m": 6,
        "ret": -0.09029999999999999
      }, {
        "y": 2022,
        "m": 7,
        "ret": 0.0862
      }, {
        "y": 2022,
        "m": 8,
        "ret": -0.0186
      }, {
        "y": 2022,
        "m": 9,
        "ret": -0.0579
      }, {
        "y": 2022,
        "m": 10,
        "ret": 0.0843
      }, {
        "y": 2022,
        "m": 11,
        "ret": 0.0674
      }, {
        "y": 2022,
        "m": 12,
        "ret": -0.04559999999999999
      }, {
        "y": 2023,
        "m": 1,
        "ret": 0.0693
      }, {
        "y": 2023,
        "m": 2,
        "ret": 0.006999999999999999
      }, {
        "y": 2023,
        "m": 3,
        "ret": 0.0095
      }, {
        "y": 2023,
        "m": 4,
        "ret": 0.012
      }, {
        "y": 2023,
        "m": 5,
        "ret": -0.0058
      }, {
        "y": 2023,
        "m": 6,
        "ret": 0.0173
      }, {
        "y": 2023,
        "m": 7,
        "ret": -0.0038
      }, {
        "y": 2023,
        "m": 8,
        "ret": 0.014
      }, {
        "y": 2023,
        "m": 9,
        "ret": -0.0009
      }, {
        "y": 2023,
        "m": 10,
        "ret": -0.0216
      }, {
        "y": 2023,
        "m": 11,
        "ret": 0.0461
      }, {
        "y": 2023,
        "m": 12,
        "ret": -0.0053
      }, {
        "y": 2024,
        "m": 1,
        "ret": 0.0187
      }, {
        "y": 2024,
        "m": 2,
        "ret": 0.0067
      }, {
        "y": 2024,
        "m": 3,
        "ret": 0.0076
      }, {
        "y": 2024,
        "m": 4,
        "ret": 0.0072
      }, {
        "y": 2024,
        "m": 5,
        "ret": 0.0068
      }, {
        "y": 2024,
        "m": 6,
        "ret": 0.0075
      }, {
        "y": 2024,
        "m": 7,
        "ret": 0.0037
      }, {
        "y": 2024,
        "m": 8,
        "ret": 0.0024
      }, {
        "y": 2024,
        "m": 9,
        "ret": 0.0121
      }, {
        "y": 2024,
        "m": 10,
        "ret": 0.007800000000000001
      }, {
        "y": 2024,
        "m": 11,
        "ret": 0.012
      }, {
        "y": 2024,
        "m": 12,
        "ret": -0.0112
      }, {
        "y": 2025,
        "m": 1,
        "ret": 0.0257
      }, {
        "y": 2025,
        "m": 2,
        "ret": -0.0022
      }, {
        "y": 2025,
        "m": 3,
        "ret": -0.0244
      }, {
        "y": 2025,
        "m": 4,
        "ret": -0.024
      }, {
        "y": 2025,
        "m": 5,
        "ret": 0.0254
      }, {
        "y": 2025,
        "m": 6,
        "ret": 0.0153
      }, {
        "y": 2025,
        "m": 7,
        "ret": 0.0052
      }, {
        "y": 2025,
        "m": 8,
        "ret": 0.0136
      }, {
        "y": 2025,
        "m": 9,
        "ret": -0.0061
      }, {
        "y": 2025,
        "m": 10,
        "ret": -0.001
      }, {
        "y": 2025,
        "m": 11,
        "ret": -0.0021
      }, {
        "y": 2025,
        "m": 12,
        "ret": -0.0016
      }, {
        "y": 2026,
        "m": 1,
        "ret": -0.0176
      }, {
        "y": 2026,
        "m": 2,
        "ret": 0.0028
      }, {
        "y": 2026,
        "m": 3,
        "ret": 0.0059
      }, {
        "y": 2026,
        "m": 4,
        "ret": 0.0254
      }, {
        "y": 2026,
        "m": 5,
        "ret": 0.0019
      }],
      "line": [{
        "y": 2020,
        "m": 1,
        "v": 100.11
      }, {
        "y": 2020,
        "m": 2,
        "v": 103.71
      }, {
        "y": 2020,
        "m": 3,
        "v": 104.33
      }, {
        "y": 2020,
        "m": 4,
        "v": 107.48
      }, {
        "y": 2020,
        "m": 5,
        "v": 109.78
      }, {
        "y": 2020,
        "m": 6,
        "v": 111.08
      }, {
        "y": 2020,
        "m": 7,
        "v": 111.19
      }, {
        "y": 2020,
        "m": 8,
        "v": 110.23
      }, {
        "y": 2020,
        "m": 9,
        "v": 113.74
      }, {
        "y": 2020,
        "m": 10,
        "v": 112.96
      }, {
        "y": 2020,
        "m": 11,
        "v": 117.54
      }, {
        "y": 2020,
        "m": 12,
        "v": 117.7
      }, {
        "y": 2021,
        "m": 1,
        "v": 118.06
      }, {
        "y": 2021,
        "m": 2,
        "v": 118.11
      }, {
        "y": 2021,
        "m": 3,
        "v": 120.25
      }, {
        "y": 2021,
        "m": 4,
        "v": 120.44
      }, {
        "y": 2021,
        "m": 5,
        "v": 121.92
      }, {
        "y": 2021,
        "m": 6,
        "v": 123.02
      }, {
        "y": 2021,
        "m": 7,
        "v": 122.06
      }, {
        "y": 2021,
        "m": 8,
        "v": 122.42
      }, {
        "y": 2021,
        "m": 9,
        "v": 123.5
      }, {
        "y": 2021,
        "m": 10,
        "v": 124.35
      }, {
        "y": 2021,
        "m": 11,
        "v": 121.93
      }, {
        "y": 2021,
        "m": 12,
        "v": 123.29
      }, {
        "y": 2022,
        "m": 1,
        "v": 119.1
      }, {
        "y": 2022,
        "m": 2,
        "v": 119.23
      }, {
        "y": 2022,
        "m": 3,
        "v": 119.7
      }, {
        "y": 2022,
        "m": 4,
        "v": 111.91
      }, {
        "y": 2022,
        "m": 5,
        "v": 114.49
      }, {
        "y": 2022,
        "m": 6,
        "v": 104.15
      }, {
        "y": 2022,
        "m": 7,
        "v": 113.13
      }, {
        "y": 2022,
        "m": 8,
        "v": 111.03
      }, {
        "y": 2022,
        "m": 9,
        "v": 104.6
      }, {
        "y": 2022,
        "m": 10,
        "v": 113.42
      }, {
        "y": 2022,
        "m": 11,
        "v": 121.06
      }, {
        "y": 2022,
        "m": 12,
        "v": 115.54
      }, {
        "y": 2023,
        "m": 1,
        "v": 123.55
      }, {
        "y": 2023,
        "m": 2,
        "v": 124.41
      }, {
        "y": 2023,
        "m": 3,
        "v": 125.59
      }, {
        "y": 2023,
        "m": 4,
        "v": 127.1
      }, {
        "y": 2023,
        "m": 5,
        "v": 126.36
      }, {
        "y": 2023,
        "m": 6,
        "v": 128.55
      }, {
        "y": 2023,
        "m": 7,
        "v": 128.06
      }, {
        "y": 2023,
        "m": 8,
        "v": 129.85
      }, {
        "y": 2023,
        "m": 9,
        "v": 129.74
      }, {
        "y": 2023,
        "m": 10,
        "v": 126.93
      }, {
        "y": 2023,
        "m": 11,
        "v": 132.79
      }, {
        "y": 2023,
        "m": 12,
        "v": 132.08
      }, {
        "y": 2024,
        "m": 1,
        "v": 134.55
      }, {
        "y": 2024,
        "m": 2,
        "v": 135.45
      }, {
        "y": 2024,
        "m": 3,
        "v": 136.48
      }, {
        "y": 2024,
        "m": 4,
        "v": 137.47
      }, {
        "y": 2024,
        "m": 5,
        "v": 138.4
      }, {
        "y": 2024,
        "m": 6,
        "v": 139.44
      }, {
        "y": 2024,
        "m": 7,
        "v": 139.95
      }, {
        "y": 2024,
        "m": 8,
        "v": 140.29
      }, {
        "y": 2024,
        "m": 9,
        "v": 141.99
      }, {
        "y": 2024,
        "m": 10,
        "v": 143.1
      }, {
        "y": 2024,
        "m": 11,
        "v": 144.81
      }, {
        "y": 2024,
        "m": 12,
        "v": 143.19
      }, {
        "y": 2025,
        "m": 1,
        "v": 146.87
      }, {
        "y": 2025,
        "m": 2,
        "v": 146.55
      }, {
        "y": 2025,
        "m": 3,
        "v": 142.97
      }, {
        "y": 2025,
        "m": 4,
        "v": 139.54
      }, {
        "y": 2025,
        "m": 5,
        "v": 143.08
      }, {
        "y": 2025,
        "m": 6,
        "v": 145.27
      }, {
        "y": 2025,
        "m": 7,
        "v": 146.03
      }, {
        "y": 2025,
        "m": 8,
        "v": 148.02
      }, {
        "y": 2025,
        "m": 9,
        "v": 147.11
      }, {
        "y": 2025,
        "m": 10,
        "v": 146.97
      }, {
        "y": 2025,
        "m": 11,
        "v": 146.66
      }, {
        "y": 2025,
        "m": 12,
        "v": 146.42
      }, {
        "y": 2026,
        "m": 1,
        "v": 143.85
      }, {
        "y": 2026,
        "m": 2,
        "v": 144.25
      }, {
        "y": 2026,
        "m": 3,
        "v": 145.1
      }, {
        "y": 2026,
        "m": 4,
        "v": 148.78
      }, {
        "y": 2026,
        "m": 5,
        "v": 149.07
      }],
      "annual": [{
        "year": 2020,
        "ret": 0.1769684890211618,
        "months": 12
      }, {
        "year": 2021,
        "ret": 0.04756094547012601,
        "months": 12
      }, {
        "year": 2022,
        "ret": -0.0628989511172624,
        "months": 12
      }, {
        "year": 2023,
        "ret": 0.1431780891048078,
        "months": 12
      }, {
        "year": 2024,
        "ret": 0.08410224468020133,
        "months": 12
      }, {
        "year": 2025,
        "ret": 0.02256757949923616,
        "months": 12
      }, {
        "year": 2026,
        "ret": 0.0180642260101227,
        "months": 5
      }]
    },
    "I_USD": {
      "label": "I USD",
      "code": "I_USD",
      "isin": "LU1532291801",
      "ccy": "USD",
      "nav": 123.92,
      "mtd": 0.0024,
      "ytd": 0.0197,
      "oneY": 0.0468,
      "threeY": 0.198,
      "annReturn3y": null,
      "stdDev3y": null,
      "sharpe3y": null,
      "sortino3y": null,
      "aum": 7566218.31,
      "fundSizeDisplay": "USD 62.1M",
      "mgmtFee": 0.009,
      "frontLoad": null,
      "monthly": [{
        "y": 2024,
        "m": 1,
        "ret": 0.0191
      }, {
        "y": 2024,
        "m": 2,
        "ret": 0.0072
      }, {
        "y": 2024,
        "m": 3,
        "ret": 0.008100000000000001
      }, {
        "y": 2024,
        "m": 4,
        "ret": 0.0075
      }, {
        "y": 2024,
        "m": 5,
        "ret": 0.0073
      }, {
        "y": 2024,
        "m": 6,
        "ret": 0.007800000000000001
      }, {
        "y": 2024,
        "m": 7,
        "ret": 0.0042
      }, {
        "y": 2024,
        "m": 8,
        "ret": 0.0029
      }, {
        "y": 2024,
        "m": 9,
        "ret": 0.0125
      }, {
        "y": 2024,
        "m": 10,
        "ret": 0.0083
      }, {
        "y": 2024,
        "m": 11,
        "ret": 0.0124
      }, {
        "y": 2024,
        "m": 12,
        "ret": -0.0106
      }, {
        "y": 2025,
        "m": 1,
        "ret": 0.026
      }, {
        "y": 2025,
        "m": 2,
        "ret": -0.0017
      }, {
        "y": 2025,
        "m": 3,
        "ret": -0.0239
      }, {
        "y": 2025,
        "m": 4,
        "ret": -0.0235
      }, {
        "y": 2025,
        "m": 5,
        "ret": 0.026
      }, {
        "y": 2025,
        "m": 6,
        "ret": 0.0159
      }, {
        "y": 2025,
        "m": 7,
        "ret": 0.005699999999999999
      }, {
        "y": 2025,
        "m": 8,
        "ret": 0.0141
      }, {
        "y": 2025,
        "m": 9,
        "ret": -0.005500000000000001
      }, {
        "y": 2025,
        "m": 10,
        "ret": -0.0006
      }, {
        "y": 2025,
        "m": 11,
        "ret": -0.0021
      }, {
        "y": 2025,
        "m": 12,
        "ret": -0.0011
      }, {
        "y": 2026,
        "m": 1,
        "ret": -0.0171
      }, {
        "y": 2026,
        "m": 2,
        "ret": 0.0033
      }, {
        "y": 2026,
        "m": 3,
        "ret": 0.006500000000000001
      }, {
        "y": 2026,
        "m": 4,
        "ret": 0.0249
      }, {
        "y": 2026,
        "m": 5,
        "ret": 0.0024
      }],
      "line": [{
        "y": 2024,
        "m": 1,
        "v": 101.91
      }, {
        "y": 2024,
        "m": 2,
        "v": 102.64
      }, {
        "y": 2024,
        "m": 3,
        "v": 103.48
      }, {
        "y": 2024,
        "m": 4,
        "v": 104.25
      }, {
        "y": 2024,
        "m": 5,
        "v": 105.01
      }, {
        "y": 2024,
        "m": 6,
        "v": 105.83
      }, {
        "y": 2024,
        "m": 7,
        "v": 106.28
      }, {
        "y": 2024,
        "m": 8,
        "v": 106.58
      }, {
        "y": 2024,
        "m": 9,
        "v": 107.92
      }, {
        "y": 2024,
        "m": 10,
        "v": 108.81
      }, {
        "y": 2024,
        "m": 11,
        "v": 110.16
      }, {
        "y": 2024,
        "m": 12,
        "v": 108.99
      }, {
        "y": 2025,
        "m": 1,
        "v": 111.83
      }, {
        "y": 2025,
        "m": 2,
        "v": 111.64
      }, {
        "y": 2025,
        "m": 3,
        "v": 108.97
      }, {
        "y": 2025,
        "m": 4,
        "v": 106.41
      }, {
        "y": 2025,
        "m": 5,
        "v": 109.18
      }, {
        "y": 2025,
        "m": 6,
        "v": 110.91
      }, {
        "y": 2025,
        "m": 7,
        "v": 111.54
      }, {
        "y": 2025,
        "m": 8,
        "v": 113.12
      }, {
        "y": 2025,
        "m": 9,
        "v": 112.49
      }, {
        "y": 2025,
        "m": 10,
        "v": 112.43
      }, {
        "y": 2025,
        "m": 11,
        "v": 112.19
      }, {
        "y": 2025,
        "m": 12,
        "v": 112.07
      }, {
        "y": 2026,
        "m": 1,
        "v": 110.15
      }, {
        "y": 2026,
        "m": 2,
        "v": 110.51
      }, {
        "y": 2026,
        "m": 3,
        "v": 111.23
      }, {
        "y": 2026,
        "m": 4,
        "v": 114
      }, {
        "y": 2026,
        "m": 5,
        "v": 114.28
      }],
      "annual": [{
        "year": 2024,
        "ret": 0.0899361727257928,
        "months": 12
      }, {
        "year": 2025,
        "ret": 0.02819553728745561,
        "months": 12
      }, {
        "year": 2026,
        "ret": 0.01970952883984789,
        "months": 5
      }]
    }
  },
  "shareClassSummary": [{
    "label": "R EUR",
    "code": "R_EUR",
    "isin": "LU1216084993",
    "ccy": "EUR",
    "nav": 1243.73,
    "mtd": 0.0007,
    "ytd": 0.0119,
    "oneY": 0.0234,
    "threeY": 0.1347,
    "generated": true
  }, {
    "label": "I EUR",
    "code": "I_EUR",
    "isin": "LU1216084308",
    "ccy": "EUR",
    "nav": 1452.75,
    "mtd": 0.0012,
    "ytd": 0.0145,
    "oneY": 0.03,
    "threeY": 0.1521,
    "generated": false
  }, {
    "label": "R USD",
    "code": "R_USD",
    "isin": "LU1532291983",
    "ccy": "USD",
    "nav": 142.79,
    "mtd": 0.0019,
    "ytd": 0.018,
    "oneY": 0.0417,
    "threeY": 0.1796,
    "generated": true
  }, {
    "label": "I USD",
    "code": "I_USD",
    "isin": "LU1532291801",
    "ccy": "USD",
    "nav": 123.92,
    "mtd": 0.0024,
    "ytd": 0.0197,
    "oneY": 0.0468,
    "threeY": 0.198,
    "generated": true
  }, {
    "label": "I CHF",
    "code": "I_CHF",
    "isin": "LU2510449965",
    "ccy": "CHF",
    "nav": 109.98,
    "mtd": -0.0009,
    "ytd": 0.0036,
    "oneY": 0.0039,
    "threeY": 0.0756,
    "generated": false
  }],
  "sectors": [{
    "name": "Consumer Discretionary",
    "weight": 0.3350966572855535
  }, {
    "name": "Information Technology",
    "weight": 0.2209836415034521
  }, {
    "name": "Communication Services",
    "weight": 0.1352384780124082
  }, {
    "name": "Financials",
    "weight": 0.09656445441629373
  }, {
    "name": "Industrials",
    "weight": 0.07452033788301358
  }, {
    "name": "Health Care",
    "weight": 0.0616322634429811
  }, {
    "name": "Consumer Staples",
    "weight": 0.06078695788315466
  }, {
    "name": "Real Estate",
    "weight": 0.01517720957314299
  }],
  "geography": [{
    "name": "United States",
    "weight": 0.8739374897569164
  }, {
    "name": "Cayman Islands",
    "weight": 0.06946777969903119
  }, {
    "name": "Liberia",
    "weight": 0.0308563512102069
  }, {
    "name": "Canada",
    "weight": 0.02573837933384549
  }],
  "currency": [{
    "name": "USD",
    "weight": 1
  }],
  "holdings": [{
    "rank": 1,
    "ticker": "LRCX",
    "name": "LAM RESEARCH",
    "sector": "Information Technology",
    "country": "United States",
    "weight": 0.03565361224288081
  }, {
    "rank": 2,
    "ticker": "GOOGL",
    "name": "ALPHABET 'A'",
    "sector": "Communication Services",
    "country": "United States",
    "weight": 0.03348631143126476
  }, {
    "rank": 3,
    "ticker": "DAL",
    "name": "DELTA AIR LINES",
    "sector": "Industrials",
    "country": "United States",
    "weight": 0.03063156995534286
  }, {
    "rank": 4,
    "ticker": "BABA",
    "name": "ALIBABA GROUP HOLDING -ADR SPONS.-",
    "sector": "Consumer Discretionary",
    "country": "Cayman Islands",
    "weight": 0.02962855097859374
  }, {
    "rank": 5,
    "ticker": "AMAT",
    "name": "APPLIED MATERIALS",
    "sector": "Information Technology",
    "country": "United States",
    "weight": 0.02881794618841328
  }, {
    "rank": 6,
    "ticker": "W",
    "name": "WAYFAIR 'A'",
    "sector": "Consumer Discretionary",
    "country": "United States",
    "weight": 0.02660470277143307
  }, {
    "rank": 7,
    "ticker": "TGT",
    "name": "TARGET",
    "sector": "Consumer Staples",
    "country": "United States",
    "weight": 0.02624009231284099
  }, {
    "rank": 8,
    "ticker": "ADBE",
    "name": "ADOBE",
    "sector": "Information Technology",
    "country": "United States",
    "weight": 0.02489634662119781
  }, {
    "rank": 9,
    "ticker": "DIS",
    "name": "WALT DISNEY",
    "sector": "Communication Services",
    "country": "United States",
    "weight": 0.02445116862029623
  }, {
    "rank": 10,
    "ticker": "FDX",
    "name": "FEDEX",
    "sector": "Industrials",
    "country": "United States",
    "weight": 0.02438753760469574
  }],
  "assetType": [{
    "type": "Stock",
    "weight": 0.7383099583688256
  }, {
    "type": "Deposit",
    "weight": 0.2752521341235541
  }, {
    "type": "ETD Options",
    "weight": -0.008035877087345074
  }, {
    "type": "FX Forward",
    "weight": -0.003407164033485457
  }, {
    "type": "Payables",
    "weight": -0.002771251768639043
  }, {
    "type": "Receivables",
    "weight": 0.0006143818698879866
  }, {
    "type": "OTC Options",
    "weight": 0.00003781852720197244
  }, {
    "type": "Futures",
    "weight": 0
  }],
  "equitySleeve": {
    "weight": 0.7383,
    "holdings": 37,
    "stockValue": 39523376.62
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "exports/lfg-handoff/02-factsheet-editor/zest-napr-template/napr-data.js", error: String((e && e.message) || e) }); }

// exports/lfg-handoff/03-one-pager/ds-base.js
try { (() => {
// Loads this design system into the template. In a consuming project, point
// base at the bound DS folder relative to this file (e.g. '_ds/<folder>' at
// the project root, '../_ds/<folder>' one level down) — one line to edit.
(() => {
  const base = '../..';
  for (const p of ["styles.css"]) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = base + '/' + p;
    document.head.appendChild(l);
  }
  const s = document.createElement('script');
  s.src = base + '/_ds_bundle.js';
  s.onerror = () => console.error('ds-base.js: failed to load ' + s.src + ' — if this is a consuming project, point the base line in ds-base.js at the bound _ds/<folder> tree relative to this page (e.g. _ds/<folder> at the project root, ../_ds/<folder> one level down); in a fresh design system this can just mean the bundle is not compiled yet');
  document.head.appendChild(s);
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "exports/lfg-handoff/03-one-pager/ds-base.js", error: String((e && e.message) || e) }); }

// list-template/data.js
try { (() => {
/* LFA List Template — asset-class configuration + sample data.
   GENERIC BY DESIGN: the same table engine renders equity, bond and funds.
   Switching asset class is a matter of column config, not a redesign.
   Column `type` tells the renderer how to format & style each cell:
     identity | text | currency | percent | change | number | rating | risk | stars | date
*/

// Values mirror themes/lfa.json so a list and a chart read as one brand.
window.LFA_THEME = {
  ink: "#23366E",
  background: "#FFFFFF",
  grid: "#E0E4EB",
  axis: "#8C95B2",
  positive: "#3E7C72",
  negative: "#C24A5E",
  categorical: ["#23366E", "#C24A5E", "#3E7C72", "#B0852F", "#6B5B95", "#5A6678", "#9C2D3A", "#3C6E8F"],
  display: "'Cormorant Garamond', Georgia, serif",
  body: "'Mulish', sans-serif"
};
window.ASSET_CLASSES = {
  /* ============================ EQUITY ============================ */
  equity: {
    key: "equity",
    label: "Equity",
    title: "Equity Selection",
    noun: "equities",
    subtitle: "Our selection of equities with strategic positioning and a medium-term view.",
    source: "Source: FactSet, company filings · LFA Investment Office",
    subsection: {
      by: "region",
      map: {
        "United States": "US",
        "Europe": "EU",
        "United Kingdom": "EU",
        "Switzerland": "CH"
      },
      preferred: ["NOVO", "TSM", "ADBE"],
      order: ["US", "EU", "CH", "Preferred"],
      labels: {
        US: "United States",
        EU: "Europe",
        CH: "Switzerland",
        Preferred: "Preferred · Watchlist"
      }
    },
    idCol: {
      type: "identity",
      key: "name",
      label: "Security",
      primary: "name",
      code: "ticker",
      badges: "badges",
      group: "Profile",
      sortable: true
    },
    columns: [{
      key: "sector",
      label: "Sector",
      type: "stacked",
      subKey: "region",
      align: "left",
      group: "Profile"
    }, {
      key: "marketCap",
      label: "Mkt Cap",
      type: "currency",
      align: "right",
      unit: "B",
      group: "Performance",
      sortable: true
    }, {
      key: "changeYTD",
      label: "YTD",
      type: "change",
      align: "right",
      group: "Performance",
      sortable: true
    }, {
      key: "longTermCAGR",
      label: "CAGR EPS",
      type: "percent",
      align: "right",
      group: "Growth",
      sortable: true
    }, {
      key: "estFYGrowth",
      label: "Est. FY",
      type: "percent",
      align: "right",
      group: "Growth",
      sortable: true
    }, {
      key: "roe",
      label: "ROE",
      type: "percent",
      align: "right",
      group: "Profitability",
      sortable: true
    }, {
      key: "profitMargin",
      label: "Margin",
      type: "percent",
      align: "right",
      group: "Profitability"
    }, {
      key: "forwardPE",
      label: "Fwd P/E",
      type: "number",
      align: "right",
      suffix: "x",
      group: "Valuation",
      sortable: true
    }, {
      key: "dividendYield",
      label: "Div Yield",
      type: "percent",
      align: "right",
      group: "Valuation",
      sortable: true
    }],
    rows: [{
      name: "Nestlé SA",
      ticker: "NESN",
      sector: "Consumer Staples",
      region: "Switzerland",
      marketCap: 248.5,
      changeYTD: 6.4,
      longTermCAGR: 5.1,
      estFYGrowth: 4.0,
      roe: 24.8,
      profitMargin: 14.2,
      forwardPE: 18.6,
      dividendYield: 3.4,
      badges: ["Top Performer"]
    }, {
      name: "Novartis AG",
      ticker: "NOVN",
      sector: "Health Care",
      region: "Switzerland",
      marketCap: 211.0,
      changeYTD: 11.2,
      longTermCAGR: 6.8,
      estFYGrowth: 6.5,
      roe: 21.3,
      profitMargin: 23.5,
      forwardPE: 14.1,
      dividendYield: 3.6,
      badges: ["High Dividend"]
    }, {
      name: "ASML Holding",
      ticker: "ASML",
      sector: "Technology",
      region: "Europe",
      marketCap: 312.7,
      changeYTD: 24.9,
      longTermCAGR: 21.4,
      estFYGrowth: 19.5,
      roe: 49.0,
      profitMargin: 28.1,
      forwardPE: 31.2,
      dividendYield: 0.9,
      badges: ["Top Performer"]
    }, {
      name: "Microsoft Corp",
      ticker: "MSFT",
      sector: "Technology",
      region: "United States",
      marketCap: 3120.0,
      changeYTD: 18.3,
      longTermCAGR: 16.2,
      estFYGrowth: 14.8,
      roe: 39.1,
      profitMargin: 36.7,
      forwardPE: 32.8,
      dividendYield: 0.7,
      badges: ["Top Performer"]
    }, {
      name: "JPMorgan Chase",
      ticker: "JPM",
      sector: "Financials",
      region: "United States",
      marketCap: 612.4,
      changeYTD: 9.0,
      longTermCAGR: 8.4,
      estFYGrowth: 7.0,
      roe: 16.9,
      profitMargin: 31.0,
      forwardPE: 12.4,
      dividendYield: 2.3,
      badges: ["Value Pick"]
    }, {
      name: "LVMH",
      ticker: "MC",
      sector: "Consumer Discr.",
      region: "Europe",
      marketCap: 358.2,
      changeYTD: -4.1,
      longTermCAGR: 12.0,
      estFYGrowth: 9.5,
      roe: 27.5,
      profitMargin: 17.8,
      forwardPE: 22.1,
      dividendYield: 2.0,
      badges: []
    }, {
      name: "Roche Holding",
      ticker: "ROG",
      sector: "Health Care",
      region: "Switzerland",
      marketCap: 198.6,
      changeYTD: 2.7,
      longTermCAGR: 4.5,
      estFYGrowth: 4.2,
      roe: 38.2,
      profitMargin: 21.9,
      forwardPE: 13.0,
      dividendYield: 3.9,
      badges: ["High Dividend"]
    }, {
      name: "NVIDIA Corp",
      ticker: "NVDA",
      sector: "Technology",
      region: "United States",
      marketCap: 2980.0,
      changeYTD: 41.8,
      longTermCAGR: 34.0,
      estFYGrowth: 28.0,
      roe: 91.5,
      profitMargin: 48.9,
      forwardPE: 38.4,
      dividendYield: 0.1,
      badges: ["Top Performer"]
    }, {
      name: "Unilever PLC",
      ticker: "ULVR",
      sector: "Consumer Staples",
      region: "United Kingdom",
      marketCap: 132.9,
      changeYTD: 5.5,
      longTermCAGR: 3.9,
      estFYGrowth: 4.5,
      roe: 31.0,
      profitMargin: 12.1,
      forwardPE: 17.2,
      dividendYield: 3.5,
      badges: ["Value Pick"]
    }, {
      name: "TotalEnergies",
      ticker: "TTE",
      sector: "Energy",
      region: "Europe",
      marketCap: 148.3,
      changeYTD: -2.8,
      longTermCAGR: 7.1,
      estFYGrowth: 2.0,
      roe: 18.4,
      profitMargin: 9.6,
      forwardPE: 7.9,
      dividendYield: 5.2,
      badges: ["High Dividend"]
    }, {
      name: "Apple Inc",
      ticker: "AAPL",
      sector: "Technology",
      region: "United States",
      marketCap: 3340.0,
      changeYTD: 14.2,
      longTermCAGR: 11.5,
      estFYGrowth: 9.8,
      roe: 147.0,
      profitMargin: 25.3,
      forwardPE: 29.6,
      dividendYield: 0.5,
      badges: ["Top Performer"]
    }, {
      name: "Alphabet Inc",
      ticker: "GOOGL",
      sector: "Communication",
      region: "United States",
      marketCap: 2210.0,
      changeYTD: 16.9,
      longTermCAGR: 17.8,
      estFYGrowth: 13.2,
      roe: 30.1,
      profitMargin: 27.7,
      forwardPE: 21.4,
      dividendYield: 0.5,
      badges: []
    }, {
      name: "Visa Inc",
      ticker: "V",
      sector: "Financials",
      region: "United States",
      marketCap: 565.0,
      changeYTD: 7.8,
      longTermCAGR: 13.0,
      estFYGrowth: 11.0,
      roe: 49.5,
      profitMargin: 53.0,
      forwardPE: 26.0,
      dividendYield: 0.8,
      badges: ["Value Pick"]
    }, {
      name: "SAP SE",
      ticker: "SAP",
      sector: "Technology",
      region: "Europe",
      marketCap: 245.0,
      changeYTD: 19.4,
      longTermCAGR: 12.5,
      estFYGrowth: 14.0,
      roe: 17.2,
      profitMargin: 19.4,
      forwardPE: 33.0,
      dividendYield: 1.0,
      badges: []
    }, {
      name: "Siemens AG",
      ticker: "SIE",
      sector: "Industrials",
      region: "Europe",
      marketCap: 162.0,
      changeYTD: 8.1,
      longTermCAGR: 9.0,
      estFYGrowth: 7.5,
      roe: 16.0,
      profitMargin: 11.5,
      forwardPE: 16.8,
      dividendYield: 2.6,
      badges: ["High Dividend"]
    }, {
      name: "L'Oréal SA",
      ticker: "OR",
      sector: "Consumer Staples",
      region: "Europe",
      marketCap: 235.0,
      changeYTD: -1.5,
      longTermCAGR: 10.2,
      estFYGrowth: 8.0,
      roe: 28.8,
      profitMargin: 19.0,
      forwardPE: 30.5,
      dividendYield: 1.6,
      badges: []
    }, {
      name: "UBS Group AG",
      ticker: "UBSG",
      sector: "Financials",
      region: "Switzerland",
      marketCap: 98.0,
      changeYTD: 12.7,
      longTermCAGR: 9.5,
      estFYGrowth: 8.5,
      roe: 8.4,
      profitMargin: 18.2,
      forwardPE: 11.0,
      dividendYield: 2.1,
      badges: ["Value Pick"]
    }, {
      name: "Zurich Insurance",
      ticker: "ZURN",
      sector: "Financials",
      region: "Switzerland",
      marketCap: 78.0,
      changeYTD: 6.0,
      longTermCAGR: 7.0,
      estFYGrowth: 6.0,
      roe: 22.5,
      profitMargin: 9.0,
      forwardPE: 13.5,
      dividendYield: 5.0,
      badges: ["High Dividend"]
    }, {
      name: "Novo Nordisk",
      ticker: "NOVO",
      sector: "Health Care",
      region: "Europe",
      marketCap: 392.0,
      changeYTD: 22.4,
      longTermCAGR: 25.0,
      estFYGrowth: 21.0,
      roe: 84.0,
      profitMargin: 35.0,
      forwardPE: 28.0,
      dividendYield: 1.3,
      badges: ["Watchlist"]
    }, {
      name: "TSMC (ADR)",
      ticker: "TSM",
      sector: "Technology",
      region: "United States",
      marketCap: 880.0,
      changeYTD: 33.1,
      longTermCAGR: 19.0,
      estFYGrowth: 20.0,
      roe: 28.0,
      profitMargin: 41.0,
      forwardPE: 22.5,
      dividendYield: 1.4,
      badges: ["Watchlist"]
    }, {
      name: "Adobe Inc",
      ticker: "ADBE",
      sector: "Technology",
      region: "United States",
      marketCap: 235.0,
      changeYTD: -6.2,
      longTermCAGR: 15.0,
      estFYGrowth: 12.0,
      roe: 35.0,
      profitMargin: 30.0,
      forwardPE: 24.0,
      dividendYield: 0.0,
      badges: ["Watchlist"]
    }]
  },
  /* ============================= BOND ============================= */
  bond: {
    key: "bond",
    label: "Bond",
    title: "Bond Selection",
    noun: "bonds",
    subtitle: "Core fixed-income ideas with disciplined credit and duration positioning.",
    source: "Source: Bloomberg, rating agencies · LFA Investment Office",
    idCol: {
      type: "identity",
      key: "issuer",
      label: "Issuer / ISIN",
      primary: "issuer",
      code: "isin",
      sub: "securityName",
      badges: "badges",
      group: "Profile",
      sortable: true
    },
    columns: [{
      key: "currency",
      label: "Ccy",
      type: "text",
      align: "left",
      group: "Profile"
    }, {
      key: "coupon",
      label: "Coupon",
      type: "percent",
      align: "right",
      group: "Terms",
      sortable: true
    }, {
      key: "maturity",
      label: "Maturity",
      type: "date",
      align: "left",
      group: "Terms",
      sortable: true
    }, {
      key: "rating",
      label: "Rating",
      type: "rating",
      align: "left",
      group: "Credit",
      sortable: true
    }, {
      key: "risk",
      label: "Risk",
      type: "risk",
      align: "left",
      group: "Credit"
    }, {
      key: "price",
      label: "Price",
      type: "number",
      align: "right",
      group: "Yield",
      sortable: true
    }, {
      key: "ytm",
      label: "YTM",
      type: "change",
      align: "right",
      neutral: true,
      group: "Yield",
      sortable: true
    }, {
      key: "duration",
      label: "Duration",
      type: "number",
      align: "right",
      suffix: " yr",
      group: "Yield",
      sortable: true
    }],
    rows: [{
      issuer: "Nestlé Finance",
      isin: "XS2345678901",
      securityName: "1.25% 2029",
      currency: "EUR",
      coupon: 1.25,
      maturity: "15 Mar 2029",
      rating: "AA-",
      price: 96.4,
      ytm: 2.10,
      duration: 4.6,
      risk: "Low",
      badges: []
    }, {
      issuer: "US Treasury",
      isin: "US91282CJL58",
      securityName: "4.00% 2034",
      currency: "USD",
      coupon: 4.00,
      maturity: "30 Nov 2034",
      rating: "AAA",
      price: 99.1,
      ytm: 4.12,
      duration: 8.1,
      risk: "Low",
      badges: []
    }, {
      issuer: "Swiss Confed.",
      isin: "CH0224397213",
      securityName: "0.50% 2031",
      currency: "CHF",
      coupon: 0.50,
      maturity: "27 Jun 2031",
      rating: "AAA",
      price: 92.7,
      ytm: 0.94,
      duration: 6.3,
      risk: "Low",
      badges: []
    }, {
      issuer: "Roche Holding",
      isin: "XS2483910114",
      securityName: "3.10% 2030",
      currency: "EUR",
      coupon: 3.10,
      maturity: "12 Feb 2030",
      rating: "AA",
      price: 100.8,
      ytm: 2.95,
      duration: 5.0,
      risk: "Low",
      badges: []
    }, {
      issuer: "Telecom Italia",
      isin: "XS2102392019",
      securityName: "5.30% 2030",
      currency: "EUR",
      coupon: 5.30,
      maturity: "30 May 2030",
      rating: "BB",
      price: 98.2,
      ytm: 5.74,
      duration: 4.4,
      risk: "High",
      badges: ["Non-core"]
    }, {
      issuer: "Bank of America",
      isin: "US06051GJT84",
      securityName: "4.95% 2032",
      currency: "USD",
      coupon: 4.95,
      maturity: "22 Jul 2032",
      rating: "A-",
      price: 101.3,
      ytm: 4.78,
      duration: 6.0,
      risk: "Medium",
      badges: []
    }, {
      issuer: "Ford Motor Credit",
      isin: "US345397B998",
      securityName: "6.10% 2028",
      currency: "USD",
      coupon: 6.10,
      maturity: "19 Aug 2028",
      rating: "BB+",
      price: 102.6,
      ytm: 5.42,
      duration: 3.2,
      risk: "High",
      badges: ["Non-core"]
    }, {
      issuer: "EDF",
      isin: "FR0013451218",
      securityName: "2.00% 2033",
      currency: "EUR",
      coupon: 2.00,
      maturity: "09 Dec 2033",
      rating: "A-",
      price: 89.5,
      ytm: 3.40,
      duration: 7.8,
      risk: "Medium",
      badges: []
    }]
  },
  /* ============================= FUNDS ============================= */
  funds: {
    key: "funds",
    label: "Funds",
    title: "Fund Selection",
    noun: "funds",
    subtitle: "Vetted third-party and internal funds across the core asset classes.",
    source: "Source: Morningstar, fund factsheets · LFA Investment Office",
    idCol: {
      type: "identity",
      key: "name",
      label: "Fund / ISIN",
      primary: "name",
      code: "isin",
      sub: "category",
      badges: "badges",
      group: "Profile",
      sortable: true
    },
    columns: [{
      key: "currency",
      label: "Ccy",
      type: "text",
      align: "left",
      group: "Profile"
    }, {
      key: "nav",
      label: "NAV",
      type: "number",
      align: "right",
      group: "Value",
      sortable: true
    }, {
      key: "changeYTD",
      label: "YTD",
      type: "change",
      align: "right",
      group: "Value",
      sortable: true
    }, {
      key: "ter",
      label: "TER",
      type: "percent",
      align: "right",
      group: "Cost & Size",
      sortable: true
    }, {
      key: "aum",
      label: "AUM",
      type: "currency",
      align: "right",
      unit: "B",
      group: "Cost & Size",
      sortable: true
    }, {
      key: "rating",
      label: "Rating",
      type: "stars",
      align: "left",
      group: "Quality",
      sortable: true
    }],
    rows: [{
      name: "LFA Global Equity",
      isin: "LU2011223344",
      category: "Global Equity",
      currency: "USD",
      nav: 184.22,
      changeYTD: 12.6,
      ter: 0.85,
      aum: 1.42,
      rating: 5,
      badges: ["Internal"]
    }, {
      name: "Pictet Global Megatrend",
      isin: "LU0386882277",
      category: "Thematic Equity",
      currency: "USD",
      nav: 312.05,
      changeYTD: 15.1,
      ter: 1.12,
      aum: 6.80,
      rating: 4,
      badges: []
    }, {
      name: "PIMCO GIS Income",
      isin: "IE00B7KFL990",
      category: "Fixed Income",
      currency: "USD",
      nav: 11.84,
      changeYTD: 4.3,
      ter: 0.55,
      aum: 9.21,
      rating: 5,
      badges: []
    }, {
      name: "LFA Swiss Balanced",
      isin: "CH0455667788",
      category: "Multi-Asset",
      currency: "CHF",
      nav: 142.90,
      changeYTD: 6.9,
      ter: 0.78,
      aum: 0.64,
      rating: 4,
      badges: ["Internal"]
    }, {
      name: "iShares Core MSCI World",
      isin: "IE00B4L5Y983",
      category: "Index Equity",
      currency: "USD",
      nav: 92.41,
      changeYTD: 13.8,
      ter: 0.20,
      aum: 78.4,
      rating: 5,
      badges: ["Low cost"]
    }, {
      name: "BlueBay Inv Grade",
      isin: "LU0549537267",
      category: "Fixed Income",
      currency: "EUR",
      nav: 108.55,
      changeYTD: 3.1,
      ter: 0.62,
      aum: 2.13,
      rating: 3,
      badges: []
    }, {
      name: "Wellington Alternative",
      isin: "LU2298991010",
      category: "Alternatives",
      currency: "USD",
      nav: 156.70,
      changeYTD: 8.2,
      ter: 1.35,
      aum: 1.05,
      rating: 4,
      badges: []
    }, {
      name: "LFA Sustainable Bond",
      isin: "LU2477880022",
      category: "ESG Fixed Income",
      currency: "EUR",
      nav: 99.18,
      changeYTD: 3.7,
      ter: 0.70,
      aum: 0.38,
      rating: 4,
      badges: ["Internal", "ESG"]
    }]
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "list-template/data.js", error: String((e && e.message) || e) }); }

// proposals/investment-process/ds-base.js
try { (() => {
// Loads this design system into the template. In a consuming project, point
// base at the bound DS folder relative to this file (e.g. '_ds/<folder>' at
// the project root, '../_ds/<folder>' one level down) — one line to edit.
(() => {
  const base = '../..';
  for (const p of ["tokens/fonts.css", "tokens/colors.css", "tokens/typography.css", "tokens/spacing.css", "tokens/base.css", "styles.css"]) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = base + '/' + p;
    document.head.appendChild(l);
  }
  const s = document.createElement('script');
  s.src = base + '/_ds_bundle.js';
  s.onerror = () => console.error('ds-base.js: failed to load ' + s.src + ' — if this is a consuming project, point the base line in ds-base.js at the bound _ds/<folder> tree relative to this page (e.g. _ds/<folder> at the project root, ../_ds/<folder> one level down); in a fresh design system this can just mean the bundle is not compiled yet');
  document.head.appendChild(s);
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "proposals/investment-process/ds-base.js", error: String((e && e.message) || e) }); }

// proposals/investment-process/ip-master-data.js
try { (() => {
/* ============================================================================
   LFA Investment Process — MASTER DATA layer (single source of truth)
   ----------------------------------------------------------------------------
   ONE place holds every number behind the deck's charts. The Data Master page
   edits it (and imports the PM "Richiesta dati" .xlsx); the deck READS it and
   renders charts read-only. Both share localStorage key LFA_IP_MASTER_v1.

   Schema (all weights in %, performance index rebased to 100):
     asOf:        "Q1 2026"
     classes:     ['Cash','Equity','Fixed Inc.','Alt.','Comm.']
     currencies:  ['USD','EUR','CHF','Gold','EMC']
     strategies:  ['Low','Moderate','Medium','High']
     range:  { Low:[{min,max,bck}×5], Moderate, Medium, High }      // benchmark composition
     alloc:  { USD:{moderate:[5],medium:[5]}, EUR, CHF }            // asset breakdown
     ccy:    { USD:{moderate:[5],medium:[5]}, EUR, CHF }            // currency allocation
     perf:   { low:{years,cum,annual}, moderate, medium, high }     // performance
   ============================================================================ */
(function (global) {
  'use strict';

  var KEY = 'LFA_IP_MASTER_v1';

  // --- Defaults: the real values from the PM master workbook (Q1'26) ---------
  var DEFAULT = {
    asOf: "Q1 2026",
    classes: ['Cash', 'Equity', 'Fixed Inc.', 'Alt.', 'Comm.'],
    currencies: ['USD', 'EUR', 'CHF', 'Gold', 'EMC'],
    strategies: ['Low', 'Moderate', 'Medium', 'High'],
    // curated series colours — currency lines + categorical (bar) series
    colors: {
      ccy: {
        USD: '#23366E',
        EUR: '#C24A5E',
        CHF: '#B0852F'
      },
      cat: ['#23366E', '#C24A5E', '#3E7C72', '#B0852F']
    },
    // benchmark composition — tactical MIN/MAX band + strategic BCK marker, per asset class (%)
    range: {
      Low: [{
        min: 8,
        max: 16,
        bck: 12
      }, {
        min: 2,
        max: 22,
        bck: 12
      }, {
        min: 56,
        max: 76,
        bck: 66
      }, {
        min: 1,
        max: 9,
        bck: 5
      }, {
        min: 2,
        max: 8,
        bck: 5
      }],
      Moderate: [{
        min: 1,
        max: 9,
        bck: 5
      }, {
        min: 20,
        max: 40,
        bck: 30
      }, {
        min: 45,
        max: 65,
        bck: 55
      }, {
        min: 3,
        max: 11,
        bck: 7
      }, {
        min: 0,
        max: 6,
        bck: 3
      }],
      Medium: [{
        min: 0,
        max: 7,
        bck: 3
      }, {
        min: 40,
        max: 60,
        bck: 50
      }, {
        min: 28,
        max: 48,
        bck: 38
      }, {
        min: 2,
        max: 10,
        bck: 6
      }, {
        min: 0,
        max: 6,
        bck: 3
      }],
      High: [{
        min: 0,
        max: 6,
        bck: 2
      }, {
        min: 65,
        max: 85,
        bck: 75
      }, {
        min: 3,
        max: 23,
        bck: 13
      }, {
        min: 2,
        max: 10,
        bck: 6
      }, {
        min: 1,
        max: 7,
        bck: 4
      }]
    },
    alloc: {
      USD: {
        moderate: [3.57, 25.96, 49.92, 12.16, 6.53],
        medium: [1.32, 53.78, 30.66, 8.63, 5.61]
      },
      EUR: {
        moderate: [1.88, 29.16, 62.91, 6.04, 0],
        medium: [1.67, 56.70, 36.02, 5.61, 0]
      },
      CHF: {
        moderate: [1.91, 28.48, 63.12, 6.48, 0],
        medium: [1.08, 54.04, 39.05, 5.83, 0]
      }
    },
    ccy: {
      USD: {
        moderate: [94.24, 0, 0, 2.71, 3.06],
        medium: [91.11, 4.29, 18.15, 2.56, 6.33]
      },
      EUR: {
        moderate: [4.80, 91.25, 0, 2.46, 1.48],
        medium: [4.29, 88.22, 0, 4.26, 3.24]
      },
      CHF: {
        moderate: [0, 0, 79.89, 4.29, 1.45],
        medium: [0, 0, 74.21, 4.37, 3.27]
      }
    },
    perf: {
      low: {
        years: ['15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', "Q1'26"],
        cum: [100, 98.34, 105.25, 100.34, 112.45, 120.45, 125.13, 109.64, 119.22, 126.68, 128.71, 136.14],
        annual: [-2.82, 1.19, 7.03, -4.66, 12.06, 7.12, 3.88, -12.38, 8.74, 6.26, 1.61, -1.03]
      },
      moderate: {
        years: ['15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', "Q1'26"],
        cum: [100, 107.96, 106.30, 115.76, 120.90, 120.67, 113.36, 118.96, 122.01, 128.71, 137.67, 123.50],
        annual: [0.00, 7.96, -1.54, 8.90, 4.44, -0.19, -6.06, 4.94, 2.57, 5.46, 1.20, -10.30]
      },
      medium: {
        years: ['15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', "Q1'26"],
        cum: [100, 102.59, 114.22, 107.18, 125.58, 139.65, 153.35, 130.13, 146.51, 161.59, 180.00, 175.96],
        annual: [-1.92, 4.60, 11.33, -6.16, 17.17, 11.20, 9.81, -15.14, 12.59, 10.29, 11.39, -2.25]
      },
      high: {
        years: ['17', '18', '19', '20', '21', '22', '23', '24', '25', "Q1'26"],
        cum: [100, 88.10, 103.76, 119.36, 129.01, 150.46, 170.05, 170.05, 190.21, 184.48],
        annual: [0, -11.90, 17.77, 12.09, 16.63, 13.02, 11.86, 0, 11.86, -3.02]
      }
    }
  };
  function clone(o) {
    return JSON.parse(JSON.stringify(o));
  }

  // Seed per-currency cumulative tracks from the (USD) perf series. EUR/CHF are
  // illustrative variants of the USD index, then editable in the Data Master.
  function makePerfCcy(perf) {
    var out = {};
    Object.keys(perf || {}).forEach(function (k) {
      var cum = perf[k] && perf[k].cum || [];
      out[k] = {
        EUR: cum.map(function (c) {
          return Math.round((100 + (c - 100) * 0.92) * 100) / 100;
        }),
        CHF: cum.map(function (c) {
          return Math.round((100 + (c - 100) * 0.85) * 100) / 100;
        })
      };
    });
    return out;
  }
  function freshDefault() {
    return migrate(clone(DEFAULT));
  }

  // One-time cleanup: older sessions saved per-chart Chart-Studio overrides
  // (key "lfa-chart:<id>") that win over the master data and showed stale,
  // "invented" numbers. Bump GEN to wipe them once across deck + Data Master.
  var GEN = '2026q1.v2';
  function migrateOverrides() {
    try {
      if (global.localStorage.getItem('lfa-chart-gen') === GEN) return;
      Object.keys(global.localStorage).filter(function (k) {
        return k.indexOf('lfa-chart:') === 0;
      }).forEach(function (k) {
        global.localStorage.removeItem(k);
      });
      global.localStorage.setItem('lfa-chart-gen', GEN);
    } catch (e) {}
  }
  function clearOverride(id) {
    try {
      global.localStorage.removeItem('lfa-chart:' + id);
    } catch (e) {}
  }
  function load() {
    try {
      var raw = global.localStorage.getItem(KEY);
      if (raw) {
        var d = JSON.parse(raw);
        return migrate(d);
      }
    } catch (e) {}
    return freshDefault();
  }
  function save(data) {
    try {
      global.localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {}
    global.LFA_IP_MASTER = data;
    try {
      global.dispatchEvent(new CustomEvent('lfa-master-updated', {
        detail: data
      }));
    } catch (e) {}
    return data;
  }
  function reset() {
    try {
      global.localStorage.removeItem(KEY);
    } catch (e) {}
    return freshDefault();
  }
  // tolerate older shapes
  function migrate(d) {
    if (!d.range && d.bench) {
      var band = d.benchBand || [4, 10, 10, 4, 3];
      d.range = {};
      Object.keys(d.bench).forEach(function (k) {
        d.range[k] = d.bench[k].map(function (v, i) {
          return {
            min: Math.max(0, v - band[i]),
            max: v + band[i],
            bck: v
          };
        });
      });
    }
    // per-currency performance: USD = perf.cum; EUR/CHF seeded then editable
    if (!d.perfCcy && d.perf) d.perfCcy = makePerfCcy(d.perf);
    if (!d.colors) d.colors = {
      ccy: {
        USD: '#23366E',
        EUR: '#C24A5E',
        CHF: '#B0852F'
      },
      cat: ['#23366E', '#C24A5E', '#3E7C72', '#B0852F']
    };
    return d;
  }

  // --- Build the <lfa-chart> spec registry from a data object ----------------
  function buildSpecs(D) {
    D = D || load();
    var reg = {};
    var pts = function (xs, ys) {
      return xs.map(function (x, i) {
        return {
          x: x,
          y: ys[i]
        };
      });
    };
    var C = D.colors || {
      ccy: {},
      cat: []
    };
    var cat = C.cat || [];
    var cc = C.ccy || {};
    [['ip-alloc-usd', 'USD'], ['ip-alloc-eur', 'EUR'], ['ip-alloc-chf', 'CHF']].forEach(function (p) {
      var d = D.alloc[p[1]];
      reg[p[0]] = {
        type: 'groupbar',
        meta: {
          title: '',
          yLabel: '%'
        },
        series: [{
          name: 'Moderate',
          points: pts(D.classes, d.moderate),
          color: cat[0]
        }, {
          name: 'Medium',
          points: pts(D.classes, d.medium),
          color: cat[1]
        }]
      };
    });
    [['ip-ccy-usd', 'USD'], ['ip-ccy-eur', 'EUR'], ['ip-ccy-chf', 'CHF']].forEach(function (p) {
      var d = D.ccy[p[1]];
      reg[p[0]] = {
        type: 'barh',
        meta: {
          title: '',
          xLabel: '%'
        },
        series: [{
          name: 'Moderate',
          points: pts(D.currencies, d.moderate),
          color: cat[0]
        }, {
          name: 'Medium',
          points: pts(D.currencies, d.medium),
          color: cat[1]
        }]
      };
    });
    [['ip-bench-low', 'Low'], ['ip-bench-mod', 'Moderate'], ['ip-bench-med', 'Medium'], ['ip-bench-high', 'High']].forEach(function (p) {
      var r = D.range[p[1]];
      reg[p[0]] = {
        type: 'rangebar',
        meta: {
          title: '',
          xLabel: '',
          yLabel: '',
          hideLegend: true
        },
        series: [{
          name: 'Min',
          points: pts(D.classes, r.map(function (a) {
            return a.min;
          }))
        }, {
          name: 'Max',
          points: pts(D.classes, r.map(function (a) {
            return a.max;
          }))
        }, {
          name: 'Benchmark',
          points: pts(D.classes, r.map(function (a) {
            return a.bck;
          })),
          color: '#C24A5E'
        }]
      };
    });
    var pc = D.perfCcy || {};
    var deriveAnnual = function (cum) {
      return (cum || []).map(function (c, i) {
        return i === 0 ? 0 : Math.round((c / cum[i - 1] - 1) * 1000) / 10;
      });
    };
    Object.keys(D.perf).forEach(function (key) {
      var p = D.perf[key];
      var eur = pc[key] && pc[key].EUR || [],
        chf = pc[key] && pc[key].CHF || [];
      // Linked two-panel chart: 3 cumulative LINES (top) + 3 annual BARS (bottom),
      // one colour per currency shared by its line + bars.
      reg['ip-perf-' + key] = {
        type: 'perfstackmulti',
        meta: {
          title: '',
          yLabel: 'Annual %',
          y2Label: 'Index',
          nCcy: 3
        },
        series: [{
          name: 'USD',
          points: pts(p.years, p.cum),
          color: cc.USD
        }, {
          name: 'EUR',
          points: pts(p.years, eur),
          color: cc.EUR
        }, {
          name: 'CHF',
          points: pts(p.years, chf),
          color: cc.CHF
        }, {
          name: 'USD',
          points: pts(p.years, deriveAnnual(p.cum)),
          color: cc.USD
        }, {
          name: 'EUR',
          points: pts(p.years, deriveAnnual(eur)),
          color: cc.EUR
        }, {
          name: 'CHF',
          points: pts(p.years, deriveAnnual(chf)),
          color: cc.CHF
        }]
      };
    });
    return reg;
  }

  // --- Single mandate × currency view specs (the LFA 2nd / per-mandate view) -
  // Benchmark is defined per mandate (USD-based); performance has a per-currency
  // track for every mandate; asset/currency allocation exist only for Moderate
  // & Medium in the LFA master, so those return null for Low/High (UI shows n/d).
  function buildSingleSpecs(D, mandate, ccy) {
    D = D || load();
    mandate = mandate || D.strategies[0];
    ccy = ccy || 'USD';
    var reg = {};
    var pts = function (xs, ys) {
      return xs.map(function (x, i) {
        return {
          x: x,
          y: ys[i]
        };
      });
    };
    var C = D.colors || {
      ccy: {},
      cat: []
    };
    var cat = C.cat || [];
    var cc = C.ccy || {};
    var mKey = mandate.toLowerCase(); // perf keys are lowercase
    var allocKey = mKey === 'moderate' || mKey === 'medium' ? mKey : null;
    var mcol = cat[D.strategies.indexOf(mandate)] || cat[0];
    var r = D.range && D.range[mandate] || D.classes.map(function () {
      return {
        min: 0,
        max: 0,
        bck: 0
      };
    });
    reg['ip-1-bench'] = {
      type: 'rangebar',
      meta: {
        title: '',
        hideLegend: true
      },
      series: [{
        name: 'Min',
        points: pts(D.classes, r.map(function (a) {
          return a.min;
        }))
      }, {
        name: 'Max',
        points: pts(D.classes, r.map(function (a) {
          return a.max;
        }))
      }, {
        name: 'Benchmark',
        points: pts(D.classes, r.map(function (a) {
          return a.bck;
        })),
        color: '#C24A5E'
      }]
    };
    var av = allocKey && D.alloc[ccy] ? D.alloc[ccy][allocKey] : null;
    reg['ip-1-alloc'] = av ? {
      type: 'barh',
      meta: {
        title: '',
        xLabel: '%'
      },
      series: [{
        name: mandate + ' · ' + ccy,
        points: pts(D.classes, av),
        color: mcol
      }]
    } : null;
    var cv = allocKey && D.ccy[ccy] ? D.ccy[ccy][allocKey] : null;
    reg['ip-1-ccy'] = cv ? {
      type: 'barh',
      meta: {
        title: '',
        xLabel: '%'
      },
      series: [{
        name: mandate + ' · ' + ccy,
        points: pts(D.currencies, cv),
        color: mcol
      }]
    } : null;
    var pc = D.perfCcy || {},
      p = D.perf && D.perf[mKey] || {
        years: [],
        cum: []
      };
    var track = ccy === 'USD' ? p.cum || [] : pc[mKey] && pc[mKey][ccy] || [];
    var deriveAnnual = function (cum) {
      return (cum || []).map(function (c, i) {
        return i === 0 ? 0 : Math.round((c / cum[i - 1] - 1) * 1000) / 10;
      });
    };
    reg['ip-1-perf'] = {
      type: 'perfstackmulti',
      meta: {
        title: '',
        yLabel: 'Annual %',
        y2Label: 'Index',
        nCcy: 1
      },
      series: [{
        name: ccy,
        points: pts(p.years, track),
        color: cc[ccy] || mcol
      }, {
        name: ccy,
        points: pts(p.years, deriveAnnual(track)),
        color: cc[ccy] || mcol
      }]
    };
    return reg;
  }

  // --- Import: parse the PM "Fill out Data" sheet (array-of-arrays) ----------
  // Robust to row drift: locates blocks by their label anchors, reads columns
  // relative to the strategy-group header. Returns a partial data object with
  // whatever it could read; caller merges over current data.
  function parseAOA(aoa) {
    var out = {};
    var num = function (v) {
      var n = parseFloat(v);
      return isNaN(n) ? null : n;
    };
    var pct = function (v) {
      var n = num(v);
      return n == null ? null : Math.round(n * 1000) / 10;
    }; // fraction→%
    var norm = function (s) {
      return String(s == null ? '' : s).trim().toLowerCase();
    };
    var findRow = function (re, from) {
      for (var r = from || 0; r < aoa.length; r++) {
        var row = aoa[r] || [];
        for (var c = 0; c < row.length; c++) {
          if (re.test(norm(row[c]))) return {
            r: r,
            c: c
          };
        }
      }
      return null;
    };
    var colOf = function (rowIdx, re) {
      var row = aoa[rowIdx] || [];
      for (var c = 0; c < row.length; c++) {
        if (re.test(norm(row[c]))) return c;
      }
      return -1;
    };
    var assets = ['cash', 'equity', 'fixed income', 'alternatives', 'commodities'];
    var assetRowIndex = function (startRow, name) {
      for (var r = startRow; r < startRow + 12 && r < aoa.length; r++) {
        var row = aoa[r] || [];
        for (var c = 0; c < row.length; c++) {
          if (norm(row[c]) === name) return {
            r: r,
            c: c
          };
        }
      }
      return null;
    };

    // ---- Benchmark range block ----
    var rangeHdr = findRow(/^range min/);
    if (rangeHdr) {
      var stratRow = rangeHdr.r + 1; // "Strategia Low ... Moderate ..."
      var labelRow = -1; // row with MIN/MAX/BCK
      for (var rr = rangeHdr.r; rr < rangeHdr.r + 5 && rr < aoa.length; rr++) {
        if (colOf(rr, /^min$/) >= 0) {
          labelRow = rr;
          break;
        }
      }
      var range = {};
      [['low', /strategia low/], ['moderate', /strategia moderate/], ['medium', /strategia medium/], ['high', /strategia high/]].forEach(function (s) {
        var sc = colOf(stratRow, s[1]);
        if (sc < 0) return;
        // first MIN at/after sc on labelRow = USD column triplet
        var minC = -1,
          lr = aoa[labelRow] || [];
        for (var c = sc; c < lr.length; c++) {
          if (norm(lr[c]) === 'min') {
            minC = c;
            break;
          }
        }
        if (minC < 0) return;
        var arr = [];
        assets.forEach(function (a) {
          var ar = assetRowIndex(labelRow + 1, a);
          if (!ar) {
            arr.push({
              min: 0,
              max: 0,
              bck: 0
            });
            return;
          }
          var row = aoa[ar.r] || [];
          arr.push({
            min: pct(row[minC]) || 0,
            max: pct(row[minC + 1]) || 0,
            bck: pct(row[minC + 2]) || 0
          });
        });
        range[s[0].charAt(0).toUpperCase() + s[0].slice(1)] = arr;
      });
      if (Object.keys(range).length) out.range = range;
    }

    // ---- Currency allocation block ----
    var ccyHdr = findRow(/^currency allocation/);
    if (ccyHdr) {
      var cStratRow = ccyHdr.r + 1,
        cCurRow = ccyHdr.r + 2;
      var rowsOrder = ['usd', 'eur', 'chf', 'gold', 'emc'];
      var ccy = {
        USD: {},
        EUR: {},
        CHF: {}
      };
      var stratCols = {};
      ['low', 'moderate', 'medium', 'high'].forEach(function (st) {
        stratCols[st] = colOf(cStratRow, new RegExp('strategia ' + st));
      });
      // mandate currency = which sub-column (USD/EUR/CHF) under each strategy
      ['moderate', 'medium'].forEach(function (st) {
        var sc = stratCols[st];
        if (sc < 0) return;
        var hdr = aoa[cCurRow] || [];
        ['USD', 'EUR', 'CHF'].forEach(function (mc) {
          var mcCol = -1;
          for (var c = sc; c < sc + 8 && c < hdr.length; c++) {
            if (norm(hdr[c]) === mc.toLowerCase()) {
              mcCol = c;
              break;
            }
          }
          if (mcCol < 0) return;
          var vals = rowsOrder.map(function (rn) {
            for (var r = cCurRow + 1; r < cCurRow + 9 && r < aoa.length; r++) {
              var row = aoa[r] || [];
              if (norm(row[ccyHdr.c]) === rn || norm(row[sc]) === rn) return pct(row[mcCol]) || 0;
            }
            return 0;
          });
          ccy[mc][st] = vals;
        });
      });
      out.ccy = ccy;
    }
    return out;
  }

  // --- Export current data to a 2-sheet workbook model (for SheetJS) ---------
  function toSheets(D) {
    D = D || load();
    var fill = [];
    var push = function (arr) {
      fill.push(arr);
    };
    push(['', '', 'Performance (cumulative index, per currency)']);
    push(['', '', 'Strategy', 'Year', 'USD', 'EUR', 'CHF']);
    var PC = D.perfCcy || {};
    ['low', 'moderate', 'medium', 'high'].forEach(function (k) {
      var p = D.perf[k];
      if (!p) return;
      var e = PC[k] && PC[k].EUR || [],
        h = PC[k] && PC[k].CHF || [];
      p.years.forEach(function (y, i) {
        push(['', '', k, y, p.cum[i], e[i], h[i]]);
      });
      push([]);
    });
    push([]);
    push(['', '', 'Range Min./Max.']);
    push(['', '', 'Strategy', 'Category', 'MIN', 'MAX', 'BCK']);
    ['Low', 'Moderate', 'Medium', 'High'].forEach(function (s) {
      (D.range[s] || []).forEach(function (a, i) {
        push(['', '', s, D.classes[i], a.min / 100, a.max / 100, a.bck / 100]);
      });
      push([]);
    });
    push([]);
    push(['', '', 'Currency Allocation']);
    push(['', '', 'Mandate', 'Profile', 'USD', 'EUR', 'CHF', 'Gold', 'EMC']);
    ['USD', 'EUR', 'CHF'].forEach(function (mc) {
      ['moderate', 'medium'].forEach(function (st) {
        var v = D.ccy[mc][st] || [];
        push(['', '', mc, st].concat(v.map(function (x) {
          return x / 100;
        })));
      });
    });
    return {
      'Fill out Data': fill
    };
  }
  global.LFAMaster = {
    KEY: KEY,
    DEFAULT: DEFAULT,
    clone: clone,
    load: load,
    save: save,
    reset: reset,
    clearOverride: clearOverride,
    buildSpecs: buildSpecs,
    buildSingleSpecs: buildSingleSpecs,
    parseAOA: parseAOA,
    toSheets: toSheets
  };
  migrateOverrides();
  global.LFA_IP_MASTER = load();
})(window);
})(); } catch (e) { __ds_ns.__errors.push({ path: "proposals/investment-process/ip-master-data.js", error: String((e && e.message) || e) }); }

// proposals/investment-process/ip-master-gm-defaults.js
try { (() => {
/* AUTO-GENERATED from Master File PM - Global Mandates.xlsx (Q1 2026).
   3 pitched mandates (Income, Balanced, Dynamic), USD only. Consumed by ip-master-gm.js.
   Includes portfolio model (hierarchical asset-class rollup) and stress-test scenarios. */
window.GM_DEFAULTS = {
  "asOf": "Q1 2026",
  "strategies": ["Income", "Balanced", "Dynamic"],
  "currencies": ["USD"],
  "classes": ["Cash", "Equity", "Fixed Income", "Alternatives", "Commodities"],
  "ccyExposure": ["USD", "EUR", "CHF", "Others"],
  "alloc": {
    "Income|USD": [13, 19, 49.5, 16, 2.5],
    "Balanced|USD": [14.5, 32.5, 28.5, 19.5, 5],
    "Dynamic|USD": [22, 49, 0, 21.5, 7.5]
  },
  "ccy": {
    "Income|USD": [94, 6, 0, 0],
    "Balanced|USD": [90.5, 9.5, 0, 0],
    "Dynamic|USD": [87, 13, 0, 0]
  },
  "range": {
    "Income|USD": [{
      "min": 0,
      "max": 90,
      "bck": 5
    }, {
      "min": 0,
      "max": 30,
      "bck": 25
    }, {
      "min": 0,
      "max": 90,
      "bck": 50
    }, {
      "min": 0,
      "max": 30,
      "bck": 20
    }, {
      "min": 0,
      "max": 10,
      "bck": 0
    }],
    "Balanced|USD": [{
      "min": 0,
      "max": 70,
      "bck": 3
    }, {
      "min": 0,
      "max": 60,
      "bck": 45
    }, {
      "min": 0,
      "max": 70,
      "bck": 30
    }, {
      "min": 0,
      "max": 30,
      "bck": 22
    }, {
      "min": 0,
      "max": 15,
      "bck": 0
    }],
    "Dynamic|USD": [{
      "min": 0,
      "max": 60,
      "bck": 0
    }, {
      "min": 0,
      "max": 100,
      "bck": 75
    }, {
      "min": 0,
      "max": 60,
      "bck": 0
    }, {
      "min": 0,
      "max": 30,
      "bck": 25
    }, {
      "min": 0,
      "max": 15,
      "bck": 0
    }]
  },
  "perf": {
    "USD|Income": {
      "years": ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "Q1'26"],
      "annual": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      "cum": [100, 98.9, 105.63, 113.86, 109.08, 122.72, 133.52, 145.67, 128.33, 137.65, 144.21, 157.04, 161.26]
    },
    "USD|Balanced": {
      "years": ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "Q1'26"],
      "annual": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      "cum": [100, 99.3, 106.75, 118.38, 111.75, 127.85, 143.95, 161.37, 139.43, 151.29, 161.17, 177.71, 184.28]
    },
    "USD|Dynamic": {
      "years": ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "Q1'26"],
      "annual": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      "cum": [100, 99.6, 107.77, 124.58, 115.73, 137.14, 162.65, 189.49, 159.55, 179.32, 197, 219.79, 231.05]
    }
  },
  "colors": {
    "ccy": {
      "USD": "#83021A",
      "EUR": "#B0852F",
      "CHF": "#3E6E66"
    },
    "cat": ["#83021A", "#5A626B", "#3E6E66"]
  },
  "portfolio": {
    "Income": [{
      "cls": "Liquidity",
      "weight": 5.5,
      "sub": []
    }, {
      "cls": "Bonds",
      "weight": 37.45,
      "sub": [{
        "name": "Government",
        "weight": 8.15
      }, {
        "name": "Corporate Inv. Grade",
        "weight": 7.26
      }, {
        "name": "Corporate High Yield",
        "weight": 12.11
      }, {
        "name": "Emerging Markets",
        "weight": 2.18
      }, {
        "name": "Preferred Shs",
        "weight": 7.75
      }]
    }, {
      "cls": "Equities",
      "weight": 38.27,
      "sub": [{
        "name": "North America",
        "weight": 18.64
      }, {
        "name": "Europe",
        "weight": 10.1
      }, {
        "name": "Emerging Markets",
        "weight": 2.46
      }, {
        "name": "Global",
        "weight": 7.07
      }]
    }, {
      "cls": "Alternatives",
      "weight": 11.67,
      "sub": []
    }, {
      "cls": "Commodities",
      "weight": 6.7,
      "sub": []
    }, {
      "cls": "Real Estate",
      "weight": 4.21,
      "sub": []
    }],
    "Balanced": [{
      "cls": "Liquidity",
      "weight": 5.5,
      "sub": []
    }, {
      "cls": "Bonds",
      "weight": 37.45,
      "sub": [{
        "name": "Government",
        "weight": 8.15
      }, {
        "name": "Corporate Inv. Grade",
        "weight": 7.26
      }, {
        "name": "Corporate High Yield",
        "weight": 12.11
      }, {
        "name": "Emerging Markets",
        "weight": 2.18
      }, {
        "name": "Preferred Shs",
        "weight": 7.75
      }]
    }, {
      "cls": "Equities",
      "weight": 38.27,
      "sub": [{
        "name": "North America",
        "weight": 18.64
      }, {
        "name": "Europe",
        "weight": 10.1
      }, {
        "name": "Emerging Markets",
        "weight": 2.46
      }, {
        "name": "Global",
        "weight": 7.07
      }]
    }, {
      "cls": "Alternatives",
      "weight": 11.67,
      "sub": []
    }, {
      "cls": "Commodities",
      "weight": 6.7,
      "sub": []
    }, {
      "cls": "Real Estate",
      "weight": 4.21,
      "sub": []
    }],
    "Dynamic": [{
      "cls": "Liquidity",
      "weight": 5.5,
      "sub": []
    }, {
      "cls": "Bonds",
      "weight": 37.45,
      "sub": [{
        "name": "Government",
        "weight": 8.15
      }, {
        "name": "Corporate Inv. Grade",
        "weight": 7.26
      }, {
        "name": "Corporate High Yield",
        "weight": 12.11
      }, {
        "name": "Emerging Markets",
        "weight": 2.18
      }, {
        "name": "Preferred Shs",
        "weight": 7.75
      }]
    }, {
      "cls": "Equities",
      "weight": 38.27,
      "sub": [{
        "name": "North America",
        "weight": 18.64
      }, {
        "name": "Europe",
        "weight": 10.1
      }, {
        "name": "Emerging Markets",
        "weight": 2.46
      }, {
        "name": "Global",
        "weight": 7.07
      }]
    }, {
      "cls": "Alternatives",
      "weight": 11.67,
      "sub": []
    }, {
      "cls": "Commodities",
      "weight": 6.7,
      "sub": []
    }, {
      "cls": "Real Estate",
      "weight": 4.21,
      "sub": []
    }]
  },
  "stress": {
    "scenarios": ["Black Monday", "Asian Currency Crisis", "Russian Default", "Technology Bubble Burst", "September 11, 2001", "Global Financial Crisis", "Covid-19"],
    "byMandate": {
      "Income": [-4.44, -1.21, -1.62, -2.62, -2.83, -7.07, -17.55],
      "Balanced": [-9.96, -2.72, -3.62, -5.88, -6.34, -15.84, -21.64],
      "Dynamic": [-16.48, -4.49, -5.99, -9.74, -10.49, -26.21, -27.53]
    }
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "proposals/investment-process/ip-master-gm-defaults.js", error: String((e && e.message) || e) }); }

// proposals/investment-process/ip-master-gm.js
try { (() => {
/* ============================================================================
   Global Mandates Investment Process — MASTER DATA layer (GM profile)
   ----------------------------------------------------------------------------
   LFG+Zest GLOBAL MANDATES are pitched as three SEPARATE lines:
   Income · Balanced · Dynamic — performance in USD only.

   Same data shape as LFGZMaster but keyed STRATEGY × CURRENCY where the only
   currency is USD. Written generically over D.currencies so it would also work
   if more currencies were ever added.

   Defaults from ip-master-gm-defaults.js (window.GM_DEFAULTS), generated from
   "Master File PM - Global Mandates.xlsx".
   ============================================================================ */
(function (global) {
  'use strict';

  var KEY = 'GM_IP_MASTER_v1';
  var ACCENT = '#83021A'; // LFG+Zest brand red (Global Mandates share the LFG palette)

  function fallbackDefault() {
    return {
      asOf: 'Q1 2026',
      strategies: ['Income', 'Balanced', 'Dynamic'],
      currencies: ['USD'],
      classes: ['Cash', 'Equity', 'Fixed Income', 'Alternatives', 'Commodities'],
      ccyExposure: ['USD', 'EUR', 'CHF', 'Others'],
      alloc: {},
      ccy: {},
      range: {},
      perf: {},
      colors: {
        ccy: {
          USD: '#83021A',
          EUR: '#B0852F',
          CHF: '#3E6E66'
        },
        cat: ['#83021A', '#5A626B', '#3E6E66']
      }
    };
  }
  function DEFAULT() {
    return global.GM_DEFAULTS ? global.GM_DEFAULTS : fallbackDefault();
  }
  function clone(o) {
    return JSON.parse(JSON.stringify(o));
  }
  function withColors(d) {
    if (d && !d.colors) d.colors = {
      ccy: {
        USD: '#83021A',
        EUR: '#B0852F',
        CHF: '#3E6E66'
      },
      cat: ['#83021A', '#5A626B', '#3E6E66']
    };
    return d;
  }
  // Recover top-level keys added after a stored object was first persisted
  // (older sessions saved before portfolio/stress existed → load() would
  // otherwise return them undefined and the GM tables render empty).
  function migrate(d) {
    if (!d) return d;
    var def = DEFAULT();
    ['portfolio', 'stress', 'alloc', 'ccy', 'range', 'perf'].forEach(function (k) {
      if (d[k] == null) d[k] = clone(def[k]);
    });
    return d;
  }
  function load() {
    try {
      var raw = global.localStorage.getItem(KEY);
      if (raw) return migrate(withColors(JSON.parse(raw)));
    } catch (e) {}
    return migrate(withColors(clone(DEFAULT())));
  }
  function save(data) {
    try {
      global.localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {}
    global.GM_IP_MASTER = data;
    try {
      global.dispatchEvent(new CustomEvent('gm-master-updated', {
        detail: data
      }));
    } catch (e) {}
    return data;
  }
  function reset() {
    try {
      global.localStorage.removeItem(KEY);
    } catch (e) {}
    return withColors(clone(DEFAULT()));
  }
  function clearOverride(id) {
    try {
      global.localStorage.removeItem('lfa-chart:' + id);
    } catch (e) {}
  }
  var dAnn = function (cum) {
    return (cum || []).map(function (c, i) {
      return i === 0 ? 0 : Math.round((c / cum[i - 1] - 1) * 1000) / 10;
    });
  };

  // --- 4 preview specs for the selected mandate × currency -------------------
  // Same chart-ids as the LFGZ profile so the shared Data Master render reuses them.
  function buildSpecs(D, sel) {
    D = D || load();
    sel = sel || {};
    var strat = sel.strategy || D.strategies[0];
    var ccy = sel.ccy || D.currencies[0];
    var reg = {};
    var pts = function (xs, ys) {
      return xs.map(function (x, i) {
        return {
          x: x,
          y: ys[i]
        };
      });
    };
    var CL = D.colors || {};
    var ccol = CL.ccy || {};
    var cat = CL.cat || [];
    var mcol = cat[D.strategies.indexOf(strat)] || ACCENT;
    var key = strat + '|' + ccy;
    var alloc = D.alloc && D.alloc[key] || D.classes.map(function () {
      return 0;
    });
    reg['lfgz-alloc'] = {
      type: 'barh',
      meta: {
        title: '',
        xLabel: '%'
      },
      series: [{
        name: strat + ' · ' + ccy,
        points: pts(D.classes, alloc),
        color: mcol
      }]
    };
    var cc = D.ccy && D.ccy[key] || D.ccyExposure.map(function () {
      return 0;
    });
    reg['lfgz-ccy'] = {
      type: 'barh',
      meta: {
        title: '',
        xLabel: '%'
      },
      series: [{
        name: strat + ' · ' + ccy,
        points: pts(D.ccyExposure, cc),
        color: mcol
      }]
    };
    var r = D.range && D.range[key] || D.classes.map(function () {
      return {
        min: 0,
        max: 0,
        bck: 0
      };
    });
    reg['lfgz-range'] = {
      type: 'rangebar',
      meta: {
        title: '',
        hideLegend: true
      },
      series: [{
        name: 'Min',
        points: pts(D.classes, r.map(function (a) {
          return a.min;
        }))
      }, {
        name: 'Max',
        points: pts(D.classes, r.map(function (a) {
          return a.max;
        }))
      }, {
        name: 'Benchmark',
        points: pts(D.classes, r.map(function (a) {
          return a.bck;
        }))
      }]
    };

    // Performance: linked two-panel chart over ALL currencies (USD only here).
    // GM is single-currency per pitch, so colour the line/bars by MANDATE (mcol)
    // — that is what the Colours picker's mandate swatch controls.
    reg['lfgz-perf'] = perfSpec(D, strat, ccol, pts, mcol);

    // Stress test: scenario drawdowns for the selected mandate (single bar series)
    var st = D.stress && D.stress.byMandate && D.stress.byMandate[strat] || [];
    reg['gm-stress'] = {
      type: 'groupbar',
      meta: {
        title: '',
        yLabel: '%'
      },
      series: [{
        name: strat + ' — scenario impact',
        points: pts(D.stress && D.stress.scenarios || [], st),
        color: mcol
      }]
    };

    // Portfolio model: per-mandate asset-class rollup (top-level weights, barh)
    reg['gm-model'] = {
      type: 'barh',
      meta: {
        title: '',
        xLabel: '%'
      },
      series: [{
        name: strat + ' · model',
        points: modelComposition(D, strat),
        color: mcol
      }]
    };
    return reg;
  }

  // top-level asset-class weights for a mandate's portfolio model → [{x:class,y:weight}]
  function modelComposition(D, strat) {
    var rows = D.portfolio && D.portfolio[strat] || [];
    return rows.map(function (r) {
      return {
        x: r.cls,
        y: Math.round((+r.weight || 0) * 100) / 100
      };
    });
  }
  function perfSpec(D, strat, ccol, pts, mcol) {
    var ccys = D.currencies || ['USD'];
    var single = ccys.length === 1;
    var y0 = D.perf && D.perf[ccys[0] + '|' + strat] || {
      years: []
    };
    var yrs = y0.years || [];
    var colOf = function (cc) {
      return single ? mcol || ccol[cc] : ccol[cc];
    };
    var nameOf = function (cc) {
      return single ? strat : cc;
    };
    var lines = ccys.map(function (cc) {
      var p = D.perf && D.perf[cc + '|' + strat] || {
        cum: []
      };
      return {
        name: nameOf(cc),
        points: pts(yrs, p.cum || []),
        color: colOf(cc)
      };
    });
    var bars = ccys.map(function (cc) {
      var p = D.perf && D.perf[cc + '|' + strat] || {
        cum: []
      };
      return {
        name: nameOf(cc),
        points: pts(yrs, dAnn(p.cum)),
        color: colOf(cc)
      };
    });
    return {
      type: 'perfstackmulti',
      meta: {
        title: '',
        yLabel: 'Annual %',
        y2Label: 'Index',
        nCcy: ccys.length
      },
      series: lines.concat(bars)
    };
  }

  // --- Recap specs: two compared mandates, selected currency -----------------
  function buildRecapSpecs(D, ccy, pair) {
    D = D || load();
    ccy = ccy || D.currencies[0];
    pair = pair && pair.length ? pair : D.strategies.slice(0, 2);
    var reg = {};
    var pts = function (xs, ys) {
      return xs.map(function (x, i) {
        return {
          x: x,
          y: ys[i]
        };
      });
    };
    var CL = D.colors || {};
    var ccol = CL.ccy || {};
    var cat = CL.cat || [];
    var mcolOf = function (st) {
      return cat[D.strategies.indexOf(st)];
    };
    pair.forEach(function (st, i) {
      var r = D.range && D.range[st + '|' + ccy] || D.classes.map(function () {
        return {
          min: 0,
          max: 0,
          bck: 0
        };
      });
      reg['lfgz-rc-bench-' + i] = {
        type: 'rangebar',
        meta: {
          title: '',
          hideLegend: true
        },
        series: [{
          name: 'Min',
          points: pts(D.classes, r.map(function (a) {
            return a.min;
          }))
        }, {
          name: 'Max',
          points: pts(D.classes, r.map(function (a) {
            return a.max;
          }))
        }, {
          name: 'Benchmark',
          points: pts(D.classes, r.map(function (a) {
            return a.bck;
          }))
        }]
      };
    });
    reg['lfgz-rc-alloc'] = {
      type: 'groupbar',
      meta: {
        title: '',
        yLabel: '%'
      },
      series: pair.map(function (st) {
        var v = D.alloc && D.alloc[st + '|' + ccy] || D.classes.map(function () {
          return 0;
        });
        return {
          name: st,
          points: pts(D.classes, v),
          color: mcolOf(st)
        };
      })
    };
    reg['lfgz-rc-ccy'] = {
      type: 'barh',
      meta: {
        title: '',
        xLabel: '%'
      },
      series: pair.map(function (st) {
        var v = D.ccy && D.ccy[st + '|' + ccy] || D.ccyExposure.map(function () {
          return 0;
        });
        return {
          name: st,
          points: pts(D.ccyExposure, v),
          color: mcolOf(st)
        };
      })
    };
    pair.forEach(function (st, i) {
      reg['lfgz-rc-perf-' + i] = perfSpec(D, st, ccol, pts, mcolOf(st));
    });
    return reg;
  }

  // --- Import the Global Mandates workbook (SheetJS AOAs) --------------------
  function parseWorkbook(sheets) {
    var out = {},
      got = [];
    var STRAT = ['Income', 'Balanced', 'Dynamic'];
    var classes = ['Cash', 'Equity', 'Fixed Income', 'Alternatives', 'Commodities'];
    var pct = function (v) {
      var n = parseFloat(v);
      return isNaN(n) ? 0 : Math.round(n * 1000) / 10;
    };
    var idx = function (v) {
      var n = parseFloat(v);
      return isNaN(n) ? null : Math.round(n * 100) / 100;
    };
    var norm = function (s) {
      return String(s == null ? '' : s).trim();
    };
    var asset = function (s) {
      s = norm(s).toLowerCase();
      if (!s) return null;
      if (s[0] === 'c' && s.indexOf('comm') < 0) return 'Cash';
      if (s.indexOf('equ') === 0) return 'Equity';
      if (s.indexOf('fix') === 0) return 'Fixed Income';
      if (s.indexOf('alt') === 0) return 'Alternatives';
      if (s.indexOf('com') === 0) return 'Commodities';
      return null;
    };
    var pick = function (name) {
      var keys = Object.keys(sheets);
      for (var i = 0; i < keys.length; i++) {
        if (keys[i].toLowerCase().indexOf(name) >= 0) return sheets[keys[i]];
      }
      return null;
    };
    var aa = pick('asset alloc');
    if (aa) {
      var alloc = {};
      for (var i = 1; i < aa.length; i++) {
        var row = aa[i] || [];
        var m = norm(row[0]),
          c = norm(row[1]),
          a = asset(row[2]);
        if (STRAT.indexOf(m) < 0 || c !== 'USD' || !a) continue;
        (alloc[m + '|USD'] = alloc[m + '|USD'] || [0, 0, 0, 0, 0])[classes.indexOf(a)] = pct(row[3]);
      }
      if (Object.keys(alloc).length) {
        out.alloc = alloc;
        got.push('asset allocation');
      }
    }
    var ca = pick('currency alloc');
    if (ca) {
      var exp = ['USD', 'EUR', 'CHF', 'Others'],
        ccy = {};
      for (var j = 1; j < ca.length; j++) {
        var r2 = ca[j] || [];
        var m2 = norm(r2[0]),
          c2 = norm(r2[1]),
          e2 = norm(r2[2]);
        if (STRAT.indexOf(m2) < 0 || c2 !== 'USD' || exp.indexOf(e2) < 0) continue;
        (ccy[m2 + '|USD'] = ccy[m2 + '|USD'] || [0, 0, 0, 0])[exp.indexOf(e2)] = pct(r2[3]);
      }
      if (Object.keys(ccy).length) {
        out.ccy = ccy;
        got.push('currency allocation');
      }
    }
    var bm = pick('benchmark (2)') || pick('benchmark');
    if (bm) {
      var range = {};
      for (var k = 1; k < bm.length; k++) {
        var r3 = bm[k] || [];
        var m3 = norm(r3[0]),
          c3 = norm(r3[2]),
          a3 = asset(r3[3]);
        if (STRAT.indexOf(m3) < 0 || c3 !== 'USD' || !a3) continue;
        var arr = range[m3 + '|USD'] = range[m3 + '|USD'] || classes.map(function () {
          return {
            min: 0,
            max: 0,
            bck: 0
          };
        });
        arr[classes.indexOf(a3)] = {
          min: pct(r3[4]),
          max: pct(r3[5]),
          bck: pct(r3[6])
        };
      }
      if (Object.keys(range).length) {
        out.range = range;
        got.push('benchmark ranges');
      }
    }
    var pf = pick('performance by ccy') || pick('performance');
    if (pf) {
      var hdr = pf[0] || [],
        mc = {};
      hdr.forEach(function (v, i) {
        var n = norm(v).toLowerCase();
        STRAT.forEach(function (m) {
          if (n === m.toLowerCase()) mc[m] = i;
        });
      });
      var perf = {};
      STRAT.forEach(function (m) {
        var i = mc[m];
        if (i == null) return;
        var years = [],
          annual = [],
          cum = [];
        for (var r = 2; r < pf.length; r++) {
          var row = pf[r] || [];
          var y = row[0];
          if (y == null || y === '') continue;
          y = norm(y);
          if (/2026/.test(y)) y = "Q1'26";
          if (!/^\d/.test(y)) continue;
          var cu = row[i + 1];
          if (cu == null || cu === '') continue;
          years.push(y);
          annual.push(pct(row[i]));
          cum.push(idx(cu));
        }
        if (years.length) perf['USD|' + m] = {
          years: years,
          annual: annual,
          cum: cum
        };
      });
      if (Object.keys(perf).length) {
        out.perf = perf;
        got.push('performance (USD)');
      }
    }
    out.__got = got;
    return out;
  }

  // --- Export to long-format sheets ------------------------------------------
  function toSheets(D) {
    D = D || load();
    var aa = [['Mandate', 'CCy', 'Asset Class', 'Weight']];
    D.strategies.forEach(function (s) {
      var v = D.alloc[s + '|USD'] || [];
      D.classes.forEach(function (cl, i) {
        aa.push([s, 'USD', cl, (v[i] || 0) / 100]);
      });
    });
    var ca = [['Mandate', 'CCY', 'Exposure', 'Weight']];
    D.strategies.forEach(function (s) {
      var v = D.ccy[s + '|USD'] || [];
      D.ccyExposure.forEach(function (e, i) {
        ca.push([s, 'USD', e, (v[i] || 0) / 100]);
      });
    });
    var bm = [['Mandate', 'd', 'CCY', 'Categorie', 'MIN', 'MAX', 'BCK']];
    D.strategies.forEach(function (s) {
      var v = D.range[s + '|USD'] || [];
      D.classes.forEach(function (cl, i) {
        var a = v[i] || {
          min: 0,
          max: 0,
          bck: 0
        };
        bm.push([s, '', 'USD', cl, a.min / 100, a.max / 100, a.bck / 100]);
      });
    });
    var pf = [['Year'].concat(D.strategies)];
    var y0 = (D.perf['USD|' + D.strategies[0]] || {
      years: []
    }).years || [];
    y0.forEach(function (y, i) {
      pf.push([y].concat(D.strategies.map(function (s) {
        var p = D.perf['USD|' + s] || {
          cum: []
        };
        return p.cum[i];
      })));
    });
    return {
      'Asset Allocation': aa,
      'Currency Allocation': ca,
      'Benchmark (2)': bm,
      'Performance by Ccy': pf
    };
  }
  global.GMMaster = {
    KEY: KEY,
    ACCENT: ACCENT,
    clone: clone,
    get DEFAULT() {
      return DEFAULT();
    },
    load: load,
    save: save,
    reset: reset,
    clearOverride: clearOverride,
    buildSpecs: buildSpecs,
    buildRecapSpecs: buildRecapSpecs,
    parseWorkbook: parseWorkbook,
    toSheets: toSheets
  };
  global.GM_IP_MASTER = load();
})(window);
})(); } catch (e) { __ds_ns.__errors.push({ path: "proposals/investment-process/ip-master-gm.js", error: String((e && e.message) || e) }); }

// proposals/investment-process/ip-master-lfgz-defaults.js
try { (() => {
/* AUTO-GENERATED from Master File PM - LFG+Zest.xlsx (Q1 2026). Do not hand-edit;
   regenerate from the workbook. Consumed by ip-master-data.js (LFGZ profile). */
window.LFGZ_DEFAULTS = {
  "asOf": "Q1 2026",
  "strategies": ["Defensive", "Income", "Balanced", "Dynamic"],
  "currencies": ["USD", "EUR", "CHF"],
  "classes": ["Cash", "Equity", "Fixed Income", "Alternatives", "Commodities"],
  "ccyExposure": ["USD", "EUR", "CHF", "Others"],
  "alloc": {
    "Defensive|USD": [14.3, 0, 85.8, 0, 0],
    "Income|USD": [6.8, 25, 55, 7.3, 6],
    "Balanced|USD": [4.5, 43.5, 36.8, 9.3, 6],
    "Dynamic|USD": [0.8, 63.5, 17.5, 12.3, 6],
    "Defensive|EUR": [17, 0, 83, 0, 0],
    "Income|EUR": [4.5, 25.5, 57, 7, 6],
    "Balanced|EUR": [3.3, 45, 36.8, 9, 6],
    "Dynamic|EUR": [0.6, 64.7, 17.3, 11.5, 6],
    "Defensive|CHF": [17.5, 0, 82.5, 0, 0],
    "Income|CHF": [3.9, 24.5, 58.9, 6.8, 6],
    "Balanced|CHF": [2.5, 44.3, 38.5, 8.8, 6],
    "Dynamic|CHF": [2.5, 65, 11, 18, 2.8]
  },
  "ccy": {
    "Defensive|USD": [100, 0, 52, 45],
    "Defensive|EUR": [4, 0, 0, 0],
    "Defensive|CHF": [5, 0, 80, 0],
    "Income|USD": [89, 0, 0, 8],
    "Income|EUR": [7, 0, 0, 9.5],
    "Income|CHF": [5, 0, 71, 9],
    "Balanced|USD": [87, 0, 0, 9],
    "Balanced|EUR": [7, 0, 0, 13],
    "Balanced|CHF": [5, 0, 68, 12],
    "Dynamic|USD": [84, 0, 0, 11],
    "Dynamic|EUR": [10, 0, 0, 15],
    "Dynamic|CHF": [11.5, 0, 71, 10]
  },
  "range": {
    "Defensive|USD": [{
      "min": 0,
      "max": 100,
      "bck": 15
    }, {
      "min": 0,
      "max": 0,
      "bck": 0
    }, {
      "min": 0,
      "max": 100,
      "bck": 85
    }, {
      "min": 0,
      "max": 10,
      "bck": 0
    }, {
      "min": 0,
      "max": 5,
      "bck": 0
    }],
    "Income|USD": [{
      "min": 0,
      "max": 90,
      "bck": 5.5
    }, {
      "min": 0,
      "max": 30,
      "bck": 25
    }, {
      "min": 0,
      "max": 90,
      "bck": 52
    }, {
      "min": 0,
      "max": 30,
      "bck": 15
    }, {
      "min": 0,
      "max": 10,
      "bck": 2.5
    }],
    "Balanced|USD": [{
      "min": 0,
      "max": 70,
      "bck": 2.5
    }, {
      "min": 0,
      "max": 60,
      "bck": 45
    }, {
      "min": 0,
      "max": 70,
      "bck": 35
    }, {
      "min": 0,
      "max": 30,
      "bck": 15
    }, {
      "min": 0,
      "max": 15,
      "bck": 2
    }],
    "Dynamic|USD": [{
      "min": 0,
      "max": 60,
      "bck": 1.5
    }, {
      "min": 0,
      "max": 100,
      "bck": 65
    }, {
      "min": 0,
      "max": 60,
      "bck": 11
    }, {
      "min": 0,
      "max": 30,
      "bck": 20
    }, {
      "min": 0,
      "max": 15,
      "bck": 2.5
    }],
    "Defensive|EUR": [{
      "min": 0,
      "max": 100,
      "bck": 15
    }, {
      "min": 0,
      "max": 0,
      "bck": 0
    }, {
      "min": 0,
      "max": 100,
      "bck": 85
    }, {
      "min": 0,
      "max": 10,
      "bck": 0
    }, {
      "min": 0,
      "max": 5,
      "bck": 0
    }],
    "Income|EUR": [{
      "min": 0,
      "max": 90,
      "bck": 5.5
    }, {
      "min": 0,
      "max": 30,
      "bck": 25
    }, {
      "min": 0,
      "max": 90,
      "bck": 52
    }, {
      "min": 0,
      "max": 30,
      "bck": 15
    }, {
      "min": 0,
      "max": 10,
      "bck": 2.5
    }],
    "Balanced|EUR": [{
      "min": 0,
      "max": 70,
      "bck": 2.5
    }, {
      "min": 0,
      "max": 60,
      "bck": 45
    }, {
      "min": 0,
      "max": 70,
      "bck": 35
    }, {
      "min": 0,
      "max": 30,
      "bck": 15
    }, {
      "min": 0,
      "max": 15,
      "bck": 2.5
    }],
    "Dynamic|EUR": [{
      "min": 0,
      "max": 60,
      "bck": 2
    }, {
      "min": 0,
      "max": 100,
      "bck": 65
    }, {
      "min": 0,
      "max": 60,
      "bck": 10.5
    }, {
      "min": 0,
      "max": 30,
      "bck": 20
    }, {
      "min": 0,
      "max": 15,
      "bck": 2.5
    }],
    "Defensive|CHF": [{
      "min": 0,
      "max": 100,
      "bck": 15
    }, {
      "min": 0,
      "max": 0,
      "bck": 0
    }, {
      "min": 0,
      "max": 100,
      "bck": 85
    }, {
      "min": 0,
      "max": 10,
      "bck": 0
    }, {
      "min": 0,
      "max": 5,
      "bck": 0
    }],
    "Income|CHF": [{
      "min": 0,
      "max": 90,
      "bck": 5.5
    }, {
      "min": 0,
      "max": 30,
      "bck": 25
    }, {
      "min": 0,
      "max": 90,
      "bck": 52
    }, {
      "min": 0,
      "max": 30,
      "bck": 15
    }, {
      "min": 0,
      "max": 10,
      "bck": 2.5
    }],
    "Balanced|CHF": [{
      "min": 0,
      "max": 70,
      "bck": 2.5
    }, {
      "min": 0,
      "max": 60,
      "bck": 45
    }, {
      "min": 0,
      "max": 70,
      "bck": 35
    }, {
      "min": 0,
      "max": 30,
      "bck": 15
    }, {
      "min": 0,
      "max": 15,
      "bck": 2.5
    }],
    "Dynamic|CHF": [{
      "min": 0,
      "max": 60,
      "bck": 2.5
    }, {
      "min": 0,
      "max": 100,
      "bck": 65
    }, {
      "min": 0,
      "max": 60,
      "bck": 11.5
    }, {
      "min": 0,
      "max": 30,
      "bck": 18.5
    }, {
      "min": 0,
      "max": 15,
      "bck": 2.5
    }]
  },
  "perf": {
    "USD|Defensive": {
      "years": ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "Q1'26"],
      "annual": [0, 8, -1.5, 8.9, 4.4, -0.2, -6.1, 4.9, 2.6, 6.1, -0.2],
      "cum": [100, 107.96, 106.3, 115.76, 120.9, 120.67, 113.36, 118.96, 122.01, 129.46, 129.17]
    },
    "USD|Income": {
      "years": ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "Q1'26"],
      "annual": [0, 12.8, -5.7, 12.7, 8.6, 9.6, -10.8, 7.6, 7.4, 9.7, -0.7],
      "cum": [100, 112.82, 106.36, 119.82, 130.15, 142.69, 127.27, 136.98, 147.06, 161.39, 160.3]
    },
    "USD|Balanced": {
      "years": ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "Q1'26"],
      "annual": [0, 15.6, -8.1, 15.3, 10.7, 13.1, -12.8, 9.7, 9.2, 11.5, -1.4],
      "cum": [100, 115.62, 106.28, 122.51, 135.65, 153.39, 133.73, 146.69, 160.12, 178.47, 176.05]
    },
    "USD|Dynamic": {
      "years": ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "Q1'26"],
      "annual": [0, 18.7, -10.7, 18.7, 13.6, 16.9, -15.9, 12.6, 14.1, 13.6, -1.9],
      "cum": [100, 118.65, 105.95, 125.76, 142.9, 167.03, 140.49, 158.15, 160.33, 182.17, 178.67]
    },
    "EUR|Defensive": {
      "years": ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "Q1'26"],
      "annual": [0, 4.3, -1.8, 4.6, 1.1, 1, -7, 5.3, 1.2, 2.4, -1.1],
      "cum": [100, 104.32, 102.43, 107.12, 108.3, 109.37, 101.74, 107.12, 108.35, 110.95, 109.72]
    },
    "EUR|Income": {
      "years": ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "Q1'26"],
      "annual": [0, 8.3, -5.8, 9, 3.6, 11.1, -11.4, 5.7, 7.4, 4.4, -0.6],
      "cum": [100, 108.32, 102, 111.21, 115.2, 128.02, 113.48, 119.92, 128.8, 134.51, 133.71]
    },
    "EUR|Balanced": {
      "years": ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "Q1'26"],
      "annual": [0, 11.5, -8, 11.6, 4.4, 14.4, -12.3, 6.9, 8.5, 6.3, -0.7],
      "cum": [100, 111.51, 102.62, 114.54, 119.54, 136.71, 119.95, 128.24, 139.18, 147.97, 146.95]
    },
    "EUR|Dynamic": {
      "years": ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "Q1'26"],
      "annual": [0, 13.7, -10.4, 14.3, 5.9, 17.8, -14, 8, 13.2, 8.5, -1.2],
      "cum": [100, 113.72, 101.94, 116.48, 123.38, 145.38, 125.01, 135.04, 141.53, 153.6, 151.71]
    },
    "CHF|Defensive": {
      "years": ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "Q1'26"],
      "annual": [0, 4.3, -2.1, 2.7, 0, 0.1, -6.4, 3.5, 3.3, 0.4, -0.8],
      "cum": [100, 104.27, 102.1, 104.89, 104.88, 105, 98.23, 101.66, 105.01, 105.44, 104.64]
    },
    "CHF|Income": {
      "years": ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "Q1'26"],
      "annual": [0, 11, -6.9, 8.4, 2.5, 10, -11.5, 3.8, 8.2, 3.3, -0.9],
      "cum": [100, 111.04, 103.4, 112.06, 114.81, 126.24, 111.76, 116.03, 125.49, 129.63, 128.48]
    },
    "CHF|Balanced": {
      "years": ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "Q1'26"],
      "annual": [0, 15.1, -9.3, 11.8, 3.3, 12.7, -12.9, 4.3, 8.6, 5.3, -1.3],
      "cum": [100, 115.11, 104.42, 116.73, 120.52, 135.78, 118.2, 123.32, 133.88, 141.03, 139.25]
    },
    "CHF|Dynamic": {
      "years": ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "Q1'26"],
      "annual": [0, 19.7, -11.7, 15.4, 4.7, 15.7, -13.9, 4.6, 10.4, 7.6, -1.9],
      "cum": [100, 119.74, 105.71, 121.93, 127.66, 147.71, 127.1, 132.99, 146.82, 157.97, 155.02]
    }
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "proposals/investment-process/ip-master-lfgz-defaults.js", error: String((e && e.message) || e) }); }

// proposals/investment-process/ip-master-lfgz.js
try { (() => {
/* ============================================================================
   LFG+Zest Investment Process — MASTER DATA layer (LFGZ profile)
   ----------------------------------------------------------------------------
   Parallel to LFAMaster, but richer: every dataset is keyed by
   STRATEGY × CURRENCY (4 mandates × 3 ccy), and performance has a full
   track record per mandate AND per currency.

   Mandates:   Defensive · Income · Balanced · Dynamic
   Currencies: USD · EUR · CHF
   Classes:    Cash · Equity · Fixed Income · Alternatives · Commodities

   Data shape (all weights %, perf cumulative rebased to 100):
     alloc: { 'Balanced|USD': [5 class weights] }
     ccy:   { 'Balanced|USD': [USD,EUR,CHF,Others] }
     range: { 'Balanced|USD': [{min,max,bck}×5] }
     perf:  { 'USD|Balanced': {years,annual,cum} }     // note CCY|Strategy

   Defaults come from ip-master-lfgz-defaults.js (window.LFGZ_DEFAULTS),
   auto-generated from "Master File PM - LFG+Zest.xlsx".
   ============================================================================ */
(function (global) {
  'use strict';

  var KEY = 'LFGZ_IP_MASTER_v1';
  var ACCENT = '#83021A'; // LFG+Zest brand red (matches the 'lfg-zest' chart theme)

  function fallbackDefault() {
    return {
      asOf: 'Q1 2026',
      strategies: ['Defensive', 'Income', 'Balanced', 'Dynamic'],
      currencies: ['USD', 'EUR', 'CHF'],
      classes: ['Cash', 'Equity', 'Fixed Income', 'Alternatives', 'Commodities'],
      ccyExposure: ['USD', 'EUR', 'CHF', 'Others'],
      alloc: {},
      ccy: {},
      range: {},
      perf: {}
    };
  }
  function DEFAULT() {
    return global.LFGZ_DEFAULTS ? global.LFGZ_DEFAULTS : fallbackDefault();
  }
  function clone(o) {
    return JSON.parse(JSON.stringify(o));
  }
  function withColors(d) {
    if (d && !d.colors) d.colors = {
      ccy: {
        USD: '#83021A',
        EUR: '#B0852F',
        CHF: '#3E6E66'
      },
      cat: ['#83021A', '#B0852F', '#5A626B', '#3E6E66']
    };
    return d;
  }
  function load() {
    try {
      var raw = global.localStorage.getItem(KEY);
      if (raw) return withColors(JSON.parse(raw));
    } catch (e) {}
    return withColors(clone(DEFAULT()));
  }
  function save(data) {
    try {
      global.localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {}
    global.LFGZ_IP_MASTER = data;
    try {
      global.dispatchEvent(new CustomEvent('lfgz-master-updated', {
        detail: data
      }));
    } catch (e) {}
    return data;
  }
  function reset() {
    try {
      global.localStorage.removeItem(KEY);
    } catch (e) {}
    return withColors(clone(DEFAULT()));
  }
  function clearOverride(id) {
    try {
      global.localStorage.removeItem('lfa-chart:' + id);
    } catch (e) {}
  }

  // --- Build the 4 preview chart specs for the selected strategy × currency --
  // chart-ids are fixed; the Data Master / a future deck point <lfa-chart> at them.
  function buildSpecs(D, sel) {
    D = D || load();
    sel = sel || {};
    var strat = sel.strategy || D.strategies[0];
    var ccy = sel.ccy || D.currencies[0];
    var reg = {};
    var pts = function (xs, ys) {
      return xs.map(function (x, i) {
        return {
          x: x,
          y: ys[i]
        };
      });
    };
    var key = strat + '|' + ccy;
    var CL = D.colors || {};
    var ccol = CL.ccy || {};
    var cat = CL.cat || [];
    var mcol = cat[D.strategies.indexOf(strat)] || ACCENT;
    var alloc = D.alloc && D.alloc[key] || D.classes.map(function () {
      return 0;
    });
    reg['lfgz-alloc'] = {
      type: 'barh',
      meta: {
        title: '',
        xLabel: '%'
      },
      series: [{
        name: strat + ' · ' + ccy,
        points: pts(D.classes, alloc),
        color: mcol
      }]
    };
    var cc = D.ccy && D.ccy[key] || D.ccyExposure.map(function () {
      return 0;
    });
    reg['lfgz-ccy'] = {
      type: 'barh',
      meta: {
        title: '',
        xLabel: '%'
      },
      series: [{
        name: strat + ' · ' + ccy,
        points: pts(D.ccyExposure, cc),
        color: mcol
      }]
    };
    var r = D.range && D.range[key] || D.classes.map(function () {
      return {
        min: 0,
        max: 0,
        bck: 0
      };
    });
    reg['lfgz-range'] = {
      type: 'rangebar',
      meta: {
        title: '',
        xLabel: '',
        yLabel: '',
        hideLegend: true
      },
      series: [{
        name: 'Min',
        points: pts(D.classes, r.map(function (a) {
          return a.min;
        })),
        color: ACCENT
      }, {
        name: 'Max',
        points: pts(D.classes, r.map(function (a) {
          return a.max;
        }))
      }, {
        name: 'Benchmark',
        points: pts(D.classes, r.map(function (a) {
          return a.bck;
        })),
        color: ACCENT
      }]
    };

    // Performance: linked two-panel chart with 3 currency series for the
    // selected mandate (like LFA) — 3 cumulative lines + 3 annual bars.
    var dAnn = function (cum) {
      return (cum || []).map(function (c, i) {
        return i === 0 ? 0 : Math.round((c / cum[i - 1] - 1) * 1000) / 10;
      });
    };
    var pu = D.perf && D.perf['USD|' + strat] || {
      years: [],
      cum: []
    };
    var pe = D.perf && D.perf['EUR|' + strat] || {
      cum: []
    };
    var pf = D.perf && D.perf['CHF|' + strat] || {
      cum: []
    };
    var yrs = pu.years || [];
    reg['lfgz-perf'] = {
      type: 'perfstackmulti',
      meta: {
        title: '',
        yLabel: 'Annual %',
        y2Label: 'Index',
        nCcy: 3
      },
      series: [{
        name: 'USD',
        points: pts(yrs, pu.cum || []),
        color: ccol.USD
      }, {
        name: 'EUR',
        points: pts(yrs, pe.cum || []),
        color: ccol.EUR
      }, {
        name: 'CHF',
        points: pts(yrs, pf.cum || []),
        color: ccol.CHF
      }, {
        name: 'USD',
        points: pts(yrs, dAnn(pu.cum)),
        color: ccol.USD
      }, {
        name: 'EUR',
        points: pts(yrs, dAnn(pe.cum)),
        color: ccol.EUR
      }, {
        name: 'CHF',
        points: pts(yrs, dAnn(pf.cum)),
        color: ccol.CHF
      }]
    };
    return reg;
  }

  // --- Deck specs: one set of charts per mandate, for the Investment Process
  // deck (LFG+Zest edition). base currency defaults to USD. chart-ids:
  //   lfgz-dk-bench-<i>  rangebar (min/max + SAA), base ccy, per mandate
  //   lfgz-dk-alloc-<i>  barh asset allocation, base ccy, per mandate
  //   lfgz-dk-ccy-<i>    barh currency exposure, base ccy, per mandate
  //   lfgz-dk-perf-<i>   perfstackmulti (USD/EUR/CHF), per mandate
  function buildDeckSpecs(D, baseCcy) {
    D = D || load();
    var base = baseCcy || D.currencies[0] || 'USD';
    var reg = {};
    var pts = function (xs, ys) {
      return xs.map(function (x, i) {
        return {
          x: x,
          y: ys[i]
        };
      });
    };
    var dAnn = function (cum) {
      return (cum || []).map(function (c, i) {
        return i === 0 ? 0 : Math.round((c / cum[i - 1] - 1) * 1000) / 10;
      });
    };
    var CL = D.colors || {};
    var ccol = CL.ccy || {};
    var cat = CL.cat || [];
    D.strategies.forEach(function (m, i) {
      var key = m + '|' + base,
        mcol = cat[i] || ACCENT;
      var r = D.range && D.range[key] || D.classes.map(function () {
        return {
          min: 0,
          max: 0,
          bck: 0
        };
      });
      reg['lfgz-dk-bench-' + i] = {
        type: 'rangebar',
        meta: {
          title: '',
          hideLegend: true
        },
        series: [{
          name: 'Min',
          points: pts(D.classes, r.map(function (a) {
            return a.min;
          }))
        }, {
          name: 'Max',
          points: pts(D.classes, r.map(function (a) {
            return a.max;
          }))
        }, {
          name: 'Benchmark',
          points: pts(D.classes, r.map(function (a) {
            return a.bck;
          }))
        }]
      };
      var alloc = D.alloc && D.alloc[key] || D.classes.map(function () {
        return 0;
      });
      reg['lfgz-dk-alloc-' + i] = {
        type: 'barh',
        meta: {
          title: '',
          xLabel: '%'
        },
        series: [{
          name: m,
          points: pts(D.classes, alloc),
          color: mcol
        }]
      };
      var cc = D.ccy && D.ccy[key] || D.ccyExposure.map(function () {
        return 0;
      });
      reg['lfgz-dk-ccy-' + i] = {
        type: 'barh',
        meta: {
          title: '',
          xLabel: '%'
        },
        series: [{
          name: m,
          points: pts(D.ccyExposure, cc),
          color: mcol
        }]
      };
      var ccys = D.currencies || ['USD'];
      var y0 = D.perf && D.perf[ccys[0] + '|' + m] || {
        years: []
      };
      var yrs = y0.years || [];
      var lines = ccys.map(function (c) {
        var p = D.perf && D.perf[c + '|' + m] || {
          cum: []
        };
        return {
          name: c,
          points: pts(yrs, p.cum || []),
          color: ccol[c]
        };
      });
      var bars = ccys.map(function (c) {
        var p = D.perf && D.perf[c + '|' + m] || {
          cum: []
        };
        return {
          name: c,
          points: pts(yrs, dAnn(p.cum)),
          color: ccol[c]
        };
      });
      reg['lfgz-dk-perf-' + i] = {
        type: 'perfstackmulti',
        meta: {
          title: '',
          yLabel: 'Annual %',
          y2Label: 'Index',
          nCcy: ccys.length
        },
        series: lines.concat(bars)
      };
    });
    return reg;
  }

  // --- Combined "recap" specs for pitch decks: TWO compared mandates, one
  // selected currency. Colours come from the 'lfg-zest' theme palette.
  function buildRecapSpecs(D, ccy, pair) {
    D = D || load();
    ccy = ccy || D.currencies[0];
    pair = pair && pair.length ? pair : D.strategies.slice(0, 2);
    var reg = {};
    var pts = function (xs, ys) {
      return xs.map(function (x, i) {
        return {
          x: x,
          y: ys[i]
        };
      });
    };
    var CL = D.colors || {};
    var ccol = CL.ccy || {};
    var cat = CL.cat || [];
    var mcolOf = function (st) {
      return cat[D.strategies.indexOf(st)];
    };
    // Benchmark: one rangebar per compared mandate (small multiples)
    pair.forEach(function (st, i) {
      var r = D.range && D.range[st + '|' + ccy] || D.classes.map(function () {
        return {
          min: 0,
          max: 0,
          bck: 0
        };
      });
      reg['lfgz-rc-bench-' + i] = {
        type: 'rangebar',
        meta: {
          title: '',
          hideLegend: true
        },
        series: [{
          name: 'Min',
          points: pts(D.classes, r.map(function (a) {
            return a.min;
          }))
        }, {
          name: 'Max',
          points: pts(D.classes, r.map(function (a) {
            return a.max;
          }))
        }, {
          name: 'Benchmark',
          points: pts(D.classes, r.map(function (a) {
            return a.bck;
          }))
        }]
      };
    });
    // Asset allocation: grouped vertical bar, classes on x, the two mandates as series
    reg['lfgz-rc-alloc'] = {
      type: 'groupbar',
      meta: {
        title: '',
        yLabel: '%'
      },
      series: pair.map(function (st) {
        var v = D.alloc && D.alloc[st + '|' + ccy] || D.classes.map(function () {
          return 0;
        });
        return {
          name: st,
          points: pts(D.classes, v),
          color: mcolOf(st)
        };
      })
    };
    // Currency allocation: grouped horizontal bar, exposures on axis, mandates as series
    reg['lfgz-rc-ccy'] = {
      type: 'barh',
      meta: {
        title: '',
        xLabel: '%'
      },
      series: pair.map(function (st) {
        var v = D.ccy && D.ccy[st + '|' + ccy] || D.ccyExposure.map(function () {
          return 0;
        });
        return {
          name: st,
          points: pts(D.ccyExposure, v),
          color: mcolOf(st)
        };
      })
    };
    // Performance: one linked multi-currency chart per compared mandate (same as detail view)
    var dAnn = function (cum) {
      return (cum || []).map(function (c, i) {
        return i === 0 ? 0 : Math.round((c / cum[i - 1] - 1) * 1000) / 10;
      });
    };
    pair.forEach(function (st, i) {
      var pu = D.perf && D.perf['USD|' + st] || {
        years: [],
        cum: []
      };
      var pe = D.perf && D.perf['EUR|' + st] || {
        cum: []
      };
      var pf = D.perf && D.perf['CHF|' + st] || {
        cum: []
      };
      var yrs = pu.years || [];
      reg['lfgz-rc-perf-' + i] = {
        type: 'perfstackmulti',
        meta: {
          title: '',
          yLabel: 'Annual %',
          y2Label: 'Index',
          nCcy: 3
        },
        series: [{
          name: 'USD',
          points: pts(yrs, pu.cum || []),
          color: ccol.USD
        }, {
          name: 'EUR',
          points: pts(yrs, pe.cum || []),
          color: ccol.EUR
        }, {
          name: 'CHF',
          points: pts(yrs, pf.cum || []),
          color: ccol.CHF
        }, {
          name: 'USD',
          points: pts(yrs, dAnn(pu.cum)),
          color: ccol.USD
        }, {
          name: 'EUR',
          points: pts(yrs, dAnn(pe.cum)),
          color: ccol.EUR
        }, {
          name: 'CHF',
          points: pts(yrs, dAnn(pf.cum)),
          color: ccol.CHF
        }]
      };
    });
    return reg;
  }

  // --- Import: parse the "Master File PM - LFG+Zest.xlsx" (SheetJS AOAs) ------
  // sheets = { 'Asset Allocation':aoa, 'Currency Allocation':aoa, 'Benchmark':aoa,
  //            'Performance by Ccy':aoa }  (aoa = array of rows, each an array)
  function parseWorkbook(sheets) {
    var out = {},
      got = [];
    var STRAT = ['Defensive', 'Income', 'Balanced', 'Dynamic'];
    var CCY = ['USD', 'EUR', 'CHF'];
    var classes = ['Cash', 'Equity', 'Fixed Income', 'Alternatives', 'Commodities'];
    var pct = function (v) {
      var n = parseFloat(v);
      return isNaN(n) ? 0 : Math.round(n * 1000) / 10;
    };
    var idx = function (v) {
      var n = parseFloat(v);
      return isNaN(n) ? null : Math.round(n * 100) / 100;
    };
    var norm = function (s) {
      return String(s == null ? '' : s).trim();
    };
    var asset = function (s) {
      s = norm(s).toLowerCase();
      if (!s) return null;
      if (s[0] === 'c' && s.indexOf('comm') < 0) return 'Cash';
      if (s.indexOf('equ') === 0) return 'Equity';
      if (s.indexOf('fix') === 0) return 'Fixed Income';
      if (s.indexOf('alt') === 0) return 'Alternatives';
      if (s.indexOf('com') === 0) return 'Commodities';
      return null;
    };
    var pick = function (name) {
      var keys = Object.keys(sheets);
      for (var i = 0; i < keys.length; i++) {
        if (keys[i].toLowerCase().indexOf(name) >= 0) return sheets[keys[i]];
      }
      return null;
    };

    // Asset Allocation: A=mandate B=ccy C=asset D=value(fraction)
    var aa = pick('asset alloc');
    if (aa) {
      var alloc = {};
      for (var i = 1; i < aa.length; i++) {
        var row = aa[i] || [];
        var m = norm(row[0]),
          c = norm(row[1]),
          a = asset(row[2]);
        if (STRAT.indexOf(m) < 0 || CCY.indexOf(c) < 0 || !a) continue;
        (alloc[m + '|' + c] = alloc[m + '|' + c] || [0, 0, 0, 0, 0])[classes.indexOf(a)] = pct(row[3]);
      }
      if (Object.keys(alloc).length) {
        out.alloc = alloc;
        got.push('asset allocation');
      }
    }
    // Currency Allocation: A=mandate B=baseccy C=exposure D=value
    var ca = pick('currency alloc');
    if (ca) {
      var exp = ['USD', 'EUR', 'CHF', 'Others'],
        ccy = {};
      for (var j = 1; j < ca.length; j++) {
        var r2 = ca[j] || [];
        var m2 = norm(r2[0]),
          c2 = norm(r2[1]),
          e2 = norm(r2[2]);
        if (STRAT.indexOf(m2) < 0 || CCY.indexOf(c2) < 0 || exp.indexOf(e2) < 0) continue;
        (ccy[m2 + '|' + c2] = ccy[m2 + '|' + c2] || [0, 0, 0, 0])[exp.indexOf(e2)] = pct(r2[3]);
      }
      if (Object.keys(ccy).length) {
        out.ccy = ccy;
        got.push('currency allocation');
      }
    }
    // Benchmark: A=mandate C=ccy D=asset E=min F=max G=bck
    var bm = pick('benchmark');
    if (bm) {
      var range = {};
      for (var k = 1; k < bm.length; k++) {
        var r3 = bm[k] || [];
        var m3 = norm(r3[0]),
          c3 = norm(r3[2]),
          a3 = asset(r3[3]);
        if (STRAT.indexOf(m3) < 0 || CCY.indexOf(c3) < 0 || !a3) continue;
        var arr = range[m3 + '|' + c3] = range[m3 + '|' + c3] || classes.map(function () {
          return {
            min: 0,
            max: 0,
            bck: 0
          };
        });
        arr[classes.indexOf(a3)] = {
          min: pct(r3[4]),
          max: pct(r3[5]),
          bck: pct(r3[6])
        };
      }
      if (Object.keys(range).length) {
        out.range = range;
        got.push('benchmark ranges');
      }
    }
    // Performance by Ccy: three blocks with spacer cols (USD A.., EUR K.., CHF U..)
    var pf = pick('performance by ccy') || pick('performance by') || pick('performance');
    if (pf) {
      var blocks = {
        USD: {
          year: 0,
          base: 1
        },
        EUR: {
          year: 10,
          base: 11
        },
        CHF: {
          year: 20,
          base: 21
        }
      };
      var perf = {};
      CCY.forEach(function (c) {
        var b = blocks[c];
        STRAT.forEach(function (st, mi) {
          var aCol = b.base + mi * 2,
            cCol = aCol + 1,
            years = [],
            annual = [],
            cum = [];
          for (var rr = 2; rr < pf.length; rr++) {
            var row = pf[rr] || [];
            var y = row[b.year];
            if (y == null || y === '') continue;
            y = norm(y);
            if (/q1?\s*26/i.test(y)) y = "Q1'26";
            if (!/^\d/.test(y)) continue;
            if (row[aCol] == null && row[cCol] == null) continue;
            years.push(y);
            annual.push(pct(row[aCol]));
            cum.push(idx(row[cCol]));
          }
          if (years.length) perf[c + '|' + st] = {
            years: years,
            annual: annual,
            cum: cum
          };
        });
      });
      if (Object.keys(perf).length) {
        out.perf = perf;
        got.push('performance (per currency)');
      }
    }
    out.__got = got;
    return out;
  }

  // --- Export to long-format sheets (for SheetJS) ----------------------------
  function toSheets(D) {
    D = D || load();
    var aa = [['Mandate', 'CCy', 'Asset Class', 'Weight']];
    D.strategies.forEach(function (s) {
      D.currencies.forEach(function (c) {
        var v = D.alloc[s + '|' + c] || [];
        D.classes.forEach(function (cl, i) {
          aa.push([s, c, cl, (v[i] || 0) / 100]);
        });
      });
    });
    var ca = [['Mandate', 'CCY', 'Exposure', 'Weight']];
    D.strategies.forEach(function (s) {
      D.currencies.forEach(function (c) {
        var v = D.ccy[s + '|' + c] || [];
        D.ccyExposure.forEach(function (e, i) {
          ca.push([s, c, e, (v[i] || 0) / 100]);
        });
      });
    });
    var bm = [['Mandate', 'd', 'CCY', 'Categorie', 'MIN', 'MAX', 'BCK']];
    D.strategies.forEach(function (s) {
      D.currencies.forEach(function (c) {
        var v = D.range[s + '|' + c] || [];
        D.classes.forEach(function (cl, i) {
          var a = v[i] || {
            min: 0,
            max: 0,
            bck: 0
          };
          bm.push([s, '', c, cl, a.min / 100, a.max / 100, a.bck / 100]);
        });
      });
    });
    var pf = [['Mandate', 'CCY', 'Year', 'Annual', 'Cumulative']];
    D.currencies.forEach(function (c) {
      D.strategies.forEach(function (s) {
        var p = D.perf[c + '|' + s] || {
          years: []
        };
        (p.years || []).forEach(function (y, i) {
          pf.push([s, c, y, (p.annual[i] || 0) / 100, p.cum[i]]);
        });
      });
    });
    return {
      'Asset Allocation': aa,
      'Currency Allocation': ca,
      'Benchmark': bm,
      'Performance by Ccy': pf
    };
  }
  global.LFGZMaster = {
    KEY: KEY,
    ACCENT: ACCENT,
    clone: clone,
    get DEFAULT() {
      return DEFAULT();
    },
    load: load,
    save: save,
    reset: reset,
    clearOverride: clearOverride,
    buildSpecs: buildSpecs,
    buildDeckSpecs: buildDeckSpecs,
    buildRecapSpecs: buildRecapSpecs,
    parseWorkbook: parseWorkbook,
    toSheets: toSheets
  };
  global.LFGZ_IP_MASTER = load();
})(window);
})(); } catch (e) { __ds_ns.__errors.push({ path: "proposals/investment-process/ip-master-lfgz.js", error: String((e && e.message) || e) }); }

// ui_kits/website/About.jsx
try { (() => {
// LFA — About / Why LFA: castle hero, differentiators, values triad.
function About() {
  const {
    SectionHeading,
    FeatureCard,
    Eyebrow
  } = window.LFADesignSystem_f7f6ac;
  const {
    Icon,
    Container
  } = window;
  const diff = [{
    icon: 'landmark',
    title: 'SEC Registered',
    body: 'Authorized to provide advisory services to U.S. clients.'
  }, {
    icon: 'shield-check',
    title: 'FINMA Regulated',
    body: 'Recognized as a regulated Swiss asset manager.'
  }, {
    icon: 'network',
    title: 'Global Network',
    body: 'Connected to Swiss banks, international law firms, and estate-planning partners.'
  }, {
    icon: 'handshake',
    title: 'Client-First Focus',
    body: 'Long-term relationships built on trust, discretion, and aligned financial goals.'
  }];
  const values = [['Accountability', 'We own our advice and our outcomes — transparently, and over the long term.'], ['Respect', 'High regard for personal privacy, confidentiality, and each client\u2019s unique goals.'], ['Courage', 'Prudence and care, with the conviction to act on long-term investment opportunities.']];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      height: '320px',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/img-bellinzona-castle.png",
    alt: "Bellinzona castle",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(90deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 80%)'
    }
  }), /*#__PURE__*/React.createElement(Container, {
    style: {
      position: 'relative',
      height: '100%',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-serif)',
      fontStyle: 'italic',
      fontWeight: 500,
      fontSize: '48px',
      color: 'var(--lfa-navy)'
    }
  }, "About Us"))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '88px 0'
    }
  }, /*#__PURE__*/React.createElement(Container, {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '56px',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    title: "Swiss Wealth Management for U.S. Investors",
    lead: "LFA is a fee-based Swiss wealth management firm focused on serving U.S. investors who want to expand part of their portfolio beyond U.S. markets and currency. We deliver custom investment strategies, global diversification options, and tax-aware planning designed to protect and grow wealth in an international context."
  }), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/img-swiss-alps-lake.png",
    alt: "Swiss Alps and lake",
    style: {
      width: '100%',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-md)'
    }
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--lfa-paper)',
      padding: '96px 0',
      borderTop: '1px solid var(--lfa-line)'
    }
  }, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: '56px'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    align: "center",
    title: "What Makes LFA Different From Other Wealth Management Firms?",
    lead: "As an independent Swiss investment advisor with dual registration in the United States and Switzerland, LFA combines localized expertise with deep international insight."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '36px'
    }
  }, diff.map(d => /*#__PURE__*/React.createElement(FeatureCard, {
    key: d.title,
    align: "center",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: d.icon,
      size: 34
    }),
    title: d.title
  }, d.body))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '96px 0'
    }
  }, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: '48px'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Our Values")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '48px'
    }
  }, values.map(([t, body], i) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      textAlign: 'center',
      paddingTop: '28px',
      borderTop: '2px solid var(--lfa-rose)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontStyle: 'italic',
      fontSize: '30px',
      color: 'var(--lfa-navy)',
      marginBottom: '14px'
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 auto',
      font: 'var(--fw-regular) 16px/1.62 var(--font-sans)',
      color: 'var(--lfa-navy-500)',
      maxWidth: '32ch'
    }
  }, body)))))));
}
window.About = About;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/About.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Footer.jsx
try { (() => {
// LFA website — navy footer with the three Swiss offices.
function Footer() {
  const offices = [{
    city: 'ZURICH',
    lines: ['Talstrasse 65', '8001 Zurich, Switzerland', 'T. +41 43 497 22 83']
  }, {
    city: 'LUGANO',
    lines: ['Via F. Pelli 3', '6900 Lugano, Switzerland', 'T. +41 91 921 37 52']
  }, {
    city: 'SION',
    lines: ['25 Rue de Lausanne', '1950 Sion, Switzerland', 'T. +41 79 208 0284']
  }];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--lfa-navy-deep)',
      color: 'rgba(255,255,255,0.82)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container)',
      margin: '0 auto',
      padding: '64px 40px 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
      gap: '40px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontStyle: 'italic',
      fontSize: '34px',
      color: '#fff',
      lineHeight: 1
    }
  }, "LFA"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '10px',
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      marginTop: '10px',
      color: 'rgba(255,255,255,0.6)'
    }
  }, "Swiss Wealth Management", /*#__PURE__*/React.createElement("br", null), "for US Clients"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '13px',
      lineHeight: 1.6,
      marginTop: '20px',
      maxWidth: '30ch',
      color: 'rgba(255,255,255,0.6)'
    }
  }, "SEC-registered investment adviser \xB7 FINMA-licensed portfolio manager. Part of LFG Holding.")), offices.map(o => /*#__PURE__*/React.createElement("div", {
    key: o.city
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: '12px',
      letterSpacing: '0.14em',
      color: '#fff',
      marginBottom: '14px'
    }
  }, o.city), o.lines.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      fontSize: '13px',
      lineHeight: 1.7,
      color: 'rgba(255,255,255,0.7)'
    }
  }, l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid rgba(255,255,255,0.14)',
      marginTop: '48px',
      paddingTop: '22px',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
      fontSize: '12px',
      color: 'rgba(255,255,255,0.5)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 LFA \u2014 Lugano Financial Advisors SA. Private & confidential."), /*#__PURE__*/React.createElement("span", null, "info@lfa.ch \xB7 www.lfa.ch"))));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Home.jsx
try { (() => {
// LFA Home — hero, Swiss intro, facts & figures, Why-LFA grid.
function Home({
  go
}) {
  const {
    SectionHeading,
    Button,
    StatCard,
    FeatureCard,
    Eyebrow
  } = window.LFADesignSystem_f7f6ac;
  const {
    Icon,
    Container
  } = window;
  const reasons = [{
    icon: 'globe',
    title: 'International Asset Management',
    body: 'Access global markets through internationally diversified portfolios, managed from Switzerland.'
  }, {
    icon: 'shield-check',
    title: 'Regulated Fiduciary Oversight',
    body: 'Registered with the U.S. SEC and regulated by FINMA in Switzerland — dual oversight.'
  }, {
    icon: 'banknote',
    title: 'Exposure to a Stable Currency',
    body: 'Investments denominated in Swiss francs add currency diversification beyond the U.S. dollar.'
  }, {
    icon: 'users',
    title: 'Independent, Client-Aligned Advice',
    body: 'A fee-based, open-architecture advisory firm — free from product or third-party influence.'
  }, {
    icon: 'phone-call',
    title: 'High-Touch Relationship Service',
    body: 'A single point of contact, regular reporting, and direct access by video, phone, or in person.'
  }, {
    icon: 'file-text',
    title: 'Transparent, Fee-Based Compensation',
    body: 'An asset-based fee structure aligned with long-term stewardship, not transactions.'
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      minHeight: '560px',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/img-hero-zurich.png",
    alt: "Z\xFCrich at golden hour",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(90deg, rgba(255,250,245,0.92) 0%, rgba(255,250,245,0.7) 38%, rgba(255,250,245,0.15) 70%, rgba(255,250,245,0) 100%)'
    }
  }), /*#__PURE__*/React.createElement(Container, {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '560px'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-serif)',
      fontStyle: 'italic',
      fontWeight: 500,
      fontSize: 'clamp(38px, 5vw, 60px)',
      lineHeight: 1.08,
      letterSpacing: '-0.01em',
      color: 'var(--lfa-navy)'
    }
  }, "Your Swiss Guide to International Diversification"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: '24px',
      font: 'var(--fw-regular) 19px/1.6 var(--font-sans)',
      color: 'var(--lfa-navy-500)',
      maxWidth: '46ch'
    }
  }, "For U.S. investors seeking global investment strategies beyond domestic markets, LFA offers Swiss-based wealth management tailored to your goals and risk profile."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '32px'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "link",
    iconRight: "\u2192",
    onClick: () => go('what')
  }, "Get Started"))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '96px 0'
    }
  }, /*#__PURE__*/React.createElement(Container, {
    style: {
      display: 'grid',
      gridTemplateColumns: '0.8fr 1.2fr',
      gap: '64px',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/illustration-swiss-flag.png",
    alt: "Swiss flag",
    style: {
      width: '78%',
      maxWidth: '300px'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHeading, {
    title: "Swiss Wealth Management for U.S. Investors",
    lead: "LFA is part of LFG Holding, one of Switzerland's leading firms of independent asset managers, with over 50 investment professionals, approximately 700 clients, and more than USD 2.5 billion in assets under management."
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: '18px',
      font: 'var(--fw-regular) 17px/1.62 var(--font-sans)',
      color: 'var(--lfa-navy-500)',
      maxWidth: '56ch'
    }
  }, "We work exclusively with U.S. investors, subject to U.S. tax reporting, and provide Swiss-based wealth management that is structured for cross-border requirements.")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--lfa-paper)',
      padding: '72px 0',
      borderTop: '1px solid var(--lfa-line)',
      borderBottom: '1px solid var(--lfa-line)'
    }
  }, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(Eyebrow, null, "Facts & Figures"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '36px',
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '32px'
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    value: "2.5",
    suffix: "bn",
    label: "USD assets under management"
  }), /*#__PURE__*/React.createElement(StatCard, {
    value: "700",
    label: "Clients served",
    tone: "rose"
  }), /*#__PURE__*/React.createElement(StatCard, {
    value: "50",
    suffix: "+",
    label: "Investment professionals"
  }), /*#__PURE__*/React.createElement(StatCard, {
    value: "2009",
    label: "Founded \xB7 SEC-registered 2010"
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '96px 0'
    }
  }, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: '56px'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    align: "center",
    eyebrow: "Why LFA",
    title: "Why investors partner with LFA",
    lead: "Our structure, location, and investment philosophy are intentionally designed to support diversification, transparency, and long-term portfolio oversight."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '48px 40px'
    }
  }, reasons.map(r => /*#__PURE__*/React.createElement(FeatureCard, {
    key: r.title,
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: r.icon,
      size: 30
    }),
    title: r.title
  }, r.body))))));
}
window.Home = Home;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/WhatWeDo.jsx
try { (() => {
// LFA — What We Do: rose intro band + services selector with detail panel.
function WhatWeDo({
  go
}) {
  const {
    RoseSection,
    SectionHeading,
    MandateTabs,
    Button
  } = window.LFADesignSystem_f7f6ac;
  const {
    Container
  } = window;
  const [tab, setTab] = React.useState('Investment Management');
  const services = {
    'Investment Management': [['Portfolio Management Options', 'You choose how involved you want to be — hand off day-to-day decisions on a discretionary basis, or stay closely involved and approve every move.'], ['Personalized Investment Advice', 'Your portfolio is built around your situation — not a model — starting from a personalized investment policy statement.'], ['Sustainable Investment Strategies', 'Where it matters to you, LFA can incorporate sustainable and socially responsible investments into part or all of your portfolio.'], ['Swiss & European Exposure', 'Gain exposure to Swiss and European investments that broaden diversification beyond U.S. markets and the U.S. dollar.'], ['U.S. Tax Reporting Support', 'Clear, U.S.-compliant tax reporting so your global investments integrate smoothly with your annual filings.']],
    'International Wealth Planning': [['Cross-Border Structuring', 'Wealth planning designed around U.S. reporting requirements and your international footprint.'], ['Coordination With Your Advisors', 'We work alongside your U.S. advisor for a consolidated, no-overlaps global strategy.']],
    'Alternative Investments': [['Beyond Public Markets', 'Selective access to alternative assets that broaden diversification and complement core holdings.']],
    'Family Office Services': [['Holistic Oversight', 'Coordinated stewardship across banking, legal, and estate-planning partners.']],
    'Sports Division': [['Specialist Advisory', 'Dedicated guidance for professional athletes and the advisors around them.']],
    'Self-Directed IRAs': [['Swiss Management, U.S. Framework', 'Swiss-based portfolio management within a U.S.-compliant IRA structure.']]
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      height: '300px',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/img-market-analyst.png",
    alt: "Analyst reviewing markets",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center 30%'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 45%, rgba(255,255,255,0) 75%)'
    }
  }), /*#__PURE__*/React.createElement(Container, {
    style: {
      position: 'relative',
      height: '100%',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-serif)',
      fontStyle: 'italic',
      fontWeight: 500,
      fontSize: '48px',
      color: 'var(--lfa-navy)'
    }
  }, "What We Do"))), /*#__PURE__*/React.createElement(RoseSection, {
    padding: "80px"
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    tone: "white",
    title: "How can U.S. investors diversify beyond U.S. markets while staying consistent with U.S. tax and regulatory rules?",
    lead: "That question sits at the center of what LFA does. We work primarily with U.S. investors who want to expand internationally without adding unnecessary complexity."
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: '20px',
      maxWidth: '70ch',
      color: 'rgba(255,255,255,0.9)',
      font: 'var(--fw-regular) 16px/1.62 var(--font-sans)'
    }
  }, "Through Swiss-based investment management, global portfolio construction, and coordination with trusted international partners, LFA offers exposure to diversified strategies designed for U.S. citizens living in the U.S. or abroad.")), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '88px 0'
    }
  }, /*#__PURE__*/React.createElement(Container, {
    style: {
      display: 'grid',
      gridTemplateColumns: '260px 1fr',
      gap: '56px',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(MandateTabs, {
    items: Object.keys(services),
    value: tab,
    onChange: setTab
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '28px'
    }
  }, services[tab].map(([t, body]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'grid',
      gridTemplateColumns: '24px 1fr',
      gap: '14px',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--lfa-rose)',
      fontSize: '20px',
      fontWeight: 700,
      lineHeight: 1.2
    }
  }, "+"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: '0 0 6px',
      fontFamily: 'var(--font-sans)',
      fontSize: '14px',
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--lfa-navy)'
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--fw-regular) 16px/1.62 var(--font-sans)',
      color: 'var(--lfa-navy-500)',
      maxWidth: '62ch'
    }
  }, body)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '12px'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: () => go('why')
  }, "See why LFA"))))));
}
window.WhatWeDo = WhatWeDo;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/WhatWeDo.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/shared.jsx
try { (() => {
// Shared helpers for the LFA website UI kit.

// Lucide line-icon component (matches LFA's thin single-weight icon style).
function Icon({
  name,
  size = 24,
  color,
  strokeWidth = 1.6,
  style
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current || !window.lucide) return;
    ref.current.innerHTML = '';
    const el = document.createElement('i');
    el.setAttribute('data-lucide', name);
    ref.current.appendChild(el);
    window.lucide.createIcons({
      attrs: {
        width: size,
        height: size,
        'stroke-width': strokeWidth
      }
    });
  }, [name, size, strokeWidth]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    "aria-hidden": "true",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: color || 'currentColor',
      ...style
    }
  });
}

// Constrained content container.
function Container({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container)',
      margin: '0 auto',
      padding: '0 40px',
      ...style
    }
  }, children);
}
window.Icon = Icon;
window.Container = Container;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/shared.jsx", error: String((e && e.message) || e) }); }

__ds_ns.FeatureCard = __ds_scope.FeatureCard;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.RoseSection = __ds_scope.RoseSection;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.MandateTabs = __ds_scope.MandateTabs;

__ds_ns.NavBar = __ds_scope.NavBar;

})();
