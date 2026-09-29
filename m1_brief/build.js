// Builds Brief_RetailPro_M1.docx (US Letter, Calibri). Requires boceto.png in this folder.
// Run: python3 boceto.py && node build.js
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, Footer,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, LevelFormat, PageNumber,
} = require("docx");

const AUTOR = "Francisco Javier Salgado Acevedo";
const FECHA = "29 de septiembre de 2026"; // fecha de entrega: ajustar si la plataforma indica otra
const OUT = "Brief_RetailPro_M1.docx";

const FONT = "Calibri";
const PAGE_W = 12240, MARGIN = 1440, CONTENT_W = PAGE_W - 2 * MARGIN; // 9360 DXA

// ---------- helpers ----------
const run = (text, o = {}) => new TextRun({ text, font: FONT, size: o.size || 22, bold: o.bold, italics: o.italics });

const p = (text, o = {}) => new Paragraph({
  children: [run(text, o)], spacing: { after: 120, line: 276 }, alignment: o.align,
});

const h1 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 120 },
  children: [run(text, { size: 28, bold: true })] });

const bullet = (text) => new Paragraph({ numbering: { reference: "bullets", level: 0 },
  spacing: { after: 60, line: 276 }, children: [run(text)] });

const border = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
function table(widths, header, rows) {
  const mk = (txt, w, isHead) => new TableCell({
    width: { size: w, type: WidthType.DXA },
    margins: { top: 40, bottom: 40, left: 80, right: 80 },
    borders: { top: border, bottom: border, left: border, right: border },
    children: [new Paragraph({ spacing: { after: 0 }, children: [run(txt, { size: 20, bold: isHead })] })],
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
const spacer = () => new Paragraph({ spacing: { after: 60 }, children: [] });

// ---------- content ----------
const portada = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
    children: [run("Brief analítico: definiendo el problema de negocio", { size: 32, bold: true })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [run("Proyecto RetailPro – Preentrega Módulo 1")] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [run(AUTOR)] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: [run(FECHA)] }),
];

const s1 = [
  h1("1. Problema de negocio"),
  p("RetailPro vende cada vez más, pero la utilidad no está creciendo al mismo ritmo. Mi pregunta es:"),
  p("¿Por qué bajó el margen bruto de RetailPro en el último semestre, comparado con el semestre anterior, si las ventas subieron? ¿Qué categorías, niveles de descuento y territorios explican esa caída?", { italics: true }),
  p("Es una pregunta diagnóstica porque no busca solo saber cuánto se vendió, sino entender por qué cayó el margen y en qué parte del negocio pasó."),
  p("Supuestos que quiero comprobar con los datos:"),
  bullet("El margen baja aunque las ventas suben."),
  bullet("La caída se concentra en pocas categorías."),
  bullet("Los descuentos aumentaron y eso está afectando el margen."),
];

const s2 = [
  h1("2. Fuentes de datos"),
  p("Uso cuatro tablas. Ventas es la tabla principal y se conecta con las otras tres por sus claves."),
  table([1500, 5160, 2700], ["Tabla", "Campos", "Para qué la uso"], [
    ["ventas", "id_venta, fecha, id_cliente, id_producto, id_territorio, cantidad, precio_unitario, descuento_pct, total_venta, costo_total", "Calcular ventas, costo, margen y descuento"],
    ["clientes", "id_cliente, nombre, segmento (Corporativo, PyME, Minorista), id_territorio, fecha_alta", "Ver el margen por segmento"],
    ["productos", "id_producto, nombre, categoria, subcategoria, marca, costo_unitario, precio_lista", "Ver el margen por categoría y producto"],
    ["territorios", "id_territorio, region, estado, ciudad", "Ver el margen por región"],
  ]),
  spacer(),
  p("En ventas, total_venta = cantidad × precio_unitario × (1 − descuento_pct) y costo_total = cantidad × costo_unitario. También conviene tener una tabla de calendario (fecha, mes, semestre, año) para comparar periodos."),
  p("Si los datos del curso no traen el costo de los productos no voy a poder calcular el margen. En ese caso cambiaría el análisis a descuentos y volumen por categoría."),
];

const s3 = [
  h1("3. Preguntas de análisis"),
  table([700, 6460, 2200], ["#", "Pregunta", "Dónde se responde"], [
    ["P1", "¿Desde qué mes empezó a bajar el margen? ¿Sigue bajando o fue algo puntual?", "Gráfico A"],
    ["P2", "¿Qué categorías tuvieron la mayor caída de margen?", "Gráfico B"],
    ["P3", "¿Los meses con más descuento tienen menos margen?", "Gráfico C"],
    ["P4", "¿Qué regiones y segmentos de clientes tienen el margen más bajo?", "Tabla D y filtros"],
    ["P5", "¿Qué productos se venden mucho pero dejan poco margen?", "Tabla D"],
  ]),
];

const s4 = [
  h1("4. KPIs"),
  p("Todos se comparan contra el semestre anterior."),
  table([2300, 3760, 3300], ["KPI", "Qué mide", "Fórmula"], [
    ["Ventas totales", "Cuánto se vendió después de descuentos", "SUM(total_venta)"],
    ["Margen bruto %", "Qué porcentaje de cada venta queda después del costo", "(SUM(total_venta) − SUM(costo_total)) / SUM(total_venta)"],
    ["Utilidad bruta", "La ganancia bruta en dinero", "SUM(total_venta) − SUM(costo_total)"],
    ["Descuento promedio ponderado", "Qué porcentaje del precio de lista se está descontando", "1 − SUM(total_venta) / SUM(cantidad × precio_unitario)"],
  ]),
];

const img = fs.readFileSync("boceto.png");
const IMG_W = 624, IMG_H = Math.round(624 * 1312 / 1920); // 6.5 in wide at 96 dpi

const s5 = [
  h1("5. Boceto del dashboard"),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 },
    children: [new ImageRun({ type: "png", data: img, transformation: { width: IMG_W, height: IMG_H },
      altText: { title: "Boceto del dashboard", description: "Boceto del dashboard de RetailPro en 4 zonas", name: "boceto" } })] }),
  p("Los números del boceto son de ejemplo, todavía no hay datos reales.", { size: 18, italics: true, align: AlignmentType.CENTER }),
  p("Zona 1: título y filtros. Zona 2: los 4 KPIs. Zona 3: gráficos A, B y C. Zona 4: tabla de detalle. En total son 5 elementos visuales (KPIs, 3 gráficos y la tabla)."),
  p("a) El gráfico A responde P1, el B responde P2, el C responde P3 y la tabla D responde P4 y P5, usando los filtros de región y segmento."),
  p("b) Elegí estos 4 KPIs porque ventas y margen juntos muestran el problema (se vende más pero se gana menos), la utilidad lo pone en dinero y el descuento es la causa que sospecho."),
  p("c) La tabla va abajo porque es el detalle: primero se ve el resumen, luego los gráficos que lo explican y al final los datos para buscar productos o regiones puntuales."),
];

// ---------- document ----------
const doc = new Document({
  creator: AUTOR,
  lastModifiedBy: AUTOR,
  title: "Brief analítico RetailPro - Módulo 1",
  styles: { default: { document: { run: { font: FONT, size: 22 } } } },
  numbering: { config: [{ reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }] },
  sections: [{
    properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 18 })] })] }) },
    children: [...portada, ...s1, ...s2, ...s3, ...s4, ...s5],
  }],
});

Packer.toBuffer(doc).then(buf => { fs.writeFileSync(OUT, buf); console.log(`OK -> ${OUT}`); });
