let currentMinimumBet = 0
//bet or raise - false for bet, true for raise
let bor = false

function enablePlayerActions(playerNum) {
    if (playerNum == 0 && players[0].name === 'Human') {
        let playerOptions = document.querySelector(".player-options")
        playerOptions.style.visibility = 'visible'
    } else {
        //const myt = setTimeout(players[playerNum].ai.updateStrategy, 10, { currentBet: currentMinimumBet, potTotal: pot, communityCards: cCards }, player2.hand, playerNum)
        players[playerNum].ai.updateStrategy({ currentBet: currentMinimumBet, potTotal: pot, communityCards: cCards }, player2.hand, playerNum)
    }
}

function disablePlayerActions(playerNum) {
    if (playerNum == 0 && players[0].name === 'Human') {
        let playerOptions = document.querySelector(".player-options")
        playerOptions.style.visibility = 'hidden'
    }
}

function makeBet(playerNum, cpamount = -1) {
    let amount = currentMinimumBet
    if (cpamount == -1) {
        amount = NaN
    } else {
        amount += cpamount
    }
    if (amount > players[playerNum].chips) {
        amount = players[playerNum].chips
    }
    updateChips(-amount, playerNum)
    players[playerNum].currentBet += amount
    currentMinimumBet += amount
    updatePot(amount)
    for (let i = 0; i < players.length; i++) {
        if (i != playerNum) {
            players[i].matchedBet = false
        }
    }
    players[playerNum].matchedBet = true
}

function makeCall(playerNum) {
    let chipDifference = (currentMinimumBet - players[playerNum].currentBet)
    if (chipDifference > players[playerNum].chips) {
        chipDifference = players[playerNum].chips
    }
    updateChips(-chipDifference, playerNum)
    players[playerNum].currentBet += chipDifference
    updatePot(chipDifference)
    players[playerNum].matchedBet = true
}

function makeCheck(playerNum) {
    players[playerNum].matchedBet = true
}

function makeFold(playerNum) {
    players[playerNum].inHand = false
}