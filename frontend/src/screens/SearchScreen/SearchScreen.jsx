import React, { useEffect, useReducer, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';
import Rating from '../../components/Rating/Rating';
import Product from '../../components/Product/Product';
const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, products: action.payload.products, page: action.payload.page, pages: action.payload.pages, countProducts: action.payload.countProducts, loading: false };
        case 'FETCH_FAILED':
            return { ...state, loading: false, error: action.payload };
        default:
            return { ...state };
    }
}
export default function SearchScreen() {
    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const navigate=useNavigate();
    const category = sp.get('category') || 'all';
    const price = sp.get('price') || 'all';
    const rating = sp.get('rating') || 'all';
    const query = sp.get('query') || 'all';
    const order = sp.get('order') || 'newest';
    const page = sp.get('page') || 1;

    const [{ loading, error, products, pages, countProducts }, dispatch] = useReducer(reducer, { loading: true, error: '' })
    const [categories, setCategories] = useState([]);
    useEffect(()=>{
        
        const fetchData=async ()=>{
            try{
                const response=await fetch(`/api/products/search/?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`);
                const data=await response.json();
                dispatch({type:'FETCH_SUCCESS',payload:data});
            }
            catch(e){
                dispatch({type:'FETCH_FAILED',payload:e});
            }
        }
        fetchData();
    },[category,error,order,page,price,query,rating])
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`/api/products/categories`);
                const data = await response.json();
                setCategories(data);
            }
            catch (err) {
                throw new Error(err);
            }
        }
        fetchCategories();
    }, [])
    const getFilterUrl = (filter) => {
        const filterPage = filter.page || page;
        const filterCategory = filter.category || category;
        const filterPrice = filter.price || price;
        const filterRating = filter.rating || rating;
        const filterQuery = filter.query || query;
        const sortOrder = filter.order || order;
        return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`
    }
    const prices = [
        {
            name: '$1 to $50',
            value: '1-50',
        },
        {
            name: '$51 to $200',
            value: '51-200',
        },
        {
            name: '$201 to $1000',
            value: '201-1000'
        }
    ]
    const ratings = [
        {
            name: '4stars & up',
            rating: 4
        },
        {
            name: '3stars & up',
            rating: 3
        },
        {
            name: '2stars & up',
            rating: 2
        },
        {
            name: '1stars & up',
            rating: 1
        }
    ]
    return (
        <div className='search'>
            <div className='sort-types'>
                <h1>Departments</h1>
                <Link className={'all' === category ? 'text-bold' : ''} to={getFilterUrl({ category: 'all' })}>Any</Link>
                {/* categories */}
                {categories.map((c) => { return <li key={c}><Link className={c === category ? 'text-bold' : ''} to={getFilterUrl({ category: c })}>{c}</Link></li> })}
                <h1>Price</h1>
                <Link className={'all' === price ? 'text-bold' : ''} to={getFilterUrl({ price: 'all' })}>Any</Link>
                {prices.map((p) => {
                    return <li><Link to={getFilterUrl({ price: p.value })}>{p.name}</Link></li>
                })}
                <h1>Ratings</h1>
                {ratings.map((r) => {
                    return <li><Link to={getFilterUrl({ rating: r.rating })}><Rating rating={r.rating}></Rating></Link></li>
                })}
            </div>
            <div className='results'>
                <div>
                    {countProducts === 0 ? 'No' : countProducts} Results
                    {query !== 'all' && ' : ' + query}
                    {category !== 'all' && ' : ' + category}
                    {price !== 'all' && ' : Price' + price}
                    {rating !== 'all' && ' :Rating' + rating + ' &up'}
                    {query !== 'all' || category !== 'all' || rating !==
                        'all' || price !== 'all' ? <button variant="light" onClick={() => navigate('/search')}>
                        <i className='fas fa-times-circle'></i>
                    </button> : null}

                </div>
                <div>
                    {/* sort by  */}
                    sort by {' '}
                    <select value={order} onChange={(e) => { navigate(getFilterUrl({ order: e.target.value })) }}>
                        <option value="newest">Newest Arrivals</option>
                        <option value="lowest">Price: Low to High</option>
                        <option value="highest">Price: High to low</option>
                        <option value="toprated">Avg. Customer Reviews</option>
                    </select>
                </div>
                <div>
                    {products && products.length && products.map((p) => {
                        return <Product data={p}></Product>
                    })}
                </div>
                <div>
                    {[...Array(pages).keys()].map((x) => {
                        <Link className={Number(page) === x + 1 ? 'text-bold' : ''} to={getFilterUrl({ page: x + 1 })}>{x + 1}</Link>
                    })}
                </div>
            </div>
        </div>
    )
}
