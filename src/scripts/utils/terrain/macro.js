import Xerxes from '../../engine/build.js'

import Actors from '../../actors.js'
import AnimatedEntity from '../../terrain/macro/animated.js'
import ECS from '../../ecs.js'
import Settings from '../../settings.js'
import Entity from '../../ecs/entity.js'

import * as ArrayUtils from '../array.js'
import * as AudioUtils from '../audio.js'
import * as EntityUtils from '../entities.js'
import * as ResourceUtils from '../resources.js'
import * as WindowUtils from '../window.js'

let randomRotations = [ 0, Math.PI / 2, Math.PI ]

function buildOnTile ( row, column, name, price, displayWarnings = true, placeValue = true ) {

    const Tile = Actors.terrain.macro.tiles[ row - 1 ][ column - 1 ]

    const EntityData = EntityUtils.getEntityData( name )
    EntityData.row = row
    EntityData.column = column

    //

    new Xerxes.loader.gltf().load( ArrayUtils.getRandom( EntityData.modelPaths ), ( model ) => {

        if ( Tile.isLand && !Tile.isCliff && !Tile.isOccupied ) {

            if ( price ) {

                ResourceUtils.buy( price, () => {
        
                    main( row, column, name, model )
        
                } )
        
            } else {
        
                main( row, column, name, model )
        
            }

        } else {

            if ( displayWarnings ) {

                if ( !Tile.isLand && Tile.isCoast ) {

                    WindowUtils.createWarningWindow( {
                        id: 'cant-build-on-coast',
                        message: `You can't build things on the coastline.`,
                        lines: 1,
                        parent: Actors.ui.macro.element,
                    } )
    
                }
    
                if ( !Tile.isLand && Tile.isUnderwater ) {
    
                    WindowUtils.createWarningWindow( {
                        id: 'cant-build-on-coast',
                        message: `You can't build things underwater.`,
                        lines: 1,
                        parent: Actors.ui.macro.element,
                    } )
    
                }

                if ( Tile.isCliff ) {
    
                    WindowUtils.createWarningWindow( {
                        id: 'cant-build-on-cliff',
                        message: `You can't build things on rock-faces.`,
                        lines: 1,
                        parent: Actors.ui.macro.element,
                    } )
    
                }

                if ( Tile.isOccupied ) {
    
                    WindowUtils.createWarningWindow( {
                        id: 'cant-build-on-occupied',
                        message: `You can't build things on an already 
                        occupied tile.`,
                        lines: 2,
                        parent: Actors.ui.macro.element,
                    } )
    
                }

            }

        }

    } )



    function main ( row, column, name, model ) {

        let isStructure = false

        if ( displayWarnings ) {

            AudioUtils.play( '../assets/audio/place-entity.mp3' )

        }

        Tile.isOccupied = true

        model.scene.scale.setScalar( EntityData.scale )
        model.scene.scale.setScalar( 0 )

        model.scene.position.set(
            Tile.avg.position.x, Tile.maxZ, -Tile.avg.position.y
        )

        switch ( EntityData.type ) {

            case 'crop':

                model.scene.rotateY( ArrayUtils.getRandom( randomRotations ) )

                isStructure = true

                Settings.crops++

                break

            case 'granary':

                model.scene.rotateY( ArrayUtils.getRandom( randomRotations ) )

                isStructure = true

                Settings.granaries++

                break

            case 'mill':

                model.scene.rotateY( ArrayUtils.getRandom( randomRotations ) )

                isStructure = true

                Settings.mills++

                break

            case 'tree':

                model.scene.rotateY( Xerxes.math.random( -Math.PI, Math.PI ) )
                model.scene.rotateX( Xerxes.math.random( -Math.PI / 32, Math.PI / 32 ) )
                model.scene.rotateZ( Xerxes.math.random( -Math.PI / 32, Math.PI / 32 ) )

                break

        }

        new Xerxes.tween.action( model.scene.scale )
            .to( { x: EntityData.scale, y: EntityData.scale, z: EntityData.scale }, 1000 )
            .easing( Xerxes.tween.easing.Elastic.Out )
            .start()

        if ( EntityData.requiresAnimation ) {

            Actors.terrain.macro.animatedEntities.push( new AnimatedEntity( model ) )

        }

        const maxHeights = []

        model.scene.entityData = EntityData
        
        if ( model.scene.children[ 0 ].isGroup ) {

            for ( let i = 0; i < model.scene.children[ 0 ].children.length; i++ ) {

                const child = model.scene.children[ 0 ].children[ i ]

                child.material.side = Xerxes.constant.side.double
                child.material.needsUpdate = true

                child.isEntityChild = true
                child.entityData = EntityData
    
            }

            Actors.terrain.macro.children.add( model.scene )

        } else {

            for ( let i = 0; i < model.scene.children.length; i++ ) {

                const child = model.scene.children[ i ]

                child.material.side = Xerxes.constant.side.double
                child.material.needsUpdate = true

                child.isEntityChild = true
                child.entityData = EntityData

                const vec = new Xerxes.vec3()

                const box = new Xerxes.box3()
                    .setFromObject( child )
                    .getSize( vec )

                maxHeights.push( vec.y )
    
            }

            Actors.terrain.macro.children.add( model.scene )

        }

        if ( maxHeights.length > 0 ) {

            let maxHeight = Math.max( ...maxHeights )

            if ( isStructure ) {

                maxHeight -= 1

            }

            maxHeight *= Settings.terrain.cell.size

            EntityData.height = maxHeight

        }

        if ( 
            Actors.terrain.chunks[ Actors.terrain.macro.chunkIndex ].map
                .entities.tiles[ row - 1 ][ column - 1 ] == null 
        ) {

            const Entity = new ECS.Entity( EntityData )
            Entity.addComponent( new ECS.Components.Tile( row, column ) )
            
            if ( EntityData.maxTenders ) {

                Entity.addComponent( new ECS.Components.Tenderable( row, column, EntityData ) )

            }

            Actors.terrain.chunks[ Actors.terrain.macro.chunkIndex ].map
                .entities.tiles[ row - 1 ][ column - 1 ] = Entity

        }

        if ( placeValue ) {

            Actors.terrain.chunks[ Actors.terrain.macro.chunkIndex ].map
                .structures.placeValue( row, column, name )

        }

    }

}

function animateChildren ( delta ) {

    for ( let i = 0; i < Actors.terrain.macro.animatedEntities.length; i++ ) {

        Actors.terrain.macro.animatedEntities[ i ].mixer.update( delta )

    }

}

export { animateChildren, buildOnTile }