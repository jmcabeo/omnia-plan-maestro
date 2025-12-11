import React, { useRef } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, Download } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function DataImportStep() {
    const store = useAppStore();
    const { uploadedFiles, setFileUploaded } = store;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const currentUploadType = useRef<string>("");

    const handleCardClick = (type: string) => {
        currentUploadType.current = type;
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const type = currentUploadType.current;

            // 1. Mark visual feedback
            setFileUploaded(type, true);

            // 2. Parse Data
            const text = await file.text();
            const lines = text.split(/\r\n|\n/).slice(1); // Remove header

            if (type === 'Tickets de Venta') {
                const parsedTickets = lines.map(line => {
                    const cols = line.split(';');
                    if (cols.length < 4) return null;
                    return {
                        id: cols[0],
                        fecha: cols[1],
                        total: parseFloat(cols[3] || '0'),
                        items: parseInt(cols[5] || '0')
                    };
                }).filter(t => t && !isNaN(t.total));
                if (parsedTickets.length > 0) {
                    store.setField('ticketsDiarios', parsedTickets);
                    console.log("✅ Parsed Tickets:", parsedTickets.length);
                }
            }
            else if (type === 'Catálogo Productos') {
                // Reuse logic similar to ConfigWizard or simplified
                const parsedProducts = lines.map((line, idx) => {
                    const cols = line.split(';');
                    if (cols.length < 5) return null;
                    return {
                        id: idx + 1000,
                        name: cols[1],
                        category: cols[2],
                        cost: parseFloat(cols[3] || '0'),
                        price: parseFloat(cols[4] || '0'),
                        salesMonthly: parseFloat(cols[5] || '0'),
                        margin: 0 // Will calc later
                    };
                }).filter(p => p && p.name);

                // Calc margins and add to store
                parsedProducts.forEach(p => {
                    if (p) {
                        p.margin = p.price > 0 ? ((p.price - p.cost) / p.price) * 100 : 0;
                        store.addProduct(p as any);
                    }
                });
                console.log("✅ Parsed Products:", parsedProducts.length);
            }
            else if (type === 'Uso de Promociones') {
                const parsedPromos = lines.map(line => {
                    const cols = line.split(';');
                    if (cols.length < 4) return null;
                    return {
                        idPromo: cols[0],
                        nombre: cols[1],
                        canjes: parseInt(cols[2] || '0'),
                        descuentoTotal: parseFloat(cols[3] || '0')
                    };
                }).filter(p => p && p.idPromo);

                if (parsedPromos.length > 0) {
                    store.setField('promotionsData', parsedPromos);
                    console.log("✅ Parsed Promos:", parsedPromos.length);
                }
            }
        }
    };

    const getDownloadProps = (type: string) => {
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
                return null;
        }

        // BOM + Content
        const csvContent = "\uFEFF" + headers + "\n" + sampleRow;
        // Construct Data URI directly - bypassing Blob and ObjectURL
        const href = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;

        return { href, filename };
    };

    return (
        <div className="animate-fadeIn">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileChange}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {['Tickets de Venta', 'Catálogo Productos', 'Uso de Promociones'].map((type, idx) => {
                    const files = uploadedFiles || {};
                    const isUploaded = files[type];
                    const downloadProps = getDownloadProps(type);

                    return (
                        <div
                            key={idx}
                            className="bg-white p-6 rounded-xl shadow-sm border transition-all relative overflow-hidden border-slate-200 hover:border-indigo-300"
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
                                {downloadProps && (
                                    <a
                                        href={downloadProps.href}
                                        download={downloadProps.filename}
                                        className="text-xs font-bold bg-white text-indigo-600 px-3 py-2 rounded border border-indigo-200 hover:bg-indigo-50 flex items-center gap-1 cursor-pointer transition-colors no-underline"
                                        title={`Descargar plantilla de ${type}`}
                                    >
                                        <span className="mr-1">Descargar</span>
                                        <Download size={14} />
                                    </a>
                                )}
                            </div>

                            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full transition-all duration-1000 ${isUploaded ? 'w-full bg-green-500' : 'w-0 bg-indigo-500'}`}></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
                <FileSpreadsheet className="text-indigo-600 mt-1 flex-shrink-0" size={20} />
                <div className="text-sm text-indigo-900">
                    <p className="font-bold mb-1">¿Por qué es importante?</p>
                    <p>La IA analizará tus tickets para entender patrones de consumo, los productos para optimizar precios, y las promociones para medir efectividad.</p>
                </div>
            </div>
        </div>
    );
}
