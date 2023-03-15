// initialize deck of cards
let deck = [];
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
const ranks = ['High Card', 'One Pair', 'Two Pair', 'Three of a Kind', 'Straight', 'Flush', 'Full House', 'Four of a Kind', 'Straight Flush', 'Royal Flush', '']

function resetAndShuffleDeck() {
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
const startingChips = 100
const player1 = { name: 'Player 1', hand: [], chips: startingChips, currentBet: 0, inHand: false, matchedBet: false };
const player2 = { name: 'Player 2', hand: [], chips: startingChips, currentBet: 0, inHand: false, matchedBet: false };
const player2ai = new PokerAI(player2.chips);
const players = [player1, player2];

let dealer = 0; // index of the dealer
let currentStartingPlayer = players.length - 1
let currentPlayer = 0; //who's go it is

let inRound = false
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

function startRound() {
  if (!inRound && !endRound) {
    nextPlay()
    determineStartingPlayer()
    currentPlayer = currentStartingPlayer
    startTurn(currentPlayer)
    inRound = true
  } else if (endRound) {
    console.log("endround");
    updatePot(0, true)
    removeAllCards()
    resetAndShuffleDeck()
    for (let i = 0; i < players.length; i++) {
      players[i].hand = []
      players[i].matchedBet = false
      players[i].inHand = false
      players[i].currentBet = 0
      currentMinimumBet = 0
    }
    const newCommunityCards = new Cards(['UK', 'UK', 'UK', 'UK', 'UK']);
    newCommunityCards.renderCommunityCardsFirst();
    if (players.some(p => p.chips == startingChips*players.length)) {
      alert(`Player Wins`)
      endGame = true
      restartGame()
    } 
    endRound = false
    updateDealerText("Deal")
  }
}

function startTurn(playerIndex) {
  currentPlayer = playerIndex;
  enablePlayerActions(currentPlayer); // Enable this player's action buttons
}

// Function to end a player's turn and move on to the next player
function endTurn() {
  disablePlayerActions(currentPlayer); // Disable this player's action buttons
  let playerCounter = 0
  for (let i = 0; i < players.length; i++) {
    if (players[i].inHand) {
      playerCounter++
    }
  }
  if (playerCounter < 2) {
    determineWinner(false)
    dealt = false
    hasFlop = false
    hasTurn = false
    hasRiver = false
    inRound = false
    endRound = true
    updateDealerText('Next Round')
  } else {
    currentPlayer = (currentPlayer + 1) % players.length; // Move on to the next player
    if (players.every(p => p.matchedBet || !p.inHand)) {
      for (let i = 0; i < players.length; i++) {
        players[i].currentBet = 0
        players[i].matchedBet = false
      }
      nextPlay()
      currentPlayer = currentStartingPlayer
    }
  }
  if (!endRound) {
    startTurn(currentPlayer); // Start the next player's turn
  }
}


// deal two cards to each player
function nextPlay() {
  currentMinimumBet = 0
  if (!dealt) {
    updateMoveInfo(null, null, true)
    deal()
    dealt = true
    updateDealerText('')
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
    showOtherPlayerHands()
    dealt = false
    hasFlop = false
    hasTurn = false
    hasRiver = false
    inRound = false
    endRound = true
    updateDealerText('Next Round')
  }

}

function deal() {
  for (let i = 0; i < players.length; i++) {
    players[i].hand.push(deck.pop());
    players[i].hand.push(deck.pop());
    players[i].inHand = true
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
function determineWinner(showdown = true) {
  let bestHand = null;
  let winner = null;
  let winnerNum = null
  let winningRank = null;
  for (let i = 0; i < players.length; i++) {
    disablePlayerActions(i)
    const hand = players[i].hand
    console.log(hand);
    let rank = -1
    if (players[i].inHand) {
      if (!showdown) {
        rank = 140
      } else {
        rank = evaluateHand(hand);
      }
    }
    console.log(players[i], rank, "rank score");
    console.log(ranks[Math.floor(rank / 14)]);
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
  displayWinner(winner, winningRank, showdown)
}

function updateChips(amount, playerNum) {
  players[playerNum].chips += amount
  let chipAmount = document.getElementById(`player${playerNum + 1}-chips`)
  console.log(chipAmount);
  chipAmount.innerText = String(players[playerNum].chips)
}

function updatePot(amount, reset = false) {
  console.log("pot: ", pot);
  if (reset) {
    pot = 0
    updatePotText(0)
  } else {
    pot += amount
    updatePotText(pot)
  }
}

function updateDealerText(text) {
  let dealertext = document.getElementById('dealerText')
  dealertext.innerText = text
}

function updatePotText(value) {
  let dealertext = document.getElementById('potDisplay')
  dealertext.innerText = "Pot: " + value
}

function displayWinner(winner, winningRank, showdown) {
  const handInformation = document.querySelector(".hand-information")
  let winnerText
  if (showdown) {
    winnerText = 'The winner is: ' + (winner !== null ? winner.name + ` with ${winningRank}` : 'Tie')
  } else {
    winnerText = 'The winner is: ' + winner.name
  }

  let wtx
  if (document.getElementById("winnerMessage") === null) {
    wtx = document.createElement('h1')
    wtx.id = "winnerMessage"
  } else {
    wtx = document.getElementById("winnerMessage")
  }
  wtx.innerText = winnerText
  handInformation.append(wtx)
}