import Actors from '../actors.js'
import GameSettings from '../settings.js'

import ConstructUI from '../ui/construct.js'
import NotifUI from '../ui/notif.js'
import PersonUI from '../ui/person.js'

function setup () {

    Actors.ui.construct = new ConstructUI( document.body.querySelector( 'construct-ui' ), 'r' )
    Actors.ui.notif = new NotifUI( document.body.querySelector( 'notif-ui' ), 'l' )
    Actors.ui.person = new PersonUI( document.body.querySelector( 'person-ui' ), 'l' )

    Actors.ui.construct.hide()
    Actors.ui.person.hide()

}

function updatePopulation () {

    document.body.querySelector( 'resources-ui pop val' ).innerHTML = `${ Actors.pawns.people.array.length } / ${ GameSettings.people.population.max }`

}

export { setup, updatePopulation }