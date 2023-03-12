export class GameUIScene extends Phaser.Scene {
	constructor() {
		super({ key: 'GameUIScene', active: false, visible: false })
	}

	preload() {}

	create() {
		//  Our Text object to display the Score
		var info = this.add.text(50, 50, 'Счёт: 0', { font: '48px Arial', fill: '#FFFFFF' })
		//  Grab a reference to the Game Scene
		var gameScene = this.scene.get('GameScene')

		//  Listen for events from it
		gameScene.events.off('addScore')
		gameScene.events.on(
			'addScore',
			function () {
				info.setText('Счёт: ' + parseInt(this.globalScore / 10 || 0))
			},
			gameScene
		)

		const width = this.game.config.width
		const height = this.game.config.height

		const buttonMargin = 10
		const buttonSize = 50
		const container = this.add.container(0, 0)
		const button1 = this.add.circle(
			width - buttonMargin - buttonSize / 2,
			buttonMargin + buttonSize / 2,
			buttonSize / 2,
			0xff0000
		)
		const button1Text = this.add.text(button1.x, button1.y, '1', {
			fontSize: '32px',
			color: '#ffffff',
		})
		button1Text.setOrigin(0.5)
		container.add(button1)
		container.add(button1Text)

		const button2 = this.add.circle(
			width - buttonMargin - buttonSize / 2,
			2 * buttonMargin + (3 * buttonSize) / 2,
			buttonSize / 2,
			0xffff00
		)
		const button3 = this.add.circle(
			width - buttonMargin - buttonSize / 2,
			3 * buttonMargin + (5 * buttonSize) / 2,
			buttonSize / 2,
			0x00ff00
		)

		button1.setInteractive()
		button2.setInteractive()
		button3.setInteractive()

		button1.on('pointerdown', () => {
			// this.scene.get('GameScene').player.setDepth(100)
		})

		button2.on('pointerdown', () => {
			// Handle button 2 click
		})

		button3.on('pointerdown', () => {
			// Handle button 3 click
		})
	}

	update() {}
}
