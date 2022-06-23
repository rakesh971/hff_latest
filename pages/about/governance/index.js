import React, {useState, useEffect} from 'react'
import useServer from '../../../Hooks/useServer'
import AboutLayout from '../../../Components/Website/About/AboutLayout/AboutLayout'
import Governance from '../../../Components/Website/About/Governance/Governance'

const governance = () => {

    const [Data, SetData] = useState(null)
    const [callApi,Loading,setLoading] =useServer()

	useEffect(() => {
        init ()
    }, [])
	
    const init = async ()=>{
        let response = await callApi('pages/about', {'with': ['child', 'sections'],}, false, 'get', true);
        if(response.error === 1) {
            SetData(response)
        }
    }
    
    return (
		<AboutLayout Data={Data}>
			<Governance Data={Data}/>
		</AboutLayout>
    )
}

export default governance