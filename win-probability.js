function winProbabilityUnknownOpponent(hand, communityCards) {
    const remainingCards = getRemainingCards(hand, communityCards);
    const simulations = 1000000;
    let wins = 0;
    
    for (let i = 0; i < simulations; i++) {
      const opponentCards = getRandomCards(2, remainingCards);
      const opponentHand = opponentCards.concat(communityCards);
      const myHand = hand.concat(communityCards);
      
      const myHandRank = evaluateFiveCardHand(myHand);
      const opponentHandRank = evaluateFiveCardHand(opponentHand);
      
      if (myHandRank > opponentHandRank) {
        wins++;
      }
    }
    
    return (wins / simulations) * 100;
  }
  
  function getRemainingCards(hand, communityCards) {
    const deck = [];
    const suits = ['H', 'C', 'D', 'S'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    
    for (let i = 0; i < suits.length; i++) {
      for (let j = 0; j < values.length; j++) {
        const card = values[j] + suits[i];
        if (hand.indexOf(card) < 0 && communityCards.indexOf(card) < 0) {
          deck.push(card);
        }
      }
    }
    
    return deck;
  }
  
  function getRandomCards(numCards, deck) {
    const cards = [];
    for (let i = 0; i < numCards; i++) {
      const randomIndex = Math.floor(Math.random() * deck.length);
      const randomCard = deck.splice(randomIndex, 1)[0];
      cards.push(randomCard);
    }
    return cards;
  }
  