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
    this.load.image('ExitButton', 'Assets/buttons/ExitButton.png');
    this.load.text('bannedNames', 'Files/BannedNames.txt');

    
}

function create() { 
    //sets up main menu
    this.background = this.add.image(400, 300, 'background'); 
    this.OptionButton = createCircleButton(this, 400, 500, 'OptionButton',100).setInteractive();
    this.Level2 = createCircleButton(this, 400, 300, 'Medival', 120).setInteractive();
    this.Level1 = createCircleButton(this, 200, 300, 'Vikings', 120).setInteractive();
    this.Level3 = createCircleButton(this, 600, 300, 'Victorian',120).setInteractive();
    

    this.OptionButton.on('pointerdown', () => Options.call(this,gameState.playerName));
    this.Level2.on('pointerdown', () => Level_2.call(this,gameState.playerName));
    this.Level1.on('pointerdown', () => Level_1.call(this,gameState.playerName));
    this.Level3.on('pointerdown', () => Level_3.call(this,gameState.playerName));
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
    if (PlayerName == " " || PlayerName == undefined){
        PlayerName= PickPlayerName.call(this,1);
        return;

    }
    //adds level 1 background and menu button
    this.add.image(400, 300, 'BG1.1');
    this.MenuButton = this.add.image(775, 575, 'MenuButton').setInteractive();
    this.MenuButton.on('pointerdown', () => Menu.call(this,));

}
function Level_2(PlayerName){
    //Removes all main menu items
    this.Level1.visible = false;
    this.Level2.visible = false;
    this.Level3.visible = false;
    this.OptionButton.visible = false;
    //checks if player name has been set if not calls function to set it
    if (PlayerName == " " || PlayerName == undefined){
        PlayerName= PickPlayerName.call(this,2);
        return;

    }
    //adds level 2 background and menu button
    this.add.image(400, 300, 'BG2.1');
    this.MenuButton = this.add.image(775, 575, 'MenuButton').setInteractive();
    this.MenuButton.on('pointerdown', () => Menu.call(this,));
}
    
function Level_3(PlayerName ){
    //Removes all main menu items
    this.Level1.visible = false;
    this.Level2.visible = false;
    this.Level3.visible = false;
    this.OptionButton.visible = false;
    //checks if player name has been set if not calls function to set it
    if (PlayerName == " " || PlayerName == undefined){
        PlayerName= PickPlayerName.call(this,3);
        return;

    }
    //adds level 3 background and menu button
    this.add.image(400, 300, 'BG3.1');
    this.MenuButton = this.add.image(775, 575, 'MenuButton').setInteractive();
    this.MenuButton.on('pointerdown', () => Menu.call(this,));
}

function Options(PlayerName) {
    // Removes all main menu items
    this.OptionButton.visible = false;
    this.Level1.visible = false;
    this.Level2.visible = false;
    this.Level3.visible = false;
    //adds options menu background and exit button
    const graphics = this.add.graphics();
    graphics.fillStyle(0x000000, gameState.Opacity); // Black with 70% opacity
    graphics.fillRect(200, 100, 400, 400);
    this.Exit = this.add.image(560, 120, 'ExitButton').setInteractive();
    this.Exit.on('pointerdown', () => { // When exit button is clicked
        this.Exit.visible = false;
        this.Option1.visible = false;
        this.Option2.visible = false
        this.text.visible = false;
        graphics.destroy();
        create.call(this);
    });
    this.text = this.add.text(350, 100, 'Options', { fontSize: '28px', fill: '#fff', align: 'center' });
    this.Option1 = this.text = this.add.text(250, 200, 'Player Name:'+ gameState.playerName, { fontSize: '24px', fill: '#fff' }).setInteractive();
    this.Option1.on('pointerdown', () => PickPlayerName.call(this,0));
    this.Option2 = this.add.text(250, 300,'Menu Opacity: '+(gameState.Opacity*100)+'%',{fontSize: '28px', fill: '#fff', align: 'center' } ).setInteractive();
    this.Option2.on('pointerdown', () => {
        gameState.Opacity = SetOpacity.call(this)
    });

    

    
        
}
function Menu() {
    this.add.image(400, 300, 'background');
    this.MenuButton.visible = false;
    const graphics = this.add.graphics();
    graphics.fillStyle(0x000000, gameState.Opacity); // Black with 70% opacity
    graphics.fillRect(200, 100, 400, 400);
    this.text = this.add.text(350, 100, 'Menu', { fontSize: '28px', fill: '#fff', align: 'center' });
}
function PickPlayerName(ID){
    // Display background and prompt text
    this.add.image(400, 300, 'background');
    // Draw a black rectangle as a background for the text
    const graphics = this.add.graphics();
    graphics.fillStyle(0x000000, gameState.Opacity); // Black with 70% opacity
    graphics.fillRect(100, 200, 600, 120); 
    // Add prompt text centered in the box
    const promptText = this.add.text(400, 240, 'Enter Player Name:', { fontSize: '28px', fill: '#fff', align: 'center' })
        .setOrigin(0.5);
    // Create an HTML input element
    let inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.id = 'nameInput';
    inputElement.style.position = 'absolute';
    inputElement.style.left = (this.sys.game.canvas.offsetLeft + 275) + 'px';
    inputElement.style.top = (this.sys.game.canvas.offsetTop + 280) + 'px';
    inputElement.style.width = '250px';
    inputElement.style.fontSize = '20px';
    inputElement.style.zIndex = 1000;
    document.body.appendChild(inputElement);
     // Get banned names as an array (lowercase, trimmed)
    const bannedNamesRaw = this.cache.text.get('bannedNames');
    const bannedNames = bannedNamesRaw
        .split('\n')
        .map(name => name.trim().toLowerCase())
        .filter(name => name.length > 0);

    inputElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            let playerName = inputElement.value.trim();
            if (playerName.length > 10) {
                promptText.setText('Name too long, max 10 characters');
                return;
            }
            if (playerName.length === 0) {
                promptText.setText('Name cannot be blank');
                return;
            }
            if (bannedNames.includes(playerName.toLowerCase())) {
                promptText.setText('Name not allowed. Choose another.');
                return;
            }
            // Valid name
            gameState.playerName = playerName;
            document.body.removeChild(inputElement);
            graphics.destroy();
            promptText.destroy();

            // Now go to the correct level/menu based on ID
            if (ID == 0){
                Options.call(this, playerName);
            }
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

function createCircleButton(scene, x, y, key, diameter) {
    const image = scene.add.image(x, y, key).setDisplaySize(diameter, diameter).setInteractive();

    // Create a circular mask at the same position as the image
    const shape = scene.make.graphics({ x: 0, y: 0, add: false });
    shape.fillStyle(0xffffff);
    shape.fillCircle(diameter / 2, diameter / 2, diameter / 2);

    // Create a texture from the graphics and use it as a mask
    const maskTextureKey = key + '_mask_' + Math.random();
    shape.generateTexture(maskTextureKey, diameter, diameter);
    const maskImage = scene.add.image(x, y, maskTextureKey).setVisible(false);
    const mask = maskImage.createBitmapMask();

    image.setMask(mask);

    return image;
}

function setOpacity(){
        // Draw a black rectangle as a background for the text
    const graphics = this.add.graphics();
    graphics.fillStyle(0x000000, gameState.Opacity); // Black with 70% opacity
    graphics.fillRect(100, 200, 600, 120); 
    // Add prompt text centered in the box
    const promptText = this.add.text(400, 240, 'Enter desired opacity:', { fontSize: '28px', fill: '#fff', align: 'center' })
        .setOrigin(0.5);
    // Create an HTML input element
    let inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.id = 'opacityInput';
    inputElement.style.position = 'absolute';
    inputElement.style.left = (this.sys.game.canvas.offsetLeft + 275) + 'px';
    inputElement.style.top = (this.sys.game.canvas.offsetTop + 280) + 'px';
    inputElement.style.width = '250px';
    inputElement.style.fontSize = '20px';
    inputElement.style.zIndex = 1000;
    document.body.appendChild(inputElement);

    inputElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            let Opacity = inputElement.value.trim();
            let OpacityNum = Number(Opacity);
            if (OpacityNum < 0 || OpacityNum > 100 || isNaN(OpacityNum) || OpacityNum.includes('.') || OpacityNum.includes('-') ) {
                promptText.setText('It must be a interger between 0 and 100');
                return;
            }
            // Valid name
            gameState.Opacity = Opacity/100;
            document.body.removeChild(inputElement);
            graphics.destroy();
            promptText.destroy();
        }
    });
}