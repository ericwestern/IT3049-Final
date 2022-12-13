var config = {
    width: 512,
    height: 506,
    backgroundColor: 0x228C22,
    scene: [BootScene, PlayScene],
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    }
}

window.onload = function() {
    var game = new Phaser.Game(config);
}