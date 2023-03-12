import axios from 'axios'
import * as SFS2X from 'sfs2x-api'
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
	buildings
	constructor() {
		super({ key: 'GameScene', active: false, visible: false })
		this.initVars()
	}

	preload() {
		this.load.image('control-box-1', 'assets/boxes/control-box-1.png')
		this.load.image('control-box-2', 'assets/boxes/control-box-2.png')
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
		this.load.image('gameBackground', 'assets/gamebg/mainbg.png') // 'assets/gamebg/foreground.png')
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
		this.load.image('batut', 'assets/powerup.png')
		this.load.image('buildings', 'assets/gamebg/near-buildings-bg.png')
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
		this.seed = window.seed
	}

	create() {
		console.log('!!!')
		this.initVars()

		this.scene.stop('GameOverScene')
		this.scene.stop('PreloadGameScene')
		this.scene.stop('GameUIScene')
		this.scene.launch('GameUIScene')

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

		this.nextObstacleDistance = this.globalDistance //Phaser.Math.Between(300, 620) //200min
	}

	update(time, delta) {
		if (!this.buildings) {
			this.buildings = this.add
				.image(this.game.config.width * 3, this.game.config.height / 2 + 50, 'buildings')
				.setDepth(-1)
				.setScale(1.2)
		} else {
			this.buildings.x -= this.globalSpeed * delta * 0.4
			if (this.buildings.x < 0 && Math.abs(this.buildings.x) > this.game.config.width * 2) {
				this.buildings.destroy()
				this.buildings = null
			}
		}
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
		this.bgtile.tilePositionX += this.globalSpeed * delta * 0.2 //0.4
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
		if (!this.seed) this.seed = window.seed //[...Array(5)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')

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
		sfs.addEventListener(
			SFS2X.SFSEvent.USER_EXIT_ROOM,
			() => {
				const stats = {
					room_id: String(this.game.registry.get('roomId') || 'none'),
					user_id: String(this.game.registry.get('vkData')?.id || 'none'),
					score: parseInt(this.scene.scene.globalScore / 10),
					level: parseInt(this.scene.scene.levelCounter),
					seed: this.game.registry.get('seed'),
					killer: props.killer,
				}
				console.log('stats', stats)
				axios.post('https://temp.rtuitlab.dev/run', stats)

				console.log('leave')
			},
			this
		)
		try {
			sfs.send(new SFS2X.LeaveRoomRequest())
		} catch {
			console.log('err leaving ')
		}

		this.scene.pause('GameScene')
		this.scene.pause('GameUIScene')
		this.scene.launch('GameOverScene')
		this.scene.bringToTop('GameOverScene')
	}

	shutdown() {
		this.scene.stop('GameUIScene')
	}
}
