import React, {useState,useEffect} from 'react'
import Spinner from '../../../Common/Spinner/Spinner'
import useServer from '../../../../Hooks/useServer'
import { useSession } from 'next-auth/react'
import Image from '../../../Common/Image/Image'
import styles from './NewsSelectPopper.module.scss'
import { toast } from 'react-toastify'

const NewsSelectPopper = ({SetShowPopper, index, Id, SetId}) => {

    const {data:session} = useSession()
    const [callApi, Loading, setLoading ] = useServer()
    const [News, SetNews] = useState(null)
    const [Search, SetSearch] = useState('')
    const [SelectId, SetSelectId] = useState(null)

    useEffect(() => {
        getInfo()
    },[Search])
    
    const getInfo = async () => {
        let response = await callApi(`home-data/suggestions`,{type: 'news',search: Search}, false, 'get', false,session.user.token);
        if(response.error === 1) {
            var temp = response.data.map(val => {
                val.selected = false
                return val
            })
            SetNews(temp)
        }
    }

    const MarkItem = async() => {
        let response = null
        SelectId ? response = await callApi(`home-data/${Id}`, {page_id: SelectId}, false, 'put', false,session.user.token) :
        toast('Please select a item to save', {
            position: "bottom-center",
            type: "success",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        if(response && response.error === 1) {
            SetShowPopper(false)
            SetSelectId(null)
        }
    }

    const SelectItem = (item) => {
        var temp = [...News]
        temp.map(val => {
            if(val.id === item.id) {
                val.selected = true
                SetSelectId(val.id)
                return val
            } else {
                val.selected = false
                return val
            }
        })
        SetNews(temp)
    }
    return (
        <div className={styles.news_select_popper}>
            <div className={styles.news_select_popper_wrapper}>
                <div className={styles.popper_header}>
                    <p className={styles.popper_header_title}>{`Select Resource ${index + 1}`}</p>
                    <button 
                        className={`btn ${styles.btn} ${styles.close_btn}`}
                        onClick={() => {
                            SetId(null)
                            SetShowPopper(false)
                        }}
                    >
                        <img src="/assets/icons/close_icon.svg" alt="close" />
                    </button>
                </div>
                <div className={styles.popper_body}>
                    <div className={styles.search_wrap}>
                        <img src="/assets/icons/search.svg" alt="search" />
                        <input 
                            type="text" 
                            className={styles.form_control}
                            placeholder="Search" 
                            onChange={e => {
                                SetSearch(e.target.value)
                            }}
                        />
                    </div>
                    {
                        News ?
                        <div className={styles.popper_news_wrap}>
                            {
                                News.map(item => {
                                    return (
                                        <div 
                                            className={`${styles.popper_news} ${item.is_selected ? styles.select : ''}${item.selected ? styles.red : ''}`} key={item.id}
                                            onClick={() => {
                                                SelectItem(item)
                                            }}
                                        >
                                            <div className={styles.popper_news_img_wrap}>
                                                <Image image={item.background_image} alt={item.title} />
                                            </div>
                                            <div className={styles.popper_news_content}>
                                                <p className={styles.popper_news_title}>{item.title}</p>
                                                <p className={styles.news_date}>{item.created_at}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div> : <Spinner />
                    }
                    <button 
                        className={`btn ${styles.btn}`}
                        onClick={() => MarkItem()}
                    >Save</button>
                </div>
            </div>
         </div>
    )
}

export default NewsSelectPopper