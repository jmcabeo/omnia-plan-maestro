
import React, { useRef } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, Download } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function DataUpload() {
    const { uploadedFiles, setFileUploaded } = useAppStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const currentUploadType = useRef<string>("");

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
        </div>
    );
}
