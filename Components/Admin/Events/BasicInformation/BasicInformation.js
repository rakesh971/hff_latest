import React, { useState, useEffect, useRef } from 'react'
import TextEditor from '../../TextEditor'
import Dropzone from 'react-dropzone'
import moment from 'moment-timezone'
import Spinner from '../../../Common/Spinner/Spinner'
import useServer from '../../../../Hooks/useServer'
import CreatableSelect from 'react-select/creatable';
import DatePicker from '../../DatePicker/DatePicker'
import TypePickerPopper from '../../TypePickerPopper/TypePickerPopper'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import styles from './BasicInformation.module.scss'

const BasicInformation = ({type, UpdateData, data}) => {

    const {data:session} = useSession()
    const router = useRouter();
    const [callApi,Loading,setLoading] = useServer()
	const [Text, SetText] = useState('')
	const [Title, SetTitle] = useState('')
	const [DisplayTitle, SetDisplayTitle] = useState('')
	const [Image, SetImage] = useState(null)
	const [ImageData, SetImageData] = useState(null)
    const [LocationOptions, SetLocationOptions] = useState([])
    const [TypeOptions, SetTypeOptions] = useState([])
    const [EventTypes, SetEventTypes] = useState([])
    const [OptionTypeSelected, SetOptionTypeSelected] = useState(null)
    const [OptionLocationSelected, SetOptionLocationSelected] = useState(null)
    const [ShowCalendar, SetShowCalendar] = useState(false);
    const [ShowTypePopper, SetShowTypePopper] = useState(false);
    const [CalendarType, SetCalendarType] = useState('single');
    const [TimeStartDrop, SetTimeStartDrop] = useState(false);
    const [TimeEndDrop, SetTimeEndDrop] = useState(false);
    const [TimeStartData, SetTimeStartData] = useState({
        hours: [
            {
                id: 'tsd00',
                text: '00',
                selected: true
            },
            {
                id: 'tsd01',
                text: '01',
                selected: false
            },
            {
                id: 'tsd02',
                text: '02',
                selected: false
            },
            {
                id: 'tsd03',
                text: '03',
                selected: false
            },
            {
                id: 'tsd04',
                text: '04',
                selected: false
            },
            {
                id: 'tsd05',
                text: '05',
                selected: false
            },
            {
                id: 'tsd06',
                text: '06',
                selected: false
            },
            {
                id: 'tsd07',
                text: '07',
                selected: false
            },
            {
                id: 'tsd08',
                text: '08',
                selected: false
            },
            {
                id: 'tsd09',
                text: '09',
                selected: false
            },
            {
                id: 'tsd10',
                text: '10',
                selected: false
            },
            {
                id: 'tsd11',
                text: '11',
                selected: false
            },
            {
                id: 'tsd12',
                text: '12',
                selected: false
            },
            {
                id: 'tsd13',
                text: '13',
                selected: false
            },
            {
                id: 'tsd14',
                text: '14',
                selected: false
            },
            {
                id: 'tsd15',
                text: '15',
                selected: false
            },
            {
                id: 'tsd16',
                text: '16',
                selected: false
            },
            {
                id: 'tsd17',
                text: '17',
                selected: false
            },
            {
                id: 'tsd18',
                text: '18',
                selected: false
            },
            {
                id: 'tsd19',
                text: '19',
                selected: false
            },
            {
                id: 'tsd20',
                text: '20',
                selected: false
            },
            {
                id: 'tsd21',
                text: '21',
                selected: false
            },
            {
                id: 'tsd22',
                text: '22',
                selected: false
            },
            {
                id: 'tsd23',
                text: '23',
                selected: false
            },
            {
                id: 'tsd24',
                text: '24',
                selected: false
            },
        ],
        minutes: [
            {
                id: 'tsdm00',
                text: '00',
                selected: true
            },
            {
                id: 'tsdm01',
                text: '01',
                selected: false
            },
            {
                id: 'tsdm02',
                text: '02',
                selected: false
            },
            {
                id: 'tsdm03',
                text: '03',
                selected: false
            },
            {
                id: 'tsdm04',
                text: '04',
                selected: false
            },
            {
                id: 'tsdm05',
                text: '05',
                selected: false
            },
            {
                id: 'tsdm06',
                text: '06',
                selected: false
            },
            {
                id: 'tsdm07',
                text: '07',
                selected: false
            },
            {
                id: 'tsdm08',
                text: '08',
                selected: false
            },
            {
                id: 'tsdm09',
                text: '09',
                selected: false
            },
            {
                id: 'tsdm10',
                text: '10',
                selected: false
            },
            {
                id: 'tsdm11',
                text: '11',
                selected: false
            },
            {
                id: 'tsdm12',
                text: '12',
                selected: false
            },
            {
                id: 'tsdm13',
                text: '13',
                selected: false
            },
            {
                id: 'tsdm14',
                text: '14',
                selected: false
            },
            {
                id: 'tsdm15',
                text: '15',
                selected: false
            },
            {
                id: 'tsdm16',
                text: '16',
                selected: false
            },
            {
                id: 'tsdm17',
                text: '17',
                selected: false
            },
            {
                id: 'tsdm18',
                text: '18',
                selected: false
            },
            {
                id: 'tsdm19',
                text: '19',
                selected: false
            },
            {
                id: 'tsdm20',
                text: '20',
                selected: false
            },
            {
                id: 'tsdm21',
                text: '21',
                selected: false
            },
            {
                id: 'tsdm22',
                text: '22',
                selected: false
            },
            {
                id: 'tsdm23',
                text: '23',
                selected: false
            },
            {
                id: 'tsdm24',
                text: '24',
                selected: false
            },
            {
                id: 'tsdm25',
                text: '25',
                selected: false
            },
            {
                id: 'tsdm26',
                text: '26',
                selected: false
            },
            {
                id: 'tsdm27',
                text: '27',
                selected: false
            },
            {
                id: 'tsdm28',
                text: '28',
                selected: false
            },
            {
                id: 'tsdm29',
                text: '29',
                selected: false
            },
            {
                id: 'tsdm30',
                text: '30',
                selected: false
            },
            {
                id: 'tsdm31',
                text: '31',
                selected: false
            },
            {
                id: 'tsdm32',
                text: '32',
                selected: false
            },
            {
                id: 'tsdm33',
                text: '33',
                selected: false
            },
            {
                id: 'tsdm34',
                text: '34',
                selected: false
            },
            {
                id: 'tsdm35',
                text: '35',
                selected: false
            },
            {
                id: 'tsdm36',
                text: '36',
                selected: false
            },
            {
                id: 'tsdm37',
                text: '37',
                selected: false
            },
            {
                id: 'tsdm38',
                text: '38',
                selected: false
            },
            {
                id: 'tsdm39',
                text: '39',
                selected: false
            },
            {
                id: 'tsdm40',
                text: '40',
                selected: false
            },
            {
                id: 'tsdm41',
                text: '41',
                selected: false
            },
            {
                id: 'tsdm42',
                text: '42',
                selected: false
            },
            {
                id: 'tsdm43',
                text: '43',
                selected: false
            },
            {
                id: 'tsdm44',
                text: '44',
                selected: false
            },
            {
                id: 'tsdm45',
                text: '45',
                selected: false
            },
            {
                id: 'tsdm46',
                text: '46',
                selected: false
            },
            {
                id: 'tsdm47',
                text: '47',
                selected: false
            },
            {
                id: 'tsdm48',
                text: '48',
                selected: false
            },
            {
                id: 'tsdm49',
                text: '49',
                selected: false
            },
            {
                id: 'tsdm50',
                text: '50',
                selected: false
            },
            {
                id: 'tsdm51',
                text: '51',
                selected: false
            },
            {
                id: 'tsdm52',
                text: '52',
                selected: false
            },
            {
                id: 'tsdm53',
                text: '53',
                selected: false
            },
            {
                id: 'tsdm54',
                text: '54',
                selected: false
            },
            {
                id: 'tsdm55',
                text: '55',
                selected: false
            },
            {
                id: 'tsdm56',
                text: '56',
                selected: false
            },
            {
                id: 'tsdm57',
                text: '57',
                selected: false
            },
            {
                id: 'tsdm58',
                text: '58',
                selected: false
            },
            {
                id: 'tsdm59',
                text: '59',
                selected: false
            },
            {
                id: 'tsdm60',
                text: '60',
                selected: false
            },
        ],
    });

    const [TimeEndData, SetTimeEndData] = useState({
        hours: [
            {
                id: 'ted00',
                text: '00',
                selected: true
            },
            {
                id: 'ted01',
                text: '01',
                selected: false
            },
            {
                id: 'ted02',
                text: '02',
                selected: false
            },
            {
                id: 'ted03',
                text: '03',
                selected: false
            },
            {
                id: 'ted04',
                text: '04',
                selected: false
            },
            {
                id: 'ted05',
                text: '05',
                selected: false
            },
            {
                id: 'ted06',
                text: '06',
                selected: false
            },
            {
                id: 'ted07',
                text: '07',
                selected: false
            },
            {
                id: 'ted08',
                text: '08',
                selected: false
            },
            {
                id: 'ted09',
                text: '09',
                selected: false
            },
            {
                id: 'ted10',
                text: '10',
                selected: false
            },
            {
                id: 'ted11',
                text: '11',
                selected: false
            },
            {
                id: 'ted12',
                text: '12',
                selected: false
            },
            {
                id: 'ted13',
                text: '13',
                selected: false
            },
            {
                id: 'ted14',
                text: '14',
                selected: false
            },
            {
                id: 'ted15',
                text: '15',
                selected: false
            },
            {
                id: 'ted16',
                text: '16',
                selected: false
            },
            {
                id: 'ted17',
                text: '17',
                selected: false
            },
            {
                id: 'ted18',
                text: '18',
                selected: false
            },
            {
                id: 'ted19',
                text: '19',
                selected: false
            },
            {
                id: 'ted20',
                text: '20',
                selected: false
            },
            {
                id: 'ted21',
                text: '21',
                selected: false
            },
            {
                id: 'ted22',
                text: '22',
                selected: false
            },
            {
                id: 'ted23',
                text: '23',
                selected: false
            },
        ],
        minutes: [
            {
                id: 'tedm00',
                text: '00',
                selected: true
            },
            {
                id: 'tedm01',
                text: '01',
                selected: false
            },
            {
                id: 'tedm02',
                text: '02',
                selected: false
            },
            {
                id: 'tedm03',
                text: '03',
                selected: false
            },
            {
                id: 'tedm04',
                text: '04',
                selected: false
            },
            {
                id: 'tedm05',
                text: '05',
                selected: false
            },
            {
                id: 'tedm06',
                text: '06',
                selected: false
            },
            {
                id: 'tedm07',
                text: '07',
                selected: false
            },
            {
                id: 'tedm08',
                text: '08',
                selected: false
            },
            {
                id: 'tedm09',
                text: '09',
                selected: false
            },
            {
                id: 'tedm10',
                text: '10',
                selected: false
            },
            {
                id: 'tedm11',
                text: '11',
                selected: false
            },
            {
                id: 'tedm12',
                text: '12',
                selected: false
            },
            {
                id: 'tedm13',
                text: '13',
                selected: false
            },
            {
                id: 'tedm14',
                text: '14',
                selected: false
            },
            {
                id: 'tedm15',
                text: '15',
                selected: false
            },
            {
                id: 'tedm16',
                text: '16',
                selected: false
            },
            {
                id: 'tedm17',
                text: '17',
                selected: false
            },
            {
                id: 'tedm18',
                text: '18',
                selected: false
            },
            {
                id: 'tedm19',
                text: '19',
                selected: false
            },
            {
                id: 'tedm20',
                text: '20',
                selected: false
            },
            {
                id: 'tedm21',
                text: '21',
                selected: false
            },
            {
                id: 'tedm22',
                text: '22',
                selected: false
            },
            {
                id: 'tedm23',
                text: '23',
                selected: false
            },
            {
                id: 'tedm24',
                text: '24',
                selected: false
            },
            {
                id: 'tedm25',
                text: '25',
                selected: false
            },
            {
                id: 'tedm26',
                text: '26',
                selected: false
            },
            {
                id: 'tedm27',
                text: '27',
                selected: false
            },
            {
                id: 'tedm28',
                text: '28',
                selected: false
            },
            {
                id: 'tedm29',
                text: '29',
                selected: false
            },
            {
                id: 'tedm30',
                text: '30',
                selected: false
            },
            {
                id: 'tedm31',
                text: '31',
                selected: false
            },
            {
                id: 'tedm32',
                text: '32',
                selected: false
            },
            {
                id: 'tedm33',
                text: '33',
                selected: false
            },
            {
                id: 'tedm34',
                text: '34',
                selected: false
            },
            {
                id: 'tedm35',
                text: '35',
                selected: false
            },
            {
                id: 'tedm36',
                text: '36',
                selected: false
            },
            {
                id: 'tedm37',
                text: '37',
                selected: false
            },
            {
                id: 'tedm38',
                text: '38',
                selected: false
            },
            {
                id: 'tedm39',
                text: '39',
                selected: false
            },
            {
                id: 'tedm40',
                text: '40',
                selected: false
            },
            {
                id: 'tedm41',
                text: '41',
                selected: false
            },
            {
                id: 'tedm42',
                text: '42',
                selected: false
            },
            {
                id: 'tedm43',
                text: '43',
                selected: false
            },
            {
                id: 'tedm44',
                text: '44',
                selected: false
            },
            {
                id: 'tedm45',
                text: '45',
                selected: false
            },
            {
                id: 'tedm46',
                text: '46',
                selected: false
            },
            {
                id: 'tedm47',
                text: '47',
                selected: false
            },
            {
                id: 'tedm48',
                text: '48',
                selected: false
            },
            {
                id: 'tedm49',
                text: '49',
                selected: false
            },
            {
                id: 'tedm50',
                text: '50',
                selected: false
            },
            {
                id: 'tedm51',
                text: '51',
                selected: false
            },
            {
                id: 'tedm52',
                text: '52',
                selected: false
            },
            {
                id: 'tedm53',
                text: '53',
                selected: false
            },
            {
                id: 'tedm54',
                text: '54',
                selected: false
            },
            {
                id: 'tedm55',
                text: '55',
                selected: false
            },
            {
                id: 'tedm56',
                text: '56',
                selected: false
            },
            {
                id: 'tedm57',
                text: '57',
                selected: false
            },
            {
                id: 'tedm58',
                text: '58',
                selected: false
            },
            {
                id: 'tedm59',
                text: '59',
                selected: false
            },
        ],
    });
    
    const [RangeDate, SetRangeDate] = useState([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection'
        }
    ]);

    const buttonRef = useRef()
    
    useEffect(() => {
        if(type === 'edit' && data) {
            SetTitle(data.title)
            SetDisplayTitle(data.title)
            SetText(data.header)
            SetImage(data.background_image)
            SetRangeDate([
                {
                  startDate: new Date(data.eventDetail.start_date),
                  endDate: data.eventDetail.end_date === data.eventDetail.start_date ? new Date() : new Date(data.eventDetail.end_date),
                  key: 'selection'
                }
            ])
            SetCalendarType(data.eventDetail.end_date === data.eventDetail.start_date ? 'single' : 'multiple')
            var startTime = {...TimeStartData}
            var endTime = {...TimeEndData}
            startTime.hours.map(val => {
                if(val.text === data.eventDetail.start_time.substring(0, 2)) {
                    val.selected = true
                    return val
                } else {
                    val.selected = false
                    return val
                }
            })
            startTime.minutes.map(val => {
                if(val.text === data.eventDetail.start_time.substring(3, 5)) {
                    val.selected = true
                    return val
                } else {
                    val.selected = false
                    return val
                }
            })
            endTime.hours.map(val => {
                if(val.text === data.eventDetail.end_time.substring(0, 2)) {
                    val.selected = true
                    return val
                } else {
                    val.selected = false
                    return val
                }
            })
            endTime.minutes.map(val => {
                if(val.text === data.eventDetail.end_time.substring(3, 5)) {
                    val.selected = true
                    return val
                } else {
                    val.selected = false
                    return val
                }
            })
            SetTimeStartData(startTime)
            SetTimeEndData(endTime)
            SetLocationOptions([
                {
                    value: data.eventDetail.location,
                    label: data.eventDetail.location
                }
            ])
            SetTypeOptions([
                {
                    value: data.eventDetail.type,
                    label: data.eventDetail.type
                }
            ])
            SetOptionLocationSelected(data.eventDetail.location)
            SetOptionTypeSelected({
                data: data.eventDetail.type,
                type_color: data.eventDetail.type_color,
                selected: true
            })
        }
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [data, EventTypes])

    const handleClickOutside = (event) => {
        if (buttonRef.current && !buttonRef.current.contains(event.target)) {
            SetTimeStartDrop(false)
            SetTimeEndDrop(false)
        }
    };
    
    useEffect(()=>{
       session && getLocationInitValues("")
    },[session])

    const getLocationInitValues = async (val) => {
        let response = await callApi('events-api/suggestions',{field:'location',search:`${val}`}, false, 'get', false,session.user.token)
        if(response.error === 1) {
            if(response.data.length) {
                var temp = response.data.map(val => {
                    return {
                        value: val.data,
                        label: val.data
                    }
                })
                var temp1 = response.data.filter(val => val.data == OptionLocationSelected)
                !temp1[0] && temp.push({
                    value: OptionLocationSelected,
                    label: OptionLocationSelected
                })
                SetLocationOptions(temp)
            } else {
                SetLocationOptions([])
            }
        }
         getTypeValues("")
    }

    const getLocationValues = async (val) => {
        let response = await callApi('events-api/suggestions',{field:'location',search: val}, false, 'get', false,session.user.token)
        console.log('getel',response)
        if(response.error === 1) {
            if(response.data.length) {
                var temp = response.data.map(val => {
                    return {
                        value: val.data,
                        label: val.data
                    }
                })
                var temp1 = response.data.filter(val => val.data == OptionLocationSelected)
                // !temp1[0] && temp.push({
                //     value: OptionLocationSelected,
                //     label: OptionLocationSelected
                // })
                console.log(temp1)
                SetLocationOptions(temp)
            } else {
                SetLocationOptions([])
            }
        }
    }

    console.log('OptionLocationSelected', OptionLocationSelected)

    const getTypeValues = async(val) => {
        let response = await callApi('events-api/suggestions',{field:'type',search:`${val}`}, false, 'get', false,session.user.token)
        if(response.error === 1) {
            if(response.data.length) {
                SetEventTypes(response.data.map(val => {
                    type === 'edit' && val.data === response.data.type ?
                    val.selected = true : val.selected = false
                    return val
                }))
                var temp = response.data.map((val, index) => {
                    return {
                        value: val,
                        label: val,
                        id: `val${index + 1}`
                    }
                })
                var temp1 = response.data.filter(val => val == OptionTypeSelected)
                !temp1[0] && temp.push({
                    value: OptionTypeSelected,
                    label: OptionTypeSelected
                })
                SetTypeOptions(temp)
            } else {
                SetTypeOptions([{
                    value: OptionTypeSelected,
                    label: OptionTypeSelected
                }])
            }
        }
    }
    
    return (
        <>
            {
                (type === 'edit' && data) || type === 'add' ?
                <>
                    <div className={styles.admin_content_edit}>
                        <div className={styles.admin_content_edit_wrapper}>
                            <div className={styles.section}>
                                <div className={styles.shead}>
                                    <p className={styles.stitle}>Title</p>
                                </div>
                                <div className={styles.box_content}>
                                    <TextEditor 
                                        value={Text} 
                                        setData={SetText} 
                                        element="p" 
                                        elClass="text_container"
                                        type="one"
                                    />
                                </div>
                            </div>
                            <div className={styles.section}>
                                <div className={styles.shead}>
                                    <p className={styles.stitle}>Display Title</p>
                                </div>
                                <div className={styles.box_content}>
                                    <TextEditor 
                                        value={DisplayTitle} 
                                        setData={SetDisplayTitle} 
                                        element="p" 
                                        elClass="text_container"
                                        type="one"
                                        Title={Title}
                                        SetTitle={SetTitle}
                                    />
                                    <small style={{color:"#6c6c6c"}}>Only 60 characters allowed</small>
                                </div>
                            </div>
                            <div className={styles.section}>
                                <div className={styles.shead}>
                                    <p className={styles.stitle}>Location</p>
                                </div>
                                {console.log('LocationOptions', OptionLocationSelected ? LocationOptions.find(val => val.value == OptionLocationSelected) : null)}
                                <div className={styles.box_content}>
                                    <CreatableSelect
                                        menuPosition="fixed"
                                        options={LocationOptions}
                                        className="pop_select"
                                        name='element_type'
                                        styles={customStyles}
                                        placeholder='Select Location'
                                        isSearchable
                                        // {...(type === 'edit' ? {value: LocationOptions ? LocationOptions.find(val => val.value == OptionLocationSelected) : []} : {})}
                                        value={OptionLocationSelected ? LocationOptions.find(val => val.value == OptionLocationSelected) : null}
                                        onChange={e => {
                                            SetOptionLocationSelected(e.value)
                                        }}
                                        onInputChange={val => getLocationValues(val)}
                                    />
                                </div>
                            </div>
                            <div className={styles.section}>
                                <div className={styles.shead}>
                                    <p className={styles.stitle}>Date</p>
                                </div>
                                <div className={styles.box_content}>
                                    <button 
                                        className= {`btn ${styles.btn} ${styles.date_text} `}
                                        onClick={() => SetShowCalendar(true)}
                                    >
                                        {moment(RangeDate[0].startDate).format(`DD MMM${CalendarType === 'single' ? ' YYYY' : ''}`)}
                                        { 
                                            CalendarType !== 'single' &&
                                            moment(RangeDate[0].endDate).format(' - DD MMM YYYY')
                                        }
                                        <img src="/assets/icons/calendar.svg" alt="calendar" />
                                    </button>
                                </div>
                            </div>
                            <div className={styles.section} ref={buttonRef}>
                                <div className={styles.shead}>
                                    <p className={styles.stitle}>Time</p>
                                </div>
                                <div className={styles.box_content}>
                                    <div className={styles.time_wrapper}>
                                        <div className={styles.time_wrapper_inner}>
                                            <button 
                                                className={`btn ${styles.btn}`}
                                                onClick={() => {
                                                    SetTimeEndDrop(false)
                                                    SetTimeStartDrop(!TimeStartDrop)
                                                }}
                                            >
                                                <span>
                                                    {
                                                        TimeStartData.hours.map(item => {
                                                            if(item.selected) {
                                                                return (
                                                                    <span key={item.id}>{item.text}</span>
                                                                )
                                                            }
                                                        })
                                                    }
                                                    <span>:</span>
                                                    {
                                                        TimeStartData.minutes.map(item => {
                                                            if(item.selected) {
                                                                return (
                                                                    <span key={item.id}>{item.text}</span>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </span>
                                                <img src="/assets/icons/angle_down.svg" alt="angle" />
                                            </button>
                                            {
                                                TimeStartDrop && 
                                                <div className={styles.time_drop}>
                                                    <img src="/assets/icons/caret_black.svg" alt="caret" className={styles.icon} />
                                                    <div className={styles.time_drop_hours}>
                                                        {
                                                            TimeStartData.hours.map(item => {
                                                                return (
                                                                    <span 
                                                                        key={item.id} 
                                                                        className={`${item.selected ? styles.selected : ''}`}
                                                                        onClick={() => {
                                                                            let temp = {...TimeStartData}
                                                                            temp.hours = temp.hours.map(val => {
                                                                                if(val.id === item.id) {
                                                                                    val.selected = true
                                                                                    return val
                                                                                } else {
                                                                                    val.selected = false
                                                                                    return val
                                                                                }
                                                                            })
                                                                            SetTimeStartData(temp)
                                                                        }}
                                                                    >{item.text}</span>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    <div className={styles.time_drop_minutes}>
                                                        {
                                                            TimeStartData.minutes.map(item => {
                                                                return (
                                                                    <span 
                                                                        key={item.id} 
                                                                        className={`${item.selected ? styles.selected : ''}`}
                                                                        onClick={() => {
                                                                            let temp = {...TimeStartData}
                                                                            temp.minutes = temp.minutes.map(val => {
                                                                                if(val.id === item.id) {
                                                                                    val.selected = true
                                                                                    return val
                                                                                } else {
                                                                                    val.selected = false
                                                                                    return val
                                                                                }
                                                                            })
                                                                            SetTimeStartData(temp)
                                                                        }}
                                                                    >{item.text}</span>
                                                                )
                                                            })
                                                        }
                                                    </div> 
                                                    <div className={styles.tbtns}>
                                                        <button 
                                                            className={`btn ${styles.btn} ${styles.small}`}
                                                            onClick={() => SetTimeStartDrop(false)}
                                                        >select</button>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        <div className={styles.time_wrapper_inner}>
                                            <button 
                                                className={`btn ${styles.btn}`}
                                                onClick={() => {
                                                    SetTimeStartDrop(false)
                                                    SetTimeEndDrop(!TimeEndDrop)
                                                }}
                                            >
                                                <span>
                                                    {
                                                        TimeEndData.hours.map(item => {
                                                            if(item.selected) {
                                                                return (
                                                                    <span key={item.id}>{item.text}</span>
                                                                )
                                                            }
                                                        })
                                                    }
                                                    <span>:</span>
                                                    {
                                                        TimeEndData.minutes.map(item => {
                                                            if(item.selected) {
                                                                return (
                                                                    <span key={item.id}>{item.text}</span>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </span>
                                                <img src="/assets/icons/angle_down.svg" alt="angle" />
                                            </button>
                                            {
                                                TimeEndDrop &&
                                                <div className={styles.time_drop}>
                                                    <img src="/assets/icons/caret_black.svg" alt="caret" className={styles.icon} />
                                                    <div className={styles.time_drop_hours}>
                                                        {
                                                            TimeEndData.hours.map(item => {
                                                                return (
                                                                    <span 
                                                                        key={item.id} 
                                                                        className={`${item.selected ? styles.selected : ''}`}
                                                                        onClick={() => {
                                                                            let temp = {...TimeEndData}
                                                                            temp.hours = temp.hours.map(val => {
                                                                                if(val.id === item.id) {
                                                                                    val.selected = true
                                                                                    return val
                                                                                } else {
                                                                                    val.selected = false
                                                                                    return val
                                                                                }
                                                                            })
                                                                            SetTimeEndData(temp)
                                                                        }}
                                                                    >{item.text}</span>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    <div className={styles.time_drop_minutes}>
                                                        {
                                                            TimeEndData.minutes.map(item => {
                                                                return (
                                                                    <span 
                                                                        key={item.id} 
                                                                        className={`${item.selected ? styles.selected : ''}`}
                                                                        onClick={() => {
                                                                            let temp = {...TimeEndData}
                                                                            temp.minutes = temp.minutes.map(val => {
                                                                                if(val.id === item.id) {
                                                                                    val.selected = true
                                                                                    return val
                                                                                } else {
                                                                                    val.selected = false
                                                                                    return val
                                                                                }
                                                                            })
                                                                            SetTimeEndData(temp)
                                                                        }}
                                                                    >{item.text}</span>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    <div className={styles.tbtns}>
                                                        <button
                                                            className={`btn ${styles.btn} ${styles.small}`}
                                                            onClick={() => SetTimeEndDrop(false)}
                                                        >select</button>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.section}>
                                <div className={styles.shead}>
                                    <p className={styles.stitle}>Type</p>
                                </div>
                                <div className={styles.box_content}>
                                    <div className={styles.type_wrap}>
                                        <button 
                                            className={`btn ${styles.btn}`}
                                            onClick={() => {
                                                SetShowTypePopper(true)
                                            }}
                                        >
                                            <span>
                                                {
                                                    OptionTypeSelected ? OptionTypeSelected.data : 'Select Type'
                                                }                                                
                                            </span>
                                            <img src="/assets/icons/angle_down.svg" alt="angle" />
                                        </button>
                                    </div>
                                    {/* <CreatableSelect
                                        menuPosition="fixed"
                                        options={TypeOptions}
                                        className="pop_select"
                                        name='element_type'
                                        styles={customStyles}
                                        placeholder='Select Type'
                                        isSearchable
                                        {...(type === 'edit' ? {value: TypeOptions ? TypeOptions.filter(val => val.value == OptionTypeSelected) : []} : {})}
                                        onChange={e => {
                                            var temp = [...TypeOptions]
                                            temp.push({
                                                value: e.value,
                                                label: e.value
                                            })
                                            SetTypeOptions(temp)
                                            SetOptionTypeSelected(e.value)
                                        }}
                                        onInputChange={val => getTypeValues(val)}
                                    /> */}
                                </div>
                            </div>
                            <div className={styles.section}>
                                <div className={styles.shead}>
                                    <p className={styles.stitle}>
                                        Image
                                        <span className={styles.light_text}>(recommended dimensions: 1440w X 520h)</span>
                                    </p>
                                    <button 
                                        className={`btn ${styles.btn}`}
                                        onClick={() => SetImage(null)}
                                    >
                                        Remove image
                                    </button>
                                </div>
                                <div className={styles.box_content}>
                                    <Dropzone onDrop={acceptedFiles => {
                                        SetImage(URL.createObjectURL(acceptedFiles[0]))
                                        SetImageData(acceptedFiles[0])
                                    }}>
                                        {({getRootProps, getInputProps, isDragActive}) => (
                                            <section>
                                                <div {...getRootProps()} className={`${styles.box_content_dropzone} ${Image === null ? styles.show_dropzone : ''}`}>
                                                    <input {...getInputProps()} />
                                                    {
                                                        isDragActive ?
                                                        <p>Drop the files here ...</p> :
                                                        Image === null ?
                                                        <div className={styles.dropzone}>
                                                            <p className={styles.color}>Drag an image here</p>
                                                            <p className={styles.lgt}>or if you prefer</p>
                                                            <p className={styles.color_box}>Choose an image to upload</p>
                                                        </div> :
                                                        <img src={Image} alt="preview" />
                                                    }
                                                </div>
                                            </section>
                                        )}
                                    </Dropzone>
                                </div>
                            </div>
                            <div className={styles.section_btns}>
                                <button 
                                    className={` btn  ${styles.btn} ${styles.update} ${styles.orange}`}
                                    onClick={() => {
                                        UpdateData({Text, Title, ImageData, OptionTypeSelected, OptionLocationSelected, TimeStartData, TimeEndData, RangeDate, CalendarType})
                                    }}
                                >
                                    {type === 'edit' ? 'Update' : 'Add'} Event
                                </button>
                            </div>
                        </div>
                    </div>
                    {
                        ShowCalendar &&
                        <DatePicker SetShowCalendar={SetShowCalendar} type={CalendarType} RangeDate={RangeDate} SetRangeDate={SetRangeDate} SetCalendarType={SetCalendarType} />
                    }
                    {
                        ShowTypePopper &&
                        <TypePickerPopper {...{SetShowTypePopper, EventTypes, SetEventTypes, SetOptionTypeSelected}}  />
                    }
                </> : <Spinner />
            }
        </>
    )
}

const customStyles = {
    input: (provided, state) => ({
        ...provided,
        height: '40px',
        lineHeight: '40px',
        padding: '0',
        fontSize: '16px',
        fontWeight: 'bold'
    }),
    container: (provided, state) => ({
        ...provided,
        height: '40px',
        width: '100%',
        maxWidth: '100%',
        padding: '0',
        marginLeft: 'auto',
    }),
    control: (provided, state) => ({
        ...provided,
        height: '40px',
        padding: '0',
        paddingLeft: '14px',
        backgroundColor: '#fff',
        borderRadius: '0',
        border: '1px solid #333',
        boxShadow: 'none'
    }),
    valueContainer: (provided, state) => ({
        ...provided,
        height: '40px',
        fontWeight: '600',
        padding: '0'
    }),
    placeholder: (provided, state) => ({
        ...provided,
        fontSize: '16px',
        fontWeight: '400',
        color: '#333',
    }),
    indicatorSeparator: (provided, state) => ({
        ...provided,
        display: 'none'
    }),
    dropdownIndicator: (provided, state) => ({
        ...provided,
        fill: '#fff'
    }),
    singleValue: (provided, state) => ({
        ...provided,
        fontSize: '16px',
        fontWeight: '400',
        color: '#333'
    }),
    option: (provided, state) => ({
        ...provided,
        fontSize: '14px',
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

export default BasicInformation