export type BusinessType = 'horeca' | 'retail';
export type ObjectiveType = 'captacion' | 'frecuencia' | 'ticket_medio' | 'resenas' | 'viralidad' | 'fidelizacion' | 'horas_valle' | 'lanzamiento';
export type ValidityType = 'semana' | 'finde' | 'todo';
export type GameId = 'spin' | 'scratch' | 'slot' | 'memory';
export type DataCollectionLevel = 'none' | 'basic' | 'complete';
export type ValidationMethod = 'screen' | 'qr_secure' | 'stamp';
export type AutomationFlowType = 'nurture' | 'review' | 'birthday';

export interface Product {
    id: number;
    name: string;
    cost: number;
    price: number;
    sales: number;
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

export interface KeyProduct {
    id: number;
    nombre: string;
    categoria: string;
    costo: number;
    precioVenta: number;
    ventasMensuales: number;
    margen: number;
    tipo: ProductType;
    posicionRanking: number;
}

// Horarios del negocio
export interface BusinessSchedule {
    diasFlojos: string[];
    horasFlojas: string;
    diasLlenos: string[];
    horasLlenas: string;
}

// Configuración de estrategia
export interface StrategyConfig {
    numJuegos: number;
    numCupones: number;
    numVales: number;
    tarjetaSellos: boolean;
    tarjetaPuntos: boolean;
    validezCuponesDias: number;
    gastoMinBienvenida: number;
    gastoMinTicketQR: number;
}

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
    analisisGeneral: string;
    juegos: GameRecommendation[];
    cupones: CouponRecommendation[];
    vales: VoucherRecommendation[];
    tarjetaSellos: LoyaltyCardRecommendation | null;
    tarjetaPuntos: LoyaltyCardRecommendation | null;
    productosGancho: string[];
    productosImpulsar: string[];
    roiEstimado: number;
    resumenEstrategia: string;
}

export interface AppStateData {
    // Perfil Negocio
    businessType: BusinessType;
    ticketPromedio: number;
    comensalesMesa: number;
    margenPromedio: number;
    traficoMensual: number;
    inversionInvertir: number;
    products: Product[];

    // Presupuesto Marketing
    facturacionMensual: number;
    presupuestoMarketingPorcentaje: number;

    // Estrategia
    objetivoPrincipal: ObjectiveType;
    diasValidez: ValidityType;

    // Configuración Avanzada
    dataCollection: DataCollectionLevel;
    validationMethod: ValidationMethod;

    // Data Upload State
    uploadedFiles: Record<string, boolean>;

    // AI-First Strategy
    priceRanges: PriceRange[];
    keyProducts: KeyProduct[];
    allProducts: KeyProduct[];  // TODOS los productos importados del Excel

    // Horarios del negocio
    businessSchedule: BusinessSchedule;

    // Configuración de estrategia
    strategyConfig: StrategyConfig;

    // Resultados IA
    aiRecommendation: AIStrategyRecommendation | null;
    marketingPlan: MarketingPlan | null;
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
