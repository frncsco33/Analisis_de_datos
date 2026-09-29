# Handoff: RetailPro Project — Module 1 Pre-delivery (Coderhouse Data Analytics)

> Context file for a new Claude Code session. Read it fully before acting.
> Language rule: talk to me in **Spanish**; the deliverable content is in **Spanish**; prompts and code comments may be in English. No emojis.

## 1. What this is

I'm taking the **Data Analytics** course at Coderhouse (Power BI track). This is a different course from my NLP & Deep Learning course. The whole course builds one final project on a fictional tech distributor called **RetailPro**, which has sales, customer and product data that nobody has analyzed. Each module's pre-delivery adds to the final project: database → analysis → executive dashboard.

**Module 1 pre-delivery** is titled "Brief analítico: definiendo el problema de negocio". It is graded and counts toward the final grade. No tools are used yet; it is strategy only.

**Deliverable:** one PDF or DOCX with 5 sections, uploaded to the platform:

1. Business problem: a *diagnostic* question, not a descriptive one.
2. Data sources: at minimum the tables `clientes`, `productos`, `ventas`, `territorios`.
3. Analysis questions: 4–6 of them.
4. KPIs: at least 4, each with name, description and conceptual formula.
5. Dashboard sketch: 4 zones (filters / KPIs on top / explanatory charts / detail table at the bottom), **max 6 visual elements**, plus 3 lines next to it explaining (a) which question each chart answers, (b) why these 4 KPIs, (c) why the table goes at the bottom.

**What the rubric grades:** the sections must be consistent with each other, not pretty. The 4 KPIs must sit in the top band. Every chart must answer one of the analysis questions, and every question must have a place in the dashboard where it gets answered. Summary goes on top, detail at the bottom. Module 7 will redo the sketch "with professional criteria".

**Dataset:** none is provided on the M1 page (checked). I defined the data model myself. A later SQL module will probably provide data, and my columns may need to be reconciled with it.

## 2. Decisions already made

| Decision | Choice | Why |
|---|---|---|
| Diagnostic angle | **Gross margin by category** | Less generic than the course's example ("North region −15%") |
| Format | DOCX with the sketch embedded | Ready to upload |
| Sketch template | Template A (4 horizontal bands) | The question needs 3 charts of similar weight rather than one dominant chart |
| Sketch values | Illustrative, and labeled as such | There is no real data yet |

## 3. Current content (v1, final text in Spanish)

### 3.1 Strategic question
> ¿Por qué el margen bruto de RetailPro cayó durante el último semestre aunque las ventas crecieron, y qué categorías de producto, niveles de descuento y territorios explican esa caída?

Assumptions to validate:
- (a) Margin falls while volume rises.
- (b) The drop is concentrated in a few categories.
- (c) Rising discounts are one of the drivers.

### 3.2 Data model (star schema)
- **ventas** (fact table): `id_venta` PK, `fecha`, `id_cliente` FK, `id_producto` FK, `id_territorio` FK, `cantidad`, `precio_unitario` (list price at time of sale), `descuento_pct` (0–1), `total_venta` = cantidad × precio_unitario × (1 − descuento_pct), `costo_total` = cantidad × costo_unitario
- **clientes**: `id_cliente` PK, `nombre`, `segmento` (Corporativo/PyME/Minorista), `id_territorio` FK, `fecha_alta`
- **productos**: `id_producto` PK, `nombre`, `categoria` (Laptops, Celulares, Accesorios, Gaming, Periféricos), `subcategoria`, `marca`, `costo_unitario`, `precio_lista`
- **territorios**: `id_territorio` PK, `region`, `estado`, `ciudad`
- Recommended: a `calendario` dimension (fecha, mes, trimestre, año)

### 3.3 Analysis questions → dashboard element
- P1. When did margin start falling? Is it sustained or a one-off? → **Chart A**
- P2. Which categories explain most of the margin drop? → **Chart B**
- P3. Is there a relationship between discount level and margin by category? → **Chart C**
- P4. Mix effect (sales shifting to lower-margin categories) vs. price/cost effect (margin falling within each category)? → **Chart B**
- P5. Which regions and customer segments concentrate the low-margin sales? → **Table D + filters**
- P6. Which products sell high volume at below-average margin? → **Table D**

### 3.4 KPIs
| KPI | Fórmula conceptual |
|---|---|
| Ventas totales | `SUM(total_venta)` |
| Margen bruto % | `(SUM(total_venta) − SUM(costo_total)) / SUM(total_venta)` |
| Utilidad bruta | `SUM(total_venta) − SUM(costo_total)` |
| Descuento promedio ponderado | `1 − SUM(total_venta) / SUM(cantidad × precio_unitario)` |

Each KPI is shown with its variation vs. the previous period.

### 3.5 Dashboard sketch
- **Zone 1:** title + filters (período, región, categoría, segmento cliente)
- **Zone 2:** the 4 KPI cards (margin % highlighted)
- **Zone 3:**
  - Chart A: monthly sales (bars) vs. margin % (line)
  - Chart B: margin change in pp by category (diverging bars)
  - Chart C: discount % vs. margin % by category (scatter)
- **Zone 4:** table D, region × category (ventas, margen %, Δ pp, desc. %, top producto)
- 5 visual elements in total, within the max of 6.

## 4. Files (in the same folder as this .md)
- `Brief_RetailPro_M1.docx`: current deliverable (4 pages, US Letter, Calibri)
- `build.js`: generates the DOCX with the `docx` npm library. Run `node build.js`; it expects `boceto.png` in the same directory.
- `boceto.py`: generates `boceto.png` with matplotlib (1920×1312).
- `boceto.png`: the rendered sketch

To regenerate: `python3 boceto.py && node build.js`

## 5. Changes in v2 (brief rebuilt in repo `Analisis_de_datos`)
- KPI deltas now compare **semester vs previous semester**, matching the strategic question (v1 used quarter).
- Chart A: two aligned panels (sales, margin %) sharing the month axis instead of a dual y-axis; sales bars start at zero and grow ~8%, matching the KPI.
- Chart B: now a **margin bridge** (previous semester → mix effect → rate effect per category → current semester). Steps sum to -4.6 pp, matching the KPI card. This is what actually answers P4.
- Chart C: one point per category-month with a trend line within each category (P3 reworded: "within each category"), avoiding cross-category confounding.
- Table D: now at product grain (region × category × product, units, margin vs category average) so it answers P6.
- Utilidad bruta delta corrected to -12.6% (1.081 × 19.4 / 24.0 − 1).
- Added traceability table (question → element → KPI) and the mix/rate formulas.
- Author and delivery date set in `build.js` (`AUTOR`, `FECHA`).

## 5b. Changes in v3 (simplified to module level)
- Dropped the mix vs rate question and the margin bridge; questions are now P1-P5.
- Chart B: margin % by category, previous vs current semester (paired bars from 0).
- Table D: region, category, product, units, sales, margin %, discount %.
- Document text shortened (~550 words), first person, plain Word formatting; no traceability table.

## 6. Open items / known risks
- [x] Author name set in `build.js`.
- [ ] Confirm the delivery date in `FECHA` (`build.js`).
- [ ] Confirm whether the course counts the KPI band as 1 visual element or 4 (if 4, the dashboard has 8 elements).
- [ ] Make the GitHub repo private (Settings > Danger Zone > Change visibility).
- [ ] Optional: remove the illustrative numbers from the sketch and keep only labels.
- [ ] **Main risk:** if the course's future dataset has no cost column, margin can't be calculated. Fallback angle: discount and volume by category.
- [ ] When the SQL module's dataset arrives, map its columns to the model in 3.2 and update the KPI formulas.
- [ ] Module 7 will redo the sketch (Z reading pattern, hierarchy, color, typography).

## 7. How I want you to work
- Challenge my assumptions before agreeing. Tag claims as [Certain] / [Likely] / [Guessing]. Where it helps, separate Facts / Interpretations / Unknowns.
- Don't present invented data as real; label it.
- End each reply with: "What is the strongest argument against your current position?"
