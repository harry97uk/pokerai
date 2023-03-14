// initialize deck of cards
let deck = [];
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
const ranks = ['High Card', 'One Pair', 'Two Pair', 'Three of a Kind', 'Straight', 'Flush', 'Full House', 'Four of a Kind', 'Straight Flush', 'Royal Flush']

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

shuffle(deck)

// initialize players
const player1 = { name: 'Player 1', hand: [], chips: 100 };
const player2 = { name: 'Player 2', hand: [], chips: 100 };
const players = [player1, player2];
let dealer = 0; // index of the dealer

let dealt = false
let hasFlop = false
let hasTurn = false
let hasRiver = false
let cCards = []


// deal two cards to each player
function nextPlay() {
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
    determineWinner()
  }

}

function deal() {
  for (let i = 0; i < players.length; i++) {
    players[i].hand.push(deck.pop());
    players[i].hand.push(deck.pop());
  }
  getPlayer1Hand()
  getOtherPlayerHands()
  // print each player's hand
  for (let i = 0; i < players.length; i++) {
    console.log(players[i].name + "'s hand:");
    console.log(players[i].hand);
  }
}

function getPlayer1Hand() {
  let card1 = player1.hand[0].value + player1.hand[0].suit
  let card2 = player1.hand[1].value + player1.hand[1].suit
  const playerCards = new Cards([card1, card2])
  playerCards.renderPlayerCards("div.player-area.player-1", 1)
}

function getOtherPlayerHands() {
  const playerCards = new Cards(["UK", "UK"])
  playerCards.renderPlayerCards("div.player-area.player-2", 2)
}

function showOtherPlayerHands() {
  let card1 = player2.hand[0].value + player2.hand[0].suit
  let card2 = player2.hand[1].value + player2.hand[1].suit
  const playerCards = new Cards([card1, card2])
  playerCards.renderPlayerCardsReplace("div.player-area.player-2", 2)
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
  let flopCards = new Cards([card1, card2, card3])
  flopCards.renderCommunityCardReplace(1)
  console.log('The flop:');
  console.log(flop);
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
  let turnCard = new Cards([card])
  turnCard.renderCommunityCardReplace(2)
  console.log('The turn:');
  console.log(turn);
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
  let riverCard = new Cards([card])
  riverCard.renderCommunityCardReplace(3)
  console.log('The river:');
  console.log(river);
}


// determine the winner
function determineWinner() {
  showOtherPlayerHands()
  let bestHand = null;
  let winner = null;
  let winningRank = null;
  for (let i = 0; i < players.length; i++) {
    const hand = players[i].hand
    console.log(hand);
    const rank = evaluateHand(hand);
    console.log(ranks[Math.floor(rank / 13)]);
    if (bestHand === null || rank > bestHand) {
      bestHand = rank;
      winner = players[i];
      winningRank = ranks[Math.floor(rank / 13)];
    } else if (rank === bestHand) {
      // handle ties
      winner = null;
    }
  }
  const handInformation = document.querySelector(".hand-information")
  let winnerText = 'The winner is: ' + (winner !== null ? winner.name + ` with ${winningRank}` : 'Tie')
  let wtx = document.createElement('h1')
  wtx.innerText = winnerText
  handInformation.append(wtx)
}




