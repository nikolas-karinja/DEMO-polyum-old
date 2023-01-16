import Settings from '../../settings.js'

class TerrainChunkTileMap {

    constructor ( chance ) {

        this.tiles = []

        for ( let h = 0; h < Settings.terrain.chunk.size; h++ ) {

            this.tiles.push( [] )

            for ( let w = 0; w < Settings.terrain.chunk.size; w++ ) {

                if ( chance ) {

                    this.tiles[ h ][ w ] = Math.random() >= chance

                } else {

                    this.tiles[ h ][ w ] = null

                }
    
            }

        }

    }

    placeValue ( row, column, value ) {

        this.tiles[ row - 1 ][ column - 1 ] = value

    }

}

export default TerrainChunkTileMap