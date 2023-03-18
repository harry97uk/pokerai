// Define the genetic algorithm function

function geneticAlgorithm(populationSize, numGenerations) {
    console.log("training");
    // Create an initial population of Poker AIs with random strategies
    let population = [];
    let strategies = [];
    for (let i = 0; i < populationSize; i++) {
        (async () => {
            await strategies.push(generateRandomStrategy()) // generate a random strategy
        })();
    }
    for (let i = 0; i < populationSize; i++) {
        let ai = new PokerAI(strategies[i]);
        population.push(ai);
    }
    let bestAI = null;
    let topAIs = [];
    // Run the genetic algorithm for a certain number of generations
    for (let generation = 0; generation < numGenerations; generation++) {
        console.log(`gen ${generation}`);
        // Simulate games between the AIs in the population and evaluate their fitness
        if (generation == numGenerations - 1) {
            while (topAIs.length > 1) {
                let temp = [];
                if (topAIs.length % 2 == 1) {
                    temp.push(topAIs[topAIs.length - 1])
                }
                for (let i = 1; i < (topAIs.length/2)+1; i += 2) {
                    let ai1 = topAIs[i - 1];
                    let ai2 = topAIs[i]
                    temp.push(evaluateFitness(ai1, ai2))// evaluate the AI's performance in simulated games
                }
                console.log(temp);
                topAIs = temp
            }
            bestAI = topAIs[0]
            //console.log(topAIs);
        } else {
            for (let i = 1; i < populationSize; i += 2) {
                let ai1 = population[i - 1];
                let ai2 = population[i]
                topAIs.push(evaluateFitness(ai1, ai2))// evaluate the AI's performance in simulated games
            }

            // Create a new generation of AIs using genetic operators
            let newPopulation = [];
            for (let i = 0; i < populationSize; i++) {
                let parent1 = topAIs[Math.floor(Math.random() * topAIs.length)];
                let parent2 = topAIs[Math.floor(Math.random() * topAIs.length)];
                //crossover and mutation
                let offspringStrategy = parent1
                offspringStrategy = crossover(parent1, parent2)
                offspringStrategy = mutation(offspringStrategy, 0.5)
                let offspring = new PokerAI(offspringStrategy.strategy);
                newPopulation.push(offspring);
            }

            // Update the population with the new generation
            population = newPopulation;
        }

    }

    // Return the best-performing AI from the final generation
    return bestAI
}

function evaluateFitness(ai1, ai2) {
    const testGames = 10;
    let tally = [0, 0]
    let winner
    for (let i = 0; i < testGames; i++) {
        //console.log(`test game ${i}`);
        const game = new AIPokerGame(ai1, ai2);
        winner = game.playGame();
        if (winner == ai1) {
            tally[0]++
        } else {
            tally[1]++
        }
    }
    if (tally[0] > tally[1]) {
        return ai1
    } else {
        return ai2
    }
}

function generateRandomStrategy() {
    let weights = {};
    weights.aabet = false
    weights.aacall = false
    weights.aafold = false
    weights.aabluff = false
    weights.handStrength = Math.random() + 0.5;
    weights.potSize = Math.random() + 0.5;
    weights.numPlayers = Math.random();
    weights.bluffFrequency = Math.random();
    weights.betSize = Math.random() + 0.5;
    weights.risk = Math.random();
    return weights;
}

// crossover function
function crossover(obj1, obj2) {
    const newObj = {};

    obj1 = setFirstFourProperties(obj1, false)
    obj2 = setFirstFourProperties(obj2, false)

    for (let key in obj1) {
        if (Math.random() < 0.5) {
            newObj[key] = obj1[key];
        } else {
            newObj[key] = obj2[key];
        }
    }

    for (let key in obj2) {
        if (!newObj.hasOwnProperty(key)) {
            newObj[key] = obj2[key];
        }
    }

    return newObj;
}

function setFirstFourProperties(obj, value) {
    const keys = Object.keys(obj.strategy);
    for (let i = 0; i < 4 && i < keys.length; i++) {
        if (i == 0) {
            obj.strategy[keys[i]] = 0;
        } else {
            obj.strategy[keys[i]] = value;
        }

    }
    return obj;
}


// mutation function
function mutation(obj, mutationRate) {
    for (let prop in obj) {
        if (typeof obj[prop] === 'number' && Math.random() < mutationRate) {
            obj[prop] += (Math.random() - 0.5) * 0.1;
        }
    }
    return obj;
}


