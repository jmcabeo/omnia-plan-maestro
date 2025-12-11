import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
// import { supabase } from '../lib/supabase'; // Unused
import { Sparkles, Megaphone, Loader2, AlertTriangle, ChevronLeft } from 'lucide-react';

export default function PlanIA() {
    const store = useAppStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGeneratePlan = async () => {
        setLoading(true);
        setError(null);

        try {
            console.log("Calling Store Action: generateAIStrategy...");

            const data = await store.generateAIStrategy();

            console.log("AI Strategy Received:", data);
            setPlan(data);

            setTimeout(() => {
                navigate('/strategy');
            }, 1000);

        } catch (err: any) {
            console.warn("API Error, falling back to simulation:", err);
            // Fallback robusto
            try {
                const { generateMockStrategyData } = await import('../utils/aiHelpers');
                const mockPlan = generateMockStrategyData(store);
                console.log("Mock Strategy Generated:", mockPlan);

                store.setAIRecommendation(mockPlan);
                setPlan(mockPlan);

                setTimeout(() => {
                    navigate('/strategy');
                }, 1000);
            } catch (mockErr) {
                console.error("Critical: Mock generation failed", mockErr);
                setError("Error crítico en el sistema de simulación.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fadeIn max-w-5xl mx-auto p-4 relative">
            <button
                onClick={() => navigate('/dashboard')}
                className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
            >
                <ChevronLeft size={20} />
                <span className="font-bold text-sm hidden md:inline">Dashboard</span>
            </button>
            <div className="text-center mb-8 mt-8">
                <h1 className="text-3xl font-black text-slate-800 mb-2 flex items-center justify-center gap-3">
                    <Sparkles className="text-indigo-600" />
                    Generador de Planes IA
                </h1>
                <p className="text-slate-500 max-w-2xl mx-auto">
                    Nuestra IA analiza tus datos y objetivos para crear un plan de marketing completo y accionable.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 mb-6 flex items-center gap-3">
                    <AlertTriangle size={24} />
                    <p>{error}</p>
                </div>
            )}

            {!plan && !loading && !error && (
                <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl shadow-sm border border-slate-200">
                    <Megaphone size={64} className="text-indigo-200 mb-6" />
                    <h2 className="text-xl font-bold text-slate-700 mb-2">¿Listo para despegar?</h2>
                    <p className="text-slate-500 mb-8 text-center max-w-md">
                        Genera un plan de marketing adaptado a tu objetivo actual: <span className="font-bold text-indigo-600">{(store.objetivoPrincipal || 'General').toUpperCase()}</span>
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
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="bg-green-100 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3 mb-4 animate-fadeIn">
                        <Sparkles size={24} />
                        <span className="font-bold">¡Estrategia Generada con Éxito!</span>
                    </div>
                    <p className="text-slate-500">Redirigiendo a tu plan estratégico...</p>
                </div>
            )}
        </div>
    );
}
