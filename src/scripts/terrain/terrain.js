import Xerxes from '../engine/build.js'

import Settings from '../settings.js'
import TerrainChunk from './chunk.js'
import TerrainWater from './water.js'

import { ChunkHoverMaterial, TerrainMaterial } from './material.js'

import * as SimplexUtils from '../utils/simplex.js'
import Actors from '../actors.js'
import MacroTerrain from './macro.js'

class Terrain {

    constructor () {

        this.chunks = []
        this.chunkCoords = []
        this.group = new Xerxes.group()
        this.macro = new MacroTerrain()
        this.water = new TerrainWater()

        this.material = {
            default: TerrainMaterial,
            
            chunk: {
                hover: ChunkHoverMaterial,
            },
        }

        this.init()

    }

    createMicroChunk ( x, y, showMicro ) {

        this.chunks.push( new TerrainChunk( x, y, this.chunks.length ) )

        //

        this.chunks[ this.chunks.length - 1 ].mesh.position.set(
            ( x * ( Settings.terrain.chunk.size / Settings.terrain.chunk.micro.dividend ) ) * Settings.terrain.cell.size,
            0,
            ( y * ( Settings.terrain.chunk.size / Settings.terrain.chunk.micro.dividend ) ) * Settings.terrain.cell.size,
        )

        this.chunks[ this.chunks.length - 1 ].applyNoise()

        this.chunkCoords.push( `${ x },${ y }` )

        if ( showMicro ) {

            this.chunks[ this.chunks.length - 1 ].showMicroMesh( this.group )

        }

    }

    getChunk ( index ) {

        return this.chunks[ index ]

    }

    viewMacro ( chunkIndex ) {

        return new Promise( ( resolve ) => {

            this.macro.setFromChunk( chunkIndex ).then( () => {

                resolve()

            } )

        } )

    }

    //

    init () {

        Actors.scene.micro.add( this.group )

        this.createMicroChunk( 0, 0, true )

        // this.material.showWireframe()

    }

    onClick () {

        // SimplexUtils.reseed()

        // for ( let i = 0; i < this.chunks.length; i++ ) {
        
        //     this.getChunk( i ).applyNoise()

        // }

    }
    
}

export default Terrain