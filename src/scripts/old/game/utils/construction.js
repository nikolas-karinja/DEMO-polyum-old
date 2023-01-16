import Xerxes from '../../../../../engine/src/scripts/build.js'
import Actors from '../actors.js'
import GameSettings from '../settings.js'
import RoadMesh from '../transit/roads/mesh.js'
import TileGrid from '../construction/tiles/grid.js'

function buildTileGrid ( preset ) {

    return new Promise( ( resolve ) => {

        Actors.construction.grid = new TileGrid( preset )

        Actors.construction.grid.generatePositioning()
            .then( () => resolve() )

    } )

} 

function buildRoadMesh () {

    return new Promise( ( resolve ) => {

        Actors.road.mesh = new RoadMesh()

        Actors.scene.main.add( Actors.road.mesh )

        // Actors.road.mesh.place( 51, 49 )
        // Actors.road.mesh.place( 51, 50 )
        // Actors.road.mesh.place( 51, 51 )
        // Actors.road.mesh.place( 1, 4 )

        resolve()

    } )

}

function getTilePosition ( row = 1, column = 1 ) {

    return new Promise( ( resolve ) => {

        if ( Actors.construction.grid && Actors.construction.grid.isReady ) {

            const tile = Actors.construction.grid.layout.position[ row - 1 ][ column - 1 ]

            resolve( { x: tile.x, z: tile.z } )

        }

    } )

}

function placeHouse ( tileRow = 1, tileColumn = 1, facing = 'down' ) {

    return new Promise( ( resolve ) => {

        if ( Actors.construction.grid && Actors.construction.grid.isReady ) {

            const tile = Actors.construction.grid.layout.position[ tileRow - 1 ][ tileColumn - 1 ]

            const loader = new Xerxes.loader.gltf()

            loader.load( '../assets/models/buildings/test.glb', ( model ) => {

                model.scene.children.forEach( ( child ) => {

                    if ( child.isMesh ) {
        
                        child.castShadow = true
                        child.material.side = Xerxes.constant.side.double
                        child.material.needsUpdate = true

                        child.geometry = child.geometry.toNonIndexed()
                        
                    }
        
                } )

                switch ( facing ) {

                    case 'left':
                        facing = Math.PI / -2
                        break
    
                    case 'right':
                        facing = Math.PI / 2
                        break
    
                    case 'up':
                        facing = Math.PI
                        break
    
                    case 'down':
                        facing = Math.PI * 2
                        break
    
                }

                model.scene.position.set( tile.x, GameSettings.terrain.offset, tile.z )
                model.scene.rotateY( facing + Xerxes.math.random( Math.PI / 24 ) )

                Actors.scene.main.add( model.scene )

                resolve()

            } )

        }

    } )

}

function hideGrid () {

    Actors.terrain.grid.visible = false

}

function showGrid () {

    Actors.terrain.grid.visible = true

}

export { buildTileGrid, buildRoadMesh, getTilePosition, hideGrid, placeHouse, showGrid }