const Cursors = {
    current: '',

    type: {
        chunk: 'assets/images/interface/pointers/pointer-chunk.png',
        inspect: 'assets/images/interface/pointers/pointer-inspect.png',
        look: 'assets/images/interface/pointers/pointer-look.png',
        normal: 'assets/images/interface/pointers/pointer-normal.png',
    },
}

function set ( name ) {

    if ( Cursors.current != name ) {

        document.body.style.cursor = `url( ${ Cursors.type[ name ] } ), auto`

        Cursors.current = name

    }

}

export { set }