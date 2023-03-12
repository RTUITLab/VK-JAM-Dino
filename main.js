import bridge from '@vkontakte/vk-bridge'
import Phaser from 'phaser'
import { GameOverScene } from './game/scenes/gameOverScene'
import { GameScene } from './game/scenes/gameScene'
import { GameUIScene } from './game/scenes/gameUIScene'
import { MenuScene } from './game/scenes/menuScene'
import { ShopScene } from './game/scenes/shopScene'

async function getVkInfo() {
	const vkUser = await bridge.send('VKWebAppGetUserInfo')
	// setVkUser(vkUser)
	return vkUser
	// bridge
	// 	.send('VKWebAppStorageGet', {
	// 		keys: ['address'],
	// 	})
	// 	.then((data) => {
	// 		if (data.keys) {
	// 			console.log('walletAddress successfully restored')
	// 			setUser({ ...user, walletAddress: data.keys[0].value.toString() })
	// 		}
	// 	})
	// 	.catch((error) => {
	// 		// Ошибка
	// 		console.log('walletAddress unsuccessfully unrestored')
	// 	})
}

bridge.send('VKWebAppInit')

var config = {
	type: Phaser.AUTO,
	parent: 'phaser',
	dom: {
		createContainer: true,
	},
	width: 800,
	height: 600,
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
		mode: Phaser.Scale.ScaleModes.AUTO,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	pixelArt: true,
	scene: [MenuScene, GameScene, GameUIScene, ShopScene, GameOverScene],
}

var game = new Phaser.Game(config)

console.log('game', game)
getVkInfo().then((v) => {
	console.log('vk', v)
	game.registry.set('vkData', v)
})
