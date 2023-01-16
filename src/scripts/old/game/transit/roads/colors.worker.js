import Xerxes from '../../../../../../engine/src/scripts/build.js'
import GameSettings from '../../settings.js'

onmessage = ( e ) => {

    const pavementIndexes = e.data[ 0 ],
        sidewalkIndexes = e.data[ 1 ]

    const verticesLength = e.data[ 2 ]

    const pavementColor = new Xerxes.color( GameSettings.roads.pavement.color ),
        sidewalkColor = new Xerxes.color( GameSettings.roads.sidewalk.color )

    const colors = []

    let faceIndex = 0, count = 0

    for ( let i = 0; i < verticesLength; i += 3 ) {

        if ( pavementIndexes.includes( faceIndex ) ) {

            colors.push( pavementColor.r, pavementColor.g, pavementColor.b )

        } else {

            colors.push( sidewalkColor.r, sidewalkColor.g, sidewalkColor.b )

        }

        count++

        if ( count == 3 ) {

            count = 0

            faceIndex++

        }

    }

    postMessage( [ colors ] )

}