import Xerxes from '../../engine/build.js'

import Actors from '../../actors.js'
import Settings from '../../settings.js'

class MacroTerrainTile {

    constructor ( 
        index, faceA, faceB, 
        facesArray, macroVertexArray, vertexArray 
    ) {

        this.column = null
        this.hasTree = false
        this.index = index
        this.isCliff = false
        this.isCoast = false
        this.isLand = false
        this.isOccupied = false
        this.isUnderwater = false
        this.row = null

        this.avg = {
            position: new Xerxes.vec3(),
        }

        this.faces = {
            array: [ faceA, faceB ],

            a: faceA,
            b: faceB,
        }

        this.vertices = {
            indexes: [],
            stringed: [],
        }

        this.getVerticesFromArrays( facesArray, macroVertexArray, vertexArray )
        this.getAvgPosition()
        this.determineTerrainType()
        this.determineTreeStatus()

    }

    determineTerrainType () {

        this.isCliff = false
        this.isCoast = false
        this.isLand = false
        this.isUnderwater = false

        const underwater = [], vertices = []

        for ( let i = 0; i < this.vertices.stringed.length; i++ ) {

            const z = Number( this.vertices.stringed[ i ].split( ',' )[ 2 ] )

            vertices.push( z )

            if ( z < 0 ) {

                underwater.push( z )

            }

        }

        // Use underwater array to check the terrain type first

        if ( underwater.length == 4 ) {

            this.isUnderwater = true

        }

        if ( underwater.length >= 1 && underwater.length <= 3 ) {

            this.isCoast = true

        }

        if ( underwater.length == 0 ) {

            this.isLand = true

        }

        // Then use the min / max heights of the vertices

        const max = Math.max( ...vertices ),
            min = Math.min( ...vertices )

        this.maxZ = max

        if ( max - min >= Settings.terrain.factor.cliff ) {

            this.isCliff = true

        }

    }

    determineTreeStatus () {

        if ( Math.random() >= Settings.terrain.factor.tree ) {

            this.hasTree = true

        }

    }

    getAvgPosition () {

        const x = [], y = [], z = []

        for ( let i = 0; i < this.vertices.stringed.length; i++ ) {

            const splitString = this.vertices.stringed[ i ].split( ',' )

            x.push( Number( splitString[ 0 ] ) )
            y.push( Number( splitString[ 1 ] ) )
            z.push( Number( splitString[ 2 ] ) )

        }

        const xAvg = ( x[ 0 ] + x[ 1 ] + x[ 2 ] + x[ 3 ] ) / x.length,
            yAvg = ( y[ 0 ] + y[ 1 ] + y[ 2 ] + y[ 3 ] ) / y.length,
            zAvg = ( z[ 0 ] + z[ 1 ] + z[ 2 ] + z[ 3 ] ) / z.length

        this.avg.position = new Xerxes.vec3( xAvg, yAvg, zAvg )

    }

    getVerticesFromArrays ( facesArray, macroVertexArray, vertexArray ) {

        for ( let f = 0; f < this.faces.array.length; f++ ) {

            for ( let v = 0; v < facesArray[ this.faces.array[ f ] ].array.length; v++ ) {

                const vPos = macroVertexArray[ facesArray[ this.faces.array[ f ] ].array[ v ] ]
                    .getCoordsFromArray( vertexArray )

                const stringedPosition = `${ vPos.x },${ vPos.y },${ vPos.z }`

                if ( !this.vertices.stringed.includes( stringedPosition ) ) {

                    this.vertices.indexes.push( 
                        facesArray[ this.faces.array[ f ] ].array[ v ] 
                    )

                    this.vertices.stringed.push( stringedPosition )

                }

            }

        }

    }

    restringVertices () {

        this.vertices.stringed = []

        for ( let f = 0; f < this.faces.array.length; f++ ) {

            for ( let v = 0; v < Actors.terrain.macro.faces[ this.faces.array[ f ] ].array.length; v++ ) {

                const vPos = Actors.terrain.macro.vertices[ Actors.terrain.macro.faces[ this.faces.array[ f ] ].array[ v ] ]
                    .getCoordsFromArray( Actors.terrain.macro.geometry.attributes.position.array )

                const stringedPosition = `${ vPos.x },${ vPos.y },${ vPos.z }`

                if ( !this.vertices.stringed.includes( stringedPosition ) ) {

                    this.vertices.stringed.push( stringedPosition )

                }

            }

        }

    }

    update () {

        this.isOccupied = false

        this.restringVertices()
        this.getAvgPosition()
        this.determineTerrainType()

    }

}

export default MacroTerrainTile