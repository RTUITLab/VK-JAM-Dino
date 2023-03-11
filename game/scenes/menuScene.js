export class MenuScene extends Phaser.Scene {
	menuBg
	constructor() {
		super({ key: 'MenuScene', active: true, visible: true })
	}

	preload() {
		this.load.image('background', 'https://labs.phaser.io/assets/skies/space1.png')
		this.load.css('80s', 'https://labs.phaser.io/assets/loader-tests/80stypography.css')
	}

	create() {
		// this.scene.scene.events.on('shutdown', this.shutdown, this)
		const { width, height } = this.scale
		this.menuBg = this.add.image(0, 0, 'background')
		this.menuBg.setOrigin(0, 0)
		this.menuBg.setDepth(-2)
		this.menuBg.displayWidth = width
		this.menuBg.displayHeight = height

		// кнопка В забег!
		const playButtonBorderWidth = 4
		const playButtonPadding = 8
		const playButton = this.add
			.dom(0, 0, 'h1', 'background-color: lime; width: 220px; height: 100px; font: 48px Arial', 'В забег!')
			.setDepth(22)

		const playButton2 = this.add
			.dom(200, 200, 'h1', { height: '200px', width: '200px', color: 'white', fontSize: '40px' }, 'В забег!')
			.setClassName('chrome')

		const test = this.add
			.dom(
				100,
				100,
				'div',
				'background-color: rgba(255, 255, 0, 0.5); width: 300px; height: 200px; font: 48px Arial; font-weight: bold',
				'hellelelel'
			)
			.setOrigin(0)

		console.log(test)

		var h1 = this.add.dom(450, 100, 'h1', null, 'CHROME')

		h1.setClassName('chrome')
		h1.setDepth(22)

		var h2 = this.add.dom(570, 180, 'h2', null, 'Dreams')

		h2.setClassName('dreams')
		h2.setAngle(-15)

		this.tweens.add({
			targets: [h1, h2],
			y: 500,
			duration: 3000,
			ease: 'Sine.easeInOut',
			loop: -1,
			yoyo: true,
		})

		//playButton.setClassName('chrome') //.setDepth(10)
		// this.tweens.add({
		// 	targets: playButton,
		// 	y: 500,
		// 	duration: 3000,
		// 	ease: 'Sine.easeInOut',
		// 	loop: -1,
		// 	yoyo: true,
		// })
		// .setPadding(playButtonPadding)
		// playButton.setInteractive().on('pointerdown', () => {
		// 	// this.scene.stop('MenuScene')
		// 	this.scene.start('GameScene', { level: 1 })
		// })
		// const playButtonBounds = playButton.getBounds()
		// const playButtonBorderRect = this.add.graphics()
		// playButtonBorderRect.lineStyle(playButtonBorderWidth, 0xffffff)
		// playButtonBorderRect.strokeRect(
		// 	playButtonBounds.x - playButtonPadding - playButtonBorderWidth / 2,
		// 	playButtonBounds.y - playButtonPadding - playButtonBorderWidth / 2,
		// 	playButtonBounds.width + playButtonPadding * 2 + playButtonBorderWidth,
		// 	playButtonBounds.height + playButtonPadding * 2 + playButtonBorderWidth
		// )

		const shopButton = this.add
			.text(width * 0.2, height * 0.45, 'В магазин', { fontSize: '4em', fill: '#fff' })
			.setInteractive()
			.on('pointerdown', () => {
				//this.scene.start('ShopScene')
			})

		// create settings and exit buttons in the bottom left
		const settingsButton = this.add
			.text(width * 0.2, height - 150, 'Settings', { fontSize: '3.3em', fill: '#fff' })
			.setInteractive()
			.on('pointerdown', () => {
				// open settings menu
			})

		const exitButton = this.add
			.text(width * 0.2, height - 100, 'Exit', { fontSize: '3.3em', fill: '#fff' })
			.setInteractive()
			.on('pointerdown', () => {
				// exit the game
			})

		// create empty space for images on the right
		const imageSpace = this.add
			.graphics()
			.fillStyle(0xffff23f)
			.fillRect(width * 0.5, 0, width / 2, height)
	}

	update() {
		// this.input.on('pointerup', () => {
		// 	this.scale.startFullscreen()
		// })
	}
}
