import Xerxes from '../engine/build.js'

import Actors from '../actors.js'
import Plot from './plot.js'
import Settings from '../settings.js'
import TerrainChunkTileMap from './chunk/map.js'

import { 
    ChunkHoverMaterial, 
    ChunkSelectMaterial, 
    TerrainMaterial 
} from './material.js'

import * as SimplexUtils from '../utils/simplex.js'

/**
 * These are the classes for the geometric arrays withing the terrain
 * to keep track of vertex and facial data.
 */

class TerrainChunkFace {

    constructor ( a, b, c ) {

        this.a = a // 0
        this.b = b // 1
        this.c = c // 2

    }

    setA ( index ) {

        this.a = index

    }

    setB ( index ) {

        this.b = index

    }

    setC ( index ) {

        this.c = index

    }

    setColor ( colorAttribute, color ) {

        colorAttribute.setXYZ( this.a, color.r, color.g, color.b )
        colorAttribute.setXYZ( this.b, color.r, color.g, color.b )
        colorAttribute.setXYZ( this.c, color.r, color.g, color.b )

    }

    getMinMaxDifference ( vertexArray ) {

        const values = [
            vertexArray[ ( this.a * 3 ) + 2 ],
            vertexArray[ ( this.b * 3 ) + 2 ],
            vertexArray[ ( this.c * 3 ) + 2 ]
        ]

        const max = Math.max( ...values ),
            min = Math.min( ...values )
            
        return max - min

    }

    getMax ( vertexArray ) {

        const values = [
            vertexArray[ ( this.a * 3 ) + 2 ],
            vertexArray[ ( this.b * 3 ) + 2 ],
            vertexArray[ ( this.c * 3 ) + 2 ]
        ]

        return Math.max( ...values )

    }

    getMin ( vertexArray ) {

        const values = [
            vertexArray[ ( this.a * 3 ) + 2 ],
            vertexArray[ ( this.b * 3 ) + 2 ],
            vertexArray[ ( this.c * 3 ) + 2 ]
        ]

        return Math.min( ...values )

    }

}

class TerrainChunkVertex {

    constructor ( x, y ) {

        this.indexes = [] // [ 0, 1 ]
        this.x = x
        this.y = y

    }

    addIndex ( index ) {

        this.indexes.push( index )

    }

    setHeight ( vertexArray, height ) {

        for ( let i = 0; i < this.indexes.length; i++ ) {

            vertexArray[ ( this.indexes[ i ] * 3 ) + 2 ] = height

        }

    }

}

class TerrainChunk {

    constructor ( x, y, index ) {

        this.data = SimplexUtils.generateTexture( x, y, false )
        this.dividend = Settings.terrain.chunk.micro.dividend
        this.firstLoad = true
        this.index = index
        this.plots = []
        this.size = Settings.terrain.chunk.size
        this.x = x
        this.y = y

        this.group = {
            plots: new Xerxes.group(),
        }

        this.map = {
            biome: new TerrainChunkTileMap(),
            entities: new TerrainChunkTileMap(),
            height: new TerrainChunkTileMap(),
            structures: new TerrainChunkTileMap(),
            trees: new TerrainChunkTileMap( Settings.terrain.factor.tree ),
        }

        /**
         * The geometry needs to be created and converted to the
         * non-indexed form for several reasons. Those include proper
         * flat-coloring and shading, proper vertex manipulation, and
         * much more.
         */

        this.geometry = new Xerxes.geometry.plane( 
            ( this.size / this.dividend ) * Settings.terrain.cell.size, // width
            ( this.size / this.dividend ) * Settings.terrain.cell.size, // height
            ( this.size / this.dividend ), ( this.size / this.dividend )  // tilesX, tilesY
        ),

        this.faces = []
        this.vertices = []

        this.calculateMicroGeometry()

        /**
         * The mesh will use the same material as all the other chunks. 
         * The material declared once and can also be accessed from the
         * parent "Terrain" class to make for better performance.
         */

        this.mesh = new Xerxes.mesh.default( this.geometry, TerrainMaterial ),
        this.mesh.rotateX( Math.PI / -2 )
        this.mesh.index = this.index
        this.mesh.isChunk = true

        Actors.scene.micro.add( this.group.plots )

        /**
         * Below are the animations that will be stored for certain
         * and specific events that occur with the chunk.
         */
        
         this.animations = {
            hover: {
                forward: new Xerxes.tween.action( ChunkSelectMaterial.color )
                    .to( { r: 0.2, g: 0.82, b: 0.73 }, 1000 )
                    .repeat( Infinity )
                    .easing( Xerxes.tween.easing.Quadratic.InOut )
                    .onUpdate( () => {

                        this.mesh.material.needsUpdate = true

                    } )
            },
        }

    }

    hideMicroMesh ( object3D ) {

        object3D.remove( this.mesh )

    }

    showMicroMesh ( object3D ) {

        object3D.add( this.mesh )

    }

    /**
     * Since the colors of the terrain are vertex-based, in order to
     * keep the low-poly look, the geometry must be non-indexed. This
     * makes things more complicated geometry wise so we need to make
     * an array containing Faces and Vertices.
     */

    calculateMicroGeometry () {

        this.peaks = []

        for ( let i = 0; i < this.geometry.attributes.position.array.length; i++ ) {

            this.peaks[ i ] = {
                height: this.geometry.attributes.position.array[ i ]
            }

        }

        let faceCount = 0

        const OldVertices = this.geometry.attributes.position

        for ( let i = 0; i < OldVertices.array.length; i += 3 ) {

            this.vertices.push( new TerrainChunkVertex(
                OldVertices.array[ i ],
                OldVertices.array[ i + 1 ],
            ) )

        }

        // Change geometry to non-indexed geometry

        this.geometry = this.geometry.toNonIndexed()

        // Get indexes of newly calculated vertices

        const NewVertices = this.geometry.attributes.position

        for ( let i = 0; i < NewVertices.count; i++ ) {

            for ( let j = 0; j < this.vertices.length; j++ ) {

                if ( 
                    this.vertices[ j ].x == NewVertices.array[ i * 3 ] &&
                    this.vertices[ j ].y == NewVertices.array[ ( i * 3 ) + 1 ]
                ) {

                    this.vertices[ j ].addIndex( i )

                }

            }

            faceCount++

            if ( faceCount == 3 ) {

                this.faces.push( new TerrainChunkFace( i - 2, i - 1, i ) )

                faceCount = 0

            }

        }

    }

    setMaterial ( name ) {

        switch ( name ) {

            case 'default':

                this.mesh.material = TerrainMaterial

                break

            case 'hover':

                this.mesh.material = ChunkHoverMaterial

                break

            case 'select':

                this.mesh.material = ChunkSelectMaterial

                break

        }

    }

    colorMicroMesh () {

        const Vertices = this.geometry.attributes.position

        this.geometry.setAttribute( 'color', new Xerxes.buffer.attribute.default(
            new Float32Array( Vertices.array.length ), 3
        ) )

        for ( let i = 0; i < this.faces.length; i++ ) {

            let color = 0x172E05, face = this.faces[ i ]

            let difference = face.getMinMaxDifference( Vertices.array ),
                max = face.getMax( Vertices.array ),
                min = face.getMin( Vertices.array )

            if ( difference >= 0.05 && min >= 0.1 ) color = 0x140e07

            if ( min >= 0.3 ) color = 0xffffff

            // When everything is checked, set the color of the face

            face.setColor( 
                this.geometry.attributes.color,
                new Xerxes.color( color )
            )

        }

        this.geometry.attributes.color.needsUpdate = true

    }

    // generate

    applyNoise () {

        this.applyNoiseMicro()

    }

    applyNoiseMicro ( 
        peakMin = -9, peakMax = 6, peakFactor = 16, 
        noSides = false, update = true
    ) {

        /**
         * First the macro positions to be defined so that the micro map 
         * can be based on it. These seperate actions might change over 
         * the couse of development. 
         */

        let delay = 0

        const vertices = this.geometry.attributes.position

        let startX = 0, startY = 0

        let height = this.data.micro.height, 
            width = this.data.micro.width

        if ( noSides ) {

            startX = 1
            startY = 1
            height -= 1
            width -= 1

        }

        for ( let j = startY; j < height; j++ ) {

            for ( let i = startX; i < width; i++ ) {

                delay += 125

                const n = ( j * ( this.data.micro.height ) + i )

                const x = n * 3, y = ( n * 3 ) + 1, z = ( n * 3 ) + 2

                let vZ = SimplexUtils.map( 
                    this.data.micro.data[ n * 4 ], 0, 255, 
                    peakMin * Settings.terrain.cell.size / this.dividend, 
                    peakMax * Settings.terrain.cell.size / this.dividend
                )

                if ( vZ > ( 0.025 ) ) {

                    vZ *= ( ( vZ - 0.025 ) * peakFactor ) + 1

                }

                new Xerxes.tween.action( this.peaks[ z ] )
                    .to( { height: vZ }, 1000 )
                    .delay( delay / 1000 )
                    .onUpdate( () => {

                        this.vertices[ n ].setHeight(
                            this.geometry.attributes.position.array,
                            this.peaks[ z ].height
                        )

                        vertices.needsUpdate = true

                        if ( update ) {

                            this.colorMicroMesh()
            
                        }

                    } )
                    .easing( Xerxes.tween.easing.Elastic.Out )
                    .start()

            }
        }


        setTimeout( () => {

            this.updateBounds()
            
        }, ( delay / 1000 ) + 1000 )

    }

    /**
     * The boundaries of this object need to be handled and
     * taken care of at all times. This is for raycasting 
     * reasons. The bounds displayed are only for the specific
     * mesh or object provided.
     */

    updateBounds () {

        this.mesh.geometry.computeBoundingBox()

    }

    /**
     * This searches for the avaible and placable plots that
     * surround the chunk itself. They appear in one-by-one with
     * a delayed entrance.
     * 
     * @param { Array } coords The terrain chunk coords array.
     */

    getPlotNeighbors ( x, y ) {

        return {
            e: `${ x + 1 },${ y }`,
            n: `${ x },${ y - 1 }`,
            s: `${ x },${ y + 1 }`,
            w: `${ x - 1 },${ y }`,
        }

    }

    hidePlots () {

        let delay = 0

        Settings.terrain.chunk.plots.transitioning = true

        for ( let i = 0; i < this.group.plots.children.length; i++ ) {

            setTimeout( () => {

                this.plots[ i ].hide()

                setTimeout( () => {

                }, Settings.terrain.chunk.plots.animTime )

            }, delay )

            delay += 0

        }

        setTimeout( () => {

            this.plots = []

            this.group.plots.children = []

            Settings.terrain.chunk.plots.isViewing = false
            Settings.terrain.chunk.plots.transitioning = false

        }, delay + Settings.terrain.chunk.plots.animTime )

    }

    showPlots ( coords ) {

        let delay = 0

        const Neighbors = this.getPlotNeighbors( this.x, this.y )

        Settings.terrain.chunk.plots.transitioning = true

        for ( const n in Neighbors ) {

            if ( !coords.includes( Neighbors[ n ] ) ) {

                setTimeout( () => {

                    this.plots.push( new Plot( 
                        this.group.plots,
                        Number( Neighbors[ n ].split( ',' )[ 0 ] ),
                        Number( Neighbors[ n ].split( ',' )[ 1 ] )
                    ) )

                }, delay )

                delay += 0

            }

        }

        setTimeout( () => {

            Settings.terrain.chunk.plots.isViewing = true
            Settings.terrain.chunk.plots.transitioning = false

        }, delay + Settings.terrain.chunk.plots.animTime )

    }

    /**
     * These are the actions that happen when the micro chunk is 
     * hovered over. These need to be distinct in order for the
     * player to recognize they are being hovered.
     */

    onMicroEnter () {
        
        this.applyNoiseMicro( -12, 8, 16, true, false )
        
        if ( Settings.terrain.chunk.selected != this.index ) {

            this.setMaterial( 'hover' )

        }

    }

    onMicroLeave () {
        
        this.applyNoiseMicro( -9, 6, 16, true, false )
        
        if ( Settings.terrain.chunk.selected != this.index ) {

            this.setMaterial( 'default' )

        }

    }

    onMicroSelect () {

        this.setMaterial( 'select' )

    }

    onMicroDeselect () {

        this.setMaterial( 'default' )

    }

}

export default TerrainChunk