import Xerxes from '../engine/build.js'

class SceneCamera extends Xerxes.camera.perspective {

    constructor () {

        super()

        this.far = 2000
        this.fov = 45
        this.near = 0.01

        this.position.set( 10, 10, 10 )

        this.resize()

    }

    resize () {

        this.aspect = window.innerWidth / window.innerHeight

        this.updateProjectionMatrix()

    }
    
}

export default SceneCamera