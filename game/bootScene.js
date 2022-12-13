class BootScene extends Phaser.Scene {
    constructor() {
        super("bootGame");
        this.start = false;
    }
    
    preload() {
        this.load.image("background", "assets/images/road.png");
        this.load.image("playerCar", "assets/images/playerCar.png");
        this.load.image("oilSlick", "assets/images/oil.png");
        this.load.image("rock", "assets/images/rock.png");
        this.load.image("hp_full", "assets/images/hp_dot.png");
        this.load.image("hp_empty", "assets/images/hp_dot_empty.png");
        this.load.image("youlose", "assets/images/youlose.png");
        this.load.image("replay", "assets/images/replay.png");
        this.load.audio("bgmusic", ["assets/audio/race_to_mars.mp3"]);
        this.load.spritesheet("explosion", "assets/spritesheets/explosion_100.png", {
            frameWidth: 100,
            frameHeight: 100
        });
    }

    create() {        
        this.cameras.main.setBackgroundColor(0x000000)
        var startText = this.add.text(100, 100, "Start Game");
        startText.setInteractive();
        startText.on("pointerup", this.startGame, this);

        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
        });
    }

    startGame() {
        this.scene.start("playGame");
    }
}