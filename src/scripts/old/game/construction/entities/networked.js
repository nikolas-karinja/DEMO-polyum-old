import Xerxes from '../../../../../../engine/src/scripts/build.js'

class NetworkedEntity {

    constructor ( file, terrainPreset, showWireframe = true ) {

        // load the foundation file (*.nef)

        this.loadFoundation( file )

        // generate mesh

        this.geometry = new Xerxes.geometry.default()

        this.material = new Xerxes.material.mesh.phong( { 
            flatShading: true,
            shininess: 0,
            vertexColors: showWireframe,
            wireframe: true,
        } )

        this.mesh = new Xerxes.mesh.default( this.geometry, this.material )

        // generate map

        this.map = this.generateMap( terrainPreset )
        
    }

    generateMap ( terrainPreset ) {
        
        // get size of map

        const size = terrainPreset[ 1 ]

        // generate map

        const map = []

        for ( let r = 0; r < size; r++ ) {

            map.push( [] )
            
            /**
             * 0 - no node is there
             * 1 - a node is there
             */

            for ( let c = 0; c < size; c++ ) map[ r ][ c ] = 0

        }

        return map

    }

    //

    loadFoundation ( file ) {

        return new Promise( ( resolve ) => {

            fetch( file )
                .then( ( response ) => response.json() )
                .then( ( data ) => {

                    this.data = data

                    resolve()

                } )

        } )

    }

}

export default NetworkedEntity