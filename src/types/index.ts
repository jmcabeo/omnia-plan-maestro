export type BusinessType = 'horeca' | 'retail' | 'servicios' | 'estetica' | 'salud';
export type ObjectiveType = 'subir_ticket' | 'aumentar_recurrencia' | 'llenar_horas_valle' | 'captacion_nuevos' | 'rotar_productos' | 'bajar_dependencia' | 'fidelizacion_vip' | 'conseguir_resenas' | 'viralidad_rrss' | 'lanzamiento_productos';
export type ValidityType = 'semana' | 'finde' | 'todo';
export type GameId = 'ruleta' | 'rasca' | 'puzzle' | 'memorama' | 'cazar_objetos';
export type DataCollectionLevel = 'none' | 'basic' | 'complete';
export type ValidationMethod = 'screen' | 'qr_secure' | 'stamp';
export type AutomationFlowType = 'nurture' | 'review' | 'birthday';

export interface Product {
    id: number;
    name: string;
    category: string;
    cost: number;
    price: number;
    margin: number;
    salesMonthly: number;
    externalId?: string; // ID from CSV import
    prepTimeMinutes?: number;
    isCriticalMachine?: boolean;
    canBePrize?: boolean;
    priority?: 'alta' | 'media' | 'baja';
}

// Types for AI Strategy System
export type ProductType = 'top_ventas' | 'top_margen' | 'bajo_ventas';
export type PrizeType = 'descuento' | '2x1' | 'regalo' | 'cashback' | 'puntos';
export type GameType = 'bienvenida' | 'ticket_qr';
export type LoyaltyType = 'sellos' | 'puntos';

export interface PriceRange {
    id: number;
    nombre: string;
    costoPromedio: number;
    precioVentaPromedio: number;
    ventasMensuales: number;
    margenPromedio: number;
}

export interface KeyProduct extends Product {
    tipo: ProductType;
    posicionRanking: number;
    // Spanish aliases for Simulator
    precioVenta?: number;
    ventasMensuales?: number;
    margen?: number;
    costo?: number;
    nombre?: string;
    categoria?: string;
}

// Horarios y Capacidad
export interface BusinessSchedule {
    diasPico: string[]; // ['Viernes', 'Sábado']
    horasPico: string[]; // ['14:00-16:00', '21:00-23:00']
    diasValle: string[];
    horasValle: string[];
    diasCerrado: string[];
    // Aliases
    diasLlenos?: string[];
    horasLlenas?: string;
    diasFlojos?: string[];
    horasFlojas?: string;
}

export interface BusinessConstraints {
    maxDiscount: number; // e.g., 15 (percent)
    minMargin: number; // e.g., 50 (percent)
    forbiddenDays: string[]; // Days where no promos should run
    blacklistedProducts: number[]; // IDs of products to never discount
    adBudgetDaily: number;
}

// Operational Capacity
export interface OperationalCapacity {
    // Restaurante
    numMesas?: number;
    personalCocina?: number;
    personalSala?: number;
    hornoLimitado?: boolean;
    freidorasLimitadas?: boolean;
    tiempoMedioPlato?: number;

    // Citas/Servicios
    numProfesionales?: number;
    serviciosSimultaneos?: number;
    maquinasCriticas?: number;
    porcentajeOcupacion?: number; // Estimated %

    // Schedule
    horarios: BusinessSchedule;
}

// New: Marketing Profile
export interface MarketingProfile {
    // Redes
    instagram: boolean;
    facebook: boolean;
    tiktok: boolean;
    google: boolean;
    email: boolean;
    whatsapp: boolean;

    // Ads
    adsActivas?: boolean;
    presupuestoDiario?: number;
    razonamiento: string;
    clasificacion: 'exito' | 'fracaso' | 'neutro';
    aptoParaTuning: boolean;
    anadido: boolean;
}

// --- AI OUTPUT TYPES (Existing + Updated) ---

// Premio individual (7 por juego)
export interface AIPrize {
    id: number;
    nombre: string;
    tipo: PrizeType;
    productoObjetivo: string;
    costo: number;
    minGasto: number;
    probabilidad: number;
    razonamiento: string;
}

// Juego completo
export interface GameRecommendation {
    id: number;
    tipo: GameType;
    nombre: string;
    mecanica: string;
    ubicacion: string;
    siempreGana: boolean;
    gastoMinimo: number;
    canjeProximaVisita: boolean;
    premios: AIPrize[];
    razonamiento: string;
}

// Cupón
export interface CouponRecommendation {
    id: number;
    nombre: string;
    descripcion: string;
    tipo: PrizeType;
    valor: string;
    horariosValidos: string;
    validezDias: number;
    gastoMinimo: number;
    razonamiento: string;
}

// Vale (Cheque Regalo - sin gasto mínimo)
export interface VoucherRecommendation {
    id: number;
    nombre: string;
    valorEuros: number;
    validezDias: number;
    razonamiento: string;
}


// Tarjeta de fidelidad
export interface LoyaltyCardRecommendation {
    tipo: LoyaltyType;
    nombre: string;
    productoAsociado: string | null;
    numSellosParaPremio: number;
    puntosPorEuro: number;
    puntosParaPremio: number;
    premioFinal: string;
    visibilidad: string;
    entrega: string;
    razonamiento: string;
}

// Plan de Marketing
export interface MarketingPlan {
    organico: {
        posts: { idea: string; copy: string; creativoSugerido: string; mejorDia?: string }[];
        stories: { idea: string; copy: string; stickers?: string }[];
        reels: { idea: string; guion: string; duracion?: string; audio?: string }[];
    };
    pago: {
        campanas: {
            objetivo: string;
            segmentacion: string;
            copy: string;
            creativoSugerido: string;
            presupuestoSugerido: string;
        }[];
    };
    acciones: string[];
    calendarioSemanal?: string;
}


// Recomendación completa de IA
export interface AIStrategyRecommendation {
    analisisGeneral: string; // Tab 1: Diagnóstico
    puntosFuertes: string[];
    puntosDebiles: string[];
    riesgos: string[];
    oportunidades: string[];

    juegos: GameRecommendation[]; // Tab 2

    estrategiaEconomica: { // Tab 3
        subidaTicket: string;
        proteccionMargen: string;
        evitarSaturacion: string;
        impactoFinanciero: string;
    };

    horasValle: { // Tab 4
        misiones: string[];
        promociones: string[];
        antiPico: string[];
    };

    captacion: MarketingPlan; // Tab 5

    fidelizacion: { // Tab 6
        niveles: string[];
        misiones: string[];
        recompensasVIP: string[];
    };

    automatizaciones: string[]; // Tab 7

    cupones?: CouponRecommendation[]; // Legacy support or specifics
    vales?: VoucherRecommendation[];
    tarjetaSellos?: LoyaltyCardRecommendation | null;
    tarjetaPuntos?: LoyaltyCardRecommendation | null;
    resumenEstrategia?: string;
    // Legacy / Simulator fields
    roiEstimado?: number;
    productosGancho?: string[];
    productosImpulsar?: string[];
}

// Configuración de Estrategia (Inputs para IA)
export interface StrategyConfig {
    juegosActivos: string[];
    numJuegos: number;
    numCupones: number;
    numVales: number;
    tarjetaSellos: boolean;
    tarjetaPuntos: boolean;
    validezCuponesDias: number;
    gastoMinBienvenida: number;
    gastoMinTicketQR: number;
    // Legacy support fields
    objetivoPrincipal?: ObjectiveType;
    presupuestoMarketing?: number;
}

// Resultados Reales (New Section)
export interface RealResults {
    fechaRegistro: string;
    ticketMedioAntes: number;
    ticketMedioDespues: number;
    clientesTotales: number;
    clientesRecurrentes: number;
    nuevosClientes: number;
    ventasTotales: number;
    costoMarketing: number;
    ROI: number;
    satisfaccionCliente?: number; // 0-10
}

// Dataset Entry (For Training)
export interface DatasetEntry {
    id: string;
    date: string;

    // INPUTS
    businessProfile: {
        type: BusinessType;
        avgTicket: number;
        monthlyRevenue: number;
        location: string;
    };

    // OUTPUT
    generatedStrategy: {
        summary: string;
        keyActions: string[];
    };

    // RESULT (Label)
    realOutcome?: RealResults;
    classification?: 'exito' | 'fracaso' | 'neutro';
}

export interface AppStateData {
    // 1. Perfil Negocio
    nombreNegocio: string;
    ciudad: string;
    businessType: BusinessType;

    // 2. Objetivos
    objetivos: ObjectiveType[];
    objetivoPrincipal?: ObjectiveType; // Restored for compatibility
    objetivosComentario: string;

    // 3. Datos Económicos
    facturacionMensual: number;
    ticketPromedio: number;
    ticketsMensuales: number;
    // New: Real Data Parsing
    ticketsDiarios?: { id: string, fecha: string, total: number, items: number }[];
    promotionsData?: { idPromo: string, nombre: string, canjes: number, descuentoTotal: number }[];

    // 4. Capacidad Operativa
    capacidad: OperationalCapacity;

    // 5. Productos / Servicios
    products: Product[]; // Detailed products

    // 6. Marketing Actual
    marketing: MarketingProfile;

    // 7. Configuración Juegos
    strategyConfig: StrategyConfig;

    // 8. Restrictions
    constraints: BusinessConstraints;

    // --- Legacy / Internal use ---
    traficoMensual: number; // Derived or same as ticketsMensuales
    presupuestoMarketingPorcentaje: number;
    diasValidez: ValidityType;
    dataCollection: DataCollectionLevel;
    validationMethod: ValidationMethod;
    uploadedFiles: Record<string, boolean>;
    priceRanges: PriceRange[];
    keyProducts: KeyProduct[];
    allProducts: any[]; // New field for raw excel products
    marketingPlan?: MarketingPlan; // Restored
    businessSchedule: BusinessSchedule; // Restored (singular definition)
    aiRecommendation?: AIStrategyRecommendation | null; // Restored
    comensalesMesa: number; // Restored
    margenPromedio: number; // Restored

    // Resultados IA - defined above

    // Dataset Management
    datasetEntries: DatasetEntry[];
    currentRealResults: RealResults | null;
}

export interface SimulationResults {
    ticketBaseReal: number;
    presupuestoMensualTope: number;
    costoRealEstimado: number;
    ventasGeneradas: number;
    margenBrutoGenerado: number;
    gananciaNetaCampaña: number;
    roiInmediato: string;
    redencionesEstimadas: number;
    recoveredVisits: number;
    effectiveRedemptionRate: string;
    ticketPromedioConEstrategia: number;
    liftTicket: string;
    effectiveTraffic: number;
    leadsQuality: string;
    limites: {
        high: number;
        mid: number;
        low: number;
    };
}
