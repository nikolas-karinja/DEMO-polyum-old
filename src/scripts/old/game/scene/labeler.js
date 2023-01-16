import Xerxes from '../../../../../engine/src/scripts/build.js'

const defaults = {
    antialias: true
}

class SceneLabeler extends Xerxes.renderer.css2d {

    constructor ( parameters = defaults ) {

        super( parameters )

        this.setSize( window.innerWidth, window.innerHeight )

        document.body.appendChild( this.domElement )

    }

    resize () {

        this.setSize( window.innerWidth, window.innerHeight )

    }

}

export default SceneLabeler