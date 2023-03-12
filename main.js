import bridge from '@vkontakte/vk-bridge'
import Phaser from 'phaser'
import { GameOverScene } from './game/scenes/gameOverScene'
import { GameScene } from './game/scenes/gameScene'
import { GameUIScene } from './game/scenes/gameUIScene'
import { MenuScene } from './game/scenes/menuScene'
import { ShopScene } from './game/scenes/shopScene'
bridge.send('VKWebAppInit', {})

var config = {
	type: Phaser.AUTO,
	parent: 'phaser',
	dom: {
		createContainer: true,
	},
	physics: {
		default: 'arcade',
		arcade: {
			debug: true,
			// gravity: { y: 800 },
		},
	},
	max: {
		width: 1920,
		height: 1080,
	},
	scale: {
		mode: Phaser.Scale.ScaleModes.SHOW_ALL,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	// pixelArt: true, //remove
	scene: [MenuScene, GameScene, GameUIScene, ShopScene, GameOverScene],
}

var game = new Phaser.Game(config)
