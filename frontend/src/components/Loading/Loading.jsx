import React from 'react'
import { Audio } from 'react-loader-spinner'
export default function Loading() {
    return (
        <div>
            <Audio
                height="80"
                width="80"
                radius="9"
                color="green"
                ariaLabel="loading"
                wrapperStyle
                wrapperClass
            />
        </div>
    )
}
