import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Database, FileJson, Trash2, Check, X } from 'lucide-react';

export default function DatasetBuilder() {
    const { datasetEntries, fetchDatasetEntries } = useAppStore();

    useEffect(() => {
        fetchDatasetEntries();
    }, []);

    // Helper to safely get business name regardless of shape
    const getBusinessName = (entry: any) => {
        return entry.businessProfile?.name || entry.businessProfile?.nombreNegocio || 'Negocio';
    };

    const getBusinessType = (entry: any) => {
        return entry.businessProfile?.type || entry.businessProfile?.businessType || 'N/A';
    };

    const getSummary = (entry: any) => {
        return entry.generatedStrategy?.summary || entry.generatedStrategy?.resumenEstrategia || 'Sin resumen...';
    };

    const handleExport = () => {
        const dataStr = JSON.stringify(datasetEntries, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `omnia_dataset_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                            <Database className="text-indigo-600" size={32} />
                            Dataset Builder
                        </h1>
                        <p className="text-slate-500 mt-2">
                            Gestiona los ejemplos que se usarán para entrenar y refinar el modelo Omnia.
                        </p>
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={datasetEntries.length === 0}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <FileJson size={18} />
                        Exportar JSON
                    </button>
                </div>

                {datasetEntries.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <Database size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2">Dataset Vacío</h3>
                        <p className="text-slate-500 max-w-md mx-auto">
                            Aún no has añadido ninguna estrategia al dataset. Genera una estrategia y haz clic en "Añadir a Dataset" para empezar a construir tu base de conocimiento.
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-slate-600 text-xs uppercase tracking-wider">Fecha / ID</th>
                                        <th className="px-6 py-4 font-bold text-slate-600 text-xs uppercase tracking-wider">Negocio</th>
                                        <th className="px-6 py-4 font-bold text-slate-600 text-xs uppercase tracking-wider">Resumen Output</th>
                                        <th className="px-6 py-4 font-bold text-slate-600 text-xs uppercase tracking-wider">Clasificación</th>
                                        <th className="px-6 py-4 font-bold text-slate-600 text-xs uppercase tracking-wider text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {datasetEntries.map((entry) => (
                                        <tr key={entry.id} className="hover:bg-indigo-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-700">{new Date(entry.date).toLocaleDateString()}</div>
                                                <div className="text-xs text-slate-400 font-mono">{entry.id.slice(-6)}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-slate-800">{getBusinessName(entry)}</div>
                                                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded capitalize">{getBusinessType(entry)}</span>
                                            </td>
                                            <td className="px-6 py-4 max-w-md">
                                                <p className="text-sm text-slate-600 truncate">{getSummary(entry)}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold
                                                    ${entry.classification === 'exito' ? 'bg-green-100 text-green-700' :
                                                        entry.classification === 'fracaso' ? 'bg-red-100 text-red-700' :
                                                            'bg-slate-100 text-slate-600'}`}>
                                                    {entry.classification === 'exito' && <Check size={12} />}
                                                    {entry.classification === 'fracaso' && <X size={12} />}
                                                    {(entry.classification || 'neutro').toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-slate-400 hover:text-red-600 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
