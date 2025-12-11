import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type {
    AppStateData,
    Product,
    KeyProduct,
    AIStrategyRecommendation,
    StrategyConfig,
    MarketingPlan,
    OperationalCapacity,
    MarketingProfile,
    DatasetEntry,
    RealResults,
    ProductType,
    BusinessConstraints
} from '../types/index';

interface AppStore extends AppStateData {
    // Actions
    setField: (field: keyof AppStateData, value: any) => void;

    // Product actions
    addProduct: (product: Product) => void;
    updateProduct: (id: number, field: keyof Product, value: any) => void;
    removeProduct: (id: number) => void;

    // Config Actions (Wizard)
    updateCapacity: (data: Partial<OperationalCapacity>) => void;
    updateMarketing: (data: Partial<MarketingProfile>) => void;
    updateStrategyConfig: (fieldOrData: keyof StrategyConfig | Partial<StrategyConfig>, value?: any) => void;
    updateConstraints: (data: Partial<BusinessConstraints>) => void;

    // Dataset & Results
    addDatasetEntry: (entry: DatasetEntry) => Promise<void>;
    fetchDatasetEntries: () => Promise<void>;
    setRealResults: (results: RealResults) => void;

    // Persistence Actions (Supabase)
    saveBusinessProfile: () => Promise<void>;
    loadBusinessProfile: (id: string) => Promise<boolean>; // Return boolean for success
    deleteBusinessProfile: (id: string) => Promise<boolean>;
    saveStrategy: () => Promise<void>;
    generateAIStrategy: () => Promise<any>;

    // Legacy / Helpers
    resetState: () => void;
    setAIRecommendation: (recommendation: AIStrategyRecommendation) => void;
    setMarketingPlan: (plan: MarketingPlan) => void;

    // Simulator Actions (Restored)
    updateSchedule: (field: string, value: any) => void;
    addKeyProduct: (tipo: ProductType) => void;
    updateKeyProduct: (id: number, field: string, value: any) => void;
    removeKeyProduct: (id: number) => void;
    addPriceRange: () => void;
    updatePriceRange: (id: number, field: string, value: any) => void;
    removePriceRange: (id: number) => void;

    // File Upload State
    uploadedFiles: Record<string, boolean>;
    setFileUploaded: (fileType: string, uploaded: boolean) => void;
}

const INITIAL_STATE: AppStateData = {
    // 1. Perfil Negocio
    nombreNegocio: '',
    ciudad: '',
    businessType: 'horeca',

    // 2. Objetivos
    objetivos: [],
    objetivoPrincipal: 'captacion_nuevos', // Default to avoid undefined
    objetivosComentario: '',

    // 3. Datos Económicos
    facturacionMensual: 0,
    ticketPromedio: 0,
    ticketsMensuales: 0,
    ticketsDiarios: [],
    promotionsData: [],

    // 4. Capacidad Operativa
    capacidad: {
        numMesas: 0,
        personalCocina: 0,
        personalSala: 0,
        hornoLimitado: false,
        freidorasLimitadas: false,
        tiempoMedioPlato: 0,
        // Servicios
        numProfesionales: 0,
        serviciosSimultaneos: 0,
        maquinasCriticas: 0,
        porcentajeOcupacion: 0,
        // Schedule
        horarios: {
            diasPico: [],
            horasPico: [],
            diasValle: [],
            horasValle: [],
            diasCerrado: []
        }
    },

    // 5. Productos
    products: [],

    // 6. Marketing
    marketing: {
        instagram: false,
        facebook: false,
        tiktok: false,
        google: false,
        email: false,
        whatsapp: false,
        adsActivas: false,
        presupuestoDiario: 0,
        razonamiento: '',
        clasificacion: 'neutro', // Default
        aptoParaTuning: false,
        anadido: false
    },

    // 7. Configuración Juegos
    strategyConfig: {
        juegosActivos: [],
        // Removed fields not in StrategyConfig
        numJuegos: 2,
        numCupones: 0,
        numVales: 0,
        tarjetaSellos: false,
        tarjetaPuntos: false,
        validezCuponesDias: 30,
        gastoMinBienvenida: 0,
        gastoMinTicketQR: 0
    },

    // 8. Constraints
    // 8. Constraints
    constraints: {
        maxDiscount: 15,
        minMargin: 50,
        forbiddenDays: [],
        blacklistedProducts: [],
        adBudgetDaily: 0
    },

    // Legacy / Internal use / Missing Fields
    traficoMensual: 0,
    presupuestoMarketingPorcentaje: 0,
    diasValidez: 'todo',
    dataCollection: 'basic',
    validationMethod: 'screen',
    uploadedFiles: {},
    priceRanges: [],
    keyProducts: [],
    allProducts: [],
    marketingPlan: undefined, // Optional
    businessSchedule: {
        diasPico: [],
        horasPico: [],
        diasValle: [],
        horasValle: [],
        diasCerrado: []
    },
    aiRecommendation: null, // Optional
    comensalesMesa: 0,
    margenPromedio: 0,

    // Dataset
    datasetEntries: [],
    currentRealResults: null,
    // currentRecommendation removed as it was incorrect name
};


export const useAppStore = create<AppStore>((set, get) => ({
    ...INITIAL_STATE,

    setField: (field, value) => set((state) => ({ ...state, [field]: value })),

    addProduct: (product) => set((state) => ({
        products: [...state.products, product]
    })),

    updateProduct: (id, field, value) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, [field]: value } : p)
    })),

    removeProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
    })),

    updateCapacity: (data) => set((state) => ({
        capacidad: { ...state.capacidad, ...data }
    })),

    updateMarketing: (data) => set((state) => ({
        marketing: { ...state.marketing, ...data }
    })),

    updateStrategyConfig: (fieldOrData, value) => set((state) => {
        const newData = typeof fieldOrData === 'string' ? { [fieldOrData]: value } : fieldOrData;
        return { strategyConfig: { ...state.strategyConfig, ...newData } };
    }),

    updateConstraints: (data) => set((state) => ({
        constraints: { ...state.constraints, ...data }
    })),

    // --- Persistencia Supabase ---

    saveBusinessProfile: async () => {
        const state = get();
        const profileData = {
            name: state.nombreNegocio,
            type: state.businessType,
            city: state.ciudad,
            objectives: state.objetivos,
            financial_data: {
                monthlyRevenue: state.facturacionMensual,
                avgTicket: state.ticketPromedio,
                monthlyTickets: state.ticketsMensuales
            },
            capacity_data: state.capacidad,
            marketing_profile: state.marketing,
            products_data: state.products
        };

        const { error } = await supabase
            .from('businesses')
            .upsert(profileData, { onConflict: 'name' }); // Simple logic: name is key for now

        if (error) {
            console.error('Error saving business profile:', error);
            alert('Error al guardar perfil: ' + error.message);
        } else {
            console.log('Business profile saved!');
        }
    },

    loadBusinessProfile: async (id: string) => {
        try {
            // 1. Load Business Data
            const { data: business, error: busError } = await supabase
                .from('businesses')
                .select('*')
                .eq('id', id)
                .single();

            if (busError) throw busError;

            // 2. Load latest Strategy
            const { data: strategy } = await supabase
                .from('strategies')
                .select('*')
                .eq('business_id', id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            // Ignore strategy error if just not found (new business)

            // 3. Update State
            set({
                nombreNegocio: business.name,
                businessType: business.type,
                ciudad: business.city,
                objetivos: business.objectives || [],
                facturacionMensual: business.financial_data?.monthlyRevenue || 0,
                ticketPromedio: business.financial_data?.avgTicket || 0,
                ticketsMensuales: business.financial_data?.monthlyTickets || 0,
                capacidad: business.capacity_data || INITIAL_STATE.capacidad,
                marketing: business.marketing_profile || INITIAL_STATE.marketing,
                products: business.products_data || [],
                // Load strategy if exists
                aiRecommendation: strategy?.strategy_data || null,
                strategyConfig: strategy?.input_config || INITIAL_STATE.strategyConfig
            });

            console.log('Business loaded:', business.name);
            return true;

            console.log('Business loaded:', business.name);
            return true;

        } catch (error: any) {
            console.error('Error loading business:', error);
            alert('Error al cargar negocio: ' + error.message);
            return false;
        }
    },

    deleteBusinessProfile: async (id: string) => {
        try {
            const { error } = await supabase
                .from('businesses')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error: any) {
            console.error('Error deleting business:', error);
            alert('Error al eliminar negocio: ' + error.message);
            return false;
        }
    },

    generateAIStrategy: async () => {
        const state = get();
        console.log("Generating Strategy with constraints:", state.constraints);

        const payload = {
            businessProfile: {
                nombre: state.nombreNegocio,
                tipo: state.businessType,
                ciudad: state.ciudad,
                objetivos: state.objetivos,
                facturacion: state.facturacionMensual,
                ticket: state.ticketPromedio,
                productos: state.products,
                capacidad: state.capacidad,
                marketing: state.marketing,
                config: state.strategyConfig,
                constraints: state.constraints // NEW: Passing constraints
            }
        };

        const { data, error } = await supabase.functions.invoke('generate-strategy', {
            body: payload
        });

        if (error) {
            console.error("AI Generation Error:", error);
            throw error;
        }

        if (!data) {
            throw new Error("No data received from AI");
        }

        set({ aiRecommendation: data });
        return data; // Return data for UI handling if needed
    },

    saveStrategy: async () => {
        const state = get();
        if (!state.aiRecommendation) return;

        // Try to find business ID first (mock logic mostly for now or by name)
        const { data: business } = await supabase
            .from('businesses')
            .select('id')
            .eq('name', state.nombreNegocio)
            .single();

        const strategyData = {
            business_name: state.nombreNegocio,
            business_type: state.businessType,
            strategy_data: state.aiRecommendation,
            input_config: state.strategyConfig,
            business_id: business?.id,
            version: '3.0'
        };

        const { error } = await supabase
            .from('strategies')
            .insert(strategyData);

        if (error) {
            console.error('Error saving strategy:', error);
        } else {
            console.log('Strategy saved!');
        }
    },

    addDatasetEntry: async (entry) => {
        const { error } = await supabase
            .from('dataset_entries')
            .insert({
                date: entry.date,
                business_snapshot: entry.businessProfile,
                strategy_snapshot: entry.generatedStrategy,
                real_results: entry.realOutcome,
                classification: entry.classification
            });

        if (error) {
            console.error('Error adding dataset entry:', error);
            alert('Error al guardar en dataset: ' + error.message);
        } else {
            // Update local state too
            set((state) => ({
                datasetEntries: [...state.datasetEntries, entry]
            }));
        }
    },

    fetchDatasetEntries: async () => {
        const { data, error } = await supabase
            .from('dataset_entries')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching dataset:', error);
        } else if (data) {
            // Map DB structure to frontend type if needed
            const mappedEntries: DatasetEntry[] = (data as any[]).map(d => ({
                id: d.id,
                date: d.date,
                businessProfile: d.business_snapshot,
                generatedStrategy: d.strategy_snapshot,
                realOutcome: d.real_results,
                classification: d.classification
            }));
            set({ datasetEntries: mappedEntries });
        }
    },

    setRealResults: (results) => set({ currentRealResults: results }),

    setAIRecommendation: (recommendation) => set({ aiRecommendation: recommendation }),
    setMarketingPlan: (plan) => set({ marketingPlan: plan }),

    // Simulator Actions Implementation
    updateSchedule: (field, value) => set((state) => ({
        businessSchedule: { ...state.businessSchedule, [field]: value }
    })),

    addKeyProduct: (tipo) => set((state) => {
        const newId = state.keyProducts.length > 0 ? Math.max(...state.keyProducts.map(p => p.id)) + 1 : 1;
        const newProduct: KeyProduct = {
            id: newId,
            name: '',
            category: '',
            cost: 0,
            price: 0,
            margin: 0,
            salesMonthly: 0,
            tipo,
            posicionRanking: 0,
            precioVenta: 0,
            ventasMensuales: 0,
            margen: 0,
            costo: 0
        };
        return { keyProducts: [...state.keyProducts, newProduct] };
    }),

    updateKeyProduct: (id, field, value) => set((state) => ({
        keyProducts: state.keyProducts.map(p => p.id === id ? { ...p, [field]: value } : p)
    })),

    removeKeyProduct: (id) => set((state) => ({
        keyProducts: state.keyProducts.filter(p => p.id !== id)
    })),

    addPriceRange: () => set((state) => {
        const newId = state.priceRanges.length > 0 ? Math.max(...state.priceRanges.map(r => r.id)) + 1 : 1;
        return { priceRanges: [...state.priceRanges, { id: newId, nombre: '', costoPromedio: 0, precioVentaPromedio: 0, ventasMensuales: 0, margenPromedio: 0 }] };
    }),

    updatePriceRange: (id, field, value) => set((state) => ({
        priceRanges: state.priceRanges.map(r => r.id === id ? { ...r, [field]: value } : r)
    })),

    removePriceRange: (id) => set((state) => ({
        priceRanges: state.priceRanges.filter(r => r.id !== id)
    })),

    resetState: () => set(INITIAL_STATE),

    setFileUploaded: (fileType, uploaded) => set((state) => ({
        uploadedFiles: { ...state.uploadedFiles, [fileType]: uploaded }
    })),
}));
