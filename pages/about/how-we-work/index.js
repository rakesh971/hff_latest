import React,{useState,useEffect} from 'react'
import AboutLayout from '../../../Components/Website/About/AboutLayout/AboutLayout'
import HowWeWork from '../../../Components/Website/About/HowWeWork/HowWeWork'
import useServer from '../../../Hooks/useServer'

const howWeWork = () => {

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
    <AboutLayout Data ={Data}>
        <HowWeWork Data ={Data}/>
    </AboutLayout>
  )
}

export default howWeWork

