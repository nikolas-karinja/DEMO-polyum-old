import Xerxes from '../../engine/build.js'

import * as RendererUtils from '../../utils/renderer.js'

class PostProcessing {

    constructor () {

        this.targets = {
            color: RendererUtils.createColorTarget(),
            depth: RendererUtils.createDepthTarget(),
        }

    }

}

export default PostProcessing