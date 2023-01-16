import Xerxes from '../../engine/build.js'

class SceneWebGLRenderer extends Xerxes.renderer.webgl {

    constructor ( parameters ) {

        super( parameters )

        this.domElement.id = 'game-canvas'

        this.autoClear = false
        this.outputEncoding = Xerxes.constant.encoding.srgb
        this.setPixelRatio( window.devicePixelRatio )

        this.append()
        this.resize()

    }

    append () {

        document.body.appendChild( this.domElement )

    }

    resize () {

        this.setSize( window.innerWidth, window.innerHeight )

    }

}

export default SceneWebGLRenderer