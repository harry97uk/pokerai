class AIPokerGame {
    constructor(ai1, ai2) {
        this.player1 = ai1
        this.player2 = ai2
    }

    playGame() {
        //console.log(this.player1, this.player2);
        let winner = startGame(this.player1, this.player2)
        return winner
    }
}


// initialize deck of cards
let deck = [];
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
const ranks = ['High Card', 'One Pair', 'Two Pair', 'Three of a Kind', 'Straight', 'Flush', 'Full House', 'Four of a Kind', 'Straight Flush', 'Royal Flush', '']

function resetAndShuffleDeck() {
    deck = [];
    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push({ value: values[j], suit: suits[i] });
        }
    }
    // shuffle the deck
    function shuffle(cards) {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }

    for (let n = 0; n < 3; n++) {
        shuffle(deck)
    }
}

resetAndShuffleDeck()


// initialize players
let aiplayer1
let aiplayer2

const startingChips = 100
let player1 = { name: 'Player 1', ai: aiplayer1, hand: [], chips: startingChips, currentBet: 0, inHand: false, matchedBet: false };
let player2 = { name: 'Player 2', ai: aiplayer2, hand: [], chips: startingChips, currentBet: 0, inHand: false, matchedBet: false };

const players = [player1, player2];

let dealer = 0; // index of the dealer
let currentStartingPlayer = players.length - 1
let currentPlayer = 0; //who's go it is
let roundNum = 0

let endRound = false
let pot = 0

let dealt = false
let hasFlop = false
let hasTurn = false
let hasRiver = false
let cCards = []

function determineStartingPlayer() {
    if (currentStartingPlayer == players.length - 1) {
        currentStartingPlayer = 0
    } else {
        currentStartingPlayer++
    }
}

function startGame(ai1, ai2) {
    //console.log("game started", ai1, ai2);
    player1.ai = ai1
    player2.ai = ai2
    while (!shouldGameEnd()) {
        resetAndShuffleDeck()
        playRound()
        endingRound()
    }
    players.sort(function (a, b) {
        return b.chips - a.chips
    })
    //console.log('Total rounds played = ', roundNum);
    return players[0].ai
}

function shouldGameEnd() {
    return (players.some(p => p.chips == startingChips * players.length)) || roundNum == 1000
}

function playRound() {
    roundNum++
    determineStartingPlayer()
    currentPlayer = currentStartingPlayer
    //kepp playing round till a winner is decided
    while (!shouldRoundEnd()) {
        // if betting is still continuing, do not make the next play i.e deal flop, etc
        if (players.every(p => p.matchedBet || !p.inHand)) {
            nextPlay()
            for (let i = 0; i < players.length; i++) {
                players[i].currentBet = 0
                players[i].matchedBet = false
            }
            currentPlayer = currentStartingPlayer
        }
        if (!endRound) {
            startTurn(currentPlayer)
            endTurn()
        }
    }
}

function endingRound() {
    determineWinner(false)
    dealt = false
    hasFlop = false
    hasTurn = false
    hasRiver = false
    inRound = false
    endRound = false
    updatePot(0, true)
    resetAndShuffleDeck()
    for (let i = 0; i < players.length; i++) {
        players[i].hand = []
        players[i].matchedBet = false
        players[i].inHand = false
        players[i].currentBet = 0
        currentMinimumBet = 0
    }
}

function startTurn(playerIndex) {
    currentPlayer = playerIndex;
    enablePlayerActions(currentPlayer); // Enable this player's action buttons
}

// Function to end a player's turn and move on to the next player
function endTurn() {
    disablePlayerActions(currentPlayer); // Disable this player's action buttons
    currentPlayer = (currentPlayer + 1) % players.length; // Move on to the next player
}

function shouldRoundEnd() {
    let playerCounter = 0
    for (let i = 0; i < players.length; i++) {
        if (players[i].inHand) {
            playerCounter++
        }
    }
    if (playerCounter < 2) {
        return true
    }

    return false
}

// deal two cards to each player
function nextPlay() {
    currentMinimumBet = 0
    if (!dealt) {
        deal()
        dealt = true
    } else if (!hasFlop) {
        dealFlop()
        hasFlop = true
    } else if (!hasTurn) {
        dealTurn()
        hasTurn = true
    } else if (!hasRiver) {
        dealRiver()
        hasRiver = true
    } else {
        endRound = true
    }
}

function deal() {
    for (let i = 0; i < players.length; i++) {
        players[i].hand.push(deck.pop());
        players[i].hand.push(deck.pop());
        players[i].inHand = true
    }
}

// deal the flop (first three community cards)
function dealFlop() {
    deck.pop(); // burn a card
    const flop = [];
    for (let i = 0; i < 3; i++) {
        let c = deck.pop()
        flop.push(c);
        for (let i = 0; i < players.length; i++) {
            players[i].hand.push(c);
        }
    }
    let card1 = flop[0].value + flop[0].suit
    let card2 = flop[1].value + flop[1].suit
    let card3 = flop[2].value + flop[2].suit
    cCards = [card1, card2, card3]
}

// deal the turn (fourth community card)
function dealTurn() {
    deck.pop(); // burn a card
    const turn = deck.pop();
    for (let i = 0; i < players.length; i++) {
        players[i].hand.push(turn);
    }
    let card = turn.value + turn.suit
    cCards.push(card)
}

// deal the river (fifth and final community card)
function dealRiver() {
    deck.pop(); // burn a card
    const river = deck.pop();
    for (let i = 0; i < players.length; i++) {
        players[i].hand.push(river);
    }
    let card = river.value + river.suit
    cCards.push(card)
}

// determine the winner
function determineWinner(showdown = true) {
    let bestHand = null;
    let winner = null;
    let winnerNum = null
    let winningRank = null;
    for (let i = 0; i < players.length; i++) {
        disablePlayerActions(i)
        const hand = players[i].hand
        let rank = -1
        if (players[i].inHand) {
            if (!showdown) {
                rank = 140
            } else {
                rank = evaluateHand(hand);
            }
        }
        if (bestHand === null || rank > bestHand) {
            bestHand = rank;
            winner = players[i];
            winnerNum = i
            winningRank = ranks[Math.floor(rank / 14)];
        } else if (rank === bestHand) {
            // handle ties
            winner = null;
        }
    }
    if (winner !== null) {
        updateChips(pot, winnerNum)
    } else {
        for (let i = 0; i < players.length; i++) {
            updateChips(pot / players.length, i)
        }
    }
}

function updateChips(amount, playerNum) {
    players[playerNum].chips += amount
}

function updatePot(amount, reset = false) {
    if (reset) {
        pot = 0
    } else {
        pot += amount
    }
}
