
import bcrypt from 'bcryptjs'
const data={
    users:[
        {
            name:'vipul',
            username:'Vipul1704',
            password:bcrypt.hashSync('123'),
            isAdmin:true,
        },
        {
            name:'Ram',
            username:'Ram123',
            password:bcrypt.hashSync('123'),
            isAdmin:false,
        }
    ],
    products:[
        {
            // _id:'1',
            name:"Nike Slim shirt",
            slug:"nike-slim-shirt",
            category:"Shirts",
            image:"/images/p1.jpg", //679px x 829px
            price:120,
            countInStock:10,
            brand:"Nike",
            rating:4.5,
            numReview:10,
            description:'high quality product'
        },
        {
            // _id:'2',
            name:"Adidas Fit shirt",
            slug:"adidas-fit-shirt",
            category:"Shirts",
            image:"/images/p2.jpg",
            price:250,
            countInStock:0,
            brand:"Adidas",
            rating:4.0,
            numReview:10,
            description:'high quality product'
        },
        {
            // _id:'3',
            name:"Nike Slim pant",
            slug:"nike-slim-pant",
            category:"pants",
            image:"/images/p3.jpg",
            price:25,
            countInStock:15,
            brand:"Nike",
            rating:4.5,
            numReview:14,
            description:'high quality product'
        },
        {
           
            name:"Nike Slim pant-2",
            slug:"nike-slim-pant-2",
            category:"pants",
            image:"/images/p4.jpg",
            price:20,
            countInStock:25,
            brand:"Nike",
            rating:4.5,
            numReview:13    ,
            description:'high quality product'
        },
        
    ]
}
export default data;