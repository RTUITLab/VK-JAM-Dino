import bridge from '@vkontakte/vk-bridge'
import Phaser from 'phaser'
import { GameScene } from './game/scenes/gameScene'
import { MenuScene } from './game/scenes/menuScene'
bridge.send('VKWebAppInit', {})

var config = {
	type: Phaser.AUTO,
	physics: {
		default: 'arcade',
		// arcade: {
		// 	gravity: { y: 800 },
		// },
	},
	scale: {
		mode: Phaser.Scale.ScaleModes.SHOW_ALL,
		autoCenter: Phaser.Scale.FIT,
		width: 1920,
		height: 1080,
	},
	pixelArt: true, //remove
	scene: [MenuScene, GameScene],
}

var game = new Phaser.Game(config)
