class UI {

    constructor ( element ) {

        this.element = element

    }

    /**
     * 
     * @param { String } animation CSS animation
     */

    hide ( animation ) {

        if ( animation ) {

            this.element.style.animation = animation

        } else {

            this.element.style.display = 'none'
 
        }

    }

    show ( animation ) {

        if ( animation ) {

            this.element.style.animation = animation

        } else {

            this.element.style.display = 'inline-block'

        }

    }

    /**
     * Using the methods below allows for easy way to animations
     * to the DOM without having to go through the whole CSS task.
     */

    clearAnimation () {

        this.element.style.animation = 'none'

    }

    setAnimation ( name, seconds, parameters, onCompleted ) {

        this.element.style.animation = `${ name } ${ seconds }s ${ parameters }`

        if ( onCompleted ) {

            setTimeout( () => onCompleted( this ), seconds * 1000 )

        }

    }

}

export default UI