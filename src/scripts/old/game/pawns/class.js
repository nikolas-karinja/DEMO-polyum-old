import Xerxes from '../../../../../engine/src/scripts/build.js'
import Actors from '../actors.js'
import GameSettings from '../settings.js'

class Pawn {

    constructor ( index, model, parameters = {} ) {
        
        this.index = index
        this.testTravelingMode = parameters.testTravelingMode || false

        this.dummy = new Xerxes.object3D()

        this.rotateDummy( model.rotation )
        this.scaleDummy( model.scale )
        this.updateDummyMatrix()

        this.raycaster = new Xerxes.raycaster()
        

        this.travel = {
            angle: 0,
            color: new Xerxes.color( Math.random(), Math.random(), Math.random() ),
            position: 0,
            queue: [],
            speed: parameters.travelSpeed || 0.05,
            up: new Xerxes.vec3( 0, 1, 0 ),
            visible: false,
        }

        const presetSize = 12 * GameSettings.terrain.tile.diameter

        this.spawn(
            Xerxes.math.random( presetSize / -2, presetSize / 2 ),
            Xerxes.math.random( presetSize / -2, presetSize / 2 )
        )

        if ( this.testTravelingMode ) {

            const boundsFromCenter = parameters.travelTestBounds || GameSettings.terrain.getPreset()[ 1 ]

            this.presetSize = boundsFromCenter * GameSettings.terrain.tile.diameter

            this.travelTo(
                [
                    Xerxes.math.random( this.presetSize / -2, this.presetSize / 2 ),
                    Xerxes.math.random( this.presetSize / -2, this.presetSize / 2 )
                ],
                [
                    Xerxes.math.random( this.presetSize / -2, this.presetSize / 2 ),
                    Xerxes.math.random( this.presetSize / -2, this.presetSize / 2 )
                ]
            )

        }

    }

    // dummy

    positionDummy ( x, z, offset = GameSettings.terrain.offset, update = false ) {

        this.dummy.position.set( x, offset, z )

        if ( update ) this.updateDummyMatrix()

    }

    rotateDummy ( x, y, z, update = false ) {

        if ( arguments.length == 1 ) this.dummy.rotation.copy( x )
        else this.dummy.rotation.set( x, y, z )

        if ( update ) this.updateDummyMatrix()

    } 

    scaleDummy ( x, y, z, update = false ) {

        if ( arguments.length == 1 ) this.dummy.scale.copy( x )
        else this.dummy.scale.set( x, y, z )

        if ( update ) this.updateDummyMatrix()

    }

    turnDummy ( rad, isAbs = false, update = false ) {

        if ( isAbs ) this.dummy.rotateY( rad )
        else this.dummy.rotation.y = rad

        if ( update ) this.updateDummyMatrix()

    } 

    updateDummyMatrix () {

        this.dummy.updateMatrix()

        Actors.pawns.people.setMatrixAt( this.index, this.dummy.matrix )

    }

    // traveling

    decreaseSpeed ( increment ) {

        this.travel.speed -= increment

        this.resetSpeedAdd()

    }

    increaseSpeed ( increment ) {

        this.travel.speed += increment

        this.resetSpeedAdd()

    }

    resetSpeedAdd () {

        this.travel.add = ( this.travel.speed / this.path.getLength() ) * GameSettings.speed.current

    }

    travelTo () {

        this.travel.queue.push( new Xerxes.vec2( this.dummy.position.x, this.dummy.position.z ) )

        for ( let i = 0; i < arguments.length; i++ ) {

            this.travel.queue.push( new Xerxes.vec2( arguments[ i ][ 0 ], arguments[ i ][ 1 ] ) )

        }

        this.drawPath()

    }

    stopTraveling () {

        this.travel.queue = []

        this.path.isReady = false

        this.travel.position = 0

    }

    // pathing

    drawPath () {

        this.path = new Xerxes.path( [ ...this.travel.queue ] )
        this.path.isReady = false

        //

        if ( this.travel.visible ) {

            const lineVertices = this.path.getPoints()

            for ( let i = 0; i < lineVertices.length; i++ ) {

                const point = lineVertices[ i ]

                lineVertices[ i ] = new Xerxes.vec3( point.x, 0.2, point.y )

            }

            const lineGeometry = new Xerxes.geometry.default().setFromPoints( lineVertices ),
                lineMaterial = new Xerxes.material.line.basic( { color: this.travel.color } )

            this.line = new Xerxes.object.line.default( lineGeometry, lineMaterial )

            Actors.scene.main.add( this.line )

        }

        //

        this.travel.previousAngle = this.getAngle( this.travel.position )

        // determine speed

        this.resetSpeedAdd()

        // ready path

        this.path.isReady = true

    }

    getAngle ( position ) {

        // get the 2Dtangent to the curve

        var tangent = this.path.getTangent( position ).normalize()

        // change tangent to 3D

        return Math.atan( tangent.x / tangent.y )

    }

    // spawning

    spawn ( x, z ) {

        this.positionDummy( x, z, GameSettings.terrain.offset, true )

    }

    despawn () {

        this.positionDummy( x, z, -4, true )

        delete this

    }

    //

    updateAnimations () { /* Aniomations go here */ }

    update () {

        // if ( this.followMouse ) this.dummy.lookAt( Actors.mouse.scene.target )

        // this.dummy.translateX( 0.05 )

        if ( this.travel.queue.length > 0 && this.path.isReady ) {

            this.travel.position += this.travel.add

            const point = this.path.getPointAt( this.travel.position )

            if ( point != null ) {

                // position person

                this.travel.previousPoint = {
                    x: this.dummy.position.x,
                    z: this.dummy.position.z,
                }

                this.dummy.position.x = point.x
                this.dummy.position.z = point.y

                // rotate person

                this.travel.angle = this.getAngle( this.travel.position )

                if ( point.y < this.travel.previousPoint.z ) this.travel.angle -= Math.PI

                this.dummy.quaternion.setFromAxisAngle( this.travel.up, this.travel.angle )

                // animate person

                this.updateAnimations()

            } else {

                this.stopTraveling()

                if ( this.testTravelingMode ) {

                    this.travelTo(
                        [
                            Xerxes.math.random( this.presetSize / -2, this.presetSize / 2 ),
                            Xerxes.math.random( this.presetSize / -2, this.presetSize / 2 )
                        ],
                        [
                            Xerxes.math.random( this.presetSize / -2, this.presetSize / 2 ),
                            Xerxes.math.random( this.presetSize / -2, this.presetSize / 2 )
                        ]
                    )

                }

            }

        }

        this.updateDummyMatrix()

    }

}

export default Pawn