import React, { useState, useEffect } from 'react'
import { GrClose } from 'react-icons/gr'
import { AiFillEdit } from 'react-icons/ai';
import { TwitterPicker } from 'react-color';
import { toast } from 'react-toastify';
import useServer from '../../../Hooks/useServer';
import styles from './TypePickerPopper.module.scss'

const TypePickerPopper = ({SetShowTypePopper, EventTypes, SetEventTypes, SetOptionTypeSelected}) => {

	const [Mode, SetMode] = useState('select')
	const [callApi,Loading,setLoading] =useServer()
	const [EventTypeText, SetEventTypeText] = useState('')
    const [EventTypeTextOld, SetEventTypeTextOld] = useState('')
    const [Color, SetColor] = useState('')
    const [ColorPicker, SetColorPicker] = useState(false)

	const init = async ()=>{
		let response = await callApi(`events-api/update-type`, {old_type: EventTypeTextOld,type: EventTypeText,type_color: Color}, false, 'put', false,session.user.token)
		if(response.error) {
			SetEventTypeText('')
			SetEventTypeTextOld('')
			SetColor('')
			var temp = EventTypes
			temp.map(val => {
				if(val.data === response.data.old_type) {
					val.data = response.data.type;
					val.type_color = response.data.type_color;
				}
			})
			SetMode('select')
		}
	}

	return (
		<div className={styles.manage_popper}>  
			<div className={styles.wrapper}>
				<div className={styles.manage_header}>
					<h2 className = {styles.manage_title}>
						{
							Mode === 'select' ?
							'Event Type' : 'Add Event Type'
						}
					</h2>
					<button className={` btn ${styles.btn} ${styles.close_btn}`}
						 onClick={() => SetShowTypePopper(false)}
					>
						<GrClose className={styles.icon}/>
					</button>
				</div>
				<div className={styles.manage_body}>
					<div className = {styles.types_list}>
						<div className = {styles.types_list_header}>
							<p className={styles.sec_title}>Select Event Type</p>
								{
									Mode === 'select' &&
									<button className={`btn ${styles.btn}`} onClick={() => SetMode('create')}>Add Event Type</button>
								}
						</div>
						{
							Mode === 'select'  &&
							<ul>
								{
									EventTypes.map((event,index) =>{
									return(
										<li key ={event + index}>
											<button className={`btn ${styles.btn} ${styles.icon}`}
												onClick = { ()=>{
													SetEventTypeTextOld(event.data)
													SetEventTypeText(event.data)
													SetColor(event.type_color || '')
													SetMode('edit')
												}}
											>
												<AiFillEdit />
											</button>
											<p className={styles.name}>{event.data}</p>
											<p className={styles.color}>
												<span style={{backgroundColor: event.type_color}}></span>
												{event.type_color}</p>
											<button className={` btn ${styles.btn} ${styles.select} ${event.selected ? styles.active : ''}`}
												 onClick={() => {
												SetEventTypes(EventTypes.map(val => {
													val.data === event.data ?
													val.selected = true : val.selected = false
													return val
												}))  
											}}
											>
												select
											</button>
										</li>
									)
									})
								}
							</ul>
						}
						<form>
							{
								Mode !== 'select' &&
								<>
									<div className={styles.form_grp}>
											<label for="type">Event Type</label>
											<input 
												type="text" 
												className={styles.form_control} 
												required
												value={EventTypeText}
												onChange={e => SetEventTypeText(e.target.value)}
											/>
										</div>
										<div>
											<div className={styles.form_grp}>
												<label for="color">Select Color</label>
												<button 
													className={` btn ${styles.btn} ${styles.color}`} 
													type="button"
													onClick={e => {
														e.stopPropagation()
														SetColorPicker(!ColorPicker)
													}}
												>
													{Color}
												</button>
											</div>
											{
												ColorPicker &&
												<TwitterPicker 
													width="100%"
													onChange={color => SetColor(color.hex)}
												/>
											}
										</div>
								</>
							}
							<div className={` ${styles.form_grp} ${styles.spaace_margin_top}`}>
								<button className={` btn ${styles.btn} ${styles.submit_btn}`}
									value="Submit"
									onClick={(e)=>{
										e.preventDefault();
										if(Mode === 'select') {
                                            SetOptionTypeSelected(EventTypes.filter(val => val.selected)[0])
                                            SetShowTypePopper(false)
                                        } else{
											if(EventTypeText.length <2){
												toast.error('Event Type should be minimum 2 characters')
											}
											if(!Color.length) {
                                                toast.error('Event Type color is mandatory')
                                                return
                                            }
											if(Mode === 'create') {
                                                var temp = EventTypes
                                                temp.push({
                                                    data: EventTypeText,
                                                    type_color: Color,
                                                })
                                                SetEventTypes(temp)
                                                SetMode('select')
                                            }else{
												init()
											}
										}
									}	
									}
								>
									Submit
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default TypePickerPopper