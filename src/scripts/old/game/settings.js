import Xerxes from '../../../../../engine/src/scripts/build.js'

class Settings {

    constructor () {

        this.app = {
            modded: false,
            name: 'Polyum',
            
            release: {
                stage: 'Pre-alpha',
                version: '1.0',
            },
        }

        this.controls = {
            scene: {
                damping: {
                    enabled: true,
                    factor: 0.05,
                },

                pan: {
                    speed: 1.5,
                },
            },
        }

        this.people = {
            population: {
                max: 200,  
            },
        }

        this.roads = {
            pavement: {
                color: 0x4d4119,
                offset: 0.25,
            },

            sidewalk: {
                color: 0x303030,
                offset: 0.5,
            },
        }

        this.speed = {
            current: 1,

            type: {
                pause: 0,
                normal: 1,
                fast: 5,
                super: 20,
                giga: 50,
            },
        }

        this.terrain = {
            offset: 0,

            grid: {
                color: 0x474747,
                offset: 0.15,
            },

            size: {
                default: 0,
                selected: 0,

                steps: [
                    [ 'Tiny', 100 ],
                    [ 'Small', 250 ],
                    [ 'Normal', 500 ]
                ],
            },

            tile: {
                diameter: 4,
            },

            getPreset: function () {

                return this.size.steps[ this.size.selected ]

            },
        }

    }

    getTitle () {

        const appName = this.app.modded ? `${ this.app.name }*` : this.app.name,
            engineName = Xerxes.constant.NAME.includes( 'Engine' ) ? Xerxes.constant.NAME.split( ' ' )[ 0 ] : Xerxes.constant.NAME

        return `${ appName } (${ this.app.release.stage } ${ this.app.release.version }) [${ engineName } r${ Xerxes.constant.REVISION }]`

    }

    updateTitle () {

        document.head.querySelector( 'title' ).innerText = this.getTitle()

    }

}

const GameSettings = new Settings()

export default GameSettings