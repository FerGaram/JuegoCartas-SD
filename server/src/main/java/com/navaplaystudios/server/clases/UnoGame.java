package com.navaplaystudios.server.clases;

/**
 *
 * @author alber
 */
import java.util.*;

public class UnoGame {
    private static final int MAX_PLAYERS = 3;
    private static final int INITIAL_HAND_SIZE = 7;
    
    private String gameId;
    private List<Player> players;
    private Deck drawPile;
    private List<Card> discardPile;
    private GameState state;
    private int currentPlayerIndex;
    private boolean clockwise;
    private Player winner;
    private boolean waitingForColorChoice;
    private String colorChoicePlayerId;
    
    public UnoGame(String gameId) {
        this.gameId = gameId;
        this.players = new ArrayList<>();
        this.drawPile = new Deck();
        this.discardPile = new ArrayList<>();
        this.state = GameState.WAITING_FOR_PLAYERS;
        this.currentPlayerIndex = 0;
        this.clockwise = true;
        this.waitingForColorChoice = false;
    }
    
    public boolean addPlayer(Player player) {
        if (players.size() >= MAX_PLAYERS || state != GameState.WAITING_FOR_PLAYERS) {
            return false;
        }
        players.add(player);
        return true;
    }
    
    public void startGame() {
        if (players.size() < 2) {
            throw new IllegalStateException("Se necesitan al menos 2 jugadores");
        }
        
        // Repartir cartas iniciales
        for (Player player : players) {
            player.addCards(drawPile.drawCards(INITIAL_HAND_SIZE));
        }
        
        // Poner la primera carta en el descarte
        Card firstCard;
        do {
            firstCard = drawPile.drawCard();
        } while (firstCard.isWild()); // No empezar con comodín
        
        discardPile.add(firstCard);
        
        // Procesar efectos de la primera carta si es de acción
        processCardEffect(firstCard, null);
        
        state = GameState.IN_PROGRESS;
    }
    
    public boolean playCard(String playerId, int cardIndex, Card.Color chosenColor) {
        if (state != GameState.IN_PROGRESS || waitingForColorChoice) {
            return false;
        }
        
        Player currentPlayer = getCurrentPlayer();
        if (!currentPlayer.getId().equals(playerId)) {
            return false;
        }
        
        if (!currentPlayer.canPlayCard(cardIndex, getTopCard())) {
            return false;
        }
        
        Card playedCard = currentPlayer.playCard(cardIndex);
        discardPile.add(playedCard);
        
        // Si es carta comodín, establecer el color
        if (playedCard.isWild() && chosenColor != null) {
            playedCard.setColor(chosenColor);
        }
        
        // Verificar si el jugador ganó
        if (currentPlayer.hasWon()) {
            winner = currentPlayer;
            state = GameState.FINISHED;
            return true;
        }
        
        // Procesar efectos de la carta
        processCardEffect(playedCard, currentPlayer);
        
        // Pasar al siguiente jugador si no hay efectos pendientes
        if (!waitingForColorChoice) {
            nextTurn();
        }
        
        return true;
    }
    
    public boolean drawCard(String playerId) {
        if (state != GameState.IN_PROGRESS || waitingForColorChoice) {
            return false;
        }
        
        Player currentPlayer = getCurrentPlayer();
        if (!currentPlayer.getId().equals(playerId)) {
            return false;
        }
        
        // Verificar si el mazo está vacío
        if (drawPile.isEmpty()) {
            reshuffleDiscardPile();
        }
        
        if (!drawPile.isEmpty()) {
            Card drawnCard = drawPile.drawCard();
            currentPlayer.addCard(drawnCard);
            
            // Pasar turno después de robar
            nextTurn();
            return true;
        }
        
        return false;
    }
    
    public boolean chooseColor(String playerId, Card.Color color) {
        if (!waitingForColorChoice || !colorChoicePlayerId.equals(playerId)) {
            return false;
        }
        
        Card topCard = getTopCard();
        topCard.setColor(color);
        
        waitingForColorChoice = false;
        colorChoicePlayerId = null;
        
        nextTurn();
        return true;
    }
    
    private void processCardEffect(Card card, Player player) {
        switch (card.getType()) {
            case SKIP:
                nextTurn(); // Saltar el siguiente jugador
                break;
                
            case REVERSE:
                if (players.size() == 2) {
                    nextTurn(); // En 2 jugadores, reverse actúa como skip
                } else {
                    clockwise = !clockwise;
                }
                break;
                
            case DRAW_TWO:
                nextTurn();
                Player nextPlayer = getCurrentPlayer();
                nextPlayer.addCards(drawPile.drawCards(2));
                break;
                
            case WILD:
                if (player != null) {
                    waitingForColorChoice = true;
                    colorChoicePlayerId = player.getId();
                }
                break;
                
            case WILD_DRAW_FOUR:
                if (player != null) {
                    waitingForColorChoice = true;
                    colorChoicePlayerId = player.getId();
                    nextTurn();
                    Player nextPlayerForDraw = getCurrentPlayer();
                    nextPlayerForDraw.addCards(drawPile.drawCards(4));
                }
                break;
        }
    }
    
    private void nextTurn() {
        if (clockwise) {
            currentPlayerIndex = (currentPlayerIndex + 1) % players.size();
        } else {
            currentPlayerIndex = (currentPlayerIndex - 1 + players.size()) % players.size();
        }
    }
    
    private void reshuffleDiscardPile() {
        if (discardPile.size() <= 1) return;
        
        Card topCard = discardPile.remove(discardPile.size() - 1);
        drawPile.addCards(discardPile);
        discardPile.clear();
        discardPile.add(topCard);
        drawPile.shuffle();
    }
    
    // Getters
    public String getGameId() { return gameId; }
    public List<Player> getPlayers() { return players; }
    public GameState getState() { return state; }
    public Player getCurrentPlayer() { 
        return players.isEmpty() ? null : players.get(currentPlayerIndex); 
    }
    public Card getTopCard() { 
        return discardPile.isEmpty() ? null : discardPile.get(discardPile.size() - 1); 
    }
    public Player getWinner() { return winner; }
    public boolean isWaitingForColorChoice() { return waitingForColorChoice; }
    public String getColorChoicePlayerId() { return colorChoicePlayerId; }
    public boolean isFull() { return players.size() >= MAX_PLAYERS; }
    public int getDrawPileSize() { return drawPile.size(); }
}
