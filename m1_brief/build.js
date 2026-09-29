// Builds Brief_RetailPro_M1.docx (US Letter, Calibri). Requires boceto.png in this folder.
// Run: python3 boceto.py && node build.js
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, Header, Footer,
  AlignmentType, HeadingLevel, WidthType, ShadingType, BorderStyle, LevelFormat, PageNumber,
} = require("docx");

const AUTOR = "Francisco Javier Salgado Acevedo";
const FECHA = "29 de septiembre de 2026"; // fecha de entrega: ajustar si la plataforma indica otra
const OUT = "Brief_RetailPro_M1.docx";

const FONT = "Calibri";
const INK = "1F2937", MUTE = "6B7280", ACC = "C2410C", HEAD_BG = "EEF2F7", RULE = "D1D5DB";
const PAGE_W = 12240, MARGIN = 1440, CONTENT_W = PAGE_W - 2 * MARGIN; // 9360 DXA

// ---------- helpers ----------
const run = (text, o = {}) => new TextRun({ text, font: FONT, size: o.size || 22, bold: o.bold, italics: o.italics, color: o.color || INK });

// Inline **bold** markup inside a string
function runs(text, o = {}) {
  return text.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map(t =>
    t.startsWith("**") ? run(t.slice(2, -2), { ...o, bold: true }) : run(t, o));
}

const p = (text, o = {}) => new Paragraph({
  children: runs(text, o), spacing: { after: o.after ?? 120, line: 276 }, alignment: o.align,
});

const h1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1, spacing: { before: 280, after: 120 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: RULE, space: 4 } },
  children: [run(text, { size: 28, bold: true, color: INK })],
});

const h2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2, spacing: { before: 180, after: 80 },
  children: [run(text, { size: 23, bold: true, color: ACC })],
});

const bullet = (text) => new Paragraph({
  numbering: { reference: "bullets", level: 0 }, spacing: { after: 60, line: 276 }, children: runs(text),
});

const callout = (text) => new Paragraph({
  spacing: { before: 80, after: 160, line: 300 }, indent: { left: 240, right: 240 },
  shading: { type: ShadingType.CLEAR, fill: "FFF7ED", color: "auto" },
  border: { left: { style: BorderStyle.SINGLE, size: 24, color: ACC, space: 8 } },
  children: runs(text, { size: 24 }),
});

const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: RULE };
function table(widths, header, rows) {
  const mk = (txt, w, isHead) => new TableCell({
    width: { size: w, type: WidthType.DXA },
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    shading: isHead ? { type: ShadingType.CLEAR, fill: HEAD_BG, color: "auto" } : undefined,
    borders: { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder },
    children: [new Paragraph({ spacing: { after: 0 }, children: runs(txt, { size: 19, bold: isHead }) })],
  });
  return new Table({
    width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({ tableHeader: true, children: header.map((t, i) => mk(t, widths[i], true)) }),
      ...rows.map(r => new TableRow({ children: r.map((t, i) => mk(t, widths[i], false)) })),
    ],
  });
}
const spacer = () => new Paragraph({ spacing: { after: 80 }, children: [] });

// ---------- content ----------
const portada = [
  new Paragraph({ spacing: { after: 60 }, children: [run("Brief analítico: definiendo el problema de negocio", { size: 36, bold: true })] }),
  new Paragraph({ spacing: { after: 200 }, children: [run("Proyecto RetailPro · Preentrega Módulo 1 · Data Analytics (Coderhouse)", { size: 22, color: MUTE })] }),
  table([2200, CONTENT_W - 2200], ["Dato", "Detalle"], [
    ["Alumno", AUTOR],
    ["Fecha de entrega", FECHA],
    ["Empresa (caso)", "RetailPro, distribuidor de tecnología (caso ficticio del curso)"],
    ["Enfoque", "Diagnóstico de la caída del margen bruto por categoría"],
  ]),
];

const s1 = [
  h1("1. Problema de negocio"),
  p("RetailPro acumula datos de ventas, clientes y productos que nadie ha analizado. La dirección percibe que el negocio crece, porque las ventas suben, pero la utilidad no acompaña. El brief convierte esa percepción en una pregunta que se pueda responder con datos."),
  h2("Pregunta estratégica"),
  callout("**¿Por qué el margen bruto de RetailPro cayó durante el último semestre, comparado con el semestre anterior, aunque las ventas crecieron, y qué categorías de producto, niveles de descuento y territorios explican esa caída?**"),
  h2("Por qué es diagnóstica y no descriptiva"),
  p("Una pregunta descriptiva se quedaría en **qué pasó** (\"¿cuánto vendimos por categoría?\"). Esta pregunta busca **por qué pasó** y **dónde se origina**: separa la caída en causas (categoría, descuento, territorio y mezcla de ventas) para que la empresa sepa dónde actuar."),
  h2("Hipótesis a validar"),
  bullet("**H1.** El margen bruto % cae mientras las ventas suben (la paradoja existe y no es un efecto de un solo mes)."),
  bullet("**H2.** La caída se concentra en pocas categorías, no se reparte en todo el catálogo."),
  bullet("**H3.** El aumento de los descuentos es uno de los motores de la caída."),
  h2("Alcance"),
  p("Periodo de análisis: último semestre frente al semestre anterior, con detalle mensual. Se mide **margen bruto** (ventas menos costo de la mercancía); los gastos operativos quedan fuera de este análisis."),
];

const s2 = [
  h1("2. Fuentes de datos"),
  p("Se propone un modelo en estrella: una tabla de hechos (**ventas**) rodeada de tablas de dimensión. Cada venta se une a su cliente, su producto y su territorio mediante claves foráneas."),
  table([1500, 1300, 3960, 2600], ["Tabla", "Tipo", "Campos principales", "Uso en el análisis"], [
    ["ventas", "Hechos", "id_venta (PK), fecha, id_cliente (FK), id_producto (FK), id_territorio (FK), cantidad, precio_unitario (precio de lista al momento de la venta), descuento_pct (0 a 1), total_venta, costo_total", "Base de todos los KPI: ingreso, costo, margen y descuento"],
    ["clientes", "Dimensión", "id_cliente (PK), nombre, segmento (Corporativo / PyME / Minorista), id_territorio (FK), fecha_alta", "Filtro y corte por segmento (P5)"],
    ["productos", "Dimensión", "id_producto (PK), nombre, categoria (Laptops, Celulares, Accesorios, Gaming, Periféricos), subcategoria, marca, costo_unitario, precio_lista", "Corte por categoría y producto (P2, P4, P6)"],
    ["territorios", "Dimensión", "id_territorio (PK), region, estado, ciudad", "Corte por región (P5)"],
    ["calendario", "Dimensión (recomendada)", "fecha (PK), mes, trimestre, semestre, año", "Series mensuales y comparación entre semestres (P1)"],
  ]),
  spacer(),
  h2("Campos calculados en ventas"),
  bullet("**total_venta** = cantidad × precio_unitario × (1 − descuento_pct)"),
  bullet("**costo_total** = cantidad × costo_unitario, registrado **al momento de la venta**. Si solo se usara el costo actual de la tabla productos, los márgenes históricos quedarían mal calculados cuando el costo cambia."),
  h2("Riesgo de datos"),
  p("Todo el análisis depende de contar con el costo por venta o por producto. Si el dataset del curso no trae costo, el margen no se puede calcular y el enfoque alternativo será **descuento y volumen por categoría**."),
];

const s3 = [
  h1("3. Preguntas de análisis"),
  p("Cada pregunta se responde en un elemento específico del dashboard (sección 5)."),
  table([600, 5160, 1500, 2100], ["#", "Pregunta", "Hipótesis", "Dónde se responde"], [
    ["P1", "¿Cuándo empezó a caer el margen? ¿La caída es sostenida o puntual?", "H1", "Gráfico A"],
    ["P2", "¿Qué categorías explican la mayor parte de la caída del margen?", "H2", "Gráfico B"],
    ["P3", "Dentro de cada categoría, ¿los meses con más descuento tienen menos margen?", "H3", "Gráfico C"],
    ["P4", "¿La caída viene de un efecto mezcla (se vende más de categorías de menor margen) o de un efecto tasa (el margen baja dentro de cada categoría)?", "H1, H2", "Gráfico B"],
    ["P5", "¿Qué regiones y segmentos de cliente concentran las ventas de bajo margen?", "H2", "Tabla D + filtros de región y segmento"],
    ["P6", "¿Qué productos venden mucho volumen con un margen por debajo del promedio de su categoría?", "H2, H3", "Tabla D"],
  ]),
];

const s4 = [
  h1("4. KPIs"),
  p("Los cuatro KPI se muestran en la banda superior del dashboard, cada uno con su **variación contra el semestre anterior**, el mismo horizonte de la pregunta estratégica."),
  table([2000, 3560, 3800], ["KPI", "Descripción", "Fórmula conceptual"], [
    ["Ventas totales", "Ingreso neto después de descuentos. Muestra que el negocio crece en ingresos.", "SUM(total_venta)"],
    ["Margen bruto %", "Qué parte de cada peso vendido queda después de pagar la mercancía. Es el KPI central del problema.", "(SUM(total_venta) − SUM(costo_total)) / SUM(total_venta)"],
    ["Utilidad bruta", "El margen expresado en dinero. Muestra el impacto real de la caída.", "SUM(total_venta) − SUM(costo_total)"],
    ["Descuento promedio ponderado", "Qué parte del precio de lista se cede en descuentos, ponderada por monto vendido.", "1 − SUM(total_venta) / SUM(cantidad × precio_unitario)"],
  ]),
  spacer(),
  h2("Medida de apoyo para el gráfico B (no es KPI)"),
  p("La variación del margen entre semestres se descompone en dos efectos que suman exactamente la variación total. Sea w la participación de cada categoría en las ventas y m su margen %:"),
  bullet("**Efecto mezcla** = Σ (w_actual − w_anterior) × m_anterior"),
  bullet("**Efecto tasa (por categoría)** = w_actual × (m_actual − m_anterior)"),
  p("Efecto mezcla + Σ efectos tasa = margen actual − margen anterior. Así el gráfico B cuadra con la tarjeta de Margen bruto %.", { color: MUTE, italics: true }),
];

const img = fs.readFileSync("boceto.png");
const IMG_W = 624, IMG_H = Math.round(624 * 1312 / 1920); // px at 96 dpi -> 6.5 in wide

const s5 = [
  h1("5. Boceto del dashboard"),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 },
    children: [new ImageRun({ type: "png", data: img, transformation: { width: IMG_W, height: IMG_H },
      altText: { title: "Boceto del dashboard", description: "Wireframe de 4 zonas del dashboard de rentabilidad de RetailPro", name: "boceto" } })] }),
  p("Valores ilustrativos: escenario de diseño, no datos reales.", { size: 18, color: MUTE, italics: true, align: AlignmentType.CENTER }),
  h2("Estructura en 4 zonas"),
  bullet("**Zona 1.** Título y filtros: período, región, categoría y segmento de cliente."),
  bullet("**Zona 2.** Banda de 4 KPI con variación contra el semestre anterior; el margen bruto % va resaltado."),
  bullet("**Zona 3.** Tres gráficos explicativos (A, B y C) de peso similar."),
  bullet("**Zona 4.** Tabla de detalle D, ordenable, a todo el ancho."),
  p("Conteo: banda de KPI (1) + gráficos A, B y C (3) + tabla D (1) = **5 elementos visuales**, dentro del máximo de 6. Los filtros son controles, no elementos visuales."),
  h2("Justificación"),
  p("**(a) Qué pregunta responde cada gráfico.** A responde P1: separa ventas y margen en dos paneles con el mismo eje de meses para ubicar cuándo empezó la caída. B responde P2 y P4: un puente de margen que parte del semestre anterior y muestra cuánto aporta el efecto mezcla y cuánto cada categoría. C responde P3: compara descuento y margen mes a mes dentro de cada categoría. D responde P5 y P6, apoyada en los filtros de región y segmento."),
  p("**(b) Por qué estos 4 KPI.** Ventas y margen % muestran juntas la paradoja de la pregunta (crecer vendiendo, perder rentabilidad); la utilidad bruta traduce esa paradoja a dinero; el descuento ponderado es la causa principal que se sospecha y la única palanca que la empresa controla directamente."),
  p("**(c) Por qué la tabla va abajo.** El dashboard se lee de lo general a lo particular: primero el resumen (KPI), después la explicación (gráficos) y al final el detalle. La tabla sirve a quien ya entendió el problema y busca dónde actuar (qué producto, en qué región), así que no debe competir por atención con el resumen."),
  h2("Trazabilidad pregunta → elemento → KPI"),
  table([900, 2600, 5860], ["Pregunta", "Elemento", "KPI o medida que usa"], [
    ["P1", "Gráfico A", "Ventas totales y Margen bruto % por mes"],
    ["P2", "Gráfico B", "Margen bruto % (efecto tasa por categoría)"],
    ["P3", "Gráfico C", "Descuento promedio ponderado y Margen bruto % por categoría y mes"],
    ["P4", "Gráfico B", "Efecto mezcla vs efecto tasa"],
    ["P5", "Tabla D + filtros", "Margen bruto % y Ventas por región y segmento"],
    ["P6", "Tabla D", "Margen bruto % del producto vs promedio de su categoría; unidades"],
  ]),
];

// ---------- document ----------
const doc = new Document({
  creator: AUTOR,
  title: "Brief analítico RetailPro - Módulo 1",
  styles: { default: { document: { run: { font: FONT, size: 22, color: INK } } } },
  numbering: { config: [{ reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 360, hanging: 240 } } } }] }] },
  sections: [{
    properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } } },
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
      children: [run(`RetailPro · Brief analítico M1 · ${AUTOR}`, { size: 16, color: MUTE })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ children: ["Página ", PageNumber.CURRENT, " de ", PageNumber.TOTAL_PAGES], font: FONT, size: 16, color: MUTE })] })] }) },
    children: [...portada, ...s1, ...s2, ...s3, ...s4, ...s5],
  }],
});

Packer.toBuffer(doc).then(buf => { fs.writeFileSync(OUT, buf); console.log(`OK -> ${OUT}`); });
