import Entity from './ecs/entity.js'
import TileComponent from './ecs/components/tile.js'
import TenderableComponent from './ecs/components/tenderable.js'

const ECS = {
    Entity: Entity,

    Components: {
        Tenderable: TenderableComponent,
        Tile: TileComponent,
    },
}

ECS.Entity.prototype._count = 0

export default ECS