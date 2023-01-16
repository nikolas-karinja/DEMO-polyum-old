import Xerxes from '../../../../../../engine/src/scripts/build.js'
import Actors from '../../actors.js'

import { RoadData } from '../../transit/roads/data.js'

import * as ConstructionUtils from '../../utils/construction.js'

class RoadMesh extends Xerxes.mesh.default {

    constructor () {

        super ()

        this.geometry = new Xerxes.geometry.default()

        this.material = new Xerxes.material.mesh.phong( {
            flatShading: true,
            side: Xerxes.constant.side.double,
            vertexColors: true,
            // wireframe: true
        } )

        this.castShadow = true
        this.receiveShadow = true

    }

    place ( row, column ) {

        return new Promise( ( resolve ) => {

            const geometry = new Xerxes.geometry.default()

            ConstructionUtils.getTilePosition( row, column ).then( ( position ) => {

                RoadData.ew.getRoadOffsets( position.x, position.z ).then( ( data ) => {

                    RoadData.ew.getColors().then( ( colorData ) => {

                        const colors = new Float32Array( colorData )

                        const vertices = new Float32Array( data )

                        geometry.setAttribute( 'position', new Xerxes.buffer.attribute.default( vertices, 3 ) )
                        geometry.setAttribute( 'color', new Xerxes.buffer.attribute.default( colors, 3 ) )
                        geometry.attributes.position.needsUpdate = true

                    // add vertex data to buffer position array

                    if ( this.geometry.attributes.position ) {

                        const newColors = new Float32Array( [ ...this.geometry.attributes.color.array, ...colors ] )

                        const newGeo = new Float32Array( [ ...this.geometry.attributes.position.array, ...vertices ] )

                        this.geometry.setAttribute( 'position', new Xerxes.buffer.attribute.default( newGeo, 3 ) )
                        this.geometry.setAttribute( 'color', new Xerxes.buffer.attribute.default( newColors, 3 ) )

                    } else {

                        this.geometry.setAttribute( 'position', new Xerxes.buffer.attribute.default( vertices, 3 ) )
                        this.geometry.setAttribute( 'color', new Xerxes.buffer.attribute.default( colors, 3 ) )

                    }

                    // let the tile know it has road now

                    Actors.construction.grid.layout.tiles[ row - 1 ][ column - 1 ].hasRoad = true

                    // update the geometry and bounds

                    this.geometry.attributes.position.needsUpdate = true
                    this.geometry.computeBoundingSphere()

                    resolve()

                    } )

                } )

            } )

        } )

    }

}

export default RoadMesh