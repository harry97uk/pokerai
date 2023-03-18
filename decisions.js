let currentMinimumBet = 0
//bet or raise - false for bet, true for raise
let bor = false

function enablePlayerActions(playerNum) {

    let cc = document.getElementById("checkOrCall")
    let br = document.getElementById("betOrRaise")
    let bra = document.getElementById("betOrRaiseAmount")
    let betInput = document.getElementById("betAmount")    
    
    if (hplayers[playerNum].currentBet < currentMinimumBet) {
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
    
    if (playerNum == 0 && hplayers[0].name === 'Human') {
        showPlayerOptions();
    } else {
        console.log(hplayers[playerNum]);
        updateAI(playerNum);
    }
}

function showPlayerOptions() {
    console.log("player options");
    let playerOptions = document.querySelector(".player-options");
    playerOptions.style.visibility = 'visible';
}

function updateAI(playerNum) {
    console.log(hplayers[playerNum].ai.strategy);
    const myt = setTimeout(hplayers[playerNum].ai.updateStrategy.bind(hplayers[playerNum].ai), 1000, { currentBet: currentMinimumBet, potTotal: hpot, communityCards: hcCards }, hplayer2.hand, playerNum);
}


// await waitUntil(() => moveMadeRef.moveMade);
// const waitUntil = (condition, checkInterval=100) => {
//     console.log("waiting...");
//     return new Promise(resolve => {
//         let interval = setInterval(() => {
//             if (!condition()) return;
//             clearInterval(interval);
//             console.log("done waiting");
//             resolve();
//         }, checkInterval)
//     })
// }


function disablePlayerActions(playerNum) {
    if (playerNum == 0 && hplayers[0].name === 'Human') {
        let playerOptions = document.querySelector(".player-options")
        playerOptions.style.visibility = 'hidden'
    }
}

function makeBet(playerNum, cpamount = -1) {
    let amount = currentMinimumBet
    if (cpamount == -1) {
        amount += Number(document.getElementById("betAmount").value)
    } else {
        amount += cpamount
    }
    if (amount > hplayers[playerNum].chips) {
        amount = hplayers[playerNum].chips
    }
    console.log("amount", amount);
    updateChips(-amount, playerNum)
    hplayers[playerNum].currentBet += amount
    updatePot(amount)
    if (bor) {
        updateMoveInfo(playerNum, `raise of ${amount-currentMinimumBet}`)
    } else {
        updateMoveInfo(playerNum, `bet of ${amount}`)
    }
    currentMinimumBet += amount
    updateCurrentBetText(currentMinimumBet)
    for (let i = 0; i < hplayers.length; i++) {
        if (i != playerNum) {
            hplayers[i].matchedBet = false
        }
    }
    hplayers[playerNum].matchedBet = true
    endTurn()
}

function makeCall(playerNum) {
    let chipDifference = (currentMinimumBet - hplayers[playerNum].currentBet)
    if (chipDifference > hplayers[playerNum].chips) {
        chipDifference = hplayers[playerNum].chips
    }
    updateChips(-chipDifference, playerNum)
    hplayers[playerNum].currentBet += chipDifference
    updatePot(chipDifference)
    updateMoveInfo(playerNum, "call")
    hplayers[playerNum].matchedBet = true
    endTurn()
}

function makeCheck(playerNum) {
    console.log(playerNum, "player number");
    updateMoveInfo(playerNum, "check")
    hplayers[playerNum].matchedBet = true
    endTurn()
}

function makeFold(playerNum) {
    console.log("player number", playerNum);
    hplayers[playerNum].inHand = false
    updateMoveInfo(playerNum, "fold")
    endTurn()
}

function updateMoveInfo(playerNum, decision, reset = false) {
    console.log(playerNum);
    let move = document.getElementById("moveInfo")
    if (reset) {
        move.innerText = ""
    } else {
        move.innerText += `${hplayers[playerNum].name} made a ${decision}\n`
    }
}