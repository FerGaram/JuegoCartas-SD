import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Users, Crown, WifiOff, Gamepad2, Play, Eye, Plus, RefreshCw } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import UnoGame from './UnoGame';

interface HostPlayer {
    id: string;
    name: string;
    gameRoom: string;
    playersConnected: number;
    maxPlayers: number;
    status: 'waiting' | 'full' | 'playing';
    ipAddress: string;
    lastSeen: Date;
    gameId: string;
}

interface WebSocketMessage {
    type: string;
    success?: boolean;
    message?: string;
    gameId?: string;
    data?: any;
    timestamp?: number;
    roomName?: string;
    hostPlayerName?: string;
    maxPlayers?: number;
    currentPlayers?: number;
}

const HostPlayersTable: React.FC = () => {
    const navigate = useNavigate();
    const [hostPlayers, setHostPlayers] = useState<HostPlayer[]>([]);
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);
    const [playerName, setPlayerName] = useState('');
    const [showCreateGame, setShowCreateGame] = useState(false);
    const [showJoinByCode, setShowJoinByCode] = useState(false);
    const [gameRoomName, setGameRoomName] = useState('');
    const [joinGameCode, setJoinGameCode] = useState('');
    const [creatingGame, setCreatingGame] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Estados para navegación al juego
    const [currentGameId, setCurrentGameId] = useState<string | null>(null);
    const [inGame, setInGame] = useState(false);

    const wsRef = useRef<WebSocket | null>(null);
    const playerId = useRef<string>(`player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    const maxPlayers = 3; // Siempre 3 jugadores
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;

    useEffect(() => {
        // Generar nombre aleatorio si no existe
        if (!playerName) {
            const randomNames = ['Gamer', 'Player', 'Champion', 'Master', 'Hero', 'Warrior'];
            const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
            const randomNumber = Math.floor(Math.random() * 1000);
            setPlayerName(`${randomName}_${randomNumber}`);
        }

        connectWebSocket();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    const connectWebSocket = () => {
        if (reconnectAttempts.current >= maxReconnectAttempts) {
            setError('No se pudo conectar al servidor después de varios intentos');
            setLoading(false);
            return;
        }

        try {
            setError(null);
            wsRef.current = new WebSocket('ws://localhost:8080');

            wsRef.current.onopen = () => {
                console.log('Conectado al servidor WebSocket');
                setConnected(true);
                setLoading(false);
                reconnectAttempts.current = 0;

                // TEMPORAL: Comentado hasta que el servidor soporte list_games
                // requestGamesList();

                // Hacer ping cada 30 segundos para mantener la conexión
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

            wsRef.current.onclose = (event) => {
                console.log('Desconectado del WebSocket', event);
                setConnected(false);

                if (!event.wasClean && reconnectAttempts.current < maxReconnectAttempts) {
                    reconnectAttempts.current++;
                    setTimeout(() => {
                        console.log(`Intentando reconexión ${reconnectAttempts.current}/${maxReconnectAttempts}`);
                        connectWebSocket();
                    }, 3000 * reconnectAttempts.current); // Backoff exponencial
                }
            };

            wsRef.current.onerror = (error) => {
                console.error('Error WebSocket:', error);
                setConnected(false);
            };

        } catch (error) {
            console.error('Error connecting to WebSocket:', error);
            setLoading(false);
            setError('Error de conexión al servidor');
        }
    };

    const sendMessage = (message: any) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
            return true;
        } else {
            console.error('WebSocket no está conectado');
            setError('No conectado al servidor');
            return false;
        }
    };

    const requestGamesList = () => {
        sendMessage({ action: 'list_games' });
    };

    const handleWebSocketMessage = (message: WebSocketMessage) => {
        console.log('Mensaje recibido:', message);

        switch (message.type) {
            case 'connection':
                console.log('Bienvenida del servidor:', message.message);
                break;

            case 'games_list':
                if (message.success && message.data) {
                    updateGamesFromServer(message.data.games || []);
                }
                break;

            case 'game_created':
                if (message.success && message.gameId) {
                    console.log('Juego creado exitosamente:', message.gameId);
                    setCreatingGame(false);
                    setShowCreateGame(false);
                    setError(null);

                    // Crear entrada local para el host
                    const newHost: HostPlayer = {
                        id: message.gameId,
                        name: playerName,
                        gameRoom: message.roomName || gameRoomName,
                        playersConnected: 0,
                        maxPlayers: message.maxPlayers || maxPlayers,
                        status: 'waiting',
                        ipAddress: 'localhost',
                        lastSeen: new Date(),
                        gameId: message.gameId
                    };

                    setHostPlayers(prev => [newHost, ...prev]);

                    // Unirse automáticamente al juego creado
                    sendMessage({
                        action: 'join_game',
                        gameId: message.gameId,
                        playerId: playerId.current,
                        playerName: playerName
                    });

                    // Guardar gameId y navegar INMEDIATAMENTE al juego
                    setCurrentGameId(message.gameId);
                    setInGame(true); // ← NAVEGAR INMEDIATAMENTE
                } else {
                    setCreatingGame(false);
                    setError(message.message || 'Error desconocido al crear juego');
                }
                break;

            case 'player_joined':
                console.log('Te uniste al juego exitosamente');
                if (message.data && message.data.gameId) {
                    updatePlayerCount(message.data.gameId, message.data.currentPlayers || 1);

                    // Si nos acabamos de unir a un juego, navegar a él
                    if (currentGameId === message.data.gameId) {
                        setInGame(true);
                    }
                }
                setError(null);
                break;

            case 'player_joined_game':
                console.log('Otro jugador se unió al juego');
                if (message.gameId) {
                    // No necesitamos solicitar lista - el servidor debería enviar game_state_update automáticamente
                    console.log('Esperando actualización automática del estado...');
                }
                break;

            case 'player_disconnected':
                console.log('Un jugador se desconectó');
                if (message.gameId) {
                    // No necesitamos solicitar lista - el servidor debería enviar game_state_update automáticamente  
                    console.log('Esperando actualización automática del estado...');
                }
                break;

            case 'game_started':
                console.log('El juego ha comenzado');
                console.log('gameId del mensaje:', message.gameId);
                console.log('currentGameId:', currentGameId);
                updateGameStatus(message.gameId, 'playing');

                // Si somos parte de este juego, navegar al juego
                if (message.gameId && currentGameId === message.gameId) {
                    console.log('Navegando al juego...');
                    setInGame(true);
                } else {
                    console.log('No navegando - IDs no coinciden o falta información');
                }
                break;

            case 'game_state_update':
                console.log('Actualización del estado del juego recibida');
                console.log('currentGameId:', currentGameId);
                console.log('message.data:', message.data);
                // Si recibimos una actualización del estado y tenemos un currentGameId, navegar al juego
                if (message.success && message.data && currentGameId) {
                    console.log('Navegando al juego por game_state_update...');
                    setInGame(true);
                }
                break;

            case 'pong':
                console.log('Pong recibido - conexión activa');
                break;

            case 'error':
                console.error('Error del servidor:', message.message);
                setError(message.message || 'Error del servidor');
                setCreatingGame(false);
                break;

            case 'game_created_failed':
                console.error('Error creando juego:', message.message);
                setError(`Error creando juego: ${message.message}`);
                setCreatingGame(false);
                break;

            case 'join_game_failed':
                console.error('Error uniéndose al juego:', message.message);
                setError(`Error uniéndose al juego: ${message.message}`);
                break;

            case 'start_game_failed':
                console.error('Error iniciando juego:', message.message);
                setError(`Error iniciando juego: ${message.message}`);
                // Mostrar mensaje más amigable para el usuario
                if (message.message?.includes('firstCard')) {
                    setError('Error del servidor: Problema inicializando el mazo de cartas. Inténtalo de nuevo.');
                }
                break;

            default:
                console.log('Mensaje no manejado:', message);
        }
    };

    const updateGamesFromServer = (serverGames: any[]) => {
        const mappedGames: HostPlayer[] = serverGames.map(game => ({
            id: game.gameId,
            name: game.hostPlayerName || 'Host',
            gameRoom: game.roomName || 'Sala sin nombre',
            playersConnected: game.currentPlayers || 0,
            maxPlayers: game.maxPlayers || 3,
            status: game.status as 'waiting' | 'full' | 'playing',
            ipAddress: 'localhost',
            lastSeen: new Date(game.createdAt || Date.now()),
            gameId: game.gameId
        }));

        setHostPlayers(mappedGames);
    };

    const updatePlayerCount = (gameId: string | undefined, newCount: number) => {
        if (!gameId) return;

        setHostPlayers(prev => prev.map(host =>
            host.gameId === gameId
                ? {
                    ...host,
                    playersConnected: newCount,
                    status: newCount >= host.maxPlayers ? 'full' : 'waiting',
                    lastSeen: new Date()
                }
                : host
        ));
    };

    const updateGameStatus = (gameId: string | undefined, status: 'waiting' | 'full' | 'playing') => {
        if (!gameId) return;

        setHostPlayers(prev => prev.map(host =>
            host.gameId === gameId
                ? { ...host, status, lastSeen: new Date() }
                : host
        ));
    };

    const handleCreateGame = () => {
        if (!gameRoomName.trim()) {
            setError('Por favor ingresa un nombre para la sala');
            return;
        }

        if (!playerName.trim()) {
            setError('Por favor ingresa tu nombre');
            return;
        }

        if (!connected) {
            setError('No estás conectado al servidor');
            return;
        }

        setCreatingGame(true);
        setError(null);

        const success = sendMessage({
            action: 'create_game',
            roomName: gameRoomName.trim(),
            hostPlayerId: playerId.current,
            hostPlayerName: playerName.trim(),
            maxPlayers: maxPlayers
        });

        if (!success) {
            setCreatingGame(false);
            setError('Error enviando solicitud al servidor');
        }
    };

    const handleJoinGame = (host: HostPlayer) => {
        if (host.status === 'full') {
            setError('Esta sala está completa');
            return;
        }

        if (host.status === 'playing') {
            setError('Este juego ya está en progreso');
            return;
        }

        if (!connected) {
            setError('No estás conectado al servidor');
            return;
        }

        setError(null);

        const success = sendMessage({
            action: 'join_game',
            gameId: host.gameId,
            playerId: playerId.current,
            playerName: playerName
        });

        if (success) {
            // Guardar gameId para navegar al juego después de unirse
            setCurrentGameId(host.gameId);
        } else {
            setError('Error enviando solicitud al servidor');
        }
    };

    const handleJoinByCode = () => {
        if (!joinGameCode.trim()) {
            setError('Por favor ingresa el código del juego');
            return;
        }

        if (!playerName.trim()) {
            setError('Por favor ingresa tu nombre');
            return;
        }

        if (!connected) {
            setError('No estás conectado al servidor');
            return;
        }

        setError(null);

        const success = sendMessage({
            action: 'join_game',
            gameId: joinGameCode.trim(),
            playerId: playerId.current,
            playerName: playerName
        });

        if (success) {
            setCurrentGameId(joinGameCode.trim());
            setShowJoinByCode(false);
            setJoinGameCode('');
        } else {
            setError('Error enviando solicitud al servidor');
        }
    };

    const handleStartGame = (host: HostPlayer) => {
        if (!connected) {
            setError('No estás conectado al servidor');
            return;
        }

        setError(null);

        const success = sendMessage({
            action: 'start_game',
            gameId: host.gameId,
            playerId: playerId.current
        });

        if (success) {
            // Guardar el gameId para navegar cuando recibamos game_started
            setCurrentGameId(host.gameId);
        } else {
            setError('Error enviando solicitud al servidor');
        }
    };

    const handleGameEnd = () => {
        // Volver al lobby cuando termine el juego
        setInGame(false);
        setCurrentGameId(null);
        setError(null);

        // Refrescar la lista de juegos
        if (connected) {
            requestGamesList();
        }
    };

    const handleGoBack = () => {
        if (wsRef.current) {
            wsRef.current.close();
        }
        navigate("/home");
    };

    const handleRefresh = () => {
        setError(null);
        if (connected) {
            // TEMPORAL: list_games no funciona aún
            setError('Actualización automática no disponible. Los juegos se actualizarán cuando se creen/unan jugadores.');
        } else {
            connectWebSocket();
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'waiting': return 'text-yellow-400';
            case 'full': return 'text-red-400';
            case 'playing': return 'text-blue-400';
            default: return 'text-gray-400';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'waiting': return <WifiOff className="w-4 h-4" />;
            case 'full': return <Users className="w-4 h-4" />;
            case 'playing': return <Play className="w-4 h-4" />;
            default: return <WifiOff className="w-4 h-4" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'waiting': return 'Esperando';
            case 'full': return 'Completo';
            case 'playing': return 'Jugando';
            default: return 'Desconocido';
        }
    };

    // Si estamos en el juego, mostrar el componente UnoGame
    if (inGame && currentGameId) {
        return (
            <UnoGame
                gameId={currentGameId}
                playerId={playerId.current}
                playerName={playerName}
                onGameEnd={handleGameEnd}
            />
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4 sm:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
                        <span className="ml-4 text-white text-xl">Conectando al servidor...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 space-y-4 sm:space-y-0">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors bg-transparent border-none cursor-pointer"
                    >
                        <ArrowLeft className="w-6 h-6" />
                        <span>Volver</span>
                    </button>
                    <div className="flex items-center space-x-3">
                        <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
                        <h1 className="text-2xl sm:text-4xl font-bold text-white">Salas UNO (3 Jugadores)</h1>
                        <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} title={connected ? 'Conectado' : 'Desconectado'}></div>
                    </div>
                    <div className="text-left sm:text-right">
                        <p className="text-gray-300">Salas activas</p>
                        <p className="text-xl sm:text-2xl font-bold text-yellow-400">{hostPlayers.length}</p>
                    </div>
                </div>

                {/* Debug info */}
                {currentGameId && (
                    <div className="mb-4 bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-blue-300 text-sm">
                                    🎮 Tienes un juego activo: <strong>{currentGameId}</strong>
                                </span>
                            </div>
                            <button
                                onClick={() => setInGame(true)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                            >
                                Ir al Juego
                            </button>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center justify-between">
                        <span className="text-red-300">{error}</span>
                        <button
                            onClick={() => setError(null)}
                            className="text-red-300 hover:text-red-100 ml-4"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Create Game Button */}
                <div className="mb-6 flex flex-wrap gap-4">
                    <button
                        onClick={() => setShowCreateGame(true)}
                        disabled={!connected}
                        className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Crear Sala (3 Jugadores)</span>
                    </button>

                    <button
                        onClick={() => setShowJoinByCode(true)}
                        disabled={!connected}
                        className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                    >
                        <Gamepad2 className="w-5 h-5" />
                        <span>Unirse por Código</span>
                    </button>

                    <button
                        onClick={handleRefresh}
                        disabled={!connected}
                        className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                    >
                        <RefreshCw className="w-5 h-5" />
                        <span>Actualizar</span>
                    </button>
                </div>

                {/* Join by Code Modal */}
                {showJoinByCode && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
                            <h3 className="text-xl font-bold text-white mb-4">Unirse por Código</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Tu nombre
                                    </label>
                                    <input
                                        type="text"
                                        value={playerName}
                                        onChange={(e) => setPlayerName(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-400"
                                        placeholder="Ingresa tu nombre"
                                        maxLength={20}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Código del juego
                                    </label>
                                    <input
                                        type="text"
                                        value={joinGameCode}
                                        onChange={(e) => setJoinGameCode(e.target.value.toUpperCase())}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-400 font-mono"
                                        placeholder="GAME_1234567890_123"
                                        maxLength={30}
                                    />
                                </div>
                                <div className="bg-gray-700 p-3 rounded-lg">
                                    <p className="text-gray-300 text-sm">
                                        <strong>Tip:</strong> Copia el código completo del juego
                                    </p>
                                    <p className="text-gray-400 text-xs mt-1">
                                        Ejemplo: GAME_1750666119009_573
                                    </p>
                                </div>
                                {error && (
                                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                                        <span className="text-red-300 text-sm">{error}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex space-x-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowJoinByCode(false);
                                        setJoinGameCode('');
                                        setError(null);
                                    }}
                                    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleJoinByCode}
                                    disabled={!joinGameCode.trim() || !playerName.trim()}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg transition-all duration-200"
                                >
                                    Unirse
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Create Game Modal */}
                {showCreateGame && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
                            <h3 className="text-xl font-bold text-white mb-4">Crear Nueva Sala</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Tu nombre
                                    </label>
                                    <input
                                        type="text"
                                        value={playerName}
                                        onChange={(e) => setPlayerName(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                                        placeholder="Ingresa tu nombre"
                                        maxLength={20}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Nombre de la sala
                                    </label>
                                    <input
                                        type="text"
                                        value={gameRoomName}
                                        onChange={(e) => setGameRoomName(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                                        placeholder="Sala Épica #1"
                                        maxLength={30}
                                    />
                                </div>
                                <div className="bg-gray-700 p-3 rounded-lg">
                                    <p className="text-gray-300 text-sm">
                                        <strong>Jugadores:</strong> 3 (fijo)
                                    </p>
                                    <p className="text-gray-400 text-xs mt-1">
                                        Todas las partidas son para exactamente 3 jugadores
                                    </p>
                                </div>
                                {error && (
                                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                                        <span className="text-red-300 text-sm">{error}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex space-x-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowCreateGame(false);
                                        setError(null);
                                    }}
                                    disabled={creatingGame}
                                    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 text-white rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleCreateGame}
                                    disabled={creatingGame || !gameRoomName.trim() || !playerName.trim()}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                                >
                                    {creatingGame ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            <span>Creando...</span>
                                        </>
                                    ) : (
                                        <span>Crear Sala</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Vista móvil - Cards */}
                <div className="block lg:hidden space-y-4">
                    {hostPlayers.map((host) => (
                        <div key={host.id} className="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700/50 p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-full">
                                        <Crown className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium">{host.name}</h3>
                                        <p className="text-gray-300 text-sm">{host.gameRoom}</p>
                                    </div>
                                </div>
                                <div className={`flex items-center space-x-1 ${getStatusColor(host.status)}`}>
                                    {getStatusIcon(host.status)}
                                    <span className="text-sm font-medium">{getStatusText(host.status)}</span>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 text-sm">Jugadores:</span>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-white text-sm">{host.playersConnected}/{host.maxPlayers}</span>
                                        <div className="w-12 bg-gray-700 rounded-full h-1.5">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                                                style={{ width: `${(host.playersConnected / host.maxPlayers) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleJoinGame(host)}
                                    disabled={host.status === 'full' || host.status === 'playing' || !connected}
                                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${host.status === 'full' || host.status === 'playing' || !connected
                                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                                        }`}
                                >
                                    <Play className="w-4 h-4" />
                                    <span>{host.status === 'full' ? 'Completa' : host.status === 'playing' ? 'En Juego' : 'Unirse'}</span>
                                </button>

                                {host.status === 'waiting' && host.playersConnected >= 2 && (
                                    <button
                                        onClick={() => handleStartGame(host)}
                                        disabled={!connected}
                                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                                    >
                                        Iniciar
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Vista desktop - Tabla */}
                <div className="hidden lg:block bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                        Host
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                        Nombre de la sala
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                        Jugadores
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                        Acción
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                                {hostPlayers.map((host) => (
                                    <tr key={host.id} className="hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-full">
                                                    <Crown className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="text-white font-medium">{host.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-gray-300">{host.gameRoom}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                <Users className="w-4 h-4 text-gray-400" />
                                                <span className="text-white">
                                                    {host.playersConnected}/{host.maxPlayers}
                                                </span>
                                                <div className="w-16 bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${(host.playersConnected / host.maxPlayers) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`flex items-center space-x-2 ${getStatusColor(host.status)}`}>
                                                {getStatusIcon(host.status)}
                                                <span className="font-medium">{getStatusText(host.status)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleJoinGame(host)}
                                                    disabled={host.status === 'full' || host.status === 'playing' || !connected}
                                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${host.status === 'full' || host.status === 'playing' || !connected
                                                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                        : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                                                        }`}
                                                >
                                                    <Play className="w-4 h-4" />
                                                    <span>{host.status === 'full' ? 'Completa' : host.status === 'playing' ? 'En Juego' : 'Unirse'}</span>
                                                </button>

                                                {host.status === 'waiting' && host.playersConnected >= 2 && (
                                                    <button
                                                        onClick={() => handleStartGame(host)}
                                                        disabled={!connected}
                                                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                                                    >
                                                        <Play className="w-4 h-4" />
                                                        <span>Iniciar</span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {hostPlayers.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700/50 p-8">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="bg-gray-700/50 p-4 rounded-full">
                                    <Users className="w-8 h-8 text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-medium text-white mb-2">
                                        No hay salas disponibles
                                    </h3>
                                    <p className="text-gray-400 mb-4">
                                        {connected ? 'Crea una sala o únete usando un código' : 'Conectándose al servidor...'}
                                    </p>
                                    {connected && (
                                        <div className="flex flex-wrap justify-center gap-3">
                                            <button
                                                onClick={() => setShowCreateGame(true)}
                                                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
                                            >
                                                <Plus className="w-5 h-5" />
                                                <span>Crear Primera Sala</span>
                                            </button>
                                            <button
                                                onClick={() => setShowJoinByCode(true)}
                                                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
                                            >
                                                <Gamepad2 className="w-5 h-5" />
                                                <span>Unirse por Código</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Connection Status */}
                {!connected && (
                    <div className="fixed bottom-4 right-4 bg-red-500/90 backdrop-blur-lg text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
                        <WifiOff className="w-4 h-4" />
                        <span className="text-sm">
                            {reconnectAttempts.current > 0 ? `Reconectando... (${reconnectAttempts.current}/${maxReconnectAttempts})` : 'Desconectado'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HostPlayersTable;