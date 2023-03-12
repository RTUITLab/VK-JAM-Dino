import axios from 'axios'

export class MenuScene extends Phaser.Scene {
	menuBg
	constructor() {
		super({ key: 'MenuScene', active: true, visible: true })
	}

	preload() {
		this.load.image('background', 'assets/space1.png')
		this.load.image('play', '/assets/play_button.png')
		this.load.image('options', '/assets/options_button.png')
		this.load.html('glowingButton', '/html/glowingButton.html')
	}

	create() {
		const user_id = String(this.game.registry.get('vkData')?.id || 'none')

		if (user_id !== 'none') {
			axios.get(`https://temp.rtuitlab.dev/user?uid=${user_id}`).catch(() => {
				const user_name = String(this.game.registry.get('vkData')?.first_name || 'none')

				axios.post('https://temp.rtuitlab.dev/user', {
					"uid": user_id,
					"name": user_name
				})
			})
		}

		// this.scene.scene.events.on('shutdown', this.shutdown, this)
		const { width, height } = this.scale
		this.menuBg = this.add.image(0, 0, 'background')
		this.menuBg.setOrigin(0, 0)
		this.menuBg.setDepth(-2)
		this.menuBg.displayWidth = width
		this.menuBg.displayHeight = height

		let title = this.add
			.text(
				this.game.renderer.width / 2 - this.game.renderer.width / 4 + 40,
				this.game.renderer.height / 2 - this.game.renderer.height / 4,
				'Dino Run',
				{
					fontSize: '80px',
					color: '#ffffff',
				}
			)
			.setDepth(1)
		title.rotation = -0.05

		// let playButton = this.add
		// 	.image(this.game.renderer.width / 2, this.game.renderer.height / 2, 'play')
		// 	.setDepth(1)
		// 	.setInteractive()
		// 	.on(
		// 		'pointerdown',
		// 		() => {
		// 			this.scene.start('GameScene')
		// 		},
		// 		this
		// 	)

		let optionsButton = this.add
			.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 200, 'options')
			.setDepth(1)

		const startButton = this.add.dom(width / 2 - 160, height / 2 + 50).createFromCache('glowingButton')
		startButton.node.getElementsByClassName('text')[0].innerText = 'Играть'
		startButton.addListener('click').on('click', () => {
			this.scene.start('GameScene')
		})

		const shopButton = this.add.dom(width / 2 + 160, height / 2 + 50).createFromCache('glowingButton')
		shopButton.node.getElementsByClassName('text')[0].innerText = 'В магазин'
		shopButton.addListener('click').on('click', () => {
			this.scene.start('ShopScene')
		})

		// кнопка В забег!
		// const h1 = this.add.dom(width * 0.2, height * 0.1, 'h1', 'width:300px;', 'В забег!')

		// h1.setClassName('chrome')
		// h1.setOrigin(0)
		// h1.setDepth(1)
		// h1.addListener('click').on('click', () => {
		// 	this.scene.start('GameScene', { level: 1 })
		// })

		// const teamMode = this.add.dom(width * 0.3, height * 0.15, 'h2', 'width:200px;font-size:3em;', 'Dino')
		// const soloMode = this.add.dom(width * 0.45, height * 0.2, 'h2', 'width:200px;font-size:3em;', 'Run')
		// const battleMode = this.add.dom(
		// 	width * 0.55,
		// 	height * 0.25,
		// 	'h2',
		// 	'width:200px;font-size:3em;',
		// 	'Battle Royal'
		// )
		// const modeButtons = [teamMode, soloMode, battleMode]
		// modeButtons.forEach((e) => {
		// 	e.setClassName('dreams')
		// 	e.setAngle(-15)
		// 	e.setOrigin(0)
		// })

		this.tweens.add({
			targets: [title],
			y: (button) => button.y + (Math.random() < 0.5 ? -1 : 1) * Phaser.Math.Between(1, 7),
			duration: 3000,
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

		// const shopButton = this.add
		// 	.text(width * 0.2, height * 0.45, 'В магазин', { fontSize: '4em', fill: '#fff' })
		// 	.setInteractive()
		// 	.on('pointerdown', () => {
		// 		this.scene.start('ShopScene')
		// 	})

		// // create settings and exit buttons in the bottom left
		// const settingsButton = this.add
		// 	.text(width * 0.2, height - 150, 'Settings', { fontSize: '3.3em', fill: '#fff' })
		// 	.setInteractive()
		// 	.on('pointerdown', () => {
		// 		// open settings menu
		// 	})

		// const exitButton = this.add
		// 	.text(width * 0.2, height - 100, 'Exit', { fontSize: '3.3em', fill: '#fff' })
		// 	.setInteractive()
		// 	.on('pointerdown', () => {
		// 		// this.physics.world.debug.drawDebug = !this.physics.world.debug.drawDebug
		// 	})

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
