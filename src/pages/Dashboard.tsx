import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import BusinessSelector from '../components/BusinessSelector';
import {
    LayoutDashboard, PlusCircle, Play, FileText, BarChart2,
    Database, ArrowRight, Zap, Settings, Briefcase, FolderOpen, FileSpreadsheet
} from 'lucide-react';

export default function Dashboard() {
    const store = useAppStore();
    const { nombreNegocio, businessType } = store;
    const [showBusinessSelector, setShowBusinessSelector] = useState(false);

    const menuItems = [
        {
            title: 'Configurar Negocio',
            desc: 'Define objetivos, productos y capacidad.',
            icon: Settings,
            path: '/config',
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            title: 'Generar Estrategia',
            desc: 'Crea un plan marketing con IA.',
            icon: Zap,
            path: '/generator',
            color: 'text-amber-600',
            bg: 'bg-amber-50'
        },
        {
            title: 'Ver Estrategia',
            desc: 'Consulta el plan vigente.',
            icon: FileText,
            path: '/strategy',
            color: 'text-purple-600',
            bg: 'bg-purple-50'
        },
        {
            title: 'Registrar Resultados',
            desc: 'Introduce métricas reales post-campaña.',
            icon: BarChart2,
            path: '/results',
            color: 'text-green-600',
            bg: 'bg-green-50'
        },
        {
            title: 'Actualizar Datos (CSV)',
            desc: 'Sube tickets, productos y promociones.',
            icon: FileSpreadsheet,
            path: '/upload',
            color: 'text-cyan-600',
            bg: 'bg-cyan-50'
        },
    ];

    const [showTutorial, setShowTutorial] = useState(false);

    const calculateProgress = () => {
        let score = 0;
        let total = 7; // Total steps/sections

        if (store.nombreNegocio) score++;
        if (store.objetivos && store.objetivos.length > 0) score++;
        if (store.facturacionMensual > 0) score++;
        // Safe access for capacity tables (using 'mesas' property if it exists, need to verify type)
        if (store.capacidad && (store.capacidad as any).mesas > 0) score++;
        if (store.products && store.products.length > 0) score++;

        // Check for marking/ads - verifying safe access
        const hasSocials = store.marketing && (store.marketing as any).redesSociales && (store.marketing as any).redesSociales.length > 0;
        const hasAds = store.marketing && (store.marketing as any).adsActivas;

        if (hasSocials || hasAds) score++;
        if (store.strategyConfig && store.strategyConfig.juegosActivos && store.strategyConfig.juegosActivos.length > 0) score++;

        return Math.round((score / total) * 100);
    };

    const progress = calculateProgress();

    return (
        <div className="animate-fadeIn min-h-screen bg-slate-50 p-6 md:p-12">
            {showBusinessSelector && (
                <BusinessSelector onClose={() => setShowBusinessSelector(false)} />
            )}

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                            Omnia <span className="text-indigo-600">3.0</span>
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">
                            Plan Maestro para {nombreNegocio || 'tu negocio'} ({businessType})
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowBusinessSelector(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-50 font-bold text-sm transition-colors"
                        >
                            <FolderOpen size={16} />
                            Cargar Negocio
                        </button>

                        <Link to="/dataset" className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-bold text-sm transition-colors">
                            <Database size={16} />
                            Dataset
                        </Link>
                        <button
                            onClick={() => setShowTutorial(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold text-sm shadow-lg shadow-indigo-200 transition-colors"
                        >
                            <Play size={16} fill="currentColor" />
                            Tutorial
                        </button>
                    </div>
                </div>

                {/* Main Action Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {menuItems.map((item, idx) => (
                        <Link
                            key={idx}
                            to={item.path}
                            className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <item.icon size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
                                {item.title}
                            </h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                {item.desc}
                            </p>
                            <div className="mt-4 flex items-center text-sm font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                Empezar <ArrowRight size={14} className="ml-1" />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Presets & Recent Activity Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Presets Column */}
                    <div className="lg:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Presets del Negocio</h2>
                            <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Ver todos</button>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 border border-slate-100 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded">Restaurante</span>
                                        <PlusCircle size={16} className="text-slate-400" />
                                    </div>
                                    <h4 className="font-bold text-slate-700">Cargar Datos Restaurante Pizzería</h4>
                                    <p className="text-xs text-slate-500 mt-1">Preset con productos, aforo y marketing estándar.</p>
                                </div>
                                <div className="p-4 border border-slate-100 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded">Estética</span>
                                        <PlusCircle size={16} className="text-slate-400" />
                                    </div>
                                    <h4 className="font-bold text-slate-700">Cargar Centro de Estética</h4>
                                    <p className="text-xs text-slate-500 mt-1">Preset con servicios de belleza y tickets medios.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats / Quick Info */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Estado Actual</h2>
                        <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl -mr-10 -mt-10 opacity-50"></div>

                            <div className="relative z-10">
                                <p className="text-indigo-200 text-sm font-medium mb-1">Estrategia Activa</p>
                                <h3 className="text-2xl font-bold mb-6">Ninguna</h3>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-indigo-200">Progreso Configuración</span>
                                            <span className="font-bold">{progress}%</span>
                                        </div>
                                        <div className="h-2 bg-indigo-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-400 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-indigo-700">
                                        <Link to="/config" className="block text-center w-full py-2 bg-white text-indigo-900 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors">
                                            Comenzar Configuración
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tutorial Modal */}
            {showTutorial && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl relative">
                        <button
                            onClick={() => setShowTutorial(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>

                        <div className="text-center mb-8">
                            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                                <Play size={32} fill="currentColor" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-800">Bienvenido a Omnia 3.0</h2>
                            <p className="text-slate-500">Tu sistema experto de marketing impulsado por IA. Así funciona en 4 pasos:</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="flex gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50">
                                <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                                    <Settings size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">1. Configura</h3>
                                    <p className="text-xs text-slate-500  leading-relaxed">Define tu negocio, productos, capacidad y objetivos en el Wizard.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50">
                                <div className="bg-amber-100 text-amber-600 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                                    <Zap size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">2. Genera (IA)</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">Nuestra IA (Gemini Pro) analizará tus datos y creará una estrategia única.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50">
                                <div className="bg-purple-100 text-purple-600 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">3. Ejecuta</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">Consulta tu Plan Maestro, aplica los juegos, promociones y campañas.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50">
                                <div className="bg-green-100 text-green-600 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                                    <BarChart2 size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">4. Aprende</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">Registra los resultados reales. El sistema aprenderá y mejorará con el tiempo.</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowTutorial(false)}
                            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                        >
                            ¡Entendido, vamos a empezar!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
