"use strict";
const canvas = document.getElementById("tv");
const graphics = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const screenHeight = height - height / 10;

/**
 * A class defining abstract game button behaviour.
 */
class Button {

    /**
     * Constructor for new button.
     * @param {int} x X-position of button center
     * @param {int} y Y-position of button center
     * @param {int} w Width of button
     * @param {int} h Height of buttn
     * @param {Function} action Click action for button
     */
    constructor(x, y, w, h, action) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.action = action;
        this.click(this);
    }

    /**
     * Sets the click handler for the new button to be executed on the bubbling phase.
     */
    click(btn) {

        canvas.addEventListener("click",
            function buttonClick(e) {

                let x = fix_X(e.clientX);
                let y = fix_Y(e.clientY);

                // Check for collision.
                if (x >= btn.x - btn.w / 2 & x <= btn.x + btn.w / 2) {
                    if (y >= btn.y - btn.h / 2 & y <= btn.y + btn.h / 2) {
                        btn.click_extra();
                        btn.action();
                    }

                }
            });
    }

    /**
     * No-op paint strategy to be overidden in concrete button implementations.
     */
    paint() {
    }

    /**
     * No-op ornament method for additional click functionality to be overriden.
     */
    click_extra() {
    }
    
}

/**
 * A conrete button class defining screen power button behaviour.
 */
class PowerOn extends Button {

    /**
     * Constructor for concrete power on button in game.
     * @param {int} x X-position of button center
     * @param {int} y Y-position of button center
     * @param {int} w Width of button
     * @param {int} h Height of buttn
     * @param {Function} action Click action for button
     */
    constructor(x, y, w, h, action) {
        super(x, y, w, h, action);
        this.isOff = true;
        this.image = document.getElementById("power-idle");
    }

    /**
     * Image paint strategy.
     */
    paint() {
        graphics.drawImage(this.image, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    }

    /**
     * Method for changing color appearance depending on screen state.
     */
    click_extra() {
        if (this.isOff == true) {
            this.image = document.getElementById("power-clicked");
        } else {
            this.image = document.getElementById("power-idle");
        }
    }

}

/**
 * A concrete button class defining game start button behavior.
 */
class GameStart extends Button {

    /**
     * Constructor for concrete start button in game.
     * @param {int} x X-position of button center
     * @param {int} y Y-position of button center
     * @param {int} w Width of button
     * @param {int} h Height of buttn
     * @param {Function} action Click action for button
     */
    constructor(x, y, w, h, action) {
        super(x, y, w, h, action);
        this.image = document.getElementById("start");
    }

    /**
     * Sets the click handler for the new button to be executed on the bubbling phase.
     */
    click(btn) {

        canvas.addEventListener("click",
              function buttonClick(e) {
  
                  let x = fix_X(e.clientX);
                  let y = fix_Y(e.clientY);
  
                  // Check for collision.
                  if (x >= btn.x - btn.w / 2 & x <= btn.x + btn.w / 2) {
                      if (y >= btn.y - btn.h / 2 & y <= btn.y + btn.h / 2) {
                          btn.action();
                          canvas.removeEventListener("click", buttonClick);
                      }
  
                  }
              });
      }

    /**
     * Image paint strategy.
     */
    paint() {
        graphics.drawImage(this.image, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    }

}

/**
 * A concrete button class defining pause game behaviour.
 */
class Pause extends GameStart {

    /**
     * Constructor for concrete start button in game.
     * @param {int} x X-position of button center
     * @param {int} y Y-position of button center
     * @param {int} w Width of button
     * @param {int} h Height of buttn
     * @param {Function} action Click action for button
     */
    constructor(x, y, w, h, action) {
        super(x, y, w, h, action);
        this.image = document.getElementById("pause");
    }

    /**
     * Update method for game loop.
     */
    update() {
        this.paint();
    }
}

/**
 * A concrete button class going back to menu.
 */
class Quit extends GameStart {

    /**
     * Constructor for concrete start button in game.
     * @param {int} x X-position of button center
     * @param {int} y Y-position of button center
     * @param {int} w Width of button
     * @param {int} h Height of buttn
     * @param {Function} action Click action for button
     */
    constructor(x, y, w, h, action) {
        super(x, y, w, h, action);
        this.image = document.getElementById("quit");
    }

}

/**
 * Fixes the click events to be translated to proper locations on the canvas.
 * @param {number} x X-coordinate of click event.
 */
function fix_X(x) {

    let bound = canvas.getBoundingClientRect();

    // Fix x-coord.
    let distance_x = bound.right - bound.left;
    let x_ratio = (x - bound.left) / distance_x;
    let new_x = Math.trunc(x_ratio * width);

    return new_x
}

/**
 * Fixes the click events to be translated to proper locations on the canvas.
 * @param {number} y Y-coordinate of click event.
 */
function fix_Y(y) {

    let bound = canvas.getBoundingClientRect();

    // Fix y-coord.
    let distance_y = bound.bottom - bound.top;
    let y_ratio = (y - bound.top) / distance_y;
    let new_y = Math.trunc(y_ratio * height); 

    return new_y;
}

/**
 * A class defining a player of this game.
 */
class Player {

    static score = 100;

    /**
     * Constructor for game player object.
     */
    constructor() { 
        this.x = width / 2;
        this.y = screenHeight - screenHeight / 15;
        this.w = 9;
        this.h = 15;
        this.v = 0;
        this.image = null;
    }

    static changeScore(amount) {
        Player.score = Player.score + amount;
        document.getElementById("score-numeric").innerHTML = Player.score;
    }

    /**
     * Sets the velocity of the player to move rightward.
     */
    right() {
        this.v = 2;
    }

    /**
     * Sets the velocity of the player to move leftward.
     */
    left() {
        this.v = -2;
    }

    /**
     * Method to move this player per frame.
     */
    move() {
        this.x = this.x + this.v;
    }

    /**
     * Method to paint this player per frame.
     */
    paint() {
        graphics.fillStyle = "#1aff1a";
        graphics.fillRect(this.x - this.w / 2, this.y - this.h, this.w, this.h);
    }

    /**
     * Repositions player if they move outside the screen bounds.
     */
    bounce() {
        if (this.x + this.w / 2 >= width) {
            this.x = width - this.w / 2;
        }

        if (this.x - this.w / 2 <= 0) {
            this.x = this.w / 2;
        }
    }

    /**
     * Method to update and paint player per frame of game loop.
     */
    update() {
        this.move();
        this.bounce();
        this.paint();
    }

}

/**
 * A class defining enmies in the game.
 */
class Enemy {

    /**
     * Speed of enemy objects. Changes to alter gameplay difficulty.
     */
    static v = 4; 

    /**
     * Constructor for game enemy object.
     */
    constructor() {
        this.w = 15;
        this.h = 9;
        this.x = Math.random() * width;
        
        // Make sure enemies are not cut off.
        this.x = this.x - this.w / 2 <= 0 ? this.x + this.w / 2 : 
                    this.x + this.w / 2 >= width ? this.x - this.w / 2 : this.x;
        this.y = -this.w / 2;
    }

    /**
     * Method to paint this enemy on the screen.
     */
    paint() {
        graphics.fillStyle = "#ff1a1a";
        graphics.beginPath();
        graphics.moveTo(this.x, this.y + this.h / 2);
        graphics.lineTo(this.x + this.w / 2, this.y - this.h / 2);
        graphics.lineTo(this.x - this.w / 2, this.y - this.h / 2);
        graphics.closePath();
        graphics.fill();
    }

    /**
     * Method to move this enemy object every frame.
     */
    move() {
        this.y = this.y + Enemy.v;
    }

    /**
     * Method to check if enemy hits the ground and should be removed from game.
     */
    bounce() {
        if (this.y + this.h / 2 >= screenHeight - screenHeight / 15) {
            this.remove();
        }
    }

    /**
     * Returns if the enemy has collided with the player.
     */
    didCollide() {
        // Check if their x line up
        let playerLeftIsAfterLeftSide = player.x - player.w / 2 >= this.x - this.w / 2;
        let playerLeftIsBeforeRightSide = player.x - player.w / 2 <= this.x + this.w / 2;
        let playerRightIsAfterLeftSide = player.x + player.w / 2 >= this.x - this.w / 2;
        let playerRightIsBeforeRightSide = player.x + player.w / 2 <= this.x + this.w / 2;

        if ((playerLeftIsAfterLeftSide && playerLeftIsBeforeRightSide) || 
            (playerRightIsAfterLeftSide && playerRightIsBeforeRightSide)) {

                // Check if the enemy has collided with the player.
                if (this.y + this.h / 2 >= player.y - player.h / 2) {
                    return true;
                }
            }
        return false;
    }

    /**
     * Method for updating and painting enemy every frame of game loop.
     */
    update() {
        this.move();
        if (this.didCollide()) {
            this.hit();
        }
        this.bounce();
        this.paint();
    }

    /**
     * Method for enemy behaviour upon collision with player.
     */
    hit() {
        Player.changeScore(-2);
        this.remove();
    }

    /**
     * Removes this enemy from the list of game objects recieving update commands.
     */
    remove() {
        let new_observers = [];
        observers.forEach(observer => {

            if (observer != this) {
                new_observers.push(observer);
            }

        });

        observers = new_observers;
    }

}

class PopUp {

    constructor(disappearingAct) {
        this.x = width / 2;
        this.y = screenHeight / 2;
        this.w = (width / 3) * 2
        this.h = screenHeight / 3;
        this.disappearingAct = disappearingAct;
        this.disappear(this);
    }

    appear() {
        graphics.fillStyle = "#7979d2";
        graphics.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
        this.showContent();
    }

    showContent() {
    }

    disappear(popup) {
        canvas.addEventListener("click",
            function buttonClick(e) {

                let x = fix_X(e.clientX);
                let y = fix_Y(e.clientY);

                // Check for collision.
                if (x >= popup.x - popup.w / 2 & x <= popup.x + popup.w / 2) {
                    if (y >= popup.y - popup.h / 2 & y <= popup.y + popup.h / 2) {
                        popup.disappearingAct();
                        canvas.removeEventListener("click", buttonClick);
                    }

                }
            });
    }
}

class HowToPlay extends PopUp {

    constructor(disappearingAct) {
        super(disappearingAct);
    }

    showContent() {
        graphics.font = "8px Arial";
        graphics.fillStyle = "#ffdb4d";
        graphics.fillText("Fumbles...Fumbles?...There you are. Listen,", this.x - this.w / 2 + 10, this.y - this.h / 2 + this.h / 4);
        graphics.fillText("You got Tumblies headed your way!", this.x - this.w / 2 + 10, this.y - this.h / 2 + (2 * this.h / 4));
        graphics.fillText("Use the controller on the right to dodge them.", this.x - this.w / 2 + 10, this.y - this.h / 2 + (3 * this.h / 4));
        graphics.fillText("(Click here to exit.)", this.x - this.w / 4, this.y + this.h / 2 - 2);
    }

}

class PauseMenu {

    constructor(disappearingAct) {
        this.x = width / 2;
        this.y = screenHeight / 2;
        this.w = (width / 3) * 2
        this.h = screenHeight / 3;
        this.disappearingAct = disappearingAct;
        this.disappear();
    }

    showContent() {

        // Are you sure you want to quit?
        graphics.font = "8px Arial";
        graphics.fillStyle = "#ffdb4d";
        graphics.fillText("Are you sure you want to quit?", this.x - this.w / 2 + 10, this.y - this.h / 2 + this.h / 4);

        // Add button.
        let pauseClick = this.pauseClick;
        this.quitBtn = new Quit(this.x, this.y, this.w / 4, this.h / 4, function() {
            returnToMainMenu();
            canvas.removeEventListener("click", pauseClick);
        });
        this.quitBtn.paint();

        // Click to exit pause.
        graphics.fillText("(Click here to exit pause menu.)", this.x - this.w / 4, this.y + this.h / 2 - 2);

    }

    appear() {
        graphics.fillStyle = "#7979d2";
        graphics.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
        this.showContent();
    }

    disappear() {
        let pauseClick = this.pauseClick;
        canvas.addEventListener("click", pauseClick);
    }

    pauseClick(e) {

        let x = fix_X(e.clientX);
        let y = fix_Y(e.clientY);

        // Make sure we aren't hitting the button. No-op.
        if (x >= pauseMenu.quitBtn.x - pauseMenu.quitBtn.w / 2 & x <=  pauseMenu.quitBtn.x + pauseMenu.quitBtn.w / 2) {
            if (y >=  pauseMenu.quitBtn.y - pauseMenu.quitBtn.h / 2 & y <=  pauseMenu.quitBtn.y + pauseMenu.quitBtn.w / 2) {
            }

        // Check for collision.
        } else if (x >= pauseMenu.x - pauseMenu.w / 2 & x <= pauseMenu.x + pauseMenu.w / 2) {
            if (y >= pauseMenu.y - pauseMenu.h / 2 & y <= pauseMenu.y + pauseMenu.h / 2) {
                pauseMenu.disappearingAct();
                canvas.removeEventListener("click", pauseMenu.pauseClick);
                pauseBtn.click(pauseBtn);
            }

        }
    }

}

class GameOver extends PopUp {

    constructor(disappearingAct) {
        super(disappearingAct);
    }

    showContent() {

        // Are you sure you want to quit?
        graphics.font = "8px Arial";
        graphics.fillStyle = "#ffdb4d";
        graphics.fillText("Game Over", this.x - this.w / 2 + 10, this.y - this.h / 2 + this.h / 4);

        // Add button.
        let pauseClick = this.pauseClick;
        this.quitBtn = new Quit(this.x, this.y, this.w / 4, this.h / 4, function() {
            returnToMainMenu();
            canvas.removeEventListener("click", pauseClick);
        });
        this.quitBtn.paint();

    }
}