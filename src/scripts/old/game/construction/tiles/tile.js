class Tile {

    constructor ( x, y, z, row, column ) {

        this.x = x
        this.y = y
        this.z = z

        this.row = row
        this.column = column

        this.hasRoad = false
        this.hasNature = false

    }

    getCenter () {

        return { x: this.x, y: this.y, z: this.z }

    }

}

export default Tile