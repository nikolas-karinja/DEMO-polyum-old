import * as AudioUtils from '../utils/audio.js'

class Attribute {

    constructor ( icon, label, parameters = {} ) {

        this.element = document.createElement( 'attr' )

        //

        this.bar = document.createElement( 'bar' )
        this.bar.fill = document.createElement( 'fill' )
        this.bar.label = document.createElement( 'label' )

        this.bar.appendChild( this.bar.fill )
        this.bar.appendChild( this.bar.label )

        this.element.appendChild( this.bar )

        //

        this.icon = document.createElement( 'icon' )
        this.icon.style.backgroundImage = `url(${ icon })`

        this.element.appendChild( this.icon )

        //

        this.label = document.createElement( 'label' )
        this.label.innerHTML = label

        this.element.appendChild( this.label )

        //

        if ( parameters.left ) this.element.style.marginLeft = parameters.left
        if ( parameters.top ) this.element.style.marginTop = parameters.top
        if ( parameters.width ) this.element.style.width = parameters.width

        if ( parameters.barBackground ) this.bar.style.backgroundColor = parameters.barBackground
        if ( parameters.barForeground ) this.bar.fill.style.backgroundColor = parameters.barForeground

        if ( parameters.maxValue && parameters.value ) this.setValue( parameters.value, parameters.maxValue )

    }

    setValue ( value, maxValue ) {

        const fillWidth = ( 100 / maxValue ) * value

        this.bar.fill.style.width = `${ fillWidth }%`
        this.bar.label.innerHTML = `${ Math.floor( value ) }/${ Math.floor( maxValue ) }`

    }

}

class UI {

    constructor ( element, orientation ) {

        this.element = element
        this.bounds = this.element.getBoundingClientRect()
        this.orientation = orientation // b, l, r, t

        this.attributes = {}
        this.buttons = {}

        //

        this.generateButtons()

    }

    // auto

    generateButtons () {

        if ( this.element.hasAttribute( 'closeable' ) ) {

            this.buttons.close = document.createElement( 'btn-close' )
            this.buttons.close.setAttribute( this.orientation, '' )

            this.buttons.close.onclick = ( e ) => {

                AudioUtils.play( '../assets/audio/interface/click-normal.mp3' )

                this.onClose()

            }
            
            this.element.appendChild( this.buttons.close )

        }

    }

    //

    onClose () { /* stuff goes here */ }

    // display

    hide () {

        this.element.style.transition = '0.5s ease-in'

        switch ( this.orientation ) {

            case 'b':
                this.element.style.marginBottom = `-${ this.bounds.height * 1.5 }px`
                break

            case 'l':
                this.element.style.marginLeft = `-${ this.bounds.width * 1.5 }px`
                break

            case 'r':
                this.element.style.marginRight = `-${ this.bounds.width * 1.5 }px`
                break

            case 't':
                this.element.style.marginTop = `-${ this.bounds.height * 1.5 }px`
                break

        }

    }

    show () {

        this.element.style.transition = '0.5s ease-out'

        switch ( this.orientation ) {

            case 'b':
                this.element.style.marginBottom = `12px`
                break

            case 'l':
                this.element.style.marginLeft = `12px`
                break

            case 'r':
                this.element.style.marginRight = `12px`
                break

            case 't':
                this.element.style.marginTop = `12px`
                break

        }

    }

    //

    addAttribute ( element, icon, label, parameters = {} ) {

        this.attributes[ label ] = new Attribute( icon, label, parameters )

        element.appendChild( this.attributes[ label ].element )

    }

    getAttribute ( name ) {

        return this.attributes[ name ]

    }

    //

    init () { /* stuff goes here */ }

}

export default UI