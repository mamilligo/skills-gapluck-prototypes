/**
 * GapLuck - Centralized Price History Chart Component
 * Dynamically renders and manages an interactive SVG multi-line area chart.
 * Accessible, trilingual, supports local/global currency conversions and theme variables.
 */

(function () {
  'use strict';

  class GapLuckPriceHistoryChart {
    constructor(containerSelector, options = {}) {
      this.container = document.querySelector(containerSelector);
      if (!this.container) {
        console.warn(`GapLuckPriceHistoryChart: Container "${containerSelector}" not found.`);
        return;
      }
      this.options = options;
      this.currentRange = 90;
      this.currentCurrency = window.currentCurrency || 'TRY';
      this.currentLang = window.currentLang || 'en';

      this.countries = ["uae", "usa", "germany", "turkey"];
      this.xCoords = [50, 225, 400, 575, 750];

      // Coordinate mapping config
      this.minVal = 20000;
      this.maxVal = 70000;
      this.minTargetY = 210;
      this.maxTargetY = 40;

      // Historical dataset in TRY (base currency)
      this.chartData = {
        30: {
          dates: {
            en: ["May 25", "May 30", "Jun 04", "Jun 09", "Jun 15"],
            tr: ["25 May", "30 May", "4 Haz", "9 Haz", "15 Haz"],
            ar: ["٢٥ مايو", "٣٠ مايو", "٤ يونيو", "٩ يونيو", "١٥ يونيو"]
          },
          uae: [32000, 31800, 31600, 31500, 31500],
          usa: [35000, 34800, 34700, 34600, 34500],
          germany: [37500, 37400, 37300, 37200, 37200],
          turkey: [62000, 62300, 62600, 62900, 63000]
        },
        90: {
          dates: {
            en: ["Mar 15", "Apr 15", "May 15", "Jun 01", "Jun 15"],
            tr: ["15 Mar", "15 Nis", "15 May", "1 Haz", "15 Haz"],
            ar: ["١٥ مارس", "١٥ أبريل", "١٥ مايو", "١ يونيو", "١٥ يونيو"]
          },
          uae: [33000, 32500, 32000, 31800, 31500],
          usa: [35500, 36000, 35200, 34800, 34500],
          germany: [38000, 37800, 37600, 37400, 37200],
          turkey: [58000, 59500, 61000, 62200, 63000]
        },
        180: {
          dates: {
            en: ["Dec 15", "Jan 15", "Feb 15", "Mar 15", "Jun 15"],
            tr: ["15 Ara", "15 Oca", "15 Şub", "15 Mar", "15 Haz"],
            ar: ["١٥ ديسمبر", "١٥ يناير", "١٥ فبراير", "١٥ مارس", "١٥ يونيو"]
          },
          uae: [34000, 33500, 33200, 33000, 31500],
          usa: [36000, 36200, 35800, 35500, 34500],
          germany: [39000, 38500, 38200, 38000, 37200],
          turkey: [52000, 54500, 56000, 58000, 63000]
        }
      };

      this.init();
    }

    init() {
      this.renderMarkup();
      this.setupDOMReferences();
      this.setupEventListeners();
      this.updateChart();
    }

    getTxt(key) {
      const dict = window.GapLuckI18N ? (window.GapLuckI18N[this.currentLang] || window.GapLuckI18N.en) : {};
      return dict[key] || dict[key.toLowerCase()] || key;
    }



    renderMarkup() {
      this.container.innerHTML = `
        <div class="ag-chart-card">
          <div class="ag-chart-header">
            <div class="ag-chart-legends">
              <div class="ag-chart-legend" id="legend-uae">
                <span class="ag-chart-legend__dot" style="background:#2DBF8E;"></span>
                <span data-i18n="chart_legend_uae">UAE (Cheapest)</span>
              </div>
              <div class="ag-chart-legend" id="legend-usa">
                <span class="ag-chart-legend__dot" style="background:#105E9B;"></span>
                <span data-i18n="chart_legend_usa">USA</span>
              </div>
              <div class="ag-chart-legend" id="legend-germany">
                <span class="ag-chart-legend__dot" style="background:#BA7517;"></span>
                <span data-i18n="chart_legend_germany">Germany</span>
              </div>
              <div class="ag-chart-legend" id="legend-turkey">
                <span class="ag-chart-legend__dot" style="background:#C94040;"></span>
                <span data-i18n="chart_legend_turkey">Turkey (Home)</span>
              </div>
            </div>

            <div style="display: flex; gap: var(--space-4); align-items: center; flex-wrap: wrap;">
              <!-- Dropdown Filter -->
              <div class="ag-chart-dropdown-wrapper">
                <button class="ag-btn ag-btn--secondary ag-btn--small" id="chart-filter-trigger"
                  style="display:flex; align-items:center; gap:var(--space-2);">
                  <span data-i18n="filter_countries">Filter Countries</span>
                  <span style="font-size:10px;">▼</span>
                </button>
                <div class="ag-chart-dropdown-menu" id="chart-filter-dropdown">
                  <label class="ag-chart-dropdown-item">
                    <input type="checkbox" value="uae" checked />
                    <span data-i18n="chart_legend_uae">UAE (Cheapest)</span>
                  </label>
                  <label class="ag-chart-dropdown-item">
                    <input type="checkbox" value="usa" checked />
                    <span data-i18n="chart_legend_usa">USA</span>
                  </label>
                  <label class="ag-chart-dropdown-item">
                    <input type="checkbox" value="germany" checked />
                    <span data-i18n="chart_legend_germany">Germany</span>
                  </label>
                  <label class="ag-chart-dropdown-item">
                    <input type="checkbox" value="turkey" checked />
                    <span data-i18n="chart_legend_turkey">Turkey (Home)</span>
                  </label>
                </div>
              </div>

              <div class="ag-chart-controls">
                <button class="ag-chart-btn" data-days="30">30D</button>
                <button class="ag-chart-btn ag-chart-btn--active" data-days="90">90D</button>
                <button class="ag-chart-btn" data-days="180">180D</button>
              </div>
            </div>
          </div>

          <div class="ag-chart-svg-container" id="chart-viewport">
            <svg class="ag-chart-svg" viewBox="0 0 800 250">
              <!-- Grid Lines -->
              <line class="ag-chart-grid-line" x1="50" y1="50" x2="750" y2="50"></line>
              <line class="ag-chart-grid-line" x1="50" y1="100" x2="750" y2="100"></line>
              <line class="ag-chart-grid-line" x1="50" y1="150" x2="750" y2="150"></line>
              <line class="ag-chart-grid-line" x1="50" y1="200" x2="750" y2="200"></line>

              <!-- Axes Labels -->
              <text class="ag-chart-axis-label y-axis-label-60k" x="15" y="54">₺60k</text>
              <text class="ag-chart-axis-label y-axis-label-48k" x="15" y="104">₺48k</text>
              <text class="ag-chart-axis-label y-axis-label-36k" x="15" y="154">₺36k</text>
              <text class="ag-chart-axis-label y-axis-label-24k" x="15" y="204">₺24k</text>

              <text class="ag-chart-axis-label date-label-0" x="50" y="235"></text>
              <text class="ag-chart-axis-label date-label-1" x="225" y="235"></text>
              <text class="ag-chart-axis-label date-label-2" x="400" y="235"></text>
              <text class="ag-chart-axis-label date-label-3" x="575" y="235"></text>
              <text class="ag-chart-axis-label date-label-4" x="730" y="235"></text>

              <!-- Chart Curves -->
              <path class="ag-chart-line" id="line-uae" stroke="#2DBF8E"></path>
              <path class="ag-chart-line" id="line-usa" stroke="#105E9B"></path>
              <path class="ag-chart-line" id="line-germany" stroke="#BA7517"></path>
              <path class="ag-chart-line" id="line-turkey" stroke="#C94040"></path>

              <!-- Interaction Overlay Elements -->
              <line class="ag-chart-tracker-line" id="chart-tracker-line" x1="50" y1="30" x2="50" y2="210"></line>
              <circle class="ag-chart-interactive-dot" id="dot-chart-uae" stroke="#2DBF8E"></circle>
              <circle class="ag-chart-interactive-dot" id="dot-chart-usa" stroke="#105E9B"></circle>
              <circle class="ag-chart-interactive-dot" id="dot-chart-germany" stroke="#BA7517"></circle>
              <circle class="ag-chart-interactive-dot" id="dot-chart-turkey" stroke="#C94040"></circle>
            </svg>
            <div class="ag-chart-tooltip" id="chart-tooltip"></div>
          </div>
        </div>
      `;
    }

    setupDOMReferences() {
      this.chartViewport = this.container.querySelector("#chart-viewport");
      this.trackerLine = this.container.querySelector("#chart-tracker-line");
      this.tooltip = this.container.querySelector("#chart-tooltip");
      this.dropdownTrigger = this.container.querySelector("#chart-filter-trigger");
      this.dropdownMenu = this.container.querySelector("#chart-filter-dropdown");
      this.rangeButtons = this.container.querySelectorAll(".ag-chart-controls .ag-chart-btn");
      this.svg = this.container.querySelector(".ag-chart-svg");
    }

    setupEventListeners() {
      // Range control buttons
      this.rangeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
          this.rangeButtons.forEach(b => b.classList.remove("ag-chart-btn--active"));
          btn.classList.add("ag-chart-btn--active");
          this.currentRange = parseInt(btn.getAttribute("data-days"), 10) || 90;
          this.updateChart();
        });
      });

      // Filter dropdown toggle
      if (this.dropdownTrigger && this.dropdownMenu) {
        this.dropdownTrigger.addEventListener("click", (e) => {
          e.stopPropagation();
          this.dropdownMenu.classList.toggle("ag-chart-dropdown-menu--open");
        });

        document.addEventListener("click", (e) => {
          if (!this.dropdownTrigger.contains(e.target) && !this.dropdownMenu.contains(e.target)) {
            this.dropdownMenu.classList.remove("ag-chart-dropdown-menu--open");
          }
        });
      }

      // Filter checkboxes
      if (this.dropdownMenu) {
        this.dropdownMenu.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
          checkbox.addEventListener("change", () => {
            const country = checkbox.value;
            const isChecked = checkbox.checked;

            const path = this.container.querySelector(`#line-${country}`);
            if (path) {
              path.style.display = isChecked ? "block" : "none";
            }

            const legend = this.container.querySelector(`#legend-${country}`);
            if (legend) {
              legend.style.opacity = isChecked ? "1" : "0.4";
            }

            const dot = this.container.querySelector(`#dot-chart-${country}`);
            if (dot && !isChecked) {
              dot.style.display = "none";
            }
          });
        });
      }

      // Mouse interactivity on SVG
      if (this.svg) {
        this.svg.addEventListener("mousemove", (e) => this.handleMouseMove(e));
        this.svg.addEventListener("mouseleave", () => this.hideTooltip());
      }

      // Listen to global changes
      window.addEventListener("gl-language-change", (e) => {
        this.currentLang = e.detail.language;
        this.translateLabels();
        this.updateChart();
      });

      window.addEventListener("gl-currency-change", (e) => {
        this.currentCurrency = e.detail.currency;
        this.updateYAxisLabels();
        this.updateChart();
      });
    }

    valueToY(val) {
      return this.minTargetY - ((val - this.minVal) / (this.maxVal - this.minVal)) * (this.minTargetY - this.maxTargetY);
    }

    // Bezier path calculation
    getBezierPath(points) {
      if (points.length === 0) return "";
      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const cp1x = p0.x + (p1.x - p0.x) / 3;
        const cp1y = p0.y;
        const cp2x = p0.x + 2 * (p1.x - p0.x) / 3;
        const cp2y = p1.y;
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
      }
      return d;
    }

    // Bezier interpolation for Y coordinate
    interpolateY(x, p0, p1) {
      const t = (x - p0.x) / (p1.x - p0.x);
      return Math.pow(1 - t, 3) * p0.y +
        3 * Math.pow(1 - t, 2) * t * p0.y +
        3 * (1 - t) * Math.pow(t, 2) * p1.y +
        Math.pow(t, 3) * p1.y;
    }

    interpolatePrice(x, x0, x1, y0, y1) {
      const t = (x - x0) / (x1 - x0);
      return y0 + t * (y1 - y0);
    }

    translateLabels() {
      // Translate elements with [data-i18n]
      this.container.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        el.textContent = this.getTxt(key);
      });
    }

    updateYAxisLabels() {
      const conversionRate = (window.rates && window.rates[this.currentCurrency]) || 1;
      const values = [60000, 48000, 36000, 24000];
      const suffixes = ["60k", "48k", "36k", "24k"];

      suffixes.forEach((suffix, idx) => {
        const el = this.container.querySelector(`.y-axis-label-${suffix}`);
        if (el) {
          const converted = values[idx] / conversionRate;
          el.textContent = window.formatMoney(converted * conversionRate, this.currentCurrency); // Format money in active currency
        }
      });
    }

    updateChart() {
      const data = this.chartData[this.currentRange];
      const rate = (window.rates && window.rates[this.currentCurrency]) || 1;

      // Update curve paths
      this.countries.forEach(c => {
        const path = this.container.querySelector(`#line-${c}`);
        if (!path) return;
        const prices = data[c];
        const points = prices.map((val, idx) => ({ x: this.xCoords[idx], y: this.valueToY(val) }));
        path.setAttribute("d", this.getBezierPath(points));
      });

      // Update date labels on X axis
      const activeDates = data.dates[this.currentLang] || data.dates.en;
      activeDates.forEach((dateStr, idx) => {
        const label = this.container.querySelector(`.date-label-${idx}`);
        if (label) {
          label.textContent = dateStr;
        }
      });

      // Sync texts
      this.translateLabels();
    }

    handleMouseMove(e) {
      const rect = this.svg.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 800; // Map clientX to SVG space (0-800)

      if (mouseX < 50 || mouseX > 750) {
        this.hideTooltip();
        return;
      }

      // Show vertical tracker line
      this.trackerLine.setAttribute("x1", mouseX);
      this.trackerLine.setAttribute("x2", mouseX);
      this.trackerLine.style.display = "block";

      const data = this.chartData[this.currentRange];
      const closestIdx = Math.min(Math.max(Math.round((mouseX - 50) / 175), 0), 4);
      const activeDates = data.dates[this.currentLang] || data.dates.en;
      const dateStr = activeDates[closestIdx];

      let tooltipHtml = `<div style="font-weight:var(--font-weight-bold);margin-bottom:var(--space-2);text-align:center;border-bottom:1px solid var(--color-border-strong);padding-bottom:var(--space-1);">${dateStr}</div>`;
      let hasActive = false;

      this.countries.forEach(c => {
        const checkbox = this.dropdownMenu ? this.dropdownMenu.querySelector(`input[value='${c}']`) : null;
        const isChecked = checkbox ? checkbox.checked : true;
        const path = this.container.querySelector(`#line-${c}`);

        if (isChecked && path) {
          const prices = data[c];
          const points = prices.map((val, idx) => ({ x: this.xCoords[idx], y: this.valueToY(val) }));

          let p0 = points[0], p1 = points[1];
          let pr0 = prices[0], pr1 = prices[1];
          let segIdx = 0;

          for (let i = 0; i < this.xCoords.length - 1; i++) {
            if (mouseX >= this.xCoords[i] && mouseX <= this.xCoords[i + 1]) {
              p0 = points[i];
              p1 = points[i + 1];
              pr0 = prices[i];
              pr1 = prices[i + 1];
              segIdx = i;
              break;
            }
          }

          const y = this.interpolateY(mouseX, p0, p1);
          const dot = this.container.querySelector(`#dot-chart-${c}`);
          if (dot) {
            dot.setAttribute("cx", mouseX);
            dot.setAttribute("cy", y);
            dot.style.display = "block";
          }

          const price = this.interpolatePrice(mouseX, this.xCoords[segIdx], this.xCoords[segIdx + 1], pr0, pr1);
          const formattedPrice = window.formatMoney(price, this.currentCurrency);

          let displayName = c.toUpperCase();
          if (c === "uae") displayName = this.getTxt("chart_legend_uae");
          if (c === "usa") displayName = "USA";
          if (c === "germany") displayName = this.getTxt("chart_legend_germany");
          if (c === "turkey") displayName = this.getTxt("chart_legend_turkey");

          const dotColor = c === "uae" ? "#2DBF8E" : (c === "usa" ? "#105E9B" : (c === "germany" ? "#BA7517" : "#C94040"));

          tooltipHtml += `
            <div class="ag-chart-tooltip__row">
              <div style="display:flex;align-items:center;gap:var(--space-2);">
                <span style="width:8px;height:8px;border-radius:50%;background-color:${dotColor};display:inline-block;"></span>
                <span>${displayName}:</span>
              </div>
              <span style="font-weight:var(--font-weight-semibold);">${formattedPrice}</span>
            </div>
          `;
          hasActive = true;
        } else {
          const dot = this.container.querySelector(`#dot-chart-${c}`);
          if (dot) dot.style.display = "none";
        }
      });

      if (hasActive) {
        this.tooltip.innerHTML = tooltipHtml;
        this.tooltip.style.display = "block";

        const tooltipRect = this.tooltip.getBoundingClientRect();
        const parentRect = this.chartViewport.getBoundingClientRect();
        const localX = e.clientX - parentRect.left;
        const localY = e.clientY - parentRect.top;

        let tooltipLeft = localX + 15;
        if (tooltipLeft + tooltipRect.width > parentRect.width) {
          tooltipLeft = localX - tooltipRect.width - 15;
        }

        let tooltipTop = localY - tooltipRect.height / 2;
        if (tooltipTop < 10) tooltipTop = 10;
        if (tooltipTop + tooltipRect.height > parentRect.height - 10) {
          tooltipTop = parentRect.height - tooltipRect.height - 10;
        }

        this.tooltip.style.left = `${tooltipLeft}px`;
        this.tooltip.style.top = `${tooltipTop}px`;
      } else {
        this.hideTooltip();
      }
    }

    hideTooltip() {
      if (this.trackerLine) this.trackerLine.style.display = "none";
      this.countries.forEach(c => {
        const dot = this.container.querySelector(`#dot-chart-${c}`);
        if (dot) dot.style.display = "none";
      });
      if (this.tooltip) this.tooltip.style.display = "none";
    }
  }

  window.GapLuckPriceHistoryChart = GapLuckPriceHistoryChart;
})();
