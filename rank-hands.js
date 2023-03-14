function getCombinations(cards, k) {
    const result = [];
  
    function combine(start, arr) {
      if (arr.length === k) {
        result.push(arr.slice());
      } else {
        for (let i = start; i < cards.length; i++) {
          arr.push(cards[i]);
          combine(i + 1, arr);
          arr.pop();
        }
      }
    }
  
    combine(0, []);
    return result;
  }
  
  function evaluateHand(cards) {
    // create all possible 5-card combinations from the 7 cards
    const combinations = getCombinations(cards, 5);
  
    // evaluate each 5-card combination and determine the best hand
    let bestRank = 0;
    for (let i = 0; i < combinations.length; i++) {
      const rank = evaluateFiveCardHand(combinations[i]);
      if (rank >= bestRank) {
        bestRank = rank;
      }
    }
  
    return bestRank;
  }
  
  // evaluate the hand
  function evaluateFiveCardHand(cards) {
    // sort cards by rank (2 = 0, 3 = 1, ..., A = 12)
    const ranks = cards.map(card => values.indexOf(card.value)).sort((a, b) => a - b);
  
    // check for flush
    const suits = cards.map(card => card.suit);
    const isFlush = () => [suits.every(suit => suit === suits[0]), ranks[4]]
    const flush = isFlush();
  
    // check for straight
    const isStraight = () => [(ranks[4] - ranks[0] === 4 && new Set(ranks).size === 5), ranks[4]]
    const straight = isStraight()
  
    // check for straight flush or royal flush
    const straightFlush = [straight[0] && flush[0], ranks[4]];
    const royalFlush = straightFlush && ranks[0] === 8;
  
    // check for four of a kind
    const isFourOfAKind = () => {
      if (ranks[0] === ranks[3]) {
        return [true, ranks[0], ranks[4]]
      } else if (ranks[1] === ranks[4]) {
        return [true, ranks[1], ranks[0]]
      } else {
        return [false, null, null]
      }
    }
    const fourOfAKind = isFourOfAKind();
  
    // check for full house
    const isFullHouse = () => {
      if (ranks[0] === ranks[1] && ranks[2] === ranks[4]) {
        return [true, ranks[4]]
      } else if (ranks[0] === ranks[2] && ranks[3] === ranks[4]) {
        return [true, ranks[2]]
      } else {
        return [false, null]
      }
    }
    const fullHouse = isFullHouse();
  
    // check for three of a kind
    const isThreeOfAKind = () => {
      if (ranks[0] === ranks[2]) {
        return [true, ranks[2], ranks[4]]
      } else if (ranks[1] === ranks[3]) {
        return [true, ranks[3], ranks[4]]
      } else if (ranks[2] === ranks[4]) {
        return [true, ranks[4], ranks[1]]
      } else {
        return [false, null, null]
      }
    }
    const threeOfAKind = isThreeOfAKind()
  
    // check for two pair
    const isTwoPair = () => {
      if (ranks[0] === ranks[1] && ranks[2] === ranks[3]) {
        return [true, ranks[3]]
      } else if (ranks[0] === ranks[1] && ranks[3] === ranks[4]) {
        return [true, ranks[4]]
      } else if (ranks[1] === ranks[2] && ranks[3] === ranks[4]) {
        return [true, ranks[4]]
      } else {
        return [false, null]
      }
    }
    const twoPair = isTwoPair();
  
    // check for one pair
    const isOnePair = () => {
      if (ranks[0] === ranks[1]) {
        return [true, ranks[1], ranks[4]]
      } else if (ranks[1] === ranks[2]) {
        return [true, ranks[2], ranks[4]]
      } else if (ranks[2] === ranks[3]) {
        return [true, ranks[3], ranks[4]]
      } else if (ranks[3] === ranks[4]) {
        return [true, ranks[4], ranks[2]]
      } else {
        return [false, null, null]
      }
    }
    const onePair = isOnePair();
  
    // determine hand rank
    if (royalFlush[0]) {
      return 126;
    } else if (straightFlush[0]) {
      return 112 + straightFlush[1];
    } else if (fourOfAKind[0]) {
      return 98 + fourOfAKind[1] + (fourOfAKind[2]/10);
    } else if (fullHouse[0]) {
      return 84 + fullHouse[1];
    } else if (flush[0]) {
      return 70 + flush[1];
    } else if (straight[0]) {
      return 56 + straight[1];
    } else if (threeOfAKind[0]) {
      return 42 + threeOfAKind[1] + (threeOfAKind[2]/10);
    } else if (twoPair[0]) {
      return 28 + twoPair[1];
    } else if (onePair[0]) {
      return 14 + onePair[1] + (onePair[2]/10);
    } else {
      let highCardAndKicker = 0
      let unit = 1
      for (let i = 4; i >= 0; i--) {
        highCardAndKicker += ranks[i]/unit
        unit *= 10
      }
      return highCardAndKicker;
    }
  }