import Xerxes from '../engine/build.js'

import Actors from '../actors.js'
import Settings from '../settings.js'

function render () {

    if ( 
        Settings.scene.viewing == 'micro' || 
        Settings.scene.viewing == 'macro' 
    ) {

        if ( Actors.terrain && Actors.terrain.water ) {

            Actors.renderer.scene.webgl.clear()
    
            Actors.renderer.scene.webgl.setRenderTarget( Actors.postprocessing.targets.color )
            Actors.renderer.scene.webgl.render( Actors.scene[ Settings.scene.viewing ], Actors.camera.scene )
    
            // render buffer scene for water depth texture
            Actors.scene[ Settings.scene.viewing ].overrideMaterial = Actors.terrain.water.depth
            
            Actors.renderer.scene.webgl.setRenderTarget( Actors.postprocessing.targets.depth )
            Actors.renderer.scene.webgl.clear()
            Actors.renderer.scene.webgl.render( Actors.scene[ Settings.scene.viewing ], Actors.camera.scene )
            
            Actors.scene[ Settings.scene.viewing ].overrideMaterial = null

            Actors.renderer.scene.webgl.setRenderTarget( null )
    
            // render buffer scene and then render water on top
            Actors.renderer.scene.webgl.render( Actors.scene[ Settings.scene.viewing ], Actors.camera.scene )
            Actors.renderer.scene.webgl.render( Actors.terrain.water.scene, Actors.camera.scene )
            Actors.renderer.scene.dom.render( Actors.scene[ Settings.scene.viewing ], Actors.camera.scene )

            Actors.terrain.water.update(
                Actors.postprocessing.targets.color.texture,
                Actors.postprocessing.targets.depth.texture
            )
    
        }

    } else {

        Actors.renderer.scene.webgl.clear()

        Actors.renderer.scene.webgl.render( Actors.scene[ Settings.scene.viewing ], Actors.camera.scene )

    }

    Actors.control.scene.update()

    Xerxes.tween.update()

}

function view ( name ) {

    Settings.scene.viewing = name

}

function getViewing () {

    return Settings.scene.viewing

}

export { getViewing, render, view }