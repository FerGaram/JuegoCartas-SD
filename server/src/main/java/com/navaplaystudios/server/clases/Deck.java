package com.navaplaystudios.server.clases;

/**
 *
 * @author alber
 */
import java.util.*;

public class Deck {
    private List<Card> cards;
    private Random random;
    
    public Deck() {
        this.cards = new ArrayList<>();
        this.random = new Random();
        initializeDeck();
        shuffle();
    }
    
    private void initializeDeck() {
        // Cartas numericas (0-9) para cada color
        for (Card.Color color : Arrays.asList(Card.Color.RED, Card.Color.BLUE, 
                                            Card.Color.GREEN, Card.Color.YELLOW)) {
            // Un 0 por color
            cards.add(new Card(color, Card.Type.ZERO));
            
            // Dos cartas de cada número del 1-9 por color
            for (Card.Type type : Arrays.asList(Card.Type.ONE, Card.Type.TWO, Card.Type.THREE,
                                              Card.Type.FOUR, Card.Type.FIVE, Card.Type.SIX,
                                              Card.Type.SEVEN, Card.Type.EIGHT, Card.Type.NINE)) {
                cards.add(new Card(color, type));
                cards.add(new Card(color, type));
            }
            
            // Cartas de acción (2 de cada una por color)
            cards.add(new Card(color, Card.Type.SKIP));
            cards.add(new Card(color, Card.Type.SKIP));
            cards.add(new Card(color, Card.Type.REVERSE));
            cards.add(new Card(color, Card.Type.REVERSE));
            cards.add(new Card(color, Card.Type.DRAW_TWO));
            cards.add(new Card(color, Card.Type.DRAW_TWO));
        }
        
        // Cartas comodín (4 de cada tipo)
        for (int i = 0; i < 4; i++) {
            cards.add(new Card(Card.Color.WILD, Card.Type.WILD));
            cards.add(new Card(Card.Color.WILD, Card.Type.WILD_DRAW_FOUR));
        }
    }
    
    public void shuffle() {
        Collections.shuffle(cards, random);
    }
    
    public Card drawCard() {
        if (cards.isEmpty()) {
            return null;
        }
        return cards.remove(cards.size() - 1);
    }
    
    public List<Card> drawCards(int count) {
        List<Card> drawnCards = new ArrayList<>();
        for (int i = 0; i < count && !cards.isEmpty(); i++) {
            drawnCards.add(drawCard());
        }
        return drawnCards;
    }
    
    public boolean isEmpty() {
        return cards.isEmpty();
    }
    
    public int size() {
        return cards.size();
    }
    
    public void addCard(Card card) {
        cards.add(card);
    }
    
    public void addCards(List<Card> cardsToAdd) {
        cards.addAll(cardsToAdd);
    }
}