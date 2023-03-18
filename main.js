let bestAI
function trainAI() {
    console.log("button pressed");
    bestAI = geneticAlgorithm(100, 1000);
    console.log(bestAI.strategy); // Print the best AI's strategy
    localStorage.setItem('theai', JSON.stringify(bestAI.strategy));
    let playButton = document.getElementById('playButton')
    playButton.style.visibility = 'visible'
}

function playHumanGame() {
 change_page('game')
}

function change_page(fileName){
    window.location.href = `${fileName}.html`;
  } 