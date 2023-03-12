export class Player extends Phaser.Physics.Arcade.Sprite {
	// playerJumps = 0r
	constructor(scene, x, y) {
		super(scene, x, y, 'player')
		scene.physics.add.existing(this)
		this.scene.add.existing(this)
		this.displayHeight = 71 //180
		this.displayWidth = 67 //150
		this.setScale(2.2)
		this.setSize(23, 68)
		// this.playerSpeed = Phaser.Math.GetSpeed(400, 1)
	}

	init() {
		this.setDepth(1)
		this.setGravityY(-1600)
		// this.setVelocity(100, 200)
		this.setCollideWorldBounds(true)
		this.scene.input.on('pointerdown', this.jump, this)
		this.runAnim = this.anims.create({
			key: 'run',
			frames: this.anims.generateFrameNumbers('playerRun'),
			frameRate: 10,
			repeat: -1,
		})
		this.jumpAnim = this.anims.create({
			key: 'jump',
			frames: this.anims.generateFrameNumbers('playerJump'),
			frameRate: 10,
			loop: 1,
		})
		this.anims.play('run')
		const oval = new Phaser.Geom.Ellipse(0, 0, 100, 100)
		// this.body.setCircle(0)
		this.body.debugBodyColor = 0xff0000
		this.body.debugShowBody = true
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
			this.setVelocityY(900 * -1)
			this.anims.play('jump', true).once('animationcomplete', () => {
				this.anims.play('run')
			})

			// this.playerJumps = 1
		}
	}
}
