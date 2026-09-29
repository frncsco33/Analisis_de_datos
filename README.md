# Analisis_de_datos — Proyecto RetailPro

Proyecto final del curso **Data Analytics** (Coderhouse, track Power BI).
RetailPro es un distribuidor ficticio de tecnología; cada módulo suma una pieza: brief → base de datos → análisis → dashboard ejecutivo.

Autor: Francisco Javier Salgado Acevedo

## Estructura

| Carpeta | Contenido |
|---|---|
| `docs/` | Contexto del proyecto (handoff, decisiones) |
| `m1_brief/` | Preentrega Módulo 1: brief analítico (`Brief_RetailPro_M1.docx`) y boceto del dashboard |

## Módulo 1 — Brief analítico

Pregunta diagnóstica: ¿por qué cayó el margen bruto en el último semestre, frente al semestre anterior, aunque las ventas crecieron?

Regenerar el entregable:

```bash
cd m1_brief
npm install          # solo la primera vez (instala docx)
npm run build        # python3 boceto.py && node build.js
```

Requisitos: Python 3 con `matplotlib` y `numpy`; Node 18+.
Nombre y fecha de entrega se editan en las constantes `AUTOR` y `FECHA` al inicio de `build.js`.

Los valores del boceto son ilustrativos: no hay datos reales todavía.
