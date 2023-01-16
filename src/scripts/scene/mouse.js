import Xerxes from '../engine/build.js'

import Actors from '../actors.js'

class SceneMouse {

    constructor () {

        this.plane = new Xerxes.plane( new Xerxes.vec3( 0, 1, 0 ), 0 )
        this.target = new Xerxes.vec3()

        this.coords = {
            look: new Xerxes.vec2(),
            screen: new Xerxes.vec2(),
            world: new Xerxes.vec3(),
        }

        this.ray = {
            look: new Xerxes.raycaster(),
            point: new Xerxes.raycaster(),
        }

    }

    onMove ( e ) {

        this.coords.look.x = ( e.clientX / window.innerWidth ) * 2 - 1
        this.coords.look.y = -( e.clientY / window.innerHeight ) * 2 + 1

        //

        this.coords.screen.x = e.clientX
        this.coords.screen.y = e.clientY

        //

        this.ray.point.setFromCamera( this.coords.look, Actors.camera.scene )

    }

}

export default SceneMouse