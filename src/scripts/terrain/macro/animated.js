import Xerxes from '../../engine/build.js'

class AnimatedEntity {

    constructor ( model ) {

        this.mixer = new Xerxes.animation.mixer( model.scene )

        this.animations = {
            array: model.animations,
            nameToIndex: {},
        }

        for ( let i = 0; i < this.animations.array.length; i++ ) {

            this.animations.nameToIndex[ this.animations.array[ i ].name ] = i

        }

        this.playAnimation()

    }

    playAnimation ( name ) {

        if ( name ) {

            this.mixer.clipAction( 
                this.animations.array[ this.animations.nameToIndex[ name ] ] 
            ).play()

        } else {

            this.mixer.clipAction( this.animations.array[ 0 ] ).play()

        }

    }

}

export default AnimatedEntity