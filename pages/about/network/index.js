import React, {useState, useEffect} from 'react'
import AboutLayout from '../../../Components/Website/About/AboutLayout/AboutLayout'
import OurNetwork from '../../../Components/Website/About/OurNetwork/OurNetwork'
import useServer from '../../../Hooks/useServer'

const network = () => {

    const [Data, SetData] = useState(null)
    const [callApi,Loading,setLoading] =useServer()

	useEffect(() => {
        init ()
    }, [])
	
    const init = async ()=>{
        let response = await callApi('pages/about', { 'with': ['child', 'sections'],}, false, 'get', true)
        if(response.error === 1) {
            SetData(response)
        }  
    }
   

    return (
		<AboutLayout Data={Data}>
			<OurNetwork Data={Data}/>
		</AboutLayout>
    )
}

export default network