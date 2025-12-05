
import { Bot, Sparkles } from 'lucide-react';

export default function PlanIA() {
    return (
        <div className="animate-fadeIn max-w-4xl mx-auto text-center py-20">
            <div className="bg-indigo-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 text-indigo-600">
                <Bot size={40} />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Constructor de Planes IA</h1>
            <p className="text-slate-500 max-w-lg mx-auto mb-8">
                Esta funcionalidad analizará todos tus datos cargados y generará un plan de marketing completo automáticamente.
            </p>
            <button
                onClick={() => alert('⚠️ Funcionalidad en desarrollo. Por favor usa el Simulador de Estrategia para generar planes completos.')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 flex items-center gap-2 mx-auto transition-transform active:scale-95"
            >
                <Sparkles size={20} />
                Generar Plan Demo
            </button>
        </div>
    );
}
