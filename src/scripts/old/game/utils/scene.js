import Xerxes from '../../../../../engine/src/scripts/build.js'
import Actors from '../actors.js'
import GameSettings from '../settings.js'
import SceneCamera from '../scene/camera.js'
import SceneControls from '../scene/controls.js'
import SceneMouse from '../scene/mouse.js'
import SceneLabeler from '../scene/labeler.js'
import SceneLight from '../scene/light.js'
import SceneRenderer from '../scene/renderer.js'

function setupActors () {

	Actors.scene.main = new Xerxes.scene()
	Actors.camera.scene = new SceneCamera()
	Actors.mouse.scene = new SceneMouse()
	Actors.renderer.scene = new SceneRenderer()
	Actors.labeler.scene = new SceneLabeler()
	Actors.control.scene = new SceneControls( Actors.camera.scene, Actors.renderer.scene.domElement )
	Actors.pawns.group = new Xerxes.group()

	Actors.scene.main.add( Actors.pawns.group )

}

function setupLighting () {

	// add hemisphere

	Actors.light.hemi = new Xerxes.light.hemisphere( 0xffffff, 0xffffff, 1 )
	Actors.light.hemi.position.set( 0, 500, 0 )

	Actors.scene.main.add( Actors.light.hemi )

	// add sun

	Actors.light.sun = new SceneLight( 0xffffff, 1, { parent: Actors.scene.main } )

}

function setupTestObjects () {

	const loader = new Xerxes.loader.gltf()

	loader.load( '../assets/models/buildings/test.glb', ( model ) => {

		model.scene.children[ 0 ].children.forEach( ( child ) => {

			if ( child.isMesh ) {

				child.castShadow = true
				child.material.side = Xerxes.constant.side.double
				child.material.needsUpdate = true
                
			}

		} )

		// const vertices = new Float32Array( [

		//     // sidewalk

		//     2, 0.25, 2,
		//     2, 0, 2,
		//     -2, 0, 2,
		//     -2, 0, 2,
		//     -2, 0.25, 2,
		//     2, 0.25, 2,

		//     2, 0.25, 2,
		//     2, 0, 2,
		//     2, 0, -2,
		//     2, 0, -2,
		//     2, 0.25, -2,
		//     2, 0.25, 2,

		//     1.25, 0.25, 1.25,
		//     1.25, 0.125, 1.25,
		//     -2, 0.125, 1.25,
		//     -2, 0.125, 1.25,
		//     -2, 0.25, 1.25,
		//     1.25, 0.25, 1.25,

		//     1.25, 0.25, 1.25,
		//     1.25, 0.125, 1.25,
		//     1.25, 0.125, -2,
		//     1.25, 0.125, -2,
		//     1.25, 0.25, -2,
		//     1.25, 0.25, 1.25,

		//     -2, 0.25, 2,
		//     1.25, 0.25, 1.25,
		//     2, 0.25, 2,
		//     -2, 0.25, 2,
		//     -2, 0.25, 1.25,
		//     1.25, 0.25, 1.25,

		//     2, 0.25, -2,
		//     1.25, 0.25, 1.25,
		//     2, 0.25, 2,
		//     2, 0.25, -2,
		//     1.25, 0.25, -2,
		//     1.25, 0.25, 1.25,

		//     // pavement

		//     -2, 0.125, 1.25,
		//     -1.25, 0.125, -1.25,
		//     1.25, 0.125, 1.25,
		//     -2, 0.125, 1.25,
		//     -2, 0.125, -1.25,
		//     -1.25, 0.125, -1.25,
            
		//     1.25, 0.125, -2,
		//     -1.25, 0.125, -1.25,
		//     1.25, 0.125, 1.25,
		//     1.25, 0.125, -2,
		//     -1.25, 0.125, -2,
		//     -1.25, 0.125, -1.25,

		//     // sidewalk

		//     -2, 0.25, -1.25,
		//     -2, 0.125, -1.25,
		//     -1.25, 0.125, -1.25,
		//     -1.25, 0.125, -1.25,
		//     -1.25, 0.25, -1.25,
		//     -2, 0.25, -1.25,

		//     -1.25, 0.25, -2,
		//     -1.25, 0.125, -2,
		//     -1.25, 0.125, -1.25,
		//     -1.25, 0.125, -1.25,
		//     -1.25, 0.25, -1.25,
		//     -1.25, 0.25, -2,

		//     -2, 0.25, -1.25,
		//     -2, 0.25, -2,
		//     -1.25, 0.25, -1.25,
		//     -1.25, 0.25, -2,
		//     -2, 0.25, -2,
		//     -1.25, 0.25, -1.25,

		// ] )

		// const geometry = new Xerxes.geometry.default()

		// geometry.setAttribute( 'position', new Xerxes.buffer.attribute.default( vertices, 3 ) )
		// geometry.attributes.position.needsUpdate = true

		// const mesh = new Xerxes.mesh.default(
		//     geometry,
		//     new Xerxes.material.mesh.phong( { color: 'white', wireframe: true } )
		// )

		// Actors.scene.main.add( mesh )

	} )

}

export { setupActors, setupLighting, setupTestObjects }