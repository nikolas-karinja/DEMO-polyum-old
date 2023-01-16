import Xerxes from '../../engine/build.js'

import Actors from '../../actors.js'
import Settings from '../../settings.js'

class DepthOfField {

    constructor () {

        this.depthShader = Xerxes.shader.bokeh.depth

        this.materialDepth = new Xerxes.material.shader.default( {
            uniforms: this.depthShader.uniforms,
            vertexShader: this.depthShader.vertexShader,
            fragmentShader: this.depthShader.fragmentShader,
        } )

        this.materialDepth.uniforms[ 'mNear' ].value = Actors.camera.scene.near
        this.materialDepth.uniforms[ 'mFar' ].value = Actors.camera.scene.fragmentShader

        this.controller = {
            enabled: true,
			jsDepthCalculation: true,
			shaderFocus: false,

			fstop: 2.2,
			maxblur: 1.0,

			showFocus: false,
			focalDepth: 2.8,
			manualdof: false,
			vignetting: false,
			depthblur: false,

			threshold: 0.5,
			gain: 2.0,
			bias: 0.5,
			fringe: 0.7,

			focalLength: 35,
			noise: true,
			pentagon: false,

			dithering: 0.0001,
        }

        //

        this.scene = new Xerxes.scene()

        this.camera = new Xerxes.camera.orthographic(
            window.innerWidth / -2, window.innerWidth / 2,
            window.innerHeight / 2, window.innerHeight / -2,
        )

        this.camera.position.z = 100

        this.scene.add( this.camera )

        //

        this.rtTextureDepth = new Xerxes.webgl.render.target.default(
            window.innerWidth, window.innerHeight
        )

        // this.rtTextureDepth.texture.format = Xerxes.constant.format.rgba.default // rgb
        // this.rtTextureDepth.texture.minFilter = Xerxes.constant.filter.nearest
        // this.rtTextureDepth.texture.magFilter = Xerxes.constant.filter.nearest
        // this.rtTextureDepth.depthBuffer = true
        // this.rtTextureDepth.stencilBuffer = false

        this.rtTextureColor = new Xerxes.webgl.render.target.default(
            window.innerWidth, window.innerHeight
        )

        // this.rtTextureColor.texture.format = Xerxes.constant.format.rgb.default // rgb
        // this.rtTextureColor.texture.minFilter = Xerxes.constant.filter.nearest
        // this.rtTextureColor.texture.magFilter = Xerxes.constant.filter.nearest
        // this.rtTextureColor.depthBuffer = true
        // this.rtTextureColor.stencilBuffer = false

        //

        this.bokehShader = Xerxes.shader.bokeh.default

        this.bokehUniforms = Xerxes.util.uniforms.clone( this.bokehShader.uniforms )
        this.bokehUniforms[ 'tColor' ].value = this.rtTextureColor.texture
		this.bokehUniforms[ 'tDepth' ].value = this.rtTextureDepth.texture
		this.bokehUniforms[ 'textureWidth' ].value = window.innerWidth
		this.bokehUniforms[ 'textureHeight' ].value = window.innerHeight

        this.materialBokeh = new Xerxes.material.shader.default( {
            uniforms: this.bokehUniforms,
			vertexShader: this.bokehShader.vertexShader,
			fragmentShader: this.bokehShader.fragmentShader,

			defines: {
				RINGS: Settings.postprocessing.dof.rings,
				SAMPLES: Settings.postprocessing.dof.samples
			},
        } )

        this.quad = new Xerxes.mesh.default(
            new Xerxes.geometry.plane( window.innerWidth, window.innerHeight ),
            this.materialBokeh
        )

        this.quad.position.z = -500

        this.scene.add( this.quad )

    }

    shaderUpdate () {

        this.materialBokeh.defines.RINGS = Settings.postprocessing.dof.rings
        this.materialBokeh.defines.SAMPLES = Settings.postprocessing.dof.samples
        this.materialBokeh.needsUpdate = true

    }

}

export default DepthOfField

//