import React from 'react'
import { GrClose } from 'react-icons/gr'
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css'; 
import { Calendar, DateRange } from 'react-date-range';
import styles from './DatePicker.module.scss'

const DatePicker = ({SetShowCalendar, type, RangeDate, SetRangeDate, SetPublishDate, PublishDate, SetCalendarType}) => {

return (
    <div className={styles.manage_popper}>
        <div className={styles.wrapper}>
            <div className={styles.manage_header}>
                <h2 className={styles.manage_title}>
                    Date
                </h2>
                <button 
                    className={` btn ${styles.btn} ${styles.close_btn}`}
                    onClick={() => SetShowCalendar(false)}
                >
                    <GrClose className={styles.icon} />
                </button>
            </div>
            <div className={` ${styles.manage_body} ${styles.extra} ${PublishDate ? '' : styles.space_top}`}>
                {
                    !PublishDate &&
                    <div className={styles.calendar_type_select}>
                        <button
                            className={` btn ${styles.btn} ${styles.cbtn} ${type === 'single' ? styles.active : ''}`}
                            onClick={() => SetCalendarType('single')}
                        >
                            Date
                        </button>
                        <button
                            className={` btn ${styles.btn} ${styles.cbtn} ${type === 'multiple' ? styles.active : ''}`}
                            onClick={() => SetCalendarType('multiple')}
                        >
                            DateRange
                        </button>
                    </div>
                }
                <form>
                    <div className={styles.form_grp}>
                        <div className= {`${styles.text_center} ${styles.font_calendar}`}>
                            {
                                type === 'multiple' &&
                                <DateRange
                                    editableDateInputs={true}
                                    onChange={item => SetRangeDate([item.selection])}
                                    moveRangeOnFirstSelection={false}
                                    ranges={RangeDate}
                                />
                            }
                            {
                                type === 'single' &&
                                <Calendar
                                    date={PublishDate ? PublishDate : RangeDate[0].startDate}
                                    onChange={item => {
                                        PublishDate ?
                                        SetPublishDate(item) :
                                        SetRangeDate([
                                            {
                                                startDate: item,
                                                endDate: new Date(),
                                                key: 'selection'
                                            }
                                        ])
                                    }}
                                />
                            }
                        </div>
                    </div>
                    <div className={styles.form_grp}>
                        <button 
                            className={`btn ${styles.btn} ${styles.submit_btn}`}
                            value="Submit"
                            onClick={() => SetShowCalendar(false)}
                        >Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
)
}

export default DatePicker