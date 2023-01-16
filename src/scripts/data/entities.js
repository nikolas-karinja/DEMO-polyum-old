const EntityData = {

    'crops': {
        name: `Crops`,
        scale: 0.1,
        type: `crop`,
        
        faithPerSecond: 0.25,
        faithTendingPerSecond: 1,
        maxTenders: 1,

        modelPaths: [

            `assets/models/buildings/crops-1.gltf`,
            `assets/models/buildings/crops-2.gltf`,
            `assets/models/buildings/crops-3.gltf`
            
        ],

        tooltipData: [

            `Crops`, 
            `Produces Faith (Can be tended)`, 
            `Every second, each crop produces <faith r>🗲 0.25</faith> which
            you can use for whatever you desire. If one of your followers
            tends to a crop, that crop produces an additional 
            <faith r>🗲 1</faith> per second.` 
    
        ]
    },

    'granary': {
        name: `Granary`,
        scale: 0.1,
        type: `granary`,

        faithMultPerSecond: 1.5,
        faithMultTendingPerSecond: 3,
        maxTenders: 2,

        modelPaths: [

            `assets/models/buildings/granary.gltf`

        ],

        tooltipData: [

            `Granary`, 
            `Aids in production of Faith`, 
            `` 
    
        ]
    },

    'mill': {
        name: `Mill`,
        requiresAnimation: true,
        scale: 0.1,
        type: `mill`,
        
        faithPerSecond: 2,
        faithTendingPerSecond: 6,
        maxTenders: 3,

        modelPaths: [

            `assets/models/buildings/mill.gltf`

        ],

        tooltipData: [

            `Mill`, 
            `Produces Faith (Can be tended)`, 
            `Every second, each mill produces <faith r>🗲 2</faith> which
            you can use for whatever you desire. If one of your followers
            tends to the mill, that mill produces an additional 
            <faith r>🗲 6</faith> per second, per follower.` 
    
        ]
    },

    'oak-tree': {
        name: `Oak Tree`,
        scale: 0.1,
        type: `tree`,

        modelPaths: [

            `assets/models/nature/trees/oak-darkgreen.gltf`,
            `assets/models/nature/trees/oak-green.gltf`,
            `assets/models/nature/trees/oak-lightgreen.gltf`

        ],

        tooltipData: [

            `Oak Tree`, 
            `A plant in nature`, 
            `I am certain as a god you know what a tree is... unless you are
            a complete imbecile of course.` 
    
        ]
    },

}

export default EntityData