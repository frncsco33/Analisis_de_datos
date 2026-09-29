# Dashboard wireframe for the RetailPro M1 brief (v2).
# All numbers are illustrative design values, not real data.
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
import numpy as np

fig = plt.figure(figsize=(12, 8.2), dpi=160)
ax = fig.add_axes([0, 0, 1, 1]); ax.set_xlim(0, 120); ax.set_ylim(0, 82); ax.axis('off')
ink = "#1f2937"; mute = "#6b7280"; acc = "#c2410c"; pos = "#15803d"; line = "#9ca3af"; neutral = "#94a3b8"

def box(x, y, w, h, fc="#ffffff", ec=line, lw=1.2):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0,rounding_size=0.8", fc=fc, ec=ec, lw=lw))

def zone(n, x, y):
    ax.add_patch(plt.Circle((x, y), 1.6, color=acc))
    ax.text(x, y, str(n), color="white", ha="center", va="center", fontsize=10, weight="bold")

def chart_title(x, y, title, subtitle):
    ax.text(x, y, title, fontsize=9, weight="bold", color=ink)
    ax.text(x, y - 2.2, subtitle, fontsize=7.5, color=mute, style="italic")

box(1, 1, 118, 80, fc="#f9fafb", ec="#d1d5db")

# Zone 1: title + filters
box(3, 72, 114, 7, fc="#eef2f7"); zone(1, 5.5, 75.5)
ax.text(8.5, 75.5, "RetailPro | Rentabilidad por categoría", fontsize=12, weight="bold", color=ink, va="center")
for i, f in enumerate(["Período ▾", "Región ▾", "Categoría ▾", "Segmento cliente ▾"]):
    box(60 + i * 14.2, 73.3, 13, 4.4, fc="white")
    ax.text(66.5 + i * 14.2, 75.5, f, fontsize=8, ha="center", va="center", color=ink)

# Zone 2: KPI band (one visual element, 4 cards). Deltas are semester vs previous semester,
# matching the strategic question. Values are mutually consistent:
# 24.0% -> 19.4% margin (-4.6 pp); sales +8.1% => gross profit 1.081*19.4/24.0 - 1 = -12.6%.
zone(2, 5.5, 66)
kp = [("Ventas totales", "$48.2 M", "▲ 8.1% vs sem. ant.", pos),
      ("Margen bruto %", "19.4%", "▼ 4.6 pp vs sem. ant.", acc),
      ("Utilidad bruta", "$9.4 M", "▼ 12.6% vs sem. ant.", acc),
      ("Descuento prom. ponderado", "11.8%", "▲ 3.9 pp vs sem. ant.", acc)]
for i, (t, v, d, c) in enumerate(kp):
    x = 3 + i * 28.75
    box(x, 52, 27, 12, fc="white", ec=(acc if i == 1 else line), lw=(2 if i == 1 else 1.2))
    ax.text(x + 1.5, 61.5, t, fontsize=9, color=mute)
    ax.text(x + 1.5, 57, v, fontsize=18, weight="bold", color=ink)
    ax.text(x + 1.5, 53.8, d, fontsize=8.5, color=c)

# Zone 3
zone(3, 5.5, 48)

# Chart A: two aligned panels sharing the month axis (no dual y-axis)
box(3, 24, 44, 22, fc="white")
chart_title(4.5, 43.8, "A · Ventas y margen % por mes", "Responde P1: ¿cuándo empezó a caer y se sostiene?")
meses = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]
xs = np.linspace(8, 44, 12)
# H2 mean / H1 mean = 1.082, consistent with the +8.1% sales KPI (bars start at zero)
ventas = np.array([0.97, 0.99, 1.00, 1.01, 1.00, 1.03, 1.05, 1.07, 1.08, 1.09, 1.10, 1.10])
ax.text(4.5, 39.6, "Ventas (base 0)", fontsize=7, color=mute)
ax.bar(xs, ventas * 4.8, bottom=33.5, width=2.2, color=neutral)
ax.plot([6.5, 45.5], [33.5, 33.5], color=line, lw=.6)
margen = np.r_[np.full(6, 24.0), np.linspace(23.2, 18.6, 6)] + np.cos(np.arange(12)) * 0.25
my = 25.8 + (margen - 18) * 0.9
ax.text(4.5, 27.2, "Margen %", fontsize=7, color=mute)
ax.plot(xs, my, color=acc, lw=2)
ax.plot(xs[6:], my[6:], "o", color=acc, ms=3)
ax.plot([xs[5] + 1.6, xs[5] + 1.6], [25.2, 40], ":", color=mute, lw=.8)
ax.text(xs[5] + 2.1, 39.6, "sem. actual →", fontsize=6.5, color=mute)
ax.annotate("inicio caída", xy=(xs[6], my[6]), xytext=(xs[6] - 10, my[6] - 2.2), fontsize=7, color=acc,
            arrowprops=dict(arrowstyle="-", color=acc, lw=.8))
for x, m in zip(xs, meses):
    ax.text(x, 24.6, m, fontsize=6, ha="center", color=mute)

# Chart B: margin bridge previous -> current semester, split into mix effect and
# rate effect per category. Steps sum exactly to the KPI delta (-4.6 pp).
box(49, 24, 33, 22, fc="white")
chart_title(50.5, 43.8, "B · Puente de margen: mix vs tasa", "Responde P2 y P4: ¿qué categoría y qué efecto?")
steps = [("Sem. anterior", 24.0, "total"), ("Efecto mix", -0.4, "step"), ("Laptops", -2.1, "step"),
         ("Celulares", -1.4, "step"), ("Accesorios", -0.6, "step"), ("Gaming", -0.4, "step"),
         ("Periféricos", 0.3, "step"), ("Sem. actual", 19.4, "total")]
x0, scale, base = 63.5, 2.55, 18.0          # axis starts at 18% so pp steps are readable
px = lambda v: x0 + (v - base) * scale
run = 0.0
for i, (lab, val, kind) in enumerate(steps):
    y = 39.4 - i * 1.95
    ax.text(x0 - 0.8, y, lab, fontsize=7, ha="right", va="center", color=(acc if lab == "Efecto mix" else ink))
    if kind == "total":
        ax.barh(y, px(val) - x0, left=x0, height=1.3, color=neutral)
        ax.text(px(val) + 0.5, y, f"{val:.1f}%", fontsize=6.5, va="center", color=ink)
        run = val
    else:
        new = run + val
        ax.barh(y, px(new) - px(run), left=px(run), height=1.3, color=(acc if val < 0 else pos))
        ax.text(min(px(run), px(new)) - 0.4, y, f"{val:+.1f}", fontsize=6.5, ha="right", va="center", color=ink)
        run = new
ax.text(81, 24.8, "eje desde 18%", fontsize=6, ha="right", color=mute, style="italic")

# Chart C: discount vs margin, one point per category-month, trend line within each
# category (compares months inside a category, not categories against each other).
box(84, 24, 33, 22, fc="white")
chart_title(85.5, 43.8, "C · Descuento % vs margen %", "Responde P3: dentro de cada categoría")
rng = np.random.default_rng(3)
cats = [("Accesorios", 38.0), ("Periféricos", 35.6), ("Gaming", 33.2), ("Celulares", 30.8), ("Laptops", 28.4)]
for name, y0 in cats:
    dx = rng.uniform(90, 110, 12)
    dy = y0 - (dx - 90) * 0.09 + rng.normal(0, 0.25, 12)
    ax.scatter(dx, dy, s=9, color="#64748b", alpha=.75, lw=0)
    ax.plot([90, 110], [y0, y0 - 1.8], "--", color=acc, lw=.9)
    ax.text(110.6, y0 - 1.8, name, fontsize=6, va="center", color=ink)
ax.plot([88.5, 88.5], [26, 39.5], color=line, lw=.6); ax.plot([88.5, 110], [26, 26], color=line, lw=.6)
ax.text(110, 24.8, "descuento % →", fontsize=6.5, ha="right", color=mute)
ax.text(86, 39.8, "margen % ↑", fontsize=6.5, color=mute)
ax.text(86, 24.8, "1 punto = categoría-mes", fontsize=6, color=mute, style="italic")

# Zone 4: detail table at product grain (answers P6; P5 via region column + segment filter)
zone(4, 5.5, 20)
box(3, 3, 114, 15.5, fc="white")
ax.text(4.5, 16.5, "D · Detalle región × categoría × producto  —  Responde P5 y P6 (ordenable; por defecto: más unidades con margen bajo el promedio)",
        fontsize=8.5, weight="bold", color=ink)
hdr = ["Región", "Categoría", "Producto", "Unidades", "Ventas", "Margen %", "vs prom. cat. (pp)", "Desc. %"]
cx = [5, 17, 30, 58, 69, 80, 91, 106]
for x, h in zip(cx, hdr):
    ax.text(x, 13.2, h, fontsize=8, weight="bold", color=mute)
ax.plot([4.5, 115.5], [12.3, 12.3], color=line, lw=.8)
rows = [["Norte", "Laptops", "Laptop 15\" gama media", "4,820", "$3.9 M", "11.8%", "-4.2", "17.5%"],
        ["Centro", "Celulares", "Smartphone 128GB", "7,310", "$4.6 M", "15.1%", "-3.1", "14.0%"],
        ["Sur", "Accesorios", "Cargador USB-C", "15,940", "$0.6 M", "29.3%", "-2.4", "9.2%"]]
for j, r in enumerate(rows):
    for x, c in zip(cx, r):
        ax.text(x, 10.2 - j * 2.6, c, fontsize=8, color=(acc if x == 91 else ink))

ax.text(116, 1.9, "Valores ilustrativos: escenario de diseño, no datos reales", fontsize=7, ha="right", color=mute, style="italic")
fig.savefig("boceto.png", dpi=160)
