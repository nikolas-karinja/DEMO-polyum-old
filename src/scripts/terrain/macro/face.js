class MacroTerrainFace {

    constructor ( a, b, c, lA, lB, lC ) {

        this.array = [ a, b, c ]
        this.literals = [ lA, lB, lC ]

        this.a = a // 0
        this.b = b // 1
        this.c = c // 2
        this.lA = lA // 0
        this.lB = lB // 1
        this.lC = lC // 2

    }

    setA ( index ) {

        this.a = index

    }

    setB ( index ) {

        this.b = index

    }

    setC ( index ) {

        this.c = index

    }

    setLA ( index ) {

        this.lA = index

    }

    setLB ( index ) {

        this.lB = index

    }

    setLC ( index ) {

        this.lC = index

    }

    setColor ( colorAttribute, color ) {

        colorAttribute.setXYZ( this.lA, color.r, color.g, color.b )
        colorAttribute.setXYZ( this.lB, color.r, color.g, color.b )
        colorAttribute.setXYZ( this.lC, color.r, color.g, color.b )

    }

    getMinMaxDifference ( vertexArray ) {

        const values = [
            vertexArray[ ( this.lA * 3 ) + 2 ],
            vertexArray[ ( this.lB * 3 ) + 2 ],
            vertexArray[ ( this.lC * 3 ) + 2 ]
        ]

        const max = Math.max( ...values ),
            min = Math.min( ...values )
            
        return max - min

    }

    getMax ( vertexArray ) {

        const values = [
            vertexArray[ ( this.lA * 3 ) + 2 ],
            vertexArray[ ( this.lB * 3 ) + 2 ],
            vertexArray[ ( this.lC * 3 ) + 2 ]
        ]

        return Math.max( ...values )

    }

    getMin ( vertexArray ) {

        const values = [
            vertexArray[ ( this.lA * 3 ) + 2 ],
            vertexArray[ ( this.lB * 3 ) + 2 ],
            vertexArray[ ( this.lC * 3 ) + 2 ]
        ]

        return Math.min( ...values )

    }

}

export default MacroTerrainFace