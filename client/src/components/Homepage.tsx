import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Users, Settings, Trophy, Gamepad2, Sparkles } from 'lucide-react';

//Cartas amarillas
import A0 from "../assets/UNO/A0.png"
import A1 from "../assets/UNO/A1.png"
import A2 from "../assets/UNO/A2.png"
import A3 from "../assets/UNO/A3.png"
import A4 from "../assets/UNO/A4.png"
import A5 from "../assets/UNO/A5.png"
import A6 from "../assets/UNO/A6.png"
import A7 from "../assets/UNO/A7.png"
import A8 from "../assets/UNO/A8.png"
import A9 from "../assets/UNO/A9.png"

//Cartas Rojas
import R0 from "../assets/UNO/R0.png"
import R1 from "../assets/UNO/R1.png"
import R2 from "../assets/UNO/R2.png"
import R3 from "../assets/UNO/R3.png"
import R4 from "../assets/UNO/R4.png"
import R5 from "../assets/UNO/R5.png"
import R6 from "../assets/UNO/R6.png"
import R7 from "../assets/UNO/R7.png"
import R8 from "../assets/UNO/R8.png"
import R9 from "../assets/UNO/R9.png"

//Cartas Verdes
import V0 from "../assets/UNO/V0.png"
import V1 from "../assets/UNO/V1.png"
import V2 from "../assets/UNO/V2.png"
import V3 from "../assets/UNO/V3.png"
import V4 from "../assets/UNO/V4.png"
import V5 from "../assets/UNO/V5.png"
import V6 from "../assets/UNO/V6.png"
import V7 from "../assets/UNO/V7.png"
import V8 from "../assets/UNO/V8.png"
import V9 from "../assets/UNO/V9.png"

//Cartas purpuras
import P0 from "../assets/UNO/P0.png"
import P1 from "../assets/UNO/P1.png"
import P2 from "../assets/UNO/P2.png"
import P3 from "../assets/UNO/P3.png"
import P4 from "../assets/UNO/P4.png"
import P5 from "../assets/UNO/P5.png"
import P6 from "../assets/UNO/P6.png"
import P7 from "../assets/UNO/P7.png"
import P8 from "../assets/UNO/P8.png"
import P9 from "../assets/UNO/P9.png"

interface CardData {
    theme: any;
    id: number;
    number: string;
    rotation: number;
    zIndex: number;
    baseTranslateX: number;
    baseTranslateY: number;
    image: string;
}

const Homepage: React.FC = () => {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [currentThemeIndex, setCurrentThemeIndex] = useState<number>(0);
    const [autoLiftCard, setAutoLiftCard] = useState<number | null>(null);

    const themes: any[] = [
        {
            id: 'amarillo',
            name: 'Halo',
            color: 'from-yellow-500 to-yellow-600',
            cardColor: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
            icon: '🟡',
            pattern: '⭐',
            description: 'Cartas amarillas'
        },
        {
            id: 'rojo',
            name: 'Mario Bros',
            color: 'from-red-500 to-red-600',
            cardColor: 'bg-gradient-to-br from-red-500 to-red-600',
            icon: '🔴',
            pattern: '🔥',
            description: 'Cartas rojas'
        },
        {
            id: 'verde',
            name: 'Minecraft',
            color: 'from-green-500 to-green-600',
            cardColor: 'bg-gradient-to-br from-green-500 to-green-600',
            icon: '🟢',
            pattern: '✨',
            description: 'Cartas verdes'
        },
        {
            id: 'morado',
            name: 'Harry potter',
            color: 'from-purple-500 to-purple-600',
            cardColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
            icon: '🟣',
            pattern: '🟫',
            description: 'Cartas moradas'
        }
    ];

    const currentTheme = themes[currentThemeIndex];

    // Array con todas las imágenes organizadas por color
    const allCardImages = [
        // Amarillas (A0-A9)
        [A0, A1, A2, A3, A4, A5, A6, A7, A8, A9],
        // Rojas (R0-R9)
        [R0, R1, R2, R3, R4, R5, R6, R7, R8, R9],
        // Verdes (V0-V9)
        [V0, V1, V2, V3, V4, V5, V6, V7, V8, V9],
        // Moradas (P0-P9)
        [P0, P1, P2, P3, P4, P5, P6, P7, P8, P9]
    ];

    // Seleccionar las cartas del tema actual
    const currentCardImages = allCardImages[currentThemeIndex];
    const numbers: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    const cards: CardData[] = Array.from({ length: 10 }, (_, index) => ({
        id: index,
        theme: currentTheme,
        number: numbers[index],
        rotation: (index - 4.5) * 9,
        zIndex: 10 - Math.abs(index - 4.5),
        baseTranslateX: (index - 4.5) * 32,
        baseTranslateY: Math.abs(index - 4.5) * 3,
        image: currentCardImages[index]
    }));

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentThemeIndex((prev) => (prev + 1) % themes.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [themes.length]);

    useEffect(() => {
        setAutoLiftCard(null);
        const sequence = setTimeout(() => {
            let cardIndex = 0;
            const liftInterval = setInterval(() => {
                setAutoLiftCard(cardIndex);
                cardIndex++;
                if (cardIndex >= 10) {
                    clearInterval(liftInterval);
                    setTimeout(() => setAutoLiftCard(null), 500);
                }
            }, 200);
        }, 500);
        return () => clearTimeout(sequence);
    }, [currentThemeIndex]);

    return (
        <div>
            {/* Animacion de los destellos */}
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
                {/* Título Principal */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center mb-6">
                        <Sparkles className="w-12 h-12 text-yellow-400 mr-4 animate-spin" />
                        <h1 className="text-8xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent">
                            UNO
                        </h1>
                        <Sparkles className="w-12 h-12 text-yellow-400 ml-4 animate-spin" />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-4">
                        MULTIVERSO
                    </h2>
                    <p className="text-xl font-bold text-white max-w-2xl">
                        Vive la experiencia UNO con algunos personajes de Mario Bros, Harry Potter, Halo y Minecraft
                    </p>
                </div>

                {/* Abanico de Cartas Interactivo */}
                <div className="relative mb-16" style={{ height: '320px', width: '600px' }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                        {cards.map((card, index) => {
                            const isHovered = hoveredCard === index;
                            const isAutoLifted = autoLiftCard === index;
                            const shouldLift = isHovered || isAutoLifted;

                            const hoverTranslateY = shouldLift ? -40 : 0;
                            const hoverScale = shouldLift ? 1.1 : 1;
                            const hoverRotation = shouldLift ? 0 : card.rotation;

                            return (
                                <div
                                    key={card.id}
                                    className="absolute transition-all duration-500 ease-out cursor-pointer"
                                    style={{
                                        transform: `
                      translateX(${card.baseTranslateX}px) 
                      translateY(${card.baseTranslateY + hoverTranslateY}px) 
                      rotate(${hoverRotation}deg) 
                      scale(${hoverScale})
                    `,
                                        zIndex: shouldLift ? 100 : card.zIndex,
                                    }}
                                    onMouseEnter={() => setHoveredCard(index)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    {/* Carta UNO personalizada */}
                                    <div className="w-24 h-36 rounded-2xl shadow-2xl relative overflow-hidden transition-all duration-500">
                                        {/* Imagen de tu carta */}
                                        <img
                                            src={card.image}
                                            alt={`Carta UNO ${card.theme.name} ${card.number}`}
                                            className="w-full h-full object-cover rounded-2xl"
                                        />

                                        {/* Brillo en hover o auto-lift */}
                                        <div className={`absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent transition-opacity duration-300 ${shouldLift ? 'opacity-100' : 'opacity-0'}`} />

                                        {/* Efecto de brillo animado */}
                                        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform transition-transform duration-1000 ${shouldLift ? 'translate-x-[100%]' : 'translate-x-[-100%]'}`} />

                                        {/* Borde adicional para mejor definición */}
                                        <div className="absolute inset-0 rounded-2xl border-2 border-white/10" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Indicador de tema actual */}
                <div className="mb-12 text-center">
                    <div className="text-white/60 text-sm mb-2">Temática por colores</div>
                    <div className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${themes[currentThemeIndex].color} text-white font-bold`}>
                        <span className="mr-2">{themes[currentThemeIndex].icon}</span>
                        {themes[currentThemeIndex].name}
                        <span className="ml-2 text-sm opacity-75">({themes[currentThemeIndex].description})</span>
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-12">

                    <Link to="/select-player">
                        <button className="w-full group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-3">
                            <Users className="w-8 h-8 group-hover:animate-bounce" />
                            <span>J u g a r</span>
                        </button>
                    </Link>
                </div>

                {/* Acciones Secundarias */}
                <div className="flex flex-wrap justify-center gap-4">
                    <Link to="/acercade">
                        <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 hover:scale-105">
                            <Trophy className="w-5 h-5" />
                            <span>Acerca de Nostros</span>
                        </button>
                    </Link>

                    <Link to="/instrucciones">
                        <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 hover:scale-105">
                            <Gamepad2 className="w-5 h-5" />
                            <span>Instrucciones</span>
                        </button>
                    </Link>
                </div>

                {/* Footer */}
                <div className="mt-16 text-center">
                    <p className="text-gray-400 text-sm">
                        Realizado por Alberto, Fernando y Erik.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Homepage;