import EntityData from '../data/entities.js'

function getEntityData ( name ) {

    return Object.create( EntityData[ name ] )

}

export { getEntityData }

