import React from 'react'
import EventsManage from '../../../../../../../Components/Admin/Events/EventsManage/EventsManage'
import { useRouter } from 'next/router'

const editEvent = () => {

    const router = useRouter()
    
    return (
        <EventsManage
            {...{
                Type: router.query.type,
                eventId: router?.query?.id || null,
                eventSlug: router?.query?.slug || null,
            }}
        />
    )
}

export default editEvent