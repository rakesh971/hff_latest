import React,{ useEffect, useState } from 'react'
import Element from '../Element/Element'
import Spinner from '../../../Common/Spinner/Spinner'
import styles from './History.module.scss'
import InjectHTML from '../../../Common/InjectHTML/InjectHTML'

const History = ({Data}) => {

    const [SectionData, SetSectionData] = useState(null)

    useEffect(() => {
        SetSectionData(Data.child.filter(val => val.slug.includes('history'))[0])
    }, [])

  return (
    <div className={styles.dynamic_content}>
        {
            SectionData ? 
            <>
                {
                    SectionData.sections.map(item =>{
                        return <Element data = {item} key = {item.id}/>
                    })
                }
                <div className={styles.history}>
                    {
                        SectionData.infocard.map((item,index) =>{
                            return <HistoryBox item={item} index={index} key={item.id}/>
                        })
                    }
                </div>
            </> : <Spinner/>
        }
    </div>
  )
}
const HistoryBox = ({item, index}) => {
    const [BoxVisible,SetBoxVisible] = useState(false)
    useEffect(()=>{
        SetBoxVisible(index === 0 ? true:false)
    },[index])

    return(
        <div className={styles.hbox}>
            <button
                className={`${styles.hbox_inner} btn`}
                onClick={()=>{
                SetBoxVisible(!BoxVisible)
                }}
            >  
                <img 
                    src="/assets/icons/angle_color_up.svg" 
                    alt="angle" 
                    className={`${styles.icon} ${BoxVisible ? `${styles.icon} ${styles.flip}` : ''}`}
                />
                 <p className={styles.hbox_title}>
                    <InjectHTML html={item.title} />
                </p>
                <p className={styles.hbox_role}>
                    <InjectHTML html={item.position} />
                </p>
            </button>
            {
                BoxVisible &&
                <p className={styles.text}>
                    <InjectHTML html={item.description} />
                </p>
            }
        </div>
    )
}
export default History