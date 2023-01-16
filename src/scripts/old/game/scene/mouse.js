import Xerxes from '../../../../../engine/src/scripts/build.js'
import Actors from '../actors.js'

import * as TerrainUtils from '../utils/terrain.js'

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

    onClick ( e ) {

        if ( Actors.camera.scene && Actors.pawns.people ) {

            this.ray.point.setFromCamera( this.coords.look, Actors.camera.scene )
            
            const intersects = this.ray.point.intersectObject( Actors.terrain.land )

            // console.log( Actors.terrain.faces[ intersects[ 0 ].faceIndex ] )

            if ( intersects.length > 0 ) {

                console.log( Actors.terrain.faces[ intersects[ 0 ].faceIndex ] )

                const tile = Actors.terrain.faces[ intersects[ 0 ].faceIndex ].split( ',' )

                TerrainUtils.placeTree( tile[ 0 ], tile[ 1 ] )

            }

        }

    }

    onMove ( e ) {

        this.coords.look.x = ( e.clientX / window.innerWidth ) * 2 - 1
        this.coords.look.y = -( e.clientY / window.innerHeight ) * 2 + 1

        //

        this.coords.screen.x = e.clientX
        this.coords.screen.y = e.clientY

        //

        if ( Actors.camera.scene ) {

            this.ray.look.setFromCamera( this.coords.look, Actors.camera.scene )
            this.ray.look.ray.intersectPlane( this.plane, this.target )

        }

    }

}

export default SceneMouse