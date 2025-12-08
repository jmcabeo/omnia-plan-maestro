
import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Upload, Calculator, FileText, Menu, X } from 'lucide-react';

export default function DashboardLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-xl font-bold text-indigo-900 tracking-tight">Omnia 3.0</h1>
                    <p className="text-xs text-slate-500">IA de Decisiones</p>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                        <LayoutDashboard size={20} />
                        Dashboard
                    </NavLink>
                    <NavLink to="/upload" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                        <Upload size={20} />
                        Carga de Datos
                    </NavLink>
                    <NavLink to="/simulator" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                        <Calculator size={20} />
                        Simulador
                    </NavLink>
                    <NavLink to="/plan" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                        <FileText size={20} />
                        Plan IA
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">JM</div>
                        <div>
                            <p className="text-sm font-medium text-slate-700">Jonathan M.</p>
                            <p className="text-xs text-slate-500">Admin</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="md:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-20">
                    <h1 className="font-bold text-indigo-900">Omnia 3.0</h1>
                    <button
                        className="p-2 text-slate-600"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <Menu size={24} />
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-50 bg-slate-900/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl" onClick={e => e.stopPropagation()}>
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-indigo-900">Omnia 3.0</h2>
                                    <p className="text-xs text-slate-500">IA de Decisiones</p>
                                </div>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 text-slate-500 hover:bg-slate-100 rounded-full"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <nav className="p-4 space-y-1">
                                <NavLink
                                    to="/"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                                >
                                    <LayoutDashboard size={20} />
                                    Dashboard
                                </NavLink>
                                <NavLink
                                    to="/upload"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                                >
                                    <Upload size={20} />
                                    Carga de Datos
                                </NavLink>
                                <NavLink
                                    to="/simulator"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                                >
                                    <Calculator size={20} />
                                    Simulador
                                </NavLink>
                                <NavLink
                                    to="/plan"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                                >
                                    <FileText size={20} />
                                    Plan IA
                                </NavLink>
                            </nav>

                            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">JM</div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">Jonathan M.</p>
                                        <p className="text-xs text-slate-500">Admin</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
