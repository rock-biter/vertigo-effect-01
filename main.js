import './style.css'
import * as THREE from 'three'
import { MathUtils } from 'three'
import GUI from 'lil-gui'

/**
 * GUI
 */
const gui = new GUI({ width: 500 })

const config = {
	progress: 0,
}

gui.add(config, 'progress', 0, 1, 0.01).onChange((progress) => {
	updateCamera(progress)
})

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Manhattan
 */
const material = new THREE.MeshPhysicalMaterial({ color: 0x7744cb })

const size = 6

for (let i = 0; i < size; i++) {
	for (let j = 0; j < size; j++) {
		const height = Math.random() * 4 + 1

		const geometry = new THREE.BoxGeometry(1, height, 1)

		const mesh = new THREE.Mesh(geometry, material)
		mesh.position.set(-size + i * 2 + 1, -2.5 + height / 2, -size + j * 2 + 1)
		scene.add(mesh)
	}
}

// const mouse = new THREE.Vector2(0, 0)
// let factor = 0

/**
 * render sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}
/**
 * Camera
 */
const fov = 90
const camera = new THREE.PerspectiveCamera(
	fov,
	sizes.width / sizes.height,
	0.1,
	10000
)

camera.position.set(9, 9, 9)
camera.lookAt(new THREE.Vector3(0, 0, 0))

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
	antialias: window.devicePixelRatio < 2,
	logarithmicDepthBuffer: true,
})
renderer.setSize(sizes.width, sizes.height)

const pixelRatio = Math.min(window.devicePixelRatio, 2)
renderer.setPixelRatio(pixelRatio)
document.body.appendChild(renderer.domElement)

/**
 * Three js Clock
 */
const clock = new THREE.Clock()

const light = new THREE.PointLight(0xffffff, 2.5)
light.position.set(size * 1.5, size * 4, size * 1.5)
scene.add(light)

/**
 * Dolly zoom
 */
const finalFOV = 0.5
const initialPos = camera.position.clone()
const fovTan = Math.tan(MathUtils.degToRad(fov / 2))
const RATIO = initialPos.length() * fovTan

function updateCamera(progress) {
	console.log(progress)

	const newFOV = MathUtils.lerp(fov, finalFOV, progress)
	const newFovTan = Math.tan(MathUtils.degToRad(newFOV / 2))
	const d = RATIO / newFovTan

	camera.fov = newFOV

	camera.position.normalize().multiplyScalar(d)
	camera.updateProjectionMatrix()
}

/**
 * frame loop
 */
function tic() {
	/**
	 * tempo trascorso dal frame precedente
	 */
	// const deltaTime = clock.getDelta()
	/**
	 * tempo totale trascorso dall'inizio
	 */
	const time = clock.getElapsedTime()

	renderer.render(scene, camera)

	requestAnimationFrame(tic)
}

requestAnimationFrame(tic)

window.addEventListener('resize', onResize)

function onResize() {
	console.log('resize')
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	renderer.setSize(sizes.width, sizes.height)

	const pixelRatio = Math.min(window.devicePixelRatio, 2)
	renderer.setPixelRatio(pixelRatio)
}

// console.log(window.devicePixelRatio)

// window.addEventListener('mousemove', function (e) {
// 	mouse.x = e.pageX / window.innerWidth
// 	mouse.y = e.pageY / window.innerHeight

// 	// console.log(mouse.x)

// 	updateCamera(mouse.x)
// })
