let seed = '957f' // random hex lenght 5
let trtr = ''

function hex2bin(seed) {
	let raw = parseInt(seed, 16).toString(2)
	let zeroes = ''
	if (raw.length < 16) {
		for (let i = 0; i < 16 - raw.length; i++) {
			zeroes += '0'
		}
	}
	return zeroes + raw
}

function bin2hex(seed) {
	return parseInt(seed, 2).toString(16)
}

function tick(seedH) {
	seed = hex2bin(seedH)
	let s = seed[6] ^ seed[15]
	let t = seed.slice(0, -1)
	return bin2hex(String.prototype.concat(s, t))
}

function normalise(seed) {
	let currentIndex = parseInt(seed.at(-2), 16)
	let options = ['obstacle', 'evgeny', 'empty', 'powerup']
	console.log(options[Math.floor(currentIndex / 4)])
	return options[Math.floor(currentIndex / 4)]
}

// for (let i = 1; i < 5; i++) {
// 	trtr = tick(seed)
// 	seed = trtr
// 	console.log(seed)
// }

export { tick, normalise }
