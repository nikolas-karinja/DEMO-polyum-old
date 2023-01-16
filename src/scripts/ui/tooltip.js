import TooltipData from '../data/tooltip.js'
import UI from './ui.js'

import * as AudioUtils from '../utils/audio.js'

class Tooltip extends UI {

    constructor () {

        super()

        this.element = document.body.querySelector( 'tooltip' )
        this.isShowing = true

        this.hide()

    }

    hide () {

        if ( this.isShowing ) {

            this.element.style.display = 'none'

            this.isShowing = false

        }

    }

    show () {

        if ( !this.isShowing ) {

            this.element.style.display = 'inline-block'

            this.isShowing = true

        }

    }

    onMove ( x, y ) {

        this.element.style.left = `${ x + 32 }px`
        this.element.style.top = `${ y + 32 }px`

    }

    setData ( heading, detail, content, extra ) {

        this.element.querySelector( 'header heading' )
            .innerHTML = heading ? heading : ''
        this.element.querySelector( 'detail' )
            .innerHTML = detail ? detail : ''
        this.element.querySelector( 'content' )
            .innerHTML = content ? content : ''
        this.element.querySelector( 'header extra' )
            .innerHTML = extra ? extra : ''

    }

    setFromArray ( array ) {

        this.setData( ...array )

    }

    setFromData ( name ) {

        this.setData( ...TooltipData[ name ] )

    }

    getDataExtra ( name ) {

        return this.data[ name ][ 3 ]

    }

    getDataContent ( name ) {

        return this.data[ name ][ 2 ]

    }

    getDataDetail ( name ) {

        return this.data[ name ][ 1 ]

    }

    getDataHeading ( name ) {

        return this.data[ name ][ 0 ]

    }

}

export default Tooltip