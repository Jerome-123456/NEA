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
    this.load.image('InventoryBackground', 'Assets/inventory/Background.png');
    this.load.image('MainCharacterMale', 'Assets/characters/Man.png');
    this.load.image('InventorySlot', 'Assets/inventory/InventorySlot.png');
    this.load.image('InventorySlotHover', 'Assets/inventory/InventorySlotHover.png');

    
}

function create() { 
    gameState.cursors = this.input.keyboard.createCursorKeys()
    clearAllElements.call(this);
    //sets up main menu
    this.background = this.add.image(400, 300, 'background'); 
    this.OptionButton = createCircleButton(this, 400, 500, 'OptionButton',100).setInteractive();
    this.Level2 = createCircleButton(this, 400, 300, 'Medival', 120).setInteractive();
    this.Level1 = createCircleButton(this, 200, 300, 'Vikings', 120).setInteractive();
    this.Level3 = createCircleButton(this, 600, 300, 'Victorian',120).setInteractive();
    

        this.OptionButton.on('pointerdown', () => Options.call(this,gameState.playerName,0));
    this.Level2.on('pointerdown', () => Level_2.call(this,gameState.playerName));
    this.Level1.on('pointerdown', () => Level_1.call(this,gameState.playerName));
    this.Level3.on('pointerdown', () => Level_3.call(this,gameState.playerName));
}
function update() {
    if(gameState.cursors.right.isDown){
            gameState.player.x += 2;
    }
    if(gameState.cursors.left.isDown){
        gameState.player.x -= 2;
    }
}
function Level_1(PlayerName) {
    //Removes all main menu items
    clearAllElements.call(this);
    //checks if player name has been set if not calls function to set it
    if (PlayerName == " " || PlayerName == undefined){
        clearAllElements.call(this);
        PlayerName= PickPlayerName.call(this,1);
        return;

    }
    //adds level 1 background and menu button
    this.add.image(400, 300, 'BG1.1');
    // Add inventory background and menu button and inventory slots
    this.InventoryBackground = this.add.image(400, 550, 'InventoryBackground').setDisplaySize(800,150); //Add inventory background
    this.MenuButton = this.add.image(775, 575, 'MenuButton').setInteractive(); // Set up menu button
    this.MenuButton.on('pointerdown', () => Menu.call(this,1));
    this.InventorySlot1 = this.add.image(150, 550, 'InventorySlot').setDisplaySize(64,64).setInteractive(); // Add inventory slot 1
    this.InventorySlot1.on('pointerover', () => {
        this.InventorySlot1.setTexture('InventorySlotHover');
    });
    this.InventorySlot2 = this.add.image(250, 550, 'InventorySlot').setDisplaySize(64,64).setInteractive(); // Add inventory slot 2
    this.InventorySlot2.on('pointerover', () => {
        this.InventorySlot2.setTexture('InventorySlotHover');
    });
    this.InventorySlot3 = this.add.image(350, 550, 'InventorySlot').setDisplaySize(64,64).setInteractive();
    this.InventorySlot3.on('pointerover', () => {
        this.InventorySlot3.setTexture('InventorySlotHover');
    });
    this.InventorySlot4 = this.add.image(450, 550, 'InventorySlot').setDisplaySize(64,64).setInteractive(); // Add inventory slot 4
    this.InventorySlot4.on('pointerover', () => {
        this.InventorySlot4.setTexture('InventorySlotHover');
    });
    this.InventorySlot5 = this.add.image(550, 550, 'InventorySlot').setDisplaySize(64,64).setInteractive(); // Add inventory slot 5
    this.InventorySlot5.on('pointerover', () => {
        this.InventorySlot5.setTexture('InventorySlotHover');
    });




    gameState.player = this.add.image(400, 400, 'MainCharacterMale').setDisplaySize(100, 100).setInteractive(); // Add main character image
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
       // Add inventory background and menu button and inventory slots
    this.InventoryBackground = this.add.image(400, 550, 'InventoryBackground').setDisplaySize(800,150); //Add inventory background
    this.MenuButton = this.add.image(775, 575, 'MenuButton').setInteractive(); // Set up menu button
    this.MenuButton.on('pointerdown', () => Menu.call(this,2));
    this.InventorySlot1 = this.add.image(150, 550, 'InventorySlot').setDisplaySize(64,64).setInteractive(); // Add inventory slot 1
    this.InventorySlot1.on('pointerover', () => {
        this.InventorySlot1.setTexture('InventorySlotHover');
    });
    this.InventorySlot2 = this.add.image(250, 550, 'InventorySlot').setDisplaySize(64,64).setInteractive(); // Add inventory slot 2
    this.InventorySlot2.on('pointerover', () => {
        this.InventorySlot2.setTexture('InventorySlotHover');
    });
    this.InventorySlot3 = this.add.image(350, 550, 'InventorySlot').setDisplaySize(64,64).setInteractive();
    this.InventorySlot3.on('pointerover', () => {
        this.InventorySlot3.setTexture('InventorySlotHover');
    });
    this.InventorySlot4 = this.add.image(450, 550, 'InventorySlot').setDisplaySize(64,64).setInteractive(); // Add inventory slot 4
    this.InventorySlot4.on('pointerover', () => {
        this.InventorySlot4.setTexture('InventorySlotHover');
    });
    this.InventorySlot5 = this.add.image(550, 550, 'InventorySlot').setDisplaySize(64,64).setInteractive(); // Add inventory slot 5
    this.InventorySlot5.on('pointerover', () => {
        this.InventorySlot5.setTexture('InventorySlotHover');
    });
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
       // Add inventory background and menu button and inventory slots
    this.InventoryBackground = this.add.image(400, 550, 'InventoryBackground').setDisplaySize(800,150); //Add inventory background
    this.MenuButton = this.add.image(775, 575, 'MenuButton').setInteractive(); // Set up menu button
    this.MenuButton.on('pointerdown', () => Menu.call(this,3));
    this.InventorySlot1 = this.add.image(150, 550, 'InventorySlot').setDisplaySize(64,64).setInteractive(); // Add inventory slot 1
    this.InventorySlot1.on('pointerover', () => {
        this.InventorySlot1.setTexture('InventorySlotHover');
    });
    this.InventorySlot2 = this.add.image(250, 550, 'InventorySlot').setDisplaySize(64,64).setInteractive(); // Add inventory slot 2
    this.InventorySlot2.on('pointerover', () => {
        this.InventorySlot2.setTexture('InventorySlotHover');
    });
    this.InventorySlot3 = this.add.image(350, 550, 'InventorySlot').setDisplaySize(64,64).setInteractive();
    this.InventorySlot3.on('pointerover', () => {
        this.InventorySlot3.setTexture('InventorySlotHover');
    });
    this.InventorySlot4 = this.add.image(450, 550, 'InventorySlot').setDisplaySize(64,64).setInteractive(); // Add inventory slot 4
    this.InventorySlot4.on('pointerover', () => {
        this.InventorySlot4.setTexture('InventorySlotHover');
    });
    this.InventorySlot5 = this.add.image(550, 550, 'InventorySlot').setDisplaySize(64,64).setInteractive(); // Add inventory slot 5
    this.InventorySlot5.on('pointerover', () => {
        this.InventorySlot5.setTexture('InventorySlotHover');
    });
}


function Options(PlayerName,id) {
    // remember where Options was opened from so sub-screens can return correctly
    gameState.optionsReturnId = id;
    gameState.optionsReturnPlayerName = PlayerName;

    // Removes all main menu items
    this.OptionButton.visible = false;
    this.Level1.visible = false;
    this.Level2.visible = false;
    this.Level3.visible = false;
    //adds options menu background and exit button
    this.add.image(400, 300, 'background');
    // Draw a black rectangle as a background for the text
    const graphics = this.add.graphics();
    graphics.fillStyle(0x000000, gameState.Opacity); // Black with 70% opacity
    graphics.fillRect(200, 100, 400, 400);
    this.Exit = this.add.image(560, 120, 'ExitButton').setInteractive();
      this.Exit.on('pointerdown', () => { // When exit button is clicked
        clearAllElements.call(this);
        // If Options was opened from an in-game Menu (id > 0), return to that Menu
        if (typeof id === 'number' && id > 0) {
            Menu.call(this, id);
            return;
        }
        // otherwise return to main menu
        create.call(this);
    });
    this.text = this.add.text(350, 100, 'Options', { fontSize: '28px', fill: '#fff', align: 'center' });
    this.Option1 = this.text = this.add.text(250, 200, 'Player Name:'+ gameState.playerName, 
        { fontSize: '24px', fill: '#fff' }).setInteractive();
    // pass the same id so PickPlayerName can return to the correct place
    this.Option1.on('pointerdown', () => PickPlayerName.call(this, id));
    this.Option2 = this.add.text(250, 300,'Menu Opacity: '+(gameState.Opacity*100)+'%',
    {fontSize: '28px', fill: '#fff', align: 'center' } ).setInteractive();
    // pass the same id so setOpacity can return correctly
    this.Option2.on('pointerdown', () =>  {
        clearAllElements.call(this);
        setOpacity.call(this, id);
    });
}
function Menu(id) {
    // clear any previous UI the scene may have left
    clearAllElements.call(this);

    // background
    this.add.image(400, 300, 'background');

    // hide the in-level menu button if present
    if (this.MenuButton) this.MenuButton.visible = false;

    // use stored opacity or a sensible default
    const opacity = (typeof gameState.Opacity === 'number') ? gameState.Opacity : 0.7;
    const graphics = this.add.graphics();
    graphics.fillStyle(0x000000, opacity);
    graphics.fillRect(200, 100, 400, 400);
     // Exit button — return based on the id that opened the Menu
    this.Exit = this.add.image(560, 120, 'ExitButton').setInteractive();
    this.Exit.on('pointerdown', () => {
        clearAllElements.call(this);
        // If Menu was opened from a level (id > 0) go back to that level
        if (typeof id === 'number' && id > 0) {
            if (id === 1) { Level_1.call(this, gameState.playerName); return; }
            if (id === 2) { Level_2.call(this, gameState.playerName); return; }
            if (id === 3) { Level_3.call(this, gameState.playerName); return; }
        }
        // otherwise go back to main menu
        create.call(this);
    });
    this.text = this.add.text(355, 100, 'Menu', { fontSize: '28px', fill: '#fff', align: 'center' });
    this.option1 = this.add.text(250, 200, 'Options', { fontSize: '24px', fill: '#fff' }).setInteractive();
    this.option1.on('pointerdown', () => {
        clearAllElements.call(this);
        Options.call(this, gameState.playerName, id);
    });
}

function PickPlayerName(returnToId){
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
    inputElement.setAttribute('data-phaser-ui','true');
    inputElement.style.left = (this.sys.game.canvas.offsetLeft + 275) + 'px';
    inputElement.style.top = (this.sys.game.canvas.offsetTop + 280) + 'px';
    inputElement.style.width = '250px';
    inputElement.style.fontSize = '20px';
    inputElement.style.zIndex = 1000;
    document.body.appendChild(inputElement);
    inputElement.focus();
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
            clearAllElements.call(this);

          // Return to the correct place based on returnToId
            if (returnToId === 0){
                // return to Options (called from in-game Menu). Keep the same return id so options can exit properly.
                Options.call(this, playerName, 0);
                return;
            }
            if (returnToId === 1){
                Level_1.call(this, playerName);
                return;
            }
            if (returnToId === 2){
                Level_2.call(this, playerName);
                return;
            }
            if (returnToId === 3){
                Level_3.call(this, playerName);
                return;
            }
            // default return to Options (main menu)
            Options.call(this, playerName, 0);
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

function setOpacity(fromId){
    // Display background and prompt text
    this.add.image(400, 300, 'background');
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
    inputElement.setAttribute('data-phaser-ui','true');
    inputElement.style.left = (this.sys.game.canvas.offsetLeft + 275) + 'px';
    inputElement.style.top = (this.sys.game.canvas.offsetTop + 280) + 'px';
    inputElement.style.width = '250px';
    inputElement.style.fontSize = '20px';
    inputElement.style.zIndex = 1000;
    document.body.appendChild(inputElement);
    inputElement.focus();

 inputElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            let Opacity = inputElement.value.trim();
            let OpacityNum = Number(Opacity);
            // Validate numeric, range and integer (no '.' or '-' in the string)
            if (Number.isNaN(OpacityNum) || OpacityNum < 0 || OpacityNum > 100 || Opacity.includes('.') || Opacity.includes('-')) {
                promptText.setText('It must be an integer between 0 and 100');
                return;
            }
            // Save numeric opacity and clean up
            gameState.Opacity = OpacityNum / 100;
            if (inputElement.parentNode) inputElement.parentNode.removeChild(inputElement);
            graphics.destroy();
            promptText.destroy();
            clearAllElements.call(this);
            // return to Options and provide the same fromId so exit works
            Options.call(this, gameState.playerName, fromId);
        }
    });
}
function clearAllElements() {
    // Remove scene input listeners
    if (this.input && this.input.removeAllListeners) this.input.removeAllListeners();

    // Remove HTML inputs the scene might have created (tagged with data-phaser-ui or known IDs)
    const ids = ['nameInput', 'opacityInput'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.parentNode) el.parentNode.removeChild(el);
    });
    // Remove any elements explicitly tagged when created
    document.querySelectorAll('[data-phaser-ui]').forEach(el => el.remove());
}