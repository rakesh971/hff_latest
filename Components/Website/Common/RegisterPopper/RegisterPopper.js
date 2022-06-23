import React from 'react'
import styles from './RegisterPopper.module.scss'

const RegisterPopper = ({SetRegisterShow, id, slug, Data}) => {
  return (
	  <div className={styles.register_popper}>
      <div className={styles.register_popper_wrapper}>
        <div className={styles.popper_header}>
          <p className={styles.popper_header_title}>Register</p>
          <button 
            className={`${styles.btn} ${styles.close_btn}`}
            onClick={() => SetRegisterShow(false)}
          >
            <img src="/assets/icons/close_icon.svg" alt="close" />
          </button>
        </div>
        <div className={styles.popper_body}>
          <div className={styles.popper_register_wrap}>
            <ul>
              <li>
                <p className={styles.side_title}>Location</p>
                <p className={styles.side_text}>
                  <InjectHTML html={Data.details.location} />
                </p>
              </li>
              <li>
                <p className={styles.side_title}>Date</p>
                <p className={styles.side_text}>{Data.details.date}</p>
              </li>
              <li>
                <p className={styles.side_title}>Time</p>
                <p className={styles.side_text}>{Data.details.time}</p>
              </li>
              <li>
                <p className={styles.side_title}>Type</p>
                <p className={styles.side_text_badge}>{Data.details.type}</p>
              </li>
            </ul>
          </div>
          <Link href={`/events/${id}/${slug}/register`}>
            <a className="btn lg">Next</a></Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterPopper