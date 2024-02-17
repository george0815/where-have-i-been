import phuket from '../images/test/phuket.jpg';
import rio from '../images/test/rio.jpg';
import italy from '../images/test/italy.jpg';
import germany from '../images/test/germany.jpg';
import qatar from '../images/test/qatar.jpg';
import chicago from '../images/test/chicago.jpg';
import prague from '../images/test/prague.jpg';
import cameroon from '../images/test/cameroon.jpg';


const albumsObj =
[
    {
        img: rio,
        name: "Rio Trip",
        location: "Rio, Brazil",
        date: {from: "02/17/2021", to: "02/17/2021"},
        description: "I went to Rio to see ADCC in person.",
        tags: [
            "South America",
            "Trip"
        ],
        ai: false
    },
    {
        img: cameroon,
        name: "Cameroon Trip",
        location: "Cameroon, Africa",
        date: {from: "02/17/2021", to: "02/17/2021"},
        description: "I went to Cameroon to see Ngannou fight for the title.",
        tags: [
            "Africa",
            "UFC"
        ],
        ai: false
    },
    {
        img: germany,
        name: "Germany Trip",
        location: "Germany",
        date: {from: "02/17/2021", to: "02/17/2021"},
        description: "I went to Germany because I want to see some places that appeared in Monster",
        tags: [
            "Monster",
            "Europe"
        ],
        ai: false
    },
    {
        img: italy,
        name: "Italy Trip",
        location: "Italy",
        date: {from: "02/17/2021", to: "02/17/2021"},
        description: "I went to Italy because I'm 1/4 Italian so I was interested",
        tags: [
            "Italy",
            "Europe"
        ],
        ai: false
    },
    {
        img: phuket,
        name: "Phuket Trip",
        location: "Phuket, Thailand",
        date: {from: "02/17/2021", to: "02/17/2021"},
        description: "I went to Phuket because I wanted to do Muay Thai",
        tags: [
            "Muay Thai",
            "Asia"
        ],
        ai: false
    },
    {
        img: prague,
        name: "Prague Trip",
        location: "Prague, Czech Republic",
        date: {from: "02/17/2021", to: "02/17/2021"},
        description: "I went to Prague because I want to see some places that appeared in Monster",
        tags: [
            "Monster",
            "Czech"
        ],
        ai: false
    },
    {
        img: qatar,
        name: "Qatar Trip",
        location: "Qatar, UAE",
        date: {from: "02/17/2021", to: "02/17/2021"},
        description: "I went to Qatar to see a boxing fight.",
        tags: [
            "Boxing",
            "Middle East"
        ],
        ai: false
    },
    {
        img: chicago,
        name: "Chicago Trip",
        location: "Chicago, USA",
        date: {from: "02/17/2021", to: "02/17/2021"},
        description: "I visited my uncle in chicago this past winter.",
        tags: [
            "Uncle",
            "City",
            "USA",
            "America",
            "Family",
            "Wind"
        ],
        ai: false
    }
]

export default albumsObj;