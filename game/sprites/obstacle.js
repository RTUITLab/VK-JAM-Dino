export class Obstacle extends Phaser.Physics.Arcade.Sprite {
	constructor(scene) {
		let obstacleX = scene.sys.game.config.width
		let obstacleY = scene.sys.game.config.height - scene.sys.game.config.height * 0.2 - 50
		super(scene, obstacleX, obstacleY, 'obstacle')
		this.displayHeight = 100
		this.displayWidth = 100
		this.setDepth(1)
		scene.physics.add.existing(this)
		scene.add.existing(this)
		this.setImmovable(true)
		this.body.setVelocityX(200 * -1)
		scene.physics.add.collider(
			scene.player,
			this,
			this.gameOver.bind(this.scene),
			this.gameOver.bind(this.scene)
		)
	}

	gameOver() {
		this.scene.restart()
	}
}
