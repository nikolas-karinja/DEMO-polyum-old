import Xerxes from './engine/build.js'

import Actors from './actors.js'
import ECS from './ecs.js'
import EventData from './data/events.js'

import * as ActorUtils from './utils/actors.js'
import * as CursorUtils from './utils/cursor.js'
import * as ListenerUtils from './utils/listeners.js'
import * as MacroTerrainUtils from './utils/terrain/macro.js'
import * as SceneUtils from './utils/scene.js'
import * as TickUtils from './utils/ticks.js'
import * as UIUtils from './utils/ui.js'
import * as WindowUtils from './utils/window.js'

class App {

    constructor () {

        this.actors = Actors
        this.clock = new Xerxes.clock()

        this.visualize = () => {

            SceneUtils.render()

            MacroTerrainUtils.animateChildren( this.clock.getDelta() )

            requestAnimationFrame( this.visualize )

        }

        this.init()

    }

    init () {

        ActorUtils.setup()
        
        ListenerUtils.generate()

        UIUtils.setup()

        CursorUtils.set( 'normal' )

        WindowUtils.createEventWindow( EventData[ 'welcome' ] )

        this.resize()
        this.visualize()

        TickUtils.setup()

        //

    }

    resize () {

        window.onresize = () => {

            Actors.renderer.scene.dom.resize()
            Actors.renderer.scene.webgl.resize()
            Actors.camera.scene.resize()
            
            if ( Actors.terrain ) {

                Actors.terrain.water.resize()

            }

        }

    }

}

window.app = new App()