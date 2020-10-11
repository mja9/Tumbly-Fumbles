"use strict";

/**
 * Initialize canvas appearance and functionality.
 */
function init() {

    // Draw bottom border of tv.
    graphics.fillStyle = "gray";
    graphics.fillRect(0, height - height / 10, width, height / 10);

    // Create power button and place at bottom of tv.
    let btnY = (height - height / 10) + (height / 20);
    let btnX = width / 2;
    let btnW = width / 18;
    let btnH = height / 10;
    let btn = new PowerOn(btnX, btnY, btnW, btnH, 
        function() { 
            if (btn.isOff == true) {
                startUp();
                btn.paint();
                btn.isOff = false;
            } else {
                shutDown();
                btn.paint();
                btn.isOff = true;
            }
         });

    // Paint the button.
    btn.paint();
}

/**
 * Canvas behaviour after screen has been turned on.
 */
function startUp() {

    // Turn screen on.
    graphics.fillStyle = "white";
    graphics.fillRect(0, 0, width, screenHeight);

    // Draw game name.
    graphics.fillStyle = "#00ff99";
    graphics.font = "30px Arial";
    graphics.fillText("Tumbly Fumbles", width / 8, screenHeight / 2);

    // Draw game start button.
    let startX = width / 2;
    let startY = screenHeight - screenHeight / 4;
    let startH = screenHeight / 6;
    let startW = width / 4;
    let startBtn = new GameStart(startX, startY, startW, startH, 
        function startEvent() {
            start();
        });
    startBtn.paint();

}

/**
 * Canvas behaviour when the screen is turned off.
 */
function shutDown() {

    // Restart game logic.
    if (gameHasStarted) {
        stopGame(1);
    }

    // Turn screen off.
    graphics.fillStyle = "black";
    graphics.fillRect(0, 0, width, screenHeight);

}

/**
 * Method to paint the game world every frame.
 */
function paintWorld() {

    // Paint background colors.
    graphics.fillStyle = "#000066";
    graphics.fillRect(0, 0, width, screenHeight);

    // Generate stars and paint them.
    paintStars();

    // Draw Ground.
    graphics.fillStyle = "#800000";
    graphics.fillRect(0, screenHeight - screenHeight / 15, width, screenHeight / 15);

}

/**
 * Method to paint stars in sky every frame.
 */
function paintStars() {

    graphics.fillStyle = "#ffcc00";

    // Paint the generated stars for this game instance.
    generateStars.generatedStars.forEach(star => {

        // Paint at that random location.
        graphics.beginPath();
        graphics.arc(star[0], star[1], 1, 0, 2 * Math.PI);
        graphics.fill();

    });
}

/**
 * Randomly generates 400 - 1000 stars at different locations on the screen.
 */
function generateStars() {

    generateStars.generatedStars = [];

    // Generate a random number of stars between 400 - 1000 stars.
    let numStars = Math.random() * 600 + 400;

    // Paint that many stars.
    for (let i = 0; i < numStars + 1; i ++) {

        // Choose a random location.
        let starX = Math.random() * width;
        let starY = Math.random() * screenHeight - 5;

        // Save generated stars for repainting in this game instance.
        generateStars.generatedStars.push([starX, starY]);

    }

}

