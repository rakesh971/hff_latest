import React, {useState, useEffect} from 'react'
import AboutLayout from '../../../Components/Website/About/AboutLayout/AboutLayout'
import Members from '../../../Components/Website/About/Members/Members';
import useServer from '../../../Hooks/useServer'

const community = () => {

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
			<Members Data={Data}/>
		</AboutLayout>
    )
}

export default community