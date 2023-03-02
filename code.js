
const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTimeSec: 0,
    totalTimeMin: 0,
    score: 0,
    tries: 0,
    loop: null
}

const generateGame = () => {
    var emojis = ['🍒', '🍒', '🥔', '🥔', '🥑', '🥑', '🌽', '🌽', '🍌', '🍌', '🥕', '🥕', '🍇', '🍇', '🍍', '🍍'];
    var tempEmoj = new Array();
    tempEmoj = shuffleArray(emojis);
    let arrLen = emojis.length;
    let i = 0;

    while (arrLen--) {
        document.getElementById("card" + (i+1)).textContent = tempEmoj[i];
        i++;
    }
}

function shuffleArray(array) {
    let x = array.length;
    while (x--) {
        const ri = Math.floor(Math.random() * x);
        [array[x], array[ri]] = [array[ri], array[x]];
    }
    return array;
}

const startGame = () => {
    state.gameStarted = true;
    state.loop = setInterval(() => {
        state.totalTimeSec++;

        document.getElementById('moves').innerText = state.totalFlips + ": moves";
        if (state.totalTimeSec < 60) {
            document.getElementById('timer').innerText = "Time: " + state.totalTimeSec + " sec";
        } else {
            state.totalTimeMin = state.totalTimeSec / 60;
            document.getElementById('timer').innerText = "Time: " + Math.floor(state.totalTimeMin) + " min " + state.totalTimeSec + " sec";
        }
    }, 1000);
    attachEventListeners();
    generateGame();
    
}

const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target;
        const eventParent = eventTarget.parentElement;

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent);
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame();
        }
    });
}

const flipCard = card => {
    state.flippedCards++;
    state.totalFlips++;

    if (!state.gameStarted) {
        startGame();
    }
    if (state.flippedCards <= 2) {
        card.classList.add('flipped');
    }
    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)');
        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched');
            flippedCards[1].classList.add('matched');
            state.score+=5;
        document.getElementById('score').innerText = "Score: " + state.score;
        } 

        setTimeout(() => {
            flipBackCards();
        }, 1000);
    }
    // If there are no more cards that we can flip, we won the game
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(() => {
            document.querySelector('.win').innerHTML =  
            `
            <span class="win-text">
            You won!<br />
            with <span class="highlight">${state.totalFlips}</span> moves<br />
            under <span class="highlight">${state.totalTimeSec}</span> seconds
            </span>
            `;
            var trydoc = document.querySelector('.board-container:not(.flipBoard)');
            trydoc.classList.add('flipBoard');
            clearInterval(state.loop);
        }, 1000)
    }
}

const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped');
    });
    state.flippedCards = 0;
}



