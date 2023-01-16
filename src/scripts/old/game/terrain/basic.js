import Xerxes from '../../../../../engine/src/scripts/build.js'
import GameSettings from '../settings.js'

class BasicTerrain {

    constructor ( parameters = {} ) {
        
        this.diameter = parameters.diameter || this.getTerrainDiameter()
        this.offset = parameters.offset || GameSettings.terrain.offset

        this.selected = new Xerxes.vec3()

        // grid

        this.grid = this.generateGrid()
        this.grid.translateY( this.offset + GameSettings.terrain.grid.offset )

        // land

        const loader = new Xerxes.loader.texture.default()

        const texture = loader.load( '../assets/images/terrain/grass.jpg' )
        texture.wrapS = Xerxes.constant.wrapping.repeat.default
        texture.wrapT = Xerxes.constant.wrapping.repeat.default
        texture.repeat.set( 64, 64 )

        this.uniforms = {
            selection: { value: new Xerxes.vec3() }
        }

        this.geometry = new Xerxes.geometry.plane(
            this.diameter,
            this.diameter,
            this.diameter / GameSettings.terrain.tile.diameter,
            this.diameter / GameSettings.terrain.tile.diameter
        )

        // for ( let i = 0; i < this.geometry.attributes.position.count; i++ ) {

        //     this.geometry.attributes.position.setZ( i, (Math.random() * 2 - 1) * 0.75 )

        // }

        this.geometry.computeVertexNormals()

        this.land = new Xerxes.mesh.default(
            this.geometry,

            new Xerxes.material.mesh.phong( {
                color: 0x27400b,
                flatShading: true,
                shininess: 0,
                
                onBeforeCompile: ( shader ) => {

                    shader.uniforms.selection = this.uniforms.selection

                    shader.vertexShader = `
                        varying vec3 vPos;
                        ${shader.vertexShader}
                    `.replace(
                        `#include <begin_vertex>`,
                        `#include <begin_vertex>
                        vPos = transformed;
                        `
                    )

                    shader.fragmentShader = `
                        #define ss(a, b, c) smoothstep(a, b, c)
                        uniform vec3 selection;
                        varying vec3 vPos;
                        ${shader.fragmentShader}
                    `.replace(
                        `#include <dithering_fragment>`,
                        `#include <dithering_fragment>
      
                        // shape
                        float dist = distance( selection.xy, vPos.xy );
                        float r = 0.6;
        
                        float shape = ( ss( r, r, dist ) * 0.75 + 0.25 ) - ss( r + 0.2, r + 0.2, dist );
        
                        vec3 col = mix( gl_FragColor.rgb, vec3( 0.0, 1.0, 1.0 ), shape ); // vec3(0.188, 0.835, 0.784 ), vec3( 0.0, 1.0, 0.25 )
                        gl_FragColor = vec4(col, gl_FragColor.a);
                        `
                    )

                    //

                    this.mes

                }
            } )
        )
        
        this.land.translateY( this.offset )
        this.land.rotateX( Math.PI / -2 )
        this.land.receiveShadow = true

        // faces

        this.faces = []

        const faceCount = Math.pow( this.diameter / ( GameSettings.terrain.tile.diameter / 2 ), 2 ), 
            diameter = Math.sqrt( faceCount )

        for ( let y = 0; y < diameter / 2; y++ ) {

            for ( let x = 0; x < diameter / 2; x++ ) {

                this.faces.push( 
                    `${ y + 1 },${ x + 1 }`,
                    `${ y + 1 },${ x + 1 }`
                )

            }

        }

        console.log( this.faces )

        // mesh group

        this.group = new Xerxes.group()
        this.group.add( this.land )
        this.group.add( this.grid )

        if ( parameters.parent ) this.addTo( parameters.parent )

    }

    generateGrid () {

        const lod = new Xerxes.object.lod()

        const close = new Xerxes.helper.grid.default(
            this.diameter,
            this.getGridCellsWidth(),
            GameSettings.terrain.grid.color,
            GameSettings.terrain.grid.color
        )

        lod.addLevel( close, 0 )

        return lod

    }

    getTerrainDiameter () {

        return GameSettings.terrain.tile.diameter * GameSettings.terrain.size.steps[ GameSettings.terrain.size.default ][ 1 ]

    }

    getGridCellsWidth () {

        return this.diameter / GameSettings.terrain.tile.diameter

    }

    addTo ( object3D ) {

        object3D.add( this.group )

    }

    //

    update () {

        this.land.worldToLocal( this.uniforms.selection.value.copy( this.selected ) )

    }

}

export default BasicTerrain