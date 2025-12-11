
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Types for strict output generation (simplified for prompt)
const OUTPUT_SCHEMA = `
interface AIStrategyRecommendation {
    analisisGeneral: string;
    puntosFuertes: string[];
    puntosDebiles: string[];
    riesgos: string[];
    oportunidades: string[];
    juegos: {
        tipo: string;
        nombre: string;
        mecanica: string;
        ubicacion: string;
        siempreGana: boolean;
        gastoMinimo: number;
        canjeProximaVisita: boolean;
        premios: {
            nombre: string;
            tipo: string;
            productoObjetivo: string;
            costo: number;
            minGasto: number;
            probabilidad: number;
            razonamiento: string;
        }[];
        razonamiento: string;
    }[];
    estrategiaEconomica: {
        subidaTicket: string;
        proteccionMargen: string;
        evitarSaturacion: string;
        impactoFinanciero: string;
    };
    horasValle: {
        misiones: string[];
        promociones: string[];
        antiPico: string[];
    };
    captacion: {
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
    };
    fidelizacion: {
        niveles: string[];
        misiones: string[];
        recompensasVIP: string[];
        cupones: { nombre: string; descripcion: string; tipo: string; valor: string; horariosValidos: string; validezDias: number; gastoMinimo: number; razonamiento: string; }[];
        vales: { nombre: string; valorEuros: number; validezDias: number; razonamiento: string; }[];
        tarjetaSellos: { nombre: string; productoAsociado: string; numSellosParaPremio: number; premioFinal: string; razonamiento: string; } | null;
    };
    automatizaciones: string[];
    resumenEstrategia: string;
}
`;

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        console.log("Request received. Method:", req.method);
        const { businessProfile } = await req.json();
        console.log("Business Profile received:", businessProfile?.nombre);

        // 1. Read Knowledge Base
        const knowledgeUrl = new URL('./knowledge.txt', import.meta.url);
        console.log("Reading knowledge base from:", knowledgeUrl.toString());
        const knowledgeBase = await Deno.readTextFile(knowledgeUrl);
        console.log("Knowledge base read. Length:", knowledgeBase.length);

        // 2. Initialize Gemini
        const apiKey = Deno.env.get('GEMINI_API_KEY');
        if (!apiKey) {
            console.error("GEMINI_API_KEY is missing in environment variables");
            throw new Error('GEMINI_API_KEY not set');
        }
        console.log("GEMINI_API_KEY found (length: " + apiKey.length + ")");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        // 3. Construct Prompt
        console.log("Constructing prompt...");
        const prompt = `
    ROLE: You are the Chief Strategy Officer of Omnia, an advanced marketing system for local businesses.
    
    KNOWLEDGE BASE (This is your training, strictly follow these principles):
    """
    ${knowledgeBase.slice(0, 500000)} 
    """
    (End of Knowledge Base)

    TASK: Analyze the following Business Profile and generate a comprehensive Omnia 3.0 Strategy.
    
    BUSINESS PROFILE:
    ${JSON.stringify(businessProfile, null, 2)}

    REQUIREMENTS:
    1. STRICTLY follow the JSON structure defined below. Return ONLY JSON. No markdown formatting.
    2. Apply the principles from the Knowledge Base (Upselling, Psychology, Games, etc.).
    3. Be specific to the business type and products provided.
    4. Calculate logical financial impact based on the data.
    5. STRICTLY ADHERE to the 'constraints' provided in the Business Profile. Do NOT suggest discounts higher than 'maxDiscount', and avoid 'forbiddenDays' for aggressive promos.

    OUTPUT SCHEMA:
    ${OUTPUT_SCHEMA}
    `;

        // 4. Generate
        console.log("Calling Gemini API...");
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.7,
            }
        });
        console.log("Gemini response received.");

        const responseText = result.response.text();
        console.log("Response text length:", responseText.length);

        const strategyData = JSON.parse(responseText);

        return new Response(JSON.stringify(strategyData), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error generating strategy:', error);
        console.error('Stack:', error.stack);
        return new Response(JSON.stringify({
            error: error.message,
            stack: error.stack,
            details: "Check Supabase Edge Function Logs for more info"
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
