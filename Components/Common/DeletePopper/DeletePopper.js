import styles from './DeletePopper.module.scss'

const DeletePopper = ({SetShowDeletePopper, DeleteItem, Type}) => {
    
    return (
        <div className={styles.add_element_popper}>
            <div className={styles.add_element_popper_wrapper} style={{minHeight: 'unset'}}>
                <div className={styles.popper_header}>
                    <p className={styles.popper_header_title}>Delete {Type}</p>
                    <button 
                        className={`${styles.btn} ${styles.close_btn}`}
                        onClick={() => SetShowDeletePopper(false)}
                    >
                        <img src="/assets/icons/close_icon.svg" alt="close" />
                    </button>
                </div>
                <div className={styles.popper_body}>
                    <div className={styles.section}>
                        <div className={styles.shead}>
                            <p className={styles.stitle}>Are you sure you want to delete {Type}?</p>
                        </div>
                    </div>
                    <div className={`${styles.btns_grp} ${styles.middle}`}>
                        <button 
                            className={styles.btn}
                            style={{background: '#7D7D7D'}} 
                            onClick={() => SetShowDeletePopper(false)}
                        >
                            Cancel
                        </button>
                        <button 
                            className={`${styles.btn} ${styles.update}`} 
                            onClick={DeleteItem}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeletePopper