import Xerxes from '../engine/build.js'

import Actors from '../actors.js'
import EventData from '../data/events.js'
import ItemData from '../data/items.js'
import PriceData from '../data/prices.js'
import Settings from '../settings.js'

import * as ArrayUtils from './array.js'
import * as AudioUtils from './audio.js'
import * as CursorUtils from './cursor.js'
import * as MacroTerrainUtils from './terrain/macro.js'
import * as ResourceUtils from './resources.js'
import * as WindowUtils from './window.js'

let intersects = []

function generate () {

    window.onkeydown = ( e ) => {

        switch ( e.key ) {

            case 'q':

                Settings.controls.scene.rotate.left = true
                Settings.controls.scene.rotate.right = false

                break

            case 'e':

                Settings.controls.scene.rotate.left = false
                Settings.controls.scene.rotate.right = true

                break

            // Panning controls

            case 'w':

                Settings.controls.scene.pan.up = true

                break

            case 'a':

                Settings.controls.scene.pan.left = true

                break

            case 's':

                Settings.controls.scene.pan.down = true

                break
                
            case 'd':

                Settings.controls.scene.pan.right = true

                break

        }

    }

    window.onkeyup = ( e ) => {

        switch ( e.key ) {

            case 'q':

                Settings.controls.scene.rotate.left = false

                break

            case 'e':

                Settings.controls.scene.rotate.right = false

                break
                
            // Panning controls

            case 'w':

                Settings.controls.scene.pan.up = false

                break

            case 'a':

                Settings.controls.scene.pan.left = false

                break

            case 's':

                Settings.controls.scene.pan.down = false

                break
                
            case 'd':

                Settings.controls.scene.pan.right = false

                break
        }

    }

    Actors.renderer.scene.webgl.domElement.onclick = function () {

        Actors.terrain.onClick()

        if ( Settings.scene.viewing == 'micro' ) {

            if ( intersects.length > 0 ) {
                
                if ( !Settings.terrain.chunk.plots.transitioning ) {

                    if ( Settings.terrain.chunk.plots.isViewing ) {

                        if ( intersects[ 0 ].object.isChunk &&
                            intersects[ 0 ].object.index != Settings.terrain.chunk.selected ) {

                            AudioUtils.play( '../assets/audio/chunk-select.mp3' )

                            Actors.terrain.chunks[ Settings.terrain.chunk.selected ]
                                .hidePlots()

                            Actors.terrain.chunks[ Settings.terrain.chunk.selected ]
                                .onMicroDeselect()
    
                            Settings.terrain.chunk.selected = intersects[ 0 ].object.index

                            Actors.terrain.chunks[ Settings.terrain.chunk.selected ]
                                .onMicroSelect()
        
                            Actors.terrain.chunks[ Settings.terrain.chunk.selected ]
                                .showPlots( Actors.terrain.chunkCoords )
        
                        }

                        if ( intersects[ 0 ].object.isPlot ) {

                            ResourceUtils.buy( PriceData[ 'chunk' ], () => {

                                if ( Actors.terrain.chunks.length == 1 ) {

                                    WindowUtils.createEventWindow( EventData[ 'first-new-chunk' ] )
    
                                }
    
                                Actors.terrain.createMicroChunk(
                                    intersects[ 0 ].object.plotX,
                                    intersects[ 0 ].object.plotY,
                                    true
                                )
    
                                AudioUtils.play( '../assets/audio/chunk-create.mp3' )
    
                                Actors.terrain.chunks[ Settings.terrain.chunk.selected ]
                                    .hidePlots()
    
                                Actors.terrain.chunks[ Settings.terrain.chunk.selected ]
                                    .onMicroDeselect()
        
                                Settings.terrain.chunk.selected = Actors.terrain.chunks.length - 1
            
                                Actors.terrain.chunks[ Settings.terrain.chunk.selected ]
                                    .onMicroSelect()
    
                                Actors.terrain.chunks[ Settings.terrain.chunk.selected ]
                                    .onMicroEnter()
    
                                Actors.terrain.chunks[ Settings.terrain.chunk.selected ]
                                    .showPlots( Actors.terrain.chunkCoords )
    
                                Actors.ui.tooltip.setFromData( 'micro-terrain-chunk' )

                            } )

                        }
    
                    } else {
    
                        if ( intersects[ 0 ].object.isChunk &&
                            intersects[ 0 ].object.index != Settings.terrain.chunk.selected ) {
    
                            Settings.terrain.chunk.selected = intersects[ 0 ].object.index

                            Actors.terrain.chunks[ Settings.terrain.chunk.selected ]
                                .onMicroSelect()
        
                            Actors.terrain.chunks[ Settings.terrain.chunk.selected ]
                                .showPlots( Actors.terrain.chunkCoords )
        
                        }
    
                    }

                }

            } else {

                if ( Settings.terrain.chunk.plots.isViewing ) {

                    Actors.terrain.chunks[ Settings.terrain.chunk.selected ]
                        .hidePlots()

                    Actors.terrain.chunks[ Settings.terrain.chunk.selected ]
                        .onMicroDeselect()

                    Settings.terrain.chunk.selected = -1

                }

            }

        }

        if ( Settings.scene.viewing == 'macro' ) {

            intersects = Actors.mouse.scene.ray.point.intersectObjects(
                [ Actors.terrain.macro.children, Actors.terrain.macro.mesh ], true
            )

            if ( intersects.length > 0 ) {

                if ( intersects[ 0 ].object.isMacroTerrain ) {

                    if ( Settings.build.selected != null ) {
 
                        const tileCoords = Actors.terrain.macro.faces[ intersects[ 0 ].faceIndex ].tile

                        MacroTerrainUtils.buildOnTile( 
                            tileCoords[ 0 ] + 1,
                            tileCoords[ 1 ] + 1,
                            ArrayUtils.getRandom( Settings.build.selected ),
                            ItemData[ Settings.build.item.type ][ Settings.build.item.id ].price
                        )
 
                    }
 
                 }

            }

        }

    }

    Actors.renderer.scene.webgl.domElement.ondblclick = function () {

        Actors.terrain.onClick()

        if ( Settings.scene.viewing == 'micro' ) {

            if ( intersects.length > 0 ) {
                
                if ( !Settings.terrain.chunk.plots.transitioning ) {

                    if ( intersects[ 0 ].object.isChunk ) {

                        Actors.ui.micro.toMacro( intersects[ 0 ].object.index )

                    }

                }

            }

        }

    }

    Actors.renderer.scene.webgl.domElement.onpointermove = function ( e ) {

        Actors.mouse.scene.onMove( e )

        if ( Settings.scene.viewing == 'micro' ) {

            intersects = Actors.mouse.scene.ray.point.intersectObjects(
                Actors.scene.micro.children, true
            )

            if ( intersects.length > 0 ) {

                if ( intersects[ 0 ].object.isChunk ) {
    
                    Actors.ui.tooltip.show()
                    Actors.ui.tooltip.setFromData( 'micro-terrain-chunk' )
                        
                    if ( intersects[ 0 ].object.index != Settings.terrain.chunk.hovered ) {
    
                        // AudioUtils.play( '../assets/sounds/chunk-hover.mp3', 0.125 )
    
                        if ( Settings.terrain.chunk.hovered >= 0 ) {
    
                            Actors.terrain.chunks[ Settings.terrain.chunk.hovered ]
                            .onMicroLeave()
        
                        }
        
                        Settings.terrain.chunk.hovered = intersects[ 0 ].object.index
        
                        Actors.terrain.chunks[ Settings.terrain.chunk.hovered ]
                            .onMicroEnter()
        
                        CursorUtils.set( 'inspect' )
    
                    }
    
                }
    
                if ( intersects[ 0 ].object.isPlot ) {
    
                    Actors.ui.tooltip.show()
                    Actors.ui.tooltip.setFromData( 'micro-terrain-plot' )
    
                    CursorUtils.set( 'chunk' )
    
                }
    
            } else {
    
                if ( Settings.terrain.chunk.hovered >= 0 ) {
    
                    if ( Settings.terrain.chunk.hovered != Settings.terrain.chunk.selected ) {
    
                        Actors.terrain.chunks[ Settings.terrain.chunk.hovered ]
                            .onMicroLeave()
    
                        Settings.terrain.chunk.hovered = -1
    
                    }
    
                }
    
                Actors.ui.tooltip.hide()
    
                CursorUtils.set( 'normal' )
    
            }
            
        } else if ( Settings.scene.viewing == 'macro' ) {

            intersects = Actors.mouse.scene.ray.point.intersectObjects(
                [ Actors.terrain.macro.children, Actors.terrain.macro.mesh ], true
            )

            if ( intersects.length > 0 ) {
                
                if ( 
                    intersects[ 0 ].object.isEntity || 
                    intersects[ 0 ].object.isEntityChild
                ) {

                    Actors.ui.tooltip.show()

                    Actors.ui.tooltip.setFromArray(
                        intersects[ 0 ].object.entityData.tooltipData
                    )

                    if ( intersects[ 0 ].object.entityData.maxTenders ) {

                        if ( Settings.entity.chunk.isHovering ) {    
                            
                            const Entity = Actors.terrain.chunks[ Actors.terrain.macro.chunkIndex ]
                                .map.entities.tiles[ Settings.entity.chunk.row - 1 ]
                                [ Settings.entity.chunk.column - 1 ]
                        
                            if ( Entity.hasComponent( 'Tenderable' ) ) {

                                Entity.components[ 'Tenderable' ].hide()

                            }
    
                            Settings.entity.chunk.isHovering = null
                            Settings.entity.chunk.column = null
                            Settings.entity.chunk.row = null
    
                        }

                        Settings.entity.chunk.isHovering = true
                        Settings.entity.chunk.column = intersects[ 0 ].object.entityData.column
                        Settings.entity.chunk.row = intersects[ 0 ].object.entityData.row

                        const Entity = Actors.terrain.chunks[ Actors.terrain.macro.chunkIndex ]
                            .map.entities.tiles[ Settings.entity.chunk.row - 1 ]
                            [ Settings.entity.chunk.column - 1 ]

                            if ( Entity.hasComponent( 'Tenderable' ) ) {

                                Entity.components[ 'Tenderable' ].show()

                            }

                    }

                } else {

                    if ( Settings.entity.chunk.isHovering ) {

                        const Entity = Actors.terrain.chunks[ Actors.terrain.macro.chunkIndex ]
                            .map.entities.tiles[ Settings.entity.chunk.row - 1 ]
                            [ Settings.entity.chunk.column - 1 ]
                        
                        if ( Entity.hasComponent( 'Tenderable' ) ) {

                            Entity.components[ 'Tenderable' ].hide()

                        }

                        Settings.entity.chunk.isHovering = null
                        Settings.entity.chunk.column = null
                        Settings.entity.chunk.row = null

                    }

                    Actors.ui.tooltip.hide()
    
                }

            } else {

                if ( Settings.entity.chunk.isHovering ) {

                    const Entity = Actors.terrain.chunks[ Actors.terrain.macro.chunkIndex ]
                        .map.entities.tiles[ Settings.entity.chunk.row - 1 ]
                        [ Settings.entity.chunk.column - 1 ]
                        
                    if ( Entity.hasComponent( 'Tenderable' ) ) {

                        Entity.components[ 'Tenderable' ].hide()

                    }

                    Settings.entity.chunk.isHovering = null
                    Settings.entity.chunk.column = null
                    Settings.entity.chunk.row = null

                }

                Actors.ui.tooltip.hide()

            }

        }

    }

    // Window

    window.onclick = function ( e ) {

        if ( e.target.tagName == 'CHOICE' ) {

            AudioUtils.play( '../assets/audio/interface/click-close.mp3' )

        }

    }

    window.onpointerdown = function ( e ) {

        if ( e.target.hasAttribute( 'window-dragger' ) ) {

            Settings.window.selected = e.target.getAttribute( 'parent' )

            Actors.window[ Settings.window.selected ]
                .position[ 2 ] = e.clientX
            
            Actors.window[ Settings.window.selected ]
                .position[ 3 ] = e.clientY

        }

    } 

    window.onpointerup = function ( e ) {

        Settings.window.selected = null

    } 

    window.onpointermove = function ( e ) { 

        e.preventDefault()

        Actors.ui.tooltip.onMove( e.clientX, e.clientY )

        if ( e.target.id != 'game-canvas' ) {

            Actors.ui.tooltip.hide()

        }

        if ( Settings.window.selected ) {

            const element = Actors.window[ Settings.window.selected ].element

            Actors.window[ Settings.window.selected ].position[ 0 ] 
                = Actors.window[ Settings.window.selected ].position[ 2 ]
                - e.clientX 

            Actors.window[ Settings.window.selected ].position[ 1 ] 
                = Actors.window[ Settings.window.selected ].position[ 3 ]
                - e.clientY

            Actors.window[ Settings.window.selected ].position[ 2 ] = e.clientX
            Actors.window[ Settings.window.selected ].position[ 3 ] = e.clientY

            element.style.left = `${ 
                element.offsetLeft 
                - Actors.window[ Settings.window.selected ].position[ 0 ] 
            }px`

            element.style.top = `${ 
                element.offsetTop
                - Actors.window[ Settings.window.selected ].position[ 1 ] 
            }px`

        }

    }

}

export { generate }