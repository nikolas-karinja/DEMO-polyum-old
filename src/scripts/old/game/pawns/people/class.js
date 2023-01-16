import Xerxes from '../../../../../../engine/src/scripts/build.js'
import Actors from '../../actors.js'
import GameSettings from '../../settings.js'
import PeopleMesh from './mesh.js'
import Person from './person.js'
import PersonLabel from './label.js'

import * as ArrayUtils from '../../utils/array.js'
import * as UIUtils from '../../utils/ui.js'

const dummy = new Xerxes.object3D

class People {

    constructor ( model ) {

        this.array = []
        this.indexesAvailable = []
        this.label = new PersonLabel()

        this.mesh = new PeopleMesh( 
            model.geometry.toNonIndexed(),
            model.material, // new Xerxes.material.mesh.phong( { color: 'white', flatShading: true } ),
            GameSettings.people.population.max
        )

        const colors = []

        this.model = {
            rotation: model.rotation,
            scale: model.scale,
        }

        for ( let i = 0; i < GameSettings.people.population.max; i++ ) {

            this.indexesAvailable.push( i )

            dummy.position.set( 0, GameSettings.terrain.offset - 4, 0 )
            dummy.rotation.copy( this.model.rotation )
            dummy.scale.copy( this.model.scale )
            dummy.updateMatrix()

            this.setMatrixAt( i, dummy.matrix )

            const color = new Xerxes.color(
                Math.random(),
                Math.random(),
                Math.random()
            )

            // this.setColorAt( i, color )

            // for ( let j = 0; j < this.mesh.geometry.attributes.position.count; j++ ) {

            //     colors.push( color.r, color.g, color.b )

            // }

            //

            Actors.scene.main.add( this.label )

        }

        this.mesh.updateInstanceMatrix()

        // this.mesh.instanceColor = new Xerxes.buffer.attribute.instanced( new Float32Array( [ ...colors ] ), 3 )
        // this.mesh.instanceColor.needsUpdate = true
        
    }
    
    // indexes

    addIndexesAvailable ( index ) {

        this.indexesAvailable.push( index )

    }

    removeIndexesAvailable ( index ) {

        ArrayUtils.removeItem( index, this.indexesAvailable )

    }

    // person

    addPerson () {

        const index = ArrayUtils.getRandom( this.indexesAvailable )

        this.removeIndexesAvailable( index )

        this.array.push( new Person( index, this.model, {
            testTravelingMode: true,
            travelSpeed: 0.025
        } ) )

        Actors.control.scene.followPerson( this.array.length - 1 )

        UIUtils.updatePopulation()

        Actors.ui.notif.push( `${ this.array[ this.array.length - 1 ].name } was born!` )

    }

    // mesh

    setColorAt ( index, color ) {

        this.mesh.setColorAt( index, color )

    }

    setMatrixAt ( index, matrix ) {

        this.mesh.setMatrixAt( index, matrix )

    }

    //

    update () {

        for ( let i = 0; i < this.array.length; i++ ) {

            this.array[ i ].update()

        }

        this.mesh.updateInstanceMatrix()

    }

}

export default People