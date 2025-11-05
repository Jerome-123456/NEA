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
