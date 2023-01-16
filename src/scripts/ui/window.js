import UI from './ui.js'

import * as AudioUtils from '../utils/audio.js'

let eventCount = 0, warningCount = 0

class Window extends UI {

    constructor () {

        super()
        
        /**
         * The element needs to be modified by adding the "window"
         * attribute to it. This way it can be recogized in DOM and 
         * by the Utils.
         */

    }

}

class EventWindow extends Window {

    constructor ( parameters = {} ) {

        super()

        eventCount++

        this.artFile = parameters.artFile || 'default.png'
        this.contentData = parameters.contentData || 'An event has occured.'
        this.headerData = parameters.headerData || 'An Event has Occured!'
        this.id = parameters.id || `event-${ eventCount }`
        this.parent = parameters.parent || document.body

        this.position = [ 0, 0, 0, 0 ]

        this.okayAction = () => {

            this.hide()

        }

        this.explainAction = () => {

            this.hide()

        }

        // Setup elements for DOM

        this.art = document.createElement( 'art' )
        this.buttons = document.createElement( 'buttons' )
        this.content = document.createElement( 'content' )
        this.element = document.createElement( 'event-window' )
        this.explainButton = document.createElement( 'choice' )
        this.file = document.createElement( 'file' )
        this.header = document.createElement( 'header' )
        this.okayButton = document.createElement( 'choice' )

        this.element.appendChild( this.header )
        this.element.appendChild( this.art )
        this.element.appendChild( this.content )
        this.element.appendChild( this.buttons )
        this.element.setAttribute( 'window', '' )
        this.element.id = this.id
        this.element.style.left = `${ ( window.innerWidth / 2 ) - 250 }px`
        this.element.style.top = `${ ( window.innerHeight / 2 ) - 250 }px`

        this.header.innerHTML = this.headerData
        this.header.setAttribute( 'window-dragger', '' )
        this.header.setAttribute( 'parent', this.id )

        this.art.appendChild( this.file )

        this.file.style.backgroundImage = `url( assets/images/interface/events/${ this.artFile } )`

        this.explainButton.setAttribute( 'choice-explain', '' )
        this.explainButton.innerHTML = 'Explain...'
        this.explainButton.onclick = this.explainAction

        this.okayButton.setAttribute( 'choice-okay', '' )
        this.okayButton.innerHTML = 'Okay'
        this.okayButton.onclick = this.okayAction

        this.buttons.appendChild( this.okayButton )
        this.buttons.appendChild( this.explainButton )

        if ( parameters.describeChoices ) {

            this.contentData += `
                <br><br>
                If you wish to know more on this subject, click the 
                <imp-b>Explain...</imp-b> button below. If you wish to just play,
                click the <imp-b>Okay</imp-b> button instead.
            `

        }

        this.content.innerHTML = this.contentData

        this.parent.appendChild( this.element )

    }

    hide () {

        this.setAnimation( 'ui-fade-out', 0.5, 'forwards', () => {

            this.element.style.display = 'none'

            this.element.remove()

        } )

    }

}

class WarningWindow extends Window {

    constructor ( parameters = {} ) {

        super()

        AudioUtils.play( 'assets/audio/interface/select-person.mp3' )

        warningCount++

        this.message = parameters.message || 'Something happened.'
        this.id = parameters.id || `warning-${ warningCount }`
        this.lines = parameters.lines || 1
        this.parent = parameters.parent || document.body

        this.position = [ 0, 0, 0, 0 ]

        this.okayAction = () => {

            this.hide()

        }

        if ( !this.parent.querySelector( `#${ parameters.id }` ) ) {

            // Setup elements for DOM

            this.buttons = document.createElement( 'buttons' )
            this.content = document.createElement( 'content' )
            this.element = document.createElement( 'warning-window' )
            this.okayButton = document.createElement( 'choice' )

            this.element.appendChild( this.content )
            this.element.appendChild( this.buttons )
            this.element.setAttribute( 'window', '' )
            this.element.id = this.id
            this.element.style.left = `${ ( window.innerWidth / 2 ) - 150 }px`
            this.element.style.top = `${ ( window.innerHeight / 2 ) - 60 }px`
            this.element.style.height = `${ 105 + ( this.lines * 15 ) }px`

            this.okayButton.setAttribute( 'choice-okay', '' )
            this.okayButton.innerHTML = 'Okay'
            this.okayButton.onclick = this.okayAction

            this.buttons.appendChild( this.okayButton )

            this.content.innerHTML = this.message
            this.content.setAttribute( 'window-dragger', '' )
            this.content.setAttribute( 'parent', this.id )

            this.parent.appendChild( this.element )
            
        }

    }

    hide () {

        this.setAnimation( 'ui-fade-out', 0.15, 'forwards', () => {

            this.element.style.display = 'none'

            this.element.remove()

        } )

    }

}

export { EventWindow, WarningWindow, Window }