import UI from './class.js'

class NotifUI extends UI {

    constructor ( element, orientation ) {

        super ( element, orientation )

        this.odd = true

    }

    push ( message ) {

        this.element.innerHTML += `<notif ${ this.odd ? 'odd' : 'even' }><icon></icon><label>${ message }</label></notif>`

        if ( this.odd ) this.odd = false
        else this.odd = true

        if ( this.element.querySelectorAll( 'notif' ).length > 16 ) this.element.querySelectorAll( 'notif' )[ 0 ].remove()

        this.element.scrollTop = this.element.scrollHeight

    }

}

export default NotifUI