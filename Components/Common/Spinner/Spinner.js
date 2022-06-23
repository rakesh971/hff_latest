import React from 'react'
import styles from './Spinner.module.scss'

const Spinner = () => {
    return (
        <div className={styles.spinner}>
            <div className={styles.spin}></div>
        </div>
    )
}

export default Spinner
