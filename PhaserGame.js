// Importing addition functions from functions.js
import { createCircleButton, respawnBotOnHill, isCloseToBot, openDialog, closeDialog, handleBotTurn, askOpenAI  } from "./functions.js";
// Global game state and deafault option values
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
            this.load.image('Vikings', 'Assets/main menu/Vikings.png');
    }
    create() { 
        //sets up main menu
        this.background = this.add.image(400, 300, 'Background'); 
        this.OptionButton = createCircleButton(this, 600, 300, 'OptionButton',100).setInteractive();
        this.Level1 = createCircleButton(this, 200, 300, 'Vikings', 120).setInteractive();
        
        this.OptionButton.on('pointerdown', () => {this.scene.start('OptionsMenu', { from: 'MainMenu' })});
        this.Level1.on('pointerdown', () => { this.scene.start('Level1', { from: 'MainMenu' }) });
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
            // Close the menu first
            this.scene.stop();
            // If the target scene is paused, resume it.
            if (this.scene.isPaused(returnTo)) {
                this.scene.resume(returnTo);
                return;
            }
            // If the target scene is already active (running), do nothing — avoid starting a new instance.
            if (this.scene.isActive(returnTo)) {
                this.scene.bringToTop(returnTo);
                return;
            }
            // Otherwise the target isn't running at all — start it fresh.
            this.scene.start(returnTo);
        });
        this.text = this.add.text(355, 100, 'Menu', { fontSize: '28px', fill: '#fff', align: 'center' });
        this.option1 = this.add.text(250, 200, 'Options', { fontSize: '24px', fill: '#fff' }).setInteractive();
        this.option1.on('pointerdown', () => {
            // open OptionsMenu as an overlay and tag that it came from the in-level menu
            this.scene.launch('OptionsMenu', { returnTo, fromInlevelMenu: true });
            this.scene.bringToTop('OptionsMenu');
            // keep this in-level menu running behind OptionsMenu so it can resume the level later
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
        // know whether we were opened from the in-level menu (so we shouldn't resume the level here)
        const fromInlevel = !!this.scene.settings.data?.fromInlevelMenu;
        // Draw a black rectangle as a background for the text
        const graphics = this.add.graphics();
        graphics.fillStyle(0x000000, gameState.Opacity); // Black with set opacity
        graphics.fillRect(200, 100, 400, 400);
        this.Exit = this.add.image(560, 120, 'ExitButton').setInteractive();
        this.Exit.on('pointerdown', () => {
            if (fromInlevel) {
                // Came from in-level menu: just close
                this.scene.stop(); // close OptionsMenu only
                if (this.scene.isActive('InlevelMenu')) this.scene.bringToTop('InlevelMenu');
            } else {
                // Normal behavior (opened directly): resume/start the target scene
                if (this.scene.isPaused(returnTo)) {
                    this.scene.resume(returnTo);
                } else {
                    this.scene.start(returnTo);
                }
            }
        });
        this.text = this.add.text(350, 100, 'Options', { fontSize: '28px', fill: '#fff', align: 'center' });

        // store refs so we can update later
        this.Option1 = this.add.text(250, 200, '', { fontSize: '24px', fill: '#fff' }).setInteractive();
        this.Option2 = this.add.text(250, 250, '', { fontSize: '24px', fill: '#fff' }).setInteractive();

        // helper to refresh displayed values
        this.updateUI = () => {
            this.Option1.setText('Player Name: ' + (gameState.playerName || ' '));
            this.Option2.setText('Opacity: ' + Math.round((gameState.Opacity || 0.7) * 100) + '%');
        };

        // set click handlers (launching overlays)
        this.Option1.on('pointerdown', () => {
            this.scene.launch('SetPlayerName', { returnTo, fromInlevelMenu: fromInlevel });
            this.scene.bringToTop('SetPlayerName');
        });
        this.Option2.on('pointerdown', () => {
            this.scene.launch('SetOpacity', { returnTo, fromInlevelMenu: fromInlevel });
            this.scene.bringToTop('SetOpacity');
        });

        // update UI now and whenever scene is resumed/woken or receives the custom event
        this.updateUI();
        this.events.on('resume', this.updateUI, this);
        this.events.on('wake', this.updateUI, this);
        this.events.on('updateOptions', this.updateUI, this);
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
        // Disable Phaser keyboard capture while a DOM input is focused
        if (this.input?.keyboard?.manager) this.input.keyboard.manager.enabled = false;
        // Display background and prompt text
        const bg = this.add.image(400, 300, 'Background').setDepth(1000);
        // Draw a black rectangle as a background for the text
        const graphics = this.add.graphics();
        graphics.fillStyle(0x000000, gameState.Opacity); // Black with set opacity
        graphics.fillRect(100, 200, 600, 120);
        graphics.setDepth(1001);
        // Add prompt text centered in the box (on top)
        this.TextPrompt = this.add.text(400, 240, 'Enter Player Name:', { fontSize: '28px', fill: '#fff', align: 'center' })
            .setOrigin(0.5).setDepth(1002);
        // Make sure this scene is above the caller
        this.scene.bringToTop('SetPlayerName');
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
        // Ensure input is removed if this scene is shut down without completing
        this.events.on('shutdown', () => {
            if (inputElement && inputElement.parentNode) inputElement.parentNode.removeChild(inputElement);
            // Re-enable Phaser keyboard capture when leaving the overlay
            if (this.input?.keyboard?.manager) this.input.keyboard.manager.enabled = true;
        });
        // Get banned names as an array (lowercase, trimmed)
        const bannedNamesRaw = this.cache.text.get('bannedNames');
        const bannedNames = bannedNamesRaw
        .split('\n')
        .map(name => name.trim().toLowerCase())
        .filter(name => name.length > 0);        
        inputElement.addEventListener('keydown', (event) => {

            // prevent page scrolling etc so SPACE works like a normal typing key
            if (event.key === ' ' || event.code === 'Space') {
                event.stopPropagation();
                // don't preventDefault or you won't get a space character
                return;
            }
            if (event.key !== 'Enter') return;

            event.preventDefault();   // stop Enter from doing anything weird (like submitting a form)

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
            // Re-enable Phaser keyboard capture now that typing is done
            if (this.input?.keyboard?.manager) this.input.keyboard.manager.enabled = true;
            // Close this overlay and return to the caller. If launched from the in-level flow,
            // return to the existing OptionsMenu overlay; otherwise resume/start the target.
            const fromInlevel = !!this.scene.settings.data?.fromInlevelMenu;
            this.scene.stop();
            if (fromInlevel) {
                if (this.scene.isActive('OptionsMenu')) {
                    this.scene.bringToTop('OptionsMenu');
                    // tell OptionsMenu to refresh its UI now that gameState changed
                    this.scene.get('OptionsMenu').events.emit('updateOptions');
                } else {
                    this.scene.start('OptionsMenu', { returnTo });
                }
                return;
            }
            if (typeof returnTo === 'string' && returnTo.indexOf('Level') === 0) {
                if (this.scene.isPaused(returnTo)) {
                    this.scene.resume(returnTo);
                } else {
                    this.scene.start(returnTo);
                }
            } else {
                this.scene.start('OptionsMenu', { returnTo });
            }
        }); 
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
        // Disable Phaser keyboard capture while a DOM input is focused
        if (this.input?.keyboard?.manager) this.input.keyboard.manager.enabled = false;
        // Display background and prompt text
        const bg = this.add.image(400, 300, 'Background').setDepth(1000);
        // Draw a black rectangle as a background for the text
        const graphics = this.add.graphics();
        graphics.fillStyle(0x000000, gameState.Opacity); // Black with set opacity
        graphics.fillRect(100, 200, 600, 120);
        graphics.setDepth(1001);
        // Add prompt text centered in the box
        const promptText = this.add.text(400, 240, 'Enter desired opacity:', { fontSize: '28px', fill: '#fff', align: 'center' })
            .setOrigin(0.5).setDepth(1002);
        // Bring this overlay to top so it's visible over the caller
        this.scene.bringToTop('SetOpacity');
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
        // Cleanup input if scene is shut down without completing
        this.events.on('shutdown', () => {
            if (inputElement && inputElement.parentNode) inputElement.parentNode.removeChild(inputElement);
            // Re-enable Phaser keyboard capture when leaving the overlay
            if (this.input?.keyboard?.manager) this.input.keyboard.manager.enabled = true;
        });

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
                // Re-enable Phaser keyboard capture now that typing is done
                if (this.input?.keyboard?.manager) this.input.keyboard.manager.enabled = true;
                // Close this overlay and return to OptionsMenu overlay if present,
                // otherwise start OptionsMenu normally.
                const fromInlevel = !!this.scene.settings.data?.fromInlevelMenu;
                this.scene.stop();
                if (fromInlevel) {
                    if (this.scene.isActive('OptionsMenu')) {
                        this.scene.bringToTop('OptionsMenu');
                        // notify OptionsMenu to refresh
                        this.scene.get('OptionsMenu').events.emit('updateOptions');
                    } else {
                        this.scene.start('OptionsMenu', { returnTo });
                    }
                } else {
                    this.scene.start('OptionsMenu', { returnTo });
                }
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
        this.load.image('sky', 'Assets/Level 1/sky4.png');
        this.load.image('MenuButton', 'Assets/buttons/Menu.png');
        this.load.spritesheet('MainCharacterMale', 'Assets/characters/Manwalk.png', { frameWidth: 48, frameHeight: 48 });
        this.load.image('InventoryBackground', 'Assets/inventory/Background.png');
        this.load.image('InventorySlot', 'Assets/inventory/InventorySlot.png');
        this.load.image('InventorySlotHover', 'Assets/inventory/InventorySlotHover.png');
        this.load.image('ground', 'Assets/Level 1/ground.png');
        this.load.image('botTex', 'Assets/Characters/Bot1.png');
        this.load.image('groundInterior', 'Assets/Level 1/groundInterior.png');
        this.load.image('skyInterior', 'Assets/Level 1/sky5.png');
        this.load.image('house', 'Assets/Level 1/house1.png');
        this.load.image('key','Assets/items/key.png');
        
        
    }
    create(){

        // create keys first
        this.cursors   = this.input.keyboard.createCursorKeys();
        window.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        window.eKey     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        window.escKey   = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // keep a reference to the underlying keyboard manager so we can disable it while DOM inputs are used
        window.keyboardManager = this.input.keyboard.manager;

        // helper functions to enable/disable key listeners
        this.enableLevelKeys = () => {
            window.spaceKey.enabled = true;
            window.eKey.enabled = true;
            window.escKey.enabled = true;
            if (window.keyboardManager) window.keyboardManager.enabled = true;
        };
        this.disableLevelKeys = () => {
            window.spaceKey.enabled = false;
            window.eKey.enabled = false;
            window.escKey.enabled = false;
            if (window.keyboardManager) window.keyboardManager.enabled = false;
        };

        // Make sure input is enabled when the level first starts (in case another overlay disabled it)
        this.enableLevelKeys();

        // Ensure keys are re-enabled whenever this scene is resumed/woken
        this.events.on('resume', this.enableLevelKeys, this);
        this.events.on('wake', this.enableLevelKeys, this);
        // Clean up any leftover DOM inputs when the scene is shutdown
        this.events.on('shutdown', () => {
            document.querySelectorAll('[data-phaser-ui]').forEach(el => {
                if (el.parentNode) el.parentNode.removeChild(el);
            });
        });

        /////////////////
        /// World Setup//
        /////////////////
        
        const WORLD_W = 1600;
        const WORLD_H = 600;
        const W = this.scale.width;
        const H = this.scale.height;
        // keep bg on the scene so update() can access it
        this.bg = null;
        // Creating the ground
        // Ground spans the world as repeated segments (keep references so we can swap textures later)
        this.grounds = [];
        for (let x = 200; x < WORLD_W; x += 400) {
            const g = this.add.image(x, 500, 'ground').setScale(2);
            g.setDepth(1); // ground above sky
            this.grounds.push(g);
        }
         // World bounds & camera
         this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);
         this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);
 
         // Parallax sky using a tilesprite that fills the viewport and scrolls with camera
         this.bg = this.add.tileSprite(0, 0, 800, 600, 'sky')
                .setOrigin(0, 0)
                .setScrollFactor(0); // fixed to camera
        this.house = this.add.image(120, 360, 'house').setScale(0.5);
        this.house.setDepth(2);
        // Trigger area for entering the house (door/black area). World coords, same scroll factor as house.
        this.houseZone = new Phaser.Geom.Rectangle(this.house.x - 30, this.house.y + 10, 60, 90);
        this.atHouse = false;
        this.insideHouse = false;
        // Small "SPACE" prompt shown above the house when player is in the zone
        this.housePrompt = this.add.text(this.house.x, this.house.y - 60, 'E', { fontSize: '16px', fill: '#fff' })
            .setOrigin(0.5).setDepth(1502).setScrollFactor(1).setAlpha(0);
        
        this.key = this.add.image(700, 450, 'key').setDisplaySize(32,32);
        ///////////////////
        ///HUD & Inventory/
        ///////////////////
        
        // Solid black inventory background pinned to the camera (HUD)
        this.HUD = this.add.rectangle(0, H - 80, W, 80, 0x000000, 1)
            .setOrigin(0, 0)
            .setScrollFactor(0)   // stick to screen
            .setDepth(1000);
        // Create inventory slots and menu button on top of the HUD
        const slotDepth = 1001;
        this.InventorySlot1 = this.add.image(120, 560, 'InventorySlot')
            .setDisplaySize(64, 64).setInteractive().setScrollFactor(0).setDepth(slotDepth);
        this.InventorySlot2 = this.add.image(240, 560, 'InventorySlot')
            .setDisplaySize(64, 64).setInteractive().setScrollFactor(0).setDepth(slotDepth);
        this.InventorySlot3 = this.add.image(360, 560, 'InventorySlot')
            .setDisplaySize(64, 64).setInteractive().setScrollFactor(0).setDepth(slotDepth);
        this.InventorySlot4 = this.add.image(480, 560, 'InventorySlot')
            .setDisplaySize(64, 64).setInteractive().setScrollFactor(0).setDepth(slotDepth);
        this.InventorySlot5 = this.add.image(600, 560, 'InventorySlot')
            .setDisplaySize(64, 64).setInteractive().setScrollFactor(0).setDepth(slotDepth);
         // hover handlers
        [this.InventorySlot1, this.InventorySlot2, this.InventorySlot3, this.InventorySlot4, this.InventorySlot5].forEach(slot => {
            slot.on('pointerover', () => slot.setTexture('InventorySlotHover'));
            slot.on('pointerout', () => slot.setTexture('InventorySlot'));
        });
        // Set up menu button
        this.MenuButton = this.add.image(775, 575, 'MenuButton').setInteractive().setScrollFactor(0).setDepth(slotDepth);
        this.MenuButton.on('pointerdown', () => {
            this.scene.launch('InlevelMenu', { from: 'Level1' });
            this.scene.pause();
        });
        
        ///////////////////
        /// Player Setup //
        ///////////////////

        // Animations (matches Phaser tutorial sheet)
        this.anims.create({ key: 'left',  frames: this.anims.generateFrameNumbers('MainCharacterMale', { start: 0, end: 3 }), frameRate: 12, repeat: -1 });
        this.anims.create({ key: 'turn',  frames: [ { key: 'MainCharacterMale', frame: 4 } ], frameRate: 20 });
        this.anims.create({ key: 'right', frames: this.anims.generateFrameNumbers('MainCharacterMale', { start: 5, end: 8 }), frameRate: 12, repeat: -1 });
        // create one walk animation that uses the whole strip, plus an idle frame
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('MainCharacterMale', { start: 0, end: 6 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'idle',
            frames: [{ key: 'MainCharacterMale', frame: 0 }],
            frameRate: 10
        });

        // Create player sprite and enable physics
        this.player = this.physics.add.sprite(400, 430, 'MainCharacterMale');
        this.player.setCollideWorldBounds(true);
        this.player.setScale(1.5);
        this.player.setDepth(10); // above ground and house
        // expose player globally for helper functions in functions.js that expect `player`
        window.player = this.player;

        // Camera follow the player sprite on this
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        
        ///////////////////
        ///Bot & Patrol////
        ///////////////////
        this.botPatrol = { minX: 320, maxX: 820, speed: 90 };
        window.botPatrol = this.botPatrol;

        this.bot = this.physics.add.sprite((this.botPatrol.minX + this.botPatrol.maxX) / 2, 430, 'botTex')
            .setDisplaySize(32, 32);
        this.bot.setCollideWorldBounds(false);
        this.bot.setBounce(0);
        this.bot.body.setCircle(16);
        this.bot.body.setOffset(0, 0);
        this.bot.setVelocityX(this.botPatrol.speed);
        this.bot.turning = false;
        window.bot = this.bot;

        // Bot dialog prompt
        this.nearPrompt = this.add.text(0, 0, 'SPACE', { fontSize: '16px', fill: '#fff' })
            .setOrigin(0.5)
            .setDepth(1500)
            .setScrollFactor(1)
            .setAlpha(0);

        //////////////////////////////
        ///House / AI Entry System///
        //////////////////////////////
        // Enter interior: move player inside, swap textures and show an exit area
        this.enterHouse = () => {
            if (this.insideHouse) return;
            this.insideHouse = true;
            // swap ground textures to interior and change sky to interior
            this.grounds.forEach(g => g.setTexture('groundInterior'));
            if (this.bg && this.bg.setTexture) this.bg.setTexture('skyInterior');
            // hide NPC and house (disable bot body)
            if (this.bot) {
                this.bot.setVisible(false);
                if (this.bot.body) this.bot.body.enable = false;
            }
            if (this.house) this.house.setVisible(false);
            // hide prompts
            if (this.nearPrompt) this.nearPrompt.setAlpha(0);
            if (this.housePrompt) this.housePrompt.setAlpha(0);
            // teleport player to an interior position (center of view)
            const interiorX = this.cameras.main.worldView.x + Math.floor(this.cameras.main.width / 2);
            const interiorY = 430;
            this.player.setPosition(interiorX, interiorY);
            // create an exit zone in world coords if not already created
            if (!this.exitZone) {
                const exitX = interiorX - 220;
                const exitY = interiorY - 45;
                this.exitZone = new Phaser.Geom.Rectangle(exitX - 30, exitY, 60, 90);
                // visible black area representing the door inside (world-space, scrolls with camera)
                this.exitRect = this.add.rectangle(exitX, exitY + 45, 60, 90, 0x000000, 1)
                    .setOrigin(0.5, 0.5)
                    .setDepth(1015)
                     .setScrollFactor(1)
                     .setVisible(true);
                // prompt above the exit
                this.exitPrompt = this.add.text(exitX, exitY - 20, 'E', { fontSize: '16px', fill: '#fff' })
                    .setOrigin(0.5).setDepth(1503).setScrollFactor(1).setAlpha(0);
            } else {
                // reposition exit to match camera-centered interior if needed and show it
                const exitX = this.cameras.main.worldView.x + Math.floor(this.cameras.main.width / 2) - 220;
                const exitY = this.player.y - 90;
                this.exitZone.setTo(exitX - 30, exitY, 60, 90);
                this.exitRect.setPosition(exitX, exitY + 45);
                this.exitPrompt.setPosition(exitX, exitY - 20).setAlpha(0.95);
            }
        };

        // Exit interior: restore outside state
        this.exitHouse = () => {
            if (!this.insideHouse) return;
            this.insideHouse = false;
            // restore ground and sky
            this.grounds.forEach(g => g.setTexture('ground'));
            if (this.bg && this.bg.setTexture) this.bg.setTexture('sky');
            // show house and bot again
            if (this.house) this.house.setVisible(true);
            if (this.bot) {
                this.bot.setVisible(true);
                if (this.bot.body) this.bot.body.enable = true;
                // place bot back to patrol center to avoid overlap with player
                this.bot.setPosition((this.botPatrol.minX + this.botPatrol.maxX) / 2, this.bot.y);
                this.bot.setVelocityX(this.botPatrol.speed);
            }
            // hide exit visuals
            if (this.exitRect) this.exitRect.setVisible(false);
            if (this.exitPrompt) this.exitPrompt.setAlpha(0);
            // move player outside in front of the house
            if (this.house) this.player.setPosition(this.house.x + 20, this.house.y + 70);
        };

        // Space key handling: try to exit if inside and at exit; else enter house or open dialog
        window.spaceKey.on('down', () => {
            if (!window.spaceKey.enabled) return;   // ignore when disabled

            // If inside and standing on the exit zone -> leave
            if (this.insideHouse && this.exitZone) {
                const p = new Phaser.Geom.Point(this.player.x, this.player.y);
                if (Phaser.Geom.Rectangle.ContainsPoint(this.exitZone, p)) {
                    this.exitHouse();
                    return;
                }
            }
            // Priority: entering house if at house zone (outside)
            if (this.atHouse && !this.insideHouse) {
                this.enterHouse();
                return;
            }
            if (isCloseToBot() && !window.dialogOpen) {
                // Open chat as an overlay so Level1 state is preserved
                this.scene.launch('ChatScene', { returnTo: 'Level1' });
                this.scene.bringToTop('ChatScene');
                this.scene.pause();
            }
            else if (window.dialogOpen) closeDialog.call(this);
        });
         window.escKey.on('down', () => { if (window.dialogOpen) closeDialog.call(this); });
        
        /////////////////////
        //Starting the game//
        /////////////////////
        if (gameState.playerName === ' ' || gameState.playerName === undefined){
            this.disableLevelKeys();   // <-- disable before opening name scene
            // also disable the keyboard manager so DOM input gets all key events
            if (window.keyboardManager) window.keyboardManager.enabled = false;
            // Launch as an overlay so we can resume this same Level1 instance afterward
            this.scene.launch('SetPlayerName',{ returnTo: 'Level1' });
            this.scene.bringToTop('SetPlayerName');
            this.scene.pause();
            return;
        }
    }
    update() {
         if (!this.player) return;
         // Parallax background: move tiles based on camera scroll
        this.bg.tilePositionX = this.cameras.main.scrollX * 0.4;

        // If dialog is open, freeze player and bot logic (game is effectively paused)
        if (window.dialogOpen) {
            // ensure player is stationary and show idle animation
            this.player.setVelocity(0, 0);
            this.player.anims.play('idle', true);
            // do not forcibly zero bot velocity here — physics.pause/resume will freeze/unfreeze it
        } else {
            // Normal gameplay updates
            // Reset velocity each frame
            this.player.setVelocity(0, 0);
            const speed = 160;
            const left = this.cursors.left.isDown;
            const right = this.cursors.right.isDown;

            if (left)  { this.player.setVelocityX(-speed); this.player.flipX = true; }
            if (right) { this.player.setVelocityX(speed);  this.player.flipX = false; }

            // Play animation: walk when moving, idle otherwise
            if (this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0) {
                this.player.anims.play('walk', true);
            } else {
                this.player.anims.play('idle', true);
            }

            // Rolling bot behaviour patrols between maxX and minX
            if (this.bot) {
                const bOnGround = this.bot.body.blocked.down || this.bot.body.touching.down;

                // Reverse direction at patrol edges
                if (this.bot.x <= this.botPatrol.minX && this.bot.body.velocity.x < 0) {
                    handleBotTurn(this, this.botPatrol.speed);
                } else if (this.bot.x >= this.botPatrol.maxX && this.bot.body.velocity.x > 0) {
                    handleBotTurn(this, -this.botPatrol.speed);
                }

                // If bot is on the ground but slowed down a lot, nudge it
                if (bOnGround && Math.abs(this.bot.body.velocity.x) < 5) {
                    const dir = (this.bot.x < (this.botPatrol.minX + this.botPatrol.maxX) / 2) ? 1 : -1;
                    this.bot.setVelocityX(dir * this.botPatrol.speed);
                }

                // If bot somehow falls off the world, respawn on hill
                const worldH = this.scale.height;
                if (this.bot.y > worldH + 50) {
                    respawnBotOnHill();
                }

        }
        // Near-prompt handling
        // house near-prompt
        const playerPoint = new Phaser.Geom.Point(this.player.x, this.player.y);
        const wasAtHouse = this.atHouse;
        this.atHouse = Phaser.Geom.Rectangle.ContainsPoint(this.houseZone, playerPoint);
        if (this.atHouse && !this.insideHouse) {
            this.housePrompt.setAlpha(0.95);
        } else {
            this.housePrompt.setAlpha(0);
        }

        // bot near-prompt (only when not in dialog and bot visible)
        if (!window.dialogOpen && isCloseToBot() && this.bot && this.bot.visible) {
            this.nearPrompt.setPosition(this.bot.x, this.bot.y - 48).setAlpha(0.95);
        } else {
            this.nearPrompt.setAlpha(0);
        }
        }
    }
}

////////////////////////
//////AI Chat Scene/////
//////////////////////// 
class ChatScene extends Phaser.Scene {
  constructor() {
    super("ChatScene");
  }
  preload() {
        this.load.image('ChatBackground', 'Assets/main menu/Background.png');
  }

  create() {
        // Background (covers the paused level)
        this.add.image(400, 300, 'ChatBackground').setDepth(0);
        // Darken slightly so text is readable
        const overlayOpacity = (typeof gameState.Opacity === 'number') ? gameState.Opacity : 0.7;
        const overlay = this.add.graphics().setDepth(1);
        overlay.fillStyle(0x000000, overlayOpacity);
        overlay.fillRect(0, 0, 800, 600);

    // Text window
    this.textWindow = this.add.text(40, 40, "Hello Traveler who are you and what do you want?", {
      fontFamily: "Arial",
      fontSize: "18px",
      color: "#ffffff",
      wordWrap: { width: 720 }
        }).setDepth(2);

    // Button 1
    const btn1 = this.add.text(40, 140, "Hello", {
      fontFamily: "Arial",
      fontSize: "24px",
      backgroundColor: "#008000",
      padding: { x: 12, y: 6 }
    })
      .setInteractive({ useHandCursor: true })
            .setDepth(2)
      .on("pointerup", () => this.onButton("Hello I am " + gameState.playerName));
    
      // Button 2
    const btn2 = this.add.text(40, 180, "Can you help me open that gate", {
      fontFamily: "Arial",
      fontSize: "24px",
      backgroundColor: "#008000",
      padding: { x: 12, y: 6 }
    })
      .setInteractive({ useHandCursor: true })
            .setDepth(2)
      .on("pointerup", () => this.onButton("Tell the player: " + gameState.playerName 
        +" that there is a key nearby and it will open the gate tell them to maybe check houses"));
    
    // Exit Button
    const btn3 = this.add.text(40 , 220, "Goodbye", {
      fontFamily: "Arial",
      fontSize: "24px",
      backgroundColor: "#800000",
      padding: { x: 12, y: 6 }
    })
      .setInteractive({ useHandCursor: true })
            .setDepth(2)
      .on("pointerup", () => {
                const returnTo = this.scene.settings.data?.returnTo || 'Level1';
                // Close chat and return to the existing paused scene (doesn't not start a fresh instance)
                this.scene.stop('ChatScene');
                if (this.scene.isPaused(returnTo)) {
                    this.scene.resume(returnTo);
                    this.scene.bringToTop(returnTo);
                    return;
                }
                if (this.scene.isActive(returnTo)) {
                    this.scene.bringToTop(returnTo);
                    return;
                }
                // If the target scene isn't running, go back to main menu.
                this.scene.start('MainMenu');
      });
  
    }

  async onButton(message) {
    this.textWindow.setText(" ");

    const prompt =  message;
    const reply = await askOpenAI(prompt);

    this.textWindow.setText(reply);
  }
}
///////////////////////
/////////CONFIG////////
///////////////////////
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [MainMenuScene, OptionsMenuScene, SetPlayerNameScene, 
        SetOpacityScene, Level1Scene,
        InLevelMenuScene,ChatScene],
    parent: 'game',
    
    physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }},
};
// Creating the Phaser game instance
const game = new Phaser.Game(config);
