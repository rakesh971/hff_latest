import React, {useState, useEffect} from 'react'
import Element from '../Element/Element'
import Spinner from '../../../Common/Spinner/Spinner';
import styles from './WhyWeStarted.module.scss';

const AboutWhyWeStarted = ({Data}) => {

    const [SectionData, SetSectionData] = useState(null)
    
    useEffect(() => {
        SetSectionData(Data.child.filter(val => val.slug.includes('why-we-started'))[0]) 
    }, [Data])
    
    return (
        <div className={styles.dynamic_content}>
            {
                SectionData ?
                <>
                    {
                        SectionData.sections.map(item => {
                            return <Element data={item} key={item.id} />
                        })
                    }
                </> : <Spinner />
            }
        </div>
    )
}

export default AboutWhyWeStarted