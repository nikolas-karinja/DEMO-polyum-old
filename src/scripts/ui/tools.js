import Actors from '../actors.js'
import UI from './ui.js'

import * as AudioUtils from '../utils/audio.js'

class ToolUI extends UI {

    constructor ( element ) {

        super( element )

        this.button = {
            disasters: this.element.querySelector( 'button#disasters' ),
            flora: this.element.querySelector( 'button#flora' ),
            monuments: this.element.querySelector( 'button#monuments' ),
            tasks: this.element.querySelector( 'button#tasks' ),
            stats: this.element.querySelector( 'button#stats' ),
            structures: this.element.querySelector( 'button#structures' ),
        }

        this.generateListeners()

    }

    generateListeners () {

        const _this = this

        for ( const b in this.button ) {

            if (
                b == 'flora' || b == 'structures' ||
                b == 'monuments' || b == 'disasters'
            ) {

                this.button[ b ].onclick = function () {

                    if ( Actors.ui.items.typeShowing != this.id ) {

                        _this.select( this )

                        Actors.ui.items.displayItems( this.id ).then( () => {

                            if ( !Actors.ui.items.isShowing ) {
                
                                Actors.ui.items.show()
                
                            }
                
                        } )

                    } else {

                        _this.deselect( this )

                        Actors.ui.items.hide()

                    }
                
                }

            }

        }

    }

    //

    deselect ( button ) {

        AudioUtils.play( 'assets/audio/interface/click-open.mp3', 0.75 )

        button.removeAttribute( 'selected' )

    }

    select ( button ) {

        AudioUtils.play( 'assets/audio/interface/click-open.mp3', 0.75 )

        button.setAttribute( 'selected', '' )

    }

}

export default ToolUI