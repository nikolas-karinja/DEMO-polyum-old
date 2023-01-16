import Xerxes from '../../../../../../engine/src/scripts/build.js'

class PersonLabel extends Xerxes.object.css2d {

    constructor ( element = document.createElement( 'person-label' ) ) {

        super( element )

        //

        this.health = document.createElement( 'health' )
        this.healthbar = document.createElement( 'bar' )
        this.name = document.createElement( 'name' )

        //
        
        this.element.appendChild( this.health )
        this.health.appendChild( this.healthbar )
        this.element.appendChild( this.name )

        //

        this.hide()

    }

    //

    setHealth ( percentage ) {

        this.healthbar.style.width = `${ percentage }%`

    }

    setName ( name ) {

        this.name.innerHTML = name

    }

    // display

    hide () {

        this.visible = false

    }

    show () {

        this.visible = true

    }

}

export default PersonLabel