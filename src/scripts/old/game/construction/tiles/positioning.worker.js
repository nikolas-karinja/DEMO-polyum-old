import Tile from './tile.js'
import GameSettings from '../../settings.js'

onmessage = ( e ) => {

    const tilesWide = e.data[ 0 ],
        tilesHigh = e.data[ 1 ]

    const startX = ( ( tilesWide * GameSettings.terrain.tile.diameter ) / -2 ) + ( GameSettings.terrain.tile.diameter / 2 ),
        startZ = ( ( tilesHigh * GameSettings.terrain.tile.diameter ) / -2 ) + ( GameSettings.terrain.tile.diameter / 2 )

    const positionArray = [],
        tileArray = []

    for ( let h = 0; h < tilesHigh; h++ ) {

        positionArray.push( [] )

        tileArray.push( [] )

        for ( let w = 0; w < tilesWide; w++ ) {

            const x = startX + ( w * GameSettings.terrain.tile.diameter ),
                y = GameSettings.terrain.offset,
                z = startZ + ( h * GameSettings.terrain.tile.diameter )

            positionArray[ h ][ w ] = { x, z }

            tileArray[ h ][ w ] = new Tile( x, y, z, h + 1, w + 1 )
    
        }

    }

    postMessage( [ positionArray, tileArray ] )

}