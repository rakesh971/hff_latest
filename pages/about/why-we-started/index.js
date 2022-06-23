
import React, {useState, useEffect} from 'react'
import useServer from '../../../Hooks/useServer'
import AboutLayout from '../../../Components/Website/About/AboutLayout/AboutLayout'
import WhyWeStarted from '../../../Components/Website/About/WhyWeStarted/AboutWhyWeStarted'

const whyWeStarted = () => {
	
    const [Data, SetData] = useState(null)
    const  [callApi, Loading, setLoading ] = useServer()

	useEffect(() => {
        init ()
    }, [])
	
    const init = async () =>{
        let response = await callApi('pages/about', {'with': ['child', 'sections'],}, false, 'get', true);
        if(response.error === 1) {
            SetData(response)
        }
    }

    return (
		<AboutLayout Data={Data}>
			<WhyWeStarted Data={Data}/>
		</AboutLayout>
    )
}

export default whyWeStarted