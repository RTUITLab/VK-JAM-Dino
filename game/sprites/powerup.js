export class PowerUp extends Phaser.Physics.Arcade.Sprite {
	constructor(scene) {
		let obstacleX = scene.sys.game.config.width
		let obstacleY = scene.sys.game.config.height - scene.sys.game.config.height * 0.2 - 50
		super(scene, obstacleX, obstacleY, 'batut')
		// this.play('prism')
		this.displayHeight = 100
		this.displayWidth = 100
		this.setDepth(1)
		scene.physics.add.existing(this)
		scene.add.existing(this)
		this.setImmovable(true)
		//this.body.setVelocityX(-scene.globalSpeed)
		// this.body.setVelocityY(0)
		// this.body.setMass(0)
		scene.physics.add.collider(scene.player, this, this.activate.bind(this), this.activate.bind(this))
		this.body.setCircle(20, 8, 8)
		// const oval = new Phaser.Geom.Circle(0, 0, 80, 80)
		// Set the hit area
		// this.body.setCircle(oval.width / 2, oval.x, oval.y)
		// this.body.debugShowBody = true //?why doesnt working
		// this.body.debugBodyColor = 0xff0000
	}

	activate() {
		this.x = -10000 //туда его (потом это подхватит функция удаления )
		this.scene.player.setVelocityY(-950)
	}
}
