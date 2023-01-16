import Xerxes from '../../../../../engine/src/scripts/build.js'
import GameSettings from '../settings.js'

const defaults = {
	antialias: true
}

class SceneRenderer extends Xerxes.renderer.webgl {

	constructor ( parameters = defaults ) {

		super( parameters )

		this.outputEncoding = Xerxes.constant.encoding.srgb
		// this.shadowMap.enabled = true

		this.setPixelRatio( window.devicePixelRatio )
		this.setSize( window.innerWidth, window.innerHeight )

		document.body.appendChild( this.domElement )

	}

	resize () {

		this.setSize( window.innerWidth, window.innerHeight )

	}

}

export default SceneRenderer