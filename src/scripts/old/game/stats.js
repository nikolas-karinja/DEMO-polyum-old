class StatMinMax {

    constructor ( label ) {

        this.label = label
        this.min = Infinity
        this.max = 0

    }

}

class Stats {

    constructor () {

        this.beginTime = ( performance || Date ).now()
        this.frames = 0
        this.prevTime = this.beginTime

        this.fps = new StatMinMax( 'FPS' )
        this.lat = new StatMinMax( 'MS' )
        this.mem = new StatMinMax( 'MB' )

    }

    begin () {

        this.beginTime = ( performance || Date ).now()

    }

    end () {

        this.frames++

        let time = ( performance || Date ).now()

        this.updateLatency( time )

        if ( time >= this.prevTime + 1000 ) {

            this.updateFPS( time )

            this.prevTime = time
            this.frames = 0

            this.updateMemory()

        }

    }

    //

    updateFPS ( time ) {

        this.updateType( 'fps', ( this.frames * 1000 ) / ( time - this.prevTime ) )

    }

    updateLatency ( time ) {

        this.updateType( 'lat', time - this.beginTime )

    }

    updateMemory () {

        this.updateType( 'mem', performance.memory.usedJSHeapSize / 1048576 )

    }

    updateType ( id, value ) {

        this[ id ].max = Math.max( this[ id ].max, value )
        this[ id ].min = Math.min( this[ id ].min, value )

        document.body.querySelector( `dev-ui div#${ id }` ).innerHTML = `${ Math.round( value ) } ${ this[ id ].label } (${ Math.round( this[ id ].min ) }-${ Math.round( this[ id ].max ) })`

    }

}

const SystemStats = new Stats()

export default SystemStats