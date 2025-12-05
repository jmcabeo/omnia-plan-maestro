import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { generateMockMarketingPlan } from '../utils/aiHelpers';
import { Sparkles, Megaphone, CheckCircle2, Loader2, Calendar } from 'lucide-react';

export default function PlanIA() {
    const store = useAppStore();
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState<any>(null);

    const handleGeneratePlan = () => {
        setLoading(true);
        // Simular retardo de red/IA
        setTimeout(() => {
            const newPlan = generateMockMarketingPlan(store);
            setPlan(newPlan);
            setLoading(false);
        }, 2000);
    };

    // Generar plan automáticamente si no hay uno, o permitir generarlo manualmente
    useEffect(() => {
        if (!plan && !loading) {
            // Opcional: Generar al entrar
            // handleGeneratePlan();
        }
    }, []);

    return (
        <div className="animate-fadeIn max-w-5xl mx-auto p-4">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-slate-800 mb-2 flex items-center justify-center gap-3">
                    <Sparkles className="text-indigo-600" />
                    Generador de Planes IA
                </h1>
                <p className="text-slate-500 max-w-2xl mx-auto">
                    Nuestra IA analiza tus datos y objetivos para crear un plan de marketing completo y accionable.
                </p>
            </div>

            {!plan && !loading && (
                <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl shadow-sm border border-slate-200">
                    <Megaphone size={64} className="text-indigo-200 mb-6" />
                    <h2 className="text-xl font-bold text-slate-700 mb-2">¿Listo para despegar?</h2>
                    <p className="text-slate-500 mb-8 text-center max-w-md">
                        Genera un plan de marketing adaptado a tu objetivo actual: <span className="font-bold text-indigo-600">{store.objetivoPrincipal.toUpperCase()}</span>
                    </p>
                    <button
                        onClick={handleGeneratePlan}
                        className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 flex items-center gap-3 transition-transform active:scale-95"
                    >
                        <Sparkles size={20} />
                        Generar Plan Maestro
                    </button>
                </div>
            )}

            {loading && (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
                    <p className="text-slate-600 font-medium animate-pulse">Analizando tendencias y generando estrategias...</p>
                </div>
            )}

            {plan && !loading && (
                <div className="animate-fadeIn space-y-8">
                    {/* Header del Plan */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-2xl shadow-lg flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Plan Estratégico Generado</h2>
                            <p className="opacity-90">Basado en objetivo: {store.objetivoPrincipal.toUpperCase()}</p>
                        </div>
                        <button onClick={handleGeneratePlan} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm transition-colors">
                            Regenerar
                        </button>
                    </div>

                    {/* Contenido del Plan */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Columna Izquierda: Orgánico */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Posts */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                                <h3 className="font-bold text-lg text-pink-600 mb-4 flex items-center gap-2">
                                    <Megaphone size={20} /> Redes Sociales
                                </h3>
                                <div className="space-y-4">
                                    {plan.organico?.posts?.map((post: any, i: number) => (
                                        <div key={i} className="p-4 bg-pink-50 rounded-xl border border-pink-100">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-slate-800">{post.idea}</h4>
                                                <span className="text-xs bg-white text-pink-600 px-2 py-1 rounded-full border border-pink-200 font-medium">{post.mejorDia}</span>
                                            </div>
                                            <p className="text-sm text-slate-600 mb-3 italic">"{post.copy}"</p>
                                            <div className="text-xs text-slate-500 flex items-center gap-1">
                                                <span>🖼️ Sugerencia:</span>
                                                <span className="font-medium">{post.creativoSugerido}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Reels & Stories */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                                    <h3 className="font-bold text-lg text-purple-600 mb-4">Stories</h3>
                                    <div className="space-y-3">
                                        {plan.organico?.stories?.map((story: any, i: number) => (
                                            <div key={i} className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                                                <p className="font-bold text-sm text-slate-800 mb-1">{story.idea}</p>
                                                <p className="text-xs text-slate-500">Stickers: {story.stickers}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                                    <h3 className="font-bold text-lg text-rose-600 mb-4">Reels</h3>
                                    <div className="space-y-3">
                                        {plan.organico?.reels?.map((reel: any, i: number) => (
                                            <div key={i} className="p-3 bg-rose-50 rounded-lg border border-rose-100">
                                                <p className="font-bold text-sm text-slate-800 mb-1">{reel.idea}</p>
                                                <div className="flex gap-2 mt-2">
                                                    <span className="text-[10px] bg-white px-2 py-1 rounded text-rose-600 border border-rose-200">{reel.duracion}</span>
                                                    <span className="text-[10px] bg-white px-2 py-1 rounded text-rose-600 border border-rose-200">🎵 Audio Viral</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Columna Derecha: Pago y Acciones */}
                        <div className="space-y-6">
                            {/* Campañas */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                                <h3 className="font-bold text-lg text-blue-600 mb-4 flex items-center gap-2">
                                    <Megaphone size={20} /> Publicidad
                                </h3>
                                <div className="space-y-4">
                                    {plan.pago?.campanas?.map((camp: any, i: number) => (
                                        <div key={i} className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-bold text-blue-800 text-sm">{camp.objetivo}</h4>
                                                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">{camp.presupuestoSugerido}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mb-2">🎯 {camp.segmentacion}</p>
                                            <p className="text-xs bg-white p-2 rounded border border-blue-100 text-slate-600">"{camp.copy}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Acciones Offline */}
                            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                                <h3 className="font-bold text-lg text-amber-800 mb-4 flex items-center gap-2">
                                    <CheckCircle2 size={20} /> Acciones Offline
                                </h3>
                                <ul className="space-y-3">
                                    {plan.acciones?.map((accion: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-amber-900">
                                            <div className="mt-1 min-w-[16px]"><CheckCircle2 size={16} /></div>
                                            {accion}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Calendario */}
                            <div className="bg-slate-800 text-white rounded-xl p-6 shadow-lg">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <Calendar size={20} /> Calendario Semanal
                                </h3>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    {plan.calendarioSemanal}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
