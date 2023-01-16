import Xerxes from '../../../../engine/src/scripts/build.js'
import Actors from './actors.js'
import GameSettings from './settings.js'

import * as ArrayUtils from './utils/array.js'
import * as AudioUtils from './utils/audio.js'

function generateListeners () {

	window.onclick = ( e ) => {

		if ( e.target ) {

			if ( e.target.hasAttribute( 'click-close' ) ) AudioUtils.play( '../assets/audio/interface/click-close.mp3' )
			if ( e.target.hasAttribute( 'click-open' ) ) AudioUtils.play( '../assets/audio/interface/click-open.mp3' )
			if ( e.target.hasAttribute( 'click-normal' ) ) AudioUtils.play( '../assets/audio/interface/click-normal.mp3' )

		}
        
	}

	window.onkeydown = function ( e ) {

		// console.log( e.key )

		switch ( e.key ) {

		case 'Alt':

			if ( Actors.control.scene ) {

				Actors.control.scene.mouseButtons.RIGHT = Xerxes.constant.controls.mouse.rotate
        
			}

			break

		}

	}

	window.onkeyup = function ( e ) {

		switch ( e.key ) {

		case 'Alt':

			if ( Actors.control.scene ) {

				Actors.control.scene.mouseButtons.RIGHT = Xerxes.constant.controls.mouse.pan
        
			}

			break

		case 'Escape':

			if ( Actors.control.scene ) {

				if ( Actors.control.scene.isFollowingPerson ) Actors.control.scene.unfollowPerson()
        
			}

			break

		case 'F1':

			if ( Actors.control.scene ) {

				if ( Actors.pawns.people ) {

					Actors.control.scene.followPerson( ArrayUtils.getRandomIndex( Actors.pawns.people.array ) )

				}
        
			}

			break

		case '+': case '=':

			if ( Actors.control.scene ) {

				if ( Actors.pawns.people ) {

					if ( Actors.control.scene.isFollowingPerson ) {

						Actors.pawns.people.array[ Actors.control.scene.person ].increaseSpeed( 0.01 )

					}

				}
        
			}

			break
                
		case '-':

			if ( Actors.control.scene ) {

				if ( Actors.pawns.people ) {

					if ( Actors.control.scene.isFollowingPerson ) {

						Actors.pawns.people.array[ Actors.control.scene.person ].decreaseSpeed( 0.01 )

					}

				}
        
			}

			break

		}

	}

	//

	Actors.renderer.scene.domElement.onclick = ( e ) => {

		Actors.mouse.scene.onClick( e )

	}

	Actors.renderer.scene.domElement.onmousemove = ( e ) => {

		Actors.mouse.scene.onMove( e )
        
	}

	//

	for ( const s in GameSettings.speed.type ) {

		document.body.querySelector( `time-ui speed` ).innerHTML = `${ GameSettings.speed.current }x`

		if ( GameSettings.speed.current == GameSettings.speed.type[ s ] ) {

			const bounds = document.body.querySelector( `time-ui btn#${ s }` ).getBoundingClientRect()

			document.body.querySelector( `time-ui pin` ).style.marginBottom = `${ bounds.height - 8 }px`
			document.body.querySelector( `time-ui pin` ).style.marginLeft = `${ bounds.left + ( bounds.width - 8 ) - 12 }px`

		}

		document.body.querySelector( `time-ui btn#${ s }` ).onclick = function ( e ) {

			const bounds = document.body.querySelector( `time-ui btn#${ s }` ).getBoundingClientRect()

			GameSettings.speed.current = GameSettings.speed.type[ this.id ]

			document.body.querySelector( `time-ui pin` ).style.marginBottom = `${ bounds.height - 8 }px`
			document.body.querySelector( `time-ui pin` ).style.marginLeft = `${ bounds.left + ( bounds.width - 8 ) - 12 }px`

			if ( Actors.pawns.people ) {

				for ( let i = 0; i < Actors.pawns.people.array.length; i++ ) {

					Actors.pawns.people.array[ i ].resetSpeedAdd()
                
				}

			}

		}

		document.body.querySelector( `time-ui btn#${ s }` ).onmouseenter = function ( e ) {

			document.body.querySelector( `time-ui speed` ).style.color = `turquoise`

			document.body.querySelector( `time-ui speed` ).innerHTML = `${ GameSettings.speed.type[ this.id ] }x`

		}

		document.body.querySelector( `time-ui btn#${ s }` ).onmouseleave = function ( e ) {

			document.body.querySelector( `time-ui speed` ).style.color = `white`

			document.body.querySelector( `time-ui speed` ).innerHTML = `${ GameSettings.speed.current }x`

		}

	}

	// console

    

}

export { generateListeners }