
import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, Download, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { generateMockStrategyData } from '../utils/aiHelpers';

export default function DataUpload() {
    const store = useAppStore();
    const { uploadedFiles, setFileUploaded } = store;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const currentUploadType = useRef<string>("");

    const [showReport, setShowReport] = useState(false);
    const [reportData, setReportData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleCardClick = (type: string) => {
        currentUploadType.current = type;
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setTimeout(() => {
                setFileUploaded(currentUploadType.current, true);
            }, 500);
        }
    };

    const handleDownloadTemplate = (type: string) => {
        let headers = '';
        let sampleRow = '';
        let filename = '';

        switch (type) {
            case 'Tickets de Venta':
                headers = 'ID_Ticket;Fecha;Hora;Total;MetodoPago;Items';
                sampleRow = 'T001;2024-01-15;14:30;45.50;Tarjeta;3';
                filename = 'plantilla_tickets.csv';
                break;
            case 'Catálogo Productos':
                headers = 'ID;Nombre;Categoria;Costo;Precio;VentasMensuales';
                sampleRow = 'P001;Hamburguesa Clásica;Comida;3.50;12.90;150';
                filename = 'plantilla_catalogo.csv';
                break;
            case 'Uso de Promociones':
                headers = 'ID_Promo;Nombre;Canjes;DescuentoTotal;Fecha';
                sampleRow = 'PR01;2x1 Cerveza;45;135.00;2024-01-15';
                filename = 'plantilla_promociones.csv';
                break;
            default:
                return;
        }

        const csvContent = `${headers}\n${sampleRow}`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

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
        <div className="animate-fadeIn max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Carga de Datos</h1>
            <p className="text-slate-500 mb-8">Sube los archivos de tu sistema POS o CRM para alimentar la IA.</p>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileChange}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {['Tickets de Venta', 'Catálogo Productos', 'Uso de Promociones'].map((type, idx) => {
                    const isUploaded = uploadedFiles[type];
                    return (
                        <div
                            key={idx}
                            className="bg-white p-6 rounded-xl shadow-sm border transition-all relative overflow-hidden border-slate-200"
                        >
                            {isUploaded && (
                                <div className="absolute top-3 right-3 text-green-500 animate-fadeIn">
                                    <CheckCircle size={20} />
                                </div>
                            )}
                            <div className={`mb-4 p-3 rounded-full w-12 h-12 flex items-center justify-center transition-colors ${isUploaded ? 'bg-green-100 text-green-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                <Upload size={24} />
                            </div>
                            <h3 className="font-bold text-slate-800 mb-2">{type}</h3>
                            <p className="text-xs text-slate-500 mb-4">{isUploaded ? 'Archivo cargado correctamente' : 'Formato CSV o Excel. Máx 5MB.'}</p>

                            <div className="flex gap-2 mb-3">
                                <button
                                    onClick={() => handleCardClick(type)}
                                    className={`flex-1 text-xs font-bold px-3 py-2 rounded transition-colors ${isUploaded ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                                >
                                    {isUploaded ? 'Reemplazar' : 'Subir Archivo'}
                                </button>
                                <button
                                    onClick={() => handleDownloadTemplate(type)}
                                    className="text-xs font-bold bg-white text-indigo-600 px-3 py-2 rounded border border-indigo-200 hover:bg-indigo-50 flex items-center gap-1"
                                    title={`Descargar plantilla de ${type}`}
                                >
                                    <Download size={14} />
                                </button>
                            </div>

                            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full transition-all duration-1000 ${isUploaded ? 'w-full bg-green-500' : 'w-0 bg-indigo-500'}`}></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-center mb-8">
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

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
                <div className="flex items-start gap-4 mb-4">
                    <FileSpreadsheet className="text-indigo-600 mt-1" size={24} />
                    <div>
                        <h3 className="font-bold text-indigo-900 mb-1">Plantillas de Importación</h3>
                        <p className="text-sm text-indigo-700">Descarga las plantillas oficiales para cada tipo de dato. Cada plantilla incluye los campos necesarios y ejemplos realistas.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {['Tickets de Venta', 'Catálogo Productos', 'Uso de Promociones'].map((type) => (
                        <button
                            key={type}
                            onClick={() => handleDownloadTemplate(type)}
                            className="text-xs font-bold bg-white text-indigo-600 px-4 py-2 rounded border border-indigo-200 hover:bg-indigo-50 flex items-center justify-center gap-2"
                        >
                            <FileSpreadsheet size={14} />
                            {type}
                        </button>
                    ))}
                </div>
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
