function getRandom ( array ) {

    return array[ Math.floor( Math.random() * array.length ) ]

}

function getRandomIndex ( array ) {

    return Math.floor( Math.random() * array.length )

}

function removeItem ( value, array ) {

    const index = array.indexOf( value )

    array.splice( index, 1 )

}

export { getRandom, getRandomIndex, removeItem }