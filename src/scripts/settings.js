const Settings = {
    crops: 0,
    granaries: 0,
    mills: 0,
    townCenters: 0,
    faith: 750,
    
    build: {
        selected: null,

        item: {
            id: null,
            index: null,
            type: null,
        },
    },

	controls: {
		scene: {
			damping: {
				enabled: true,
				factor: 0.05,
			},

			pan: {
                down: false,
                left: false,
                right: false,
                up: false,

				speed: 1.5,

                mult: {
                    current: 12,

                    default: 12,
                    shift: 24,
                },
			},

            rotate: {
                left: false,
                right: false,

                speed: 0.08,
            },
		},
	},

    entity: {
        chunk: {
            column: null,
            isHovering: false,
            row: null,
        },
    },

    peopleTending: {
        crops: 0,
        granaries: 0,
        mills: 0,
        townCenters: 0,
    },

    postprocessing: {
        enabled: true,

        dof: {
            enabled: true,

            rings: 3,
            samples: 4,
        },
    },

    renderer: {
        parameters: {
            antialias: true,
            depth: true,
            stencil: false,
        },
    },

    scene: {
        viewing: 'micro',
    },

    speed: {
        current: 1,
    },

    terrain: {
        cell: {
            size: 0.1,
        },

        chunk: {
            hovered: -1,
            selected: -1,
            size: 50,

            micro: {
                dividend: 5,
            },

            plots: {
                animTime: 200,
                isViewing: false,
                transitioning: false,
            },
        },

        factor: {
            cliff: 0.05,
            tree: 0.95,
        },
    },

    ticks: {
        base: 30,
        perSecond: 30,
    },

    window: {
        selected: false,
    }
}

export default Settings