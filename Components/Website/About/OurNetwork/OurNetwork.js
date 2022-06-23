import React, {useState, useEffect, useRef} from 'react'
import Element from '../Element/Element'
import Spinner from '../../../Common/Spinner/Spinner'
import Link from 'next/link'
import Image from '../../../Common/Image/Image'
import styles from './OurNetwork.module.scss'

const OurNetwork = ({Data}) => {

    const [SectionData, SetSectionData] = useState(null)
    const [ImgWidth, SetImgWidth] = useState(null)
    const InnerWrap = useRef();

    useEffect(() => {
        InnerWrap.current && SetImgWidth(InnerWrap.current.clientWidth)
    }, [InnerWrap])

    useEffect(() => {
        SetSectionData(Data.child.filter(val => val.slug.includes('our-network'))[0])
    }, [])
   

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
                    <div className={styles.network}>
                        {
                            SectionData.infocard.map((item, index) => {
                               
                                return (
                                    <Link 
                                        href={{ pathname: item.position }} 
                                        target="_blank" 
                                        ref={InnerWrap} 
                                        key={item.id}
                                    >
										<a className={styles.nbox} style={{height: InnerWrap.current ? ImgWidth : '200px'}} >
                                            <Image image ={item.image} alt="network logo" />
										</a>
                                    </Link>
                                )
                            })
                        }
                    </div>
                </> : <Spinner />
            }
        </div>
    )
}

export default OurNetwork