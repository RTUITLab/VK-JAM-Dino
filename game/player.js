export class Player extends Phaser.Physics.Arcade.Sprite {
	// playerJumps = 0r
	constructor(scene, x, y) {
		super(scene, x, y, 'dude')
		scene.physics.add.existing(this)
		this.scene.add.existing(this)
		this.displayHeight = 120
		this.displayWidth = 100
		// this.playerSpeed = Phaser.Math.GetSpeed(400, 1)
	}

	init() {
		this.setDepth(1)
		this.setOrigin(0, 0)
		this.setGravityY(800)
		this.setMass(300)
		// this.setVelocity(100, 200)
		this.setCollideWorldBounds(true)
		this.scene.input.on('pointerdown', this.jump, this)
	}

	move(x = 0, y = 0) {
		this.setPosition(this.x + x, this.y + y)
		this.setActive(true)
		this.setVisible(true)
	}

	jump() {
		if (this.body.touching.down) {
			// || (this.playerJumps > 0 && this.playerJumps < gameOptions.jumps)){
			// if (this.body.touching.down) {
			// 	this.playerJumps = 0
			// }
			this.setVelocityY(700 * -1)
			// this.playerJumps = 1
		}
	}
}
