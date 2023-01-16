import Xerxes from '../../../../engine/src/scripts/build.js'
import GameSettings from './settings.js'
import SystemStats from './stats.js'
import Actors from './actors.js'

import * as ArrayUtils from './utils/array.js'
import * as ConstructionUtils from './utils/construction.js'
import * as PawnUtils from './utils/pawn.js'
import * as SceneUtils from './utils/scene.js'
import * as TerrainUtils from './utils/terrain.js'
import * as UIUtils from './utils/ui.js'

import { generateListeners } from './listeners.js'

GameSettings.updateTitle()

class App extends Xerxes.app.default {

	constructor () {

		super()

		this.actors = Actors

		this.worker = new Worker( './scripts/game/update.worker.js' )

		this.worker.onmessage = ( e ) => {

			Actors.terrain.grid.position.y = e.data[ 0 ]

		}

	}

	init () {

		SceneUtils.setupActors()
		SceneUtils.setupLighting()

		UIUtils.setup()

		Actors.terrain = TerrainUtils.build( 'basic', { parent: Actors.scene.main } )

		ConstructionUtils.buildTileGrid( GameSettings.terrain.getPreset() )
		ConstructionUtils.buildRoadMesh()
		ConstructionUtils.hideGrid()

		PawnUtils.placePeople()

		generateListeners()

		this.resize()
		this.visualize()

	}

	update () {

		SystemStats.begin()

		//

		Actors.control.scene.update()
		Actors.control.scene.updateComponents()
            
		Actors.light.sun.update( Actors.control.scene.target )

		Actors.renderer.scene.render( Actors.scene.main, Actors.camera.scene )
		Actors.labeler.scene.render( Actors.scene.main, Actors.camera.scene )

		if ( Actors.pawns.people ) {

			Actors.ui.person.update()

			Actors.pawns.people.update()

		}

		//

		Xerxes.tween.update()

		//

		SystemStats.end()

	}

	resize () {

		window.onresize = () => {

			if ( Actors.camera.scene ) Actors.camera.scene.updateProjection()
			if ( Actors.labeler.scene ) Actors.labeler.scene.resize()
			if ( Actors.renderer.scene ) Actors.renderer.scene.resize()

		}

	}

}

window.app = new App( {
	useSRGBEncoding: true
} )

window.app.init()