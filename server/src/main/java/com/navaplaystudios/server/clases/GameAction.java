package com.navaplaystudios.server.clases;

/**
 *
 * @author alber
 */
public class GameAction {
    public enum Type {
        PLAY_CARD, DRAW_CARD, CHOOSE_COLOR, SAY_UNO
    }
    
    private Type type;
    private String playerId;
    private int cardIndex;
    private Card.Color chosenColor;
    
    public GameAction(Type type, String playerId) {
        this.type = type;
        this.playerId = playerId;
    }
    
    public GameAction(Type type, String playerId, int cardIndex) {
        this.type = type;
        this.playerId = playerId;
        this.cardIndex = cardIndex;
    }
    
    public GameAction(Type type, String playerId, Card.Color chosenColor) {
        this.type = type;
        this.playerId = playerId;
        this.chosenColor = chosenColor;
    }
    
    // Getters
    public Type getType() { return type; }
    public String getPlayerId() { return playerId; }
    public int getCardIndex() { return cardIndex; }
    public Card.Color getChosenColor() { return chosenColor; }
}
