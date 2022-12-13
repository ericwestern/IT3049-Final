class PlayScene extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    create() {
        this.music = this.sound.add("bgmusic", {volume: 0.5});
        this.music.play();

        this.speed = 0;
        this.score = 0;
        this.lives = 3;
        this.dead = false;
        this.roadWidth = 172;
        this.background = this.add.tileSprite((config.width / 2) - (this.roadWidth / 2), 0, this.roadWidth, config.height, "background");
        this.background.setOrigin(0, 0);

        this.scoreText = this.add.text(10, 10, "Score: 0");

        this.player = this.physics.add.image(config.width / 2, 460, "playerCar");
        this.player.scale = .4
        this.player.setCollideWorldBounds(true);

        this.heartOne = this.add.image(config.width - 16, 16, "hp_full");
        this.heartTwo = this.add.image(config.width - 48, 16, "hp_full");
        this.heartThree = this.add.image(config.width - 80, 16, "hp_full");

        this.lose = this.add.image(config.width / 2, 200, "youlose");
        this.replay = this.add.image(config.width / 2, 300, "replay");
        this.lose.setVisible(false);
        this.replay.setVisible(false);
        this.replay.setInteractive();
        this.replay.on("pointerup", this.restartScene, this);

        //this.oilSlick.setInteractive();

        this.cursorKeys = this.input.keyboard.createCursorKeys();

        this.obstacles = this.physics.add.group({
            classType: Obstacle,
            runChildUpdate: true
        });

        this.obstacleTimer = this.time.addEvent({
            delay: 5000,
            callback: this.spawnObstacle,
            callbackScope: this,
            loop: true,
            startAt: 0
        });

        this.physics.add.overlap(this.player, this.obstacles, this.obstacleHit, null, this);
    }

    obstacleHit(player, obstacle) {
        if (obstacle.type === "oilSlick")
            this.spinOut();
        else if (obstacle.type === "rock")
            this.hitRock(player);
        obstacle.destroy();
        this.playerHurt();
    }

    spinOut() {
        this.inSpin = true;
    }

    hitRock(player) {
        this.explode = true;
        var explosion = new Explosion(this, player.x, player.y);
        player.disableBody(true, true);

        this.time.addEvent({
            delay: 1000,
            callback: this.resetPlayer,
            callbackScope: this,
            loop: false
        });
    }

    spawnObstacle() {
        if (this.speed > 0) {
            var randomX = Phaser.Math.Between((config.width / 2) - (this.roadWidth / 2), (config.width / 2) + (this.roadWidth / 2));
            this.obstacles.get(randomX, 0);
        }
    }

    playerHurt() {
        switch(this.lives) {
            case 1:
                //player dies
                this.heartOne.setTexture("hp_empty");
                this.gameOver();
                break;
            
            case 2:
                this.heartTwo.setTexture("hp_empty");
                break;

            case 3:
                this.heartThree.setTexture("hp_empty");
                break;

            default:
                break;
        }
        this.lives--;
    }

    movePlayer() {
        if (this.cursorKeys.left.isDown && this.player.x > 170) {
            this.player.setVelocityX(-200);
        } else if (this.cursorKeys.right.isDown && this.player.x < 342) {
            this.player.setVelocityX(200);
        } else {
            this.player.setVelocityX(0);
        }
        this.player.setDepth(1);
    }

    resetPlayer() {
        this.player.enableBody(true, config.width / 2, 460, true, true);
    }

    setObstacleSpeed() {
        this.obstacles.children.each(obstacle => {
            obstacle.setSpeed(this.speed);
        });
    }

    gameOver() {    
        this.dead = true;    
        this.lose.setVisible(true);
        this.replay.setVisible(true);
        this.cursorKeys = null;
    }

    restartScene() {
        this.music.stop();
        this.registry.destroy();
        this.events.off();
        this.scene.restart();
    }

    update() {
        if (this.inSpin) {
            this.player.setVelocityX(0);
            if (this.speed > 0) {
                this.speed -= 0.002;
                this.player.rotation += 0.02;
            } else {
                this.speed = 0;
                this.player.rotation = 0;
                this.inSpin = false;
            }
        } else if (this.explode) {
            if (this.speed > 0) {
                this.speed -= 0.01;
            } else {
                this.speed = 0;
                this.explode = false;
            }
        } else if (!this.dead) {
            if (this.cursorKeys.up.isDown && this.speed < 1.0) {
                this.speed += 0.005;
            }
            this.movePlayer();
        }
        
        this.background.tilePositionY -= this.speed;
        this.setObstacleSpeed();
        this.score += this.speed / 100;
        if (this.score > 0)
            this.scoreText.setText("Score: " + Phaser.Math.RoundTo(this.score, 0));
    }
}