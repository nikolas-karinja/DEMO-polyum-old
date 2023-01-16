import Actors from '../actors.js'
import Settings from '../settings.js'
import UI from './ui.js'

import * as AudioUtils from '../utils/audio.js'
import * as CursorUtils from '../utils/cursor.js'
import * as SceneUtils from '../utils/scene.js'

class MacroUI extends UI {

    constructor ( element ) {

        super( element )

        this.faith = this.element.querySelector( 'wealth amount' )

        this.button = {
            divineVoid: this.element.querySelector( 'place' ),
        }

        this.generateListeners()
        this.updateFaith()

    }

    generateListeners () {

        this.button.divineVoid.onclick = () => {

            AudioUtils.play( 'assets/audio/interface/click-close.mp3' )

            Settings.build.selected = null

            if ( Settings.build.item.index != null ) {

                Actors.ui.items.itemsDisplayed[ Settings.build.item.index ].deselect()

            }

            this.toMicro()

        }

    }
    
    show () {

        this.element.style.display = 'inline-block'

        this.setAnimation( 'ui-fade-in', 2, 'forwards' )

    }

    toMicro () {

        AudioUtils.play( 'assets/audio/void-transition-in.mp3' )

        Actors.ui.vignette.out()

        this.setAnimation( 'ui-fade-out', 2, 'forwards', () => {

            Actors.terrain.macro.animatedEntities = []

            CursorUtils.set( 'normal' )

            AudioUtils.play( 'assets/audio/void-transition-out.mp3' )

            this.hide()

            Actors.ui.tooltip.hide()

            SceneUtils.view( 'micro' )

            Actors.ui.micro.show()
            Actors.ui.vignette.in()

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

export default MacroUI