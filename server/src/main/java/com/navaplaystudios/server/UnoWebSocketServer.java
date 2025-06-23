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
import java.util.UUID;

public class UnoWebSocketServer extends WebSocketServer {
    private static final int PORT = 8080;
    private GameManager gameManager;
    private Map<WebSocket, String> playerConnections; // WebSocket -> playerId
    private Map<String, WebSocket> playerSockets; // playerId -> WebSocket
    private Map<String, String> playerGames; // playerId -> gameId
    private Map<String, GameInfo> gameInfos; // gameId -> GameInfo (para el frontend)

    // Clase para almacenar información del juego para el frontend
    private static class GameInfo {
        public String gameId;
        public String roomName;
        public String hostPlayerId;
        public String hostPlayerName;
        public int maxPlayers;
        public int currentPlayers;
        public String status; // "waiting", "full", "playing"
        public long createdAt;

        public GameInfo(String gameId, String roomName, String hostPlayerId, String hostPlayerName, int maxPlayers) {
            this.gameId = gameId;
            this.roomName = roomName;
            this.hostPlayerId = hostPlayerId;
            this.hostPlayerName = hostPlayerName;
            this.maxPlayers = maxPlayers;
            this.currentPlayers = 0;
            this.status = "waiting";
            this.createdAt = System.currentTimeMillis();
        }
    }

    public UnoWebSocketServer() {
        super(new InetSocketAddress(PORT));
        this.gameManager = new GameManager();
        this.playerConnections = new ConcurrentHashMap<>();
        this.playerSockets = new ConcurrentHashMap<>();
        this.playerGames = new ConcurrentHashMap<>();
        this.gameInfos = new ConcurrentHashMap<>();
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
                // Actualizar contador de jugadores
                GameInfo gameInfo = gameInfos.get(gameId);
                if (gameInfo != null) {
                    gameInfo.currentPlayers = Math.max(0, gameInfo.currentPlayers - 1);
                    updateGameStatus(gameInfo);
                }

                notifyGamePlayers(gameId, "player_disconnected", playerId);
                playerGames.remove(playerId);

                // Si era el host y no hay más jugadores, eliminar el juego
                if (gameInfo != null && gameInfo.hostPlayerId.equals(playerId) && gameInfo.currentPlayers == 0) {
                    gameInfos.remove(gameId);
                    System.out.println("Juego eliminado: " + gameId + " (host desconectado)");
                }
            }
        }
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        try {
            JSONObject request = new JSONObject(message);
            String action = request.getString("action");

            System.out.println("Acción recibida: '" + action + "'"); // ← IMPORTANTE: Ver si hay espacios extra
            System.out.println("Mensaje completo: " + message); // ← Para debug

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
                case "list_games":
                    handleListGames(conn);
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
        System.out.println("- list_games: Listar juegos disponibles");
        System.out.println("- ping: Health check");
    }

    private void handleCreateGame(WebSocket conn, JSONObject request) {
        try {
            // Generar un gameId único
            String gameId = UUID.randomUUID().toString().substring(0, 8);

            // Valores por defecto si no se proporcionan en el request
            String roomName = request.optString("roomName", "Sala de " + gameId);
            String hostPlayerId = request.optString("hostPlayerId", "host_" + System.currentTimeMillis());
            String hostPlayerName = request.optString("hostPlayerName", "Host");
            int maxPlayers = request.optInt("maxPlayers", 4);

            // Crear el juego en el GameManager
            String actualGameId = gameManager.createGame();

            // Crear información del juego para el frontend
            GameInfo gameInfo = new GameInfo(actualGameId, roomName, hostPlayerId, hostPlayerName, maxPlayers);
            gameInfos.put(actualGameId, gameInfo);

            System.out.println("Juego creado: " + actualGameId + " por " + hostPlayerName);

            JSONObject response = new JSONObject();
            response.put("type", "game_created");
            response.put("success", true);
            response.put("gameId", actualGameId);
            response.put("message", "Juego creado exitosamente");
            response.put("roomName", roomName);
            response.put("hostPlayerName", hostPlayerName);
            response.put("maxPlayers", maxPlayers);

            conn.send(response.toString());

        } catch (Exception e) {
            System.err.println("Error creando juego: " + e.getMessage());
            sendGameError(conn, "game_created_failed", "Error creando juego: " + e.getMessage());
        }
    }

    private void handleJoinGame(WebSocket conn, JSONObject request) {
        try {
            String gameId = request.getString("gameId");
            String playerId = request.getString("playerId");
            String playerName = request.getString("playerName");

            GameInfo gameInfo = gameInfos.get(gameId);
            if (gameInfo == null) {
                sendGameError(conn, "join_game_failed", "El juego no existe");
                return;
            }

            // ... validaciones existentes ...

            GameResponse gameResponse = gameManager.joinGame(gameId, playerId, playerName);

            if (gameResponse.isSuccess()) {
                // Registrar conexión del jugador
                playerConnections.put(conn, playerId);
                playerSockets.put(playerId, conn);
                playerGames.put(playerId, gameId);

                // Actualizar información del juego
                gameInfo.currentPlayers++;
                updateGameStatus(gameInfo);

                System.out.println("Jugador " + playerName + " se unió al juego " + gameId);

                // Enviar respuesta al jugador
                JSONObject response = createGameResponse("player_joined", gameResponse);
                response.put("gameId", gameId);
                response.put("currentPlayers", gameInfo.currentPlayers);
                response.put("maxPlayers", gameInfo.maxPlayers);
                conn.send(response.toString());

                // ✅ NUEVO: Enviar estado actualizado a TODOS los jugadores
                broadcastGameState(gameId);

                // Notificar a otros jugadores
                notifyOtherGamePlayers(gameId, playerId, "player_joined_game", playerName);

            } else {
                sendGameError(conn, "join_game_failed", gameResponse.getMessage());
            }
        } catch (Exception e) {
            System.err.println("Error uniéndose al juego: " + e.getMessage());
            sendGameError(conn, "join_game_failed", "Error uniéndose al juego: " + e.getMessage());
        }
    }

    private void handleStartGame(WebSocket conn, JSONObject request) {
        try {
            String gameId = request.getString("gameId");
            String playerId = request.getString("playerId");

            GameInfo gameInfo = gameInfos.get(gameId);
            if (gameInfo == null) {
                sendGameError(conn, "start_game_failed", "El juego no existe");
                return;
            }

            // ... validaciones existentes ...

            GameResponse gameResponse = gameManager.startGame(gameId, playerId);

            if (gameResponse.isSuccess()) {
                gameInfo.status = "playing";

                System.out.println("Juego iniciado: " + gameId);

                // Notificar a todos los jugadores que el juego ha comenzado
                notifyGamePlayers(gameId, "game_started", null);

                // ✅ NUEVO: Enviar estado inicial a todos los jugadores INMEDIATAMENTE
                broadcastGameState(gameId);

            } else {
                sendGameError(conn, "start_game_failed", gameResponse.getMessage());
            }
        } catch (Exception e) {
            System.err.println("Error iniciando juego: " + e.getMessage());
            sendGameError(conn, "start_game_failed", "Error iniciando juego: " + e.getMessage());
        }
    }

    private void handleListGames(WebSocket conn) {
        try {
            JSONArray gamesList = new JSONArray();

            for (GameInfo gameInfo : gameInfos.values()) {
                JSONObject game = new JSONObject();
                game.put("gameId", gameInfo.gameId);
                game.put("roomName", gameInfo.roomName);
                game.put("hostPlayerName", gameInfo.hostPlayerName);
                game.put("currentPlayers", gameInfo.currentPlayers);
                game.put("maxPlayers", gameInfo.maxPlayers);
                game.put("status", gameInfo.status);
                game.put("createdAt", gameInfo.createdAt);

                gamesList.put(game);
            }

            JSONObject response = new JSONObject();
            response.put("type", "games_list");
            response.put("success", true);

            JSONObject data = new JSONObject();
            data.put("games", gamesList);
            response.put("data", data);

            response.put("timestamp", System.currentTimeMillis());

            conn.send(response.toString());

            System.out.println("Lista de juegos enviada: " + gamesList.length() + " juegos");

        } catch (Exception e) {
            System.err.println("Error listando juegos: " + e.getMessage());
            sendError(conn, "Error listando juegos: " + e.getMessage());
        }
    }

    private void updateGameStatus(GameInfo gameInfo) {
        if (gameInfo.currentPlayers >= gameInfo.maxPlayers && !"playing".equals(gameInfo.status)) {
            gameInfo.status = "full";
        } else if (gameInfo.currentPlayers < gameInfo.maxPlayers && "full".equals(gameInfo.status)) {
            gameInfo.status = "waiting";
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

                // ✅ NUEVO: Enviar estado actualizado INMEDIATAMENTE
                broadcastGameState(gameId);

                // Verificar si el juego terminó
                if (gameResponse.getData().containsKey("winner")) {
                    GameInfo gameInfo = gameInfos.get(gameId);
                    if (gameInfo != null) {
                        gameInfo.status = "finished";
                    }
                    notifyGamePlayers(gameId, "game_ended", gameResponse.getData().get("winner"));
                }
            } else {
                sendGameError(conn, "play_card_failed", gameResponse.getMessage());
            }
        } catch (Exception e) {
            System.err.println("Error jugando carta: " + e.getMessage());
            sendGameError(conn, "play_card_failed", "Error jugando carta: " + e.getMessage());
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

                // ✅ NUEVO: Enviar estado actualizado INMEDIATAMENTE
                broadcastGameState(gameId);

            } else {
                sendGameError(conn, "draw_card_failed", gameResponse.getMessage());
            }
        } catch (Exception e) {
            System.err.println("Error robando carta: " + e.getMessage());
            sendGameError(conn, "draw_card_failed", "Error robando carta: " + e.getMessage());
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

                // ✅ NUEVO: Enviar estado actualizado INMEDIATAMENTE
                broadcastGameState(gameId);

            } else {
                sendGameError(conn, "choose_color_failed", gameResponse.getMessage());
            }
        } catch (Exception e) {
            System.err.println("Error eligiendo color: " + e.getMessage());
            sendGameError(conn, "choose_color_failed", "Error eligiendo color: " + e.getMessage());
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
            System.err.println("Error obteniendo estado del juego: " + e.getMessage());
            sendGameError(conn, "get_game_state_failed", "Error obteniendo estado del juego: " + e.getMessage());
        }
    }

    private void handlePing(WebSocket conn) {
        JSONObject response = new JSONObject();
        response.put("type", "pong");
        response.put("status", "OK");
        response.put("activeGames", gameInfos.size());
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