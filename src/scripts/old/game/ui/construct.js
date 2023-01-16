import UI from './class.js'

class ConstructUI extends UI {

    constructor ( element, orientation ) {

        super( element, orientation )

    }

    onClose () {

        this.hide()

    }

}

export default ConstructUI