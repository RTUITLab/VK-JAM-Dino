import axios from 'axios'
import * as SFS2X from 'sfs2x-api'

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
					uid: user_id,
					name: user_name,
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

		const sfs = new SFS2X.SmartFox()
		window.sfs = sfs
		sfs.addEventListener(
			SFS2X.SFSEvent.CONNECTION,
			(params) => {
				if (params.success) {
					console.log(params)
					sfs.addEventListener(
						SFS2X.SFSEvent.LOGIN,
						(data) => {
							console.log(data)
						},
						this
					)
					sfs.addEventListener(
						SFS2X.SFSEvent.LOGIN_ERROR,
						(data) => {
							console.log(data)
						},
						this
					)

					sfs.send(new SFS2X.LoginRequest(new Date().toLocaleString(), '', null, 'BasicExamples')) //!UNCOMMENT
				} else {
					console.log('params')
				}
			},
			this
		)

		sfs.connect('temp1.rtuitlab.dev', 443, true)

		let title = this.add
			.text(
				this.game.renderer.width / 2 - this.game.renderer.width / 4 - 150,
				this.game.renderer.height / 2 - this.game.renderer.height / 4,
				'Wave Cup Royale',
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

		// let optionsButton = this.add
		// 	.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 200, 'options')
		// 	.setDepth(1)

		// кнопка В забег!
		const h1 = this.add.dom(width * 0.2, height * 0.1, 'h1', 'width:300px;', 'В забег!')

		const startButton = this.add.dom(width / 2 - 160, height / 2 + 80).createFromCache('glowingButton')
		startButton.node.classList.add('green')
		startButton.node.getElementsByClassName('text')[0].innerText = 'Играть'
		startButton.addListener('click').on('click', () => {
			function addRoomHandler(d) {
				console.log('ADD0', d)

				setTimeout(() => {
					var roomVars = []
					roomVars.push(new SFS2X.SFSRoomVariable('gameStarted', true))
					roomVars.push(new SFS2X.SFSRoomVariable('seed', window.seed))

					sfs.send(new SFS2X.SetRoomVariablesRequest(roomVars))
				}, 10000)
			}

			function joinRoomHandler(d) {
				sfs.removeEventListener(SFS2X.SFSEvent.ROOM_ADD, addRoomHandler)
				sfs.removeEventListener(SFS2X.SFSEvent.ROOM_JOIN, joinRoomHandler)
				console.log('JOIN room_id: ', d.room._id)
				this.game.registry.set('roomId', d.room._id)
			}

			sfs.addEventListener(SFS2X.SFSEvent.ROOM_ADD, addRoomHandler, this)
			sfs.addEventListener(
				SFS2X.SFSEvent.ROOM_VARIABLES_UPDATE,
				(d) => {
					console.log('td', d.room._variables['seed'])
					window.seed ??= d.room._variables['seed']
					this.scene.stop('gamePreloadScene')
					this.scene.stop('GameScene')
					this.scene.start('GameScene')
					this.scene.bringToTop('GameScene')
				},
				this
			)
			sfs.addEventListener(SFS2X.SFSEvent.ROOM_JOIN, joinRoomHandler, this)
			sfs.addEventListener(
				SFS2X.SFSEvent.ROOM_CREATION_ERROR,
				(d) => {
					console.log('CE', d)
				},
				this
			)
			sfs.addEventListener(
				SFS2X.SFSEvent.ROOM_JOIN_ERROR,
				(d) => {
					console.log('JE', d)
				},
				this
			)
			sfs.addEventListener(
				SFS2X.SFSEvent.USER_COUNT_CHANGE,
				(p) => {
					// Изменение игроков в комнате
					console.log('user_count: ', p.uCount)
					this.game.registry.set('user_count', p.uCount)
				},
				this
			)

			const settings = new SFS2X.RoomSettings(new Date().toLocaleString().slice(0, 20))
			settings.groupId = 'games'
			settings.isPublic = true
			settings.isGame = true
			settings.maxUsers = 20
			settings.minPlayersToStartGame = 2
			settings.allowUserCountChange = true

			const roomVars = []
			roomVars.push(new SFS2X.SFSRoomVariable('gameStarted', false))
			settings.variables = roomVars

			const exp = new SFS2X.MatchExpression('gameStarted', SFS2X.BoolMatch.EQUALS, false)
			sfs.send(new SFS2X.QuickJoinOrCreateRoomRequest(exp, ['games'], settings, sfs.lastJoinedRoom))

			this.scene.start('PreloadGameScene')
		})

		const shopButton = this.add.dom(width / 2 + 160, height / 2 + 80).createFromCache('glowingButton')
		shopButton.node.getElementsByClassName('text')[0].innerText = 'В магазин'
		shopButton.addListener('click').on('click', () => {
			this.scene.start('ShopScene')
		})

		// const faqButton = this.add.dom(width / 2 + 30, height / 2 + 240).createFromCache('glowingButton')
		// faqButton.node.getElementsByClassName('text')[0].innerText = 'FAQ'
		// faqButton.addListener('click').on('click', () => {
		// 	this.scene.start('FAQScene')
		// })

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
