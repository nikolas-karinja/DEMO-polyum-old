import Xerxes from '../../../../../engine/src/scripts/build.js'
import Actors from '../actors.js'
import BasicTerrain from '../terrain/basic.js'
import GameSettings from '../settings.js'

import * as ArrayUtils from './array.js'
import * as AudioUtils from './audio.js'

function build ( type = 'basic', parameters = {} ) {

    switch ( type ) {

        case 'basic':
            return new BasicTerrain( parameters )

    }

}

function placeTree ( tileRow = 1, tileColumn = 1 ) {

    return new Promise( ( resolve ) => {

        if ( Actors.construction.grid && Actors.construction.grid.isReady ) {

            const tile = Actors.construction.grid.layout.position[ tileRow - 1 ][ tileColumn - 1 ]

            const loader = new Xerxes.loader.gltf()

            loader.load( '../assets/models/nature/test.glb', ( model ) => {

                model.scene.children.forEach( ( child ) => {

                    if ( child.isMesh ) {
        
                        child.castShadow = true
                        child.material.side = Xerxes.constant.side.double
                        child.material.needsUpdate = true
                        
                    }
        
                } )

                const randomRot = [ Math.PI / -2, 0, Math.PI / 2, Math.PI ]

                model.scene.position.set( tile.x, GameSettings.terrain.offset, tile.z )
                model.scene.rotateY( ArrayUtils.getRandom( randomRot ) )
                model.scene.scale.set( 0, 0, 0 )

                Actors.scene.main.add( model.scene )

                const animate = new Xerxes.tween.action( model.scene.scale )
                    .to( { x: 1, y: 1, z: 1 }, 1000 )
                    .easing( Xerxes.tween.easing.Elastic.Out )
                    .start()

                AudioUtils.play( '../assets/audio/interface/place-flora.mp3' )

                resolve()

            } )

        }

    } )

}

export { build, placeTree }