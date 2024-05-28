import React from 'react'

const TableImage = ({ image }) => {
    const showPlaceholder = (e) => {
        e.target.src = 'https://placehold.co/75x50'
    }
    return (<>
    <img onError={showPlaceholder} src={`${process.env.REACT_APP_IMAGE_URL}/${image}`} alt=""className='h-16 w-18 ml-8' ></img>
    </>)
}

export default TableImage
