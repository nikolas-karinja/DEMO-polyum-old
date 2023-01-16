import Xerxes from '../../engine/build.js'

import Actors from '../../actors.js'

class MacroTerrainVertex {

    constructor ( x, y ) {

        this.indexes = [] // [ 0, 1 ]
        this.x = x
        this.y = y

    }

    addIndex ( index ) {

        this.indexes.push( index )

    }

    getCoords () {

        return new Xerxes.vec3( this.x, this.y, this.getHeight() )

    }

    getCoordsFromArray ( vertexArray ) {

        return new Xerxes.vec3( 
            this.x, this.y, 
            this.getHeightFromArray( vertexArray ) 
        )

    }

    getHeight () {

        return Actors.terrain.macro.geometry.attributes.position
            .array[ ( this.indexes[ 0 ] * 3 ) + 2 ]
        
    }

    getHeightFromArray ( vertexArray ) {

        return vertexArray[ ( this.indexes[ 0 ] * 3 ) + 2 ]
        
    }

    setHeight ( height ) {

        for ( let i = 0; i < this.indexes.length; i++ ) {

            Actors.terrain.macro.geometry.attributes.position
                .array[ ( this.indexes[ i ] * 3 ) + 2 ] = height

        }

    }

    setHeightFromArray ( vertexArray, height ) {

        for ( let i = 0; i < this.indexes.length; i++ ) {

            vertexArray[ ( this.indexes[ i ] * 3 ) + 2 ] = height

        }

    }

}

export default MacroTerrainVertex