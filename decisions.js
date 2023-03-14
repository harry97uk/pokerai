let currentMinimumBet = 0

function enablePlayerActions(playerNum) {
    if (playerNum == 0) {
        let cc = document.getElementById("checkOrCall")
        let br = document.getElementById("betOrRaise")
        let bra = document.getElementById("betOrRaiseAmount")
        if (players[playerNum].currentBet < currentMinimumBet) {
            cc.innerText = "Call"
            cc.onclick = function(){makeCall(0)}
            br.innerText = "Raise"
            br.onclick = function(){makeBet(0)}
            bra.innerText = "Raise Amount"
        } else {
            cc.innerText = "Check"
            cc.onclick = function(){makeCheck(0)}
            br.innerText = "Bet"
            br.onclick = function(){makeBet(0)}
            bra.innerText = "Bet Amount" 
        }
        let playerOptions = document.querySelector(".player-options")
        playerOptions.style.visibility = 'visible'
    } else {
        const myt = setTimeout(player2ai.updateStrategy, 1000, { currentBet: currentMinimumBet, potTotal: pot, communityCards: cCards}, player2.hand, playerNum)
    }
}

function disablePlayerActions(playerNum) {
    if (playerNum == 0) {
        let playerOptions = document.querySelector(".player-options")
        playerOptions.style.visibility = 'hidden'
    }
}

function makeBet(playerNum, cpamount = -1) {
    console.log("player number", playerNum);
    let amount
    if (cpamount == -1) {
        amount = Number(document.getElementById("betAmount").value)
    } else {
        amount = cpamount
    }
    console.log("amount", amount);
    updateChips(-amount, playerNum)
    players[playerNum].currentBet += amount
    currentMinimumBet = amount
    updatePot(amount)
    updateMoveInfo(playerNum, `bet of ${amount}`)
    endTurn()
}

function makeCall(playerNum) {
    console.log("player number", playerNum);
    let chipDifference = (currentMinimumBet-players[playerNum].currentBet)
    console.log(chipDifference, "CD");
    updateChips(-chipDifference, playerNum)
    players[playerNum].currentBet += currentMinimumBet-players[playerNum].currentBet
    updatePot(chipDifference)
    updateMoveInfo(playerNum, "call")
    endTurn()
}

function makeCheck(playerNum) {
    console.log(playerNum, "player number");
    updateMoveInfo(playerNum, "check")
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