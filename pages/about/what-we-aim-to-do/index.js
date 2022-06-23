import React, {useState, useEffect} from 'react'
import useServer from '../../../Hooks/useServer'
import AboutLayout from '../../../Components/Website/About/AboutLayout/AboutLayout'
import WhatWeAimToDo from '../../../Components/Website/About/WhatWeAimToDo/WhatWeAimToDo'

const whatWeAimToDo = () => {

    const [callApi, Loading, setLoading ] = useServer()
    const [Data, SetData] = useState(null)

    useEffect(()=>{
        init()
    },[])

    const init = async ()=>{
        let response = await callApi('pages/about', {'with': ['child', 'sections'],}, false, 'get', true);
        if(response.error === 1){
            SetData(response)
        }
    }

  return (
    <AboutLayout Data={Data}>
        <WhatWeAimToDo Data= {Data}/>
    </AboutLayout>
  )
}

export default whatWeAimToDo