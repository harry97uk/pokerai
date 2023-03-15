function AIMove(playerNum) {
    console.log("ai betting");
    if (currentMinimumBet == 0) {
        makeCheck(playerNum)
    } else {
        makeCall(playerNum)
    }
}

class PokerAI {
    constructor(startingChips) {
        this.chips = startingChips;
        this.strategy = {};
      }
    

    // update the AI's strategy based on the current game state
    updateStrategy(gameState, hand, playerNum) {
        // reset the strategy
        this.strategy = {};
        const currentBet = gameState.currentBet;
        const pot = gameState.potTotal;

        // calculate the strength of the AI's hand
        let handStrength
        if (hand.length < 5) {
            if (hand[0] == hand[1]) {
                handStrength = 15
            } else {
                handStrength = 5
            }
        } else {
            handStrength = evaluateFiveCardHand(hand);
        }
        

        // if the AI has a good hand, bet aggressively
        if (handStrength >= 52) {
            let bet = Math.floor(players[playerNum].chips / 2);
            if (bet <= currentBet) {
                this.strategy.call = true
            } else {
                this.strategy.bet = bet - currentBet
            }
        }
        // if the AI has a mediocre hand, bet conservatively
        else if (handStrength >= 13) {
            let bet = Math.floor(players[playerNum].chips / 4);
            if (bet <= currentBet) {
                this.strategy.fold = true
            } else {
                this.strategy.bet = bet - currentBet
            }
        }
        // check
        else if (handStrength >= 5 && currentBet == 0) {
            console.log("check");
        } 
        // otherwise, fold
        else {
            this.strategy.fold = true;
        }

        // randomly decide whether to bluff
        if (Math.random() < 0.2) {
            this.strategy.bluff = true;
            this.strategy.bet = 10;
        }
        makeDecision(playerNum)
    }
}

// make a decision based on the AI's strategy
function makeDecision(playerNum) {
    console.log(this.strategy);
    // use the strategy to make a decision
    if (this.strategy.fold) {
        console.log("ai fold");
        makeFold(playerNum);
    } else if (this.strategy.bluff) {
        console.log("ai bluff");
        makeBet(playerNum, this.strategy.bet);
    } else if (this.strategy.bet) {
        console.log("ai bet");
        makeBet(playerNum, this.strategy.bet);
    } else if (this.strategy.call) {
        console.log("ai bet");
        makeBet(playerNum, this.strategy.bet);
    } else {
        console.log("ai check");
        makeCheck(playerNum);
    }
}
