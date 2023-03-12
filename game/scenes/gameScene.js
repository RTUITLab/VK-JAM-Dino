import { normalise, tick } from '../../helpers/seed'
import { Player } from '../player'
import { Empty } from '../sprites/empty'
import { Evgeny } from '../sprites/evgeny'
import { Ground } from '../sprites/mapParts'
import { Obstacle } from '../sprites/obstacle'
import { PowerUp } from '../sprites/powerup'

export class GameScene extends Phaser.Scene {
	seed
	bgtile
	cursors
	player
	globalSpeed
	globalDistance
	globalScore
	ground
	obstacleCounter
	constructor() {
		super({ key: 'GameScene' })
		this.obstacleCounter = 0
		this.globalSpeed = Phaser.Math.GetSpeed(200, 1)
		this.globalScore = 0
		this.globalDistance = 500
		this.seed = '9a7f' // random hex lenght 5
	}

	preload() {
		this.load.image('dude', 'https://labs.phaser.io/assets/sprites/phaser-dude.png')
		this.load.atlas(
			'gems',
			'https://labs.phaser.io/assets/tests/columns/gems.png',
			'https://labs.phaser.io/assets/tests/columns/gems.json'
		)
		this.load.image('gameBackground', 'https://labs.phaser.io/assets/skies/space4.png')
		this.load.image('ground', 'https://labs.phaser.io/assets/textures/grass.png')
		this.load.image('obstacle', 'https://labs.phaser.io/assets/games/asteroids/asteroid1.png')
		this.load.audio('jungle', [
			'https://labs.phaser.io/assets/audio/jungle.ogg',
			'https://labs.phaser.io/assets/audio/jungle.mp3',
		])
	}

	create() {
		this.globalScore = 0 //reset on restart
		this.scene.launch('GameUIScene')
		// this.scene.scene.physics.world.drawDebug = true
		this.bgtile = this.add
			.tileSprite(0, 0, this.game.config.width * 2, this.game.config.height * 1.7, 'gameBackground')
			.setDepth(-1)
		this.cursors = this.input.keyboard.createCursorKeys()
		this.player = new Player(this, 0, 0)
		this.player.init()
		this.ground = new Ground(this)
		this.scene.scene.physics.add.collider(this.player, this.ground)
		// pool
		this.obstaclesPool = this.add.group()

		this.anims.create({
			key: 'diamond',
			frames: this.anims.generateFrameNames('gems', { prefix: 'diamond_', end: 15, zeroPad: 4 }),
			repeat: -1,
		})
		this.anims.create({
			key: 'prism',
			frames: this.anims.generateFrameNames('gems', { prefix: 'prism_', end: 6, zeroPad: 4 }),
			repeat: -1,
		})
		this.anims.create({
			key: 'ruby',
			frames: this.anims.generateFrameNames('gems', { prefix: 'ruby_', end: 6, zeroPad: 4 }),
			repeat: -1,
		})
		this.anims.create({
			key: 'square',
			frames: this.anims.generateFrameNames('gems', { prefix: 'square_', end: 14, zeroPad: 4 }),
			repeat: -1,
		})

		this.nextObstacleDistance = this.globalDistance //Phaser.Math.Between(300, 620) //200min
	}

	update(time, delta) {
		this.globalScore += this.globalSpeed * delta
		this.events.emit('addScore')
		const cursors = this.cursors
		const player = this.player
		this.bgtile.tilePositionX += 0.4
		this.ground.tilePositionX += this.globalSpeed * delta

		if (this.input.keyboard.addKey('R').isDown) {
			this.scene.restart()
		}
		// this.physics.overlap(player, this.obstaclesPool, (player, obstacle) => this.scene.restart(), null, this)

		// if (cursors.left.isDown) {
		// 	player.move(-player.speed * delta)
		// } else if (cursors.right.isDown) {
		// 	player.move(player.speed * delta)
		// }
		if (cursors.up.isDown) {
			player.jump()
		}

		// if(player.y > game.config.height){
		//     this.scene.start("PlayGame"); //endgame for holes?
		// }

		// recycling platforms
		let minDistance = this.game.config.width
		this.obstaclesPool.getChildren().forEach((obstacle) => {
			// obstacle.angle += 2
			obstacle.x -= this.globalSpeed * delta
			let obstacleDistance = this.game.config.width - obstacle.x - obstacle.displayWidth / 2
			minDistance = Math.min(minDistance, obstacleDistance)
			if (obstacle.x < -obstacle.displayWidth / 2) {
				this.obstaclesPool.killAndHide(obstacle)
				this.obstaclesPool.remove(obstacle)
				obstacle.body.destroy()
			}
		})
		// adding new platforms
		if (minDistance > this.nextObstacleDistance) {
			this.addObstacle()
		}
	}

	addObstacle() {
		let nextObject = normalise(this.seed)
		switch (nextObject) {
			case 'empty':
				let empty = new Empty(this)
				empty.active = true
				empty.visible = false
				this.obstaclesPool.add(empty)
				break
			case 'evgeny':
				let evgeny = new Evgeny(this)
				evgeny.active = true
				evgeny.visible = true
				this.obstaclesPool.add(evgeny)
				break
			case 'obstacle':
				let obstacle = new Obstacle(this)
				obstacle.active = true
				obstacle.visible = true
				this.obstaclesPool.add(obstacle)
				break
			case 'powerup':
				let powerup = new PowerUp(this)
				powerup.active = true
				powerup.visible = true
				this.obstaclesPool.add(powerup)
				break
		}
		this.nextObstacleDistance = this.globalDistance //200min
		let nextTick = tick(this.seed)
		this.seed = nextTick
	}

	shutdown() {
		this.scene.stop('GameUIScene')
	}
}
