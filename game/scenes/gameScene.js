import axios from 'axios'
import { normalise, tick } from '../../helpers/seed'
import { Player } from '../player'
import { Car } from '../sprites/car'
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
	maxSpeed
	controlSpeed
	globalDistance
	globalScore
	tempScore
	ground
	obstacleCounter
	levelCounter
	constructor() {
		super({ key: 'GameScene', active: false, visible: false })
		this.seed = [...Array(5)].map(() => Math.floor(Math.random() * 16).toString(16)).join('') //'9y3f' // random hex lenght 5
		this.initVars()
	}

	preload() {
		this.load.image('dude', 'https://labs.phaser.io/assets/sprites/phaser-dude.png')
		this.load.image('control-box-1', 'assets/boxes/control-box-1.png')
		this.load.image('player', 'assets/player/idle-3.png')
		this.load.spritesheet('playerRun', 'assets/player/run/spritesheet.png', {
			frameWidth: 71,
			frameHeight: 67,
			endFrame: 7,
		})
		this.load.spritesheet('playerJump', 'assets/player/jump/spritesheet.png', {
			frameWidth: 71,
			frameHeight: 67,
			endFrame: 4,
		})
		// this.load.image('dude', this.registry.get('vkData').photo_100)
		this.load.atlas(
			'gems',
			'https://labs.phaser.io/assets/tests/columns/gems.png',
			'https://labs.phaser.io/assets/tests/columns/gems.json'
		)
		this.load.image(
			'gameBackground',
			'https://rare-gallery.com/thumbs/982899-Retrowave-neon-artwork-minimalism-digital-art.png'
		) // 'assets/gamebg/foreground.png')
		this.load.image(
			'ground',
			'assets/gamebg/ground.png'
			//'https://lpc.opengameart.org/sites/default/files/oga-textures/15886/ground_asphalt_old_06.png'
		)
		this.load.image('obstacle', 'https://labs.phaser.io/assets/games/asteroids/asteroid1.png')
		this.load.image('v-police', 'assets/obstacles/v-police.png')
		this.load.image('v-red', 'assets/obstacles/v-red.png')
		this.load.image('v-truck', 'assets/obstacles/v-truck.png')
		this.load.image('v-yellow', 'assets/obstacles/v-yellow.png')
		this.load.audio('jungle', [
			'https://labs.phaser.io/assets/audio/jungle.ogg',
			'https://labs.phaser.io/assets/audio/jungle.mp3',
		])
	}

	initVars() {
		this.obstacleCounter = 0
		this.globalSpeed = Phaser.Math.GetSpeed(200, 1)
		this.maxSpeed = Phaser.Math.GetSpeed(1200, 1)
		this.controlSpeed = 250
		this.globalScore = 0
		this.tempScore = 0
		this.globalDistance = 500
		this.levelCounter = 0
	}

	create() {
		this.initVars()

		this.scene.launch('GameUIScene')
		// this.scene.scene.physics.world.drawDebug = true
		this.bgtile = this.add
			.tileSprite(0, 0, this.game.config.width * 2, this.game.config.height, 'gameBackground')
			.setDepth(-1)
			.setScale(1.7)
		this.cursors = this.input.keyboard.createCursorKeys()
		this.player = new Player(this, this.game.config.width * 0.1, 0)
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
		// this.globalSpeed += 0.0000001
		this.globalScore += this.globalSpeed * delta
		this.currentSpeed = this.globalSpeed
		this.tempScore += this.globalSpeed * delta
		if (this.currentSpeed < this.maxSpeed) {
			if (this.tempScore / 10 >= this.controlSpeed) {
				this.tempScore = 0
				this.globalSpeed += Phaser.Math.GetSpeed(120, 1)
				this.controlSpeed *= this.globalSpeed / this.currentSpeed
				this.levelCounter++
				console.log('level', this.levelCounter)
				// this.globalDistance *= 0.1 + this.currentSpeed
			}
		}
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
		let obstacleDistance = this.game.config.width
		this.obstaclesPool.getChildren().forEach((obstacle) => {
			// obstacle.angle += 2
			obstacle.x -= this.globalSpeed * delta
			obstacleDistance = Math.min(
				this.game.config.width - obstacle.x - obstacle.displayWidth / 2, //здесь не будет больше 990
				obstacleDistance
			) //this.game.config.width - obstacle.x - obstacle.displayWidth / 2
			// minDistance = obstacleDistance //Math.min(minDistance, obstacleDistance)
			if (obstacle.x < -obstacle.displayWidth / 2 && this.obstaclesPool.getLength() > 2) {
				this.obstaclesPool.killAndHide(obstacle)
				this.obstaclesPool.remove(obstacle)
				obstacle.body.destroy()
			}
		})

		// console.log(obstacleDistance, this.nextObstacleDistance)
		// adding new platforms
		if (obstacleDistance > this.nextObstacleDistance) {
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
			case 'v-truck':
				if (this.levelCounter < 3) {
					let car = new Car(this, nextObject, { flying: true })
					car.active = true
					car.visible = true
					this.obstaclesPool.add(car)
					break
				}
			case 'v-police':
			case 'v-red':
			case 'v-yellow':
				if (this.levelCounter < 1) {
					let car = new Car(this, nextObject, { flying: true })
					car.active = true
					car.visible = true
					this.obstaclesPool.add(car)
					break
				}
				let car = new Car(this, nextObject)
				car.active = true
				car.visible = true
				this.obstaclesPool.add(car)
				break
		}
		this.nextObstacleDistance = this.globalDistance * (0.7 + this.globalSpeed) //200min
		let nextTick = tick(this.seed)
		this.seed = nextTick
	}

	gameOver(props) {
		console.log('real gameover')
		console.log('gr', this.scene)
		const stats = {
			room_id: '0',
			user_id: String(this.game.registry.get('vkData')?.id || 'none'),
			score: parseInt(this.scene.scene.globalScore / 10),
			level: parseInt(this.scene.scene.levelCounter),
			seed: this.scene.scene.seed,
			killer: props.killer,
		}
		console.log('stats', stats)
		axios.post('https://temp.rtuitlab.dev/run', stats)

		this.scene.pause('GameScene')
		this.scene.pause('GameUIScene')
		this.scene.launch('GameOverScene')
	}

	shutdown() {
		this.scene.stop('GameUIScene')
	}
}
