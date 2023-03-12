export class Car extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, type) {
		let carWidth, carHeight
		switch (type) {
			case 'v-police':
				carWidth = 163
				carHeight = 60
				break
			case 'v-red':
				carWidth = 96
				carHeight = 61
				break
			case 'v-truck':
				carWidth = 257
				carHeight = 104
				break
			case 'v-yellow':
				carWidth = 93
				carHeight = 60
				break
		}
		let obstacleX = scene.sys.game.config.width
		let obstacleY = scene.sys.game.config.height - scene.sys.game.config.height * 0.2 - carHeight
		super(scene, obstacleX, obstacleY, type)
		this.displayHeight = carHeight
		this.displayWidth = carWidth
		this.setDepth(1)
		this.setOrigin(0.5, 0.5)
		scene.physics.add.existing(this)
		scene.add.existing(this)
		this.setImmovable(true)
		//scene.physics.add.collider(scene.player, this, this.gameOver.bind(scene), this.gameOver.bind(scene))
		// Set the hit area
		this.body.debugBodyColor = 0xff0000
		this.body.debugShowBody = true
	}

	gameOver() {
		// this.scene.scene.player.destroy() //TODO: remove double player
		// this.scene.restart()
		this.scene.pause('GameScene')
		this.scene.pause('GameUIScene')
		this.scene.launch('GameOverScene')
	}
}
