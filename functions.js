export function createCircleButton(scene, x, y, key, diameter) {
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

export function respawnBotOnHill() {
  const b = window.bot;
  const patrol = window.botPatrol || { minX: 320, maxX: 820, speed: 90 };
  if (!b) return;
  const scene = b.scene;
  const baseY = scene.scale.height;
  b.setPosition((patrol.minX + patrol.maxX) / 2, baseY - 180);
  b.setVelocityX(patrol.speed);
  b.setVelocityY(0);
}

export function isCloseToBot() {
  const p = window.player;
  const b = window.bot;
  if (!p || !b) return false;
  const dx = Math.abs(p.x - b.x);
  const dy = Math.abs(p.y - b.y);
  return dx < 40 && dy < 60;
}

export function openDialog() {
  // set globals so other code/helpers see the state
  window.canMove = false;
  window.dialogOpen = true;
  const dlg = window.dialogGroup;
  if (dlg) dlg.setVisible(true);

  // pause physics if called with a scene context
  if (this && this.physics && this.physics.world && !this.physics.world.isPaused) {
    this.physics.world.pause();
  }

  // animate dialog if we have a scene context and a dialog
  if (this && this.tweens && dlg) {
    this.tweens.add({
      targets: dlg,
      scale: { from: 0.9, to: 1 },
      alpha: { from: 0, to: 1 },
      duration: 120
    });
  }
}

export function closeDialog() {
  window.dialogOpen = false;
  window.canMove = true;
  const dlg = window.dialogGroup;
  if (dlg) dlg.setVisible(false);

  // resume physics if called with scene context
  if (this && this.physics && this.physics.world && this.physics.world.isPaused) {
    this.physics.world.resume();
  }
}

export function handleBotTurn(scene, newVelX) {
  // Accept either a scene object or a scene-less call
  let bot = null;
  if (scene && scene.bot) bot = scene.bot;
  else bot = window.bot;

  if (!bot) return;

  // ensure botPatrol is available globally for other helpers
  if (scene && scene.botPatrol) window.botPatrol = scene.botPatrol;

  // If a turn tween is already running, just set velocity
  if (bot.turning) {
    bot.setVelocityX(newVelX);
    return;
  }

  bot.turning = true;
  bot.setVelocityX(newVelX);

  // Find a scene to run the tween on
  const tweenScene = (scene && scene.tweens) ? scene : (bot.scene || null);

  // If we have a scene/tweens, perform a short spin on turn
  if (tweenScene && tweenScene.tweens) {
    const spinAmount = (newVelX < 0 ? -1 : 1) * Math.PI * 0.6;
    tweenScene.tweens.add({
      targets: bot,
      rotation: bot.rotation + spinAmount,
      duration: 300,
      ease: 'Sine.easeOut',
      onComplete: () => { bot.turning = false; }
    });
  } else {
    // no tween system: clear turning flag after a short timeout
    setTimeout(() => { bot.turning = false; }, 320);
  }
}
