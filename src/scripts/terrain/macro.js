import Xerxes from '../engine/build.js'

import Actors from '../actors.js'
import MacroTerrainFace from './macro/face.js'
import MacroTerrainTile from './macro/tile.js'
import MacroTerrainTrees from './macro/trees.js'
import MacroTerrainVertex from './macro/vertex.js'
import Settings from '../settings.js'

import * as ArrayUtils from '../utils/array.js'
import * as SimplexUtils from '../utils/simplex.js'
import * as MacroTerrainUtils from '../utils/terrain/macro.js'

class MacroTerrain {

    constructor () {

        this.animatedEntities = []
        this.cellSize = Settings.terrain.cell.size
        this.children = new Xerxes.group()
        this.chunkIndex = 0
        this.cliffFactor = Settings.terrain.factor.cliff
        this.entities = []
        this.faces = []
        this.firstLoad = true
        this.noSides = false
        this.peakFactor = 8
        this.peakMin = -9
        this.peakMax = 6
        this.size = Settings.terrain.chunk.size
        this.tiles = []
        this.trees = new MacroTerrainTrees()
        this.timesViewed = 0
        this.updatePeakColors = true
        this.vertices = []

        /**
         * Setup geometry for the terrain itself. It needs to ber converted
         * from a regular indexed geometry to a non-indexed version to keep the 
         * faces from having blended colors.
         */

        this.geometry = new Xerxes.geometry.plane( 
            this.size * this.cellSize,
            this.size * this.cellSize,
            this.size, this.size
        )

        this.calculateGeometry()

        //

        this.material = new Xerxes.material.mesh.phong( {
            flatShading: true,
            shininess: 0,
            vertexColors: true,
            // wireframe: true,
        } )

        this.material.onBeforeCompile = function ( shader ) {
            shader.uniforms[ 'maxSandElevation' ] = { 
                value: 0.0025
            }

            shader.vertexShader = 'varying vec4 WorldPosition;\n' + shader.vertexShader

            shader.vertexShader = shader.vertexShader.replace( '#include <project_vertex>', `
                #include <project_vertex>
                WorldPosition = modelMatrix * vec4( position, 1.0 );
            ` )

            shader.fragmentShader = 'varying vec4 WorldPosition;\nuniform float maxSandElevation;\n' + shader.fragmentShader

            shader.fragmentShader = shader.fragmentShader.replace( '#include <dithering_fragment>', `
                #include <dithering_fragment>

                if ( 
                    WorldPosition.y < maxSandElevation &&
                    WorldPosition.y > -0.001
                ) {
                    gl_FragColor = vec4( 1.0, 0.93, 0.48, opacity );
                }

                if ( WorldPosition.y <= -0.001 ) {
                    gl_FragColor = vec4( 0.32, 0.47, 0.19, opacity );
                }
            ` )
        }

        //

        this.mesh = new Xerxes.mesh.default( this.geometry, this.material )
        this.mesh.rotateX( Math.PI / -2 )
        this.mesh.isMacroTerrain = true

        Actors.scene.macro.add( this.mesh )

        Actors.scene.macro.add( this.children )

    }

    scaleOut ( val, smin, smax, emin, emax ) {
        const tx = ( val - smin ) / ( smax - smin )
    
        return ( emax - emin ) * tx + emin
    }

    calculateGeometry () {

        let faceCount = 0, tileCount = 0

        /**
         * The peaks array needs to be set up so the animation of the 
         * terrain that uses TWEEN can be stored dynamically. It may 
         * be taken out due to the fact that it's not really visible
         * during the transition.
         */

        this.peaks = []

        for ( let i = 0; i < this.geometry.attributes.position.array.length; i++ ) {

            this.peaks[ i ] = {
                height: this.geometry.attributes.position.array[ i ]
            }

        }

        /**
         * Grab data from the indexed geometry's vertices so we can
         * create an array of organized Vertex classes to use. This
         * will make manipulating vertices so much simpler.
         */

        const OldVertices = this.geometry.attributes.position

        for ( let i = 0; i < OldVertices.array.length; i += 3 ) {

            this.vertices.push( new MacroTerrainVertex(
                OldVertices.array[ i ],
                OldVertices.array[ i + 1 ],
            ) )

        }

        // Change geometry to non-indexed geometry

        this.geometry = this.geometry.toNonIndexed()

        // Get indexes of newly calculated vertices

        const NewVertices = this.geometry.attributes.position

        let picked = []

        for ( let i = 0; i < NewVertices.count; i++ ) {

            for ( let j = 0; j < this.vertices.length; j++ ) {

                if ( 
                    this.vertices[ j ].x == NewVertices.array[ i * 3 ] &&
                    this.vertices[ j ].y == NewVertices.array[ ( i * 3 ) + 1 ]
                ) {

                    this.vertices[ j ].addIndex( i )

                    picked.push( j )

                }

            }

            faceCount++

            if ( faceCount == 3 ) {

                this.faces.push( new MacroTerrainFace( 
                    picked[ 0 ], picked[ 1 ], picked[ 2 ], i - 2, i - 1, i
                ) )

                picked = []

                faceCount = 0

            }

        }

        /**
         * Tiles need to be created for placing objects on them such as 
         * structures, flora & fauna, and so forth.
         */

        for ( let i = 0; i < this.faces.length; i += 2 ) {

            this.tiles.push( new MacroTerrainTile( 
                i / 2, i, i + 1,
                this.faces, this.vertices, 
                this.geometry.attributes.position.array
            ) )

        }

        // reorganize the tiles into a 2D array

        const tiles = []

        for ( let h = 0; h < this.size; h++ ) {

            tiles.push( [] )

            for ( let w = 0; w < this.size; w++ ) {

                const n = h * ( this.size ) + w

                tiles[ h ][ w ] = this.tiles[ n ]
                tiles[ h ][ w ].column = w + 1
                tiles[ h ][ w ].row = h + 1

                this.faces[ tiles[ h ][ w ].faces.a ].tile = [ h, w ]
                this.faces[ tiles[ h ][ w ].faces.b ].tile = [ h, w ]

            }

        }

        this.tiles = tiles

    }

    colorMicroMesh () {

        const Vertices = this.geometry.attributes.position

        this.geometry.setAttribute( 'color', new Xerxes.buffer.attribute.default(
            new Float32Array( Vertices.array.length ), 3
        ) )

        for ( let i = 0; i < this.faces.length; i++ ) {

            let color = new Xerxes.color( 0x172E05 ), face = this.faces[ i ]            

            let difference = face.getMinMaxDifference( Vertices.array ),
                max = face.getMax( Vertices.array ),
                min = face.getMin( Vertices.array )

                if ( min < 0.01 ) {
                    color = new Xerxes.color( 0x172e05 )
                        .clone()
                        .lerp( 
                            new Xerxes.color( 0x172e05 ), 
                            this.scaleOut( min, 0, 0.01, 0, 1 ) 
                        )
                } else if ( min < 1.0 ) {
                    color = new Xerxes.color( 0x172e05 )
                        .clone()
                        .lerp( 
                            new Xerxes.color( 0x727825 ), 
                            this.scaleOut( min, 0.01, 1.0, 0, 1 ) 
                        )
                }

            if ( difference >= this.cliffFactor ) color = new Xerxes.color( 0x140e07 )

            if ( min >= 3 ) color = new Xerxes.color( 0xffffff )

            // When everything is checked, set the color of the face

            face.setColor( this.geometry.attributes.color, color )

        }

        this.geometry.attributes.color.needsUpdate = true

    }

    resetChildren () {

        this.children.children = []

    }

    setFromChunk ( chunkIndex ) {

        this.chunkIndex = chunkIndex

        this.timesViewed++

        return new Promise( ( resolve ) => {

            const Chunk = Actors.terrain.chunks[ chunkIndex ]

            /**
            * First the macro positions to be defined so that the micro map 
            * can be based on it. These seperate actions might change over 
            * the couse of development. 
            */

            let delay = 0

            const vertices = this.geometry.attributes.position

            let startX = 0, startY = 0

            let height = Chunk.data.macro.height, 
                width = Chunk.data.macro.width

            if ( this.noSides ) {

                startX = 1
                startY = 1
                height -= 1
                width -= 1

            }

            for ( let j = startY; j < height; j++ ) {

                for ( let i = startX; i < width; i++ ) {

                    delay += 125

                    const n = ( j * ( Chunk.data.macro.height ) + i )

                    const x = n * 3, y = ( n * 3 ) + 1, z = ( n * 3 ) + 2

                    let vZ = SimplexUtils.map( 
                        Chunk.data.macro.data[ n * 4 ], 0, 255, 
                        this.peakMin * this.cellSize, 
                        this.peakMax * this.cellSize
                    )

                    if ( vZ > ( 0.25 ) ) {

                        vZ *= ( ( vZ - 0.25 ) * this.peakFactor ) + 1

                    }

                    if ( vZ >= -0.005 && vZ <= 0.005 ) {

                        vZ = 0.005

                    }

                    new Xerxes.tween.action( this.peaks[ z ] )
                        .to( { height: vZ }, 1000 )
                        .delay( delay / 1000 )
                        .onUpdate( () => {

                            this.vertices[ n ].setHeightFromArray(
                                this.geometry.attributes.position.array,
                                this.peaks[ z ].height
                            )

                            vertices.needsUpdate = true

                            if ( this.updatePeakColors ) {

                                this.colorMicroMesh()
            
                            }

                        } )
                        .easing( Xerxes.tween.easing.Elastic.Out )
                        .start()

                }
            }

            setTimeout( () => {

                this.resetChildren()

                this.updateTiles()
                this.updateTrees()
                this.updateObjects()

                Actors.control.scene.resetPosition()

                resolve()
            
            }, ( delay / 1000 ) + 1000 )

        } )

    }

    /**
     * Tiles need to be updated whenever the macro-chunk is renoised.
     * Without this the calculations for tile misplacement would be 
     * messed up.
     */

    updateTiles () {

        for ( let h = 0; h < this.size; h++ ) {

            for ( let w = 0; w < this.size; w++ ) {

                this.tiles[ h ][ w ].update()

            }

        }

    }

    updateTrees () {

        if ( Actors.terrain.chunks[ this.chunkIndex ].firstLoad ) {

            for ( let h = 0; h < this.size; h++ ) {

                for ( let w = 0; w < this.size; w++ ) {
    
                    if (
                        Actors.terrain.chunks[ this.chunkIndex ].map
                            .trees.tiles[ h ][ w ]
                    ) {
    
                        MacroTerrainUtils.buildOnTile(
                            this.tiles[ h ][ w ].row,
                            this.tiles[ h ][ w ].column,
                            
                            ArrayUtils.getRandom( [
                                'oak-tree'
                            ] ),
    
                            0, false
                        )
                        
                    }
    
                }
    
            } 
            
            Actors.terrain.chunks[ this.chunkIndex ].firstLoad = false

        }

    }

    updateObjects () {

        this.animatedEntities = []

        for ( let h = 0; h < this.size; h++ ) {

            for ( let w = 0; w < this.size; w++ ) {

                if ( 
                    Actors.terrain.chunks[ this.chunkIndex ].map
                        .structures.tiles[ h ][ w ] != null
                ) {

                    MacroTerrainUtils.buildOnTile(
                        this.tiles[ h ][ w ].row,
                        this.tiles[ h ][ w ].column,

                        Actors.terrain.chunks[ this.chunkIndex ].map
                            .structures.tiles[ h ][ w ],
                        
                        0, false, false
                    )

                }

            }

        } 

    }

}

export default MacroTerrain