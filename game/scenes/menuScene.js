export class MenuScene extends Phaser.Scene {
	bgtile
	constructor(game) {
		super({ key: 'MenuScene', active: true, visible: true })
		this.game = game
	}

	preload() {
		this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png')
	}
	create() {
		const { width, height } = this.scale
		this.bgtile = this.add.tileSprite(0, 0, this.game.config.width * 2, this.game.config.height * 2, 'sky')
		this.bgtile.setOrigin(0, 0)
		this.bgtile.setDepth(-1)

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
