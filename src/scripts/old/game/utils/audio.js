function play ( file, volume = 1 ) {

    const audio = new Audio( file )
    audio.volume = volume
    audio.play()

}

export { play }