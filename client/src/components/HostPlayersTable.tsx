import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Crown, WifiOff, Gamepad2, Play, Eye } from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface HostPlayer {
    id: string;
    name: string;
    gameRoom: string;
    playersConnected: number;
    maxPlayers: number;
    status: 'waiting' | 'full';
    ipAddress: string;
    lastSeen: Date;
}

const HostPlayersTable: React.FC = () => {
    const navigate = useNavigate();
    const [hostPlayers, setHostPlayers] = useState<HostPlayer[]>([]);
    const [loading, setLoading] = useState(true);

    // Simulamos la carga de datos del backend
    useEffect(() => {
        const fetchHostPlayers = async () => {
            // Aquí harías la llamada real a tu backend
            // const response = await fetch('/api/host-players');
            // const data = await response.json();

            // Datos de ejemplo
            const mockData: HostPlayer[] = [
                {
                    id: '1',
                    name: 'Carlos_Gamer',
                    gameRoom: 'Sala Épica #1',
                    playersConnected: 1,
                    maxPlayers: 3,
                    status: 'waiting',
                    ipAddress: '192.168.1.100',
                    lastSeen: new Date(Date.now() - 30000)
                },
                {
                    id: '2',
                    name: 'Maria_Pro',
                    gameRoom: 'Aventura Espacial',
                    playersConnected: 2,
                    maxPlayers: 3,
                    status: 'waiting',
                    ipAddress: '192.168.1.101',
                    lastSeen: new Date(Date.now() - 120000)
                },
                {
                    id: '3',
                    name: 'Alex_Master',
                    gameRoom: 'Reino de Terror',
                    playersConnected: 1,
                    maxPlayers: 3,
                    status: 'waiting',
                    ipAddress: '192.168.1.102',
                    lastSeen: new Date(Date.now() - 60000)
                },
                {
                    id: '4',
                    name: 'Luna_Quest',
                    gameRoom: 'Mundo Mágico',
                    playersConnected: 3,
                    maxPlayers: 3,
                    status: 'full',
                    ipAddress: '192.168.1.103',
                    lastSeen: new Date(Date.now() - 15000)
                }
            ];

            setTimeout(() => {
                setHostPlayers(mockData);
                setLoading(false);
            }, 1000);
        };

        fetchHostPlayers();

        // Actualizar cada 30 segundos
        const interval = setInterval(fetchHostPlayers, 30000);

        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'text-green-400';
            case 'waiting': return 'text-yellow-400';
            case 'full': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'waiting': return <WifiOff className="w-4 h-4" />;
            case 'full': return <Users className="w-4 h-4" />;
            default: return <WifiOff className="w-4 h-4" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'waiting': return 'Esperando';
            case 'full': return 'Completo';
            default: return 'Desconocido';
        }
    };

    const formatLastSeen = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);

        if (seconds < 60) return `${seconds}s`;
        if (minutes < 60) return `${minutes}m`;
        return `${Math.floor(minutes / 60)}h`;
    };

    const handleJoinGame = (host: HostPlayer) => {
        if (host.status === 'full') {
            alert('Esta sala está completa');
            return;
        }
        // Aquí implementarías la lógica para unirse al juego
        alert(`Uniéndose a la sala de ${host.name}: ${host.gameRoom}`);
    };

    const handleGoBack = () => {
        navigate("/home"); 
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4 sm:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
                        <span className="ml-4 text-white text-xl">Cargando hosts...</span>
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
                        <h1 className="text-2xl sm:text-4xl font-bold text-white">Jugadores Host</h1>
                    </div>
                    <div className="text-left sm:text-right">
                        <p className="text-gray-300">Total activos</p>
                        <p className="text-xl sm:text-2xl font-bold text-yellow-400">{hostPlayers.length}</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-yellow-500/20">
                        <div className="flex items-center space-x-3">
                            <div className="bg-yellow-500/20 p-2 sm:p-3 rounded-lg">
                                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-gray-300 text-sm sm:text-base">Jugadores Conectados</p>
                                <p className="text-xl sm:text-2xl font-bold text-yellow-400">
                                    {hostPlayers.reduce((sum, p) => sum + p.playersConnected, 0)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-purple-500/20">
                        <div className="flex items-center space-x-3">
                            <div className="bg-purple-500/20 p-2 sm:p-3 rounded-lg">
                                <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-gray-300 text-sm sm:text-base">Salas Disponibles</p>
                                <p className="text-xl sm:text-2xl font-bold text-purple-400">
                                    {hostPlayers.filter(p => p.status !== 'full').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

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
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 text-sm">IP:</span>
                                    <span className="text-gray-300 font-mono text-sm">{host.ipAddress}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 text-sm">Última actividad:</span>
                                    <span className="text-gray-300 text-sm">hace {formatLastSeen(host.lastSeen)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleJoinGame(host)}
                                disabled={host.status === 'full'}
                                className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${host.status === 'full'
                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                                    }`}
                            >
                                {host.status === 'full' ? (
                                    <>
                                        <Eye className="w-4 h-4" />
                                        <span>Sala Completa</span>
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4" />
                                        <span>Unirse</span>
                                    </>
                                )}
                            </button>
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
                                        IP
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                        Última Actividad
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
                                            <span className="text-gray-400 font-mono text-sm">{host.ipAddress}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-gray-400 text-sm">
                                                hace {formatLastSeen(host.lastSeen)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleJoinGame(host)}
                                                disabled={host.status === 'full'}
                                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${host.status === 'full'
                                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                                                    }`}
                                            >
                                                {host.status === 'full' ? (
                                                    <>
                                                        <Eye className="w-4 h-4" />
                                                        <span>Completo</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Play className="w-4 h-4" />
                                                        <span>Unirse</span>
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {hostPlayers.length === 0 && (
                    <div className="text-center py-12">
                        <Crown className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-400 mb-2">No hay hosts activos</h3>
                        <p className="text-gray-500">Los jugadores host aparecerán aquí cuando estén disponibles</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HostPlayersTable;