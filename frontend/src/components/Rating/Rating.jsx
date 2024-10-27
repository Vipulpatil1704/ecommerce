import React from 'react'

export default function Rating({rating,numReviews}) {
    let fullStar=Math.floor(rating);
    let halfStar=rating-fullStar;
  return (
    <div className='rating'>
        {
            Array.from({length:fullStar}).map((_,index)=>{
                return <span key={index}>
                <i class="fa-solid fa-star"></i>
            </span>
            })
        }
        {
            halfStar ? <i class="fa-regular fa-star-half-stroke"></i>:null
        }
    </div>
  )
}
