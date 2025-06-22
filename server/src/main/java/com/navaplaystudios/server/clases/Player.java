package com.navaplaystudios.server.clases;

/**
 *
 * @author alber
 */
import java.util.*;

public class Player {
    private String id;
    private String name;
    private List<Card> hand;
    private boolean isConnected;
    
    public Player(String id, String name) {
        this.id = id;
        this.name = name;
        this.hand = new ArrayList<>();
        this.isConnected = true;
    }
    
    public String getId() { return id; }
    public String getName() { return name; }
    public List<Card> getHand() { return hand; }
    public boolean isConnected() { return isConnected; }
    public void setConnected(boolean connected) { this.isConnected = connected; }
    
    public void addCard(Card card) {
        hand.add(card);
    }
    
    public void addCards(List<Card> cards) {
        hand.addAll(cards);
    }
    
    public Card playCard(int index) {
        if (index >= 0 && index < hand.size()) {
            return hand.remove(index);
        }
        return null;
    }
    
    public boolean hasWon() {
        return hand.isEmpty();
    }
    
    public int getHandSize() {
        return hand.size();
    }
    
    public boolean canPlayCard(int cardIndex, Card topCard) {
        if (cardIndex < 0 || cardIndex >= hand.size()) {
            return false;
        }
        return hand.get(cardIndex).canPlayOn(topCard);
    }
}