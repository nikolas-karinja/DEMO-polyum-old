import UI from './ui.js'

class Vignette extends UI {

    constructor ( element ) {

        super( element )

    }
    
    in () {

        this.setAnimation( 'vignette-wipe-in', 2, 'forwards' )

    }

    out () {

        this.setAnimation( 'vignette-wipe-out', 2, 'forwards' )

    }

}

export default Vignette