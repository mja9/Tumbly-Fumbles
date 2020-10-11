"use strict";
let observers = [];
let player = new Player();
// Bind the score value to DOM object.
document.getElementById("score-numeric").innerHTML = Player.score;
let time = 90;
// Bind time value to DOM object.
document.getElementById("time-numeric").innerHTML = time;
let loopID;
let timeAt100 = 0;
let gameHasStarted = false;
let pauseBtn;
let pauseMenu;
// Bind persistent game data.
document.getElementById("high-score-numeric").innerHTML = getFromStorage("highscore");
document.getElementById("average-numeric").innerHTML = getFromStorage("avgAt100");

/**
 * Method to begin the game.
 */
function start() {
    
    // Add the player to the list of observers.
    observers.push(player);
    
    // Paint the world. And the observers.
    generateStars();
    paintWorld();
    update();

    // Display how to play.
    let howToPlay = new HowToPlay(postHowToPlay);
    howToPlay.appear();

}

/**
 * Method for game start after exiting how to play pop-up.
 */
function postHowToPlay() {

    // Show pause button.
    pauseBtn = new Pause(width - 7.5, 7.5, 15, 15, function() {

        togglePause();

        // Make new pop up.
        pauseMenu = new PauseMenu(function(){
            togglePause();
        });
        pauseMenu.appear();

    });
    observers.push(pauseBtn);

    // Start update loop for game.
    toggleGameLoop();

    // Bind buttons controller buttons to player movement.
    let rightBtn = document.getElementById("right");
    let leftBtn = document.getElementById("left");
    rightBtn.onclick = function() { player.right() };
    leftBtn.onclick = function() { player.left() };

    // Start the game timer.
    toggleTimer();

    // Start the enemy spawner.
    toggleEnemySpawner();

    // Game started flag.
    gameHasStarted = true;

}

/**
 * Method to toggle the game loop on and off.
 */
function toggleGameLoop() {

    // Loop is off.
    if (!toggleGameLoop.isLoopOn) {
        toggleGameLoop.loopID = window.setInterval(function updateLoop() {
            update();
        }, 50);
        toggleGameLoop.isLoopOn = true;

    // Loop is on.
    } else {
        window.clearInterval(toggleGameLoop.loopID);
        toggleGameLoop.isLoopOn = false;
    }
}

/**
 * Method to toggle the game timer. Used to keep track of game end.
 */
function toggleTimer() {

    // Start game timer.
    if (!toggleTimer.isOn) {
        toggleTimer.timerID = window.setInterval(function() {
            time = time - 1;
            document.getElementById("time-numeric").innerHTML = time;

            if (Player.score == 100) {
                timeAt100 += 1;
            }
    
            // Check if game has ended.
            if (time == 0) {
                stopGame(0);
            }
    
            // Check if difficulty should be increased.
            if (time == 80) {
                increaseDifficulty();   // to easy
            } else if (time == 57) {
                increaseDifficulty();   // to medium
            } else if (time == 34) {
                increaseDifficulty();   // to hard
            } else if (time == 11) {
                increaseDifficulty();   // to extreme
            }
    
        }, 1000);
        toggleTimer.isOn = true;

    // Stop game timer.
    } else {
        window.clearInterval(toggleTimer.timerID);
        toggleTimer.isOn = false;
    }

}

/**
 * Method to toggle the spawning of enemies on and off.
 */
function toggleEnemySpawner() {

    // Keep track fo spawn rate for difficulty.
    if (toggleEnemySpawner.spawnRate == undefined) {
        toggleEnemySpawner.spawnRate = 2000;
    }

    // Turning on the spawner.
    if (toggleEnemySpawner.isOn === undefined || !toggleEnemySpawner.isOn) {

        toggleEnemySpawner.spawnerID = window.setInterval(function enemySpawner() {
            let enemy = new Enemy();
            observers.push(enemy);
        }, toggleEnemySpawner.spawnRate);
        toggleEnemySpawner.isOn = true;

    // Turning off the spawner.
    } else {
        window.clearInterval(toggleEnemySpawner.spawnerID);
        toggleEnemySpawner.isOn = false;
    }

}

/**
 * Method to pause game and reset game state. Called when timer is up and when power button is hit.
 * @param {Boolean} wasInterrupted True if the game was interrupted before natural game end.
 */
function stopGame(wasInterrupted) {

    togglePause();

    // Game reached its natural end.
    if (!wasInterrupted) {

        // Show end screen.
        let endOfGame = new GameOver(function(){});
        endOfGame.appear();

        // Take metrics.
        let highscore = getFromStorage("highscore");
        if (Player.score > highscore || highscore == null) {
            saveToStorage("highscore", Player.score.toString());
        }

        let avgTimeAt100 = getFromStorage("avgAt100");
        let gameCompletions = getFromStorage("completions");
        
        if (gameCompletions == null) {
            saveToStorage("completions", "1");
            saveToStorage("avgAt100", Math.trunc(timeAt100).toString());
        } else {
            let new_completions = parseInt(gameCompletions) + 1;
            let new_average = Math.trunc(((parseInt(avgTimeAt100) * gameCompletions) + timeAt100) / new_completions);
            saveToStorage("completions",  new_completions.toString());
            saveToStorage("avgAt100", new_average);
        }

        // Bind metrics to DOM objects.
        document.getElementById("high-score-numeric").innerHTML = getFromStorage("highscore");
        document.getElementById("average-numeric").innerHTML = getFromStorage("avgAt100");

        // End game flag.
        gameHasStarted = false;

    // Power button was hit.
    } else {
        resetGameState();
        gameHasStarted = false;
    }
}

/**
 * Method for returning to main menu at game end or at game pause.
 */
function returnToMainMenu() {

    // Reset the game state. 
    resetGameState();

    // End game flag.
    gameHasStarted = false;

    // Reload main menu.
    startUp();
}

/**
 * Method to reset game state.
 */
function resetGameState() {

    // Reset difficulty and enemy speed.
    increaseDifficulty.difficulty = "start";
    Enemy.v = 4;
    toggleEnemySpawner.spawnRate = 2000;

    // Clear the list of game objects.
    observers = [];

    // Reset player.
    player = new Player();

    // Reset game state data.
    time = 90;
    document.getElementById("time-numeric").innerHTML = time;
    Player.score = 100;
    document.getElementById("score-numeric").innerHTML = Player.score;
    timeAt100 = 0;
}

/**
 * Method to pause and resume game logic.
 */
function togglePause() {

    // Stop dispatching updates.
    toggleGameLoop();

    // Toggle the enemy spawner.
    toggleEnemySpawner();

    // Toggle the timer.
    toggleTimer();
}

/**
 * update method for game logic loop.
 */
function update() {
    paintWorld();
    observers.forEach(observer => observer.update());
}

/**
 * Method to increase the difficulty of the game at certain time stamps.
 * Assumes spawner has already begun (already in start state) before this 
 * method is called.
 * 6, 125 = extreme
 * 6, 250 = hard
 * 4, 500 = medium
 * 4, 1000 = easy
 * 4, 2000ms = start
 */
function increaseDifficulty() {
    
    switch (increaseDifficulty.difficulty) {

        case undefined:
            toggleEnemySpawner();
            toggleEnemySpawner.spawnRate = 1000;
            toggleEnemySpawner();
            increaseDifficulty.difficulty = "easy";
            break;

        case "start":
            toggleEnemySpawner();
            toggleEnemySpawner.spawnRate = 1000;
            toggleEnemySpawner();
            increaseDifficulty.difficulty = "easy";
            break;

        case "easy":
            toggleEnemySpawner();
            toggleEnemySpawner.spawnRate = 500;
            toggleEnemySpawner();
            increaseDifficulty.difficulty = "medium";
            break;

        case "medium":
            Enemy.v = 6;
            toggleEnemySpawner();
            toggleEnemySpawner.spawnRate = 250;
            toggleEnemySpawner();
            increaseDifficulty.difficulty = "hard";
            break;

        case "hard":
            toggleEnemySpawner();
            toggleEnemySpawner.spawnRate = 125;
            toggleEnemySpawner();
            increaseDifficulty.difficulty = "extreme";
            break;

        default:
            break;

    }
}

/**
 * Saves data to storage. Wraps around local storage to allow 
 * developer to switch storag etype if desired.
 * @param {String} key An identifier for the data being saved.
 * @param {String} value The value of the data being saved.
 */
function saveToStorage(key, value) {
    if (window.localStorage) {
        window.localStorage.setItem(key, value);
    }
}

/**
 * Returns the value associated with the key from storage.
 * @param {String} key An identifier for the data saved in storage.
 */
function getFromStorage(key) {
    if (window.localStorage) {
        return window.localStorage.getItem(key);
    }

    return "";
}