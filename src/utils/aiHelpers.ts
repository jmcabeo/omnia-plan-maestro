
import type { AppStateData } from '../types/index';

// Tipos para la respuesta de la IA
export interface AIStrategyResult {
    analisisGeneral: string;
    juegos: any[];
    cupones: any[];
    vales: any[];
    tarjetaSellos: any | null;
    tarjetaPuntos: any | null;
    productosGancho: string[];
    productosImpulsar: string[];
    roiEstimado: number;
    resumenEstrategia: string;
}

export interface AIMarketingResult {
    organico: {
        posts: any[];
        stories: any[];
        reels: any[];
    };
    pago: {
        campanas: any[];
    };
    acciones: string[];
    calendarioSemanal: string;
}

// Función auxiliar para generar estrategia Mock
export const generateMockStrategyData = (store: AppStateData): AIStrategyResult => {
    const config = store.strategyConfig;
    const obj = store.objetivoPrincipal;
    const presupuestoMarketing = (store.facturacionMensual * store.presupuestoMarketingPorcentaje) / 100;

    let estrategiaResumen = '';
    let premiosRuleta = [];

    // Personalización según objetivo
    if (obj === 'viralidad') {
        estrategiaResumen = 'Estrategia enfocada en MAXIMIZAR COMPARTIDOS EN REDES. La ruleta incluye premios muy visuales y "instagrameables".';
        premiosRuleta = [
            { id: 1, nombre: 'Cóctel Instagrameable', tipo: 'regalo', productoObjetivo: 'Bebidas Premium', costo: 2.50, minGasto: 10, probabilidad: 20, razonamiento: 'Muy visual para stories' },
            { id: 2, nombre: 'Postre "Explosión"', tipo: 'regalo', productoObjetivo: 'Postres', costo: 3.00, minGasto: 15, probabilidad: 15, razonamiento: 'Genera efecto WOW' },
            { id: 3, nombre: '2x1 en Copas', tipo: '2x1', productoObjetivo: 'Bebidas', costo: 2.00, minGasto: 12, probabilidad: 25, razonamiento: 'Para venir con amigos' },
            { id: 4, nombre: 'Experiencia VIP', tipo: 'regalo', productoObjetivo: 'Mesa VIP', costo: 5.00, minGasto: 30, probabilidad: 5, razonamiento: 'Premio aspiracional' },
            { id: 5, nombre: 'Foto Polaroid Gratis', tipo: 'regalo', productoObjetivo: 'Recuerdo', costo: 0.50, minGasto: 0, probabilidad: 20, razonamiento: 'Recuerdo físico y digital' },
            { id: 6, nombre: '10% si subes Story', tipo: 'descuento', productoObjetivo: 'Total', costo: 1.50, minGasto: 10, probabilidad: 10, razonamiento: 'Incentivo directo a compartir' },
            { id: 7, nombre: 'Cena para 2', tipo: 'regalo', productoObjetivo: 'Menú Degustación', costo: 20.00, minGasto: 50, probabilidad: 5, razonamiento: 'Gran premio viral' }
        ];
    } else if (obj === 'resenas') {
        estrategiaResumen = 'Estrategia enfocada en REPUTACIÓN ONLINE. Premios diseñados para incentivar la satisfacción y el feedback positivo.';
        premiosRuleta = [
            { id: 1, nombre: 'Café Gratis', tipo: 'regalo', productoObjetivo: 'Café', costo: 0.50, minGasto: 5, probabilidad: 30, razonamiento: 'Detalle rápido de agradecimiento' },
            { id: 2, nombre: 'Postre por Review', tipo: 'regalo', productoObjetivo: 'Postres', costo: 2.00, minGasto: 15, probabilidad: 20, razonamiento: 'Incentivo directo (cumpliendo políticas)' },
            { id: 3, nombre: '5€ Descuento', tipo: 'descuento', productoObjetivo: 'Próxima Visita', costo: 5.00, minGasto: 20, probabilidad: 15, razonamiento: 'Compensa el esfuerzo' },
            { id: 4, nombre: 'Invitación Evento', tipo: 'regalo', productoObjetivo: 'Cata', costo: 3.00, minGasto: 25, probabilidad: 10, razonamiento: 'Crea comunidad' },
            { id: 5, nombre: 'Chupito Premium', tipo: 'regalo', productoObjetivo: 'Licores', costo: 1.00, minGasto: 10, probabilidad: 15, razonamiento: 'Cierre de comida memorable' },
            { id: 6, nombre: '15% Descuento', tipo: 'descuento', productoObjetivo: 'Total', costo: 2.50, minGasto: 30, probabilidad: 8, razonamiento: 'Gran incentivo' },
            { id: 7, nombre: 'Menú Degustación', tipo: 'regalo', productoObjetivo: 'Menú', costo: 15.00, minGasto: 40, probabilidad: 2, razonamiento: 'Premio estrella' }
        ];
    } else if (obj === 'ticket_medio') {
        estrategiaResumen = 'Estrategia de UPSELLING agresivo. Premios con gastos mínimos escalonados para subir el ticket promedio.';
        premiosRuleta = [
            { id: 1, nombre: '2x1 Entrantes', tipo: '2x1', productoObjetivo: 'Entrantes', costo: 2.00, minGasto: 15, probabilidad: 25, razonamiento: 'Fuerza a pedir entrante' },
            { id: 2, nombre: 'Postre al 50%', tipo: 'descuento', productoObjetivo: 'Postres', costo: 1.50, minGasto: 20, probabilidad: 20, razonamiento: 'Añade plato al final' },
            { id: 3, nombre: 'Bebida Grande', tipo: 'regalo', productoObjetivo: 'Upgrade Bebida', costo: 0.50, minGasto: 10, probabilidad: 20, razonamiento: 'Upgrade sencillo' },
            { id: 4, nombre: '10€ Dto en €50', tipo: 'descuento', productoObjetivo: 'Total', costo: 10.00, minGasto: 50, probabilidad: 15, razonamiento: 'Empuja ticket alto' },
            { id: 5, nombre: 'Botella Vino Gratis', tipo: 'regalo', productoObjetivo: 'Vino', costo: 4.00, minGasto: 60, probabilidad: 10, razonamiento: 'Para grupos grandes' },
            { id: 6, nombre: 'Café + Copa', tipo: 'regalo', productoObjetivo: 'Sobremesa', costo: 2.00, minGasto: 30, probabilidad: 8, razonamiento: 'Alarga la estancia' },
            { id: 7, nombre: 'Todo Gratis', tipo: 'regalo', productoObjetivo: 'Cuenta', costo: 30.00, minGasto: 20, probabilidad: 2, razonamiento: 'Gancho poderoso' }
        ];
    } else {
        // Default (Captación/Frecuencia)
        estrategiaResumen = 'Estrategia equilibrada para CAPTACIÓN y FRECUENCIA. Premios variados para atraer y retener.';
        premiosRuleta = [
            { id: 1, nombre: '2x1 en Café', tipo: '2x1', productoObjetivo: 'Bebidas Calientes', costo: 0.80, minGasto: 5, probabilidad: 30, razonamiento: 'Producto gancho' },
            { id: 2, nombre: '10% Descuento', tipo: 'descuento', productoObjetivo: 'Total', costo: 1.50, minGasto: 10, probabilidad: 25, razonamiento: 'Incentivo general' },
            { id: 3, nombre: 'Postre Gratis', tipo: 'regalo', productoObjetivo: 'Postres', costo: 2.00, minGasto: 15, probabilidad: 15, razonamiento: 'Aumenta ticket' },
            { id: 4, nombre: 'Cerveza Gratis', tipo: 'regalo', productoObjetivo: 'Bebidas', costo: 1.20, minGasto: 20, probabilidad: 12, razonamiento: 'Premium' },
            { id: 5, nombre: 'Vale 5€', tipo: 'cashback', productoObjetivo: 'Próxima visita', costo: 5.00, minGasto: 25, probabilidad: 10, razonamiento: 'Fidelización' },
            { id: 6, nombre: 'Entrante Gratis', tipo: 'regalo', productoObjetivo: 'Tapas', costo: 2.50, minGasto: 30, probabilidad: 6, razonamiento: 'Impulsa tapas' },
            { id: 7, nombre: '15% Descuento', tipo: 'descuento', productoObjetivo: 'Total', costo: 2.25, minGasto: 15, probabilidad: 2, razonamiento: 'Premio especial' }
        ];
    }

    return {
        analisisGeneral: `Estrategia diseñada para objetivo: ${obj.toUpperCase()}. Ticket medio actual €${store.ticketPromedio}. Presupuesto €${presupuestoMarketing.toFixed(0)}.`,
        juegos: [
            {
                id: 1, tipo: 'bienvenida', nombre: 'Ruleta Estratégica', mecanica: 'Ruleta',
                ubicacion: 'Mesa/Directorio/RRSS', siempreGana: true, gastoMinimo: config.gastoMinBienvenida,
                canjeProximaVisita: true,
                premios: premiosRuleta,
                razonamiento: estrategiaResumen
            }
        ],
        cupones: [
            { id: 1, nombre: 'Happy Hour Café', descripcion: '2x1 en cafés', tipo: 'regalo', valor: '2x1', horariosValidos: 'L-M 15:00-19:00', validezDias: 30, gastoMinimo: 0, razonamiento: 'Llena horas muertas' }
        ],
        vales: [
            { id: 1, nombre: 'Cheque Regalo 5€', valorEuros: 5, validezDias: 30, razonamiento: 'Cheque regalo sin gasto mínimo' }
        ],
        tarjetaSellos: config.tarjetaSellos ? { tipo: 'sellos', nombre: 'Tarjeta Menú', productoAsociado: 'Menú del día', numSellosParaPremio: 10, puntosPorEuro: 0, puntosParaPremio: 0, premioFinal: '1 Menú gratis', visibilidad: 'Solo consumidores', entrega: 'Automática', razonamiento: 'Fideliza clientes de menú' } : null,
        tarjetaPuntos: config.tarjetaPuntos ? { tipo: 'puntos', nombre: 'Club Puntos', productoAsociado: null, numSellosParaPremio: 0, puntosPorEuro: 1, puntosParaPremio: 100, premioFinal: '5€ descuento', visibilidad: 'General', entrega: 'Camarero', razonamiento: 'Programa general de fidelización' } : null,
        productosGancho: ['Café Americano', 'Cerveza Artesanal', 'Refresco'],
        productosImpulsar: ['Ensalada Gourmet', 'Sopa del Día', 'Tarta Especial'],
        roiEstimado: 3.2,
        resumenEstrategia: estrategiaResumen
    };
};

// Función auxiliar para generar plan de marketing Mock
export const generateMockMarketingPlan = (store: AppStateData): AIMarketingResult => {
    const obj = store.objetivoPrincipal;
    let posts = [], stories = [], reels = [], campanas = [];

    if (obj === 'viralidad') {
        posts = [
            { idea: '📸 Concurso Foto Más Original', copy: '¡Sube tu foto más creativa con nuestro plato estrella y GANA una cena para 2! 🎁 Usa #OmniaExperience y etiquétanos. ¡El más original gana! 🏆', creativoSugerido: 'Collage de fotos de clientes divirtiéndose', mejorDia: 'Viernes 18:00' },
            { idea: '👯 Etiqueta a tu Partner in Crime', copy: '¿Con quién compartirías este postre? 🍰 Etiqueta a esa persona y si responde en 5 min... ¡te debe una cena! 😉', creativoSugerido: 'Video partiendo un postre con chocolate cayendo', mejorDia: 'Miércoles 20:00' }
        ];
        stories = [
            { idea: 'Plantilla "Tu Favorito"', copy: 'Haz captura y rodea tus favoritos 🍕🍔🥗', stickers: 'Plantilla interactiva' },
            { idea: 'Reto del Chef', copy: '¿Te atreves con nuestro reto picante? 🌶️', stickers: 'Encuesta: Sí/No' }
        ];
        reels = [
            { idea: 'POV: Cuando llega la comida', guion: 'Cara de felicidad extrema al ver llegar el camarero con los platos', duracion: '10 seg', audio: 'Audio viral "Heaven"' },
            { idea: 'Transition Challenge', guion: 'Chasquido de dedos: Mesa vacía -> Mesa llena de comida', duracion: '15 seg', audio: 'Trending transition sound' }
        ];
        campanas = [
            { objetivo: 'Alcance Viral', segmentacion: 'Amigos de seguidores, 18-35 años', copy: '🔥 Lo que todo el mundo está compartiendo. ¿Te lo vas a perder?', creativoSugerido: 'Video con cortes rápidos y música tendencia', presupuestoSugerido: '€20/día' }
        ];
    } else if (obj === 'resenas') {
        posts = [
            { idea: '⭐ Tu Opinión nos Importa', copy: 'Gracias a clientes como María por sus palabras ❤️ "El mejor servicio de la ciudad". ¿Y tú, qué opinas de nosotros? Déjanos tu review y recibe una sorpresa 🎁', creativoSugerido: 'Diseño elegante con la reseña destacada', mejorDia: 'Martes 10:00' },
            { idea: '🏆 Empleado del Mes', copy: '¡Felicidades a Juan! 👏👏 Mencionado en 15 reseñas este mes por su amabilidad. Ven a saludarle y comprueba por qué es el favorito.', creativoSugerido: 'Foto del empleado sonriendo', mejorDia: 'Jueves 12:00' }
        ];
        stories = [
            { idea: 'Review destacada', copy: '¡Nos alegráis el día! 😍', stickers: 'Link a Google Maps' },
            { idea: 'Pregunta abierta', copy: '¿Qué mejorarías de nuestro servicio?', stickers: 'Cajita de preguntas' }
        ];
        reels = [
            { idea: 'Leyendo reseñas bonitas', guion: 'Staff reaccionando y agradeciendo reseñas reales en video', duracion: '30 seg', audio: 'Música emotiva' },
            { idea: 'Cómo dejar reseña', guion: 'Tutorial rápido de cómo escanear QR y dejar 5 estrellas', duracion: '15 seg', audio: 'Voz en off explicativa' }
        ];
        campanas = [
            { objetivo: 'Reputación', segmentacion: 'Clientes recientes (retargeting)', copy: 'Tu opinión vale oro (y postre gratis). Cuéntanos tu experiencia.', creativoSugerido: 'Imagen de postre con 5 estrellas', presupuestoSugerido: '€10/día' }
        ];
    } else {
        // Default Captación
        posts = [
            { idea: '🎉 Lanzamiento Ruleta', copy: '¡Juega y GANA en tu próxima visita! 🎯 Escanea el QR de tu mesa y participa en nuestra ruleta de premios. 100% de probabilidades de ganar algo 🎁 #GamificacionHosteleria', creativoSugerido: 'Video de ruleta girando con premios', mejorDia: 'Lunes 12:00' },
            { idea: '☕ Happy Hour', copy: '¿Tarde aburrida? ¡No más! ☕ De L-M de 15h a 19h, 2x1 en cafés. El plan perfecto para esa reunión que llevas aplazando 💬', creativoSugerido: 'Foto de dos cafés con efecto gemelo', mejorDia: 'Miércoles 14:00' }
        ];
        stories = [
            { idea: 'Encuesta de preferencias', copy: '¿Qué prefieres? 🤔', stickers: 'Encuesta: Café solo vs Café con leche' },
            { idea: 'Cuenta atrás fin de semana', copy: '¡Quedan X horas para el finde! 🎉', stickers: 'Cuenta atrás + Música' }
        ];
        reels = [
            { idea: 'Behind the scenes', guion: '1. Mostrar cocina en acción 2. Ingredientes frescos 3. Plato final', duracion: '15-20 seg', audio: 'Trending de comida/cooking' },
            { idea: 'Cliente jugando ruleta', guion: 'POV: Vienes a comer y te toca jugar la ruleta 🎰', duracion: '15 seg', audio: 'Audio viral de premio/sorpresa' }
        ];
        campanas = [
            { objetivo: 'Captación', segmentacion: 'Radio 5km, 25-45 años, intereses en gastronomía', copy: '🎁 ¡Tu primera visita tiene premio SEGURO! Escanea, juega y gana.', creativoSugerido: 'Video corto de ruleta con efectos', presupuestoSugerido: '€10/día' }
        ];
    }

    return {
        organico: { posts, stories, reels },
        pago: { campanas },
        acciones: ['Colocar QR en todas las mesas', 'Formar al personal sobre la ruleta', 'Imprimir flyers para zona cercana'],
        calendarioSemanal: 'Lunes: Post motivacional | Miércoles: Promo Happy Hour | Viernes: Producto estrella | Domingo: Resumen semana'
    };
};
