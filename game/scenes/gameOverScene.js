import * as SFS2X from "sfs2x-api";

export class GameOverScene extends Phaser.Scene {
	constructor() {
		super({ key: 'GameOverScene', active: false, visible: false })
	}

	preload() {
		this.load.html('glowingButton', '/html/glowingButton.html')
		this.load.image('gameover', '/assets/gameover.png')
	}

	create() {
		const width = this.game.config.width
		const height = this.game.config.height

		// Create the overlay
		const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7)
		overlay.setOrigin(0)
		overlay.setDepth(10)

		// Create the game over text
		const gameOverText = this.add
			.text(width / 2 - 24, height / 2 - 200, 'Конец', {
				fontFamily: 'Arial',
				fontSize: '48px',
				color: '#ffffff',
			})
			.setDepth(11)

		const gameover = this.add.image(width / 2 + 40, height / 2, 'gameover')

		const restartButton = this.add.dom(width / 2 - 60, height / 2 + 160).createFromCache('glowingButton')
		restartButton.node.getElementsByClassName('text')[0].innerText = 'Еще'
		restartButton.addListener('click').on('click', () => {
			function addRoomHandler(d) {
				console.log('ADD', d)

				setTimeout(() => {
					console.log('ASDASDAS')
					var roomVars = []
					roomVars.push(new SFS2X.SFSRoomVariable('gameStarted', true))
					roomVars.push(new SFS2X.SFSRoomVariable('seed', SEED))	// TODO: gen seed

					sfs.send(new SFS2X.SetRoomVariablesRequest(roomVars))
				}, 10000)
			}

			function joinRoomHandler(d) {
				sfs.removeEventListener(SFS2X.SFSEvent.ROOM_ADD, addRoomHandler)
				sfs.removeEventListener(SFS2X.SFSEvent.ROOM_JOIN, joinRoomHandler)
				console.log('JOIN room_id: ', d.room._id)
				this.game.registry.set('roomId', d.room._id)
			}

			sfs.addEventListener(
				SFS2X.SFSEvent.ROOM_ADD,
				addRoomHandler,
				this
			)

			
			sfs.addEventListener(
				SFS2X.SFSEvent.ROOM_JOIN,
				joinRoomHandler,
				this
			)

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

		const quitButton = this.add.dom(width / 2 + 110, height / 2 + 160).createFromCache('glowingButton')
		quitButton.node.getElementsByClassName('text')[0].innerText = 'В меню'
		quitButton.addListener('click').on('click', () => {
			this.scene.get('GameScene').shutdown()
			this.scene.stop('GameScene')
			this.scene.start('MenuScene')
			this.scene.bringToTop('MenuScene')
		})

		// Create the buttons
		// const restartButton = this.add
		// 	.text(width / 2 - 100, height / 2 + 50, 'Опять', {
		// 		fontFamily: 'Arial',
		// 		fontSize: '32px',
		// 		color: '#ffffff',
		// 	})
		// 	.setDepth(11)
		// 	.setInteractive()
		// 	.on('pointerup', () => {
		// 		this.scene.start('GameScene')
		// 	})

		// const quitButton = this.add
		// 	.text(width / 2 + 100, height / 2 + 50, 'Домой', {
		// 		fontFamily: 'Arial',
		// 		fontSize: '32px',
		// 		color: '#ffffff',
		// 	})
		// 	.setDepth(11)
		// 	.setInteractive()
		// 	.on('pointerup', () => {
		// 		this.scene.stop('GameScene')
		// 		this.scene.start('MenuScene')
		// 		this.scene.bringToTop('MenuScene')
		// 		this.scene.stop('GameOverScene')
		// 		this.scene.bringToTop('MenuScene')
		// 	})
	}
}
