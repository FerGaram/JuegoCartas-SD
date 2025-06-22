import React, { useState, useEffect, useRef } from "react";
import { Send, Wifi, WifiOff, User, Users, Gamepad2, Plus } from "lucide-react";

interface Message {
  id: string;
  timestamp: number;
  type: string;
  data: any;
  direction: "sent" | "received";
}

interface ConnectionState {
  connected: boolean;
  connecting: boolean;
  error: string | null;
}

const UnoClient: React.FC = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    connected: false,
    connecting: false,
    error: null,
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [serverUrl, setServerUrl] = useState("ws://localhost:8080");
  const [playerId, setPlayerId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [gameId, setGameId] = useState("");

  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generatePlayerId = () => {
    return "player_" + Math.random().toString(36).substr(2, 9);
  };

  const addMessage = (
    type: string,
    data: any,
    direction: "sent" | "received"
  ) => {
    const message: Message = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      type,
      data,
      direction,
    };
    setMessages((prev) => [...prev, message]);
  };

  const connectToServer = () => {
    if (connectionState.connecting || connectionState.connected) return;

    setConnectionState({ connected: false, connecting: true, error: null });

    try {
      const ws = new WebSocket(serverUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionState({ connected: true, connecting: false, error: null });
        addMessage("connection", { status: "Connected to server" }, "received");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          addMessage(data.type || "message", data, "received");
        } catch (error) {
          addMessage("raw_message", { content: event.data }, "received");
        }
      };

      ws.onclose = () => {
        setConnectionState({
          connected: false,
          connecting: false,
          error: "Connection closed",
        });
        addMessage(
          "connection",
          { status: "Disconnected from server" },
          "received"
        );
      };

      ws.onerror = (error) => {
        setConnectionState({
          connected: false,
          connecting: false,
          error: "Connection error",
        });
        addMessage(
          "error",
          { message: "WebSocket error occurred" },
          "received"
        );
      };
    } catch (error) {
      setConnectionState({
        connected: false,
        connecting: false,
        error: "Failed to connect",
      });
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const sendMessage = (action: string, payload: any = {}) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      addMessage("error", { message: "Not connected to server" }, "sent");
      return;
    }

    const message = {
      action,
      ...payload,
    };

    wsRef.current.send(JSON.stringify(message));
    addMessage(action, message, "sent");
  };

  const createGame = () => {
    sendMessage("create_game");
  };

  const joinGame = () => {
    if (!gameId.trim() || !playerId.trim() || !playerName.trim()) {
      addMessage("error", { message: "Please fill in all fields" }, "sent");
      return;
    }
    sendMessage("join_game", {
      gameId: gameId.trim(),
      playerId: playerId.trim(),
      playerName: playerName.trim(),
    });
  };

  const startGame = () => {
    if (!gameId.trim() || !playerId.trim()) {
      addMessage(
        "error",
        { message: "Please fill in Game ID and Player ID" },
        "sent"
      );
      return;
    }
    sendMessage("start_game", {
      gameId: gameId.trim(),
      playerId: playerId.trim(),
    });
  };

  const getGameState = () => {
    if (!playerId.trim()) {
      addMessage("error", { message: "Please enter Player ID" }, "sent");
      return;
    }
    sendMessage("get_game_state", {
      playerId: playerId.trim(),
    });
  };

  const ping = () => {
    sendMessage("ping");
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatMessageData = (data: any) => {
    return JSON.stringify(data, null, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Gamepad2 className="text-yellow-400" />
            UNO Game Client
          </h1>
          <p className="text-gray-300">Connect and play UNO with friends</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Connection Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                {connectionState.connected ? (
                  <Wifi className="text-green-400" />
                ) : (
                  <WifiOff className="text-red-400" />
                )}
                Connection
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Server URL
                  </label>
                  <input
                    type="text"
                    value={serverUrl}
                    onChange={(e) => setServerUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ws://localhost:8080"
                    disabled={connectionState.connected}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={connectToServer}
                    disabled={
                      connectionState.connecting || connectionState.connected
                    }
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    {connectionState.connecting ? "Connecting..." : "Connect"}
                  </button>
                  <button
                    onClick={disconnect}
                    disabled={!connectionState.connected}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Disconnect
                  </button>
                </div>

                {connectionState.error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                    {connectionState.error}
                  </div>
                )}
              </div>

              {/* Player Info */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <User className="text-blue-400" />
                  Player Info
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Player ID
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={playerId}
                        onChange={(e) => setPlayerId(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter player ID"
                      />
                      <button
                        onClick={() => setPlayerId(generatePlayerId())}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        title="Generate ID"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Player Name
                    </label>
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Game ID
                    </label>
                    <input
                      type="text"
                      value={gameId}
                      onChange={(e) => setGameId(e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter game ID"
                    />
                  </div>
                </div>
              </div>

              {/* Game Actions */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Users className="text-purple-400" />
                  Game Actions
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={createGame}
                    disabled={!connectionState.connected}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                  >
                    Create Game
                  </button>
                  <button
                    onClick={joinGame}
                    disabled={!connectionState.connected}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                  >
                    Join Game
                  </button>
                  <button
                    onClick={startGame}
                    disabled={!connectionState.connected}
                    className="px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                  >
                    Start Game
                  </button>
                  <button
                    onClick={getGameState}
                    disabled={!connectionState.connected}
                    className="px-3 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                  >
                    Get State
                  </button>
                  <button
                    onClick={ping}
                    disabled={!connectionState.connected}
                    className="px-3 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                  >
                    Ping
                  </button>
                  <button
                    onClick={clearMessages}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                  >
                    Clear Log
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 h-[800px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Send className="text-green-400" />
                  Server Messages
                </h2>
                <div className="text-sm text-gray-300">
                  {messages.length} messages
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    No messages yet. Connect to the server to start receiving
                    messages.
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg border ${
                        message.direction === "sent"
                          ? "bg-blue-500/20 border-blue-500/50 ml-8"
                          : "bg-green-500/20 border-green-500/50 mr-8"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              message.direction === "sent"
                                ? "bg-blue-600 text-white"
                                : "bg-green-600 text-white"
                            }`}
                          >
                            {message.direction === "sent" ? "SENT" : "RECEIVED"}
                          </span>
                          <span className="text-sm font-medium text-white">
                            {message.type}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                      <pre className="text-sm text-gray-200 overflow-x-auto whitespace-pre-wrap">
                        {formatMessageData(message.data)}
                      </pre>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="text-xs text-gray-400 text-center">
                All server responses are displayed here in real-time
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnoClient;
