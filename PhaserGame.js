const gameState = {}
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    parent: 'game',
};

var game = new Phaser.Game(config);

function preload() { 
    this.load.image('background', 'Assets/Background.png'); 
    this.load.image('background2', 'Assets/Background2.png');
    this.load.image('StartButton', 'Assets/StartButton.png');
}
function create() { 
    backgroud = this.add.image(400, 300, 'background'); 
    StartButton = this.add.image(400, 300, 'StartButton').setInteractive().on('pointerdown', () => startGame());
}
function update() {}

function startGame() {
    backgroud.setTexture('background2');
    StartButton.destroy();
    this.add.typeText(300, 250, 'Game Started', { fontSize: '32px', fill: '#000' });

    
}

