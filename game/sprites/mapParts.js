export class Ground extends Phaser.GameObjects.TileSprite {
	constructor(scene) {
		let groundX = scene.sys.game.config.width * 2
		let groundY = scene.sys.game.config.height * 0.41
		super(scene, 0, scene.sys.game.config.height, groundX, groundY, 'ground')

		scene.physics.add.existing(this)
		scene.add.existing(this)
		this.setDepth(1)
		// this.displayHeight = scene.sys.game.config.height * 0.2
		// this.displayWidth = scene.sys.game.config.width
		//add the colliders
		this.body.setImmovable()
	}
}
