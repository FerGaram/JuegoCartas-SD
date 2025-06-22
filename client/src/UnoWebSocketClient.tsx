import React, { useState, useEffect, useRef } from "react";

interface GameMessage {
  type: string;
  success?: boolean;
  message?: string;
  gameId?: string;
  data?: any;
  timestamp?: number;
}

interface GameState {
  gameId: string;
  players: Array<{
    id: string;
    name: string;
    cardCount: number;
  }>;
  currentPlayer: string;
  topCard?: {
    color: string;
    value: string;
  };
  currentColor?: string;
  myCards?: Array<{
    color: string;
    value: string;
  }>;
}

const UnoWebSocketClient: React.FC = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<GameMessage[]>([]);
  const [gameId, setGameId] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [inputGameId, setInputGameId] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectToServer = () => {
    try {
      const websocket = new WebSocket("ws://localhost:8080");

      websocket.onopen = () => {
        console.log("Conectado al servidor");
        setConnected(true);
        setWs(websocket);
      };

      websocket.onmessage = (event) => {
        const message: GameMessage = JSON.parse(event.data);
        console.log("Mensaje recibido:", message);

        setMessages((prev) => [...prev, message]);

        // Manejar diferentes tipos de mensajes
        switch (message.type) {
          case "game_created":
            if (message.gameId) {
              setGameId(message.gameId);
            }
            break;
          case "player_joined":
          case "game_state":
          case "game_state_update":
            if (message.data) {
              setGameState(message.data);
            }
            break;
        }
      };

      websocket.onclose = () => {
        console.log("Desconectado del servidor");
        setConnected(false);
        setWs(null);
      };

      websocket.onerror = (error) => {
        console.error("Error de WebSocket:", error);
      };
    } catch (error) {
      console.error("Error conectando:", error);
    }
  };

  const disconnect = () => {
    if (ws) {
      ws.close();
    }
  };

  const sendMessage = (message: any) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      alert("No hay conexión con el servidor");
    }
  };

  const createGame = () => {
    sendMessage({
      action: "create_game",
    });
  };

  const joinGame = () => {
    if (!inputGameId || !playerId || !playerName) {
      alert("Por favor completa todos los campos");
      return;
    }

    sendMessage({
      action: "join_game",
      gameId: inputGameId,
      playerId: playerId,
      playerName: playerName,
    });

    setGameId(inputGameId);
  };

  const startGame = () => {
    if (!gameId || !playerId) {
      alert("Debes estar en un juego para iniciarlo");
      return;
    }

    sendMessage({
      action: "start_game",
      gameId: gameId,
      playerId: playerId,
    });
  };

  const getGameState = () => {
    if (!playerId) {
      alert("Debes tener un ID de jugador");
      return;
    }

    sendMessage({
      action: "get_game_state",
      playerId: playerId,
    });
  };

  const drawCard = () => {
    if (!playerId) {
      alert("Debes tener un ID de jugador");
      return;
    }

    sendMessage({
      action: "draw_card",
      playerId: playerId,
    });
  };

  const ping = () => {
    sendMessage({
      action: "ping",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Cliente UNO WebSocket
        </h1>

        {/* Conexión */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Conexión</h2>
          <div className="flex gap-4 items-center">
            <div
              className={`w-3 h-3 rounded-full ${
                connected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className={connected ? "text-green-600" : "text-red-600"}>
              {connected ? "Conectado" : "Desconectado"}
            </span>
            {!connected ? (
              <button
                onClick={connectToServer}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Conectar
              </button>
            ) : (
              <button
                onClick={disconnect}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Desconectar
              </button>
            )}
          </div>
        </div>

        {/* Configuración del jugador */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Configuración del Jugador
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                ID del Jugador:
              </label>
              <input
                type="text"
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                placeholder="ej: jugador1"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Nombre del Jugador:
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="ej: Alberto"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Acciones del juego */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Acciones del Juego</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <button
              onClick={createGame}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              disabled={!connected}
            >
              Crear Juego
            </button>

            <button
              onClick={startGame}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={!connected || !gameId}
            >
              Iniciar Juego
            </button>

            <button
              onClick={getGameState}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              disabled={!connected || !playerId}
            >
              Estado del Juego
            </button>

            <button
              onClick={drawCard}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              disabled={!connected || !playerId}
            >
              Robar Carta
            </button>

            <button
              onClick={ping}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              disabled={!connected}
            >
              Ping
            </button>
          </div>

          {/* Unirse a juego */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-2">Unirse a Juego</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputGameId}
                onChange={(e) => setInputGameId(e.target.value)}
                placeholder="ID del juego"
                className="flex-1 border rounded px-3 py-2"
              />
              <button
                onClick={joinGame}
                className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
                disabled={!connected}
              >
                Unirse
              </button>
            </div>
          </div>
        </div>

        {/* Estado actual */}
        {gameId && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Estado Actual</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong>ID del Juego:</strong> {gameId}
              </div>
              <div>
                <strong>Mi ID:</strong> {playerId || "No establecido"}
              </div>
            </div>

            {gameState && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">
                  Información del Juego
                </h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p>
                    <strong>Jugador Actual:</strong>{" "}
                    {gameState.currentPlayer || "N/A"}
                  </p>
                  <p>
                    <strong>Jugadores:</strong> {gameState.players?.length || 0}
                  </p>
                  {gameState.topCard && (
                    <p>
                      <strong>Carta Superior:</strong> {gameState.topCard.color}{" "}
                      {gameState.topCard.value}
                    </p>
                  )}
                  {gameState.currentColor && (
                    <p>
                      <strong>Color Actual:</strong> {gameState.currentColor}
                    </p>
                  )}
                  {gameState.myCards && (
                    <p>
                      <strong>Mis Cartas:</strong> {gameState.myCards.length}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mensajes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Mensajes del Servidor</h2>
          <div className="h-64 overflow-y-auto border rounded p-4 bg-gray-50">
            {messages.map((message, index) => (
              <div key={index} className="mb-2 p-2 bg-white rounded shadow-sm">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-blue-600">
                    {message.type}
                  </span>
                  <span className="text-xs text-gray-500">
                    {message.timestamp
                      ? new Date(message.timestamp).toLocaleTimeString()
                      : ""}
                  </span>
                </div>
                {message.message && (
                  <p className="text-sm mt-1">{message.message}</p>
                )}
                {message.gameId && (
                  <p className="text-xs text-gray-600">
                    Juego: {message.gameId}
                  </p>
                )}
                {message.success !== undefined && (
                  <span
                    className={`text-xs ${
                      message.success ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {message.success ? "✓ Éxito" : "✗ Error"}
                  </span>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnoWebSocketClient;
