import React, { useState, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
    Target, Store, ChevronRight, ChevronLeft, Plus, Trash2, List, Sparkles,
    Bot, Loader2, Award, Clock, Gift, CreditCard, Megaphone, Settings,
    CheckCircle2, Upload, FileSpreadsheet, Info
} from 'lucide-react';
import { generateMockStrategyData, generateMockMarketingPlan } from '../utils/aiHelpers';
import { supabase } from '../lib/supabase';


// UI Components
const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>{children}</div>
);

const SectionTitle = ({ icon: Icon, title, subtitle, colorClass = "text-indigo-600 bg-indigo-100" }: any) => (
    <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
            <div className={`p-2 rounded-lg ${colorClass}`}><Icon size={20} /></div>
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        </div>
        {subtitle && <p className="text-slate-500 text-sm ml-11">{subtitle}</p>}
    </div>
);

const InputGroup = ({ label, prefix, suffix, value, onChange, type = "number", hint, step = "1", className = "" }: any) => (
    <div className={`mb-4 ${className}`}>
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <div className="relative rounded-md shadow-sm">
            {prefix && <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><span className="text-slate-500 sm:text-sm">{prefix}</span></div>}
            <input type={type} step={step} className={`block w-full rounded-md border-slate-300 py-2.5 ${prefix ? 'pl-7' : 'pl-3'} ${suffix ? 'pr-12' : 'pr-3'} ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} value={value} onChange={(e) => onChange(e.target.value)} />
            {suffix && <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><span className="text-slate-500 sm:text-sm">{suffix}</span></div>}
        </div>
        {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
);

const SelectGroup = ({ label, options, value, onChange, hint }: any) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <select className="block w-full rounded-md border-slate-300 py-2.5 pl-3 pr-10 ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={value} onChange={(e) => onChange(e.target.value)}>
            {options.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
);

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function Simulator() {
    const [step, setStep] = useState(1);
    const [aiLoading, setAiLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const store = useAppStore();

    const totalSteps = 6;
    const presupuestoMarketing = (store.facturacionMensual * store.presupuestoMarketingPorcentaje) / 100;

    // Descargar plantilla CSV
    const downloadTemplate = () => {
        const template = `Nombre;Categoria;Costo;Precio;Ventas
Café Americano;Bebidas;0.80;3.50;450
Cerveza Artesanal;Bebidas;1.20;5.00;320
Hamburguesa Clásica;Platos;5.00;15.00;180
Pizza Margarita;Platos;4.50;14.00;150
Patatas Bravas;Tapas;1.80;6.00;145
Ensalada Gourmet;Platos;3.00;12.00;15
Brownie Chocolate;Postres;1.50;5.00;110`;

        const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'plantilla_productos_omnia.csv';
        link.click();
    };

    // Función para procesar archivo Excel/CSV
    const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const lines = text.split('\n').filter(line => line.trim());

            // Detectar separador (coma o punto y coma)
            const separator = lines[0].includes(';') ? ';' : ',';

            // Parsear cabeceras
            const headers = lines[0].split(separator).map(h => h.trim().toLowerCase());

            // Buscar índices de columnas
            const nombreIdx = headers.findIndex(h => h.includes('nombre') || h.includes('producto') || h.includes('name'));
            const categoriaIdx = headers.findIndex(h => h.includes('categoria') || h.includes('category'));
            const costoIdx = headers.findIndex(h => h.includes('costo') || h.includes('cost') || h.includes('coste'));
            const precioIdx = headers.findIndex(h => h.includes('precio') || h.includes('price') || h.includes('venta') || h.includes('pvp'));
            const ventasIdx = headers.findIndex(h => h.includes('venta') || h.includes('sales') || h.includes('cantidad'));

            if (nombreIdx === -1 || costoIdx === -1 || precioIdx === -1) {
                alert('El archivo debe tener columnas: Nombre/Producto, Costo/Coste, Precio/PVP');
                return;
            }

            // Parsear TODOS los productos
            const productos = lines.slice(1).map((line, idx) => {
                const cols = line.split(separator).map(c => c.trim().replace(/"/g, ''));
                const costo = parseFloat(cols[costoIdx]?.replace(',', '.')) || 0;
                const precio = parseFloat(cols[precioIdx]?.replace(',', '.')) || 0;
                const ventas = parseInt(cols[ventasIdx]) || 0;
                const margen = precio > 0 ? ((precio - costo) / precio) * 100 : 0;

                return {
                    id: idx + 1,
                    nombre: cols[nombreIdx] || `Producto ${idx + 1}`,
                    categoria: cols[categoriaIdx] || 'General',
                    costo,
                    precioVenta: precio,
                    ventasMensuales: ventas,
                    margen,
                    tipo: 'top_ventas' as const,
                    posicionRanking: idx + 1
                };
            }).filter(p => p.nombre && p.costo > 0 && p.precioVenta > 0);

            if (productos.length === 0) {
                alert('No se encontraron productos válidos en el archivo');
                return;
            }

            // Ordenar por ventas
            productos.sort((a, b) => b.ventasMensuales - a.ventasMensuales);

            // Asignar rankings
            const allProducts = productos.map((p, i) => ({ ...p, posicionRanking: i + 1 }));

            // Top 10 = más vendidos, Peor 10 = menos vendidos
            const topProducts = allProducts.slice(0, 10).map(p => ({ ...p, tipo: 'top_ventas' as const }));
            const worstProducts = allProducts.slice(-10).reverse().map((p, i) => ({
                ...p,
                id: p.id + 10000,  // IDs únicos para evitar conflictos
                tipo: 'bajo_ventas' as const,
                posicionRanking: -(i + 1)
            }));

            // Guardar TODOS los productos
            store.setField('allProducts', allProducts);

            // Guardar top/worst para la UI simplificada
            store.setField('keyProducts', [...topProducts, ...worstProducts]);

            // Crear categorías únicas
            const categorias = [...new Set(productos.map(p => p.categoria))];
            const priceRanges = categorias.map((cat, idx) => {
                const catProducts = productos.filter(p => p.categoria === cat);
                const avgCosto = catProducts.reduce((sum, p) => sum + p.costo, 0) / catProducts.length;
                const avgPrecio = catProducts.reduce((sum, p) => sum + p.precioVenta, 0) / catProducts.length;
                const totalVentas = catProducts.reduce((sum, p) => sum + p.ventasMensuales, 0);
                return {
                    id: idx + 1,
                    nombre: cat,
                    costoPromedio: Math.round(avgCosto * 100) / 100,
                    precioVentaPromedio: Math.round(avgPrecio * 100) / 100,
                    ventasMensuales: totalVentas,
                    margenPromedio: avgPrecio > 0 ? ((avgPrecio - avgCosto) / avgPrecio) * 100 : 0
                };
            });

            store.setField('priceRanges', priceRanges);

            alert(`✅ Importados ${productos.length} productos en ${categorias.length} categorías\n\nTop 10 y Peor 10 seleccionados automáticamente`);
        };

        reader.readAsText(file);
        event.target.value = ''; // Reset input

    };


    // Generar estrategia con IA
    const generateAIStrategy = async () => {
        setAiLoading(true);
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

        if (!apiKey) {
            console.warn('API Key not found, using mock data');
            generateMockStrategy();
            return;
        }

        const config = store.strategyConfig;
        const schedule = store.businessSchedule;

        const prompt = `Actúa como Consultor de Marketing Estratégico experto en gamificación y fidelización para hostelería/retail.

DATOS DEL NEGOCIO:
- Tipo: ${store.businessType === 'horeca' ? 'Hostelería' : 'Retail'}
- Objetivo Principal: ${{
                captacion: 'Captación de Nuevos Clientes',
                frecuencia: 'Frecuencia y Recurrencia',
                ticket_medio: 'Aumento de Ticket Medio (Upselling)',
                resenas: 'Generación de Reseñas Positivas',
                viralidad: 'Viralidad en Redes Sociales',
                fidelizacion: 'Fidelización a Largo Plazo',
                horas_valle: 'Optimización de Horas Valle',
                lanzamiento: 'Lanzamiento de Nuevos Productos'
            }[store.objetivoPrincipal] || 'Captación'}

- Facturación Mensual: €${store.facturacionMensual}
- Presupuesto Marketing: €${presupuestoMarketing.toFixed(0)} (${store.presupuestoMarketingPorcentaje}%)
- Ticket Promedio: €${store.ticketPromedio}
- Comensales por Mesa: ${store.comensalesMesa} (solo si aplica)
- Tráfico Mensual: ${store.traficoMensual} clientes/mes
- Margen Promedio: ${store.margenPromedio}%


HORARIOS DEL NEGOCIO:
- Días flojos: ${schedule.diasFlojos.join(', ')}
- Horas flojas: ${schedule.horasFlojas}
- Días llenos: ${schedule.diasLlenos.join(', ')}
- Horas llenas: ${schedule.horasLlenas}

CONFIGURACIÓN SOLICITADA:
- Número de juegos: ${config.numJuegos} (siempre incluir bienvenida)
- Número de cupones: ${config.numCupones}
- Número de vales: ${config.numVales}
- Tarjeta de sellos: ${config.tarjetaSellos ? 'Sí' : 'No'}
- Tarjeta de puntos: ${config.tarjetaPuntos ? 'Sí' : 'No'}
- Validez cupones: ${config.validezCuponesDias} días
- Gasto mínimo bienvenida: €${config.gastoMinBienvenida}
- Gasto mínimo ticket QR: €${config.gastoMinTicketQR}
- Nivel de Datos: ${store.dataCollection} (none/basic/complete)
- Método de Validación: ${store.validationMethod} (screen/qr_secure/stamp)

RANGOS DE PRECIO (${store.priceRanges.length} categorías):
${store.priceRanges.map(r => `- ${r.nombre}: €${r.costoPromedio} costo, €${r.precioVentaPromedio} venta, ${r.ventasMensuales} ventas/mes (${r.margenPromedio.toFixed(1)}% margen)`).join('\n')}

${store.allProducts.length > 0 ? `TODOS LOS PRODUCTOS (${store.allProducts.length} productos):
${store.allProducts.slice(0, 50).map((p, i) => `${i + 1}. ${p.nombre} (${p.categoria}): ${p.ventasMensuales} ventas/mes, €${p.precioVenta}, costo €${p.costo}, ${p.margen.toFixed(1)}% margen`).join('\n')}
${store.allProducts.length > 50 ? `... y ${store.allProducts.length - 50} productos más` : ''}` : `TOP 10 PRODUCTOS MÁS VENDIDOS:
${store.keyProducts.filter(p => p.tipo === 'top_ventas').map((p, i) => `${i + 1}. ${p.nombre} (${p.categoria}): ${p.ventasMensuales} ventas/mes, €${p.precioVenta}, ${p.margen.toFixed(1)}% margen`).join('\n')}

TOP 10 PRODUCTOS PEOR VENTA:
${store.keyProducts.filter(p => p.tipo === 'bajo_ventas').map((p, i) => `${i + 1}. ${p.nombre} (${p.categoria}): ${p.ventasMensuales} ventas/mes, €${p.precioVenta}, ${p.margen.toFixed(1)}% margen`).join('\n')}`}


REGLAS DE LA ESTRATEGIA:
1. JUEGO BIENVENIDA: Obligatorio, SIEMPRE GANA, todos los premios tienen gasto mínimo €${config.gastoMinBienvenida}, se convierten en cupones para canjear en próxima visita
2. JUEGO TICKET QR: Impreso en ticket, premios con probabilidades, gasto mínimo basado en ticket medio (€${store.ticketPromedio}), se convierten en cupones para próxima visita
3. CUPONES: Solo válidos en horarios flojos (${schedule.diasFlojos.join(', ')} ${schedule.horasFlojas}), pueden tener gasto mínimo o no
4. VALES (CHEQUES REGALO): Son como dinero en efectivo, SIN gasto mínimo, valor fijo que se descuenta de la cuenta
5. TARJETA SELLOS: Solo para consumidores del producto específico (ej: menú del día), se muestra automáticamente
6. TARJETA PUNTOS: General, entregada por camarero QR en barra

IMPORTANTE PARA PREMIOS DE JUEGOS:
- Cada premio del juego debe tener su propio "minGasto" recomendado
- Para Juego Bienvenida: minGasto siempre €${config.gastoMinBienvenida}
- Para Juego Ticket QR: minGasto debe ser proporcional al ticket medio (€${store.ticketPromedio}) para generar upsell


Responde SOLO con JSON válido (sin markdown):
{
  "analisisGeneral": "Análisis completo del negocio...",
  "juegos": [
    {
      "id": 1,
      "tipo": "bienvenida",
      "nombre": "Ruleta de Bienvenida",
      "mecanica": "Ruleta",
      "ubicacion": "Mesa/Directorio/RRSS",
      "siempreGana": true,
      "gastoMinimo": 5,
      "canjeProximaVisita": true,
      "premios": [/* 7 premios con id, nombre, tipo, productoObjetivo, costo, minGasto, probabilidad, razonamiento */],
      "razonamiento": "..."
    }
  ],
  "cupones": [
    {
      "id": 1,
      "nombre": "Café Gratis",
      "descripcion": "...",
      "tipo": "regalo",
      "valor": "Gratis",
      "horariosValidos": "Lunes-Miércoles 15:00-19:00",
      "validezDias": 30,
      "gastoMinimo": 0,
      "razonamiento": "..."
    }
  ],
  "vales": [
    {
      "id": 1,
      "nombre": "Cheque Regalo 5€",
      "valorEuros": 5,
      "validezDias": 30,
      "razonamiento": "Cheque regalo sin gasto mínimo, como dinero en efectivo..."
    }
  ],

  "tarjetaSellos": ${config.tarjetaSellos ? `{
    "tipo": "sellos",
    "nombre": "Tarjeta Menú del Día",
    "productoAsociado": "Menú del día",
    "numSellosParaPremio": 10,
    "puntosPorEuro": 0,
    "puntosParaPremio": 0,
    "premioFinal": "1 Menú gratis",
    "visibilidad": "Solo consumidores del producto",
    "entrega": "Automática",
    "razonamiento": "..."
  }` : 'null'},
  "tarjetaPuntos": ${config.tarjetaPuntos ? `{
    "tipo": "puntos",
    "nombre": "Club de Puntos",
    "productoAsociado": null,
    "numSellosParaPremio": 0,
    "puntosPorEuro": 1,
    "puntosParaPremio": 100,
    "premioFinal": "5€ de descuento",
    "visibilidad": "General",
    "entrega": "Camarero muestra QR",
    "razonamiento": "..."
  }` : 'null'},
  "productosGancho": ["..."],
  "productosImpulsar": ["..."],
  "roiEstimado": 3.5,
  "resumenEstrategia": "Resumen ejecutivo de la estrategia..."
}`;

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                }
            );

            if (!response.ok) throw new Error(`API Error: ${response.status}`);

            const data = await response.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const recommendation = JSON.parse(jsonText);
            store.setAIRecommendation(recommendation);
            setStep(6);
        } catch (error) {
            console.error('Error calling AI:', error);
            console.log('API Key loaded:', apiKey ? `Yes (${apiKey.length} chars, starts with ${apiKey.substring(0, 4)}...)` : 'No');
            // Fallback con datos de ejemplo
            generateMockStrategy();
        } finally {
            setAiLoading(false);
        }
    };

    // Mock strategy cuando falla la API
    const generateMockStrategy = () => {
        const mockStrategy = generateMockStrategyData(store);
        store.setAIRecommendation(mockStrategy);
        setStep(6);
        alert('⚠️ Usando datos simulados (API no disponible) adaptados a tu objetivo.');
    };


    // Generar Plan de Marketing con IA
    const [marketingLoading, setMarketingLoading] = useState(false);

    const generateMarketingPlan = async () => {
        setMarketingLoading(true);
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

        if (!apiKey) {
            console.warn('API Key not found, using mock marketing plan');
            const mockPlan = generateMockMarketingPlan(store);
            store.setMarketingPlan(mockPlan);
            alert('⚠️ Plan de Marketing generado con datos simulados (API no disponible)');
            setMarketingLoading(false);
            return;
        }

        const schedule = store.businessSchedule;
        const prompt = `Actúa como Experto en Marketing Digital para ${store.businessType === 'horeca' ? 'Hostelería' : 'Retail'}.

DATOS DEL NEGOCIO:
- Tipo: ${store.businessType === 'horeca' ? 'Hostelería' : 'Retail'}
- Objetivo: ${{
                captacion: 'Captación de Nuevos Clientes',
                frecuencia: 'Frecuencia y Recurrencia',
                ticket_medio: 'Aumento de Ticket Medio (Upselling)',
                resenas: 'Generación de Reseñas Positivas',
                viralidad: 'Viralidad en Redes Sociales',
                fidelizacion: 'Fidelización a Largo Plazo',
                horas_valle: 'Optimización de Horas Valle',
                lanzamiento: 'Lanzamiento de Nuevos Productos'
            }[store.objetivoPrincipal] || 'Captación'}

- Facturación: €${store.facturacionMensual}/mes
- Presupuesto Marketing: €${presupuestoMarketing.toFixed(0)}/mes
- Ticket Promedio: €${store.ticketPromedio}
- Comensales/Mesa: ${store.comensalesMesa}
- Tráfico: ${store.traficoMensual} clientes/mes
- Días flojos: ${schedule.diasFlojos.join(', ')} (${schedule.horasFlojas})
- Días llenos: ${schedule.diasLlenos.join(', ')} (${schedule.horasLlenas})

PRODUCTOS TOP (usar para promociones):
${store.keyProducts.filter(p => p.tipo === 'top_ventas').slice(0, 5).map(p => `- ${p.nombre}: €${p.precioVenta}`).join('\n')}

CREA UN PLAN DE MARKETING PARA 1 MES con:
1. 8 posts para Instagram/Facebook (orgánico)
2. 4 stories con engagement
3. 2 ideas de reels virales
4. 2 campañas de Ads (Meta/Google)

Responde SOLO con JSON válido:
{
  "organico": {
    "posts": [
      {"idea": "Título del post", "copy": "Texto completo del post con emojis...", "creativoSugerido": "Descripción de la imagen/video", "mejorDia": "Lunes 12:00"}
    ],
    "stories": [
      {"idea": "Título", "copy": "Texto con call to action", "stickers": "encuesta, quiz, etc"}
    ],
    "reels": [
      {"idea": "Concepto viral", "guion": "Paso a paso del video", "duracion": "15-30 seg", "audio": "Sugerencia de audio trending"}
    ]
  },
  "pago": {
    "campanas": [
      {
        "objetivo": "Captación / Retargeting",
        "segmentacion": "Descripción del público",
        "copy": "Texto del anuncio",
        "creativoSugerido": "Tipo de creative",
        "presupuestoSugerido": "€X/día durante X días"
      }
    ]
  },
  "acciones": ["Acción de marketing offline 1", "Acción 2"],
  "calendarioSemanal": "Resumen de cuándo publicar qué"
}`;

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                }
            );

            if (!response.ok) throw new Error(`API Error: ${response.status}`);

            const data = await response.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const plan = JSON.parse(jsonText);
            store.setMarketingPlan(plan);
            alert('✅ Plan de Marketing generado!');
        } catch (error) {
            console.error('Error generating marketing plan:', error);
            // Mock plan dinámico
            const mockPlan = generateMockMarketingPlan(store);
            store.setMarketingPlan(mockPlan);
            alert('⚠️ Plan de Marketing generado con datos simulados (adaptado a tu objetivo)');
        } finally {
            setMarketingLoading(false);
        }

    };

    // Guardar estrategia en Supabase
    const [saving, setSaving] = useState(false);

    const saveStrategy = async () => {
        if (!store.aiRecommendation) return;

        setSaving(true);
        try {
            const { error } = await supabase
                .from('strategies')
                .insert([
                    {
                        business_name: 'Mi Negocio', // Podríamos añadir un campo para esto
                        business_type: store.businessType,
                        strategy_data: store.aiRecommendation,
                        marketing_plan: store.marketingPlan || {}
                    }
                ]);

            if (error) throw error;
            alert('✅ Estrategia guardada correctamente en la nube');
        } catch (error) {
            console.error('Error saving strategy:', error);
            alert('❌ Error al guardar la estrategia');
        } finally {
            setSaving(false);
        }
    };

    const topVentas = store.keyProducts.filter(p => p.tipo === 'top_ventas');
    const bajoVentas = store.keyProducts.filter(p => p.tipo === 'bajo_ventas');


    // PASO 1: Perfil Negocio + Horarios
    const renderStep1 = () => (
        <div className="animate-fadeIn">
            <SectionTitle icon={Store} title="Perfil del Negocio" subtitle="Datos básicos y horarios" colorClass="text-blue-600 bg-blue-100" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <SelectGroup label="Tipo de Negocio" options={[{ value: 'horeca', label: '🍽️ Hostelería (Bar, Restaurante, Café)' }, { value: 'retail', label: '🛍️ Retail (Tienda)' }]} value={store.businessType} onChange={(v: any) => store.setField('businessType', v)} />
                <InputGroup label="Facturación Mensual" prefix="€" value={store.facturacionMensual} onChange={(v: any) => store.setField('facturacionMensual', parseFloat(v) || 0)} />
                <InputGroup label="Ticket Promedio" prefix="€" value={store.ticketPromedio} onChange={(v: any) => store.setField('ticketPromedio', parseFloat(v) || 0)} />
                <InputGroup label="Tráfico Mensual" suffix="clientes" value={store.traficoMensual} onChange={(v: any) => store.setField('traficoMensual', parseInt(v) || 0)} />
                <InputGroup label="Margen Promedio" suffix="%" value={store.margenPromedio} onChange={(v: any) => store.setField('margenPromedio', parseFloat(v) || 0)} />
                <InputGroup label="Presupuesto Marketing" suffix="%" value={store.presupuestoMarketingPorcentaje} onChange={(v: any) => store.setField('presupuestoMarketingPorcentaje', parseFloat(v) || 0)} hint={`= €${presupuestoMarketing.toFixed(0)}/mes`} />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-amber-800 flex items-center gap-2 mb-3"><Clock size={18} /> Horarios del Negocio</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">Días Flojos (baja afluencia)</label>
                        <div className="flex flex-wrap gap-2">
                            {DIAS_SEMANA.map(dia => (
                                <button key={dia} onClick={() => {
                                    const current = store.businessSchedule.diasFlojos;
                                    const updated = current.includes(dia) ? current.filter(d => d !== dia) : [...current, dia];
                                    store.updateSchedule('diasFlojos', updated);
                                }} className={`px-3 py-1 rounded-full text-xs font-medium transition ${store.businessSchedule.diasFlojos.includes(dia) ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                    {dia.substring(0, 3)}
                                </button>
                            ))}
                        </div>
                        <input type="text" placeholder="Horas flojas (ej: 15:00-19:00)" className="mt-2 w-full text-sm p-2 border rounded" value={store.businessSchedule.horasFlojas} onChange={e => store.updateSchedule('horasFlojas', e.target.value)} />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">Días Llenos (alta afluencia)</label>
                        <div className="flex flex-wrap gap-2">
                            {DIAS_SEMANA.map(dia => (
                                <button key={dia} onClick={() => {
                                    const current = store.businessSchedule.diasLlenos;
                                    const updated = current.includes(dia) ? current.filter(d => d !== dia) : [...current, dia];
                                    store.updateSchedule('diasLlenos', updated);
                                }} className={`px-3 py-1 rounded-full text-xs font-medium transition ${store.businessSchedule.diasLlenos.includes(dia) ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                    {dia.substring(0, 3)}
                                </button>
                            ))}
                        </div>
                        <input type="text" placeholder="Horas llenas (ej: 13:00-15:00, 20:00-23:00)" className="mt-2 w-full text-sm p-2 border rounded" value={store.businessSchedule.horasLlenas} onChange={e => store.updateSchedule('horasLlenas', e.target.value)} />
                    </div>
                </div>
            </div>
        </div>
    );

    // PASO 2: Rangos de Precio
    const renderStep2 = () => (
        <div className="animate-fadeIn">
            <SectionTitle icon={List} title="Categorías de Productos" subtitle="Define tus rangos de precio por categoría" colorClass="text-orange-600 bg-orange-100" />

            {/* Opción de subir Excel */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <FileSpreadsheet size={24} className="text-blue-600" />
                        <div>
                            <h4 className="font-bold text-blue-800">¿Tienes un listado de productos?</h4>
                            <p className="text-xs text-blue-600">Sube un CSV con: Nombre, Categoría, Costo, Precio, Ventas</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={downloadTemplate} className="bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-sm flex items-center gap-1 hover:bg-slate-200">
                            📥 Descargar Plantilla
                        </button>
                        <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                            <Upload size={16} /> Subir CSV
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept=".csv"
                                onChange={handleExcelUpload}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>
                {store.allProducts.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                        <p className="text-sm text-blue-700">
                            ✅ <strong>{store.allProducts.length} productos</strong> importados en <strong>{store.priceRanges.length} categorías</strong>
                        </p>
                    </div>
                )}
            </div>

            <div className="flex justify-end mb-3">
                <button onClick={store.addPriceRange} className="text-sm bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-700"><Plus size={16} /> Añadir Categoría</button>

            </div>
            {store.priceRanges.length > 0 && (
                <div className="flex gap-2 mb-2 px-2 text-[10px] font-bold text-slate-500">
                    <div className="w-1/4">NOMBRE</div><div className="w-1/6">COSTO €</div><div className="w-1/6">VENTA €</div><div className="w-1/6">VENTAS/MES</div><div className="w-1/8">MARGEN</div>
                </div>
            )}
            {store.priceRanges.map(r => (
                <div key={r.id} className="flex gap-2 items-center mb-2 p-2 bg-orange-50 rounded border border-orange-200">
                    <input type="text" className="w-1/4 text-sm p-2 border rounded" value={r.nombre} onChange={e => store.updatePriceRange(r.id, 'nombre', e.target.value)} placeholder="Categoría" />
                    <input type="number" step="0.1" className="w-1/6 text-sm p-2 border rounded" value={r.costoPromedio} onChange={e => store.updatePriceRange(r.id, 'costoPromedio', parseFloat(e.target.value) || 0)} />
                    <input type="number" step="0.1" className="w-1/6 text-sm p-2 border rounded" value={r.precioVentaPromedio} onChange={e => store.updatePriceRange(r.id, 'precioVentaPromedio', parseFloat(e.target.value) || 0)} />
                    <input type="number" className="w-1/6 text-sm p-2 border rounded" value={r.ventasMensuales} onChange={e => store.updatePriceRange(r.id, 'ventasMensuales', parseInt(e.target.value) || 0)} />
                    <span className="w-1/8 text-xs font-bold text-green-600">{r.margenPromedio.toFixed(1)}%</span>
                    <button onClick={() => store.removePriceRange(r.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
            ))}
        </div>
    );

    // PASO 3: Productos Clave
    const renderStep3 = () => (
        <div className="animate-fadeIn">
            <SectionTitle icon={Sparkles} title="Productos Clave" subtitle="Top 10 más vendidos y 10 con peores ventas" colorClass="text-emerald-600 bg-emerald-100" />

            {store.allProducts.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-green-700">
                        ✅ <strong>{store.allProducts.length} productos</strong> importados del Excel.
                        Se han seleccionado automáticamente los <strong>10 más vendidos</strong> y los <strong>10 con menos ventas</strong>.
                    </p>
                    <p className="text-xs text-green-600 mt-1">Puedes editar la selección manualmente si lo deseas.</p>
                </div>
            )}

            {/* Top Ventas */}

            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-bold text-emerald-700">⭐ Top 10 Más Vendidos</h3>
                    <button onClick={() => store.addKeyProduct('top_ventas')} disabled={topVentas.length >= 10} className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded flex items-center gap-1 hover:bg-emerald-700 disabled:opacity-50"><Plus size={14} /> Añadir</button>
                </div>
                {topVentas.length > 0 && <div className="flex gap-2 mb-1 px-2 text-[10px] font-bold text-slate-500"><div className="w-1/4">NOMBRE</div><div className="w-1/6">CATEGORÍA</div><div className="w-1/8">COSTO €</div><div className="w-1/8">VENTA €</div><div className="w-1/8">VENTAS/MES</div><div className="w-auto">MARGEN</div></div>}
                {topVentas.map(p => (
                    <div key={p.id} className="flex gap-2 items-center mb-2 p-2 bg-emerald-50 rounded border border-emerald-200">
                        <input type="text" className="w-1/4 text-sm p-2 border rounded" value={p.nombre} onChange={e => store.updateKeyProduct(p.id, 'nombre', e.target.value)} placeholder="Nombre" />
                        <select className="w-1/6 text-sm p-2 border rounded" value={p.categoria} onChange={e => store.updateKeyProduct(p.id, 'categoria', e.target.value)}>
                            <option value="">Categoría</option>
                            {store.priceRanges.map(r => <option key={r.id} value={r.nombre}>{r.nombre}</option>)}
                        </select>
                        <input type="number" step="0.1" className="w-1/8 text-sm p-2 border rounded" value={p.costo} onChange={e => store.updateKeyProduct(p.id, 'costo', parseFloat(e.target.value) || 0)} />
                        <input type="number" step="0.1" className="w-1/8 text-sm p-2 border rounded" value={p.precioVenta} onChange={e => store.updateKeyProduct(p.id, 'precioVenta', parseFloat(e.target.value) || 0)} />
                        <input type="number" className="w-1/8 text-sm p-2 border rounded" value={p.ventasMensuales} onChange={e => store.updateKeyProduct(p.id, 'ventasMensuales', parseInt(e.target.value) || 0)} />
                        <span className="text-xs font-bold text-green-600">{p.margen.toFixed(1)}%</span>
                        <button onClick={() => store.removeKeyProduct(p.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                ))}
            </div>

            {/* Bajo Ventas */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-bold text-red-700">📉 Top 10 Peor Venta</h3>
                    <button onClick={() => store.addKeyProduct('bajo_ventas')} disabled={bajoVentas.length >= 10} className="text-xs bg-red-600 text-white px-3 py-1.5 rounded flex items-center gap-1 hover:bg-red-700 disabled:opacity-50"><Plus size={14} /> Añadir</button>
                </div>
                {bajoVentas.length > 0 && <div className="flex gap-2 mb-1 px-2 text-[10px] font-bold text-slate-500"><div className="w-1/4">NOMBRE</div><div className="w-1/6">CATEGORÍA</div><div className="w-1/8">COSTO €</div><div className="w-1/8">VENTA €</div><div className="w-1/8">VENTAS/MES</div><div className="w-auto">MARGEN</div></div>}
                {bajoVentas.map(p => (
                    <div key={p.id} className="flex gap-2 items-center mb-2 p-2 bg-red-50 rounded border border-red-200">
                        <input type="text" className="w-1/4 text-sm p-2 border rounded" value={p.nombre} onChange={e => store.updateKeyProduct(p.id, 'nombre', e.target.value)} placeholder="Nombre" />
                        <select className="w-1/6 text-sm p-2 border rounded" value={p.categoria} onChange={e => store.updateKeyProduct(p.id, 'categoria', e.target.value)}>
                            <option value="">Categoría</option>
                            {store.priceRanges.map(r => <option key={r.id} value={r.nombre}>{r.nombre}</option>)}
                        </select>
                        <input type="number" step="0.1" className="w-1/8 text-sm p-2 border rounded" value={p.costo} onChange={e => store.updateKeyProduct(p.id, 'costo', parseFloat(e.target.value) || 0)} />
                        <input type="number" step="0.1" className="w-1/8 text-sm p-2 border rounded" value={p.precioVenta} onChange={e => store.updateKeyProduct(p.id, 'precioVenta', parseFloat(e.target.value) || 0)} />
                        <input type="number" className="w-1/8 text-sm p-2 border rounded" value={p.ventasMensuales} onChange={e => store.updateKeyProduct(p.id, 'ventasMensuales', parseInt(e.target.value) || 0)} />
                        <span className="text-xs font-bold text-green-600">{p.margen.toFixed(1)}%</span>
                        <button onClick={() => store.removeKeyProduct(p.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                ))}
            </div>
        </div>
    );

    // PASO 4: Configuración Estrategia
    const renderStep4 = () => (
        <div className="animate-fadeIn">
            <SectionTitle icon={Settings} title="Configuración de Estrategia" subtitle="Define qué elementos incluir en tu estrategia" colorClass="text-purple-600 bg-purple-100" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                    <label className="font-bold text-indigo-800 flex items-center gap-2 mb-2"><Gift size={18} /> Juegos</label>
                    <select className="w-full p-2 border rounded" value={store.strategyConfig.numJuegos} onChange={e => store.updateStrategyConfig('numJuegos', parseInt(e.target.value))}>
                        <option value={1}>1 - Solo Bienvenida</option>
                        <option value={2}>2 - Bienvenida + Ticket QR</option>
                    </select>
                    <p className="text-xs text-indigo-600 mt-1">Cada juego tiene 7 premios</p>
                </div>

                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <label className="font-bold text-amber-800 flex items-center gap-2 mb-2"><Award size={18} /> Cupones</label>
                    <input type="number" min="0" max="10" className="w-full p-2 border rounded" value={store.strategyConfig.numCupones} onChange={e => store.updateStrategyConfig('numCupones', parseInt(e.target.value) || 0)} />
                    <p className="text-xs text-amber-600 mt-1">Válidos en horarios flojos</p>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <label className="font-bold text-green-800 flex items-center gap-2 mb-2"><CreditCard size={18} /> Cheques Regalo €</label>
                    <input type="number" min="0" max="5" className="w-full p-2 border rounded" value={store.strategyConfig.numVales} onChange={e => store.updateStrategyConfig('numVales', parseInt(e.target.value) || 0)} />
                    <p className="text-xs text-green-600 mt-1">Tarjetas regalo sin gasto mínimo</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <label className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${store.strategyConfig.tarjetaSellos ? 'bg-blue-50 border-blue-400' : 'bg-slate-50 border-slate-200'}`}>
                    <input type="checkbox" checked={store.strategyConfig.tarjetaSellos} onChange={e => store.updateStrategyConfig('tarjetaSellos', e.target.checked)} className="w-5 h-5" />
                    <div>
                        <span className="font-bold">🎫 Tarjeta de Sellos</span>
                        <p className="text-xs text-slate-500">Para consumidores de producto específico (ej: menú)</p>
                    </div>
                </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputGroup label="Validez Cupones" suffix="días" value={store.strategyConfig.validezCuponesDias} onChange={(v: any) => store.updateStrategyConfig('validezCuponesDias', parseInt(v) || 30)} />
                <InputGroup label="Gasto Mín. Bienvenida" prefix="€" value={store.strategyConfig.gastoMinBienvenida} onChange={(v: any) => store.updateStrategyConfig('gastoMinBienvenida', parseFloat(v) || 5)} hint="Recomendado: 5€" />
                <InputGroup label="Gasto Mín. Ticket QR" prefix="€" value={store.strategyConfig.gastoMinTicketQR} onChange={(v: any) => store.updateStrategyConfig('gastoMinTicketQR', parseFloat(v) || 15)} hint={`Ticket medio: €${store.ticketPromedio}`} />
            </div>
        </div>
    );

    // PASO 5: Generar Estrategia
    const renderStep5 = () => (
        <div className="animate-fadeIn">
            <SectionTitle icon={Target} title="Objetivo y Generación" subtitle="Define tu objetivo y genera la estrategia con IA" colorClass="text-indigo-600 bg-indigo-100" />

            <div className="grid grid-cols-1 gap-6 mb-8">
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <label className="block text-sm font-bold text-slate-700 mb-3">🎯 Objetivo Principal de la Campaña</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { id: 'captacion', label: 'Captación Nuevos', icon: '👋' },
                            { id: 'frecuencia', label: 'Recurrencia', icon: '🔄' },
                            { id: 'ticket_medio', label: 'Aumentar Ticket', icon: '📈' },
                            { id: 'resenas', label: 'Conseguir Reseñas', icon: '⭐' },
                            { id: 'viralidad', label: 'Viralidad RRSS', icon: '🚀' },
                            { id: 'fidelizacion', label: 'Fidelización', icon: '❤️' },
                            { id: 'horas_valle', label: 'Llenar Horas Valle', icon: '⏳' },
                            { id: 'lanzamiento', label: 'Lanzamiento Producto', icon: '🆕' }
                        ].map(obj => (
                            <button
                                key={obj.id}
                                onClick={() => store.setField('objetivoPrincipal', obj.id)}
                                className={`p-3 rounded-lg border text-left transition-all ${store.objetivoPrincipal === obj.id ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200' : 'hover:bg-slate-50 border-slate-200'}`}
                            >
                                <div className="text-xl mb-1">{obj.icon}</div>
                                <div className="text-sm font-bold text-slate-700">{obj.label}</div>
                            </button>
                        ))}
                    </div>
                </div>
                {store.businessType === 'horeca' && <SelectGroup label="Validez" value={store.diasValidez} onChange={(v: any) => store.setField('diasValidez', v)} options={[{ value: 'semana', label: 'Lunes-Jueves (Valle)' }, { value: 'finde', label: 'Fines de Semana' }, { value: 'todo', label: 'Todos los días' }]} />}
            </div>


            {/* Resumen configuración */}
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-slate-700 mb-3">📋 Resumen de Configuración</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="bg-white p-2 rounded"><span className="text-slate-500">Juegos:</span> <span className="font-bold">{store.strategyConfig.numJuegos}</span></div>
                    <div className="bg-white p-2 rounded"><span className="text-slate-500">Cupones:</span> <span className="font-bold">{store.strategyConfig.numCupones}</span></div>
                    <div className="bg-white p-2 rounded"><span className="text-slate-500">Cheques Regalo:</span> <span className="font-bold">{store.strategyConfig.numVales}</span></div>
                    <div className="bg-white p-2 rounded"><span className="text-slate-500">T. Sellos:</span> <span className="font-bold">{store.strategyConfig.tarjetaSellos ? 'Sí' : 'No'}</span></div>
                    <div className="bg-white p-2 rounded"><span className="text-slate-500">Categorías:</span> <span className="font-bold">{store.priceRanges.length}</span></div>
                    <div className="bg-white p-2 rounded"><span className="text-slate-500">Productos:</span> <span className="font-bold">{store.keyProducts.length}</span></div>
                    <div className="bg-white p-2 rounded"><span className="text-slate-500">Presupuesto:</span> <span className="font-bold">€{presupuestoMarketing.toFixed(0)}</span></div>
                </div>
            </div>

            {/* Botones de generación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <Bot size={32} />
                        <div>
                            <h3 className="text-lg font-bold">Generar Estrategia IA</h3>
                            <p className="text-sm opacity-90">Juegos, cupones, vales y fidelización</p>
                        </div>
                    </div>
                    <button onClick={generateAIStrategy} disabled={aiLoading} className="w-full bg-white text-indigo-600 font-bold py-3 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                        {aiLoading ? <><Loader2 className="animate-spin" size={20} /> Generando...</> : <><Sparkles size={20} /> Generar Estrategia</>}
                    </button>
                </div>

                <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <Megaphone size={32} />
                        <div>
                            <h3 className="text-lg font-bold">Generar Plan Marketing</h3>
                            <p className="text-sm opacity-90">Copys, creativos y campañas</p>
                        </div>
                    </div>
                    <button onClick={generateMarketingPlan} disabled={marketingLoading} className="w-full bg-white text-pink-600 font-bold py-3 rounded-lg hover:bg-pink-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                        {marketingLoading ? <><Loader2 className="animate-spin" size={20} /> Generando...</> : <><Megaphone size={20} /> Generar Plan</>}
                    </button>
                </div>


            </div>
        </div>
    );

    // PASO 6: Resultados
    const renderStep6 = () => {
        const rec = store.aiRecommendation;
        if (!rec) return <div className="text-center py-12 text-slate-500">No hay recomendación aún. Vuelve al paso anterior.</div>;

        return (
            <div className="animate-fadeIn space-y-6">
                <SectionTitle icon={CheckCircle2} title="Estrategia Generada" subtitle="Tu plan de gamificación y fidelización" colorClass="text-green-600 bg-green-100" />

                {/* Análisis */}
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-xl border">
                    <h3 className="font-bold text-lg mb-2">📊 Análisis del Negocio</h3>
                    <p className="text-slate-700 whitespace-pre-line">{rec.analisisGeneral}</p>
                </div>

                {/* ROI */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold">ROI Estimado</h3>
                            <p className="text-sm opacity-80">Retorno sobre inversión proyectado</p>
                        </div>
                        <div className="text-4xl font-black">{rec.roiEstimado}x</div>
                    </div>
                </div>

                {/* Resumen Económico */}
                {(() => {
                    // Calcular coste estimado de premios
                    const participacionEstimada = store.traficoMensual * 0.15; // 15% del tráfico participa
                    let costePremiosEstimado = 0;

                    rec.juegos?.forEach(juego => {
                        juego.premios?.forEach((premio: any) => {
                            costePremiosEstimado += premio.costo * (premio.probabilidad / 100) * participacionEstimada;
                        });
                    });

                    // Beneficio generado por gasto mínimo
                    const gastoMinimoPromedio = rec.juegos?.[0]?.gastoMinimo || store.ticketPromedio;
                    const beneficioGenerado = participacionEstimada * gastoMinimoPromedio * (store.margenPromedio / 100);

                    // Presupuesto para Ads (el presupuesto de marketing real)
                    const presupuestoAds = presupuestoMarketing;

                    return (
                        <div className="bg-slate-800 rounded-xl p-6 text-white">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">💰 Resumen Económico Mensual</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="bg-white/10 rounded-lg p-4 relative group">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-xs text-slate-300">Presupuesto Ads</p>
                                        <span title={`= Facturación (€${store.facturacionMensual}) × ${store.presupuestoMarketingPorcentaje}% = €${presupuestoAds.toFixed(0)}. Este es tu presupuesto real para publicidad pagada en Meta/Google.`}>
                                            <Info size={14} className="text-slate-400 cursor-help" />
                                        </span>
                                    </div>
                                    <p className="text-2xl font-black text-blue-400">€{presupuestoAds.toFixed(0)}</p>
                                    <p className="text-xs text-slate-400 mt-1">Meta/Google Ads</p>
                                </div>

                                <div className="bg-white/10 rounded-lg p-4 relative">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-xs text-slate-300">Coste Premios</p>
                                        <span title={`= Σ(costo premio × probabilidad × ${participacionEstimada.toFixed(0)} participantes). Estimado de cuánto cuestan los productos que regalas. NO es una pérdida porque el gasto mínimo lo cubre.`}>
                                            <Info size={14} className="text-slate-400 cursor-help" />
                                        </span>
                                    </div>
                                    <p className="text-2xl font-black text-amber-400">€{costePremiosEstimado.toFixed(0)}</p>
                                    <p className="text-xs text-slate-400 mt-1">~{participacionEstimada.toFixed(0)} participantes</p>
                                </div>

                                <div className="bg-white/10 rounded-lg p-4 relative">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-xs text-slate-300">Beneficio Generado</p>
                                        <span title={`= ${participacionEstimada.toFixed(0)} participantes × €${gastoMinimoPromedio} gasto mínimo × ${store.margenPromedio}% margen = €${beneficioGenerado.toFixed(0)}. El beneficio que generas gracias a que cada participante gasta el mínimo.`}>
                                            <Info size={14} className="text-slate-400 cursor-help" />
                                        </span>
                                    </div>
                                    <p className="text-2xl font-black text-green-400">€{beneficioGenerado.toFixed(0)}</p>
                                    <p className="text-xs text-slate-400 mt-1">Por gasto mínimo</p>
                                </div>
                            </div>

                            <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3 flex items-start gap-2">
                                <Info size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-green-300">
                                    <strong>Los premios se autofinancian:</strong> El gasto mínimo (€{gastoMinimoPromedio}) genera €{(gastoMinimoPromedio * store.margenPromedio / 100).toFixed(2)} de beneficio, cubriendo el coste del premio.
                                </p>
                            </div>
                        </div>
                    );

                })()}

                {/* Juegos */}
                {rec.juegos && rec.juegos.map(juego => (
                    <div key={juego.id} className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-indigo-600 text-white p-2 rounded-lg"><Gift size={24} /></div>
                            <div>
                                <h3 className="font-bold text-lg">{juego.nombre}</h3>
                                <p className="text-sm text-indigo-600">{juego.mecanica} • {juego.ubicacion} • {juego.siempreGana ? 'Siempre Gana' : 'Con probabilidades'}</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">{juego.razonamiento}</p>

                        <h4 className="font-bold text-sm mb-2">7 Premios:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {juego.premios.map(p => (
                                <div key={p.id} className="bg-white p-3 rounded-lg border flex justify-between items-center">
                                    <div>
                                        <span className="font-medium">{p.nombre}</span>
                                        <p className="text-xs text-slate-500">Min €{p.minGasto} • Costo €{p.costo}</p>
                                    </div>
                                    <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-bold text-sm">{p.probabilidad}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Cupones */}
                {rec.cupones && rec.cupones.length > 0 && (
                    <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                        <h3 className="font-bold text-lg flex items-center gap-2 mb-4"><Award size={20} className="text-amber-600" /> Cupones ({rec.cupones.length})</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {rec.cupones.map(c => (
                                <div key={c.id} className="bg-white p-4 rounded-lg border">
                                    <h4 className="font-bold">{c.nombre}</h4>
                                    <p className="text-sm text-slate-600">{c.descripcion}</p>
                                    <p className="text-xs text-amber-600 mt-1">⏰ {c.horariosValidos} • Validez: {c.validezDias} días</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Vales */}
                {rec.vales && rec.vales.length > 0 && (
                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                        <h3 className="font-bold text-lg flex items-center gap-2 mb-4"><CreditCard size={20} className="text-green-600" /> Cheques Regalo ({rec.vales.length})</h3>
                        <p className="text-sm text-slate-600 mb-3">💡 Los vales son como dinero en efectivo, sin gasto mínimo</p>
                        <div className="flex flex-wrap gap-3">
                            {rec.vales.map(v => (
                                <div key={v.id} className="bg-white p-4 rounded-lg border text-center">
                                    <span className="text-2xl font-black text-green-600">€{v.valorEuros}</span>
                                    <p className="text-xs text-slate-500">Validez: {v.validezDias} días</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                {/* Tarjeta Fidelidad */}
                {rec.tarjetaSellos && (
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                        <h3 className="font-bold flex items-center gap-2 mb-2">🎫 {rec.tarjetaSellos.nombre}</h3>
                        <p className="text-sm text-slate-600">{rec.tarjetaSellos.numSellosParaPremio} sellos = {rec.tarjetaSellos.premioFinal}</p>
                        <p className="text-xs text-blue-600 mt-1">{rec.tarjetaSellos.visibilidad} • {rec.tarjetaSellos.entrega}</p>
                    </div>
                )}

                {/* Productos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-emerald-50 rounded-lg p-4">
                        <h4 className="font-bold text-emerald-700 mb-2">🎣 Productos Gancho</h4>
                        <ul className="text-sm">{rec.productosGancho.map((p, i) => <li key={i} className="py-1">• {p}</li>)}</ul>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                        <h4 className="font-bold text-orange-700 mb-2">📈 Productos a Impulsar</h4>
                        <ul className="text-sm">{rec.productosImpulsar.map((p, i) => <li key={i} className="py-1">• {p}</li>)}</ul>
                    </div>
                </div>

                {/* Resumen */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">📋 Resumen Ejecutivo</h3>
                        <button
                            onClick={saveStrategy}
                            disabled={saving}
                            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-2 transition"
                        >
                            {saving ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                            {saving ? 'Guardando...' : 'Guardar en Nube'}
                        </button>
                    </div>
                    <p className="text-sm opacity-90">{rec.resumenEstrategia}</p>
                </div>

                {/* Plan de Marketing (si existe) */}
                {store.marketingPlan && (
                    <div className="mt-8 pt-8 border-t-2 border-pink-200">
                        <h2 className="text-2xl font-bold text-pink-600 mb-6 flex items-center gap-2">
                            <Megaphone size={28} /> Plan de Marketing
                        </h2>

                        {/* Posts orgánicos */}
                        <div className="bg-pink-50 rounded-xl p-6 border border-pink-200 mb-6">
                            <h3 className="font-bold text-lg mb-4">📱 Posts para Redes Sociales ({store.marketingPlan.organico?.posts?.length || 0})</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {store.marketingPlan.organico?.posts?.map((post: any, i: number) => (
                                    <div key={i} className="bg-white p-4 rounded-lg border">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-pink-700">{post.idea}</h4>
                                            <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded">{post.mejorDia}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-2">{post.copy}</p>
                                        <p className="text-xs text-slate-400">🖼️ {post.creativoSugerido}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Stories */}
                        <div className="bg-purple-50 rounded-xl p-6 border border-purple-200 mb-6">
                            <h3 className="font-bold text-lg mb-4">📸 Ideas de Stories</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {store.marketingPlan.organico?.stories?.map((story: any, i: number) => (
                                    <div key={i} className="bg-white p-3 rounded-lg border">
                                        <h4 className="font-bold text-purple-700">{story.idea}</h4>
                                        <p className="text-sm">{story.copy}</p>
                                        <span className="text-xs text-purple-500">Stickers: {story.stickers}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reels */}
                        <div className="bg-rose-50 rounded-xl p-6 border border-rose-200 mb-6">
                            <h3 className="font-bold text-lg mb-4">🎬 Ideas de Reels</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {store.marketingPlan.organico?.reels?.map((reel: any, i: number) => (
                                    <div key={i} className="bg-white p-3 rounded-lg border">
                                        <h4 className="font-bold text-rose-700">{reel.idea}</h4>
                                        <p className="text-sm mb-1">{reel.guion}</p>
                                        <div className="flex gap-2 text-xs">
                                            <span className="bg-rose-100 px-2 py-0.5 rounded">{reel.duracion}</span>
                                            <span className="bg-rose-100 px-2 py-0.5 rounded">🎵 {reel.audio}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Campañas de pago */}
                        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-6">
                            <h3 className="font-bold text-lg mb-4">💰 Campañas de Publicidad</h3>
                            <div className="space-y-4">
                                {store.marketingPlan.pago?.campanas?.map((camp: any, i: number) => (
                                    <div key={i} className="bg-white p-4 rounded-lg border">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-blue-700">{camp.objetivo}</h4>
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">{camp.presupuestoSugerido}</span>
                                        </div>
                                        <p className="text-sm text-slate-500 mb-2">👥 {camp.segmentacion}</p>
                                        <p className="text-sm bg-blue-50 p-2 rounded mb-2">"{camp.copy}"</p>
                                        <p className="text-xs text-slate-400">🖼️ {camp.creativoSugerido}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Acciones offline */}
                        {store.marketingPlan.acciones && (
                            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                                <h3 className="font-bold text-lg mb-4">📋 Acciones Adicionales</h3>
                                <ul className="space-y-2">
                                    {store.marketingPlan.acciones.map((accion: string, i: number) => (
                                        <li key={i} className="flex items-center gap-2 text-sm">
                                            <CheckCircle2 size={16} className="text-amber-600" />
                                            {accion}
                                        </li>
                                    ))}
                                </ul>
                                {store.marketingPlan.calendarioSemanal && (
                                    <p className="mt-4 text-sm text-amber-700 bg-amber-100 p-3 rounded">
                                        📅 <strong>Calendario:</strong> {store.marketingPlan.calendarioSemanal}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };


    const renderCurrentStep = () => {
        switch (step) {
            case 1: return renderStep1();
            case 2: return renderStep2();
            case 3: return renderStep3();
            case 4: return renderStep4();
            case 5: return renderStep5();
            case 6: return renderStep6();
            default: return renderStep1();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-slate-800 mb-2">🎯 Simulador de Estrategia</h1>
                    <p className="text-slate-500">Define tu negocio y genera una estrategia de gamificación con IA</p>
                </div>

                {/* Progress */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5, 6].map(s => (
                            <React.Fragment key={s}>
                                <div onClick={() => setStep(s)} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold cursor-pointer transition ${step >= s ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>{s}</div>
                                {s < totalSteps && <div className={`w-8 h-1 rounded ${step > s ? 'bg-indigo-600' : 'bg-slate-200'}`} />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <Card className="mb-6">{renderCurrentStep()}</Card>

                {/* Navigation */}
                <div className="flex justify-between">
                    <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1} className="flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed">
                        <ChevronLeft size={20} /> Anterior
                    </button>
                    {step < totalSteps && (
                        <button onClick={() => setStep(step + 1)} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                            Siguiente <ChevronRight size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
