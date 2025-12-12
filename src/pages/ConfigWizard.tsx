import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import {
    Store, Target, DollarSign, Users, Package, Megaphone, Gamepad2,
    ChevronRight, ChevronLeft, CheckCircle2, Loader2, Upload, Shield, FileSpreadsheet
} from 'lucide-react';
import DataImportStep from '../components/DataImportStep';

const STEPS = [
    { title: 'Información Básica', icon: Store, id: 'info' },
    { title: 'Objetivos', icon: Target, id: 'goals' },
    { title: 'Carga de Datos', icon: FileSpreadsheet, id: 'data' },
    { title: 'Datos Económicos', icon: DollarSign, id: 'economics' },
    { title: 'Capacidad Operativa', icon: Users, id: 'capacity' },
    { title: 'Revisión Productos', icon: Package, id: 'products' },
    { title: 'Marketing', icon: Megaphone, id: 'marketing' },
    { title: 'Restricciones', icon: Shield, id: 'constraints' },
    { title: 'Juegos Omnia', icon: Gamepad2, id: 'games' }
];

export default function ConfigWizard() {
    const navigate = useNavigate();
    const store = useAppStore();
    const [currentStep, setCurrentStep] = useState(0);
    const [saving, setSaving] = useState(false);

    const handleNext = async () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Final Step - Save Profile
            setSaving(true);
            try {
                await store.saveBusinessProfile();
                navigate('/dashboard');
            } catch (error) {
                console.error("Error saving:", error);
            } finally {
                setSaving(false);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const StepIcon = STEPS[currentStep].icon;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header / Progress Bar */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 py-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                                <ChevronLeft size={24} />
                            </button>
                            <h1 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                                <StepIcon className="text-indigo-600" />
                                {STEPS[currentStep].title}
                            </h1>
                        </div>
                        <span className="text-sm font-medium text-slate-500">Paso {currentStep + 1} de {STEPS.length}</span>
                    </div>
                    {/* Progress Bar Container */}
                    <div className="h-2 bg-slate-100 rounded-full w-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-600 transition-all duration-500 ease-out"
                            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 animate-fadeIn">
                {/* Step Content Render */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 min-h-[400px]">
                    <StepContent step={currentStep} store={store} />
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="bg-white border-t border-slate-200 p-4 sticky bottom-0">
                <div className="max-w-4xl mx-auto flex justify-between">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 0 || saving}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                        <ChevronLeft size={20} />
                        Anterior
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={saving}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:pointer-events-none"
                    >
                        {saving ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                {currentStep === STEPS.length - 1 ? 'Finalizar Configuración' : 'Siguiente Paso'}
                                {currentStep < STEPS.length - 1 && <ChevronRight size={20} />}
                                {currentStep === STEPS.length - 1 && <CheckCircle2 size={20} />}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Sub-component to render step content to keep main file clean
const StepContent = ({ step, store }: { step: number, store: any }) => {
    switch (step) {
        case 0: return <StepInfo store={store} />;
        case 1: return <StepGoals store={store} />;
        case 2: return <DataImportStep />;
        case 3: return <StepEconomics store={store} />;
        case 4: return <StepCapacity store={store} />;
        case 5: return <StepProducts store={store} />;
        case 6: return <StepMarketing store={store} />;
        case 7: return <StepConstraints store={store} />;
        case 8: return <StepGames store={store} />;
        default: return null;
    }
};

const StepInfo = ({ store }: { store: any }) => (
    <div className="space-y-6">
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nombre del Negocio</label>
            <input
                type="text"
                value={store.nombreNegocio}
                onChange={(e) => store.setField('nombreNegocio', e.target.value)}
                className="w-full text-lg p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300"
                placeholder="Ej. Restaurante La Plaza"
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Negocio</label>
                <select
                    value={store.businessType}
                    onChange={(e) => store.setField('businessType', e.target.value)}
                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                    <option value="horeca">Restaurante / Cafetería (HORECA)</option>
                    <option value="retail">Comercio (Retail)</option>
                    <option value="servicios">Servicios Profesionales</option>
                    <option value="estetica">Estética y Belleza</option>
                    <option value="salud">Salud y Bienestar</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Ciudad</label>
                <input
                    type="text"
                    value={store.ciudad}
                    onChange={(e) => store.setField('ciudad', e.target.value)}
                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Ej. Madrid"
                />
            </div>
        </div>
    </div>
);

const StepGoals = ({ store }: { store: any }) => {
    const goals = [
        { id: 'subir_ticket', label: 'Subir Ticket Medio', desc: 'Aumentar el gasto por cliente' },
        { id: 'aumentar_recurrencia', label: 'Aumentar Recurrencia', desc: 'Que los clientes vuelvan más a menudo' },
        { id: 'llenar_horas_valle', label: 'Llenar Horas Valle', desc: 'Más clientes en horas muertas' },
        { id: 'captacion_nuevos', label: 'Captación Nuevos', desc: 'Atraer clientes que no te conocen' },
        { id: 'rotar_productos', label: 'Rotar Productos', desc: 'Dar salida a stock o nuevos platos' },
        { id: 'bajar_dependencia', label: 'Bajar Dependencia Personal', desc: 'Automatizar procesos' },
        { id: 'fidelizacion_vip', label: 'Plan Fidelización VIP', desc: 'Cuidar a los mejores clientes' },
    ];

    const toggleGoal = (id: string) => {
        const current = store.objetivos || [];
        if (current.includes(id)) {
            store.setField('objetivos', current.filter((g: string) => g !== id));
        } else {
            store.setField('objetivos', [...current, id]);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map(goal => (
                    <div
                        key={goal.id}
                        onClick={() => toggleGoal(goal.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${store.objetivos.includes(goal.id) ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 hover:border-indigo-200'}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${store.objetivos.includes(goal.id) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                                {store.objetivos.includes(goal.id) && <CheckCircle2 size={12} className="text-white" />}
                            </div>
                            <div>
                                <h3 className={`font-bold ${store.objetivos.includes(goal.id) ? 'text-indigo-900' : 'text-slate-700'}`}>{goal.label}</h3>
                                <p className="text-xs text-slate-500">{goal.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Otros objetivos / Comentarios</label>
                <textarea
                    value={store.objetivosComentario}
                    onChange={(e) => store.setField('objetivosComentario', e.target.value)}
                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                    placeholder="Cuéntanos más detalles sobre lo que quieres conseguir..."
                />
            </div>
        </div>
    );
};

const StepEconomics = ({ store }: { store: any }) => (
    <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm mb-6">
            💡 Estos datos son cruciales para que la IA calcule el ROI de tu estrategia.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Facturación Mensual</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">€</span>
                    <input
                        type="number"
                        value={store.facturacionMensual}
                        onChange={(e) => store.setField('facturacionMensual', Number(e.target.value))}
                        className="w-full pl-8 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Ticket Medio</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">€</span>
                    <input
                        type="number"
                        value={store.ticketPromedio}
                        onChange={(e) => store.setField('ticketPromedio', Number(e.target.value))}
                        className="w-full pl-8 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tickets / Mes (aprox)</label>
                <input
                    type="number"
                    value={store.ticketsMensuales}
                    onChange={(e) => store.setField('ticketsMensuales', Number(e.target.value))}
                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
            </div>
        </div>
    </div>
);

const StepCapacity = ({ store }: { store: any }) => (
    <div className="space-y-6">
        {store.businessType === 'horeca' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nº Mesas</label>
                    <input
                        type="number"
                        value={store.capacidad.numMesas}
                        onChange={(e) => store.updateCapacity({ numMesas: Number(e.target.value) })}
                        className="w-full p-4 border border-slate-200 rounded-xl"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Personal Sala</label>
                    <input
                        type="number"
                        value={store.capacidad.personalSala}
                        onChange={(e) => store.updateCapacity({ personalSala: Number(e.target.value) })}
                        className="w-full p-4 border border-slate-200 rounded-xl"
                    />
                </div>
                {/* More specific HORECA fields can go here */}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nº Profesionales</label>
                    <input
                        type="number"
                        value={store.capacidad.numProfesionales}
                        onChange={(e) => store.updateCapacity({ numProfesionales: Number(e.target.value) })}
                        className="w-full p-4 border border-slate-200 rounded-xl"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Citas Simultáneas</label>
                    <input
                        type="number"
                        value={store.capacidad.serviciosSimultaneos}
                        onChange={(e) => store.updateCapacity({ serviciosSimultaneos: Number(e.target.value) })}
                        className="w-full p-4 border border-slate-200 rounded-xl"
                    />
                </div>
            </div>
        )}


        <div className="pt-6 border-t border-slate-100">
            <h4 className="font-bold text-slate-800 mb-4">Horarios y Picos de Demanda</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Días/Horas Pico (Alta demanda)</label>
                    <input
                        type="text"
                        placeholder="Ej. Viernes y Sábado, 20:00-23:00"
                        value={store.capacidad.horarios?.horasPico.join(', ') || ''}
                        onChange={(e) => store.updateCapacity({
                            horarios: { ...store.capacidad.horarios, horasPico: [e.target.value] } // Simplificado para texto libre por ahora
                        })}
                        className="w-full p-4 border border-slate-200 rounded-xl"
                    />
                    <p className="text-xs text-slate-500 mt-1">Momentos donde el local está lleno.</p>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Días/Horas Valle (Baja demanda)</label>
                    <input
                        type="text"
                        placeholder="Ej. Lunes a Jueves, 16:00-19:00"
                        value={store.capacidad.horarios?.horasValle.join(', ') || ''}
                        onChange={(e) => store.updateCapacity({
                            horarios: { ...store.capacidad.horarios, horasValle: [e.target.value] }
                        })}
                        className="w-full p-4 border border-slate-200 rounded-xl"
                    />
                    <p className="text-xs text-slate-500 mt-1">Momentos que quieres llenar.</p>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Días de Cierre</label>
                    <input
                        type="text"
                        placeholder="Ej. Domingos noche, Lunes todo el día"
                        value={store.capacidad.horarios?.diasCerrado.join(', ') || ''}
                        onChange={(e) => store.updateCapacity({
                            horarios: { ...store.capacidad.horarios, diasCerrado: [e.target.value] }
                        })}
                        className="w-full p-4 border border-slate-200 rounded-xl"
                    />
                </div>
            </div>
        </div>
    </div >
);

const StepProducts = ({ store }: { store: any }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', cost: '', price: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAdd = () => {
        if (!newProduct.name || !newProduct.price) return;

        const cost = parseFloat(newProduct.cost) || 0;
        const price = parseFloat(newProduct.price);
        const margin = price > 0 ? ((price - cost) / price) * 100 : 0;

        store.addProduct({
            id: Date.now(), // Simple ID generation
            name: newProduct.name,
            cost: cost,
            price: price,
            margin: margin,
            category: 'General', // Default
            salesMonthly: 0
        });

        setNewProduct({ name: '', cost: '', price: '' });
        setIsAdding(false);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const lines = text.split(/\r\n|\n/);
            let addedCount = 0;

            lines.forEach(line => {
                const cleanLine = line.trim();
                // Skip empty lines or headers
                if (!cleanLine || cleanLine.toLowerCase().startsWith('nombre') || cleanLine.toLowerCase().startsWith('name') || cleanLine.toLowerCase().startsWith('id')) return;

                // Try semicolon first (common in Excel CSVs for Europe), then comma
                const parts = cleanLine.includes(';') ? cleanLine.split(';') : cleanLine.split(',');

                // Expected Template: ID;Nombre;Categoria;Costo;Precio;VentasMensuales
                // parts[0]=ID, parts[1]=Nombre, parts[2]=Cat, parts[3]=Costo, parts[4]=Precio
                if (parts.length >= 5) {
                    const name = parts[1].trim();
                    // Cost is index 3
                    const costStr = parts[3] ? parts[3].replace('€', '').replace('$', '').trim() : '0';
                    // Price is index 4
                    const priceStr = parts[4] ? parts[4].replace('€', '').replace('$', '').trim() : '0';

                    const price = parseFloat(priceStr);
                    const cost = parseFloat(costStr);

                    if (name && !isNaN(price)) {
                        const margin = price > 0 ? ((price - cost) / price) * 100 : 0;
                        store.addProduct({
                            id: Date.now() + Math.random(),
                            name,
                            cost,
                            price,
                            margin,
                            category: parts[2]?.trim() || 'Importado',
                            salesMonthly: parseFloat(parts[5] || '0')
                        });
                        addedCount++;
                    }
                } else if (parts.length >= 2 && !parts[0].match(/^P\d+/)) {
                    // Fallback for simple format: Nombre;Precio;Costo (legacy support) - Check if part 0 is NOT an ID like P001
                    const name = parts[0].trim();
                    const priceStr = parts[1].replace('€', '').replace('$', '').trim();
                    const costStr = parts[2] ? parts[2].replace('€', '').replace('$', '').trim() : '0';

                    const price = parseFloat(priceStr);
                    const cost = parseFloat(costStr);

                    if (name && !isNaN(price)) {
                        const margin = price > 0 ? ((price - cost) / price) * 100 : 0;
                        store.addProduct({
                            id: Date.now() + Math.random(),
                            name,
                            cost,
                            price,
                            margin,
                            category: 'Manual',
                            salesMonthly: 0
                        });
                        addedCount++;
                    }
                }
            });

            if (addedCount > 0) {
                alert(`✅ Se han importado ${addedCount} productos correctamente.`);
            } else {
                alert('⚠️ No se encontraron productos válidos. Usa la "Plantilla Catálogo" (ID;Nombre;Categoria;Costo;Precio...)');
            }
            if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 text-lg">Revisión de Productos</h3>
                <div className="flex gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept=".csv,.txt"
                        className="hidden"
                        onChange={handleFileUpload}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-indigo-600 font-bold border border-indigo-200 px-4 py-2 rounded-lg hover:bg-indigo-50 flex items-center gap-2"
                        title="Formato: Nombre; Precio; Costo"
                    >
                        <Upload size={18} />
                        Importar CSV
                    </button>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-indigo-600 text-white font-bold border border-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-md shadow-indigo-200"
                    >
                        <Package size={18} />
                        Añadir Manual
                    </button>
                </div>
            </div>

            {isAdding && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 animate-fadeIn mb-6">
                    <h4 className="font-bold text-slate-700 mb-4">Nuevo Producto</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Nombre</label>
                            <input
                                type="text"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                className="w-full p-2 border border-slate-200 rounded-lg"
                                placeholder="Ej. Café con Leche"
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Precio Venta (€)</label>
                            <input
                                type="number"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                className="w-full p-2 border border-slate-200 rounded-lg"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Costo (€) (Opcional)</label>
                            <input
                                type="number"
                                value={newProduct.cost}
                                onChange={(e) => setNewProduct({ ...newProduct, cost: e.target.value })}
                                className="w-full p-2 border border-slate-200 rounded-lg"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setIsAdding(false)}
                            className="text-slate-500 font-medium px-4 py-2 hover:bg-slate-200 rounded-lg"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleAdd}
                            disabled={!newProduct.name || !newProduct.price}
                            className="bg-indigo-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            )}

            {store.products.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                    <Package size={48} className="text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No hay productos añadidos aún.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                            <tr>
                                <th className="p-3">Nombre</th>
                                <th className="p-3">Precio</th>
                                <th className="p-3">Costo</th>
                                <th className="p-3">Margen</th>
                                <th className="p-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {store.products.map((product: any) => (
                                <tr key={product.id} className="hover:bg-slate-50">
                                    <td className="p-3 font-medium text-slate-800">{product.name}</td>
                                    <td className="p-3 text-emerald-600 font-bold">{Number(product.price).toFixed(2)} €</td>
                                    <td className="p-3 text-slate-500">{Number(product.cost).toFixed(2)} €</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${product.margin > 70 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {Number(product.margin).toFixed(0)}%
                                        </span>
                                    </td>
                                    <td className="p-3 text-right">
                                        <button
                                            onClick={() => store.removeProduct(product.id)}
                                            className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded"
                                            title="Eliminar"
                                        >
                                            <div className="w-4 h-4 border-2 border-current rounded-full flex items-center justify-center">
                                                <div className="w-2 h-0.5 bg-current transform rotate-45 absolute" />
                                                <div className="w-2 h-0.5 bg-current transform -rotate-45 absolute" />
                                            </div>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const StepMarketing = ({ store }: { store: any }) => (
    <div className="space-y-6">
        <h3 className="font-bold text-slate-800">Canales Activos</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['instagram', 'facebook', 'tiktok', 'google', 'email', 'whatsapp'].map(channel => (
                <label key={channel} className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                    <input
                        type="checkbox"
                        checked={store.marketing[channel]}
                        onChange={(e) => store.updateMarketing({ [channel]: e.target.checked })}
                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="capitalize font-medium text-slate-700">{channel}</span>
                </label>
            ))}
        </div>

        <div className="pt-4 border-t border-slate-100">
            <label className="flex items-center gap-3 mb-4">
                <input
                    type="checkbox"
                    checked={store.marketing.adsActivas}
                    onChange={(e) => store.updateMarketing({ adsActivas: e.target.checked })}
                    className="w-5 h-5 text-indigo-600 rounded"
                />
                <span className="font-bold text-slate-800">¿Haces Publicidad de Pago (Ads)?</span>
            </label>

            {store.marketing.adsActivas && (
                <div className="pl-8 animate-fadeIn">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Presupuesto Diario (€)</label>
                    <input
                        type="number"
                        value={store.marketing.presupuestoDiario}
                        onChange={(e) => store.updateMarketing({ presupuestoDiario: Number(e.target.value) })}
                        className="w-full max-w-xs p-3 border border-slate-200 rounded-lg"
                    />
                </div>
            )}
        </div>
    </div>
);

const StepGames = ({ store }: { store: any }) => {
    const toggleGame = (game: string) => {
        const currentGames = store.strategyConfig.juegosActivos || [];
        const isSelected = currentGames.includes(game);

        let updatedGames;
        if (isSelected) {
            updatedGames = currentGames.filter((g: string) => g !== game);
        } else {
            updatedGames = [...currentGames, game];
        }

        store.updateStrategyConfig({ juegosActivos: updatedGames });
    };

    return (
        <div className="space-y-6">
            <p className="text-slate-600">Selecciona qué juegos quieres que la IA considere para tu estrategia.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Ruleta', 'Rasca y Gana', 'Puzzle', 'Memorama', 'Cazar Objetos'].map((game, idx) => {
                    const isActive = store.strategyConfig.juegosActivos?.includes(game);
                    return (
                        <div
                            key={idx}
                            onClick={() => toggleGame(game)}
                            className={`p-4 border rounded-xl flex justify-between items-center cursor-pointer transition-all ${isActive
                                ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                                : 'bg-white border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            <span className={`font-bold ${isActive ? 'text-indigo-700' : 'text-slate-700'}`}>{game}</span>
                            <div className={`h-6 w-10 rounded-full relative transition-colors ${isActive ? 'bg-green-500' : 'bg-slate-300'}`}>
                                <div className={`absolute top-1 h-4 w-4 bg-white rounded-full shadow-sm transition-transform ${isActive ? 'right-1' : 'left-1'}`}></div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-8 bg-indigo-50 p-6 rounded-xl">
                <h4 className="font-bold text-indigo-900 mb-4">Configuración de Seguridad</h4>
                <div className="space-y-4">
                    <label className="flex items-center justify-between">
                        <span className="text-indigo-800">Sistema Anti-Fraude IA</span>
                        <input type="checkbox" checked={store.strategyConfig.antiFraude} readOnly className="toggle" />
                    </label>
                    <label className="flex items-center justify-between">
                        <span className="text-indigo-800">Validación por Ticket de Caja</span>
                        <input type="checkbox" checked={store.strategyConfig.validacionTicket} readOnly className="toggle" />
                    </label>
                </div>
            </div>
        </div>
    );
};

const StepConstraints = ({ store }: { store: any }) => (
    <div className="space-y-8 animate-fadeIn">
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-amber-800 text-sm flex gap-3">
            <Shield className="shrink-0" size={20} />
            <div>
                <span className="font-bold block mb-1">Protege tu Rentabilidad</span>
                Define los límites que la IA nunca debe cruzar. Esto garantiza que las estrategias generadas sean siempre rentables.
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-4 flex justify-between">
                    <span>Descuento Máximo Permitido</span>
                    <span className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{store.constraints.maxDiscount}%</span>
                </label>
                <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={store.constraints.maxDiscount}
                    onChange={(e) => store.updateConstraints({ maxDiscount: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <p className="text-xs text-slate-500 mt-2">La IA nunca sugerirá descuentos superiores a este valor.</p>
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-4 flex justify-between">
                    <span>Margen Mínimo Deseado</span>
                    <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{store.constraints.minMargin}%</span>
                </label>
                <input
                    type="range"
                    min="10"
                    max="90"
                    step="5"
                    value={store.constraints.minMargin}
                    onChange={(e) => store.updateConstraints({ minMargin: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <p className="text-xs text-slate-500 mt-2">Margen bruto mínimo que quieres mantener en promociones.</p>
            </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
            <label className="block text-sm font-bold text-slate-700 mb-4">Días "Prohibidos" para Promociones</label>
            <div className="flex flex-wrap gap-2">
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => {
                    const isForbidden = store.constraints.forbiddenDays.includes(day);
                    return (
                        <button
                            key={day}
                            onClick={() => {
                                const current = store.constraints.forbiddenDays;
                                const updated = isForbidden
                                    ? current.filter((d: string) => d !== day)
                                    : [...current, day];
                                store.updateConstraints({ forbiddenDays: updated });
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isForbidden
                                ? 'bg-red-100 text-red-700 border-red-200 border'
                                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                                }`}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
            <p className="text-xs text-slate-500 mt-3">Selecciona los días en los que NO quieres que se activen campañas agresivas.</p>
        </div>

        <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Productos en Lista Negra (Nunca promocionar)</label>
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 text-sm text-center">
                {store.products.length > 0 ? (
                    <p>Funcionalidad de selección detallada en desarrollo. La IA usará margen como criterio principal.</p>
                ) : (
                    <p>Añade productos primero para poder excluirlos.</p>
                )}
            </div>
        </div>
    </div>
);
