import Xerxes from '../../../../../../engine/src/scripts/build.js'
import Actors from '../../actors.js'
import GameSettings from '../../settings.js'
import Pawn from '../class.js'

import * as PawnUtils from '../../utils/pawn.js'

class PersonAttribute {

    constructor () {

        this.current = Xerxes.math.random( 1, 100 )
        this.max = 100

    }

}

class Person extends Pawn {

    constructor ( index, model, parameters = {} ) {

        super( index, model, parameters )
        
        this.name = parameters.name || PawnUtils.generatePersonName( true )
        this.stage = parameters.stage || 2
        this.traits = parameters.traits || []

        //

        this.attributes = {}

        this.addAttribute( 'Boredom' )
        this.addAttribute( 'Happiness' )
        this.addAttribute( 'Health' )
        this.addAttribute( 'Hunger' )
        this.addAttribute( 'Hygiene' )
        this.addAttribute( 'Tiredness' )

    }

    //

    addAttribute ( name ) {

        this.attributes[ name ] = new PersonAttribute()

    }

    getAttributeCurrent ( name ) {

        return this.attributes[ name ].current

    }

    getAttributeMax ( name ) {

        return this.attributes[ name ].max

    }

    getAttributeValues ( name ) {

        return [ this.attributes[ name ].current, this.attributes[ name ].max ]

    }

    // naming

    getFirstName () {

        return this.name.split( ' ' )[ 0 ]

    }

    getLastName () {

        return this.name.split( ' ' )[ 1 ]

    }

    getName () {

        return this.name
        
    }

    //

    stopTraveling () {

        super.stopTraveling()

        Actors.ui.notif.push( `${ this.name } got there!` )

    }

    updateAnimations () {
        
        this.dummy.rotation.z += Math.sin( Date.now()
            * ( ( this.travel.speed / 5 ) * GameSettings.speed.current ) )
            * Math.PI * 0.025
            
        this.dummy.rotation.y += Math.sin( Date.now() 
            * ( ( this.travel.speed / 5 ) * GameSettings.speed.current ) ) 
            * Math.PI * 0.05

    }

}

export default Person