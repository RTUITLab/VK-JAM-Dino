var gameScene = {
	key: 'GameScene',
	active: false,
	visible: false,
	preload: gameLoader,
	create: createGame,
	update: updateGame,
	extend: {
		addObstacle: addObstacle,
	},
}

class MenuScene extends Phaser.Scene {
	constructor() {
		super({ key: 'MenuScene', active: true, visible: true })
	}

	preload() {
		this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png')
	}
	create() {
		const { width, height } = this.scale
		bgtile = this.add.tileSprite(0, 0, game.config.width * 2, game.config.height * 2, 'sky')
		bgtile.setOrigin(0, 0)
		bgtile.setDepth(-1)

		// кнопка В забег!
		const playButtonBorderWidth = 4
		const playButtonPadding = 8
		const playButton = this.add
			.text(width * 0.2, height * 0.3, 'В забег!', {
				fontSize: '5em',
				fill: '#fff',
			})
			.setPadding(playButtonPadding)
			.setInteractive()
			.on('pointerdown', () => {
				this.scene.start('GameScene', { level: 1 })
			})
		const playButtonBounds = playButton.getBounds()
		const playButtonBorderRect = this.add.graphics()
		playButtonBorderRect.lineStyle(playButtonBorderWidth, 0xffffff)
		playButtonBorderRect.strokeRect(
			playButtonBounds.x - playButtonPadding - playButtonBorderWidth / 2,
			playButtonBounds.y - playButtonPadding - playButtonBorderWidth / 2,
			playButtonBounds.width + playButtonPadding * 2 + playButtonBorderWidth,
			playButtonBounds.height + playButtonPadding * 2 + playButtonBorderWidth
		)

		const playButton2 = this.add
			.text(width * 0.2, height * 0.5, 'Play 2', { fontSize: '32px', fill: '#fff' })
			.setInteractive()
			.on('pointerdown', () => {
				this.scene.start('GameScene', { level: 2 })
			})

		// create settings and exit buttons in the bottom left
		const settingsButton = this.add
			.text(50, height - 50, 'Settings', { fontSize: '24px', fill: '#fff' })
			.setInteractive()
			.on('pointerdown', () => {
				// open settings menu
			})

		const exitButton = this.add
			.text(50, height - 25, 'Exit', { fontSize: '24px', fill: '#fff' })
			.setInteractive()
			.on('pointerdown', () => {
				// exit the game
			})

		// create empty space for images on the right
		const imageSpace = this.add
			.graphics()
			.fillStyle(0xffffff)
			.fillRect(width * 0.6, 0, width * 0.4, height)
	}
	update() {
		// this.input.on('pointerup', () => {
		// 	this.scale.startFullscreen()
		// })
	}
}

function gameLoader() {
	// loadImage = this.add.image(0, 0, 'loader').setOrigin(0)
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
	// this.load.animation('birdyAnims', 'assets/demoscene/birdy.json');
	// this.load.image('bg1', 'assets/demoscene/birdy-nam-nam-bg1.png')
	// this.load.image('bg2', 'assets/demoscene/birdy-nam-nam-bg2.png');
	// this.load.atlas('birdy', 'assets/demoscene/budbrain.png', 'assets/demoscene/budbrain.json');
}

var cursors
var player
var speed
var ground
var bgtile

class Player extends Phaser.Physics.Arcade.Sprite {
	// playerJumps = 0r
	constructor(scene, x, y) {
		super(scene, x, y, 'dude')
		scene.physics.add.existing(this)
		this.scene.add.existing(this)
		this.displayHeight = 120
		this.displayWidth = 100
		speed = Phaser.Math.GetSpeed(400, 1)
	}

	init() {
		this.setDepth(1)
		this.setOrigin(0, 0)
		this.setGravityY(900)
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
			this.setVelocityY(500 * -1)
			// this.playerJumps = 1
		}
	}
}

class Ground extends Phaser.GameObjects.TileSprite {
	constructor(scene) {
		let groundX = scene.sys.game.config.width * 2
		let groundY = scene.sys.game.config.height * 0.41
		super(scene, 0, scene.sys.game.config.height, groundX, groundY, 'ground')

		scene.physics.add.existing(this)
		scene.add.existing(this)
		this.setDepth(1)
		// this.displayHeight = scene.sys.game.config.height * 0.2
		// this.displayWidth = scene.sys.game.config.width
		//add the colliders
		scene.physics.add.collider(player, this)
		this.body.setImmovable()
	}
}

class Obstacle extends Phaser.Physics.Arcade.Sprite {
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
		scene.physics.add.collider(player, this, gameOver.bind(this.scene), gameOver.bind(this.scene))
	}
}
function gameOver() {
	this.scene.restart()
}

function addObstacle() {
	let obstacle = new Obstacle(this)
	obstacle.active = true
	obstacle.visible = true
	this.obstaclesPool.add(obstacle)
	this.nextObstacleDistance = Phaser.Math.Between(300, 620) //200min
}

function createGame() {
	bgtile = this.add.tileSprite(0, 0, game.config.width * 2, game.config.height * 2, 'sky')
	bgtile.setOrigin(0, 0)
	bgtile.setDepth(-1)

	cursors = this.input.keyboard.createCursorKeys()
	player = new Player(this, 0, 0)
	player.init()
	ground = new Ground(this)
	// pool
	this.obstaclesPool = this.add.group()

	this.addObstacle()
}

function updateGame(time, delta) {
	bgtile.tilePositionX += 0.2
	ground.tilePositionX += 0.3

	if (this.input.keyboard.addKey('R').isDown) {
		this.scene.restart()
	}
	// this.physics.overlap(player, this.obstaclesPool, (player, obstacle) => this.scene.restart(), null, this)

	if (cursors.left.isDown) {
		player.move(-speed * delta)
	} else if (cursors.right.isDown) {
		player.move(speed * delta)
	}
	if (cursors.up.isDown) {
		player.jump()
	}

	// if(player.y > game.config.height){
	//     this.scene.start("PlayGame"); //endgame for holes?
	// }

	// recycling platforms
	let minDistance = game.config.width
	this.obstaclesPool.getChildren().forEach((obstacle) => {
		let obstacleDistance = game.config.width - obstacle.x - obstacle.displayWidth / 2
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

var config = {
	type: Phaser.AUTO,
	physics: {
		default: 'arcade',
		// arcade: {
		// 	gravity: { y: 800 },
		// },
	},
	scale: {
		mode: Phaser.Scale.ScaleModes.SHOW_ALL,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: 1920,
		height: 1080,
	},
	scene: [MenuScene, gameScene],
}

var game = new Phaser.Game(config)
