import Xerxes from '../engine/build.js'

function createColorTarget () {

    const target = new Xerxes.webgl.render.target.default(
        window.innerWidth, window.innerHeight
    )

    return target

}

function createDepthTarget () {

    const target = new Xerxes.webgl.render.target.default(
        window.innerWidth, window.innerHeight
    )

    return target

}

export { createColorTarget, createDepthTarget }