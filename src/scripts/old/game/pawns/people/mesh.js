import Xerxes from '../../../../../../engine/src/scripts/build.js'
import Actors from '../../actors.js'

class PeopleMesh extends Xerxes.mesh.instanced {

    constructor ( geometry, material, count ) {

        super( geometry, material, count )

        this.castShadow = true
        this.name = 'PeopleMesh'

    } 

    // update the mesh

    updateInstanceColor () {

        this.instanceColor.needsUpdate = true

    }

    updateInstanceMatrix () {

        this.instanceMatrix.needsUpdate = true

    }

}

export default PeopleMesh