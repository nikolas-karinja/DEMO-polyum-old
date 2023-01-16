import PriceData from './prices.js'

const TooltipData = {

    'micro-terrain-chunk': [

        `Terrain Chunk`, 
        `A simplified overview of the maximized chunk`, 
        `Each one of these can be selected and viewed. When viewed, 
        all the other chunks will disappear and the maximized view
        of the chunk will be displayed. When viewing the maximized
        chunk, you will be able to build on and interact with it.` 

    ],

    'micro-terrain-plot': [

        `Terrain Plot`, 
        `A place where a new chunk can be added`, 
        `If you have enough <faith r>🗲 Faith</faith>, you can select 
        this plot to generate a new chunk on. What you do with this 
        chunk after is up to you.`,
        `<faith r>🗲 ${ PriceData[ 'chunk' ] }</faith>`

    ],

}

export default TooltipData