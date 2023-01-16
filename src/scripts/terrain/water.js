import Xerxes from '../engine/build.js'

import Actors from '../actors.js'
import Settings from '../settings.js'

class TerrainWater {

    constructor () {

        this.size = 50

        this.scene = new Xerxes.scene()

        /**
         * The geometry needs to be created and converted to the
         * non-indexed form for several reasons. Those include proper
         * flat-coloring and shading, proper vertex manipulation, and
         * much more.
         */

        this.geometry = new Xerxes.geometry.plane( this.size, this.size, 1, 1 )

        this.material = new Xerxes.material.shader.default( {
            uniforms: {
                tDepth: { value: null },
                tEnv: { value: null },
                screenSize: new Xerxes.uniform( [
                    window.innerWidth * window.devicePixelRatio,
                    window.innerHeight * window.devicePixelRatio
                ] ),
                uTime: { value: 0.0 },
                cameraNear: { value: Actors.camera.scene.near },
                cameraFar: { value: Actors.camera.scene.far },
            },
            vertexShader: `
                varying vec4 WorldPosition;
                varying vec2 vUv;
                uniform float uTime;
        
                void main(void) {
                    vUv = uv;
                    vec3 pos = position;
        
                    pos.z += sin( uTime * 2.0 ) * 0.0003;

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    WorldPosition = modelMatrix * vec4(pos, 1.0);
            
                }
            `,
            fragmentShader: `
                #include <packing>
            
                varying vec4 WorldPosition;
                varying vec2 vUv;
            
                uniform vec2 screenSize;
                uniform sampler2D tDepth;
                uniform sampler2D tEnv;
                uniform float uTime;
                uniform float cameraNear;
                uniform float cameraFar;
            
                float linearizeDepth(float z) {
                    float viewZ = perspectiveDepthToViewZ( z, cameraNear, cameraFar );
                    // return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
                    return viewZ;
                }
            
            
                float getScreenDepth(vec2 uv) {
                    float depth = unpackRGBAToDepth(texture2D(tDepth, uv));
                    return linearizeDepth(depth);
                }
             
                float getLinearDepth(vec3 pos) {
                    float viewZ = (viewMatrix * vec4(pos, 1.0)).z;
                    return viewZ;
                }
            
                void main() {
                    vec2 uv = gl_FragCoord.xy;
            
                    float wave = sin(vUv.x * 50. + uTime * 2.) / 2. + 0.3;
                    uv -= (viewMatrix * vec4(0.0, 0.0, wave  * 10., 0.0)).xy;
              
                    float worldDepth = getLinearDepth(WorldPosition.xyz);
                    float screenDepth = getScreenDepth(gl_FragCoord.xy / screenSize);
                    float offsetScreenDepth = getScreenDepth(uv / screenSize);
            
                    float originalDiff = ( worldDepth - screenDepth );
                    float diff = ( worldDepth - offsetScreenDepth );

                    vec4 color = vec4(
                        0.18 - ( originalDiff * 10.0 ), 
                        0.83 - ( originalDiff * 3.5 ), 
                        0.74 + ( originalDiff * 10.0 ), 
                        0.5
                    );
            
                    if ( originalDiff < 0.002 ) {
                        color = vec4( 1. );
                    } else if ( originalDiff < 0.005 ) {
                        color = vec4( 0.7, 0.95, 1.0, 0.75 );
                    }

                    if ( originalDiff > 2.0 ) {
                        color = vec4( 0.17, 0.27, 0.37, 1.0 );
                    }
            
                    gl_FragColor = color;
                }
            `,

            transparent: true,
            depthWrite: false,
        } )

        this.depth = new Xerxes.material.mesh.depth()
        this.depth.depthPacking = Xerxes.constant.packing.depth.rgba
        this.depth.blending = Xerxes.constant.blending.none

        /**
         * The mesh will use the same material as all the other chunks. 
         * The material declared once and can also be accessed from the
         * parent "Terrain" class to make for better performance.
         */

        this.mesh = new Xerxes.mesh.default( this.geometry, this.material )
        this.mesh.rotateX( Math.PI / -2 )

        //

        this.scene.add( this.mesh )

    }

    resize () {

        this.material.uniforms.screenSize = new Xerxes.uniform( [
            window.innerWidth * window.devicePixelRatio,
            window.innerHeight * window.devicePixelRatio
        ] )

        this.material.needsUpdate = true

    }

    update ( colorTaget, depthTarget ) {

        this.material.uniforms.tDepth.value = depthTarget
        this.material.uniforms.tEnv.value = colorTaget
        this.material.uniforms.uTime.value += Actors.clock.getDelta()

        this.mesh.position.x = Actors.control.scene.target.x
        this.mesh.position.z = Actors.control.scene.target.z

    }

}

export default TerrainWater