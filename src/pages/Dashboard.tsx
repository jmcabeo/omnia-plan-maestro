
import { useAppStore } from '../store/useAppStore';
import { TrendingUp, Users, ShoppingBag, DollarSign, AlertTriangle, TrendingDown } from 'lucide-react';

export default function Dashboard() {
    const { traficoMensual, ticketPromedio, facturacionMensual, presupuestoMarketingPorcentaje } = useAppStore();

    const presupuestoMarketing = (facturacionMensual * presupuestoMarketingPorcentaje) / 100;
    const isLowBudget = presupuestoMarketingPorcentaje < 5;

    const stats = [
        { label: 'Ventas Totales', value: '€15,240', change: '+12%', icon: DollarSign, color: 'text-green-600 bg-green-100' },
        { label: 'Ticket Medio', value: `€${ticketPromedio}`, change: '+3%', icon: ShoppingBag, color: 'text-blue-600 bg-blue-100' },
        { label: 'Tráfico Mensual', value: traficoMensual, change: '-5%', icon: Users, color: 'text-orange-600 bg-orange-100' },
        { label: 'ROI Promociones', value: '3.2x', change: '+15%', icon: TrendingUp, color: 'text-purple-600 bg-purple-100' },
    ];

    return (
        <div className="animate-fadeIn">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Dashboard General</h1>
            <p className="text-slate-500 mb-8">Resumen de actividad del último periodo.</p>

            {/* Marketing Budget Alert */}
            {isLowBudget && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                    <AlertTriangle className="text-amber-600 mt-0.5" size={20} />
                    <div className="flex-1">
                        <h3 className="font-bold text-amber-900 text-sm mb-1">Presupuesto de Marketing Bajo</h3>
                        <p className="text-xs text-amber-700">
                            Actualmente inviertes el <strong>{presupuestoMarketingPorcentaje}%</strong> de tu facturación en marketing.
                            Se recomienda al menos un <strong>5-8%</strong> para crecimiento sostenible.
                        </p>
                    </div>
                </div>
            )}

            {/* Marketing Budget KPI Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium opacity-90">Presupuesto Marketing Mensual</h3>
                            <p className="text-3xl font-bold">€{presupuestoMarketing.toFixed(0)}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm opacity-90">% de Facturación</p>
                        <p className="text-2xl font-bold">{presupuestoMarketingPorcentaje}%</p>
                        {isLowBudget ? (
                            <span className="inline-flex items-center gap-1 text-xs bg-amber-400/30 px-2 py-1 rounded-full mt-1">
                                <TrendingDown size={12} />
                                Bajo recomendado
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-xs bg-green-400/30 px-2 py-1 rounded-full mt-1">
                                <TrendingUp size={12} />
                                Óptimo
                            </span>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                    <div>
                        <p className="text-xs opacity-75">Facturación Mensual</p>
                        <p className="text-lg font-semibold">€{facturacionMensual.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-xs opacity-75">Recomendado (5%)</p>
                        <p className="text-lg font-semibold">€{((facturacionMensual * 5) / 100).toFixed(0)}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-lg ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.label}</h3>
                        <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-64 flex items-center justify-center text-slate-400">
                    Gráfico de Ventas (Placeholder)
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-64 flex items-center justify-center text-slate-400">
                    Top Productos (Placeholder)
                </div>
            </div>
        </div>
    );
}
