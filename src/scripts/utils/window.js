import Actors from '../actors.js'

import { EventWindow, WarningWindow, Window } from '../ui/window.js'

function createEventWindow ( parameters = {} ) {

    Actors.window[ parameters.id || 'event' ] = new EventWindow( parameters )

}

function createWarningWindow ( parameters = {} ) {

    Actors.window[ parameters.id || 'warning' ] = new WarningWindow( parameters )

}

function getEventWindow ( id ) {

    const window = document.body.querySelector( `event-window#${ id }` )

    if ( window ) {

        return window

    }

}

function getWindow ( id ) {

    const window = document.body.querySelector( `window#${ id }` )

    if ( window ) {

        return window

    }

}

function removeEventWindow ( id ) {

    const window = document.body.querySelector( `event-window#${ id }` )

    if ( window ) { 

        delete Actors.window[ id ]

        window.remove()
     
    }

}

function removeWindow ( id ) {

    const window = document.body.querySelector( `window#${ id }` )

    if ( window ) { 

        delete Actors.window[ id ]

        window.remove()
     
    }

}

export { 
    createEventWindow,
    createWarningWindow,
    getEventWindow, 
    getWindow, 
    removeEventWindow, 
    removeWindow 
}