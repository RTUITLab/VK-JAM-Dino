export class ShopScene extends Phaser.Scene {
	constructor() {
		super({ key: 'ShopScene', active: false, visible: false })
	}

	preload() {
		this.load.image('background', 'https://labs.phaser.io/assets/skies/space1.png')
	}

	create() {}

	update() {}
}
