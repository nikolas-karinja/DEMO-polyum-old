import Actors from '../actors.js'
import EntityData from '../data/entities.js'
import Settings from '../settings.js'

import * as ResourceUtils from './resources.js'

let ticksThisSecond = 0

function setup () {

    setInterval( () => {

        ticksThisSecond++

        Actors.control.scene.check()

        // Do this every second

        if ( ticksThisSecond == Settings.ticks.perSecond ) {

            ticksThisSecond = 0

            const cropIncome = ( Settings.crops * EntityData[ 'crops' ].faithPerSecond )
                + ( Settings.peopleTending.crops * EntityData[ 'crops' ].faithTendingPerSecond )

            const millIncome = ( ( Settings.mills * EntityData[ 'mill' ].faithPerSecond )
                + ( Settings.peopleTending.mills * EntityData[ 'mill' ].faithTendingPerSecond ) )
            
            const granaryIncome = ( Settings.granaries * ( Settings.mills * 
            ( EntityData[ 'mill' ].faithPerSecond * EntityData[ 'granary' ].faithMultPerSecond ) ) )
            + ( Settings.peopleTending.granaries * ( Settings.mills * 
            ( EntityData[ 'mill' ].faithPerSecond * EntityData[ 'granary' ].faithMultTendingPerSecond ) ) )

            const combinedIncome = cropIncome + millIncome + granaryIncome

            ResourceUtils.add( combinedIncome )
            
        }
        
    }, 1000 / Settings.ticks.perSecond )

}

function updateTickSpeed () {

    Settings.ticks.perSecond = Math.floor( Settings.ticks.base * Settings.speed.current )

}

export { setup, updateTickSpeed }