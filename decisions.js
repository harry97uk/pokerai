let currentMinimumBet = 0
//bet or raise - false for bet, true for raise
let bor = false

function enablePlayerActions(playerNum) {

    let cc = document.getElementById("checkOrCall")
    let br = document.getElementById("betOrRaise")
    let bra = document.getElementById("betOrRaiseAmount")
    let betInput = document.getElementById("betAmount")
    if (players[playerNum].currentBet < currentMinimumBet) {
        cc.innerText = "Call"
        cc.onclick = function () { makeCall(0) }
        br.innerText = "Raise"
        br.onclick = function () { makeBet(0) }
        bra.innerText = "Raise Amount"
        bra.appendChild(betInput)
        bor = true
    } else {
        cc.innerText = "Check"
        cc.onclick = function () { makeCheck(0) }
        br.innerText = "Bet"
        br.onclick = function () { makeBet(0) }
        bra.innerText = "Bet Amount"
        bra.appendChild(betInput)
        bor = false

    }
    if (playerNum == 0) {
        let playerOptions = document.querySelector(".player-options")
        playerOptions.style.visibility = 'visible'
    } else {
        const myt = setTimeout(player2ai.updateStrategy, 1000, { currentBet: currentMinimumBet, potTotal: pot, communityCards: cCards }, player2.hand, playerNum)
    }
}

function disablePlayerActions(playerNum) {
    if (playerNum == 0) {
        let playerOptions = document.querySelector(".player-options")
        playerOptions.style.visibility = 'hidden'
    }
}

function makeBet(playerNum, cpamount = -1) {
    let amount
    if (cpamount == -1) {
        amount = Number(document.getElementById("betAmount").value)
    } else {
        amount = cpamount
    }
    if (amount > players[playerNum].chips) {
        amount = players[playerNum].chips
    }
    console.log("amount", amount);
    updateChips(-amount, playerNum)
    players[playerNum].currentBet += amount
    currentMinimumBet += amount
    updatePot(amount)
    if (bor) {
        updateMoveInfo(playerNum, `raise of ${amount}`)
    } else {
        updateMoveInfo(playerNum, `bet of ${amount}`)
    }
    for (let i = 0; i < players.length; i++) {
        if (i != playerNum) {
            players[i].matchedBet = false
        }
    }
    players[playerNum].matchedBet = true
    endTurn()
}

function makeCall(playerNum) {
    let chipDifference = (currentMinimumBet - players[playerNum].currentBet)
    if (chipDifference > players[playerNum].chips) {
        chipDifference = players[playerNum].chips
    }
    updateChips(-chipDifference, playerNum)
    players[playerNum].currentBet += chipDifference
    updatePot(chipDifference)
    updateMoveInfo(playerNum, "call")
    players[playerNum].matchedBet = true
    endTurn()
}

function makeCheck(playerNum) {
    console.log(playerNum, "player number");
    updateMoveInfo(playerNum, "check")
    players[playerNum].matchedBet = true
    endTurn()
}

function makeFold(playerNum) {
    console.log("player number", playerNum);
    players[playerNum].inHand = false
    updateMoveInfo(playerNum, "fold")
    endTurn()
}

function updateMoveInfo(playerNum, decision, reset = false) {
    console.log(playerNum);
    let move = document.getElementById("moveInfo")
    if (reset) {
        move.innerText = ""
    } else {
        move.innerText += `${players[playerNum].name} made a ${decision}\n`
    }
}