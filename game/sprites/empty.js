export class Empty extends Phaser.Physics.Arcade.Sprite {
	constructor(scene) {
		let obstacleX = scene.sys.game.config.width
		let obstacleY = scene.sys.game.config.height - scene.sys.game.config.height * 0.2 - 50
		super(scene, obstacleX, obstacleY, '')
		this.displayHeight = 100
		this.displayWidth = 100
		this.setDepth(1)
		this.setOrigin(0.5, 0.5)
		scene.physics.add.existing(this)
		scene.add.existing(this)
		//this.setImmovable(true)
		// this.body.setVelocityX(-scene.globalSpeed)
		//scene.physics.add.collider(scene.player, this, this.gameOver.bind(scene), this.gameOver.bind(scene))
		// Set the hit area
		const oval = new Phaser.Geom.Ellipse(5, 5, 25, 25)
		this.body.setCircle(oval.width / 2, oval.x, oval.y)
		this.body.debugBodyColor = 0xff0000
		this.body.debugShowBody = true
	}
}
