import React from 'react'
import EventsManage from '../../../../../Components/Admin/Events/EventsManage/EventsManage';
import { useRouter } from 'next/router';

const add = () => {

    const router = useRouter()
    
    return (
        <EventsManage
            {...{
                Type: router.query.type
            }}
        />
    )
}

export default add