import * as SFS2X from 'sfs2x-api'

export class PreloadGameScene extends Phaser.Scene {
	constructor() {
		super('PreloadGameScene')
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
		const searchingText = this.add.text(width / 2 - 200, height / 2 - 200, 'Идёт поиск игроков', {
			fontFamily: 'Arial',
			fontSize: '48px',
			color: '#ffffff',
		})

		this.usersText = this.add.text(width / 2 - 200, height / 2 - 100, 'Найдено: ', {
			fontFamily: 'Arial',
			fontSize: '48px',
			color: '#ffffff',
		})

		// this.tweens.add({
		// 	targets: searchingText,
		// 	duration: 3000,
		// 	repeat: -1,
		// 	yoyo: true,
		// 	onStart: () => {
		// 		// Add dots every second
		// 		this.dotTimer = this.time.addEvent({
		// 			delay: 1000,
		// 			callback: () => {
		// 				searchingText.text += '.'
		// 			},
		// 			loop: true,
		// 		})
		// 	},
		// 	onComplete: () => {
		// 		// Remove the dots after three seconds
		// 		this.time.delayedCall(
		// 			3000,
		// 			() => {
		// 				searchingText.text = 'Идёт поиск игроков'
		// 				this.dotTimer.remove(false)
		// 			},
		// 			[],
		// 			this
		// 		)
		// 	},
		// })

		var soloButton = this.add.dom(width / 2 - 260, height / 2 + 160).createFromCache('glowingButton')
		soloButton.node.getElementsByClassName('text')[0].innerText = 'Сыграть одному'
		soloButton.addListener('click').on('click', () => {
			sfs.send(new SFS2X.LeaveRoomRequest())
			this.scene.start('GameScene') //! FIX REMOVE CALLBACKS
		})

		var quitButton = this.add.dom(width / 2 + 160, height / 2 + 160).createFromCache('glowingButton')
		quitButton.node.getElementsByClassName('text')[0].innerText = 'Прервать'
		quitButton.addListener('click').on('click', () => {
			this.scene.get('GameScene').shutdown()
			this.scene.stop('GameScene')
			this.scene.start('MenuScene')
			this.scene.bringToTop('MenuScene')
		})
	}

	update() {
		const usersCount = this.game.registry.get('user_count') || 1
		this.usersText.text = 'Найдено: ' + usersCount + '/20'
	}
}
