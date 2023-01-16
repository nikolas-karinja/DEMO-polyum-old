import Settings from '../settings.js'
import SimplexNoise from '../libs/simplex.js'

let simplex = new SimplexNoise()

function generateTexture ( x, y, append ) {

    const chunkSize = Settings.terrain.chunk.size,
        spreadFactor = 2

    // Macro Canvas declaration with elements and actions

    const macroCanvas = document.createElement( 'canvas' )
    macroCanvas.id = 'debug'
    macroCanvas.width = Settings.terrain.chunk.size + 1
    macroCanvas.height = Settings.terrain.chunk.size + 1

    const macroContext = macroCanvas.getContext( '2d' )
    macroContext.fillStyle = 'black'
    macroContext.fillRect( 0, 0, macroCanvas.width, macroCanvas.height )

    for ( let i = 0; i < macroCanvas.width; i++ ) {

        for ( let j = 0; j < macroCanvas.height; j++ ) {

            let v =  octave( 
                ( i + ( x * ( chunkSize ) ) ) / ( macroCanvas.width * spreadFactor ), 
                ( j + ( y * ( chunkSize ) ) ) / ( macroCanvas.height * spreadFactor ), 
                16 
            )

            const per = ( 100 * v ).toFixed( 2 ) + '%'

            macroContext.fillStyle = `rgb(${ per },${ per },${ per })`
            macroContext.fillRect( i, j, 1, 1 )

        }

    }

    // Micro Canvas declaration with elements

    const microCanvas = document.createElement( 'canvas' )
    microCanvas.id = 'debug'
    microCanvas.width = ( chunkSize / Settings.terrain.chunk.micro.dividend ) + 1
    microCanvas.height = ( chunkSize / Settings.terrain.chunk.micro.dividend ) + 1

    const microContext = microCanvas.getContext( '2d' )
    microContext.fillStyle = 'black'
    microContext.fillRect( 0, 0, microCanvas.width, microCanvas.height )

    for ( let i = 0; i < microCanvas.width; i++ ) {

        for ( let j = 0; j < microCanvas.height; j++ ) {

            let v =  octave( 
                ( ( i * Settings.terrain.chunk.micro.dividend ) + ( x * ( chunkSize ) ) ) / ( macroCanvas.width * spreadFactor ), 
                ( ( j * Settings.terrain.chunk.micro.dividend ) + ( y * ( chunkSize ) ) ) / ( macroCanvas.height * spreadFactor ), 
                16 
            )

            const per = ( 100 * v ).toFixed( 2 ) + '%'

            microContext.fillStyle = `rgb(${ per },${ per },${ per })`
            microContext.fillRect( i, j, 1, 1 )

        }

    }

    // DOM interaction

    if ( append ) {

        document.body.appendChild( macroCanvas )
        document.body.appendChild( microCanvas )

    }

    return {
        macro: macroContext.getImageData( 0, 0, macroCanvas.width, macroCanvas.height ),
        micro: microContext.getImageData( 0, 0, microCanvas.width, microCanvas.height ),
    }

}

function map ( val, smin, smax, emin, emax ) {

    const t = ( val - smin ) / ( smax - smin )

    return ( emax - emin ) * t + emin

}

function noise ( nx, ny ) {
    
    // Re-map from -1.0:+1.0 to 0.0:1.0

    return map( simplex.noise2D( nx, ny ), -1, 1, 0, 1 )

}

// Stack some noise-fields together

function octave ( nx, ny, octaves ) {

    let val = 0,
        freq = 1,
        max = 0,
        amp = 1

    for ( let i = 0; i < octaves; i++ ) {

        val += noise( nx * freq, ny * freq ) * amp
        max += amp
        amp /= 2
        freq  *= 2
    }

    return val / max

}

function reseed ( seed ) {

    simplex = new SimplexNoise( seed )

}

export { generateTexture, map, noise, octave, reseed, simplex }