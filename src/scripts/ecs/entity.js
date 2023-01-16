import ECS from '../ecs.js'

class Entity {

    constructor ( data ) {

        this.id = this.generateId()
        this.name = data.name
        this.type = data.type

        ECS.Entity.prototype._count++

        this.components = {}

    }

    addComponent ( component ) {

        this.components[ component._name ] = component

    }

    hasComponent ( componentName ) {

        if ( this.components[ componentName ] ) {

            return true

        } else {

            return false

        }

    } 

    removeComponent ( componentName ) {

        delete this.components[ componentName ]

    }

    //

    generateId () {

        return ( +new Date() ).toString( 16 ) +
            ( Math.random() * 100000000 | 0 ).toString( 16 ) +
            ECS.Entity.prototype._count

    }

}

export default Entity