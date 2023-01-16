import Actors from '../actors.js'
import Settings from '../settings.js'

import * as WindowUtils from './window.js'

function add ( price, callback ) {

    Settings.faith += price

    Actors.ui.macro.updateFaith()
    Actors.ui.micro.updateFaith()

    if ( callback ) {

        callback( Settings.faith )

    }

}

function buy ( price, callback ) {

    if ( checkBalance( price ) ) {

        Settings.faith -= price

        Actors.ui.macro.updateFaith()
        Actors.ui.micro.updateFaith()

        if ( callback ) {

            callback( Settings.faith )

        }

    } else {

        WindowUtils.createWarningWindow( {
            id: 'not-enough-faith',
            message: `You dont have enough <imp>🗲 Faith</imp>. You need antoher 
            <imp>${ Math.floor( price - Settings.faith ) }</imp> to purchase this.`,
            lines: 2,
            parent: Actors.ui[ Settings.scene.viewing ].element,
        } )

    }

}

function checkBalance ( price ) {

    if ( Settings.faith - price >= 0 ) {

        return true

    } else {

        return false

    }

}

function sell ( price, callback ) {

    Settings.faith += price

    Actors.ui.macro.updateFaith()
    Actors.ui.micro.updateFaith()

    if ( callback ) {

        callback( Settings.faith )

    }

}

export { add, buy, sell }