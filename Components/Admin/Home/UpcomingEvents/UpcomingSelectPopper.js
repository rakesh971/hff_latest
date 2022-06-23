import React, {useState,useEffect} from 'react'
import useServer from '../../../../Hooks/useServer'
import { useSession } from 'next-auth/react' 
import Spinner from '../../../Common/Spinner/Spinner'
import Image from '../../../Common/Image/Image'
import { toast } from 'react-toastify'
import styles from './UpcomingSelecrProper.module.scss'

const UpcomingSelectPopper = ({SetShowPopper, Id, SetId}) => {

    const {data:session} = useSession()
    const [callApi,Loading,setLoading] = useServer()
    const [Events, SetEvents] = useState(null)
    const [Search, SetSearch] = useState('')
    const [SelectId, SetSelectId] = useState(null)
    
	useEffect(() => {
		session && getInfo()
	},[Search])

    const getInfo = async () => {
        let response = await callApi(`home-data/suggestions`, 
			{type: 'upcoming',search: Search}, false, 'get', false,session.user.token);
			if(response.error === 1) {
				SetEvents(response.data)
			}
    }

	const MarkItem = async () => {
		let response = null ;
        SelectId ? 
        Id ?
        response = await callApi(`home-data/${Id}`, {page_id: SelectId, type: 'upcoming'}, false, 'put', false,session.user.token) :
        response = await callApi(`home-data`, {page_id: SelectId, type: 'upcoming'}, false, 'post', false,session.user.token) :
        toast('Please select a item to add', {
            position: "bottom-center",
            type: "success",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
		if(response.error === 1) {
                SetShowPopper(false)
                SetSelectId(null)
		}
    }
	const SelectItem = (item) => {
        var temp = [...Events]
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
        SetEvents(temp)
    }

  
  return (
    <div className={styles.event_select_popper}>
		<div className={styles.event_select_popper_wrapper}>
			<div className={styles.popper_header}>
				<p className={styles.popper_header_title}>
					Add Upcoming Event
				</p>
				<button 
					className={` btn ${styles.btn} ${styles.close_btn}`}
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
					Events ?
					<div className={styles.popper_event_wrap}>
						{
							Events.map(item =>{
								return(
									<div
										className={`${styles.popper_event} ${item.is_selected ? styles.select : ''} ${item.selected ? styles.red : ''}`} key={item.title}
										onClick={() => {
											SelectItem(item)
										}}
									>
										<div className={styles.popper_event_img_wrap}>
                                           <Image  image={item.background_image} alt={item.title}/>
                                        </div>
                                        <div className={styles.popper_event_content}>
											<div>
												<p className={styles.popper_event_title}>{item.title}</p>
												<p className={styles.popper_event_text}>{item.created_at}</p>
											</div>
                                            <p className={styles.event_badge}>{item.eventDetail.type}</p>
                                        </div>
									</div>
								)
							})
						}
					</div>: <Spinner />
				}
				  <button 
                        className={`btn ${styles.btn}`}
                        onClick={() => MarkItem()}
                    >
                        {
                            Id ? 'Update' : 'Add'
                        }
                    </button>
			</div>  
		</div>
    </div>
  )
}

export default UpcomingSelectPopper