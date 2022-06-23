import React, {useState, useEffect, useContext} from 'react'
import Select from 'react-select'
import { AboutContext } from '../../Admin/AboutContext'
import useServer from '../../../Hooks/useServer'
import { useSession } from 'next-auth/react'
import styles from './AddElementPopper.module.scss'

const AddElementPopper = ({SetAddPopper, pageId,Data,SetData}) => {

    const {data:session} = useSession()
    const [callApi, Loading, setLoading ] = useServer() 
    const [Options, SetOptions] = useState(null)
    const [SelectedOption, SetSelectedOption] = useState(null)
    
    useEffect(() => {
        SetOptions([
            { value: 'h2', label: 'Header' },
            { value: 'img', label: 'Image' },
            { value: 'p', label: 'Text' },
            { value: 'card', label: 'Cards' },
        ])
    }, [])

    const addElem =async () => {
        let response = await callApi('sections', {
            type: SelectedOption,
            page_id: pageId,
            is_full: true
        }, false, 'post', false ,session.user.token);
        if(response.error === 1) {
            const temp = {...Data};
            temp.child.map(val => {
                if(val.id === pageId) {
                    val.section = response.data.section
                    return val
                } else {
                    return val
                }
            })
            SetData(temp)
            SetAddPopper(false)
        }
    }
console.log('addele==>',Data)
    
    return (
        <div className={styles.add_element_popper}>
            <div className={styles.add_element_popper_wrapper}>
                <div className={styles.popper_header}>
                    <p className={styles.popper_header_title}>Add Element</p>
                    <button 
                        className={` btn ${styles.btn} ${styles.close_btn}`}
                        onClick={() => SetAddPopper(false)}
                    >
                        <img src="/assets/icons/close_icon.svg" alt="close" />
                    </button>
                </div>
                <div className={styles.popper_body}>
                    <div className={styles.section}>
                        <div className={styles.shead}>
                            <p className={styles.stitle}>Choose Element</p>
                        </div>
                        <div className={styles.box_content}>
                            <Select
                                menuPosition="fixed"
                                options={Options}
                                className="pop_select"
                                name='element_type'
                                styles={customStyles}
                                placeholder='Element Type'
                                isSearchable={false}
                                onChange={e => SetSelectedOption(e.value)}
                            />
                        </div>
                    </div>
                    <div className={styles.btns_grp}>
                    <button className={` btn ${styles.btn}`} onClick={addElem}>Update</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const customStyles = {
    input: (provided, state) => ({
        ...provided,
        height: '40px',
        lineHeight: '40px',
        padding: '0',
        fontSize: '14px',
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
        fontSize: '13px',
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
        fontSize: '13px',
        fontWeight: '400',
        color: '#333'
    }),
    option: (provided, state) => ({
        ...provided,
        fontSize: '13px',
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


export default AddElementPopper