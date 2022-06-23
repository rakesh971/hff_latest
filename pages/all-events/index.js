import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Select from 'react-select'
import moment from 'moment-timezone'
import Image from '../../Components/Common/Image/Image'
import Spinner from '../../Components/Common/Spinner/Spinner'
import Pagination from '../../Common/Pagination/Pagination'
import PanelLayout from '../../Components/Common/PanelLayout/PanelLayout'
import useServer from '../../Hooks/useServer'
import styles from './All_Events.module.scss';
import { useRouter } from 'next/router'

const PastEvents = () => {
	
	const router = useRouter();
	const [callApi,Loading,setLoading] =useServer()
	const [LocationOptions, SetLocationOptions] = useState(null)
	const [TypeOptions, SetTypeOptions] = useState(null)
	const [Options, SetOptions] = useState(null)
	const [Paginate, SetPaginate] = useState(null)
	const [OptionSelected, SetOptionSelected] = useState(null)
	const [renderCheck,setRenderCheck] = useState(false)
	const [Config, SetConfig] = useState({
		'get': 'init',
		'location': '',
		'type': '',
		'search': '',
		'event_type': ""
	})

	useEffect(() => {
		SetOptions([
			{ value: '', label: 'All' },
			{ value: 'past', label: 'Past' },
			{ value: 'upcoming', label: 'Upcoming' }
		])
	}, [])
	
	const [Events, SetEvents] = useState()
	
	useEffect(()=>{
		if(router.isReady){
			SetConfig({
				'get': 'init',
				'location': '',
				'type': '',
				'search': '',
				'event_type': router.query.filter || ''
			})
			setRenderCheck(true)
			SetOptionSelected(router.query.filter || "")
		}  
	},[router])

	useEffect(() => {
		renderCheck && init (Config)
	}, [Config,renderCheck])

	const init = async (val)=>{
		let response = await callApi('website/filter-events', val, false, 'get', true);
			if (response.error === 1) {
				SetEvents(response.data.data);
				SetPaginate(response.data);
				var location = [{
					value: '',
					label: 'All'
				}]
				response.data.location.map(val => {
					location.push({
						value: val.location,
						label: val.location
					})
					return val
				})
				SetLocationOptions(location)
				var type = [{
					value: '',
					label: 'All'
				}]
				response.data.type.map(val => {
					type.push({
						value: val.type,
						label: val.type
					})
					return val
				})
				SetTypeOptions(type)
			}

	}


	return (
		<PanelLayout>
			<div className={styles.contains_everything}>
			{
				Events ?
				<div className={styles.events}>
					<div className={styles.custom_crumbs}>
						<div className={"contain"}>
							<ul>
								<li>
									<Link href="/events">
									<a className={styles.active}>Events</a>
									</Link>
									<img src="/assets/icons/angle_right_dark.svg" alt="angle_right" />
								</li>
								<li>All Events</li>
							</ul>
						</div>
					</div>
					<div className={styles.events_list}>
						<div className="contain">
							<p className={styles.section_title}>All Events</p>
							<div className={styles.event_filters}>
								<div className={styles.search_wrap}>
									<img src="/assets/icons/search.svg" alt="search icon" />
									<input
									type="text"
									className={`form_control ${styles.form_control}`}
									placeholder="Enter keyword here"
									value={Config.search}
									onChange={e => {
										SetConfig({
										...Config,
										'search': e.target.value
										})
									}}
									/>
								</div>
								<div className={styles.drop_filters}>
									<div className={styles.select}>
									<Select
										menuPosition="fixed"
										options={Options}
										className="pop_select"
										name='element_type'
										styles={customStyles}
										placeholder='Select Availability'
										isSearchable={false}
										{...(router.query ? { value: Options ? Options.filter(val => val.value == OptionSelected) : [] } : {})}
										onChange={e => {
										SetConfig({
											...Config,
											'event_type': e.value
										})
										SetOptionSelected(e.value)
										}}
									/>
									</div>
									<div className={styles.select}>
									<Select
										menuPosition="fixed"
										options={LocationOptions}
										className="pop_select"
										name='element_type'
										styles={customStyles}
										placeholder='Select Location'
										isSearchable={false}
										onChange={e => {
										SetConfig({
											...Config,
											'location': e.value
										})
										}}
									/>
									</div>
									<div className={styles.select}>
									<Select
										menuPosition="fixed"
										options={TypeOptions}
										className="pop_select"
										name='element_type'
										styles={customStyles}
										placeholder='Select Type'
										isSearchable={false}
										onChange={e => {
										SetConfig({
											...Config,
											'type': e.value
										})
										}}
									/>
									</div>
								</div>
							</div>
							<div className={styles.wrapper}>
							{
								Events.map(item => {
								return (
									<Link href={`/events/${item.slug}`} key={item.id}>
										<a className={styles.event_box}>
											<Image image = {item.background_image} alt={item.title}/>
											<div className={styles.event_wrapper}>
												<div className={styles.event_info}>
													<p className={styles.title}>{item.title}</p>
													<p className={styles.text}>{item.seo_description}</p>	
												</div>
												<div className={styles.event_meta}>
													<p className={styles.date}>
													{
														`${moment(item.eventDetail.start_date,"Do MMM YYYY")}==${moment(item.eventDetail.end_date,"YYYY Do MMM")}` ?
														moment(item.eventDetail.start_date,"Do MMM YYYY").format('Do MMM YYYY') :
														`${moment(item.eventDetail.start_date,"Do MMM YYYY").format('Do')} - ${moment(item.eventDetail.end_date).format('Do MMM YYYY')}`
													}
													</p>
													<p className={styles.cat} style={{background: item.eventDetail.type_color}}>{item.eventDetail.type}</p>
												</div>
											</div>
										</a>
									</Link>
								)
								})
							}
							</div>
							{ Paginate && <Pagination Data={Paginate} SetConfig={SetConfig} DefaultLimit = {5} Config={Config} /> }
						</div>
					</div>
				</div> : <Spinner />
			}
			</div>
		</PanelLayout>
	)
}

const customStylesSm = {
  input: (provided, state) => ({
      ...provided,
      height: '31px',
      lineHeight: '31px',
      padding: '0',
      fontSize: '20px',
      fontWeight: '400',
      width: '75px',
  }),
  container: (provided, state) => ({
      ...provided,
      height: '31px',
      width: '75px',
      maxWidth: '100%',
      padding: '0',
      marginLeft: '10px',
      marginRight: '10px',
      backgroundColor: '#fff',
  }),
  control: (provided, state) => ({
      ...provided,
      height: '31px',
      padding: '0',
      paddingLeft: '6px',
      borderRadius: '0',
      border: '1px solid #333',
      boxShadow: 'none',
      backgroundColor: '#fff',
  }),
  valueContainer: (provided, state) => ({
      ...provided,
      height: '31px',
      padding: '0',
  }),
  placeholder: (provided, state) => ({
      ...provided,
      fontSize: '20px',
      fontWeight: '400',
      color: 'rgba(0, 0, 0, 0.6)',
  }),
  indicatorsContainer: (provided, state) => ({
      ...provided,
      padding: 0
  }),
  indicatorSeparator: (provided, state) => ({
      ...provided,
      display: 'none'
  }),
  dropdownIndicator: (provided, state) => ({
      ...provided,
      fill: 'rgba(0, 0, 0, 0.0);'
  }),
  singleValue: (provided, state) => ({
      ...provided,
      fontSize: '18px',
      color: '#333',
      fontWeight: '600'
  }),
  option: (provided, state) => ({
      ...provided,
      fontSize: '16px',
      fontWeight: '400',
      padding: '6px 12px',
      backgroundColor: '#fff',
      color: state.isSelected ? '#264F7F' : 'rgba(0, 0, 0, 0.8)',
      zIndex: 999
  }),
  menuPortal: (provided, state) => ({
      ...provided,
      backgroundColor: '#fff',
  }),
}

const customStyles = {
    input: (provided, state) => ({
        ...provided,
        height: '51px',
        lineHeight: '51px',
        padding: '0',
        fontSize: '20px',
        fontWeight: '400',
    }),
    container: (provided, state) => ({
        ...provided,
        height: '51px',
        width: '100%',
        maxWidth: '100%',
        padding: '0',
        marginLeft: 'auto',
        backgroundColor: '#F2F2F2',
    }),
    control: (provided, state) => ({
        ...provided,
        height: '51px',
        padding: '0',
        paddingLeft: '14px',
        borderRadius: '0',
        borderTopRightRadius: '10px',
        borderBottomRightRadius: '10px',
        border: '0',
        boxShadow: 'none',
        backgroundColor: '#F2F2F2',
    }),
    valueContainer: (provided, state) => ({
        ...provided,
        height: '51px',
        padding: '0',
    }),
    placeholder: (provided, state) => ({
        ...provided,
        fontSize: '20px',
        fontWeight: '400',
        color: 'rgba(0, 0, 0, 0.6)',
		whiteSpace: "nowrap",
		textOverflow: "ellipsis",
		overflow: "hidden"

    }),
    indicatorSeparator: (provided, state) => ({
        ...provided,
        display: 'none'
    }),
    dropdownIndicator: (provided, state) => ({
        ...provided,
        fill: 'rgba(0, 0, 0, 0.0);'
    }),
    singleValue: (provided, state) => ({
        ...provided,
        fontSize: '20px',
        color: '#333',
        fontWeight: '400',
    }),
    option: (provided, state) => ({
        ...provided,
        fontSize: '16px',
        fontWeight: '400',
        padding: '6px 12px',
        backgroundColor: '#fff',
        color: state.isSelected ? '#333' : 'rgba(0, 0, 0, 0.4)',
        zIndex: 999
    }),
    menuPortal: (provided, state) => ({
        ...provided,
        backgroundColor: '#fff',
    }),
}

export default PastEvents