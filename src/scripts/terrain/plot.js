import Xerxes from '../engine/build.js'

import Actors from '../actors.js'
import Settings from '../settings.js'

class Plot {

    constructor ( object3D, x, y ) {

        this.dividend = Settings.terrain.chunk.micro.dividend
        this.size = Settings.terrain.chunk.size
        this.x = x
        this.y = y

        this.geometry = new Xerxes.geometry.plane( 
            ( this.size / this.dividend ) * Settings.terrain.cell.size, // width
            ( this.size / this.dividend ) * Settings.terrain.cell.size, // height
            1, 1  // tilesX, tilesY
        )

        this.material = new Xerxes.material.mesh.basic( { 
            color: new Xerxes.color( 0.3, 0.3, 0.3 ),
            side: Xerxes.constant.side.double
        } )

        new Xerxes.loader.gltf().load( 'assets/models/plot.gltf', ( model ) => {

            this.mesh = new Xerxes.mesh.default( 
                model.scene.children[ 0 ].geometry, 
                this.material 
            )
            
            this.mesh.isPlot = true
            this.mesh.plotX = this.x
            this.mesh.plotY = this.y
            this.mesh.scale.set( 0, 0, 0 )

            this.mesh.position.set(
                ( x * ( this.size / this.dividend ) ) * Settings.terrain.cell.size,
                0.01,
                ( y * ( this.size / this.dividend ) ) * Settings.terrain.cell.size,
            )

            object3D.add( this.mesh )

            this.onLeave()

        } )

    }

    hide () {

        new Xerxes.tween.action( this.mesh.scale )
            .to( { x: 0, y: 0, z: 0 }, Settings.terrain.chunk.plots.animTime )
            .easing( Xerxes.tween.easing.Quadratic.In )
            .start()

        setTimeout( () => this.updateBounds(), Settings.terrain.chunk.plots.animTime )
        
    }

    onEnter () {

        new Xerxes.tween.action( this.mesh.scale )
            .to( { x: 0.5, y: 0.5, z: 0.5 }, Settings.terrain.chunk.plots.animTime )
            .easing( Xerxes.tween.easing.Elastic.Out )
            .start()
            
        new Xerxes.tween.action( this.material.color )
            .to( { r: 1.0, g: 1.0, b: 1.0 }, Settings.terrain.chunk.plots.animTime )
            .easing( Xerxes.tween.easing.Quadratic.Out )
            .start()

        setTimeout( () => this.updateBounds(), Settings.terrain.chunk.plots.animTime )

    }

    onLeave () {

        new Xerxes.tween.action( this.mesh.scale )
            .to( { x: 0.4, y: 0.4, z: 0.4 }, Settings.terrain.chunk.plots.animTime )
            .easing( Xerxes.tween.easing.Quadratic.Out )
            .start()

        new Xerxes.tween.action( this.material.color )
            .to( { r: 0.3, g: 0.3, b: 0.3 }, Settings.terrain.chunk.plots.animTime )
            .easing( Xerxes.tween.easing.Bounce.Out )
            .start()

        setTimeout( () => this.updateBounds(), Settings.terrain.chunk.plots.animTime )
        
    }

    /**
     * The boundaries of this object need to be handled and
     * taken care of at all times. This is for raycasting 
     * reasons. The bounds displayed are only for the specific
     * mesh or object provided.
     */

    updateBounds () {

        this.mesh.geometry.computeBoundingBox()

    }

}

export default Plot