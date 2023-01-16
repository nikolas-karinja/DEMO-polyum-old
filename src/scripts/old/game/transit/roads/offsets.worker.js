onmessage = ( e ) => {

    const pavementOffset = e.data[ 1 ],
        sidewalkOffset = e.data[ 2 ],
        terrainOffset = e.data[ 0 ]

    const tileDiameter = e.data[ 3 ],
        tileX = e.data[ 4 ],
        tileZ = e.data[ 5 ]

    const vertices = e.data[ 6 ]

    const revisedVertices = []

    for ( let i = 0; i < vertices.length; i += 3 ) {

        let x = vertices[ i ],
            y = vertices[ i + 1 ],
            z = vertices[ i + 2 ]

        x += tileX
        y += terrainOffset
        z += tileZ

        revisedVertices.push( x, y, z )

    }

    postMessage( [ revisedVertices ] )

}