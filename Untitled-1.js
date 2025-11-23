<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Phaser Side-Scroller with Inventory Bar</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script src="https://cdn.jsdelivr.net/npm/phaser@3.80.0/dist/phaser.js"></script>
  <style>
    html,body { margin:0; padding:0; background:#0b0f14; }
  </style>
</head>
<body>
<script>
/*
SideScroller + Inventory Bar
----------------------------
- Player can move + jump
- Platforms
- Collect gems + keys
- Lives, keys, gems displayed in HUD bar at bottom
*/

const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  backgroundColor: "#87ceeb",
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 900 }, debug: false }
  },
  scene: { preload, create, update }
};
new Phaser.Game(config);

let player, cursors, platforms;
let gems, keys;
let HUD, livesText, gemText, keyText;
let lives = 3, gemCount = 0, keyCount = 0;

function preload() {
  // Player texture
  const g1 = this.add.graphics();
  g1.fillStyle(0x00cc66, 1).fillRoundedRect(0, 0, 32, 48, 8);
  g1.generateTexture("playerTex", 32, 48);
  g1.destroy();

  // Platform texture
  const g2 = this.add.graphics();
  g2.fillStyle(0x654321, 1).fillRect(0, 0, 64, 20);
  g2.generateTexture("platformTex", 64, 20);
  g2.destroy();

  // Gem texture
  const g3 = this.add.graphics();
  g3.fillStyle(0x33ccff, 1).fillCircle(10,10,10);
  g3.generateTexture("gemTex", 20, 20);
  g3.destroy();

  // Key texture
  const g4 = this.add.graphics();
  g4.fillStyle(0xffd700, 1).fillRect(4,4,12,4);
  g4.fillRect(0,0,4,4);
  g4.generateTexture("keyTex", 20, 20);
  g4.destroy();
}

function create() {
  const W = this.scale.width;
  const H = this.scale.height;

  // --- LEVEL ---
  platforms = this.physics.add.staticGroup();
  for (let x = 0; x < W * 3; x += 64) {
    platforms.create(x, H - 40, "platformTex").refreshBody();
  }
  // Small platforms
  platforms.create(300, 400, "platformTex");
  platforms.create(500, 320, "platformTex");
  platforms.create(780, 260, "platformTex");

  // --- PLAYER ---
  player = this.physics.add.sprite(100, H - 200, "playerTex");
  player.setCollideWorldBounds(true);
  this.physics.add.collider(player, platforms);

  cursors = this.input.keyboard.createCursorKeys();

  // --- COLLECTABLES ---
  gems = this.physics.add.group();
  keys = this.physics.add.group();

  gems.create(300, 360, "gemTex");
  gems.create(500, 280, "gemTex");
  gems.create(780, 220, "gemTex");

  keys.create(900, H - 80, "keyTex");

  this.physics.add.collider(gems, platforms);
  this.physics.add.collider(keys, platforms);

  this.physics.add.overlap(player, gems, getGem, null, this);
  this.physics.add.overlap(player, keys, getKey, null, this);

  // --- CAMERA ---
  this.cameras.main.setBounds(0, 0, W * 3, H);
  this.cameras.main.startFollow(player, true, 0.1, 0.1);

  // --- INVENTORY BAR / HUD ---
  HUD = this.add.rectangle(0, H - 80, W, 80, 0x000000, 0.40)
            .setOrigin(0, 0)
            .setScrollFactor(0,0)   // stick to screen
            .setDepth(999);

  livesText = this.add.text(20, H - 60, "❤️ Lives: 3", {
    fontFamily: "Arial",
    fontSize: "22px",
    color: "#fff"
  }).setScrollFactor(0).setDepth(1000);

  gemText = this.add.text(240, H - 60, "💎 Gems: 0", {
    fontFamily: "Arial",
    fontSize: "22px",
    color: "#33ccff"
  }).setScrollFactor(0).setDepth(1000);

  keyText = this.add.text(450, H - 60, "🔑 Keys: 0", {
    fontFamily: "Arial",
    fontSize: "22px",
    color: "#ffd700"
  }).setScrollFactor(0).setDepth(1000);
}

// --- Collect gem ---
function getGem(player, gem) {
  gem.disableBody(true, true);
  gemCount++;
  gemText.setText("💎 Gems: " + gemCount);
}

// --- Collect key ---
function getKey(player, key) {
  key.disableBody(true, true);
  keyCount++;
  keyText.setText("🔑 Keys: " + keyCount);
}

function update() {
  const speed = 220;

  if (cursors.left.isDown) {
    player.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
    player.setVelocityX(speed);
  } else {
    player.setVelocityX(0);
  }

  // Jump
  if (cursors.up.isDown && player.body.blocked.down) {
    player.setVelocityY(-450);
  }
}
</script>
</body>
</html>