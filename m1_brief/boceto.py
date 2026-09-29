import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
import numpy as np
fig=plt.figure(figsize=(12,8.2),dpi=160); ax=fig.add_axes([0,0,1,1]); ax.set_xlim(0,120); ax.set_ylim(0,82); ax.axis('off')
ink="#1f2937"; mute="#6b7280"; acc="#c2410c"; line="#9ca3af"
def box(x,y,w,h,fc="#ffffff",ec=line,lw=1.2):
    ax.add_patch(FancyBboxPatch((x,y),w,h,boxstyle="round,pad=0,rounding_size=0.8",fc=fc,ec=ec,lw=lw))
def zone(n,x,y):
    ax.add_patch(plt.Circle((x,y),1.6,color=acc)); ax.text(x,y,str(n),color="white",ha="center",va="center",fontsize=10,weight="bold")
box(1,1,118,80,fc="#f9fafb",ec="#d1d5db")
# Zona 1
box(3,72,114,7,fc="#eef2f7"); zone(1,5.5,75.5)
ax.text(8.5,75.5,"RetailPro | Rentabilidad por categoría",fontsize=12,weight="bold",color=ink,va="center")
for i,f in enumerate(["Período ▾","Región ▾","Categoría ▾","Segmento cliente ▾"]):
    box(60+i*14.2,73.3,13,4.4,fc="white"); ax.text(66.5+i*14.2,75.5,f,fontsize=8,ha="center",va="center",color=ink)
# Zona 2
zone(2,5.5,66)
kp=[("Ventas totales","$48.2 M","▲ 8.1% vs trim. ant.","#15803d"),("Margen bruto %","19.4%","▼ 4.6 pp vs trim. ant.",acc),
    ("Utilidad bruta","$9.4 M","▼ 12.3% vs trim. ant.",acc),("Descuento promedio","11.8%","▲ 3.9 pp vs trim. ant.",acc)]
for i,(t,v,d,c) in enumerate(kp):
    x=3+i*28.75; box(x,52,27,12,fc="white",ec=(acc if i==1 else line),lw=(2 if i==1 else 1.2))
    ax.text(x+1.5,61.5,t,fontsize=9,color=mute); ax.text(x+1.5,57,v,fontsize=18,weight="bold",color=ink); ax.text(x+1.5,53.8,d,fontsize=8.5,color=c)
# Zona 3
zone(3,5.5,48)
# chart A trend
box(3,24,44,22,fc="white"); ax.text(4.5,43.8,"A · Ventas vs margen % mensual",fontsize=9,weight="bold",color=ink)
ax.text(4.5,41.6,"Responde P1: ¿cuándo empezó a caer?",fontsize=7.5,color=mute,style="italic")
xs=np.linspace(6,44,12); v=27+np.linspace(0,6,12)+np.sin(np.arange(12))*0.6; m=np.r_[np.full(6,38),np.linspace(38,30,6)]+np.cos(np.arange(12))*0.4
ax.bar(xs,v-25,bottom=25,width=2.2,color="#cbd5e1"); ax.plot(xs,m,color=acc,lw=2); ax.plot(xs[6:],m[6:],"o",color=acc,ms=3)
ax.annotate("inicio caída",xy=(xs[6],m[6]),xytext=(xs[6]-9,m[6]+1.5),fontsize=7,color=acc,arrowprops=dict(arrowstyle="-",color=acc,lw=.8))
# chart B category
box(49,24,33,22,fc="white"); ax.text(50.5,43.8,"B · Δ margen (pp) por categoría",fontsize=9,weight="bold",color=ink)
ax.text(50.5,41.6,"Responde P2 y P4: ¿qué categoría lo explica?",fontsize=7.5,color=mute,style="italic")
cats=["Laptops","Celulares","Accesorios","Gaming","Periféricos"]; vals=[-2.1,-1.4,-0.6,-0.4,0.3]
for i,(c,val) in enumerate(zip(cats,vals)):
    y=37.5-i*2.9; ax.text(59,y,c,fontsize=7.5,ha="right",va="center",color=ink)
    ax.barh(y,val*4.5,left=71,height=1.8,color=(acc if val<0 else "#15803d"))
ax.plot([71,71],[25,39],color=mute,lw=.8)
# chart C scatter
box(84,24,33,22,fc="white"); ax.text(85.5,43.8,"C · Descuento % vs margen %",fontsize=9,weight="bold",color=ink)
ax.text(85.5,41.6,"Responde P3: ¿el descuento erosiona?",fontsize=7.5,color=mute,style="italic")
rng=np.random.default_rng(3); dx=rng.uniform(88,114,14); dy=39-(dx-88)*0.45+rng.normal(0,1.2,14)
ax.scatter(dx,dy,s=rng.uniform(15,80,14),color="#64748b",alpha=.7); ax.plot([88,114],[39,27.3],"--",color=acc,lw=1)
ax.text(114,25.5,"descuento →",fontsize=7,ha="right",color=mute); ax.text(86,39.8,"margen ↑",fontsize=7,color=mute)
# Zona 4
zone(4,5.5,20)
box(3,3,114,15.5,fc="white"); ax.text(4.5,16.5,"D · Detalle región × categoría  —  Responde P5 y P6 (tabla ordenable, sin protagonismo visual)",fontsize=9,weight="bold",color=ink)
hdr=["Región","Categoría","Ventas","Margen %","Δ pp","Desc. %","Top producto"]; cx=[5,20,38,52,65,76,88]
for x,h in zip(cx,hdr): ax.text(x,13.2,h,fontsize=8,weight="bold",color=mute)
ax.plot([4.5,115.5],[12.3,12.3],color=line,lw=.8)
rows=[["Norte","Laptops","$6.1 M","14.2%","-3.8","16.5%","Laptop 15\" gama media"],["Centro","Celulares","$8.4 M","17.9%","-2.2","13.1%","Smartphone 128GB"],["Sur","Accesorios","$2.3 M","31.5%","-0.9","8.4%","Cargador USB-C"]]
for j,r in enumerate(rows):
    for x,c in zip(cx,r): ax.text(x,10.2-j*2.6,c,fontsize=8,color=ink)
ax.text(116,1.9,"Valores ilustrativos — escenario de diseño, no datos reales",fontsize=7,ha="right",color=mute,style="italic")
fig.savefig("boceto.png",dpi=160)
