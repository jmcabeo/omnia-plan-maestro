import { create } from 'zustand';
import type {
    AppStateData,
    Product,
    PriceRange,
    KeyProduct,
    AIStrategyRecommendation,
    BusinessSchedule,
    StrategyConfig,
    MarketingPlan
} from '../types/index';

interface AppStore extends AppStateData {
    // Actions
    setField: (field: keyof AppStateData, value: any) => void;

    // Product actions (legacy)
    addProduct: () => void;
    updateProduct: (id: number, field: keyof Product, value: any) => void;
    removeProduct: (id: number) => void;

    // Price Range actions
    addPriceRange: () => void;
    updatePriceRange: (id: number, field: keyof PriceRange, value: any) => void;
    removePriceRange: (id: number) => void;

    // Key Product actions
    addKeyProduct: (tipo: 'top_ventas' | 'top_margen' | 'bajo_ventas') => void;
    updateKeyProduct: (id: number, field: keyof KeyProduct, value: any) => void;
    removeKeyProduct: (id: number) => void;

    // Schedule actions
    updateSchedule: (field: keyof BusinessSchedule, value: any) => void;

    // Strategy Config actions
    updateStrategyConfig: (field: keyof StrategyConfig, value: any) => void;

    // AI Recommendation
    setAIRecommendation: (recommendation: AIStrategyRecommendation) => void;
    setMarketingPlan: (plan: MarketingPlan) => void;

    // File upload
    setFileUploaded: (fileType: string, status: boolean) => void;

    // Reset
    resetState: () => void;
}

const INITIAL_STATE: AppStateData = {
    businessType: 'horeca',
    ticketPromedio: 15,
    comensalesMesa: 2.5,
    margenPromedio: 65,
    traficoMensual: 1000,
    inversionInvertir: 5,
    products: [{ id: 1, name: 'Ejemplo', cost: 2.00, price: 10.00, sales: 100 }],

    facturacionMensual: 15000,
    presupuestoMarketingPorcentaje: 3,

    objetivoPrincipal: 'captacion',
    diasValidez: 'semana',

    dataCollection: 'basic',
    validationMethod: 'qr_secure',

    uploadedFiles: {},

    // Horarios del negocio - ejemplo
    businessSchedule: {
        diasFlojos: ['Lunes', 'Martes', 'Miércoles'],
        horasFlojas: '15:00-19:00',
        diasLlenos: ['Viernes', 'Sábado'],
        horasLlenas: '13:00-15:00, 20:00-23:00'
    },

    // Configuración de estrategia - defaults
    strategyConfig: {
        numJuegos: 2,           // Bienvenida + Ticket QR
        numCupones: 5,
        numVales: 3,
        tarjetaSellos: true,
        tarjetaPuntos: true,
        validezCuponesDias: 30,
        gastoMinBienvenida: 5,  // Siempre 5€
        gastoMinTicketQR: 15    // Igual al ticket medio por defecto
    },

    // AI-First Strategy - Datos de ejemplo
    priceRanges: [
        { id: 1, nombre: 'Bebidas Frías', costoPromedio: 1.20, precioVentaPromedio: 4.50, ventasMensuales: 800, margenPromedio: 73.3 },
        { id: 2, nombre: 'Bebidas Calientes', costoPromedio: 0.90, precioVentaPromedio: 3.80, ventasMensuales: 650, margenPromedio: 76.3 },
        { id: 3, nombre: 'Platos Principales', costoPromedio: 6.00, precioVentaPromedio: 18.00, ventasMensuales: 350, margenPromedio: 66.7 },
        { id: 4, nombre: 'Entrantes y Tapas', costoPromedio: 2.50, precioVentaPromedio: 8.00, ventasMensuales: 420, margenPromedio: 68.8 },
        { id: 5, nombre: 'Postres', costoPromedio: 2.00, precioVentaPromedio: 6.50, ventasMensuales: 180, margenPromedio: 69.2 }
    ],
    keyProducts: [
        // Top 10 Más Vendidos
        { id: 1, nombre: 'Café Americano', categoria: 'Bebidas Calientes', costo: 0.80, precioVenta: 3.50, ventasMensuales: 450, margen: 77.1, tipo: 'top_ventas', posicionRanking: 1 },
        { id: 2, nombre: 'Cerveza Artesanal', categoria: 'Bebidas Frías', costo: 1.20, precioVenta: 5.00, ventasMensuales: 320, margen: 76.0, tipo: 'top_ventas', posicionRanking: 2 },
        { id: 3, nombre: 'Refresco Coca-Cola', categoria: 'Bebidas Frías', costo: 0.50, precioVenta: 2.50, ventasMensuales: 280, margen: 80.0, tipo: 'top_ventas', posicionRanking: 3 },
        { id: 4, nombre: 'Hamburguesa Clásica', categoria: 'Platos Principales', costo: 5.00, precioVenta: 15.00, ventasMensuales: 180, margen: 66.7, tipo: 'top_ventas', posicionRanking: 4 },
        { id: 5, nombre: 'Pizza Margarita', categoria: 'Platos Principales', costo: 4.50, precioVenta: 14.00, ventasMensuales: 150, margen: 67.9, tipo: 'top_ventas', posicionRanking: 5 },
        { id: 6, nombre: 'Patatas Bravas', categoria: 'Entrantes y Tapas', costo: 1.80, precioVenta: 6.00, ventasMensuales: 145, margen: 70.0, tipo: 'top_ventas', posicionRanking: 6 },
        { id: 7, nombre: 'Croquetas Caseras', categoria: 'Entrantes y Tapas', costo: 2.20, precioVenta: 7.50, ventasMensuales: 138, margen: 70.7, tipo: 'top_ventas', posicionRanking: 7 },
        { id: 8, nombre: 'Agua Mineral', categoria: 'Bebidas Frías', costo: 0.30, precioVenta: 2.00, ventasMensuales: 135, margen: 85.0, tipo: 'top_ventas', posicionRanking: 8 },
        { id: 9, nombre: 'Café con Leche', categoria: 'Bebidas Calientes', costo: 1.00, precioVenta: 4.00, ventasMensuales: 125, margen: 75.0, tipo: 'top_ventas', posicionRanking: 9 },
        { id: 10, nombre: 'Brownie Chocolate', categoria: 'Postres', costo: 1.50, precioVenta: 5.00, ventasMensuales: 110, margen: 70.0, tipo: 'top_ventas', posicionRanking: 10 },

        // Peor 10 Ventas
        { id: 11, nombre: 'Ensalada Gourmet', categoria: 'Platos Principales', costo: 3.00, precioVenta: 12.00, ventasMensuales: 15, margen: 75.0, tipo: 'bajo_ventas', posicionRanking: -1 },
        { id: 12, nombre: 'Sopa del Día', categoria: 'Entrantes y Tapas', costo: 2.50, precioVenta: 8.00, ventasMensuales: 22, margen: 68.8, tipo: 'bajo_ventas', posicionRanking: -2 },
        { id: 13, nombre: 'Tarta Especial', categoria: 'Postres', costo: 3.50, precioVenta: 8.50, ventasMensuales: 18, margen: 58.8, tipo: 'bajo_ventas', posicionRanking: -3 },
        { id: 14, nombre: 'Vino Premium', categoria: 'Bebidas Frías', costo: 8.00, precioVenta: 18.00, ventasMensuales: 12, margen: 55.6, tipo: 'bajo_ventas', posicionRanking: -4 },
        { id: 15, nombre: 'Pulpo a la Gallega', categoria: 'Platos Principales', costo: 12.00, precioVenta: 22.00, ventasMensuales: 10, margen: 45.5, tipo: 'bajo_ventas', posicionRanking: -5 },
        { id: 16, nombre: 'Café Especial Gourmet', categoria: 'Bebidas Calientes', costo: 2.50, precioVenta: 5.50, ventasMensuales: 8, margen: 54.5, tipo: 'bajo_ventas', posicionRanking: -6 },
        { id: 17, nombre: 'Helado Artesanal', categoria: 'Postres', costo: 2.80, precioVenta: 6.00, ventasMensuales: 14, margen: 53.3, tipo: 'bajo_ventas', posicionRanking: -7 },
        { id: 18, nombre: 'Tabla de Quesos', categoria: 'Entrantes y Tapas', costo: 6.50, precioVenta: 14.00, ventasMensuales: 9, margen: 53.6, tipo: 'bajo_ventas', posicionRanking: -8 },
        { id: 19, nombre: 'Smoothie Natural', categoria: 'Bebidas Frías', costo: 3.20, precioVenta: 6.50, ventasMensuales: 11, margen: 50.8, tipo: 'bajo_ventas', posicionRanking: -9 },
        { id: 20, nombre: 'Risotto Trufa', categoria: 'Platos Principales', costo: 9.00, precioVenta: 20.00, ventasMensuales: 7, margen: 55.0, tipo: 'bajo_ventas', posicionRanking: -10 }
    ],
    allProducts: [],  // Todos los productos importados del Excel
    aiRecommendation: null,
    marketingPlan: null,
};


export const useAppStore = create<AppStore>((set) => ({
    ...INITIAL_STATE,

    setField: (field, value) => set((state) => ({ ...state, [field]: value })),

    // Product actions (legacy)
    addProduct: () => set((state) => {
        const newId = state.products.length > 0 ? Math.max(...state.products.map(p => p.id)) + 1 : 1;
        return {
            products: [...state.products, { id: newId, name: '', cost: 0, price: 0, sales: 0 }]
        };
    }),

    updateProduct: (id, field, value) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, [field]: value } : p)
    })),

    removeProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
    })),

    // Price Range actions
    addPriceRange: () => set((state) => {
        const newId = state.priceRanges.length > 0 ? Math.max(...state.priceRanges.map(r => r.id)) + 1 : 1;
        return {
            priceRanges: [...state.priceRanges, {
                id: newId,
                nombre: '',
                costoPromedio: 0,
                precioVentaPromedio: 0,
                ventasMensuales: 0,
                margenPromedio: 0
            }]
        };
    }),

    updatePriceRange: (id, field, value) => set((state) => {
        const updatedRanges = state.priceRanges.map(r => {
            if (r.id === id) {
                const updated = { ...r, [field]: value };
                if (field === 'costoPromedio' || field === 'precioVentaPromedio') {
                    const costo = field === 'costoPromedio' ? value : r.costoPromedio;
                    const precio = field === 'precioVentaPromedio' ? value : r.precioVentaPromedio;
                    updated.margenPromedio = precio > 0 ? ((precio - costo) / precio) * 100 : 0;
                }
                return updated;
            }
            return r;
        });
        return { priceRanges: updatedRanges };
    }),

    removePriceRange: (id) => set((state) => ({
        priceRanges: state.priceRanges.filter(r => r.id !== id)
    })),

    // Key Product actions
    addKeyProduct: (tipo) => set((state) => {
        const newId = state.keyProducts.length > 0 ? Math.max(...state.keyProducts.map(p => p.id)) + 1 : 1;
        const existingOfType = state.keyProducts.filter(p => p.tipo === tipo).length;
        return {
            keyProducts: [...state.keyProducts, {
                id: newId,
                nombre: '',
                categoria: '',
                costo: 0,
                precioVenta: 0,
                ventasMensuales: 0,
                margen: 0,
                tipo,
                posicionRanking: tipo === 'bajo_ventas' ? -(existingOfType + 1) : (existingOfType + 1)
            }]
        };
    }),

    updateKeyProduct: (id, field, value) => set((state) => {
        const updatedProducts = state.keyProducts.map(p => {
            if (p.id === id) {
                const updated = { ...p, [field]: value };
                if (field === 'costo' || field === 'precioVenta') {
                    const costo = field === 'costo' ? value : p.costo;
                    const precio = field === 'precioVenta' ? value : p.precioVenta;
                    updated.margen = precio > 0 ? ((precio - costo) / precio) * 100 : 0;
                }
                return updated;
            }
            return p;
        });
        return { keyProducts: updatedProducts };
    }),

    removeKeyProduct: (id) => set((state) => ({
        keyProducts: state.keyProducts.filter(p => p.id !== id)
    })),

    // Schedule actions
    updateSchedule: (field, value) => set((state) => ({
        businessSchedule: { ...state.businessSchedule, [field]: value }
    })),

    // Strategy Config actions
    updateStrategyConfig: (field, value) => set((state) => ({
        strategyConfig: { ...state.strategyConfig, [field]: value }
    })),

    // AI Recommendation
    setAIRecommendation: (recommendation) => set({ aiRecommendation: recommendation }),

    // Marketing Plan
    setMarketingPlan: (plan) => set({ marketingPlan: plan }),

    // File upload
    setFileUploaded: (fileType, status) => set((state) => ({
        uploadedFiles: { ...state.uploadedFiles, [fileType]: status }
    })),

    // Reset
    resetState: () => set(INITIAL_STATE),
}));
