import Xerxes from '../engine/build.js'

import Actors from '../actors.js'
import Settings from '../settings.js'

class SceneControl extends Xerxes.control.orbit {

    constructor ( object, domELement ) {

        super( object, domELement )

        // angling

        this.maxPolarAngle = 0.7238392541543307
        this.minPolarAngle = 0.7238392541543307

        // damping (interia)

        this.enableDamping = Settings.controls.scene.damping.enabled
        this.dampingFactor = Settings.controls.scene.damping.factor

        // distancing

        this.maxDistance = Settings.terrain.cell.size * 40
        this.minDistance = Settings.terrain.cell.size * 5

        // mouse

        this.mouseButtons.LEFT = null
        this.mouseButtons.RIGHT = Xerxes.constant.controls.mouse.pan

        // panning

        this.panSpeed = Settings.controls.scene.pan.speed
        this.screenSpacePanning = false

    }

    check () {

        // Panning

        if ( Settings.controls.scene.pan.up ) {

            this.panUp( 
                Settings.controls.scene.pan.speed 
                    / Settings.controls.scene.pan.mult.current, 
                Actors.camera.scene.matrix 
            )

        }

        if ( Settings.controls.scene.pan.down ) {

            this.panUp( 
                -Settings.controls.scene.pan.speed 
                    / Settings.controls.scene.pan.mult.current,
                Actors.camera.scene.matrix 
            )
            
        }

        if ( Settings.controls.scene.pan.left ) {

            this.panLeft( 
                Settings.controls.scene.pan.speed 
                    / Settings.controls.scene.pan.mult.current, 
                Actors.camera.scene.matrix 
            )

        }

        if ( Settings.controls.scene.pan.right ) {

            this.panLeft( 
                -Settings.controls.scene.pan.speed 
                    / Settings.controls.scene.pan.mult.current,
                Actors.camera.scene.matrix 
            )
            
        }

        // Rotating

        if ( Settings.controls.scene.rotate.left ) {

            this.rotateLeft( Settings.controls.scene.rotate.speed )

        }

        if ( Settings.controls.scene.rotate.right ) {

            this.rotateLeft( -Settings.controls.scene.rotate.speed )
            
        }

    }

    resetPosition () {

        this.target = new Xerxes.vec3()

    }

}

export default SceneControl