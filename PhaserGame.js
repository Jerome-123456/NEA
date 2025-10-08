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
    this.load.image('Mughals', 'Assets/Mughals.png');
    this.load.image('Vikings', 'Assets/Vikings.png');
    this.load.image('King John', 'Assets/KingJohn.png');
    this.load.audio('bgMusic', 'Assets/BackgroundMusic.mp3')
    ;
}
function create() { 
    backgroud = this.add.image(400, 300, 'background'); 
    OptionButton = this.add.image(190, 500, 'StartButton').setInteractive().on('pointerdown', () => startGame());
    QuitButton = this.add.image(610, 500, 'StartButton').setInteractive().on('pointerdown', () => QuitGame());
    Level1 = this.add.image(200, 300, 'Mughals')
    Level2 = this.add.image(400, 300, 'Vikings')
    Level3 = this.add.image(600, 300, 'King John')
    bgMusic = this.sound.add('bgMusic', { loop: true });
    bgMusic.play();
}
function update() {}

function startGame() {
    backgroud.setTexture('background2');
    StartButton.destroy();
    this.add.typeText(300, 250, 'Game Started', { fontSize: '32px', fill: '#000' });

    
}
function QuitGame() {
    this.add.typeText(300, 250, 'Game Quit', { fontSize: '32px', fill: '#000' });
    this.scene.pause();
    bgMusic.stop();
}

