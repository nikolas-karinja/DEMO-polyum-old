import Actors from '../actors.js'
import EventData from '../data/events.js'
import Settings from '../settings.js'
import UI from './ui.js'

import * as AudioUtils from '../utils/audio.js'
import * as CursorUtils from '../utils/cursor.js'
import * as SceneUtils from '../utils/scene.js'
import * as WindowUtils from '../utils/window.js'

class MicroUI extends UI {

    constructor ( element ) {

        super( element )

        this.faith = this.element.querySelector( 'wealth amount' )

        this.updateFaith()

    }

    show () {

        this.element.style.display = 'inline-block'

        this.setAnimation( 'ui-fade-in', 2, 'forwards' )

    }

    toMacro ( chunkIndex ) {

        AudioUtils.play( 'assets/audio/void-transition-in.mp3' )

        Actors.ui.vignette.out()

        this.setAnimation( 'ui-fade-out', 2, 'forwards', () => {

            CursorUtils.set( 'normal' )

            this.hide()

            Actors.ui.tooltip.hide()

            SceneUtils.view( 'macro' )

            Actors.terrain.viewMacro( chunkIndex ).then( () => {

                AudioUtils.play( 'assets/audio/void-transition-out.mp3' )

                Actors.ui.macro.show()
                Actors.ui.vignette.in()

                if ( Actors.terrain.macro.timesViewed <= 1 ) {

                    WindowUtils.createEventWindow( EventData[ 'time-to-mess-around' ] )

                }

            } )

        } )

    }

    /**
     * Everything below here is for managing resources. Resources
     * include things such as faith.
     */

    updateFaith () {

        this.faith.innerHTML = Math.floor( Settings.faith )

    }

}

export default MicroUI