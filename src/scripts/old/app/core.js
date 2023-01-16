const { app, BrowserWindow, globalShortcut } = require( 'electron' )
const path = require( 'path' )

function App () {

	this.console = {
		open: false,
	}

	this.directory = {
		app: path.join( __dirname, '../../../' ),
		src: path.join( __dirname, '../../' ),
	}

	this.electron = {
		app: app,
		browser: BrowserWindow,
	}

	// undefined

	this.window = null

	this.createWindow = () => {

		this.window = new BrowserWindow( {
			width: 1280,
			height: 720,
			icon: path.join( this.directory.app, 'assets/images/marketing/logo-icon.64.png' ),

			options: {
				fullscreen: true,
			},
		} )
    
		// render the HTML

		this.window.loadFile( path.join( this.directory.src, 'index.html' ) )

		// set up window

		this.window.setMenu( null )
		this.window.setFullScreen( true )
		this.window.maximize()

	}

	this.generateKeybinds = () => {

		globalShortcut.register( 'F5', () => {

			this.window.reload()

		} )

		globalShortcut.register( 'F6', () => {

			if ( this.console.open ) {

				this.window.webContents.closeDevTools()

				this.console.open = false

			} else {
                
				this.window.webContents.openDevTools() 

				this.console.open = true

			}

		} )

	}

	this.ready = () => {

		this.createWindow()
		this.generateKeybinds()

	}

}

const Application = new App()

module.exports = { Application }