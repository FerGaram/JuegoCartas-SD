package com.navaplaystudios.server;

/**
 *
 * @author alber
 */
import com.navaplaystudios.server.clases.*;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
import org.json.*;
import java.net.InetSocketAddress;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;
import java.util.Set;

public class UnoWebSocketServer extends WebSocketServer {
    private static final int PORT = 8080;
    private GameManager gameManager;
    private Map<WebSocket, String> playerConnections; // WebSocket -> playerId
    private Map<String, WebSocket> playerSockets; // playerId -> WebSocket
    private Map<String, String> playerGames; // playerId -> gameId
    
    public UnoWebSocketServer() {
        super(new InetSocketAddress(PORT));
        this.gameManager = new GameManager();
        this.playerConnections = new ConcurrentHashMap<>();
        this.playerSockets = new ConcurrentHashMap<>();
        this.playerGames = new ConcurrentHashMap<>();
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        System.out.println("Nueva conexión: " + conn.getRemoteSocketAddress());
        
        // Enviar mensaje de bienvenida
        JSONObject welcome = new JSONObject();
        welcome.put("type", "connection");
        welcome.put("message", "Conectado al servidor UNO");
        welcome.put("timestamp", System.currentTimeMillis());
        
        conn.send(welcome.toString());
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        String playerId = playerConnections.get(conn);
        if (playerId != null) {
            System.out.println("Jugador desconectado: " + playerId);
            
            // Limpiar mapas
            playerConnections.remove(conn);
            playerSockets.remove(playerId);
            
            // Notificar a otros jugadores del juego
            String gameId = playerGames.get(playerId);
            if (gameId != null) {
                notifyGamePlayers(gameId, "player_disconnected", playerId);
                playerGames.remove(playerId);
            }
        }
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        try {
            JSONObject request = new JSONObject(message);
            String action = request.getString("action");
            
            System.out.println("Acción recibida: " + action);
            
            switch (action) {
                case "create_game":
                    handleCreateGame(conn, request);
                    break;
                case "join_game":
                    handleJoinGame(conn, request);
                    break;
                case "start_game":
                    handleStartGame(conn, request);
                    break;
                case "play_card":
                    handlePlayCard(conn, request);
                    break;
                case "draw_card":
                    handleDrawCard(conn, request);
                    break;
                case "choose_color":
                    handleChooseColor(conn, request);
                    break;
                case "get_game_state":
                    handleGetGameState(conn, request);
                    break;
                case "ping":
                    handlePing(conn);
                    break;
                default:
                    sendError(conn, "Acción no reconocida: " + action);
                    break;
            }
        } catch (Exception e) {
            System.err.println("Error procesando mensaje: " + e.getMessage());
            sendError(conn, "Error procesando solicitud: " + e.getMessage());
        }
    }

    @Override
    public void onError(WebSocket conn, Exception ex) {
        System.err.println("Error en WebSocket: " + ex.getMessage());
        ex.printStackTrace();
    }

    @Override
    public void onStart() {
        System.out.println("Servidor UNO WebSocket iniciado en puerto " + PORT);
        System.out.println("Acciones disponibles:");
        System.out.println("- create_game: Crear nuevo juego");
        System.out.println("- join_game: Unirse a un juego");
        System.out.println("- start_game: Iniciar juego");
        System.out.println("- play_card: Jugar una carta");
        System.out.println("- draw_card: Robar carta");
        System.out.println("- choose_color: Elegir color para comodín");
        System.out.println("- get_game_state: Obtener estado del juego");
        System.out.println("- ping: Health check");
    }

    private void handleCreateGame(WebSocket conn, JSONObject request) {
        try {
            String gameId = gameManager.createGame();
            
            JSONObject response = new JSONObject();
            response.put("type", "game_created");
            response.put("success", true);
            response.put("gameId", gameId);
            response.put("message", "Juego creado exitosamente");
            
            conn.send(response.toString());
        } catch (Exception e) {
            sendError(conn, "Error creando juego: " + e.getMessage());
        }
    }

    private void handleJoinGame(WebSocket conn, JSONObject request) {
        try {
            String gameId = request.getString("gameId");
            String playerId = request.getString("playerId");
            String playerName = request.getString("playerName");
            
            GameResponse gameResponse = gameManager.joinGame(gameId, playerId, playerName);
            
            if (gameResponse.isSuccess()) {
                // Registrar conexión del jugador
                playerConnections.put(conn, playerId);
                playerSockets.put(playerId, conn);
                playerGames.put(playerId, gameId);
                
                // Enviar respuesta al jugador
                JSONObject response = createGameResponse("player_joined", gameResponse);
                conn.send(response.toString());
                
                // Notificar a otros jugadores
                notifyOtherGamePlayers(gameId, playerId, "player_joined_game", playerName);
            } else {
                sendGameError(conn, "join_game_failed", gameResponse.getMessage());
            }
        } catch (Exception e) {
            sendError(conn, "Error uniéndose al juego: " + e.getMessage());
        }
    }

    private void handleStartGame(WebSocket conn, JSONObject request) {
        try {
            String gameId = request.getString("gameId");
            String playerId = request.getString("playerId");
            
            GameResponse gameResponse = gameManager.startGame(gameId, playerId);
            
            if (gameResponse.isSuccess()) {
                // Notificar a todos los jugadores que el juego ha comenzado
                notifyGamePlayers(gameId, "game_started", null);
                
                // Enviar estado inicial a todos los jugadores
                broadcastGameState(gameId);
            } else {
                sendGameError(conn, "start_game_failed", gameResponse.getMessage());
            }
        } catch (Exception e) {
            sendError(conn, "Error iniciando juego: " + e.getMessage());
        }
    }

    private void handlePlayCard(WebSocket conn, JSONObject request) {
        try {
            String playerId = request.getString("playerId");
            int cardIndex = request.getInt("cardIndex");
            
            Card.Color chosenColor = null;
            if (request.has("chosenColor") && !request.isNull("chosenColor")) {
                chosenColor = Card.Color.valueOf(request.getString("chosenColor"));
            }
            
            GameResponse gameResponse = gameManager.playCard(playerId, cardIndex, chosenColor);
            
            if (gameResponse.isSuccess()) {
                String gameId = playerGames.get(playerId);
                
                // Notificar a todos los jugadores sobre la jugada
                notifyGamePlayers(gameId, "card_played", playerId);
                
                // Enviar estado actualizado a todos
                broadcastGameState(gameId);
                
                // Verificar si el juego terminó
                if (gameResponse.getData().containsKey("winner")) {
                    notifyGamePlayers(gameId, "game_ended", gameResponse.getData().get("winner"));
                }
            } else {
                sendGameError(conn, "play_card_failed", gameResponse.getMessage());
            }
        } catch (Exception e) {
            sendError(conn, "Error jugando carta: " + e.getMessage());
        }
    }

    private void handleDrawCard(WebSocket conn, JSONObject request) {
        try {
            String playerId = request.getString("playerId");
            
            GameResponse gameResponse = gameManager.drawCard(playerId);
            
            if (gameResponse.isSuccess()) {
                String gameId = playerGames.get(playerId);
                
                // Notificar a todos los jugadores
                notifyGamePlayers(gameId, "card_drawn", playerId);
                
                // Enviar estado actualizado
                broadcastGameState(gameId);
            } else {
                sendGameError(conn, "draw_card_failed", gameResponse.getMessage());
            }
        } catch (Exception e) {
            sendError(conn, "Error robando carta: " + e.getMessage());
        }
    }

    private void handleChooseColor(WebSocket conn, JSONObject request) {
        try {
            String playerId = request.getString("playerId");
            Card.Color color = Card.Color.valueOf(request.getString("color"));
            
            GameResponse gameResponse = gameManager.chooseColor(playerId, color);
            
            if (gameResponse.isSuccess()) {
                String gameId = playerGames.get(playerId);
                
                // Notificar a todos los jugadores
                notifyGamePlayers(gameId, "color_chosen", color.toString());
                
                // Enviar estado actualizado
                broadcastGameState(gameId);
            } else {
                sendGameError(conn, "choose_color_failed", gameResponse.getMessage());
            }
        } catch (Exception e) {
            sendError(conn, "Error eligiendo color: " + e.getMessage());
        }
    }

    private void handleGetGameState(WebSocket conn, JSONObject request) {
        try {
            String playerId = request.getString("playerId");
            
            GameResponse gameResponse = gameManager.getGameState(playerId);
            
            if (gameResponse.isSuccess()) {
                JSONObject response = createGameResponse("game_state", gameResponse);
                conn.send(response.toString());
            } else {
                sendGameError(conn, "get_game_state_failed", gameResponse.getMessage());
            }
        } catch (Exception e) {
            sendError(conn, "Error obteniendo estado del juego: " + e.getMessage());
        }
    }

    private void handlePing(WebSocket conn) {
        JSONObject response = new JSONObject();
        response.put("type", "pong");
        response.put("status", "OK");
        response.put("activeGames", gameManager.getActiveGames().size());
        response.put("connectedPlayers", playerConnections.size());
        response.put("timestamp", System.currentTimeMillis());
        
        conn.send(response.toString());
    }

    private void notifyGamePlayers(String gameId, String eventType, Object data) {
        // Obtener todos los jugadores del juego
        Set<String> gamePlayers = getGamePlayers(gameId);
        
        JSONObject notification = new JSONObject();
        notification.put("type", eventType);
        notification.put("gameId", gameId);
        if (data != null) {
            notification.put("data", data);
        }
        notification.put("timestamp", System.currentTimeMillis());
        
        for (String playerId : gamePlayers) {
            WebSocket socket = playerSockets.get(playerId);
            if (socket != null && socket.isOpen()) {
                socket.send(notification.toString());
            }
        }
    }

    private void notifyOtherGamePlayers(String gameId, String excludePlayerId, String eventType, Object data) {
        Set<String> gamePlayers = getGamePlayers(gameId);
        
        JSONObject notification = new JSONObject();
        notification.put("type", eventType);
        notification.put("gameId", gameId);
        if (data != null) {
            notification.put("data", data);
        }
        notification.put("timestamp", System.currentTimeMillis());
        
        for (String playerId : gamePlayers) {
            if (!playerId.equals(excludePlayerId)) {
                WebSocket socket = playerSockets.get(playerId);
                if (socket != null && socket.isOpen()) {
                    socket.send(notification.toString());
                }
            }
        }
    }

    private void broadcastGameState(String gameId) {
        Set<String> gamePlayers = getGamePlayers(gameId);
        
        for (String playerId : gamePlayers) {
            GameResponse gameResponse = gameManager.getGameState(playerId);
            if (gameResponse.isSuccess()) {
                JSONObject response = createGameResponse("game_state_update", gameResponse);
                
                WebSocket socket = playerSockets.get(playerId);
                if (socket != null && socket.isOpen()) {
                    socket.send(response.toString());
                }
            }
        }
    }

    private Set<String> getGamePlayers(String gameId) {
        // Filtrar jugadores por gameId
        return playerGames.entrySet().stream()
            .filter(entry -> gameId.equals(entry.getValue()))
            .map(Map.Entry::getKey)
            .collect(java.util.stream.Collectors.toSet());
    }

    private JSONObject createGameResponse(String type, GameResponse gameResponse) {
        JSONObject response = new JSONObject();
        response.put("type", type);
        response.put("success", gameResponse.isSuccess());
        response.put("message", gameResponse.getMessage());
        
        if (gameResponse.getData() != null && !gameResponse.getData().isEmpty()) {
            JSONObject dataJson = new JSONObject();
            for (Map.Entry<String, Object> entry : gameResponse.getData().entrySet()) {
                dataJson.put(entry.getKey(), entry.getValue());
            }
            response.put("data", dataJson);
        }
        
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }

    private void sendError(WebSocket conn, String message) {
        JSONObject error = new JSONObject();
        error.put("type", "error");
        error.put("success", false);
        error.put("message", message);
        error.put("timestamp", System.currentTimeMillis());
        
        conn.send(error.toString());
    }

    private void sendGameError(WebSocket conn, String type, String message) {
        JSONObject error = new JSONObject();
        error.put("type", type);
        error.put("success", false);
        error.put("message", message);
        error.put("timestamp", System.currentTimeMillis());
        
        conn.send(error.toString());
    }

    public static void main(String[] args) {
        UnoWebSocketServer server = new UnoWebSocketServer();
        
        try {
            server.start();
            
            // Hook para detener el servidor
            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                System.out.println("Deteniendo servidor WebSocket...");
                try {
                    server.stop();
                } catch (Exception e) {
                    System.err.println("Error deteniendo servidor: " + e.getMessage());
                }
            }));
            
            // Mantener el servidor corriendo
            Thread.currentThread().join();
            
        } catch (Exception e) {
            System.err.println("Error al iniciar el servidor: " + e.getMessage());
            e.printStackTrace();
        }
    }
}