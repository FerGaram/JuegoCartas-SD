export interface Theme {
    id: string;
    name: string;
    color: string;
    cardColor: string;
    icon: string;
    pattern: string;
    description: string;
}

export interface GameConfig {
    players: number;
    difficulty: 'easy' | 'medium' | 'hard';
    rules: string;
    maxScore: number;
}

export interface Card {
    id: string;
    color: 'red' | 'blue' | 'green' | 'yellow' | 'wild';
    type: 'number' | 'action' | 'wild';
    value: string | number;
    theme: Theme;
}

export interface Player {
    id: string;
    name: string;
    cards: Card[];
    isHuman: boolean;
}

export interface GameState {
    players: Player[];
    currentPlayer: number;
    deck: Card[];
    discardPile: Card[];
    direction: 1 | -1;
    isGameOver: boolean;
    winner: Player | null;
}