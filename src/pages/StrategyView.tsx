import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import {
    LayoutDashboard, Gamepad2, TrendingUp, Clock,
    Megaphone, Crown, Zap, Database, ArrowRight,
    CheckCircle, Loader2, ChevronLeft
} from 'lucide-react';

const TABS = [
    { id: 'diagnostico', label: 'Diagnóstico', icon: LayoutDashboard },
    { id: 'juegos', label: 'Juegos y Premios', icon: Gamepad2 },
    { id: 'economica', label: 'Estrategia Económica', icon: TrendingUp },
    { id: 'horas', label: 'Horas Valle / Pico', icon: Clock },
    { id: 'captacion', label: 'Captación', icon: Megaphone },
    { id: 'fidelizacion', label: 'Fidelización', icon: Crown },
    { id: 'automatizaciones', label: 'Automatizaciones', icon: Zap },
    { id: 'dataset', label: 'Dataset Builder', icon: Database },
];

export default function StrategyView() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('diagnostico');
    const store = useAppStore();
    const strategy = store.aiRecommendation;
    const [saving, setSaving] = useState(false);

    const handleSaveStrategy = async () => {
        setSaving(true);
        try {
            await store.saveStrategy();
            alert('Estrategia guardada correctamente en tu historial.');
        } catch (error) {
            console.error(error);
            alert('Error al guardar estrategia.');
        } finally {
            setSaving(false);
        }
    };

    if (!strategy) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
                <p>No hay estrategia generada aún.</p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mt-4 text-indigo-600 underline font-bold"
                >
                    Volver al Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div className="flex items-start gap-3">
                        <button onClick={() => navigate('/dashboard')} className="mt-1 p-2 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                            <ChevronLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 mb-2">Estrategia Omnia Generada</h1>
                            <p className="text-slate-500">Plan estratégico modular basado en tus objetivos y datos.</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSaveStrategy}
                        disabled={saving}
                        className="bg-white border border-indigo-200 text-indigo-600 px-4 py-2 rounded-lg font-bold hover:bg-indigo-50 flex items-center gap-2"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                        Guardar en Historial
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[800px] flex flex-col md:flex-row">
                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-2 md:p-4 overflow-x-auto md:overflow-visible flex md:flex-col gap-2">
                        {TABS.map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left whitespace-nowrap ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'}`}
                                >
                                    <Icon size={18} />
                                    <span className="font-bold text-sm">{tab.label}</span>
                                    {isActive && <ArrowRight size={14} className="ml-auto opacity-50 hidden md:block" />}
                                </button>
                            );
                        })}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                        {activeTab === 'diagnostico' && <TabDiagnostico strategy={strategy} />}
                        {activeTab === 'juegos' && <TabJuegos strategy={strategy} />}
                        {activeTab === 'economica' && <TabEconomica strategy={strategy} />}
                        {activeTab === 'horas' && <TabHoras strategy={strategy} />}
                        {activeTab === 'captacion' && <TabCaptacion strategy={strategy} />}
                        {activeTab === 'fidelizacion' && <TabFidelizacion strategy={strategy} />}
                        {activeTab === 'automatizaciones' && <TabAutomatizaciones strategy={strategy} />}
                        {activeTab === 'dataset' && <TabDataset strategy={strategy} store={store} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- SUB-COMPONENTS FOR TABS ---

const TabDiagnostico = ({ strategy }: { strategy: any }) => (
    <div className="space-y-8 animate-fadeIn">
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
            <h3 className="text-indigo-900 font-bold mb-2 text-lg">Resumen Ejecutivo</h3>
            <p className="text-indigo-800 leading-relaxed">{strategy.analisisGeneral}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border border-green-100 bg-green-50/50 rounded-2xl">
                <h4 className="font-bold text-green-700 mb-4 flex items-center gap-2"><CheckCircle size={18} /> Puntos Fuertes</h4>
                <ul className="space-y-2">
                    {strategy.puntosFuertes?.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-green-900">
                            <span className="mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full" /> {item}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="p-6 border border-amber-100 bg-amber-50/50 rounded-2xl">
                <h4 className="font-bold text-amber-700 mb-4 flex items-center gap-2"><Zap size={18} /> Oportunidades</h4>
                <ul className="space-y-2">
                    {strategy.oportunidades?.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-amber-900">
                            <span className="mt-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full" /> {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

const TabJuegos = ({ strategy }: { strategy: any }) => (
    <div className="space-y-8 animate-fadeIn">
        {strategy.juegos.map((juego: any, idx: number) => (
            <div key={idx} className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">{juego.tipo}</span>
                        <h3 className="text-xl font-bold text-slate-800">{juego.nombre}</h3>
                    </div>
                    <div className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
                        {juego.ubicacion}
                    </div>
                </div>

                <p className="text-slate-600 mb-6 text-sm">{juego.razonamiento}</p>

                <h4 className="font-bold text-sm text-slate-700 mb-3 uppercase tracking-wide">Premios Configurados</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {juego.premios.map((premio: any, pIdx: number) => (
                        <div key={pIdx} className="p-3 border border-slate-100 rounded-xl bg-slate-50 flex justify-between items-center group hover:border-indigo-200 transition-colors">
                            <div>
                                <div className="font-bold text-slate-800 text-sm">{premio.nombre}</div>
                                <div className="text-xs text-slate-400 capitalize">{premio.tipo} • {premio.probabilidad}%</div>
                            </div>
                            {premio.productoObjetivo && (
                                <span className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded text-slate-500">
                                    {premio.productoObjetivo}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

const TabEconomica = ({ strategy }: { strategy: any }) => (
    <div className="space-y-6 animate-fadeIn">
        <h3 className="font-bold text-xl text-slate-800">Estrategia Económica</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-700 mb-3">Protección de Margen</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{strategy.estrategiaEconomica.proteccionMargen}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-700 mb-3">Subida Ticket Medio</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{strategy.estrategiaEconomica.subidaTicket}</p>
            </div>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-2xl mt-6">
            <h4 className="font-bold text-green-400 mb-2">Impacto Financiero Estimado</h4>
            <p className="text-slate-300 text-sm">{strategy.estrategiaEconomica.impactoFinanciero}</p>
            <div className="mt-4 pt-4 border-t border-slate-700 flex gap-8">
                <div>
                    <div className="text-slate-400 text-xs text-transform uppercase">ROI Estimado</div>
                    <div className="text-2xl font-black text-green-400">{strategy.roiEstimado}x</div>
                </div>
            </div>
        </div>
    </div>
);

// Placeholder components for other tabs to keep it concise but complete
const TabHoras = ({ strategy }: { strategy: any }) => (
    <div className="space-y-4">
        <h3 className="font-bold text-lg">Estrategia Horas Valle</h3>
        <p className="text-slate-600">{JSON.stringify(strategy.horasValle, null, 2)}</p>
    </div>
);
const TabCaptacion = ({ strategy }: { strategy: any }) => (
    <div className="space-y-4">
        <h3 className="font-bold text-lg">Plan de Captación</h3>
        <pre className="text-xs bg-slate-100 p-4 rounded-lg overflow-auto">{JSON.stringify(strategy.captacion, null, 2)}</pre>
    </div>
);
const TabFidelizacion = ({ strategy }: { strategy: any }) => (
    <div className="space-y-4">
        <h3 className="font-bold text-lg">Fidelización VIP</h3>
        <pre className="text-xs bg-slate-100 p-4 rounded-lg overflow-auto">{JSON.stringify(strategy.fidelizacion, null, 2)}</pre>
    </div>
);
const TabAutomatizaciones = ({ strategy }: { strategy: any }) => (
    <div className="space-y-4">
        <h3 className="font-bold text-lg">Automatizaciones Sugeridas</h3>
        <ul className="list-disc pl-5">
            {strategy.automatizaciones?.map((a: string, i: number) => <li key={i} className="text-slate-600">{a}</li>)}
        </ul>
    </div>
);
const TabDataset = ({ strategy, store }: { strategy: any, store: any }) => {
    const [adding, setAdding] = useState(false);

    const handleAddToDataset = async () => {
        setAdding(true);
        try {
            await store.addDatasetEntry({
                date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
                businessProfile: {
                    type: store.businessType,
                    avgTicket: store.ticketPromedio,
                    monthlyRevenue: store.facturacionMensual,
                    location: store.ciudad
                },
                generatedStrategy: {
                    summary: strategy.resumenEstrategia || strategy.analisisGeneral?.substring(0, 100),
                    keyActions: strategy.automatizaciones || []
                },
                classification: 'neutro' // Default status before real results
            });
            alert('Añadido al dataset de entrenamiento.');
        } catch (e: any) {
            alert('Error: ' + e.message);
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="space-y-8 text-center py-12">
            <Database size={48} className="text-indigo-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800">Dataset Training Builder</h3>
            <p className="text-slate-500 max-w-md mx-auto">
                ¿Esta estrategia te parece coherente? Añádela al dataset para entrenar futuras iteraciones del modelo.
            </p>
            <button
                onClick={handleAddToDataset}
                disabled={adding}
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 mx-auto"
            >
                {adding && <Loader2 size={16} className="animate-spin" />}
                Añadir a Dataset
            </button>
        </div>
    );
};
