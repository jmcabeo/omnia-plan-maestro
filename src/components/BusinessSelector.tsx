import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../store/useAppStore';
import { Building2, Loader2, ChevronRight, X, Trash2, PlusCircle } from 'lucide-react';

interface BusinessSelectorProps {
    onClose: () => void;
}

export default function BusinessSelector({ onClose }: BusinessSelectorProps) {
    const [businesses, setBusinesses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const store = useAppStore();
    const { loadBusinessProfile, deleteBusinessProfile, resetState } = store;

    const fetchBusinesses = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('businesses')
            .select('id, name, city, type, created_at')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setBusinesses(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBusinesses();
    }, []);

    const handleSelect = async (id: string) => {
        setLoading(true);
        const success = await loadBusinessProfile(id);
        setLoading(false);
        if (success) {
            onClose();
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('¿Estás seguro de eliminar este negocio? Esta acción no se puede deshacer.')) {
            setLoading(true);
            const success = await deleteBusinessProfile(id);
            if (success) {
                await fetchBusinesses();
            } else {
                setLoading(false);
            }
        }
    };

    const handleCreateNew = () => {
        resetState();
        onClose();
        window.location.href = '/config'; // Force navigate to config
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Building2 size={20} className="text-indigo-600" />
                        Seleccionar Negocio
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
                    <button
                        onClick={handleCreateNew}
                        className="w-full p-4 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 text-indigo-700 font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 hover:border-indigo-400 transition-all mb-4"
                    >
                        <PlusCircle size={20} />
                        Crear Nuevo Negocio
                    </button>

                    {loading && (
                        <div className="flex justify-center py-8">
                            <Loader2 size={32} className="text-indigo-600 animate-spin" />
                        </div>
                    )}

                    {!loading && businesses.length === 0 && (
                        <div className="text-center py-8 text-slate-500">
                            No hay negocios guardados aún.
                        </div>
                    )}

                    {!loading && businesses.map((b) => (
                        <div
                            key={b.id}
                            onClick={() => handleSelect(b.id)}
                            className="w-full relative p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group flex justify-between items-center cursor-pointer"
                        >
                            <div>
                                <div className="font-bold text-slate-800 group-hover:text-indigo-700">{b.name}</div>
                                <div className="text-xs text-slate-500 flex gap-2 mt-1">
                                    <span className="capitalize bg-slate-100 px-2 py-0.5 rounded text-slate-600">{b.type}</span>
                                    <span>{b.city}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => handleDelete(e, b.id)}
                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Eliminar Negocio"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
