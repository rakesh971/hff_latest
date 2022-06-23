import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import styles from './Pagination.module.scss'

const Pagination = ({ Data, Config, SetConfig, DefaultLimit = 20 }) => {
    const [ItemsCount, SetItemsCount] = useState(null)
    const [ItemsSelected, SetItemsSelected] = useState()
    useEffect(() => {
        SetItemsCount([
            { value: DefaultLimit, label: DefaultLimit },
            { value: DefaultLimit*2, label: DefaultLimit*2 },
            { value: DefaultLimit*4, label: DefaultLimit*4 },
            { value: DefaultLimit*5, label: DefaultLimit*5 },
            { value: DefaultLimit*10, label: DefaultLimit*10 },
        ])
        SetItemsSelected({ value: DefaultLimit, label: DefaultLimit })
    }, [])
    const isFirst = (pagination) => {
        return pagination.page === 1;
    }

    const isCurrent = (pagination, page) => {
        return pagination.page === page;
    }


    const isLast = (pagination) => {
        return pagination.page === pagination.lastPage
    }

    const isAvailable = (pagination) => {
        return pagination.total > pagination.perPage
    }

    const pageDottedRange = (pagination, delta = 2) => {
        if (pagination.data.length === 0 || (pagination.data.length === 1 && pagination.page === 1)) {
            return [];
        }
        var current = parseInt(pagination.page, 10);
        var last = pagination.lastPage;
        var left = current - delta;
        var right = current + delta + 1;
        var range = [];
        var pages = [];
        var l;
        for (var i = 1; i <= last; i++) {
            if (i === 1 || i === last || (i >= left && i < right)) {
                range.push(i);
            }
        }
        range.forEach(function (i) {
            if (l) {
                if (i - l > 1) {
                    pages.push('...');
                }
            }
            pages.push(i);
            l = i;
        });
        return pages;
    }
    return (
        // isAvailable(Data) &&
        <div className={styles.custom_pagination}>
            <div className={styles.btns_grp}>
                {
                    pageDottedRange(Data, 2).map((n, i) => {
                        return (
                            n === "..." ?
                                <button key={`paginate${i}`} className={`btn ${styles.btn}`}>{n}</button> :
                                <button key={`paginate${i}`} onClick={(e) => SetConfig({ ...Config, page: n })} className={`${styles.btn} ${isCurrent(Data, n) && `${styles.active}`}`}>{n}</button>
                        )
                    })
                }
            </div>
            <div className={styles.show_amount}>
                <div className={styles.page_text}>
                    <span>Show</span>
                    <div>
                        <Select
                            menuPosition="fixed"
                            options={ItemsCount}
                            className="pop_select"
                            name='element_type'
                            styles={customStylesSm}
                            placeholder='Select Availability'
                            isSearchable={false}
                            value={ItemsSelected}
                            onChange={e => {
                                SetConfig({
                                    ...Config,
                                    'limit': e.value
                                })
                                SetItemsSelected(e)
                            }}
                        />
                    </div>
                    <span>items per page</span>
                </div>
            </div>
        </div>
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
export default Pagination