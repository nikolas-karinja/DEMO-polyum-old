import Xerxes from '../engine/build.js'

import Settings from '../settings.js'

const TerrainMaterial = new Xerxes.material.mesh.phong( {
    // color: new Xerxes.color( 0.09, 0.18, 0.02 ), // temporory
    flatShading: true,
    shininess: 0,
    vertexColors: true,
} )

TerrainMaterial.showWireframe = function () {

    this.wireframe = true
    this.needsUpdate = true

}

// TerrainMaterial.onBeforeCompile = function ( shader ) {
//     shader.uniforms[ 'maxSandElevation' ] = { 
//         value: ( Settings.terrain.cell.size / 20 ) / Settings.terrain.chunk.micro.dividend
//     }

//     shader.vertexShader = 'varying vec4 WorldPosition;\n' + shader.vertexShader

//     shader.vertexShader = shader.vertexShader.replace( '#include <project_vertex>', `
//         #include <project_vertex>
//         WorldPosition = modelMatrix * vec4( position, 1.0 );
//     ` )

//     shader.fragmentShader = 'varying vec4 WorldPosition;\nuniform float maxSandElevation;\n' + shader.fragmentShader

//     shader.fragmentShader = shader.fragmentShader.replace( '#include <dithering_fragment>', `
//     #include <dithering_fragment>

//         if ( WorldPosition.y <= maxSandElevation ) {
//             gl_FragColor = vec4( 1.0, 0.93, 0.48, opacity );
//         }
//     ` )
// }

/**
 * Here is the material that will appear when a chunk is highlighted.
 * When the cursor is over the chunk this material will change to this
 */

const ChunkHoverMaterial = new Xerxes.material.mesh.phong( {
    color: 0x62bfcc,
    flatShading: true,
    shininess: 0,
} )

const ChunkSelectMaterial = new Xerxes.material.mesh.phong( {
    color: new Xerxes.color( 0.2, 0.82, 0.73 ),
    flatShading: true,
    shininess: 0,
} )

export { ChunkHoverMaterial, ChunkSelectMaterial, TerrainMaterial }