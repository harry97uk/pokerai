class Cards {
    constructor(cards) {
        this.cards = cards;
    }

    renderCommunityCardsFirst() {
        const communityCards = document.querySelector(".community-cards");
        const cardWidth = 50; // adjust as needed
        const cardMargin = 10; // adjust as needed


        this.cards.forEach((card, index) => {
            let cardEl = document.createElement(`div`);
            cardEl.id = `communityCard${index}`
            cardEl.classList.add('card');

            if (card !== "UK") {
                let cs = card.match(/\w+(clubs|diamonds|spades|hearts)/)
                let v = card.split(cs[1])[0];
                let s = cs[1]
                cardEl.style.backgroundImage = `url('card-images/${v}_of_${s}.png')`;
            } else {
                cardEl.style.backgroundImage = `url('card-images/${card}.png')`;
            }

            cardEl.style.left = (index * (cardWidth + cardMargin)) + 'px';
            communityCards.appendChild(cardEl)
        });
    }

    renderPlayerCards(playerPos, playerNum) {
        const communityCards = document.querySelector(playerPos);
        const cardWidth = 50; // adjust as needed
        const cardMargin = 10; // adjust as needed


        this.cards.forEach((card, index) => {
            let cardEl = document.createElement(`div`);
            cardEl.id = `player${playerNum}Card${index}`
            cardEl.classList.add('card');

            if (card !== "UK") {
                let cs = card.match(/\w+(clubs|diamonds|spades|hearts)/)
                let v = card.split(cs[1])[0];
                let s = cs[1]
                cardEl.style.backgroundImage = `url('card-images/${v}_of_${s}.png')`;
            } else {
                cardEl.style.backgroundImage = `url('card-images/${card}.png')`;
            }

            console.log("appending");
            cardEl.style.left = (index * (cardWidth + cardMargin)) + 'px';
            communityCards.appendChild(cardEl)
        });
    }

    renderCommunityCardReplace(playNum) {
        const communityCards = document.querySelector(".community-cards");
        const cardWidth = 50; // adjust as needed
        const cardMargin = 10; // adjust as needed


        this.cards.forEach((card, index) => {
            let cardEl
            console.log(index);
            if (playNum > 1) {
                if (playNum == 2) {
                    cardEl = document.getElementById('communityCard3')
                } else {
                    cardEl = document.getElementById('communityCard4')
                }
            } else {
                cardEl = document.getElementById(`communityCard${index}`)
            }

            if (card !== "UK") {
                let cs = card.match(/\w+(clubs|diamonds|spades|hearts)/)
                let v = card.split(cs[1])[0];
                let s = cs[1]
                cardEl.style.backgroundImage = `url('card-images/${v}_of_${s}.png')`;
            } else {
                cardEl.style.backgroundImage = `url('card-images/${card}.png')`;
            }
        });
    }

    renderPlayerCardsReplace(playerPos, playerNum) {
        const communityCards = document.querySelector(playerPos);
        const cardWidth = 50; // adjust as needed
        const cardMargin = 10; // adjust as needed


        this.cards.forEach((card, index) => {
            let cardEl = document.getElementById(`player${playerNum}Card${index}`);

            if (card !== "UK") {
                let cs = card.match(/\w+(clubs|diamonds|spades|hearts)/)
                let v = card.split(cs[1])[0];
                let s = cs[1]
                cardEl.style.backgroundImage = `url('card-images/${v}_of_${s}.png')`;
            } else {
                cardEl.style.backgroundImage = `url('card-images/${card}.png')`;
            }
        });
    }
}

function removeAllCards() {
    console.log("removing");
    const communityCards = document.querySelector(".community-cards")
    const playerCards = []
    for (let i = 0; i < players.length; i++) {
        let player = document.querySelector(`div.player-area.player-${i+1}`) 
        playerCards.push(player)           
    }
    for (let n = 0; n < 5; n++) {
        console.log(communityCards);
        communityCards.removeChild(document.getElementById(`communityCard${n}`))
        if (n < 2) {
            for (let j = 0; j < playerCards.length; j++) {
                playerCards[j].removeChild(document.getElementById(`player${j+1}Card${n}`))                    
            }
        }
    }
    
}