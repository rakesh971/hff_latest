
import React,{ useEffect, useState } from 'react'
import useServer from '../../../Hooks/useServer'
import AboutLayout from '../../../Components/Website/About/AboutLayout/AboutLayout'
import Partner from '../../../Components/Website/About/Partner/Partner'

const partners = () => {
	
    const [Data, SetData] = useState(null)
    const [callApi,Loading,setLoading] =useServer()

	useEffect(() => {
        init ()
    }, [])
	
    const init =async ()=>{
        let response = await callApi('pages/about', {'with': ['child', 'sections'],}, false, 'get', true);
        if(response.error === 1) {
            SetData(response)
        }
    }
   
    return (
		<AboutLayout Data={Data}>
			<Partner Data={Data}/>
		</AboutLayout>
    )
}

export default partners