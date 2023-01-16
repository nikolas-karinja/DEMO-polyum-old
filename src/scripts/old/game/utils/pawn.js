import Xerxes from '../../../../../engine/src/scripts/build.js'
import Actors from '../actors.js'
import GameSettings from '../settings.js'
import People from '../pawns/people/class.js'

import * as PersonData from '../data/person.js'

import * as ArrayUtils from '../utils/array.js'

function generatePersonName ( includeLast ) {

    const first = ArrayUtils.getRandom( PersonData.names.first ),
        last = includeLast ? ` ${ ArrayUtils.getRandom( PersonData.names.last ) }` : ''

    return first + last

}

function generatePerson ( parent1 = null, parent2 = null ) {

    return new Promise( ( resolve ) => {

        const worker = new Worker( '../scripts/game/pawns/traits.worker.js', { type: 'module' } )

        if ( parent1 != null && parent2 != null ) worker.postMessage( [ JSON.stringify( parent1 ), JSON.stringify( parent2 ) ] )
        else worker.postMessage( [] )

        worker.onmessage = ( e ) => {

            const person = new Person()
            person.traits = e.data[ 0 ]

            resolve( person )

        }

    } )

} 


function placePeople () {

    return new Promise( ( resolve ) => {

        const loader = new Xerxes.loader.gltf()

        loader.load( '../assets/models/pawns/person.glb', ( model ) => {

            model.scene.children[ 0 ].castShadow = true
            model.scene.children[ 0 ].material.side = Xerxes.constant.side.double
            model.scene.children[ 0 ].material.needsUpdate = true

            Actors.pawns.people = new People( model.scene.children[ 0 ] )

            for ( let i = 0; i < GameSettings.people.population.max / 2; i++ ) {

                Actors.pawns.people.addPerson()

            }

            Actors.scene.main.add( Actors.pawns.people.mesh )

            resolve()

        } )

    } )

}

function updatePeople () {

    if ( Actors.pawns.people && Actors.pawns.people.array.length > 0 ) {

        for ( let i = 0; i < Actors.pawns.people.array.length; i++ ) {

            Actors.pawns.people.array[ i ].dummy.lookAt( Actors.mouse.scene.target )
            Actors.pawns.people.array[ i ].dummy.updateMatrix()

            Actors.pawns.people.mesh.setMatrixAt( i, Actors.pawns.people.array[ i ].dummy.matrix )

        }

        Actors.pawns.people.mesh.instanceMatrix.needsUpdate = true

    }

}


function placePerson ( tileRow = 1, tileColumn = 1 ) {

    return new Promise( ( resolve ) => {

        if ( Actors.construction.grid && Actors.construction.grid.isReady ) {

            const tile = Actors.construction.grid.layout.position[ tileRow - 1 ][ tileColumn - 1 ]

            const loader = new Xerxes.loader.gltf()

            loader.load( '../assets/models/pawns/person.glb', ( model ) => {

                model.scene.children.forEach( ( child ) => {

                    if ( child.isMesh ) {
        
                        child.castShadow = true
                        child.material.side = Xerxes.constant.side.double
                        child.material.needsUpdate = true
                        
                    }
        
                } )

                model.scene.position.set( tile.x, GameSettings.terrain.offset, tile.z )
                // model.scene.rotateY( Xerxes.math.random( -3.14, 3.14 ) )

                Actors.pawns.group.add( model.scene )

                resolve()

            } )

        }

    } )

}

export { generatePersonName, generatePerson, placePeople, updatePeople }