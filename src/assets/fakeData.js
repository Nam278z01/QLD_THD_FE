const defaultOption = 'lucy';
const options = [
    { value: 'jack', label: 'Jack' },
    { value: 'lucy', label: 'Lucy' },
    { value: 'Yiminghe', label: 'yiminghe' },
    { value: 'disabled', label: 'Disabled' },
]
const items = [
    {
        label: 'User Profile',
        key: '0',
    },
    {
        type: 'divider',
    },
    {
        label: 'Sign out',
        key: '3',
    },
];

const breadcrumbs = [
    {
        title: 'Home',
    },
    {
        title: 'Application Center',
        href: '',
    },
    {
        title: 'Application List',
        href: '',
    },
    {
        title: 'An Application',
    },
]

const tableData = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
    },
];

const topUser = [
    {
        id: '1',
        name: 'John Brown',
        tagName: 'John Brown',
        nickNames: ['nice', 'developer'],
        badge_names: "/public/badge/badge14.png,/public/badge/badge6.png,/public/badge/badge3.png",
        index: 1,
        point: 94,
        avatar: 'https://joesch.moe/api/v1/random?key=1',
        total_nickname: 10
    },
    {
        id: '2',
        name: 'John Brown',
        tagName: 'John Brown',
        nickNames: ['nice', 'developer'],
        badge_names: "/public/badge/badge14.png,/public/badge/badge6.png,/public/badge/badge3.png,/public/badge/badge6.png",
        index: 2,
        point: 94,
        avatar: 'https://joesch.moe/api/v1/random?key=2',
        total_nickname: 1
    },
    {
        id: '3',
        name: 'John Brown',
        tagName: 'John Brown',
        nickNames: ['nice', 'developer'],
        badge_names: "/public/badge/badge14.png,/public/badge/badge6.png,/public/badge/badge3.png,/public/badge/badge6.png,/public/badge/badge6.png",
        index: 3,
        point: 94,
        avatar: 'https://joesch.moe/api/v1/random?key=3',
        total_nickname: 5
    },
    {
        id: '4',
        name: 'John Brown',
        tagName: 'John Brown',
        nickNames: ['nice', 'developer'],
        badge_names: "/public/badge/badge14.png,/public/badge/badge6.png,/public/badge/badge3.png,/public/badge/badge6.png,/public/badge/badge6.png",
        index: 4,
        point: 94,
        avatar: 'https://joesch.moe/api/v1/random?key=4',
        total_nickname: null
    },
    {
        id: '5',
        name: 'John Brown',
        tagName: 'John Brown',
        nickNames: ['nice', 'developer'],
        badge_names: "/public/badge/badge14.png,/public/badge/badge6.png,/public/badge/badge3.png,/public/badge/badge6.png,/public/badge/badge6.png,/public/badge/badge6.png",
        index: 5,
        point: 94,
        avatar: 'https://joesch.moe/api/v1/random?key=5',
        total_nickname: 20
    }
];

const topEvent = [
    {
        id: '7',
        name: 'HoaTH2',
        point: -100,
        avatar: 'https://joesch.moe/api/v1/random?key=6',
        event: 'Top Plus',
        tooltip: 'Employee who got the most plus points'
    },
    {
        id: '8',
        name: 'HoaTH2',
        point: 150,
        avatar: 'https://joesch.moe/api/v1/random?key=7',
        event: 'Top Minus',
        tooltip: 'Employee who got the most minus points'
    },
    {
        id: '9',
        name: 'HoaTH2',
        point: 100,
        avatar: 'https://joesch.moe/api/v1/random?key=8',
        event: 'Rising Star',
        tooltip: 'Employee who climbed the most ranks'
    },
];

const shop = [
    {
        id: '1',
        desc: 'Bộ sưu tập Ô mai túi zip Happy Womens Day and Happy New Year. Congratulation !!!',
        name: 'HoaTH2',
        img: '/public/images/shop-2.png',
        point: 100,
    },
    {
        id: '2',
        name: 'AnhPN10',
        desc: 'Bộ sưu tập Ô mai túi zip Happy Womens Day',
        img: '/public/images/shop-2.png',
        point: 150,
    },
    {
        id: '3',
        name: 'ThaoNT62',
        desc: 'Bộ sưu tập Ô mai túi zip Happy Womens Day',
        img: '/public/images/shop-2.png',
        point: 150,
    },
    {
        id: '4',
        name: 'HaoNT1',
        desc: 'Bộ sưu tập Ô mai túi zip Happy Womens Day',
        img: '/public/images/shop-2.png',
        point: 150,
    },
    {
        id: '5',
        name: 'MinhCT23',
        desc: 'Bộ sưu tập Ô mai túi zip Happy Womens Day',
        img: '/public/images/shop-2.png',
        point: 150,
    },
];

const myShop = [
    {
        id: '1',
        desc: 'Bộ sưu tập Ô mai túi zip Happy Womens Day and Happy New Year. Congratulation !!!',
        name: 'HoaTH2',
        img: '/public/images/shop-2.png',
        point: 100,
        isSold: false
    },
    {
        id: '2',
        name: 'AnhPN10',
        desc: 'Bộ sưu tập Ô mai túi zip Happy Womens Day',
        img: '/public/images/shop-2.png',
        point: 150,
        isSold: false
    },
    {
        id: '3',
        name: 'ThaoNT62',
        desc: 'Bộ sưu tập Ô mai túi zip Happy Womens Day',
        img: '/public/images/shop-2.png',
        point: 150,
        isSold: true
    },
    {
        id: '4',
        name: 'HaoNT1',
        desc: 'Bộ sưu tập Ô mai túi zip Happy Womens Day',
        img: '/public/images/shop-2.png',
        point: 150,
        isSold: false
    },
    {
        id: '5',
        name: 'MinhCT23',
        desc: 'Bộ sưu tập Ô mai túi zip Happy Womens Day',
        img: '/public/images/shop-2.png',
        point: 150,
        isSold: false
    },
];

const productDetail = {
    id: '1',
    title: 'Bộ sưu tập Ômai túi Zip Happy Womens Day Happy Womens Day ',
    desc: `Ynigisk replaskap hest. Anar filovalens biol jäsm. Dens röstsamtal oaktat idat alltså fang. 
    Rärydade plutoid glaskulefolket.Tiheten fagt gågåning såväl som vaning eftersom mikrogt.Antevasaning gärebelt hyponiskade, epikrati. 
    Sement kontraskade bröllopskoordinator har fomo än monol.Rejasade nökägåre nyl.Anyv sakase kartad nende.`,
    name: 'HoaTH2',
    imgs: ['/public/images/shop-2.png', '/public/images/shop.png'],
    point: 100,
    puslishDate: '03/03/2023',
    quantity: 2
}

export { defaultOption, options, items, breadcrumbs, tableData, topUser, topEvent, shop, myShop, productDetail }