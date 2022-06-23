import React from 'react'

const InjectHTML = ({html}) => {
    return  <span
        style={{display: 'block'}} 
        dangerouslySetInnerHTML={{__html: html}}
    />
}

export default InjectHTML