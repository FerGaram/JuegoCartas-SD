import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Users, Crown, WifiOff, Gamepad2, Play, Eye, Plus, RefreshCw } from 'lucide-react';
import { getCardImageFromString, getCardImage } from './cardImages';

// Función para obtener imagen de carta (implementación básica)
const getCardImageSrc = (cardString?: string, showBack: boolean = false): string => {
    if (showBack) {
        return getCardImage('back', '');
    }

    if (!cardString) {
        return getCardImage('back', '');
    }

    return getCardImageFromString(cardString);
};

// Tipos para el juego
export type CardColor = 'RED' | 'BLUE' | 'GREEN' | 'YELLOW' | 'WILD';
export type CardType = 'ZERO' | 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE' | 'SIX' | 'SEVEN' | 'EIGHT' | 'NINE' | 'SKIP' | 'REVERSE' | 'DRAW_TWO' | 'WILD' | 'WILD_DRAW_FOUR';

export interface Card {
    color: CardColor;
    type: CardType;
    value?: string | number;
}

export interface Player {
    id: string;
    name: string;
    handSize: number;
    hand?: string[]; // Solo para el jugador actual
    isConnected: boolean;
}

export interface GameState {
    gameId: string;
    gameState: string;
    drawPileSize: number;
    topCard: string | null;
    players: Player[];
    currentPlayer: string;
    isMyTurn: boolean;
    waitingForColorChoice: boolean;
    colorChoicePlayer?: string;
    shouldChooseColor?: boolean;
    winner?: string;
    winnerName?: string;
}

interface WebSocketMessage {
    type: string;
    success?: boolean;
    message?: string;
    gameId?: string;
    data?: any;
    timestamp?: number;
}

interface UnoGameProps {
    gameId: string;
    playerId: string;
    playerName: string;
    onGameEnd: () => void;
}

// Componente de carta individual
const UnoCard: React.FC<{
    cardString?: string;
    card?: Card;
    isPlayable?: boolean;
    onClick?: () => void;
    size?: 'small' | 'medium' | 'large';
    showBack?: boolean;
}> = ({ cardString, card, isPlayable = true, onClick, size = 'medium', showBack = false }) => {
    const getCardSize = () => {
        const sizes = {
            small: 'w-12 h-16',
            medium: 'w-16 h-24',
            large: 'w-24 h-36'
        };
        return sizes[size];
    };

    const parseCardString = (cardStr: string): Card => {
        const [color, type] = cardStr.split('_');
        return { color: color as CardColor, type: type as CardType };
    };

    const getCardData = () => {
        if (card) return card;
        if (cardString) return parseCardString(cardString);
        return { color: 'RED' as CardColor, type: 'ZERO' as CardType };
    };

    const cardData = getCardData();

    const getCardImageSrc = () => {
        if (showBack) {
            return getCardImage('back', '');
        }

        if (cardString) {
            return getCardImageFromString(cardString);
        }

        if (card) {
            return getCardImage(card.color, card.type);
        }

        return getCardImage('back', '');
    };

    const getDisplayValue = () => {
        const typeMap: { [key in CardType]: string } = {
            'ZERO': '0', 'ONE': '1', 'TWO': '2', 'THREE': '3', 'FOUR': '4',
            'FIVE': '5', 'SIX': '6', 'SEVEN': '7', 'EIGHT': '8', 'NINE': '9',
            'SKIP': 'SKIP', 'REVERSE': 'REV', 'DRAW_TWO': '+2',
            'WILD': 'WILD', 'WILD_DRAW_FOUR': '+4'
        };
        return typeMap[cardData.type] || cardData.type;
    };

    return (
        <div
            className={`
        ${getCardSize()}
        rounded-lg shadow-lg border-2 border-gray-800
        cursor-pointer transform transition-all duration-200
        ${isPlayable ? 'hover:scale-105 hover:shadow-xl hover:-translate-y-1' : 'opacity-75'}
        ${!isPlayable ? 'cursor-not-allowed' : ''}
        relative overflow-hidden
      `}
            onClick={isPlayable ? onClick : undefined}
        >
            <img
                src={getCardImageSrc()}
                alt={showBack ? 'Carta oculta' : `${cardData.color} ${getDisplayValue()}`}
                className="w-full h-full object-contain rounded-lg"
                draggable={false}
            />
        </div>
    );
};

// Componente de mano del jugador
const PlayerHand: React.FC<{
    hand: string[];
    isMyTurn: boolean;
    onCardPlay: (cardIndex: number, cardString: string) => void;
    topCard: string | null;
}> = ({ hand, isMyTurn, onCardPlay, topCard }) => {

    const canPlayCard = (cardString: string, topCardString: string | null): boolean => {
        if (!topCardString) return true;

        const [cardColor, cardType] = cardString.split('_');
        const [topColor, topType] = topCardString.split('_');

        // Cartas wild siempre se pueden jugar
        if (cardType === 'WILD' || cardType === 'WILD_DRAW_FOUR') {
            return true;
        }

        // Mismo color o mismo tipo
        return cardColor === topColor || cardType === topType;
    };

    return (
        <div className="flex flex-wrap gap-2 justify-center">
            {hand.map((cardString, index) => {
                const playable = isMyTurn && canPlayCard(cardString, topCard);
                return (
                    <UnoCard
                        key={`${cardString}-${index}`}
                        cardString={cardString}
                        isPlayable={playable}
                        onClick={() => onCardPlay(index, cardString)}
                        size="medium"
                    />
                );
            })}
        </div>
    );
};

// Componente de otros jugadores
const OpponentPlayer: React.FC<{
    player: Player;
    position: 'top' | 'left' | 'right';
    isCurrentPlayer: boolean;
}> = ({ player, position, isCurrentPlayer }) => {
    const getPositionClasses = () => {
        const positions = {
            top: 'flex-col items-center',
            left: 'flex-col items-center',
            right: 'flex-col items-center'
        };
        return positions[position];
    };

    return (
        <div className={`flex ${getPositionClasses()} space-y-2`}>
            <div className={`
        px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300
        ${isCurrentPlayer ? 'bg-yellow-400 text-gray-800 animate-pulse' : 'bg-gray-200 text-gray-700'}
        ${!player.isConnected ? 'opacity-50' : ''}
      `}>
                {player.name} ({player.handSize})
                {!player.isConnected && ' (Desconectado)'}
            </div>
            <div className="flex flex-wrap gap-1 max-w-48">
                {Array(player.handSize).fill(0).map((_, index) => (
                    <UnoCard
                        key={`back-${player.id}-${index}`}
                        size="small"
                        showBack={true}
                        isPlayable={false}
                    />
                ))}
            </div>
        </div>
    );
};

// Modal para elegir color
const ColorChoiceModal: React.FC<{
    isOpen: boolean;
    onColorChoose: (color: string) => void;
}> = ({ isOpen, onColorChoose }) => {
    if (!isOpen) return null;

    const colors = [
        { color: 'RED', name: 'Rojo', bgClass: 'bg-red-500' },
        { color: 'YELLOW', name: 'Amarillo', bgClass: 'bg-yellow-500' },
        { color: 'GREEN', name: 'Verde', bgClass: 'bg-green-500' },
        { color: 'BLUE', name: 'Purpura', bgClass: 'bg-purple-500' },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-bold text-center mb-6">Elige un color</h3>
                <div className="grid grid-cols-2 gap-4">
                    {colors.map(({ color, name, bgClass }) => (
                        <button
                            key={color}
                            onClick={() => onColorChoose(color)}
                            className={`${bgClass} text-white py-4 rounded-lg font-semibold hover:opacity-80 transition-opacity transform hover:scale-105`}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Componente principal del juego
const UnoGame: React.FC<UnoGameProps> = ({
    gameId,
    playerId,
    playerName,
    onGameEnd
}) => {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [connected, setConnected] = useState(false);
    const [showColorModal, setShowColorModal] = useState(false);
    const [pendingWildCard, setPendingWildCard] = useState<{ cardIndex: number; cardString: string } | null>(null);
    const [gameMessages, setGameMessages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        connectWebSocket();

        // Debug: Mostrar imágenes disponibles en desarrollo
        if (process.env.NODE_ENV === 'development') {
            console.log('🎮 UnoGame iniciado');
            // Puedes descomentar esta línea para debug:
            // debugAvailableImages();
        }

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    const connectWebSocket = () => {
        try {
            wsRef.current = new WebSocket('ws://localhost:8080');

            wsRef.current.onopen = () => {
                console.log('Conectado al servidor WebSocket');
                setConnected(true);
                setLoading(false);
                addGameMessage('Conectado al servidor');

                // Solicitar el estado del juego
                requestGameState();

                // Ping cada 30 segundos
                const pingInterval = setInterval(() => {
                    if (wsRef.current?.readyState === WebSocket.OPEN) {
                        sendMessage({ action: 'ping' });
                    }
                }, 30000);

                wsRef.current?.addEventListener('close', () => {
                    clearInterval(pingInterval);
                });
            };

            wsRef.current.onmessage = (event) => {
                try {
                    const message: WebSocketMessage = JSON.parse(event.data);
                    handleWebSocketMessage(message);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            wsRef.current.onclose = () => {
                console.log('Desconectado del WebSocket');
                setConnected(false);
                addGameMessage('Desconectado del servidor');

                // Intentar reconectar
                setTimeout(() => {
                    if (!connected) {
                        connectWebSocket();
                    }
                }, 3000);
            };

            wsRef.current.onerror = (error) => {
                console.error('Error WebSocket:', error);
                setConnected(false);
            };

        } catch (error) {
            console.error('Error connecting to WebSocket:', error);
            setLoading(false);
        }
    };

    const sendMessage = (message: any) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        } else {
            console.error('WebSocket no está conectado');
            addGameMessage('Error: No conectado al servidor');
        }
    };

    const handleWebSocketMessage = (message: WebSocketMessage) => {
        console.log('Mensaje recibido:', message);

        switch (message.type) {
            case 'connection':
                addGameMessage('Conectado al servidor UNO');
                break;

            case 'game_state':
            case 'game_state_update':
                if (message.success && message.data) {
                    updateGameStateFromServer(message.data);
                }
                break;

            case 'card_played':
                addGameMessage(`Carta jugada`);
                requestGameState();
                break;

            case 'card_drawn':
                addGameMessage(`Carta robada`);
                requestGameState();
                break;

            case 'color_chosen':
                addGameMessage(`Color elegido: ${message.data}`);
                requestGameState();
                break;

            case 'game_started':
                addGameMessage('¡El juego ha comenzado!');
                requestGameState();
                break;

            case 'game_ended':
                addGameMessage(`¡Juego terminado! Ganador: ${message.data}`);
                setTimeout(() => {
                    if (onGameEnd) {
                        onGameEnd();
                    }
                }, 5000);
                break;

            case 'player_joined_game':
                addGameMessage(`Jugador se unió al juego`);
                requestGameState();
                break;

            case 'player_disconnected':
                addGameMessage(`Jugador se desconectó`);
                requestGameState();
                break;

            case 'error':
            case 'play_card_failed':
            case 'draw_card_failed':
            case 'choose_color_failed':
            case 'get_game_state_failed':
                console.error('Error del servidor:', message.message);
                addGameMessage(`Error: ${message.message}`);
                break;

            case 'pong':
                // Respuesta al ping, no hacer nada
                break;

            default:
                console.log('Mensaje no manejado:', message);
        }
    };

    const updateGameStateFromServer = (serverData: any) => {
        console.log('Actualizando estado del juego:', serverData);

        const newGameState: GameState = {
            gameId: serverData.gameId,
            gameState: serverData.gameState,
            drawPileSize: serverData.drawPileSize,
            topCard: serverData.topCard,
            players: serverData.players || [],
            currentPlayer: serverData.currentPlayer,
            isMyTurn: serverData.isMyTurn || false,
            waitingForColorChoice: serverData.waitingForColorChoice || false,
            colorChoicePlayer: serverData.colorChoicePlayer,
            shouldChooseColor: serverData.shouldChooseColor || false,
            winner: serverData.winner,
            winnerName: serverData.winnerName
        };

        setGameState(newGameState);

        // Si necesitamos elegir color
        if (newGameState.shouldChooseColor && !showColorModal) {
            setShowColorModal(true);
        }

        // Si alguien ganó
        if (newGameState.winner) {
            addGameMessage(`¡${newGameState.winnerName} ganó el juego!`);
        }
    };

    const requestGameState = () => {
        sendMessage({
            action: 'get_game_state',
            playerId: playerId
        });
    };

    const handleCardPlay = (cardIndex: number, cardString: string) => {
        if (!gameState?.isMyTurn) {
            addGameMessage('No es tu turno');
            return;
        }

        const [color, type] = cardString.split('_');

        // Si es una carta wild, mostrar modal para elegir color
        if (type === 'WILD' || type === 'WILD_DRAW_FOUR') {
            setPendingWildCard({ cardIndex, cardString });
            setShowColorModal(true);
            return;
        }

        // Jugar carta normal
        playCard(cardIndex, null);
    };

    const playCard = (cardIndex: number, chosenColor: string | null) => {
        sendMessage({
            action: 'play_card',
            playerId: playerId,
            cardIndex: cardIndex,
            chosenColor: chosenColor
        });
    };

    const handleColorChoice = (color: string) => {
        setShowColorModal(false);

        if (pendingWildCard) {
            playCard(pendingWildCard.cardIndex, color);
            setPendingWildCard(null);
        } else if (gameState?.shouldChooseColor) {
            // Enviar elección de color directamente
            sendMessage({
                action: 'choose_color',
                playerId: playerId,
                color: color
            });
        }
    };

    const handleDrawCard = () => {
        if (!gameState?.isMyTurn) {
            addGameMessage('No es tu turno');
            return;
        }

        sendMessage({
            action: 'draw_card',
            playerId: playerId
        });
    };

    const addGameMessage = (message: string) => {
        setGameMessages(prev => [...prev.slice(-4), message]);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-xl">Conectando al juego...</p>
                </div>
            </div>
        );
    }

    if (!connected) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-center">
                    <p className="text-xl mb-4">Conexión perdida</p>
                    <button
                        onClick={connectWebSocket}
                        className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Reconectar
                    </button>
                </div>
            </div>
        );
    }

    if (!gameState) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header del juego */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={onGameEnd}
                            className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Salir</span>
                        </button>

                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-white">UNO - Sala de Espera</h1>
                            <div className="text-white text-sm">
                                Juego: {gameId}
                            </div>
                        </div>

                        <div className="text-right">
                            <div className={`px-2 py-1 rounded text-sm ${connected ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                                {connected ? 'Conectado' : 'Desconectado'}
                            </div>
                        </div>
                    </div>

                    {/* Pantalla de espera */}
                    <div className="text-center py-12">
                        <div className="bg-white/20 backdrop-blur-lg rounded-xl p-8 max-w-md mx-auto">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-400 mx-auto mb-6"></div>
                            <h2 className="text-2xl font-bold text-white mb-4">Esperando jugadores...</h2>
                            <p className="text-white/80 mb-6">
                                Necesitas al menos 2 jugadores para comenzar la partida
                            </p>
                            <button
                                onClick={requestGameState}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                            >
                                Actualizar Estado
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const currentPlayer = gameState.players.find(p => p.id === playerId);
    const otherPlayers = gameState.players.filter(p => p.id !== playerId);

    // Si el juego está en modo de espera, mostrar sala de espera
    if (gameState.gameState === 'WAITING_FOR_PLAYERS') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={onGameEnd}
                            className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Salir</span>
                        </button>

                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-white">UNO - Sala de Espera</h1>
                            <div className="text-white text-sm">
                                Juego: {gameState.gameId}
                            </div>
                        </div>

                        <div className="text-right">
                            <div className={`px-2 py-1 rounded text-sm ${connected ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                                {connected ? 'Conectado' : 'Desconectado'}
                            </div>
                        </div>
                    </div>

                    {/* Información de la sala */}
                    <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 mb-6">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Esperando jugadores...
                            </h2>
                            <p className="text-white/80">
                                {gameState.players.length}/3 jugadores conectados
                            </p>
                            <p className="text-white/60 text-sm mt-2">
                                {gameState.players.length >= 2 ? '¡Ya puedes iniciar el juego!' : 'Necesitas al menos 2 jugadores para comenzar'}
                            </p>
                        </div>

                        {/* Lista de jugadores */}
                        <div className="space-y-3 mb-6">
                            {gameState.players.map((player, index) => (
                                <div
                                    key={player.id}
                                    className={`flex items-center justify-between p-3 rounded-lg ${player.id === playerId ? 'bg-yellow-500/20 border border-yellow-400/50' : 'bg-white/10'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-3 h-3 rounded-full ${player.isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                        <span className="text-white font-medium">{player.name}</span>
                                        {player.id === playerId && (
                                            <span className="text-yellow-400 text-sm">(Tú)</span>
                                        )}
                                        {index === 0 && (
                                            <div title="Host" className="inline-block">
                                                <Crown className="w-4 h-4 text-yellow-400" />
                                            </div>
                                        )}
                                    </div>
                                    <span className={`text-sm ${player.isConnected ? 'text-green-300' : 'text-red-300'}`}>
                                        {player.isConnected ? 'Conectado' : 'Desconectado'}
                                    </span>
                                </div>
                            ))}

                            {/* Slots vacíos */}
                            {Array(3 - gameState.players.length).fill(0).map((_, index) => (
                                <div key={`empty-${index}`} className="flex items-center p-3 rounded-lg bg-white/5 border-2 border-dashed border-white/20">
                                    <div className="w-3 h-3 rounded-full bg-gray-500 mr-3"></div>
                                    <span className="text-white/50">Esperando jugador...</span>
                                </div>
                            ))}
                        </div>

                        {/* Controles */}
                        <div className="flex justify-center space-x-4">
                            {gameState.players.length >= 2 && (
                                <button
                                    onClick={() => {
                                        sendMessage({
                                            action: 'start_game',
                                            gameId: gameState.gameId,
                                            playerId: playerId
                                        });
                                    }}
                                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                                >
                                    <Play className="w-5 h-5" />
                                    <span>Iniciar Juego</span>
                                </button>
                            )}

                            <button
                                onClick={requestGameState}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                            >
                                <RefreshCw className="w-5 h-5" />
                                <span>Actualizar</span>
                            </button>
                        </div>
                    </div>

                    {/* Código de invitación */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
                        <p className="text-white/80 text-sm mb-2">Comparte este código con tus amigos:</p>
                        <div className="bg-white/20 rounded-lg p-3 font-mono text-white text-lg font-bold">
                            {gameState.gameId}
                        </div>
                    </div>

                    {/* Mensajes del juego */}
                    {gameMessages.length > 0 && (
                        <div className="mt-4 bg-white/10 backdrop-blur-lg rounded-xl p-4">
                            <div className="text-white text-sm space-y-1 max-h-20 overflow-y-auto">
                                {gameMessages.map((message, index) => (
                                    <div key={index}>{message}</div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header del juego */}
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={onGameEnd}
                        className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Salir</span>
                    </button>

                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-white">UNO</h1>
                        <div className="text-white text-sm">
                            Juego: {gameState.gameId}
                        </div>
                    </div>

                    <div className="text-right">
                        <div className={`px-2 py-1 rounded text-sm ${connected ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                            {connected ? 'Conectado' : 'Desconectado'}
                        </div>
                    </div>
                </div>

                {/* Información del juego */}
                <div className="flex justify-center space-x-6 text-white mb-4">
                    <span>Cartas en mazo: {gameState.drawPileSize}</span>
                    <span>Estado: {gameState.gameState}</span>
                    {gameState.isMyTurn && (
                        <span className="px-3 py-1 rounded bg-yellow-500 text-black font-bold animate-pulse">
                            ¡Tu turno!
                        </span>
                    )}
                    {gameState.waitingForColorChoice && (
                        <span className="px-3 py-1 rounded bg-purple-500 text-white font-bold">
                            Esperando elección de color...
                        </span>
                    )}
                </div>

                {/* Mensajes del juego */}
                <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-4">
                    <div className="text-white text-sm space-y-1 max-h-16 overflow-y-auto">
                        {gameMessages.map((message, index) => (
                            <div key={index}>{message}</div>
                        ))}
                    </div>
                </div>

                {/* Layout del juego */}
                <div className="relative h-80 mb-6">
                    {/* Otros jugadores */}
                    {otherPlayers.map((player, index) => {
                        const positions = ['top', 'left', 'right'] as const;
                        const position = positions[index % 3];
                        const positionClasses = {
                            top: 'absolute top-0 left-1/2 transform -translate-x-1/2',
                            left: 'absolute left-4 top-1/2 transform -translate-y-1/2',
                            right: 'absolute right-4 top-1/2 transform -translate-y-1/2'
                        };

                        return (
                            <div key={player.id} className={positionClasses[position]}>
                                <OpponentPlayer
                                    player={player}
                                    position={position}
                                    isCurrentPlayer={player.id === gameState.currentPlayer}
                                />
                            </div>
                        );
                    })}

                    {/* Centro del juego - Carta actual */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="flex flex-col items-center">
                            <span className="text-white font-semibold mb-2">Carta Actual</span>
                            {gameState.topCard ? (
                                <UnoCard
                                    cardString={gameState.topCard}
                                    size="large"
                                    isPlayable={false}
                                />
                            ) : (
                                <div className="w-24 h-36 bg-gray-300 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-600">Sin carta</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mazo - Inferior derecha */}
                    <div className="absolute bottom-0 right-4">
                        <div className="flex flex-col items-center">
                            <span className="text-white font-semibold mb-2">Mazo ({gameState.drawPileSize})</span>
                            <div
                                className={`cursor-pointer transform transition-transform ${gameState.isMyTurn && !gameState.waitingForColorChoice ? 'hover:scale-105' : 'opacity-50'
                                    }`}
                                onClick={handleDrawCard}
                            >
                                <UnoCard
                                    size="large"
                                    showBack={true}
                                    isPlayable={gameState.isMyTurn && !gameState.waitingForColorChoice}
                                />
                            </div>
                            <span className="text-white text-xs mt-1">
                                {gameState.isMyTurn && !gameState.waitingForColorChoice ? 'Toca para robar' : 'Mazo'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Mano del jugador actual */}
                <div className="mt-6">
                    <div className="bg-white bg-opacity-20 rounded-lg p-4">
                        <h3 className="text-white text-lg font-semibold mb-4 text-center">
                            Tu mano ({currentPlayer?.handSize || 0} cartas)
                            {gameState.isMyTurn && !gameState.waitingForColorChoice && ' - ¡Juega una carta!'}
                        </h3>
                        {currentPlayer?.hand && (
                            <PlayerHand
                                hand={currentPlayer.hand}
                                isMyTurn={gameState.isMyTurn && !gameState.waitingForColorChoice}
                                onCardPlay={handleCardPlay}
                                topCard={gameState.topCard}
                            />
                        )}
                    </div>
                </div>

                {/* Controles adicionales */}
                <div className="mt-4 flex justify-center space-x-4">
                    <button
                        onClick={requestGameState}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>Actualizar</span>
                    </button>
                </div>

                {/* Modal para elegir color */}
                <ColorChoiceModal
                    isOpen={showColorModal}
                    onColorChoose={handleColorChoice}
                />

                {/* Pantalla de ganador */}
                {gameState.winner && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-8 text-center">
                            <h2 className="text-3xl font-bold text-green-600 mb-4">¡Juego Terminado!</h2>
                            <p className="text-xl mb-6">
                                🎉 {gameState.winnerName} ganó el juego! 🎉
                            </p>
                            <button
                                onClick={onGameEnd}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
                            >
                                Volver al Lobby
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UnoGame;