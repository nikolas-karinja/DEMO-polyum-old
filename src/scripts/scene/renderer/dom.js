import Xerxes from '../../engine/build.js'

class SceneDOMRenderer extends Xerxes.renderer.css2d {

    constructor () {

        super()

        this.domElement.id = 'game-dom-sprites'
        this.domElement.style.pointerEvents = 'none'
        this.domElement.style.zIndex = '2'

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

export default SceneDOMRenderer