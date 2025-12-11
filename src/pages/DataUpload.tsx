import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSpreadsheet, X, ChevronLeft } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { generateMockStrategyData } from '../utils/aiHelpers';
import DataImportStep from '../components/DataImportStep';

export default function DataUpload() {
    const navigate = useNavigate();
    const store = useAppStore();

    const [showReport, setShowReport] = useState(false);
    const [reportData, setReportData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleGenerateReport = () => {
        setLoading(true);
        setTimeout(() => {
            const data = generateMockStrategyData(store);
            setReportData(data);
            setShowReport(true);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="animate-fadeIn max-w-4xl mx-auto p-4 relative">
            <button
                onClick={() => navigate('/dashboard')}
                className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
            >
                <ChevronLeft size={20} />
                <span className="font-bold text-sm hidden md:inline">Dashboard</span>
            </button>

            <div className="mt-12 mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Actualización de Datos</h1>
                <p className="text-slate-500">Sube los nuevos archivos semanales o mensuales para mantener tu IA actualizada.</p>
            </div>

            <DataImportStep />

            <div className="flex justify-center mb-8 mt-8">
                <button
                    onClick={handleGenerateReport}
                    disabled={loading}
                    className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>Generando Informe...</>
                    ) : (
                        <>
                            <FileSpreadsheet size={24} />
                            Generar Informe de Datos IA
                        </>
                    )}
                </button>
            </div>

            {/* Modal de Informe */}
            {showReport && reportData && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <FileSpreadsheet className="text-indigo-600" />
                                Informe de Análisis de Datos
                            </h2>
                            <button onClick={() => setShowReport(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                <h3 className="font-bold text-indigo-900 mb-2">Análisis General</h3>
                                <p className="text-indigo-800 text-sm leading-relaxed">{reportData.analisisGeneral}</p>
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-800 mb-3">Oportunidades Detectadas</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 border border-slate-200 rounded-xl">
                                        <div className="text-sm text-slate-500 mb-1">ROI Estimado</div>
                                        <div className="text-2xl font-bold text-green-600">{reportData.roiEstimado}x</div>
                                    </div>
                                    <div className="p-4 border border-slate-200 rounded-xl">
                                        <div className="text-sm text-slate-500 mb-1">Productos Gancho</div>
                                        <div className="text-sm font-medium text-slate-700">{reportData.productosGancho.join(', ')}</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-800 mb-3">Recomendación Estratégica</h3>
                                <p className="text-slate-600 text-sm bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    {reportData.resumenEstrategia}
                                </p>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
                            <button
                                onClick={() => setShowReport(false)}
                                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700"
                            >
                                Cerrar Informe
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
