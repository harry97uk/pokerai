class PokerAI {
    constructor(strategy) {
        this.strategy = strategy;
    }


    // update the AI's strategy based on the current game state
    updateStrategy(gameState, hand, playerNum) {
        const currentBet = gameState.currentBet;
        console.log(this.strategy);
        let pot = gameState.potTotal * this.strategy.potSize;
        if (pot < 20) {
            console.log("min pot");
            pot = 20
        }

        // calculate the strength of the AI's hand
        let handStrength
        if (hand.length < 5) {
            handStrength = evaluateTwoCardHand(hand)
        } else {
            handStrength = evaluateFiveCardHand(hand);
        }
        handStrength *= this.strategy.handStrength


        // if the AI has a amazing hand, bet aggressively
        if (handStrength >= 98) {
            let bet = Math.floor((pot) * this.strategy.betSize);
            if (bet < currentBet && this.strategy.risk < 0.1) {
                this.strategy.aacall = true
            } else if (bet >= currentBet) {
                this.strategy.aabet = bet - currentBet
            }
        }
        // if the AI has a good hand, bet  fairly aggressively
        if (handStrength >= 70) {
            let bet = Math.floor((pot / 2) * this.strategy.betSize);
            if (bet <= currentBet) {
                this.strategy.aacall = true
            } else if (bet > currentBet) {
                if (this.strategy.risk > 0.15) {
                    this.strategy.aabet = bet - currentBet
                }
            }
        }
        // if the AI has an average hand, bet conservatively
        else if (handStrength >= 42) {
            let bet = Math.floor((pot / 4) * this.strategy.betSize);
            if (bet <= currentBet) {
                if (this.strategy.risk > 0.4) {
                    this.strategy.aacall = true
                } else {
                    if (currentBet > 0) {
                        this.strategy.aafold = true
                    }
                }
            } else if (bet > currentBet && this.strategy.risk > 0.4) {
                this.strategy.aabet = bet - currentBet
            }
        }
        // check
        else if (handStrength >= 14) {
            let bet = Math.floor((pot / 4) * this.strategy.betSize);
            if (bet <= currentBet) {
                if (this.strategy.risk > 0.6) {
                    this.strategy.aacall = true
                } else {
                    if (currentBet > 0) {
                        this.strategy.aafold = true
                    }
                }
            } else if (bet > currentBet && this.strategy.risk > 0.6) {
                this.strategy.aabet = bet - currentBet
            }
        }
        // otherwise, fold
        else {
            let bet = Math.floor((pot / 4) * this.strategy.betSize);
            if (bet <= currentBet) {
                if (this.strategy.risk > 0.7) {
                    this.strategy.aacall = true
                } else {
                    if (currentBet > 0) {
                        this.strategy.aafold = true
                    }
                }
            } else if (bet > currentBet && this.strategy.risk > 0.8) {
                this.strategy.aabet = bet - currentBet
            }
        }

        // randomly decide whether to bluff
        if (Math.random() < this.strategy.bluffFrequency) {
            this.strategy.aabluff = true;
            let bet = Math.floor((pot / 4) * this.strategy.betSize);
            if (bet <= currentBet) {
                this.strategy.aacall = true
            } else if (bet > currentBet) {
                this.strategy.aabet = bet - currentBet
            }
        }
        makeDecision(playerNum, this.strategy)
    }
}

// make a decision based on the AI's strategy
function makeDecision(playerNum, strategy) {
    // use the strategy to make a decision
    if (strategy.aafold) {
        resetChoices(playerNum)
        makeFold(playerNum);
    } else if (strategy.aabluff) {
        resetChoices(playerNum)
        makeBet(playerNum, strategy.aabet);
    } else if (strategy.aabet) {
        resetChoices(playerNum)
        makeBet(playerNum, strategy.aabet);
    } else if (strategy.aacall) {
        resetChoices(playerNum)
        makeCall(playerNum);
    } else {
        resetChoices(playerNum)
        makeCheck(playerNum);
    }
}

function resetChoices(playerNum) {
    hplayers[playerNum].ai.strategy.aabluff = false
    hplayers[playerNum].ai.strategy.aacall = false
    hplayers[playerNum].ai.strategy.aafold = false
}

