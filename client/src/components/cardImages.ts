// Cartas amarillas
import A0 from "../assets/UNO/A0.png";
import A1 from "../assets/UNO/A1.png";
import A2 from "../assets/UNO/A2.png";
import A3 from "../assets/UNO/A3.png";
import A4 from "../assets/UNO/A4.png";
import A5 from "../assets/UNO/A5.png";
import A6 from "../assets/UNO/A6.png";
import A7 from "../assets/UNO/A7.png";
import A8 from "../assets/UNO/A8.png";
import A9 from "../assets/UNO/A9.png";
import AC from "../assets/UNO/AC.png";//Cancelar Amarillo
import AM from "../assets/UNO/AM.png";//+2 Amarillo
import AT from "../assets/UNO/AT.png";//Reversa amarillo

// Cartas Rojas
import R0 from "../assets/UNO/R0.png";
import R1 from "../assets/UNO/R1.png";
import R2 from "../assets/UNO/R2.png";
import R3 from "../assets/UNO/R3.png";
import R4 from "../assets/UNO/R4.png";
import R5 from "../assets/UNO/R5.png";
import R6 from "../assets/UNO/R6.png";
import R7 from "../assets/UNO/R7.png";
import R8 from "../assets/UNO/R8.png";
import R9 from "../assets/UNO/R9.png";
import RC from "../assets/UNO/RC.png";//Cancelar Rojo
import RM from "../assets/UNO/RM.png";//+2 Rojo
import RT from "../assets/UNO/RT.png";//Reversa Rojo

// Cartas Verdes
import V0 from "../assets/UNO/V0.png";
import V1 from "../assets/UNO/V1.png";
import V2 from "../assets/UNO/V2.png";
import V3 from "../assets/UNO/V3.png";
import V4 from "../assets/UNO/V4.png";
import V5 from "../assets/UNO/V5.png";
import V6 from "../assets/UNO/V6.png";
import V7 from "../assets/UNO/V7.png";
import V8 from "../assets/UNO/V8.png";
import V9 from "../assets/UNO/V9.png";
import VC from "../assets/UNO/VC.png";//Cancelar Verde
import VM from "../assets/UNO/VM.png";//+2 Verde
import VT from "../assets/UNO/VT.png";//Reversa Verde

// Cartas Purpuras (Azules)
import P0 from "../assets/UNO/P0.png";
import P1 from "../assets/UNO/P1.png";
import P2 from "../assets/UNO/P2.png";
import P3 from "../assets/UNO/P3.png";
import P4 from "../assets/UNO/P4.png";
import P5 from "../assets/UNO/P5.png";
import P6 from "../assets/UNO/P6.png";
import P7 from "../assets/UNO/P7.png";
import P8 from "../assets/UNO/P8.png";
import P9 from "../assets/UNO/P9.png";
import PC from "../assets/UNO/PC.png";//Cancelar Purpura
import PM from "../assets/UNO/PM.png";//+2 Purpura
import PT from "../assets/UNO/PT.png";//Reversa Purpura

import M4 from "../assets/UNO/M4.png";//+4 Comodín

import B from "../assets/UNO/COMODIN.png"//el de cambio de color

// Reverso de carta
import ATRAS from "../assets/UNO/ATRAS.png";

// Mapeo de colores del servidor a prefijos de imagen
const colorMapping = {
    'RED': 'R',
    'YELLOW': 'A',
    'GREEN': 'V',
    'BLUE': 'P',
    'WILD': 'B'
} as const;

// Mapeo de tipos de cartas especiales
const specialCardMapping = {
    'SKIP': 'C',      // Cancelar
    'REVERSE': 'T',   // Turn/Reversa  
    'DRAW_TWO': 'M',  // Más dos
    'DRAW': 'M',      // Más dos (versión corta que envía el servidor)
    'WILD': 'B',      // Comodín básico (cambio de color)
    'WILD_DRAW_FOUR': 'M4', // Comodín +4 
    'WILD_DRAW': 'M4' // Comodín +4 (versión corta)
} as const;

// Mapeo de números en palabras a dígitos
const numberMapping = {
    'ZERO': '0',
    'ONE': '1',
    'TWO': '2',
    'THREE': '3',
    'FOUR': '4',
    'FIVE': '5',
    'SIX': '6',
    'SEVEN': '7',
    'EIGHT': '8',
    'NINE': '9'
} as const;

// Mapeo completo de imágenes
export const cardImages = {
    // Cartas Amarillas
    A0, A1, A2, A3, A4, A5, A6, A7, A8, A9, AC, AM, AT,
    // Cartas Rojas
    R0, R1, R2, R3, R4, R5, R6, R7, R8, R9, RC, RM, RT,
    // Cartas Verdes
    V0, V1, V2, V3, V4, V5, V6, V7, V8, V9, VC, VM, VT,
    // Cartas Purpuras/Azules
    P0, P1, P2, P3, P4, P5, P6, P7, P8, P9, PC, PM, PT,
    // Especiales
    B,    // Comodín cambio de color
    M4,   // Comodín +4
    // Reverso
    ATRAS
};

// Función para normalizar los tipos de carta que vienen del servidor
const normalizeCardType = (type: string): string => {
    // Mapeo de variaciones comunes
    const typeVariations = {
        'DRAW': 'DRAW_TWO',
        'DRAW2': 'DRAW_TWO',
        'DRAW_2': 'DRAW_TWO',
        '+2': 'DRAW_TWO',
        'PLUS_TWO': 'DRAW_TWO',

        'WILD_DRAW': 'WILD_DRAW_FOUR',
        'WILD+4': 'WILD_DRAW_FOUR',
        'WILD_4': 'WILD_DRAW_FOUR',
        'PLUS_FOUR': 'WILD_DRAW_FOUR',

        'TURN': 'REVERSE',
        'REV': 'REVERSE',

        'CANCEL': 'SKIP',
        'BLOCK': 'SKIP'
    };

    return typeVariations[type as keyof typeof typeVariations] || type;
};
// Función principal para obtener la imagen de una carta
export const getCardImage = (color: string, value: string | number): string => {
    console.log('getCardImage llamada con:', { color, value });

    // Para el reverso de las cartas
    if (color === 'back') {
        return cardImages.ATRAS;
    }

    // Normalizar el tipo de carta PRIMERO
    const normalizedValue = typeof value === 'string' ? normalizeCardType(value) : value;
    console.log('Valor normalizado:', { original: value, normalized: normalizedValue });

    // Mapear color del servidor al prefijo
    const colorPrefix = colorMapping[color as keyof typeof colorMapping];
    if (!colorPrefix) {
        console.warn('Color no reconocido:', color);
        return cardImages.ATRAS;
    }

    // Si es carta comodín (WILD)
    if (color === 'WILD') {
        // Determinar si es comodín básico o +4
        if (typeof normalizedValue === 'string' &&
            (normalizedValue === 'WILD_DRAW_FOUR' || normalizedValue === 'WILD_DRAW')) {
            return cardImages.M4; // Comodín +4
        } else {
            return cardImages.B;  // Comodín básico (cambio de color)
        }
    }

    // Determinar el sufijo basado en el tipo de carta
    let suffix = '';

    // Si es un número directo (0-9)
    if (typeof normalizedValue === 'number' || !isNaN(Number(normalizedValue))) {
        suffix = normalizedValue.toString();
    }
    // Si es un número en palabras (ZERO, ONE, TWO, etc.)
    else if (typeof normalizedValue === 'string' && numberMapping[normalizedValue as keyof typeof numberMapping]) {
        suffix = numberMapping[normalizedValue as keyof typeof numberMapping];
    }
    // Si es una carta especial
    else if (typeof normalizedValue === 'string') {
        const specialSuffix = specialCardMapping[normalizedValue as keyof typeof specialCardMapping];
        if (specialSuffix) {
            suffix = specialSuffix;
        } else {
            console.warn('Tipo de carta no reconocido después de normalización:', { original: value, normalized: normalizedValue });
            return cardImages.ATRAS;
        }
    }

    // Construir la clave de la imagen
    const imageKey = `${colorPrefix}${suffix}` as keyof typeof cardImages;
    const image = cardImages[imageKey];

    console.log('Imagen construida:', { imageKey, found: !!image });

    return image || cardImages.ATRAS;
};

// Función para manejar cartas que vienen del servidor en formato "COLOR_TYPE"
export const getCardImageFromString = (cardString: string): string => {
    console.log('🃏 Procesando carta del servidor:', cardString);

    if (!cardString) {
        return cardImages.ATRAS;
    }

    const [color, type] = cardString.split('_');
    console.log('🃏 Parseado:', { color, type, original: cardString });

    const result = getCardImage(color, type);
    console.log('🃏 Resultado:', result === cardImages.ATRAS ? 'ATRAS (fallback)' : 'Imagen encontrada');

    return result;
};

// Función para crear una carta con imagen
export const createCardWithImage = (color: string, value: string | number) => {
    return {
        color,
        value,
        image: getCardImage(color, value)
    };
};

// Función helper para debug - mostrar todas las imágenes disponibles
export const debugAvailableImages = () => {
    console.log('Imágenes disponibles:', Object.keys(cardImages));

    // Ejemplos de mapeo
    console.log('Ejemplos:');
    console.log('RED + FIVE:', getCardImage('RED', 'FIVE'));
    console.log('YELLOW + SIX:', getCardImage('YELLOW', 'SIX'));
    console.log('BLUE + SKIP:', getCardImage('BLUE', 'SKIP'));
    console.log('GREEN + REVERSE:', getCardImage('GREEN', 'REVERSE'));
    console.log('RED + DRAW_TWO:', getCardImage('RED', 'DRAW_TWO'));
    console.log('WILD + WILD:', getCardImage('WILD', 'WILD'));
    console.log('WILD + WILD_DRAW_FOUR:', getCardImage('WILD', 'WILD_DRAW_FOUR'));

    // Probar mapeo de números
    console.log('Mapeo de números:');
    console.log('ZERO → 0:', numberMapping.ZERO);
    console.log('SIX → 6:', numberMapping.SIX);
    console.log('NINE → 9:', numberMapping.NINE);

    // Probar cartas especiales
    console.log('Cartas especiales:');
    console.log('Comodín básico (B):', cardImages.B);
    console.log('Comodín +4 (M4):', cardImages.M4);
};