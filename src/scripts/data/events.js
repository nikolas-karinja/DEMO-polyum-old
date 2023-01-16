const EventData = {

    'first-new-chunk': {
        artFile: 'first-new-chunk.png',
        contentData: `You have finally used one of your god-given powers. The power
        to create new landmasses called <imp>Terrain Chunks</imp>. When in the 
        <imp>Divine Void</imp>, these chunks represent a simplified view of your
        <imp>Realm</imp>'s Terrain. By clicking on one of these chunks, you have
        access to view that chunk in its maximized view. Chunks can contain things 
        such as <imp>Flora & Fauna</imp>, <imp>Structures</imp>, <imp>People</imp>,
        and so forth.`,
        describeChoices: true,
        headerData: 'Your First New Terrain Chunk!',
        id: 'first-new-chunk',
        parent: document.body.querySelector( 'ui-micro' ),
    },

    'time-to-mess-around': {
        artFile: 'time-to-mess-around.png',
        contentData: `Now that you are viewing the maximized view of the chunk
        you selected in the <imp>Divine Void</imp>, you can mess around with it.
        You do whatever you want with it, as long as you have enough
        <imp>🗲 Faith</imp>.`,
        describeChoices: true,
        headerData: 'Time to Mess Around!',
        id: 'time-to-mess-around',
        parent: document.body.querySelector( 'ui-macro' ),
    },

    'welcome': {
        contentData: `Welcome gods one and all! As most are aware, gods can control
        entire communities and populaces. You are one of many gods in
        this world but you have a special power. You can create and destroy 
        things at your will, rise an infinite amount of terrain from 
        the ashes of the <imp>Divine Void</imp>, and do many more things
        that sooth your lust for utter domination. You dont have to be a
        god of aggression if it is not what you desire. You may play and
        control your followers peacefully and be considered a pacifist. 
        Being a pacifist has many benefits to the role, but has some caviats.`,
        describeChoices: true,
        headerData: 'Welcome to Polyum!',
        id: 'welcome',
        parent: document.body.querySelector( 'ui-micro' ),
    },

}

export default EventData