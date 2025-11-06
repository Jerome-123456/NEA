import { createCircleButton } from "./functions.js";
// replace the original gameState declaration with a defaulted object
const gameState = {
    Opacity: 0.7,
    playerName: ' '
}
///////////////////////
//MAIN MENU///////////
///////////////////////
class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }
    preload() {
            this.load.image('Background', 'Assets/main menu/Background.png');
            this.load.image('OptionButton','Assets/main menu/OptionButton.png');
            this.load.image('Victorian', 'Assets/main menu/Victoria.png');
            this.load.image('Vikings', 'Assets/main menu/Vikings.png');
            this.load.image('Medival', 'Assets/main menu/KingJohn.png');
    }
    create() { 
        //sets up main menu
        this.background = this.add.image(400, 300, 'Background'); 
        this.OptionButton = createCircleButton(this, 400, 500, 'OptionButton',100).setInteractive();
        this.Level2 = createCircleButton(this, 400, 300, 'Medival', 120).setInteractive();
        this.Level1 = createCircleButton(this, 200, 300, 'Vikings', 120).setInteractive();
        this.Level3 = createCircleButton(this, 600, 300, 'Victorian',120).setInteractive();
        

        this.OptionButton.on('pointerdown', () => {this.scene.start('OptionsMenu', { from: 'MainMenu' })});
        this.Level1.on('pointerdown', () => { this.scene.start('Level1', { from: 'MainMenu' }) });
        this.Level2.on('pointerdown', () => { this.scene.start('Level2', { from: 'MainMenu' }) });
        this.Level3.on('pointerdown', () => { this.scene.start('Level3', { from: 'MainMenu' }) });
    }
}
///////////////////////
//In-level menu scene//
///////////////////////
class InLevelMenuScene extends Phaser.Scene{
    constructor(){
        super('InlevelMenu')
    }
    preload(){
        this.load.image('Background', 'Assets/main menu/Background.png');
        this.load.image('ExitButton', 'Assets/buttons/ExitButton.png');
    }
    create(){
        // background
        this.add.image(400, 300, 'Background');
        // determine where to return (default to MainMenu)
        const returnTo = this.scene.settings.data?.from || 'MainMenu';
        // use stored opacity or a sensible default
        const opacity = (typeof gameState.Opacity === 'number') ? gameState.Opacity : 0.7;
        const graphics = this.add.graphics();
        graphics.fillStyle(0x000000, opacity);
        graphics.fillRect(200, 100, 400, 400);
        // Exit button — return based on the id that opened the Menu
        this.Exit = this.add.image(560, 120, 'ExitButton').setInteractive();
        this.Exit.on('pointerdown', () => {
            this.scene.start(returnTo);
        });
        this.text = this.add.text(355, 100, 'Menu', { fontSize: '28px', fill: '#fff', align: 'center' });
        this.option1 = this.add.text(250, 200, 'Options', { fontSize: '24px', fill: '#fff' }).setInteractive();
        this.option1.on('pointerdown', () => { 
            // pass the original returnTo on to OptionsMenu so it can return all the way back
            this.scene.start('OptionsMenu', { returnTo });
        });

    }
}
///////////////////////
//////OptionsMenu//////
///////////////////////
class OptionsMenuScene extends Phaser.Scene{
    constructor(){
        super('OptionsMenu')
    }
    preload(){
        this.load.image('Background', 'Assets/main menu/Background.png');
        this.load.image('ExitButton', 'Assets/buttons/ExitButton.png');
    }
    create(){
        //adds options menu background and exit button
        this.add.image(400, 300, 'Background');
        // determine where to ultimately return to (default MainMenu)
        const returnTo = this.scene.settings.data?.returnTo || 'MainMenu';
        // Draw a black rectangle as a background for the text
        const graphics = this.add.graphics();
        graphics.fillStyle(0x000000, gameState.Opacity); // Black with set opacity
        graphics.fillRect(200, 100, 400, 400);
        this.Exit = this.add.image(560, 120, 'ExitButton').setInteractive();
        this.Exit.on('pointerdown', () => { this.scene.start(returnTo); });
        this.text = this.add.text(350, 100, 'Options', { fontSize: '28px', fill: '#fff', align: 'center' });
        this.Option1 = this.add.text(250, 200, 'Player Name:'+ gameState.playerName, 
        { fontSize: '24px', fill: '#fff' }).setInteractive();
        // pass returnTo so SetPlayerName can return to OptionsMenu with knowledge of final destination
        this.Option1.on('pointerdown', () => { this.scene.start('SetPlayerName', { returnTo }); });
        this.Option2 = this.add.text(250, 250, 'Opacity:'+ Math.round(gameState.Opacity*100)+'%', 
        { fontSize: '24px', fill: '#fff' }).setInteractive();
        this.Option2.on('pointerdown', () => { this.scene.start('SetOpacity', { returnTo }); });

    }   
}
///////////////////////
//////PlayerName//////
///////////////////////
class SetPlayerNameScene extends Phaser.Scene{
    constructor(){
        super('SetPlayerName')
    }
    preload(){
        this.load.image('Background', 'Assets/main menu/Background.png');
        this.load.text('bannedNames', 'Files/BannedNames.txt');
    }
    create(){
        const returnTo = this.scene.settings.data?.returnTo || 'OptionsMenu';
        // Display background and prompt text
        this.add.image(400, 300, 'Background');
        // Draw a black rectangle as a background for the text
        const graphics = this.add.graphics();
        graphics.fillStyle(0x000000, gameState.Opacity); // Black with set opacity
        graphics.fillRect(100, 200, 600, 120); 
        // Add prompt text centered in the box
        this.TextPrompt = this.add.text(400, 240, 'Enter Player Name:', { fontSize: '28px', fill: '#fff', align: 'center' })
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
                this.TextPrompt.setText('Name too long, max 10 characters');
                return;
            }
            if (playerName.length === 0) {
                this.TextPrompt.setText('Name cannot be blank');
                return;
            }
            if (bannedNames.includes(playerName.toLowerCase())) {
                this.TextPrompt.setText('Name not allowed. Choose another.');
                return;
            }
            // Valid name
            gameState.playerName = playerName;
            if (inputElement.parentNode) inputElement.parentNode.removeChild(inputElement);
            this.scene.stop('SetPlayerName');
            // Go back to the Options menu (which will in turn return to the original level)
            this.scene.start('OptionsMenu', { returnTo }); 
        }});
    }
}
///////////////////////
//////OpacityMenu//////
///////////////////////
class SetOpacityScene extends Phaser.Scene{
    constructor(){
        super('SetOpacity')
    }
    preload(){
        this.load.image('Background', 'Assets/main menu/Background.png');
    }
    create(){
        const returnTo = this.scene.settings.data?.returnTo || 'OptionsMenu';
        // Display background and prompt text
        this.add.image(400, 300, 'Background');
        // Draw a black rectangle as a background for the text
        const graphics = this.add.graphics();
        graphics.fillStyle(0x000000, gameState.Opacity); // Black with set opacity
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
                this.scene.stop('SetOpacity');
                // Return to OptionsMenu and preserve the ultimate returnTo (so OptionsMenu can send user back to level)
                this.scene.start('OptionsMenu',{ returnTo });
            }
        });
    }
}
///////////////////////
//////Level1Scene//////
///////////////////////
class Level1Scene extends Phaser.Scene{
    constructor(){
        super('Level1')
    }
    preload(){
        this.load.image('BG1.1', 'Assets/Background2.png');
        this.load.image('MenuButton', 'Assets/buttons/Menu.png');
    }
    create(){
        //checks if player name has been set if not call SetPlayerName and return to this level afterwards
        if (gameState.playerName === ' ' || gameState.playerName === undefined){
            this.scene.start('SetPlayerName',{ returnTo: 'Level1' });
            return;
        }
        //adds level 1 background and menu button
        this.add.image(400, 300, 'BG1.1');
        // Add inventory background and menu button and inventory slots
        this.MenuButton = this.add.image(775, 575, 'MenuButton').setInteractive(); // Set up menu button
        this.MenuButton.on('pointerdown', () => {this.scene.start('InlevelMenu',{ from: 'Level1' })});
    }



}
///////////////////////
//////Level2Scene//////
///////////////////////
class Level2Scene extends Phaser.Scene{
    constructor(){
        super('Level2')
    }
    preload(){
        this.load.image('BG2.1', 'Assets/BackgroundLV2.png');
        this.load.image('MenuButton', 'Assets/buttons/Menu.png');
    }
    create(){
        if (gameState.playerName === ' ' || gameState.playerName === undefined){
            this.scene.start('SetPlayerName',{ returnTo: 'Level2' });
            return;
        }
        this.add.image(400, 300, 'BG2.1');
        this.MenuButton = this.add.image(775, 575, 'MenuButton').setInteractive();
        this.MenuButton.on('pointerdown', () => {this.scene.start('InlevelMenu',{ from: 'Level2' })});
    }



}
///////////////////////
//////Level3Scene//////
///////////////////////
class Level3Scene extends Phaser.Scene{
    constructor(){
        super('Level3')
    }
    preload(){
        this.load.image('BG3.1', 'Assets/BackgroundLV3.png');
        this.load.image('MenuButton', 'Assets/buttons/Menu.png');
    }
    create(){
        if (gameState.playerName === ' ' || gameState.playerName === undefined){
            this.scene.start('SetPlayerName',{ returnTo: 'Level3' });
            return;
        }
        this.add.image(400, 300, 'BG3.1');
        this.MenuButton = this.add.image(775, 575, 'MenuButton').setInteractive();
        this.MenuButton.on('pointerdown', () => {this.scene.start('InlevelMenu',{ from: 'Level3' })});
    }



}
///////////////////////
/////////CONFIG////////
///////////////////////
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [MainMenuScene, OptionsMenuScene, SetPlayerNameScene, SetOpacityScene, Level1Scene, Level2Scene, Level3Scene, InLevelMenuScene],
    parent: 'game',
};

var game = new Phaser.Game(config);

/*
    this.load.image('background', 'Assets/main menu/Background.png'); 
    this.load.image('ExitButton', 'Assets/buttons/ExitButton.png');
    this.load.image('InventoryBackground', 'Assets/inventory/Background.png');
    this.load.image('MainCharacterMale', 'Assets/characters/Man.png');
    this.load.image('InventorySlot', 'Assets/inventory/InventorySlot.png');
    this.load.image('InventorySlotHover', 'Assets/inventory/InventorySlotHover.png');

    


function update() {
    if(gameState.cursors.right.isDown){
            gameState.player.x += 2;
    }
    if(gameState.cursors.left.isDown){
        gameState.player.x -= 2;
    }
}
    // Add inventory background and menu button and inventory slots
    this.InventoryBackground = this.add.image(400, 550, 'InventoryBackground').setDisplaySize(800,150); //Add inventory background
    this.InventorySlot1 = this.add.image(150, 550, 'InventorySlot').setDisplaySize(64,64).setInteractive(); // Add inventory slot 1
    this.InventorySlot1.on('pointerover', () => {
        this.InventorySlot1.setTexture('InventorySlotHover');
    });
    this.InventorySlot1.on('pointerout', () => {
        this.InventorySlot1.setTexture('InventorySlot');
    });
    
    gameState.player = this.add.image(400, 400, 'MainCharacterMale').setDisplaySize(100, 100).setInteractive(); // Add main character image


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
}*/
