import axios from 'axios'
import * as SFS2X from "sfs2x-api";

export class MenuScene extends Phaser.Scene {
	menuBg
	constructor() {
		super({ key: 'MenuScene', active: true, visible: true })
	}

	preload() {
		this.load.image('background', 'https://labs.phaser.io/assets/skies/space1.png')
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

		const sfs = new SFS2X.SmartFox();
		window.sfs = sfs
		sfs.addEventListener(SFS2X.SFSEvent.CONNECTION, (params) => {
			if (params.success) {
				console.log(params)
				sfs.addEventListener(SFS2X.SFSEvent.LOGIN, (data) => {
					console.log(data)
				}, this)
				sfs.addEventListener(SFS2X.SFSEvent.LOGIN_ERROR, (data) => {
					console.log(data)
				}, this)

				sfs.send(new SFS2X.LoginRequest(new Date().toLocaleString(), "", null, "BasicExamples"))
			} else {
				console.log('params')
			}
		}, this)

		sfs.connect("51.250.110.149", 8080);

		// кнопка В забег!
		const h1 = this.add.dom(width * 0.2, height * 0.1, 'h1', 'width:300px;', 'В забег!')

		h1.setClassName('chrome')
		h1.setOrigin(0)
		h1.setDepth(1)
		h1.addListener('click').on('click', () => {
			sfs.addEventListener(SFS2X.SFSEvent.ROOM_ADD, (d) => {
				console.log('ADD', d)
				setTimeout(() => {
					sfs.addEventListener(SFS2X.SFSEvent.ROOM_VARIABLES_UPDATE, () => {
						this.scene.start('GameScene', { level: 1 })
					}, this);

					var roomVars = [];
					roomVars.push(new SFS2X.SFSRoomVariable("gameStarted", true));

					sfs.send(new SFS2X.SetRoomVariablesRequest(roomVars));
				}, 10000)
			}, this);
			sfs.addEventListener(SFS2X.SFSEvent.ROOM_JOIN, (d) => {
				console.log('JOIN room_id: ', d.room._id)
				// Мы вошли в комнату
			}, this);
			sfs.addEventListener(SFS2X.SFSEvent.ROOM_CREATION_ERROR, (d) => {
				console.log('CE', d)
			}, this);
			sfs.addEventListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, (d) => {
				console.log('JE', d)
			}, this);
			sfs.addEventListener(SFS2X.SFSEvent.USER_COUNT_CHANGE, (p) => {
				// Изменение игроков в комнате
				console.log('user_count: ', p.uCount)
			}, this)

			const settings = new SFS2X.RoomSettings(new Date().toLocaleString().slice(0, 20));
			settings.groupId = "games";
			settings.isPublic = true;
			settings.isGame = true;
			settings.maxUsers = 20;
			settings.minPlayersToStartGame = 2;
			settings.allowUserCountChange = true

			const roomVars = [];
			roomVars.push(new SFS2X.SFSRoomVariable("gameStarted", false));
			settings.variables = roomVars

			const exp = new SFS2X.MatchExpression('gameStarted', SFS2X.BoolMatch.EQUALS, false)
			sfs.send(new SFS2X.QuickJoinOrCreateRoomRequest(exp, ["games"], settings, sfs.lastJoinedRoom));
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
				// this.physics.world.debug.drawDebug = !this.physics.world.debug.drawDebug
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
