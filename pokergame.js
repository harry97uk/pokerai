// initialize deck of cards
let hdeck = [];
const hsuits = ['hearts', 'diamonds', 'clubs', 'spades'];
const hvalues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
const hranks = ['High Card', 'One Pair', 'Two Pair', 'Three of a Kind', 'Straight', 'Flush', 'Full House', 'Four of a Kind', 'Straight Flush', 'Royal Flush', '']

function resetAndShuffleDeck() {
  hdeck = [];
  for (let i = 0; i < hsuits.length; i++) {
    for (let j = 0; j < hvalues.length; j++) {
      hdeck.push({ value: hvalues[j], suit: hsuits[i] });
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
    shuffle(hdeck)
  }
}

resetAndShuffleDeck()


// initialize players
const hstartingChips = 100
const hplayer1 = { name: 'Human', ai: null, hand: [], chips: hstartingChips, currentBet: 0, inHand: false, matchedBet: false };
const hplayer2 = { name: 'Player 2', ai: null, hand: [], chips: hstartingChips, currentBet: 0, inHand: false, matchedBet: false };

const hplayers = [hplayer1, hplayer2];

let hcurrentStartingPlayer = hplayers.length - 1
let hcurrentPlayer = 0; //who's go it is

let hendRound = false
let hpot = 0

let hdealt = false
let hhasFlop = false
let hhasTurn = false
let hhasRiver = false
let moveMade = false
const moveMadeRef = { moveMade };
let roundMade = false
const roundMadeRef = { roundMade };
let gameMade = false
const gameMadeRef = { gameMade };
let hcCards = []

function determineStartingPlayer() {
  if (hcurrentStartingPlayer == hplayers.length - 1) {
    hcurrentStartingPlayer = 0
  } else {
    hcurrentStartingPlayer++
  }
}

function startGame() {
  console.log(JSON.parse(localStorage.getItem('theai')));
  hplayer2.ai = new PokerAI(JSON.parse(localStorage.getItem('theai')))
  localStorage.removeItem('theai')
  console.log("game started", hplayer2.ai);
  console.log(hplayer2);
  let dealerButton = document.querySelector('.dealer-button')
  console.log(dealerButton);
  dealerButton.onclick = function() {startRound(true);}
  startRound()
}

function endGame() {
  hplayers.sort(function (a, b) {
    return b.chips - a.chips
  })
  //console.log('Total rounds played = ', roundNum);
  alert(hplayers[0].name); 
}

function startRound(reset = false) {
  resetAndShuffleDeck()
  determineStartingPlayer()
  hcurrentPlayer = hcurrentStartingPlayer
  if (reset) {
    removeAllCards()
    const newCommunityCards = new Cards(['UK', 'UK', 'UK', 'UK', 'UK']);
    newCommunityCards.renderCommunityCardsFirst();
  }
  playRound()
}


function shouldGameEnd() {
  console.log(hplayers.length * hstartingChips, hplayers[0]);
  return (hplayers.some(p => p.chips == hstartingChips * hplayers.length))
}

function playRound() {
  
  // if betting is still continuing, do not make the next play i.e deal flop, etc
  if (hplayers.every(p => p.matchedBet || !p.inHand)) {
    nextPlay()
    for (let i = 0; i < hplayers.length; i++) {
      hplayers[i].currentBet = 0
      hplayers[i].matchedBet = false
    }
    hcurrentPlayer = hcurrentStartingPlayer
  }
  if (!hendRound) {
    startTurn(hcurrentPlayer)
  } else {
    endingRound(true)
  }
}


function endingRound(showdown = true) {
  determineWinner(showdown)
  hdealt = false
  hhasFlop = false
  hhasTurn = false
  hhasRiver = false
  hinRound = false
  hendRound = false
  updatePot(0, true)
  updatePotText(0)
  resetAndShuffleDeck()
  for (let i = 0; i < hplayers.length; i++) {
    hplayers[i].hand = []
    hplayers[i].matchedBet = false
    hplayers[i].inHand = false
    hplayers[i].currentBet = 0
    currentMinimumBet = 0
  }
  if (shouldGameEnd()) {
    console.log("ending game");
    endGame()
  } else {
    updateDealerText("Deal")
  }
}

function startTurn(playerIndex) {
  hcurrentPlayer = playerIndex;
  enablePlayerActions(hcurrentPlayer); // Enable this player's action buttons
}

// Function to end a player's turn and move on to the next player
function endTurn() {
  disablePlayerActions(hcurrentPlayer); // Disable this player's action buttons
  hcurrentPlayer = (hcurrentPlayer + 1) % hplayers.length; // Move on to the next player
  if (!shouldRoundEnd() && !hendRound) {
    console.log("new round");
    playRound()
  } else {
    endingRound(false)
  }
}

function shouldRoundEnd() {
  let playerCounter = 0
  for (let i = 0; i < hplayers.length; i++) {
    if (hplayers[i].inHand) {
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
  updateCurrentBetText(currentMinimumBet)
  if (!hdealt) {
    updateMoveInfo(null, null, true)
    deal()
    hdealt = true
    updateDealerText('')
  } else if (!hhasFlop) {
    dealFlop()
    hhasFlop = true
  } else if (!hhasTurn) {
    dealTurn()
    hhasTurn = true
  } else if (!hhasRiver) {
    dealRiver()
    hhasRiver = true
  } else {
    hendRound = true
    showOtherPlayerHands()
    updateDealerText('Next Round')
  }
}

function deal() {
  for (let i = 0; i < hplayers.length; i++) {
    hplayers[i].hand.push(hdeck.pop());
    hplayers[i].hand.push(hdeck.pop());
    hplayers[i].inHand = true
  }
  getPlayer1Hand()
  getOtherPlayerHands()
  // print each player's hand
  for (let i = 0; i < hplayers.length; i++) {
    console.log(hplayers[i].name + "'s hand:");
    console.log(hplayers[i].hand);
  }
}

// deal the flop (first three community cards)
function dealFlop() {
  hdeck.pop(); // burn a card
  const flop = [];
  for (let i = 0; i < 3; i++) {
    let c = hdeck.pop()
    flop.push(c);
    for (let i = 0; i < hplayers.length; i++) {
      hplayers[i].hand.push(c);
    }
  }
  let card1 = flop[0].value + flop[0].suit
  let card2 = flop[1].value + flop[1].suit
  let card3 = flop[2].value + flop[2].suit
  hcCards = [card1, card2, card3]
  let flopCards = new Cards([card1, card2, card3])
  flopCards.renderCommunityCardReplace(1)
  console.log('The flop:');
  console.log(flop);
}

// deal the turn (fourth community card)
function dealTurn() {
  hdeck.pop(); // burn a card
  const turn = hdeck.pop();
  for (let i = 0; i < hplayers.length; i++) {
    hplayers[i].hand.push(turn);
  }
  let card = turn.value + turn.suit
  hcCards.push(card)
  let turnCard = new Cards([card])
  turnCard.renderCommunityCardReplace(2)
  console.log('The turn:');
  console.log(turn);
}

// deal the river (fifth and final community card)
function dealRiver() {
  hdeck.pop(); // burn a card
  const river = hdeck.pop();
  for (let i = 0; i < hplayers.length; i++) {
    hplayers[i].hand.push(river);
  }
  let card = river.value + river.suit
  hcCards.push(card)
  let riverCard = new Cards([card])
  riverCard.renderCommunityCardReplace(3)
  console.log('The river:');
  console.log(river);
}

function getPlayer1Hand() {
  let card1 = hplayer1.hand[0].value + hplayer1.hand[0].suit
  let card2 = hplayer1.hand[1].value + hplayer1.hand[1].suit
  const playerCards = new Cards([card1, card2])
  playerCards.renderPlayerCards("div.player-area.player-1", 1)
}

function getOtherPlayerHands() {
  const playerCards = new Cards(["UK", "UK"])
  playerCards.renderPlayerCards("div.player-area.player-2", 2)
}

function showOtherPlayerHands() {
  let card1 = hplayer2.hand[0].value + hplayer2.hand[0].suit
  let card2 = hplayer2.hand[1].value + hplayer2.hand[1].suit
  const playerCards = new Cards([card1, card2])
  playerCards.renderPlayerCardsReplace("div.player-area.player-2", 2)
}

// determine the winner
function determineWinner(showdown = true) {
  let bestHand = null;
  let winner = null;
  let winnerNum = null
  let winningRank = null;
  for (let i = 0; i < hplayers.length; i++) {
    disablePlayerActions(i)
    const hand = hplayers[i].hand
    console.log(hand);
    let rank = -1
    if (hplayers[i].inHand) {
      if (!showdown) {
        rank = 140
      } else {
        rank = evaluateHand(hand);
      }
    }
    console.log(hplayers[i], rank, "rank score");
    console.log(hranks[Math.floor(rank / 14)]);
    if (bestHand === null || rank > bestHand) {
      bestHand = rank;
      winner = hplayers[i];
      winnerNum = i
      winningRank = hranks[Math.floor(rank / 14)];
    } else if (rank === bestHand) {
      // handle ties
      winner = null;
    }
  }
  if (winner !== null) {
    updateChips(hpot, winnerNum)
  } else {
    for (let i = 0; i < hplayers.length; i++) {
      updateChips(hpot / hplayers.length, i)
    }
  }
  displayWinner(winner, winningRank, showdown)
}

function updateChips(amount, playerNum) {
  hplayers[playerNum].chips += amount
  let chipAmount = document.getElementById(`player${playerNum + 1}-chips`)
  console.log(chipAmount);
  chipAmount.innerText = String(hplayers[playerNum].chips)
}

function updatePot(amount, reset = false) {
  console.log("pot: ", hpot);
  if (reset) {
    hpot = 0
    updatePotText(0)
  } else {
    hpot += amount
    updatePotText(hpot)
  }
}

function updateDealerText(text) {
  let dealertext = document.getElementById('dealerText')
  dealertext.innerText = text
}

function updatePotText(value) {
  let potText = document.getElementById('potDisplay')
  potText.innerText = "Pot: " + value
}

function updateCurrentBetText(value) {
  let currentBetText = document.getElementById('currentBet')
  currentBetText.innerText = "Current Bet: " + value
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