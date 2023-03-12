export class MenuScene extends Phaser.Scene {
	menuBg
	constructor() {
		super({ key: 'MenuScene', active: false, visible: false })
	}

	preload() {
		this.load.image('background', 'https://labs.phaser.io/assets/skies/space1.png')
		this.load.html('hi', '../../html/startGame.html')
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
		const h1 = this.add.dom(width * 0.2, height * 0.1, 'h1', 'width:300px;', 'В забег!')
		// const form = this.add.dom(400, 300).createFromCache('hi')
		h1.setClassName('chrome')
		h1.setOrigin(0)
		h1.setDepth(1)
		h1.addListener('click').on('click', () => {
			this.scene.start('GameScene', { level: 1 })
		})

		const teamMode = this.add.dom(width * 0.2, height * 0.3, 'h2', 'width:20px;font-size:2em;', 'Team')
		const soloMode = this.add.dom(width * 0.3, height * 0.3, 'h2', 'width:20px;font-size:2em;', 'Solo')
		const battleMode = this.add.dom(
			width * 0.4,
			height * 0.3,
			'h2',
			'width:20px;font-size:2em;',
			'Battle royal'
		)
		const modeButtons = [teamMode, soloMode, battleMode]
		modeButtons.forEach((e) => {
			e.setClassName('dreams')
			e.setAngle(-15)
			e.setOrigin(0)
		})

		this.tweens.add({
			targets: modeButtons,
			y: (button) => button.y + (Math.random() < 0.5 ? -1 : 1) * Phaser.Math.Between(2, 5),
			duration: 2000,
			ease: 'Sine.easeInOut',
			loop: -1,
			yoyo: true,
		})

		// var element = this.add.dom(10, 10).createFromCache('hi')
		// element.node.style.width = '200px' // set the width of the element
		// element.node.style.height = '100px' // set the height of the element
		// element.setOrigin(0.5)
		// element.setScale(2)
		// element.setDepth(10)
		// // element.updatePosition(-element.width / 2, -element.height / 2)
		// console.log(element)

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
		// const playButtonOld = this.add
		// 	.text(width * 0.2, height * 0.3, 'В забег!', { fontSize: '5em', fill: '#fff' })
		// 	.setInteractive()
		// 	.on('pointerdown', () => {
		// 		this.scene.start('GameScene', { level: 1 })
		// 		this.scene.sleep('MenuScene')
		// 	})

		const shopButton = this.add
			.text(width * 0.2, height * 0.45, 'В магазин', { fontSize: '4em', fill: '#fff' })
			.setInteractive()
			.on('pointerdown', () => {
				this.scene.start('ShopScene')
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
		// const imageSpace = this.add
		// 	.graphics()
		// 	.fillStyle(0xffff23f)
		// 	.fillRect(width * 0.5, 0, width / 2, height)
	}

	update() {
		// this.input.on('pointerup', () => {
		// 	this.scale.startFullscreen()
		// })
	}
}
