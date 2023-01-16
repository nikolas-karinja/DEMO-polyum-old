import Actors from '../actors.js'
import ItemData from '../data/items.js'
import Settings from '../settings.js'
import UI from './ui.js'

import * as AudioUtils from '../utils/audio.js'

class Item {

    constructor ( x, y, data, id, type, index ) {

        this.isSelected = false

        this.entities = data.entities
        this.id = id
        this.index = index
        this.name = data.name
        this.photo = data.photo
        this.price = data.price
        this.type = type
        
        this.backgroundElement = document.createElement( 'background' )
        this.element = document.createElement( 'item' )
        this.nameElement = document.createElement( 'name' )
        this.photoElement = document.createElement( 'photo' )
        this.priceElement = document.createElement( 'price' )

        this.element.id = this.id
        this.element.style.marginLeft = `${ x }px`
        this.element.style.marginTop = `${ y }px`
        this.element.appendChild( this.backgroundElement )
        this.element.appendChild( this.nameElement )
        this.element.appendChild( this.photoElement )
        this.element.appendChild( this.priceElement )

        this.nameElement.innerHTML = this.name

        this.photoElement.style.backgroundImage
            = `url( assets/images/interface/items/${ this.photo } )`
            
        this.priceElement.innerHTML = `🗲 ${ this.price }`

        Actors.ui.items.element.appendChild( this.element )

        this.generateListeners()

    }

    generateListeners () {

        const _this = this

        this.element.onclick = function () {

            AudioUtils.play( 'assets/audio/interface/select-person.mp3' )

            if ( !_this.isSelected ) {

                _this.select()

            } else {

                _this.deselect()

            }

        }

    }

    //

    deselect () {

        Settings.build.item.id = null
        Settings.build.item.index = null
        Settings.build.item.type = null
        Settings.build.selected = null

        this.element.style.animation = 'none'

        this.isSelected = false

    }

    select () {

        if ( Settings.build.item.index != null ) {

            Actors.ui.items.itemsDisplayed[ Settings.build.item.index ].deselect()

        }

        Settings.build.item.id = this.id
        Settings.build.item.index = this.index
        Settings.build.item.type = this.type
        Settings.build.selected = this.entities

        this.element.style.animation = 'item-select 1s infinite'

        this.isSelected = true


    }

}

class ItemsUI extends UI {

    constructor ( element ) {

        super( element )

        this.isShowing = true
        this.itemsDisplayed = []
        this.itemsHigh = 4
        this.itemsWide = 4
        this.typeShowing = 'none'

        this.hide()

    }

    hide () {

        if ( this.isShowing ) {

            this.element.style.opacity = '0%'
            this.element.style.marginLeft = `-${ 
                ( 128 * this.itemsWide ) + ( 16 * ( this.itemsWide + 1 ) ) 
            }px`

            if ( this.typeShowing != 'none' ) {

                Actors.ui.tools.deselect( 
                    Actors.ui.tools.button[ this.typeShowing ]
                )

                this.typeShowing = 'none'

            }

            this.isShowing = false

            Settings.build.selected = null

        }

    }

    show () {

        if ( !this.isShowing ) {

            this.element.style.opacity = '100%'
            this.element.style.marginLeft = '0px'
    
            this.isShowing = true
            
        }

    }

    clearItems () {

        for ( let i = 0; i < this.itemsDisplayed.length; i++ ) {

            this.itemsDisplayed[ i ].element.remove()

        }

        this.itemsDisplayed = []

    }

    createItem ( x, y, data, id, type, index ) {

        this.itemsDisplayed.push( new Item( x, y, data, id, type, index ) )

    }

    displayItems ( itemType ) {

        Settings.build.selected = null
        
        if ( this.typeShowing != 'none' ) {

            Actors.ui.tools.deselect( 
                Actors.ui.tools.button[ this.typeShowing ]
            )

        }

        return new Promise( ( resolve ) => {

            let wide = 0, high = 0

            this.typeShowing = itemType

            this.clearItems()

            for ( let i = 0; i < Object.keys( ItemData[ itemType ] ).length; i++ ) {

                const x = ( 144 * wide ) + 16, y = ( 192 * high ) + 16

                const data = ItemData[ itemType ][ Object.keys( ItemData[ itemType ] )[ i ] ]

                this.createItem( 
                    x, y, data, 
                    Object.keys( ItemData[ itemType ] )[ i ],
                    itemType, i
                )

                wide++

                if ( wide == this.itemsWide ) {

                    wide = 0

                    high = 1

                }

            }

            resolve()

        } )

    }

}

export default ItemsUI