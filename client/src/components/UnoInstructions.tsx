import React, { useState } from 'react';
import { ArrowLeft, Users, Trophy, Zap, RotateCcw, Ban, Plus, Shuffle, Crown, Star, Target, Timer } from 'lucide-react';
import { useNavigate } from "react-router-dom";

// Importar las imágenes de cartas (usando las mismas rutas que tienes)
import A5 from "../assets/UNO/A5.png";
import R7 from "../assets/UNO/R7.png";
import V2 from "../assets/UNO/V2.png";
import P9 from "../assets/UNO/P9.png";
import AC from "../assets/UNO/AC.png";
import RM from "../assets/UNO/RM.png";
import VT from "../assets/UNO/VT.png";
import PC from "../assets/UNO/PC.png";
import B from "../assets/UNO/COMODIN.png";
import M4 from "../assets/UNO/M4.png";
import ATRAS from "../assets/UNO/ATRAS.png";

const UnoInstructions: React.FC = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('objetivo');

    const handleGoBack = () => {
        navigate("/home");
    };

    const sections = [
        { id: 'objetivo', title: '🎯 Objetivo', icon: Target },
        { id: 'preparacion', title: '🎲 Preparación', icon: Users },
        { id: 'cartas', title: '🃏 Tipos de Cartas', icon: Star },
        { id: 'juego', title: '🎮 Cómo Jugar', icon: Trophy },
        { id: 'especiales', title: '⚡ Cartas Especiales', icon: Zap },
        { id: 'ganar', title: '🏆 Cómo Ganar', icon: Crown },
        { id: 'consejos', title: '💡 Consejos', icon: Timer }
    ];

    const CardDisplay = ({ imageSrc, title, description }: { imageSrc: string, title: string, description: string }) => (
        <div className="flex flex-col items-center p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
            <img src={imageSrc} alt={title} className="w-16 h-24 object-contain mb-2 rounded-lg shadow-lg" />
            <h4 className="text-white font-semibold text-sm text-center mb-1">{title}</h4>
            <p className="text-gray-300 text-xs text-center">{description}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                        <span>Volver</span>
                    </button>
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-red-500 to-yellow-500 p-3 rounded-full">
                            <span className="text-2xl font-bold text-white">UNO</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-bold text-white">Instrucciones del Juego</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Navegación lateral */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 sticky top-6">
                            <h2 className="text-xl font-bold text-white mb-4">📚 Contenido</h2>
                            <nav className="space-y-2">
                                {sections.map((section) => {
                                    const Icon = section.icon;
                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeSection === section.id
                                                    ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-300'
                                                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="font-medium text-sm">{section.title}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Contenido principal */}
                    <div className="lg:col-span-3">
                        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 sm:p-8 border border-gray-700/50">

                            {/* Objetivo del Juego */}
                            {activeSection === 'objetivo' && (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <Target className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                                        <h2 className="text-3xl font-bold text-white mb-4">🎯 Objetivo del Juego</h2>
                                    </div>

                                    <div className="bg-gradient-to-r from-yellow-500/20 to-red-500/20 border border-yellow-500/30 rounded-xl p-6">
                                        <h3 className="text-2xl font-bold text-yellow-300 mb-4">¡Sé el primero en quedarte sin cartas!</h3>
                                        <div className="space-y-4 text-white text-lg">
                                            <p className="flex items-start space-x-3">
                                                <span className="text-yellow-400 font-bold">1.</span>
                                                <span>Juega todas tus cartas antes que los demás jugadores</span>
                                            </p>
                                            <p className="flex items-start space-x-3">
                                                <span className="text-yellow-400 font-bold">2.</span>
                                                <span>Grita <strong>"¡UNO!"</strong> cuando te quede solo una carta (implementación futura)</span>
                                            </p>
                                            <p className="flex items-start space-x-3">
                                                <span className="text-yellow-400 font-bold">3.</span>
                                                <span>El primero en quedarse sin cartas gana la ronda</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                                            <h4 className="text-green-300 font-bold mb-2">✅ Para Ganar:</h4>
                                            <ul className="text-green-200 space-y-1 text-sm">
                                                <li>• Combina colores y números estratégicamente</li>
                                                <li>• Usa cartas especiales en el momento correcto</li>
                                                <li>• Observa las cartas de tus oponentes</li>
                                                <li>• ¡No olvides gritar UNO!(implementación futura)</li>
                                            </ul>
                                        </div>
                                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                                            <h4 className="text-red-300 font-bold mb-2">❌ Evita:</h4>
                                            <ul className="text-red-200 space-y-1 text-sm">
                                                <li>• Olvidar gritar "UNO" (¡2 cartas de penalización!)(implementación futura)</li>
                                                <li>• Jugar cartas que ayuden a tus oponentes</li>
                                                <li>• Acumular demasiadas cartas especiales</li>
                                                <li>• No prestar atención al turno</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Preparación */}
                            {activeSection === 'preparacion' && (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <Users className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                                        <h2 className="text-3xl font-bold text-white mb-4">🎲 Preparación del Juego</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                                <h3 className="text-blue-300 font-bold text-lg mb-3">👥 Jugadores</h3>
                                                <div className="text-white space-y-2">
                                                    <p><strong>Número de jugadores:</strong> 2-10 (3 recomendado)</p>
                                                    <p><strong>Edad recomendada:</strong> 7+ años</p>
                                                    <p><strong>Duración:</strong> 15-30 minutos</p>
                                                </div>
                                            </div>

                                            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                                                <h3 className="text-purple-300 font-bold text-lg mb-3">🎯 Configuración Inicial</h3>
                                                <div className="text-white space-y-2 text-sm">
                                                    <p>• Cada jugador recibe <strong>7 cartas</strong></p>
                                                    <p>• El resto forma el <strong>mazo de robo</strong></p>
                                                    <p>• Se voltea la primera carta del mazo</p>
                                                    <p>• El jugador a la izquierda del repartidor inicia</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center">
                                            <div className="relative">
                                                <img src={ATRAS} alt="Mazo" className="w-24 h-36 object-contain rounded-lg shadow-xl" />
                                                <img src={A5} alt="Carta inicial" className="w-24 h-36 object-contain rounded-lg shadow-xl absolute -right-8 top-4" />
                                                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold">
                                                    Mazo → Carta inicial
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
                                        <h3 className="text-yellow-300 font-bold text-lg mb-4">📋 Pasos de Preparación:</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-yellow-500 text-black w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
                                                    <span className="text-white">Baraja todas las 108 cartas</span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-yellow-500 text-black w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
                                                    <span className="text-white">Reparte 7 cartas a cada jugador</span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-yellow-500 text-black w-8 h-8 rounded-full flex items-center justify-center font-bold">3</div>
                                                    <span className="text-white">Coloca el mazo boca abajo</span>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-yellow-500 text-black w-8 h-8 rounded-full flex items-center justify-center font-bold">4</div>
                                                    <span className="text-white">Voltea la primera carta</span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-yellow-500 text-black w-8 h-8 rounded-full flex items-center justify-center font-bold">5</div>
                                                    <span className="text-white">El jugador de la izquierda inicia</span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-yellow-500 text-black w-8 h-8 rounded-full flex items-center justify-center font-bold">6</div>
                                                    <span className="text-white">¡Comienza la diversión!</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tipos de Cartas */}
                            {activeSection === 'cartas' && (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <Star className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                                        <h2 className="text-3xl font-bold text-white mb-4">🃏 Tipos de Cartas</h2>
                                    </div>

                                    {/* Cartas Numéricas */}
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                                        <h3 className="text-blue-300 font-bold text-xl mb-4">🔢 Cartas Numéricas (0-9)</h3>
                                        <p className="text-white mb-4">Las cartas más comunes del juego. Cada color tiene números del 0 al 9.</p>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                            <CardDisplay imageSrc={A5} title="Amarillo 5" description="Se puede jugar sobre amarillo o número 5" />
                                            <CardDisplay imageSrc={R7} title="Rojo 7" description="Se puede jugar sobre rojo o número 7" />
                                            <CardDisplay imageSrc={V2} title="Verde 2" description="Se puede jugar sobre verde o número 2" />
                                            <CardDisplay imageSrc={P9} title="Azul 9" description="Se puede jugar sobre azul o número 9" />
                                        </div>

                                        <div className="bg-blue-900/30 rounded-lg p-4">
                                            <h4 className="text-blue-200 font-bold mb-2">📊 Distribución:</h4>
                                            <div className="text-blue-100 text-sm space-y-1">
                                                <p>• <strong>Cero (0):</strong> 1 carta por color = 4 cartas</p>
                                                <p>• <strong>Números 1-9:</strong> 2 cartas por color y número = 72 cartas</p>
                                                <p>• <strong>Total cartas numéricas:</strong> 76 cartas</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cartas de Acción */}
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                        <h3 className="text-red-300 font-bold text-xl mb-4">⚡ Cartas de Acción</h3>
                                        <p className="text-white mb-4">Cartas especiales que afectan el curso del juego.</p>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <CardDisplay imageSrc={AC} title="Saltar" description="El siguiente jugador pierde su turno" />
                                            <CardDisplay imageSrc={VT} title="Reversa" description="Cambia la dirección del juego" />
                                            <CardDisplay imageSrc={RM} title="Roba 2" description="El siguiente jugador roba 2 cartas" />
                                        </div>

                                        <div className="bg-red-900/30 rounded-lg p-4">
                                            <h4 className="text-red-200 font-bold mb-2">🎯 Estrategia:</h4>
                                            <p className="text-red-100 text-sm">Las cartas de acción son poderosas para defenderte o atacar a tus oponentes. Úsalas sabiamente para cambiar el momentum del juego.</p>
                                        </div>
                                    </div>

                                    {/* Cartas Comodín */}
                                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
                                        <h3 className="text-purple-300 font-bold text-xl mb-4">🌈 Cartas Comodín</h3>
                                        <p className="text-white mb-4">Las cartas más poderosas: se pueden jugar en cualquier momento.</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <CardDisplay imageSrc={B} title="Comodín" description="Cambia el color del juego" />
                                            <CardDisplay imageSrc={M4} title="Comodín +4" description="Cambia color y siguiente jugador roba 4" />
                                        </div>

                                        <div className="bg-purple-900/30 rounded-lg p-4">
                                            <h4 className="text-purple-200 font-bold mb-2">⚠️ Regla Especial del +4:</h4>
                                            <p className="text-purple-100 text-sm">Solo se puede jugar cuando no tienes cartas del color actual. Si un jugador sospecha que tienes una carta del color, puede desafiarte.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Cómo Jugar */}
                            {activeSection === 'juego' && (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <Trophy className="w-16 h-16 text-green-400 mx-auto mb-4" />
                                        <h2 className="text-3xl font-bold text-white mb-4">🎮 Cómo Jugar</h2>
                                    </div>

                                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                                        <h3 className="text-green-300 font-bold text-xl mb-4">🔄 Flujo del Turno</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-start space-x-4">
                                                <div className="bg-green-500 text-black w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">1</div>
                                                <div>
                                                    <h4 className="text-white font-bold">Observa la Carta Superior</h4>
                                                    <p className="text-gray-300 text-sm">Mira el color y número/símbolo de la carta en la pila de descarte.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-4">
                                                <div className="bg-green-500 text-black w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">2</div>
                                                <div>
                                                    <h4 className="text-white font-bold">Juega una Carta Válida</h4>
                                                    <p className="text-gray-300 text-sm">Debe coincidir en color, número/símbolo, o ser un comodín.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-4">
                                                <div className="bg-green-500 text-black w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">3</div>
                                                <div>
                                                    <h4 className="text-white font-bold">¿No Puedes Jugar?</h4>
                                                    <p className="text-gray-300 text-sm">Roba una carta del mazo. Si puedes jugarla inmediatamente, hazlo.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-4">
                                                <div className="bg-green-500 text-black w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">4</div>
                                                <div>
                                                    <h4 className="text-white font-bold">¡Grita "UNO"!</h4>
                                                    <p className="text-gray-300 text-sm">Cuando te quede solo una carta, debes gritar "UNO" inmediatamente.(implementación futura)</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                            <h4 className="text-blue-300 font-bold mb-3">✅ Cartas Válidas para Jugar:</h4>
                                            <div className="space-y-2 text-blue-100 text-sm">
                                                <p>• <strong>Mismo color:</strong> Rojo sobre rojo</p>
                                                <p>• <strong>Mismo número:</strong> 7 sobre 7</p>
                                                <p>• <strong>Mismo símbolo:</strong> Saltar sobre Saltar</p>
                                                <p>• <strong>Comodín:</strong> Siempre válido</p>
                                            </div>
                                        </div>
                                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                                            <h4 className="text-yellow-300 font-bold mb-3">⏰ Reglas de Tiempo:</h4>
                                            <div className="space-y-2 text-yellow-100 text-sm">
                                                <p>• <strong>Piensa rápido:</strong> No demores demasiado(implementación futura)</p>
                                                <p>• <strong>UNO inmediato:</strong> Grita al jugar tu penúltima carta(implementación futura)</p>
                                                <p>• <strong>Sin retractarse:</strong> Una vez jugada, no se cambia</p>
                                                <p>• <strong>Orden estricto:</strong> Respeta el turno</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                        <h3 className="text-red-300 font-bold text-lg mb-4">🚨 Penalizaciones</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="text-red-200 font-bold mb-2">Olvidar gritar "UNO":</h4>
                                                <p className="text-red-100 text-sm">Si alguien te atrapa antes de que el siguiente jugador tome su turno, debes robar 2 cartas.</p>
                                            </div>
                                            <div>
                                                <h4 className="text-red-200 font-bold mb-2">Jugada inválida:</h4>
                                                <p className="text-red-100 text-sm">Si juegas una carta inválida, debes tomarla de vuelta y robar una carta adicional.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Cartas Especiales */}
                            {activeSection === 'especiales' && (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                                        <h2 className="text-3xl font-bold text-white mb-4">⚡ Cartas Especiales en Detalle</h2>
                                    </div>

                                    {/* Saltar */}
                                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6">
                                        <div className="flex items-center space-x-4 mb-4">
                                            <img src={AC} alt="Saltar" className="w-16 h-24 object-contain rounded-lg" />
                                            <div>
                                                <h3 className="text-orange-300 font-bold text-xl">🚫 Carta Saltar</h3>
                                                <p className="text-orange-100">El siguiente jugador en la línea pierde su turno.</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-orange-900/30 rounded-lg p-4">
                                                <h4 className="text-orange-200 font-bold mb-2">📋 Cómo Funciona:</h4>
                                                <ul className="text-orange-100 text-sm space-y-1">
                                                    <li>• Se juega como carta normal (color coincidente)</li>
                                                    <li>• El siguiente jugador no puede jugar</li>
                                                    <li>• El turno pasa al jugador después del saltado</li>
                                                    <li>• En 2 jugadores: obtienes otro turno</li>
                                                </ul>
                                            </div>
                                            <div className="bg-orange-800/30 rounded-lg p-4">
                                                <h4 className="text-orange-200 font-bold mb-2">🎯 Estrategia:</h4>
                                                <ul className="text-orange-100 text-sm space-y-1">
                                                    <li>• Úsala cuando el siguiente jugador tenga pocas cartas</li>
                                                    <li>• Protégete de ser atacado</li>
                                                    <li>• Combínala con otras cartas especiales</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reversa */}
                                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
                                        <div className="flex items-center space-x-4 mb-4">
                                            <img src={VT} alt="Reversa" className="w-16 h-24 object-contain rounded-lg" />
                                            <div>
                                                <h3 className="text-purple-300 font-bold text-xl">🔄 Carta Reversa</h3>
                                                <p className="text-purple-100">Cambia la dirección del juego.</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-purple-900/30 rounded-lg p-4">
                                                <h4 className="text-purple-200 font-bold mb-2">📋 Cómo Funciona:</h4>
                                                <ul className="text-purple-100 text-sm space-y-1">
                                                    <li>• Cambia dirección: horario ↔ antihorario</li>
                                                    <li>• En 2 jugadores: actúa como Saltar</li>
                                                    <li>• El turno regresa hacia ti más rápido</li>
                                                    <li>• Muy útil en partidas de 3+ jugadores</li>
                                                </ul>
                                            </div>
                                            <div className="bg-purple-800/30 rounded-lg p-4">
                                                <h4 className="text-purple-200 font-bold mb-2">🎯 Estrategia:</h4>
                                                <ul className="text-purple-100 text-sm space-y-1">
                                                    <li>• Evita que un jugador específico juegue</li>
                                                    <li>• Regresa el turno a un aliado</li>
                                                    <li>• Rompe cadenas de cartas especiales</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Roba 2 */}
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                        <div className="flex items-center space-x-4 mb-4">
                                            <img src={RM} alt="Roba 2" className="w-16 h-24 object-contain rounded-lg" />
                                            <div>
                                                <h3 className="text-red-300 font-bold text-xl">➕ Carta Roba 2</h3>
                                                <p className="text-red-100">El siguiente jugador roba 2 cartas y pierde su turno.</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-red-900/30 rounded-lg p-4">
                                                <h4 className="text-red-200 font-bold mb-2">📋 Cómo Funciona:</h4>
                                                <ul className="text-red-100 text-sm space-y-1">
                                                    <li>• El siguiente jugador roba 2 cartas</li>
                                                    <li>• Ese jugador pierde su turno</li>
                                                    <li>• Se puede "apilar" con otro Roba 2</li>
                                                    <li>• Solo del mismo color o con comodín</li>
                                                </ul>
                                            </div>
                                            <div className="bg-red-800/30 rounded-lg p-4">
                                                <h4 className="text-red-200 font-bold mb-2">🎯 Estrategia:</h4>
                                                <ul className="text-red-100 text-sm space-y-1">
                                                    <li>• Ataca jugadores con pocas cartas</li>
                                                    <li>• Úsala defensivamente si te van a atacar</li>
                                                    <li>• Combínala con cambio de color</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Comodín */}
                                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
                                        <div className="flex items-center space-x-4 mb-4">
                                            <img src={B} alt="Comodín" className="w-16 h-24 object-contain rounded-lg" />
                                            <div>
                                                <h3 className="text-yellow-300 font-bold text-xl">🌈 Comodín</h3>
                                                <p className="text-yellow-100">Cambia el color del juego a tu elección.</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-yellow-900/30 rounded-lg p-4">
                                                <h4 className="text-yellow-200 font-bold mb-2">📋 Cómo Funciona:</h4>
                                                <ul className="text-yellow-100 text-sm space-y-1">
                                                    <li>• Se puede jugar sobre cualquier carta</li>
                                                    <li>• Declaras el nuevo color</li>
                                                    <li>• El siguiente jugador debe seguir ese color</li>
                                                    <li>• No tiene penalización para nadie</li>
                                                </ul>
                                            </div>
                                            <div className="bg-yellow-800/30 rounded-lg p-4">
                                                <h4 className="text-yellow-200 font-bold mb-2">🎯 Estrategia:</h4>
                                                <ul className="text-yellow-100 text-sm space-y-1">
                                                    <li>• Cambia a un color que domines</li>
                                                    <li>• Salte de situaciones difíciles</li>
                                                    <li>• Guárdala para momentos críticos</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Comodín +4 */}
                                    <div className="bg-black border border-gray-500 rounded-xl p-6">
                                        <div className="flex items-center space-x-4 mb-4">
                                            <img src={M4} alt="Comodín +4" className="w-16 h-24 object-contain rounded-lg" />
                                            <div>
                                                <h3 className="text-gray-300 font-bold text-xl">💀 Comodín +4</h3>
                                                <p className="text-gray-100">La carta más poderosa: cambia color y el siguiente roba 4.</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-gray-800 rounded-lg p-4">
                                                <h4 className="text-gray-200 font-bold mb-2">📋 Cómo Funciona:</h4>
                                                <ul className="text-gray-100 text-sm space-y-1">
                                                    <li>• Solo cuando NO tienes el color actual</li>
                                                    <li>• El siguiente jugador roba 4 cartas</li>
                                                    <li>• Ese jugador pierde su turno</li>
                                                    <li>• Puedes ser desafiado si haces trampa</li>
                                                </ul>
                                            </div>
                                            <div className="bg-gray-700 rounded-lg p-4">
                                                <h4 className="text-gray-200 font-bold mb-2">⚠️ Regla del Desafío:</h4>
                                                <ul className="text-gray-100 text-sm space-y-1">
                                                    <li>• Si tienes cartas del color, es ilegal</li>
                                                    <li>• El desafiado puede ver tus cartas</li>
                                                    <li>• Si hiciste trampa: TÚ robas 4</li>
                                                    <li>• Si era legal: el desafiador roba 6</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Cómo Ganar */}
                            {activeSection === 'ganar' && (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                                        <h2 className="text-3xl font-bold text-white mb-4">🏆 Cómo Ganar</h2>
                                    </div>

                                    <div className="bg-gradient-to-r from-yellow-500/20 to-gold-500/20 border border-yellow-500/30 rounded-xl p-6">
                                        <h3 className="text-yellow-300 font-bold text-2xl mb-4 text-center">🎉 ¡Condiciones de Victoria!</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="bg-green-500/20 border border-green-500/40 rounded-lg p-4">
                                                    <h4 className="text-green-300 font-bold text-lg mb-2">✅ Victoria Inmediata</h4>
                                                    <p className="text-green-100 text-sm mb-3">Sé el primer jugador en quedarte completamente sin cartas.</p>
                                                    <div className="space-y-2 text-green-200 text-xs">
                                                        <p>• Juega tu última carta correctamente</p>
                                                        <p>• No olvides gritar "UNO" en la penúltima</p>
                                                        <p>• ¡Celebra tu victoria!</p>
                                                    </div>
                                                </div>
                                                <div className="bg-blue-500/20 border border-blue-500/40 rounded-lg p-4">
                                                    <h4 className="text-blue-300 font-bold text-lg mb-2">🎯 Puntuación (Opcional)</h4>
                                                    <p className="text-blue-100 text-sm mb-3">Suma puntos de las cartas que quedaron en manos rivales.</p>
                                                    <div className="space-y-1 text-blue-200 text-xs">
                                                        <p>• Números: Valor facial (0-9 pts)</p>
                                                        <p>• Especiales: 20 puntos cada una</p>
                                                        <p>• Comodines: 50 puntos cada uno</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-center">
                                                <div className="text-center">
                                                    <div className="bg-yellow-500 text-black rounded-full w-24 h-24 flex items-center justify-center mb-4 mx-auto">
                                                        <Trophy className="w-12 h-12" />
                                                    </div>
                                                    <h4 className="text-yellow-300 font-bold text-lg">¡GANADOR!</h4>
                                                    <p className="text-yellow-100 text-sm">0 cartas en mano</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                                            <h4 className="text-purple-300 font-bold text-lg mb-3">🚀 Estrategias para Ganar:</h4>
                                            <div className="space-y-2 text-purple-100 text-sm">
                                                <p>• <strong>Administra colores:</strong> Intenta tener cartas de varios colores</p>
                                                <p>• <strong>Guarda comodines:</strong> Úsalos en momentos críticos</p>
                                                <p>• <strong>Observa rivales:</strong> Cuenta sus cartas y colores</p>
                                                <p>• <strong>Cartas de acción:</strong> Úsalas para bloquear rivales cercanos a ganar</p>
                                                <p>• <strong>Timing perfecto:</strong> Gritar UNO en el momento exacto</p>
                                            </div>
                                        </div>
                                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                                            <h4 className="text-red-300 font-bold text-lg mb-3">⚠️ Errores que Evitar:</h4>
                                            <div className="space-y-2 text-red-100 text-sm">
                                                <p>• <strong>Olvidar UNO:</strong> Penalización de 2 cartas extra</p>
                                                <p>• <strong>Jugar muy agresivo:</strong> Puede volverse en tu contra</p>
                                                <p>• <strong>No observar rivales:</strong> Perderte señales importantes</p>
                                                <p>• <strong>Malgas
                                                    tar comodines:</strong> Guardarlos para emergencias</p>
                                                <p>• <strong>Jugadas ilegales:</strong> Cartas inválidas = penalización</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl p-6">
                                        <h3 className="text-green-300 font-bold text-xl mb-4">🎊 Finales Épicos</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="text-center p-4 bg-green-900/30 rounded-lg">
                                                <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                                                <h4 className="text-green-300 font-bold mb-1">Victoria con Especial</h4>
                                                <p className="text-green-200 text-xs">Gana jugando tu última carta especial para máximo impacto</p>
                                            </div>
                                            <div className="text-center p-4 bg-blue-900/30 rounded-lg">
                                                <Shuffle className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                                                <h4 className="text-blue-300 font-bold mb-1">Cambio de Color Final</h4>
                                                <p className="text-blue-200 text-xs">Usa un comodín para cambiar a tu color favorito y ganar</p>
                                            </div>
                                            <div className="text-center p-4 bg-purple-900/30 rounded-lg">
                                                <Target className="w-8 h-8 text-red-400 mx-auto mb-2" />
                                                <h4 className="text-purple-300 font-bold mb-1">Victoria Numérica</h4>
                                                <p className="text-purple-200 text-xs">Gana con una carta número perfectamente calculada</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Consejos */}
                            {activeSection === 'consejos' && (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <Timer className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                                        <h2 className="text-3xl font-bold text-white mb-4">💡 Consejos y Estrategias</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                                            <h3 className="text-green-300 font-bold text-xl mb-4">🧠 Estrategia Mental</h3>
                                            <div className="space-y-4">
                                                <div className="bg-green-900/30 rounded-lg p-4">
                                                    <h4 className="text-green-200 font-bold mb-2">🎯 Observación</h4>
                                                    <ul className="text-green-100 text-sm space-y-1">
                                                        <li>• Cuenta las cartas de cada jugador</li>
                                                        <li>• Observa qué colores tienen más</li>
                                                        <li>• Nota cuándo roban cartas</li>
                                                        <li>• Memoriza cartas especiales jugadas</li>
                                                    </ul>
                                                </div>
                                                <div className="bg-green-800/30 rounded-lg p-4">
                                                    <h4 className="text-green-200 font-bold mb-2">🤔 Planificación</h4>
                                                    <ul className="text-green-100 text-sm space-y-1">
                                                        <li>• Planifica 2-3 jugadas adelante</li>
                                                        <li>• Ten rutas de escape preparadas</li>
                                                        <li>• Conserva variedad de colores</li>
                                                        <li>• Guarda cartas especiales para el final</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                            <h3 className="text-red-300 font-bold text-xl mb-4">⚔️ Táctica de Combate</h3>
                                            <div className="space-y-4">
                                                <div className="bg-red-900/30 rounded-lg p-4">
                                                    <h4 className="text-red-200 font-bold mb-2">🛡️ Defensiva</h4>
                                                    <ul className="text-red-100 text-sm space-y-1">
                                                        <li>• Usa Saltar cuando te ataquen</li>
                                                        <li>• Reversa para cambiar el objetivo</li>
                                                        <li>• Apila Roba 2 para defenderte</li>
                                                        <li>• Comodín como escape de emergencia</li>
                                                    </ul>
                                                </div>
                                                <div className="bg-red-800/30 rounded-lg p-4">
                                                    <h4 className="text-red-200 font-bold mb-2">⚡ Ofensiva</h4>
                                                    <ul className="text-red-100 text-sm space-y-1">
                                                        <li>• Ataca al jugador con menos cartas</li>
                                                        <li>• Combina cartas especiales</li>
                                                        <li>• Cambia colores estratégicamente</li>
                                                        <li>• Roba +4 en momentos críticos</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                                        <h3 className="text-blue-300 font-bold text-xl mb-4">🎮 Consejos por Situación</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="bg-blue-900/30 rounded-lg p-4">
                                                <h4 className="text-blue-200 font-bold mb-2">🚀 Inicio de Partida</h4>
                                                <ul className="text-blue-100 text-sm space-y-1">
                                                    <li>• Juega cartas numéricas primero</li>
                                                    <li>• Observa las manos iniciales</li>
                                                    <li>• No desperdicies especiales</li>
                                                    <li>• Mantén variedad de colores</li>
                                                </ul>
                                            </div>
                                            <div className="bg-blue-800/30 rounded-lg p-4">
                                                <h4 className="text-blue-200 font-bold mb-2">⚖️ Medio Juego</h4>
                                                <ul className="text-blue-100 text-sm space-y-1">
                                                    <li>• Usa cartas de acción tácticamente</li>
                                                    <li>• Controla el flujo del juego</li>
                                                    <li>• Prepárate para el final</li>
                                                    <li>• Ataca jugadores peligrosos</li>
                                                </ul>
                                            </div>
                                            <div className="bg-blue-700/30 rounded-lg p-4">
                                                <h4 className="text-blue-200 font-bold mb-2">🏁 Final de Partida</h4>
                                                <ul className="text-blue-100 text-sm space-y-1">
                                                    <li>• ¡Recuerda gritar UNO!</li>
                                                    <li>• Bloquea a rivales cercanos</li>
                                                    <li>• Usa comodines estratégicamente</li>
                                                    <li>• Calcula tu última jugada</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
                                        <h3 className="text-purple-300 font-bold text-xl mb-4">🎭 Psicología del Juego</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <h4 className="text-purple-200 font-bold">🎪 Engaños Permitidos:</h4>
                                                <ul className="text-purple-100 text-sm space-y-1">
                                                    <li>• Finge tener/no tener ciertos colores</li>
                                                    <li>• Actúa como si fueras a perder</li>
                                                    <li>• Distrae con conversación casual</li>
                                                    <li>• Haz jugadas "subóptimas" intencionalmente</li>
                                                </ul>
                                            </div>
                                            <div className="space-y-3">
                                                <h4 className="text-purple-200 font-bold">👁️ Lectura de Oponentes:</h4>
                                                <ul className="text-purple-100 text-sm space-y-1">
                                                    <li>• Observa patrones de juego</li>
                                                    <li>• Nota cuando dudan en jugar</li>
                                                    <li>• Ve qué cartas evitan jugar</li>
                                                    <li>• Atención a su lenguaje corporal</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 text-center">
                                        <h3 className="text-yellow-300 font-bold text-2xl mb-4">🌟 El Consejo de Oro</h3>
                                        <div className="bg-yellow-900/30 rounded-lg p-6 max-w-2xl mx-auto">
                                            <p className="text-yellow-100 text-lg font-medium mb-4">
                                                "El UNO no se trata solo de las cartas que tienes, sino de cómo y cuándo las juegas."
                                            </p>
                                            <p className="text-yellow-200 text-sm">
                                                La paciencia, observación y timing perfecto vencen a la suerte.
                                                ¡Diviértete y que gane el mejor estratega!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnoInstructions;