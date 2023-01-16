import Xerxes from '../../../../../engine/src/scripts/build.js'
import GameSettings from '../settings.js'
import Actors from '../actors.js'

import * as AudioUtils from '../utils/audio.js'

class SceneControls extends Xerxes.control.orbit {

    constructor ( object, domElement ) {

        super( object, domElement )

        // angling

        this.maxPolarAngle = 0.7238392541543307
        this.minPolarAngle = 0.7238392541543307

        // damping (interia)

        this.enableDamping = GameSettings.controls.scene.damping.enabled
        this.dampingFactor = GameSettings.controls.scene.damping.factor

        // distancing

        this.maxDistance = 80
        this.minDistance = 30

        // mouse

        this.mouseButtons.LEFT = null

        // panning

        this.panSpeed = GameSettings.controls.scene.pan.speed
        this.screenSpacePanning = false

        //

        this.isFollowingPerson = false
        this.person = null

    }

    // following

    followPerson ( index ) {

        // AudioUtils.play( '../assets/audio/interface/select-person.mp3' )

        this.enablePan = false

        Actors.control.scene.mouseButtons.RIGHT = Xerxes.constant.controls.mouse.rotate

        this.isFollowingPerson = true
        this.person = index
        
        Actors.pawns.people.label.setHealth( Actors.pawns.people.array[ this.person ].getAttributeCurrent( 'Health' ) )
        Actors.pawns.people.label.setName( Actors.pawns.people.array[ this.person ].getName() )
        Actors.pawns.people.label.show()

        Actors.ui.person.setName( Actors.pawns.people.array[ this.person ].name )
        Actors.ui.person.updateAttributes( this.person )
        Actors.ui.person.show()

    }

    unfollowPerson () {

        this.enablePan = true

        Actors.control.scene.mouseButtons.RIGHT = Xerxes.constant.controls.mouse.pan

        this.isFollowingPerson = false
        this.person = null

        Actors.pawns.people.label.hide()

        Actors.ui.person.hide()

    }

    //

    updateComponents () {

        if ( Actors.pawns.people && this.isFollowingPerson ) {

            const dummyPosition = Actors.pawns.people.array[ this.person ].dummy.position

            this.target.copy( dummyPosition )

            Actors.terrain.selected.x = dummyPosition.x
            Actors.terrain.selected.y = 1
            Actors.terrain.selected.z = dummyPosition.z
            Actors.terrain.update()

            Actors.pawns.people.label.position.set( dummyPosition.x, 4.5, dummyPosition.z )

        }

    }

}

export default SceneControls