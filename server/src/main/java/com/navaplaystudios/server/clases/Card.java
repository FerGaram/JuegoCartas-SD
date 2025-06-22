package com.navaplaystudios.server.clases;

/**
 *
 * @author alber
 */
public class Card {
    public enum Color {
        RED, BLUE, GREEN, YELLOW, WILD
    }
    
    public enum Type {
        ZERO, ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE,
        SKIP, REVERSE, DRAW_TWO, WILD, WILD_DRAW_FOUR
    }
    
    private Color color;
    private Type type;
    
    public Card(Color color, Type type) {
        this.color = color;
        this.type = type;
    }
    
    public Color getColor() { return color; }
    public Type getType() { return type; }
    public void setColor(Color color) { this.color = color; }
    
    public boolean canPlayOn(Card other) {
        if (this.type == Type.WILD || this.type == Type.WILD_DRAW_FOUR) {
            return true;
        }
        return this.color == other.color || this.type == other.type;
    }
    
    public boolean isWild() {
        return type == Type.WILD || type == Type.WILD_DRAW_FOUR;
    }
    
    @Override
    public String toString() {
        return color + "_" + type;
    }
}
