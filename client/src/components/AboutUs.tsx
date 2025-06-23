import React, { useState } from 'react';
import { ArrowLeft, Code, Palette, Users, Globe, Gamepad2, Heart, Star, Zap, Monitor, Database, Wifi, Shield, Award, Target } from 'lucide-react';
import { useNavigate } from "react-router-dom";

// Importar algunas cartas para mostrar el diseño
import A5 from "../assets/UNO/A5.png";
import R7 from "../assets/UNO/R7.png";
import V2 from "../assets/UNO/V2.png";
import P9 from "../assets/UNO/P9.png";
import B from "../assets/UNO/COMODIN.png";
import M4 from "../assets/UNO/M4.png";

//imagenes de los programadores
import Fer from "../assets/fer.jpeg";
import Beni from "../assets/beni.jpeg";
import Nava from "../assets/nava.jpeg";

//imagen del footer
import Utm from "../assets/utm.png"

const AboutUs: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('proyecto');

    const handleGoBack = () => {
        navigate("/home");
    };

    const technologies = [
        {
            category: "Frontend",
            icon: Monitor,
            color: "from-blue-500 to-cyan-500",
            techs: [
                { name: "React 18", description: "Framework principal para la interfaz de usuario", icon: "⚛️" },
                { name: "TypeScript", description: "Tipado estático para mayor robustez", icon: "🔷" },
                { name: "Tailwind CSS", description: "Framework de CSS utilitario para diseño", icon: "🎨" },
                { name: "Lucide React", description: "Librería de iconos moderna y elegante", icon: "🎯" },
                { name: "React Router", description: "Navegación entre páginas", icon: "🗺️" },
                { name: "Vite", description: "Herramienta de build rápida y moderna", icon: "⚡" }
            ]
        },
        {
            category: "Backend",
            icon: Database,
            color: "from-green-500 to-emerald-500",
            techs: [
                { name: "Java", description: "Lenguaje principal del servidor", icon: "☕" },
                { name: "WebSocket Server", description: "Servidor de comunicación en tiempo real", icon: "🌐" },
                { name: "JSON Processing", description: "Manejo de datos estructurados", icon: "📄" },
                { name: "Concurrent Collections", description: "Manejo seguro de múltiples jugadores", icon: "🔄" },
                { name: "UUID Generation", description: "Identificadores únicos para partidas", icon: "🆔" },
                { name: "Game Logic Engine", description: "Motor de lógica del juego UNO", icon: "🎲" }
            ]
        },
        {
            category: "Comunicación",
            icon: Wifi,
            color: "from-purple-500 to-pink-500",
            techs: [
                { name: "WebSocket Protocol", description: "Comunicación bidireccional en tiempo real", icon: "📡" },
                { name: "Custom JSON Protocol", description: "Protocolo de mensajes personalizado", icon: "💬" },
                { name: "Auto-reconnection", description: "Reconexión automática con backoff exponencial", icon: "🔄" },
                { name: "Heartbeat System", description: "Sistema ping/pong para mantener conexión", icon: "💓" },
                { name: "State Synchronization", description: "Sincronización del estado del juego", icon: "🔄" }
            ]
        },
        {
            category: "Herramientas & DevOps",
            icon: Code,
            color: "from-orange-500 to-red-500",
            techs: [
                { name: "Visual Studio Code", description: "IDE principal de desarrollo", icon: "💻" },
                { name: "Git & GitHub", description: "Control de versiones y colaboración", icon: "🐙" },
                { name: "npm/Node.js", description: "Gestión de paquetes y runtime", icon: "📦" },
                { name: "Chrome DevTools", description: "Debugging y optimización", icon: "🔧" },
                { name: "Java Development Kit", description: "Compilación y ejecución del backend", icon: "☕" }
            ]
        }
    ];

    const features = [
        {
            title: "🎨 Diseño de Cartas Personalizado",
            description: "Creamos desde cero todas las cartas del UNO con diseños únicos y coloridos",
            icon: Palette,
            color: "bg-gradient-to-br from-pink-500 to-purple-600"
        },
        {
            title: "🌐 Multijugador en Tiempo Real",
            description: "Sistema WebSocket que permite partidas fluidas entre múltiples jugadores",
            icon: Globe,
            color: "bg-gradient-to-br from-blue-500 to-cyan-600"
        },
        {
            title: "🎮 Lógica de Juego Completa",
            description: "Implementación fiel de todas las reglas oficiales del UNO",
            icon: Gamepad2,
            color: "bg-gradient-to-br from-green-500 to-emerald-600"
        },
        {
            title: "📱 Diseño Responsivo",
            description: "Experiencia optimizada para dispositivos móviles y desktop",
            icon: Monitor,
            color: "bg-gradient-to-br from-orange-500 to-red-600"
        },
        {
            title: "🔒 Conexión Estable",
            description: "Sistema robusto de reconexión automática y manejo de errores",
            icon: Shield,
            color: "bg-gradient-to-br from-indigo-500 to-purple-600"
        },
        {
            title: "⚡ Rendimiento Optimizado",
            description: "Arquitectura eficiente para partidas rápidas y fluidas",
            icon: Zap,
            color: "bg-gradient-to-br from-yellow-500 to-orange-600"
        }
    ];

    const teamStats = [
        { label: "Horas de Desarrollo", value: "50+", icon: "⏱️" },
        { label: "Líneas de Código", value: "5,000+", icon: "📝" },
        { label: "Cartas Diseñadas", value: "108", icon: "🃏" },
        { label: "Tecnologías Usadas", value: "15+", icon: "⚙️" }
    ];

    const tabs = [
        { id: 'proyecto', label: 'El Proyecto', icon: Target },
        { id: 'tecnologias', label: 'Tecnologías', icon: Code },
        { id: 'diseno', label: 'Diseño', icon: Palette },
        { id: 'equipo', label: 'Equipo', icon: Users }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900  p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                        <span>Volver</span>
                    </button>
                    <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full">
                            <Heart className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-center">
                            <h1 className="text-3xl sm:text-5xl font-bold text-white">Acerca de Nosotros</h1>
                            <p className="text-gray-300 text-lg">Creadores del UNO MULTIVERSO</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center space-x-2 text-yellow-400">
                            <Star className="w-5 h-5 fill-current" />
                            <span className="font-bold">Cariño UTM</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="mb-8">
                    <div className="flex flex-wrap justify-center gap-2 bg-gray-800/50 backdrop-blur-lg rounded-xl p-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all semestre-200 ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg transform scale-105'
                                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 overflow-hidden">

                    {/* El Proyecto */}
                    {activeTab === 'proyecto' && (
                        <div className="p-6 sm:p-8 space-y-8">
                            {/* Hero Section */}
                            <div className="text-center">
                                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
                                    <h2 className="text-4xl sm:text-6xl font-bold mb-4">UNO MULTIVERSO</h2>
                                </div>
                                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                    Una implementación moderna y completa del clásico juego de cartas UNO,
                                    desarrollada desde cero con tecnologías web modernas.
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {teamStats.map((stat, index) => (
                                    <div key={index} className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-6 text-center border border-gray-600/30">
                                        <div className="text-3xl mb-2">{stat.icon}</div>
                                        <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                        <div className="text-gray-400 text-sm">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Features Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {features.map((feature, index) => {
                                    const Icon = feature.icon;
                                    return (
                                        <div key={index} className="group hover:scale-105 transition-transform semestre-200">
                                            <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/30 h-full">
                                                <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                                                    <Icon className="w-6 h-6 text-white" />
                                                </div>
                                                <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                                                <p className="text-gray-300 text-sm">{feature.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Mission Statement */}
                            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-8">
                                <div className="text-center">
                                    <Target className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-white mb-4">Nuestra Misión</h3>
                                    <p className="text-blue-100 text-lg max-w-3xl mx-auto">
                                        Crear experiencias de juego digitales que mantengan la esencia y diversión
                                        de los juegos clásicos, utilizando tecnología moderna para conectar a las
                                        personas a través del entretenimiento.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tecnologías */}
                    {activeTab === 'tecnologias' && (
                        <div className="p-6 sm:p-8 space-y-8">
                            <div className="text-center">
                                <Code className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                                <h2 className="text-3xl font-bold text-white mb-4">Stack Tecnológico</h2>
                                <p className="text-gray-300 text-lg">
                                    Tecnologías modernas que hacen posible esta experiencia
                                </p>
                            </div>

                            <div className="space-y-8">
                                {technologies.map((category, index) => {
                                    const Icon = category.icon;
                                    return (
                                        <div key={index} className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/30">
                                            <div className="flex items-center space-x-3 mb-6">
                                                <div className={`bg-gradient-to-r ${category.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                                                    <Icon className="w-5 h-5 text-white" />
                                                </div>
                                                <h3 className="text-xl font-bold text-white">{category.category}</h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {category.techs.map((tech, techIndex) => (
                                                    <div key={techIndex} className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/20 hover:border-gray-500/40 transition-colors">
                                                        <div className="flex items-center space-x-3 mb-2">
                                                            <span className="text-2xl">{tech.icon}</span>
                                                            <span className="font-semibold text-white">{tech.name}</span>
                                                        </div>
                                                        <p className="text-gray-400 text-sm">{tech.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Architecture Overview */}
                            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-8">
                                <h3 className="text-2xl font-bold text-white mb-6 text-center">Arquitectura del Sistema</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className="bg-blue-500/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                            <Monitor className="w-10 h-10 text-blue-400" />
                                        </div>
                                        <h4 className="text-white font-bold mb-2">Frontend (React)</h4>
                                        <p className="text-purple-200 text-sm">Interfaz de usuario interactiva y responsiva</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="bg-green-500/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                            <Wifi className="w-10 h-10 text-green-400" />
                                        </div>
                                        <h4 className="text-white font-bold mb-2">WebSocket</h4>
                                        <p className="text-purple-200 text-sm">Comunicación en tiempo real bidireccional</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="bg-orange-500/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                            <Database className="w-10 h-10 text-orange-400" />
                                        </div>
                                        <h4 className="text-white font-bold mb-2">Backend (Java)</h4>
                                        <p className="text-purple-200 text-sm">Lógica del juego y gestión de partidas</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Diseño */}
                    {activeTab === 'diseno' && (
                        <div className="p-6 sm:p-8 space-y-8">
                            <div className="text-center">
                                <Palette className="w-16 h-16 text-pink-400 mx-auto mb-4" />
                                <h2 className="text-3xl font-bold text-white mb-4">Diseño de Cartas Personalizado</h2>
                                <p className="text-gray-300 text-lg">
                                    Creamos todas las 108 cartas del UNO con diseños únicos y coloridos
                                </p>
                            </div>

                            {/* Showcase de Cartas */}
                            <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-xl p-8">
                                <h3 className="text-2xl font-bold text-white mb-6 text-center">Galería de Cartas</h3>
                                <div className="flex justify-center space-x-4 mb-8">
                                    <div className="group">
                                        <img src={A5} alt="Amarillo 5" className="w-20 h-32 object-contain rounded-lg shadow-lg group-hover:scale-110 transition-transform semestre-200" />
                                        <p className="text-center text-yellow-300 text-sm mt-2 font-medium">Amarillo 5</p>
                                    </div>
                                    <div className="group">
                                        <img src={R7} alt="Rojo 7" className="w-20 h-32 object-contain rounded-lg shadow-lg group-hover:scale-110 transition-transform semestre-200" />
                                        <p className="text-center text-red-300 text-sm mt-2 font-medium">Rojo 7</p>
                                    </div>
                                    <div className="group">
                                        <img src={V2} alt="Verde 2" className="w-20 h-32 object-contain rounded-lg shadow-lg group-hover:scale-110 transition-transform semestre-200" />
                                        <p className="text-center text-green-300 text-sm mt-2 font-medium">Verde 2</p>
                                    </div>
                                    <div className="group">
                                        <img src={P9} alt="Azul 9" className="w-20 h-32 object-contain rounded-lg shadow-lg group-hover:scale-110 transition-transform semestre-200" />
                                        <p className="text-center text-blue-300 text-sm mt-2 font-medium">Azul 9</p>
                                    </div>
                                    <div className="group">
                                        <img src={B} alt="Comodín" className="w-20 h-32 object-contain rounded-lg shadow-lg group-hover:scale-110 transition-transform semestre-200" />
                                        <p className="text-center text-purple-300 text-sm mt-2 font-medium">Comodín</p>
                                    </div>
                                    <div className="group">
                                        <img src={M4} alt="Comodín +4" className="w-20 h-32 object-contain rounded-lg shadow-lg group-hover:scale-110 transition-transform semestre-200" />
                                        <p className="text-center text-gray-300 text-sm mt-2 font-medium">Comodín +4</p>
                                    </div>
                                </div>
                            </div>

                            {/* Proceso de Diseño */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-yellow-300 mb-4">🎨 Proceso Creativo</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-yellow-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                                            <span className="text-yellow-100 text-sm">Análisis del diseño original del UNO</span>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-yellow-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                                            <span className="text-yellow-100 text-sm">Creación de paleta de colores vibrante</span>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-yellow-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                                            <span className="text-yellow-100 text-sm">Diseño individual de cada carta</span>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-yellow-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                                            <span className="text-yellow-100 text-sm">Optimización para visualización digital</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-blue-300 mb-4">🛠️ Herramientas Utilizadas</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-2xl">🎨</span>
                                            <div>
                                                <span className="text-white font-medium">Power Point</span>
                                                <p className="text-blue-200 text-xs">Diseño de las cartas</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-2xl">🖼️</span>
                                            <div>
                                                <span className="text-white font-medium">Photoshop</span>
                                                <p className="text-blue-200 text-xs">Optimización y exportación</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-2xl">🎯</span>
                                            <div>
                                                <span className="text-white font-medium">Figma</span>
                                                <p className="text-blue-200 text-xs">Prototipado y colaboración</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Características del Diseño */}
                            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-8">
                                <h3 className="text-2xl font-bold text-white mb-6 text-center">Características del Diseño</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className="bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                            <Star className="w-8 h-8 text-green-400" />
                                        </div>
                                        <h4 className="text-white font-bold mb-2">Alta Resolución</h4>
                                        <p className="text-green-200 text-sm">Gráficos vectoriales escalables para cualquier tamaño</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="bg-blue-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                            <Palette className="w-8 h-8 text-blue-400" />
                                        </div>
                                        <h4 className="text-white font-bold mb-2">Colores Vibrantes</h4>
                                        <p className="text-green-200 text-sm">Paleta optimizada para pantallas digitales</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="bg-purple-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                            <Zap className="w-8 h-8 text-purple-400" />
                                        </div>
                                        <h4 className="text-white font-bold mb-2">Optimización</h4>
                                        <p className="text-green-200 text-sm">Archivos ligeros para carga rápida</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Equipo */}
                    {activeTab === 'equipo' && (
                        <div className="p-6 sm:p-8 space-y-8">
                            <div className="text-center">
                                <Users className="w-16 h-16 text-green-400 mx-auto mb-4" />
                                <h2 className="text-3xl font-bold text-white mb-4">Nuestro Equipo</h2>
                                <p className="text-gray-300 text-lg">
                                    Desarrolladores apasionados por crear experiencias digitales excepcionales
                                </p>
                            </div>

                            {/* Team Values */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-6 text-center">
                                    <Award className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                                    <h3 className="text-white font-bold text-lg mb-2">Calidad</h3>
                                    <p className="text-blue-200 text-sm">Nos enfocamos en crear código limpio, mantenible y eficiente</p>
                                </div>
                                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6 text-center">
                                    <Zap className="w-12 h-12 text-green-400 mx-auto mb-4" />
                                    <h3 className="text-white font-bold text-lg mb-2">Innovación</h3>
                                    <p className="text-green-200 text-sm">Siempre buscamos nuevas tecnologías y mejores soluciones</p>
                                </div>
                                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6 text-center">
                                    <Heart className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                                    <h3 className="text-white font-bold text-lg mb-2">Pasión</h3>
                                    <p className="text-purple-200 text-sm">Amamos lo que hacemos y se refleja en cada línea de código</p></div>
                            </div>

                            {/* Team Members */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    {
                                        name: "Desarrollador Frontend",
                                        role: "Especialista en React & UI/UX",
                                        description: "Responsable de la interfaz de usuario, diseño responsivo y experiencia del jugador",
                                        skills: ["React", "TypeScript", "Tailwind CSS", "UI/UX Design"],
                                        icon: "👨‍💻",
                                        color: "from-blue-500 to-cyan-500"
                                    },
                                    {
                                        name: "Desarrollador Backend",
                                        role: "Arquitecto de Sistemas",
                                        description: "Encargado de la lógica del juego, servidor WebSocket y arquitectura del sistema",
                                        skills: ["Java", "WebSocket", "System Architecture", "Game Logic"],
                                        icon: "👩‍💻",
                                        color: "from-green-500 to-emerald-500"
                                    },
                                    {
                                        name: "Diseñador Gráfico",
                                        role: "Artista Digital",
                                        description: "Creador de todas las cartas del UNO y elementos visuales del juego",
                                        skills: ["Power Point", "Photoshop", "Figma", "Digital Art"],
                                        icon: "🎨",
                                        color: "from-purple-500 to-pink-500"
                                    }
                                ].map((member, index) => (
                                    <div key={index} className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/30 hover:border-gray-500/50 transition-colors">
                                        <div className="text-center mb-4">
                                            <div className={`bg-gradient-to-r ${member.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3`}>
                                                <span className="text-2xl">{member.icon}</span>
                                            </div>
                                            <h3 className="text-white font-bold text-lg">{member.name}</h3>
                                            <p className="text-gray-400 text-sm">{member.role}</p>
                                        </div>
                                        <p className="text-gray-300 text-sm mb-4 text-center">{member.description}</p>
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {member.skills.map((skill, skillIndex) => (
                                                <span key={skillIndex} className="bg-gray-600/50 text-gray-300 px-2 py-1 rounded text-xs">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Project Timeline */}
                            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl p-8">
                                <h3 className="text-2xl font-bold text-white mb-6 text-center">Integrantes del Equipo</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        {
                                            phase: "Erik Pablo Guerrero Nava",
                                            semestre: "8vo semestre de Ing. Computación",
                                            description: "gune030312@gs.utm.mx",
                                            color: "bg-blue-500",
                                            image: Nava,
                                        },
                                        {
                                            phase: "Alberto Hernández Gris",
                                            semestre: "8vo semestre de Ing. Computación",
                                            description: "hega031005@gs.utm.mx",
                                            color: "bg-purple-500",
                                            image: Beni,
                                        },
                                        {
                                            phase: "Fernando García Ramírez",
                                            semestre: "8vo semestre de Ing. Computación",
                                            description: "garf030310@gs.utm.mx",
                                            color: "bg-green-500",
                                            image: Fer,
                                        }
                                    ].map((item, index) => (
                                        <div key={index} className="text-center">
                                            <div className={`${item.color} w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-3`}>
                                                <img src={item.image} />
                                            </div>
                                            <h4 className="text-white font-bold mb-1">{item.phase}</h4>
                                            <p className="text-indigo-200 text-sm font-medium mb-2">{item.semestre}</p>
                                            <p className="text-indigo-100 text-xs">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Contact & Support */}
                            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-8 text-center">
                                <h3 className="text-2xl font-bold text-white mb-4">¡Gracias por Jugar!</h3>
                                <p className="text-yellow-100 text-lg mb-6">
                                    Este proyecto fue creado con mucho amor y dedicación. Esperamos que disfrutes
                                    jugando UNO digital tanto como nosotros disfrutamos creándolo.
                                </p>
                                <div className="flex justify-center space-x-4">
                                    <div className="bg-yellow-500/20 rounded-lg px-4 py-2">
                                        <span className="text-yellow-300 font-medium">❤️ Hecho con pasión</span>
                                    </div>
                                    <div className="bg-orange-500/20 rounded-lg px-4 py-2">
                                        <span className="text-orange-300 font-medium">🎮 Para los amantes del UNO</span>
                                    </div>
                                    <div className="bg-orange-500/20 rounded-lg px-4 py-2">
                                        <span className="text-orange-300 font-medium">📚 Sistemas de cómputo distribuido</span>
                                    </div>
                                    <div className="bg-orange-500/20 rounded-lg px-4 py-2">
                                        <span className="text-orange-300 font-medium">🏫 Universidad Tecnologica de la Mixteca</span>
                                    </div>
                                </div>
                                <div className="flex justify-center mt-6">
                                    <img src={Utm} alt="UTM Logo" className=" w-auto " />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AboutUs;