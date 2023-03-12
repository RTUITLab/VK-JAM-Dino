export class GameOverScene extends Phaser.Scene {
	constructor() {
		super({ key: 'GameOverScene', active: false, visible: false })
	}

	preload() {
		this.load.html('glowingButton', '/html/glowingButton.html')
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
			.text(width / 2, height / 2 - 100, 'Конец', {
				fontFamily: 'Arial',
				fontSize: '48px',
				color: '#ffffff',
			})
			.setOrigin(0.5)
			.setDepth(11)

		const restartButton = this.add.dom(width / 2 - 50, height / 2 + 50).createFromCache('glowingButton')
		restartButton.node.getElementsByClassName('text')[0].innerText = 'Еще'
		restartButton.addListener('click').on('click', () => {
			this.scene.start('GameScene')
		})

		const quitButton = this.add.dom(width / 2 + 100, height / 2 + 50).createFromCache('glowingButton')
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
