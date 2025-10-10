const gameState = {}
var PlayerName = " "
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
    //loads all images used in the game
    this.load.image('background', 'Assets/main menu/Background.png'); 
    this.load.image('background2', 'Assets/Background2.png');
    this.load.image('OptionButton', 'Assets/buttons/OptionButton.png');
    this.load.image('Victorian', 'Assets/buttons/Victoria.png');
    this.load.image('Vikings', 'Assets/buttons/Vikings.png');
    this.load.image('Medival', 'Assets/buttons/KingJohn.png');
    this.load.image('BG1.1', 'Assets/Background2.png');
    this.load.image('BG2.1', 'Assets/BackgroundLV2.png');
    this.load.image('BG3.1', 'Assets/BackgroundLV3.png');
    this.load.image('MenuButton', 'Assets/buttons/Menu.png');
}

function create() { 
    //sets up main menu
    this.background = this.add.image(400, 300, 'background'); 
    this.OptionButton = this.add.image(400, 500, 'OptionButton').setInteractive();
    this.Level2 = this.add.image(400, 300, 'Medival').setInteractive();
    this.Level1 = this.add.image(200, 300, 'Vikings').setInteractive();
    this.Level3 = this.add.image(600, 300, 'Victorian').setInteractive();

    this.OptionButton.on('pointerdown', () => Options.call(this));
    this.Level2.on('pointerdown', () => Level_2.call(this,PlayerName));
    this.Level1.on('pointerdown', () => Level_1.call(this,PlayerName));
    this.Level3.on('pointerdown', () => Level_3.call(this,PlayerName));
}
function update() {
    

}
function Level_1(PlayerName) {
    //Removes all main menu items
    this.Level1.visible = false;
    this.Level2.visible = false;
    this.Level3.visible = false;
    this.OptionButton.visible = false;
    //checks if player name has been set if not calls function to set it
    if (PlayerName == " "){
        PlayerName= PickPlayerName.call(this,1);
        return;

    }
    //adds level 1 background and menu button
    this.add.image(400, 300, 'BG1.1');
    this.MenuButton = this.add.image(700, 550, 'MenuButton').setInteractive();
    this.MenuButton.on('pointerdown', () => Menu.call(this,));
}
function Level_2(){
    //Removes all main menu items
    this.Level1.visible = false;
    this.Level2.visible = false;
    this.Level3.visible = false;
    this.OptionButton.visible = false;
    //checks if player name has been set if not calls function to set it
    if (PlayerName == " "){
        PlayerName= PickPlayerName.call(this,2);
        return;

    }
    //adds level 2 background and menu button
    this.add.image(400, 300, 'BG2.1');
    this.MenuButton = this.add.image(700, 550, 'MenuButton').setInteractive();
    this.MenuButton.on('pointerdown', () => Menu.call(this));
    
}
function Level_3(){
    //Removes all main menu items
    this.Level1.visible = false;
    this.Level2.visible = false;
    this.Level3.visible = false;
    this.OptionButton.visible = false;
    //checks if player name has been set if not calls function to set it
    if (PlayerName == " "){
        PlayerName= PickPlayerName.call(this,3);
        return;

    }
    //adds level 3 background and menu button
    this.add.image(400, 300, 'BG3.1');
    this.MenuButton = this.add.image(700, 550, 'MenuButton').setInteractive();
    this.MenuButton.on('pointerdown', () => Menu.call(this));
}
function Options() {
    this.OptionButton.visible = false;
    this.Level1.visible = false;
    this.Level2.visible = false;
    this.Level3.visible = false;
}
function Menu() {
    this.add.image(400, 300, 'background');
    this.MenuButton.visible = false;
}
function PickPlayerName(ID){
    // Display background and prompt text
    this.add.image(400, 300, 'background');
    // Draw a black rectangle as a background for the text
    const graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 0.7); // Black with 70% opacity
    graphics.fillRect(200, 200, 400, 120);
    // Add prompt text centered in the box
    this.text = this.add.text(400, 240, 'Enter Player Name:', { fontSize: '28px', fill: '#fff', align: 'center' })
        .setOrigin(0.5);
    // Create an HTML input element
    let inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.id = 'nameInput';
    inputElement.style.position = 'absolute';
    inputElement.style.left = (this.sys.game.canvas.offsetLeft + 300) + 'px';
    inputElement.style.top = (this.sys.game.canvas.offsetTop + 280) + 'px';
    inputElement.style.fontSize = '20px';
    inputElement.style.zIndex = 1000;
    document.body.appendChild(inputElement);
    // Listen for the Enter key to submit the name
    inputElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            let playerName = inputElement.value;
            document.body.removeChild(inputElement);
            this.text.setText('Welcome, ' + playerName + '!');
             gameState.playerName = playerName;
            // Now go to the correct level
            if (ID == 1){
                Level_1.call(this, playerName);
            }
            if (ID == 2){
                Level_2.call(this, playerName);
            }
            if (ID == 3){
                Level_3.call(this, playerName);
            }
        }
    });
}

