import Xerxes from '../../engine/build.js'

import Actors from '../../actors.js'

import * as WindowUtils from '../../utils/window.js'

class TenderableComponent {

    constructor ( row, column, entityData ) {

        this._name = 'Tenderable'

        const Tile = Actors.terrain.macro.tiles[ row - 1 ][ column - 1 ]

        this.column = column
        this.currentTenders = 0
        this.height = entityData.height
        this.isTenderable = true
        this.maxTenders = entityData.maxTenders
        this.row = row

        const element = document.createElement( 'chunk-entity-label' )

        this.labelMesh = new Xerxes.object.css2d( element )

        this.labelMesh.position.set(
            Tile.avg.position.x,
            Tile.avg.position.z + this.height + 0.05,
            -Tile.avg.position.y,
        )

        Actors.terrain.macro.children.add( this.labelMesh )

        this.updateLabel()

    }

    hide () {

        this.labelMesh.element.style.opacity = '0%'

    }

    show () {

        this.labelMesh.element.style.opacity = '100%'

    }

    //

    addTender ( callback ) {

        if ( this.currentTenders < this.maxTenders ) {

            this.currentTenders++

            this.updateLabel()

            if ( callback ) {

                callback( this )

            }

        } else {

            WindowUtils.createWarningWindow( {
                id: 'already-max-tenders',
                message: `There is already the max amount of followers
                tending to this structure.`,
                lines: 2,
                parent: Actors.ui[ Settings.scene.viewing ].element,
            } )

        }

    }

    removeTender ( callback ) {

        if ( this.currentTenders > 0 ) {

            this.currentTenders--

            this.updateLabel()

            if ( callback ) {

                callback( this )

            }

        }

    }

    updateLabel () {

        this.labelMesh.element.innerHTML = `⚦ ${ this.currentTenders }`

    }

}

export default TenderableComponent