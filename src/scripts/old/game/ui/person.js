import Xerxes from '../../../../../engine/src/scripts/build.js'
import UI from './class.js'
import Actors from '../actors.js'

const defaults = {
    attrLeft: '152px',
    attrWidth: 'calc( 100% - 164px )'
}

class PersonUI extends UI {

    constructor ( element, orientation ) {

        super( element, orientation )

        //
        
        Actors.scene.personView = new Xerxes.scene()

        //
        
        Actors.camera.personView = new Xerxes.camera.perspective( 45, 1, 0.001, 500 )
        Actors.camera.personView.position.set( 1, 0.75, 1 )
        Actors.camera.personView.lookAt( new Xerxes.vec3( 0, 0, 0 ) )

        //

        Actors.renderer.personView = new Xerxes.renderer.webgl( { alpha: true, antialias: true } )
        Actors.renderer.personView.setPixelRatio( window.devicePixelRatio )
        Actors.renderer.personView.setSize( 128, 128 )
        Actors.renderer.personView.outputEncoding = Xerxes.constant.encoding.srgb

        this.element.querySelector( 'view' ).appendChild( Actors.renderer.personView.domElement )

        //

        Actors.light.personView = new Xerxes.light.hemisphere( 0xffffff, 0xc2c2c2, 1 )

        Actors.scene.personView.add( Actors.light.personView )

        //

        this.loader = new Xerxes.loader.gltf()

        this.loader.load( '../assets/models/pawns/person.glb', ( model ) => {

            this.mesh = new Xerxes.mesh.default(
                model.scene.children[ 0 ].geometry,
                model.scene.children[ 0 ].material
            )

            this.mesh.translateY( -0.5 )
    
            Actors.scene.personView.add( this.mesh )

        } )

        //

        this.addAttribute( this.element, '../assets/images/interface/health-icon.png', 'Health', {
            barBackground: 'green',
            barForeground: 'rgb( 0, 209, 0 )',
            left: defaults.attrLeft,
            top: '44px',
            width: defaults.attrWidth
        } )

        this.addAttribute( this.element, '../assets/images/interface/hunger-icon.png', 'Hunger', {
            left: defaults.attrLeft,
            top: '76px',
            width: defaults.attrWidth
        } )

        this.addAttribute( this.element, '../assets/images/interface/close-icon.png', 'Happiness', {
            left: defaults.attrLeft,
            top: '108px',
            width: defaults.attrWidth
        } )

        this.addAttribute( this.element, '../assets/images/interface/boredom-icon.png', 'Boredom', {
            left: defaults.attrLeft,
            top: '140px',
            width: defaults.attrWidth
        } )

        this.addAttribute( this.element, '../assets/images/interface/hygiene-icon.png', 'Hygiene', {
            left: defaults.attrLeft,
            top: '172px',
            width: defaults.attrWidth
        } )

        this.addAttribute( this.element, '../assets/images/interface/tiredness-icon.png', 'Tiredness', {
            left: defaults.attrLeft,
            top: '204px',
            width: defaults.attrWidth
        } )

    }

    setName ( name ) {

        this.element.querySelector( 'name' ).innerHTML = name

    }

    //

    onClose () {
        
        this.hide()

        if ( Actors.control.scene ) {

            Actors.control.scene.unfollowPerson()

        }

    }
    
    //

    update () {

        Actors.renderer.personView.render( Actors.scene.personView, Actors.camera.personView )

        if ( this.mesh ) this.mesh.rotateY( 0.01 )

    }

    updateAttributes ( index ) {

        for ( const a in this.attributes ) {

            this.getAttribute( a ).setValue( ...Actors.pawns.people.array[ index ].getAttributeValues( a ) )

        }

    }

}

export default PersonUI