import React,{ useEffect, useState } from 'react'
import useServer from '../../../Hooks/useServer'
import AboutLayout from '../../../Components/Website/About/AboutLayout/AboutLayout'
import History from '../../../Components/Website/About/History/History'

const history = () => {

    const [callApi,loading,setLoading] =useServer()
    const [Data,SetData] = useState(null)

    useEffect(()=>{
        init()
    },[])

    const init =async () =>{
        let response = await callApi('pages/about', {'with': ['child', 'sections'],}, false, 'get', true);
        if(response.error == 1){
            SetData(response)
        }
    }

    return (
        <AboutLayout Data= {Data}>
            <History Data = {Data}/>
        </AboutLayout>
    )
}

export default history