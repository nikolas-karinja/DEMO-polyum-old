import Xerxes from '../engine/build.js'

import Actors from '../actors.js'
import ItemsUI from '../ui/items.js'
import MacroUI from '../ui/macro.js'
import MicroUI from '../ui/micro.js'
import PostProcessing from '../scene/postprocessing/postprocessing.js'
import SceneCamera from '../scene/camera.js'
import SceneControl from '../scene/control.js'
import SceneDOMRenderer from '../scene/renderer/dom.js'
import SceneMouse from '../scene/mouse.js'
import SceneWebGLRenderer from '../scene/renderer/webgl.js'
import Settings from '../settings.js'
import Terrain from '../terrain/terrain.js'
import Tooltip from '../ui/tooltip.js'
import ToolUI from '../ui/tools.js'
import Vignette from '../ui/vignette.js'

import { SceneLights, SceneHemiLight, SceneSunLight } from '../scene/lights.js'

function setup () {

    Actors.clock = new Xerxes.clock()

    Actors.scene.main = new Xerxes.scene()
    Actors.scene.macro = new Xerxes.scene()
    Actors.scene.micro = new Xerxes.scene()

    for ( const s in Actors.scene ) {

        Actors.scene[ s ].background = new Xerxes.color( 0xff00ff )

        Actors.lights[ s ] = new SceneLights( 
            s,
            new SceneHemiLight( 0xffffff, 0xffffff, 1 ),
            new SceneSunLight( 0xffffff, 1 )
        )

    }

    Actors.camera.scene = new SceneCamera()

    Actors.renderer.scene = {
        dom: new SceneDOMRenderer(),
        webgl: new SceneWebGLRenderer( Settings.renderer.parameters ),
    }

    Actors.control.scene = new SceneControl( 
        Actors.camera.scene, 
        Actors.renderer.scene.webgl.domElement 
    )

    Actors.mouse.scene = new SceneMouse()

    //
    
    Actors.ui.items = new ItemsUI( document.body.querySelector( 'ui-macro tab' ) )
    Actors.ui.macro = new MacroUI( document.body.querySelector( 'ui-macro' ) )
    Actors.ui.micro = new MicroUI( document.body.querySelector( 'ui-micro' ) )
    Actors.ui.tools = new ToolUI( document.body.querySelector( 'ui-macro tools' ) )
    Actors.ui.tooltip = new Tooltip()
    Actors.ui.vignette = new Vignette( document.body.querySelector( 'vignette' ) )

    //

    Actors.postprocessing = new PostProcessing()

    //

    Actors.terrain = new Terrain()

}

export { setup }