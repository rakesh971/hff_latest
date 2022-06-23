import React, {useState, useEffect, useRef} from 'react'
import InjectHTML from '../../../Common/InjectHTML/InjectHTML';
import styles from './Element.module.scss'; 
import Image from '../../../Common/Image/Image';

const Element = ({data, style={} }) => {
    
    const [ImgWidth, SetImgWidth] = useState(null)
    const InnerWrap = useRef();

    useEffect(() => {
        InnerWrap.current && SetImgWidth(InnerWrap.current.clientWidth)
    }, [])
	
    return (
        data.type === 'h2' ?
        <p className={styles.tab_title}>
            <InjectHTML html={data.content} />
        </p> : 
        data.type === 'p' ?
        <p className={styles.text}>
            <InjectHTML html={data.content} />
        </p> : 
        data.type === 'img' ?
        <div className={styles.img_wrap}>
            <Image image={{url:data.content}} />
        </div> : 
        data.type === 'card' ?
        <div className={`${styles.img_wrap} ${styles.multiple}`}>
            <div className={styles.inner_wrap} style={{height: InnerWrap.current ? ImgWidth : '250px'}} ref={InnerWrap}>
                <Image image={{url:data.content}} alt="card" />
                <div className={styles.content_overlay}></div>
                <p className={styles.img_title}>
                    <InjectHTML html={data.meta} />
                </p>
            </div>
            {
                data.child.map(item => {
                    return (
                        <div className={styles.inner_wrap} style={{height: InnerWrap.current ? ImgWidth : '250px'}} key={item.id}>
                            <Image image={{url:item.content}} alt="card" />
                            <div className={styles.content_overlay}></div>
                            <p className={styles.img_title}>
                                <InjectHTML html={item.meta} />
                            </p>
                        </div>
                    )
                })
            }
        </div> : null
    )
}

export default Element

