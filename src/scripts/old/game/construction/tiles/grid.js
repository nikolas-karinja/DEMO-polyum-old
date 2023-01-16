class TileGrid {

    constructor ( preset ) {

        this.height = preset[ 1 ]
        this.width = preset[ 1 ]

        this.isReady = false

        this.layout = {
            position: [],
            tiles: [],
        }

    }

    generatePositioning () {

        return new Promise( ( resolve ) => {

            const worker = new Worker( './scripts/game/construction/tiles/positioning.worker.js', {
                type: 'module'
            } )
    
            worker.postMessage( [
                this.width,
                this.height
            ] )

            worker.onmessage = ( e ) => {

                this.layout.position = e.data[ 0 ]
                this.layout.tiles = e.data[ 1 ]

                this.isReady = true

                resolve()

            }

        } )

    }

}

export default TileGrid