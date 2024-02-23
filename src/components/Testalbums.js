import phuket from '../images/test/phuket.jpg';
import rio from '../images/test/rio.jpg';
import italy from '../images/test/italy.jpg';
import germany from '../images/test/germany.jpg';
import qatar from '../images/test/qatar.jpg';
import chicago from '../images/test/chicago.jpg';
import prague from '../images/test/prague.jpg';
import cameroon from '../images/test/cameroon.jpg';


const albumsObj = [
{

    name: "Trips",
    location: "Around the world",
    tags: ["europe", "america", "germany", "summer"],
    ai: false,
    date: {from: "06/17/2021", to: "10/17/2021"},
    description: "Some photos from various trips",
    img: rio,


    photos: [
    {
        img: rio,
        name: "Rio Trip",
        location: "Rio, Brazil",
        date: "02/17/2021",
        description: "I went to Rio to see ADCC in person.",
        tags: [
            "South America",
            "Trip"
        ],
    },
    {
        img: cameroon,
        name: "Cameroon Trip",
        location: "Cameroon, Africa",
        date: "02/17/2021",
        description: "I went to Cameroon to see Ngannou fight for the title.",
        tags: [
            "Africa",
            "UFC"
        ],
    },
    {
        img: germany,
        name: "Germany Trip",
        location: "Germany",
        date: "02/17/2021",
        description: "I went to Germany because I want to see some places that appeared in Monster",
        tags: [
            "Monster",
            "Europe"
        ],
    },
    {
        img: italy,
        name: "Italy Trip",
        location: "Italy",
        date: "02/17/2021",
        description: "I went to Italy because I'm 1/4 Italian so I was interested",
        tags: [
            "Italy",
            "Europe"
        ],
    },
    {
        img: phuket,
        name: "Phuket Trip",
        location: "Phuket, Thailand",
        date: "02/17/2021",
        description: "I went to Phuket because I wanted to do Muay Thai",
        tags: [
            "Muay Thai",
            "Asia"
        ],
    },
    {
        img: prague,
        name: "Prague Trip",
        location: "Prague, Czech Republic",
        date: "02/17/2021",
        description: "I went to Prague because I want to see some places that appeared in Monster",
        tags: [
            "Monster",
            "Czech"
        ],
    },
    {
        img: qatar,
        name: "Qatar Trip",
        location: "Qatar, UAE",
        date: "02/17/2021",
        description: "I went to Qatar to see a boxing fight.",
        tags: [
            "Boxing",
            "Middle East"
        ],
    },
    {
        img: chicago,
        name: "Chicago Trip",
        location: "Chicago, USA",
        date: "02/17/2021",
        description: "I visited my uncle in chicago this past winter.",
        tags: [
            "Uncle",
            "City",
            "USA",
            "America",
            "Family",
            "Wind"
        ],
    }
    ]
}
]
export default albumsObj;