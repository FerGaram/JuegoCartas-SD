package com.navaplaystudios.server.clases;

/**
 *
 * @author alber
 */
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class GameManager {
    private Map<String, UnoGame> games;
    private Map<String, String> playerToGame; // playerId -> gameId
    
    public GameManager() {
        this.games = new ConcurrentHashMap<>();
        this.playerToGame = new ConcurrentHashMap<>();
    }
    
    public synchronized String createGame() {
        String gameId = generateGameId();
        UnoGame game = new UnoGame(gameId);
        games.put(gameId, game);
        return gameId;
    }
    
    public GameResponse joinGame(String gameId, String playerId, String playerName) {
        UnoGame game = games.get(gameId);
        if (game == null) {
            return new GameResponse(false, "Juego no encontrado");
        }
        
        if (game.isFull()) {
            return new GameResponse(false, "El juego está lleno");
        }
        
        if (game.getState() != GameState.WAITING_FOR_PLAYERS) {
            return new GameResponse(false, "El juego ya comenzó");
        }
        
        Player player = new Player(playerId, playerName);
        if (game.addPlayer(player)) {
            playerToGame.put(playerId, gameId);
            
            Map<String, Object> data = new HashMap<>();
            data.put("gameId", gameId);
            data.put("playerId", playerId);
            data.put("playerCount", game.getPlayers().size());
            
            return new GameResponse(true, "Unido al juego exitosamente", data);
        }
        
        return new GameResponse(false, "No se pudo unir al juego");
    }
    
    public GameResponse startGame(String gameId, String playerId) {
        UnoGame game = games.get(gameId);
        if (game == null) {
            return new GameResponse(false, "Juego no encontrado");
        }
        
        if (game.getPlayers().size() < 2) {
            return new GameResponse(false, "Se necesitan al menos 2 jugadores");
        }
        
        try {
            game.startGame();
            return new GameResponse(true, "Juego iniciado");
        } catch (Exception e) {
            return new GameResponse(false, "Error al iniciar el juego: " + e.getMessage());
        }
    }
    
    public GameResponse playCard(String playerId, int cardIndex, Card.Color chosenColor) {
        String gameId = playerToGame.get(playerId);
        if (gameId == null) {
            return new GameResponse(false, "Jugador no está en ningún juego");
        }
        
        UnoGame game = games.get(gameId);
        if (game == null) {
            return new GameResponse(false, "Juego no encontrado");
        }
        
        if (game.playCard(playerId, cardIndex, chosenColor)) {
            return new GameResponse(true, "Carta jugada exitosamente");
        }
        
        return new GameResponse(false, "No se pudo jugar la carta");
    }
    
    public GameResponse drawCard(String playerId) {
        String gameId = playerToGame.get(playerId);
        if (gameId == null) {
            return new GameResponse(false, "Jugador no está en ningún juego");
        }
        
        UnoGame game = games.get(gameId);
        if (game == null) {
            return new GameResponse(false, "Juego no encontrado");
        }
        
        if (game.drawCard(playerId)) {
            return new GameResponse(true, "Carta robada exitosamente");
        }
        
        return new GameResponse(false, "No se pudo robar carta");
    }
    
    public GameResponse chooseColor(String playerId, Card.Color color) {
        String gameId = playerToGame.get(playerId);
        if (gameId == null) {
            return new GameResponse(false, "Jugador no está en ningún juego");
        }
        
        UnoGame game = games.get(gameId);
        if (game == null) {
            return new GameResponse(false, "Juego no encontrado");
        }
        
        if (game.chooseColor(playerId, color)) {
            return new GameResponse(true, "Color elegido exitosamente");
        }
        
        return new GameResponse(false, "No se pudo elegir el color");
    }
    
    public GameResponse getGameState(String playerId) {
        String gameId = playerToGame.get(playerId);
        if (gameId == null) {
            return new GameResponse(false, "Jugador no está en ningún juego");
        }
        
        UnoGame game = games.get(gameId);
        if (game == null) {
            return new GameResponse(false, "Juego no encontrado");
        }
        
        Map<String, Object> gameState = buildGameState(game, playerId);
        return new GameResponse(true, "Estado del juego", gameState);
    }
    
    private Map<String, Object> buildGameState(UnoGame game, String playerId) {
        Map<String, Object> state = new HashMap<>();
        
        state.put("gameId", game.getGameId());
        state.put("gameState", game.getState().toString());
        state.put("drawPileSize", game.getDrawPileSize());
        state.put("topCard", game.getTopCard() != null ? game.getTopCard().toString() : null);
        
        // Información de jugadores
        List<Map<String, Object>> playersInfo = new ArrayList<>();
        for (Player player : game.getPlayers()) {
            Map<String, Object> playerInfo = new HashMap<>();
            playerInfo.put("id", player.getId());
            playerInfo.put("name", player.getName());
            playerInfo.put("handSize", player.getHandSize());
            playerInfo.put("isConnected", player.isConnected());
            
            // Solo enviar las cartas al propio jugador
            if (player.getId().equals(playerId)) {
                List<String> hand = new ArrayList<>();
                for (Card card : player.getHand()) {
                    hand.add(card.toString());
                }
                playerInfo.put("hand", hand);
            }
            
            playersInfo.add(playerInfo);
        }
        state.put("players", playersInfo);
        
        // Turno actual
        Player currentPlayer = game.getCurrentPlayer();
        if (currentPlayer != null) {
            state.put("currentPlayer", currentPlayer.getId());
            state.put("isMyTurn", currentPlayer.getId().equals(playerId));
        }
        
        // Estado de elección de color
        state.put("waitingForColorChoice", game.isWaitingForColorChoice());
        if (game.isWaitingForColorChoice()) {
            state.put("colorChoicePlayer", game.getColorChoicePlayerId());
            state.put("shouldChooseColor", game.getColorChoicePlayerId().equals(playerId));
        }
        
        // Ganador
        if (game.getWinner() != null) {
            state.put("winner", game.getWinner().getId());
            state.put("winnerName", game.getWinner().getName());
        }
        
        return state;
    }
    
    public void removePlayer(String playerId) {
        String gameId = playerToGame.remove(playerId);
        if (gameId != null) {
            UnoGame game = games.get(gameId);
            if (game != null) {
                // Marcar jugador como desconectado
                for (Player player : game.getPlayers()) {
                    if (player.getId().equals(playerId)) {
                        player.setConnected(false);
                        break;
                    }
                }
                
                // Si todos los jugadores se desconectaron, eliminar el juego
                boolean allDisconnected = game.getPlayers().stream()
                    .allMatch(p -> !p.isConnected());
                if (allDisconnected) {
                    games.remove(gameId);
                }
            }
        }
    }
    
    private String generateGameId() {
        return "GAME_" + System.currentTimeMillis() + "_" + (int)(Math.random() * 1000);
    }
    
    public UnoGame getGame(String gameId) {
        return games.get(gameId);
    }
    
    public Set<String> getActiveGames() {
        return games.keySet();
    }
}
