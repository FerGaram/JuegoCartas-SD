import React, { useState, useEffect } from 'react';
import { ArrowLeft, Crown, Users, Settings, Play, Copy, Check, WifiOff, Wifi } from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface GameRoom {
    name: string;
    maxPlayers: number;
    isPrivate: boolean;
    password?: string;
    description: string;
    gameMode: string;
}

const CreateHostRoom: React.FC = () => {
     const navigate = useNavigate();
    const [isHosting, setIsHosting] = useState(false);
    const [roomData, setRoomData] = useState<GameRoom>({
        name: '',
        maxPlayers: 3,
        isPrivate: false,
        password: '',
        description: '',
        gameMode: 'adventure'
    });
    const [hostInfo, setHostInfo] = useState({
        ipAddress: '192.168.1.100',
        port: '7777',
        playersConnected: 0
    });
    const [copied, setCopied] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!roomData.name.trim()) {
            newErrors.name = 'El nombre de la sala es obligatorio';
        }

        if (roomData.isPrivate && !roomData.password) {
            newErrors.password = 'Las salas privadas requieren contraseña';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof GameRoom, value: any) => {
        setRoomData(prev => ({
            ...prev,
            [field]: value
        }));

        // Limpiar error del campo cuando se modifica
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleStartHosting = () => {
        if (!validateForm()) {
            return;
        }

        setIsHosting(true);
        // Aquí implementarías la lógica para iniciar el servidor host
        console.log('Iniciando servidor host con:', roomData);
    };

    const handleStopHosting = () => {
        setIsHosting(false);
        setHostInfo(prev => ({ ...prev, playersConnected: 0 }));
        // Aquí implementarías la lógica para detener el servidor host
        console.log('Deteniendo servidor host');
    };

    const copyConnectionInfo = async () => {
        const connectionString = `IP: ${hostInfo.ipAddress}:${hostInfo.port}\nSala: ${roomData.name}${roomData.isPrivate ? '\nContraseña: ' + roomData.password : ''}`;

        try {
            await navigator.clipboard.writeText(connectionString);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Error al copiar:', err);
        }
    };

    const handleGoBack = () => {
        if (isHosting) {
            if (confirm('¿Estás seguro de que quieres salir? Esto cerrará la sala para todos los jugadores.')) {
                handleStopHosting();
                navigate("/player-host");
            }
        } else {
            navigate("/home");
        }
    };

    // Simular conexiones de jugadores (solo para demo)
    useEffect(() => {
        if (isHosting) {
            const interval = setInterval(() => {
                // Simular cambios aleatorios en jugadores conectados
                const randomChange = Math.random();
                if (randomChange < 0.1) { // 10% chance de cambio
                    setHostInfo(prev => ({
                        ...prev,
                        playersConnected: Math.min(prev.playersConnected + 1, roomData.maxPlayers)
                    }));
                }
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [isHosting, roomData.maxPlayers]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
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
                        <h1 className="text-2xl sm:text-4xl font-bold text-white">
                            {isHosting ? 'Hosting Activo' : 'Crear Sala Host'}
                        </h1>
                    </div>
                    <div className="text-left sm:text-right">
                        <div className={`flex items-center space-x-2 ${isHosting ? 'text-green-400' : 'text-gray-400'}`}>
                            {isHosting ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                            <span className="font-medium">{isHosting ? 'En línea' : 'Desconectado'}</span>
                        </div>
                    </div>
                </div>

                {!isHosting ? (
                    /* Formulario de creación */
                    <div className="space-y-6">
                        {/* Información básica */}
                        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/20">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                                <Settings className="w-5 h-5 text-yellow-400" />
                                <span>Configuración de la Sala</span>
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Nombre de la Sala *
                                    </label>
                                    <input
                                        type="text"
                                        value={roomData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder="Mi Sala Épica"
                                        className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${errors.name ? 'border-red-500' : 'border-gray-600'
                                            }`}
                                    />
                                    {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Máximo de Jugadores
                                    </label>
                                    <select
                                        value={3}
                                        disabled
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white cursor-not-allowed opacity-70"
                                    >
                                        <option value={3}>3 jugadores</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Descripción (Opcional)
                                </label>
                                <textarea
                                    value={roomData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Describe tu sala de juego..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all resize-none"
                                />
                            </div>
                        </div>

                        {/* Configuración de privacidad */}
                        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
                            <h2 className="text-xl font-bold text-white mb-4">Privacidad</h2>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id="private"
                                        checked={roomData.isPrivate}
                                        onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
                                        className="w-4 h-4 text-blue-400 bg-gray-700 border-gray-600 rounded focus:ring-blue-400 focus:ring-2"
                                    />
                                    <label htmlFor="private" className="text-white font-medium">
                                        Sala Privada
                                    </label>
                                </div>

                                {roomData.isPrivate && (
                                    <div>
                                        <label className="block text-gray-300 text-sm font-medium mb-2">
                                            Contraseña *
                                        </label>
                                        <input
                                            type="password"
                                            value={roomData.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            placeholder="Ingresa una contraseña"
                                            className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${errors.password ? 'border-red-500' : 'border-gray-600'
                                                }`}
                                        />
                                        {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Botón de inicio */}
                        <div className="text-center">
                            <button
                                onClick={handleStartHosting}
                                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-3 mx-auto"
                            >
                                <Play className="w-6 h-6" />
                                <span className="text-lg">Iniciar Sala Host</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Panel de hosting activo */
                    <div className="space-y-6">
                        {/* Estado de la sala */}
                        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-green-500/20">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">{roomData.name}</h2>
                                    <p className="text-gray-300">{roomData.description || 'Sin descripción'}</p>
                                </div>
                                <button
                                    onClick={handleStopHosting}
                                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    Detener Host
                                </button>
                            </div>
                        </div>

                        {/* Información de conexión */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/20">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                                    <Wifi className="w-5 h-5 text-yellow-400" />
                                    <span>Información de Conexión</span>
                                </h3>

                                <div className="space-y-3">
                                    <div>
                                        <span className="text-gray-400 text-sm">Dirección IP:</span>
                                        <p className="text-white font-mono text-lg">{hostInfo.ipAddress}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 text-sm">Puerto:</span>
                                        <p className="text-white font-mono text-lg">{hostInfo.port}</p>
                                    </div>
                                    {roomData.isPrivate && (
                                        <div>
                                            <span className="text-gray-400 text-sm">Contraseña:</span>
                                            <p className="text-white font-mono text-lg">{roomData.password}</p>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={copyConnectionInfo}
                                    className="w-full mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    <span>{copied ? 'Copiado!' : 'Copiar Info'}</span>
                                </button>
                            </div>

                            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                                    <Users className="w-5 h-5 text-purple-400" />
                                    <span>Jugadores Conectados</span>
                                </h3>

                                <div className="text-center">
                                    <div className="text-4xl font-bold text-purple-400 mb-2">
                                        {hostInfo.playersConnected} / {roomData.maxPlayers}
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                                        <div
                                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                                            style={{ width: `${(hostInfo.playersConnected / roomData.maxPlayers) * 100}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-gray-400">
                                        {hostInfo.playersConnected === 0
                                            ? 'Esperando jugadores...'
                                            : hostInfo.playersConnected === roomData.maxPlayers
                                                ? 'Sala completa'
                                                : `${roomData.maxPlayers - hostInfo.playersConnected} espacios disponibles`
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateHostRoom;