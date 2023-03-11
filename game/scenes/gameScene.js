import { Player } from '../player'
import { Ground } from '../sprites/mapParts'
import { Obstacle } from '../sprites/obstacle'
export class GameScene extends Phaser.Scene {
	bgtile
	cursors
	player
	speed
	ground
	constructor() {
		super({ key: 'GameScene', active: false, visible: false })
	}

	preload() {
		this.load.image(
			'ivan',
			'https://sun1-27.userapi.com/impg/E2BDZkKljxgMQgv11GiarjqOLMrBUJZtLhTJbQ/agILbMu9EgI.jpg?size=1280x761&quality=96&sign=290343c52af9f376b605d78f06fa6041&type=album'
		)
		this.load.image('dude', 'https://labs.phaser.io/assets/sprites/phaser-dude.png')
		this.load.image('ground', 'https://labs.phaser.io/assets/textures/grass.png')
		this.load.image('obstacle', 'https://labs.phaser.io/assets/games/asteroids/asteroid1.png')
		this.load.audio('jungle', [
			'https://labs.phaser.io/assets/audio/jungle.ogg',
			'https://labs.phaser.io/assets/audio/jungle.mp3',
		])
	}

	create() {
		this.bgtile = this.add.tileSprite(0, 0, this.game.config.width * 2, this.game.config.height * 2, 'sky')
		this.bgtile.setOrigin(0, 0)
		this.bgtile.setDepth(-1)

		this.cursors = this.input.keyboard.createCursorKeys()
		this.player = new Player(this, 0, 0)
		this.player.init()
		this.ground = new Ground(this)
		this.scene.scene.physics.add.collider(this.player, this.ground)
		// pool
		this.obstaclesPool = this.add.group()

		this.addObstacle()
	}

	update(time, delta) {
		const cursors = this.cursors
		const player = this.player
		this.bgtile.tilePositionX += 0.6
		this.ground.tilePositionX += 0.8

		if (this.input.keyboard.addKey('R').isDown) {
			this.scene.restart()
		}
		// this.physics.overlap(player, this.obstaclesPool, (player, obstacle) => this.scene.restart(), null, this)

		if (cursors.left.isDown) {
			player.move(-player.speed * delta)
		} else if (cursors.right.isDown) {
			player.move(player.speed * delta)
		}
		if (cursors.up.isDown) {
			player.jump()
		}

		// if(player.y > game.config.height){
		//     this.scene.start("PlayGame"); //endgame for holes?
		// }

		// recycling platforms
		let minDistance = this.game.config.width
		this.obstaclesPool.getChildren().forEach((obstacle) => {
			let obstacleDistance = this.game.config.width - obstacle.x - obstacle.displayWidth / 2
			minDistance = Math.min(minDistance, obstacleDistance)
			if (obstacle.x < -obstacle.displayWidth / 2) {
				this.obstaclesPool.killAndHide(obstacle)
				this.obstaclesPool.remove(obstacle)
			}
		})
		// adding new platforms
		if (minDistance > this.nextObstacleDistance) {
			this.addObstacle()
		}
	}

	addObstacle() {
		let obstacle = new Obstacle(this)
		obstacle.active = true
		obstacle.visible = true
		this.obstaclesPool.add(obstacle)
		this.nextObstacleDistance = Phaser.Math.Between(300, 620) //200min
	}
}
