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
    this.load.image('OptionsButton', 'Assets/OptionsButton.png');
    this.load.image('QuitButton', 'Assets/QuitButton.png');
    this.load.image('Mughals', 'Assets/Mughals.png');
    this.load.imag('Vikings', 'Assets/Vikings.png');
    this.load.image('King John', 'Assets/KingJohn.png');
}
function create() { 
    backgroud = this.add.image(400, 300, 'background'); 
    StartButton = this.add.image(200, 500, 'StartButton').setInteractive().on('pointerdown', () => startGame());
    OptionsButton = this.add.image(400, 500, 'StartButton').setInteractive().on('pointerdown', () => startGame());
    QuitButton = this.add.image(600, 500, 'StartButton').setInteractive().on('pointerdown', () => startGame());
    Level1 = this.add.image(200, 300, 'Mughals').setInteractive().on('pointerdown', () => startGame());
    Level2 = this.add.image(400, 300, 'Vikings').setInteractive().on('pointerdown', () => startGame());
    Level3 = this.add.image(600, 300, 'King John').setInteractive().on('pointerdown', () => startGame());
}
function update() {}

function startGame() {
    backgroud.setTexture('background2');
    StartButton.destroy();
    this.add.typeText(300, 250, 'Game Started', { fontSize: '32px', fill: '#000' });

    
}

