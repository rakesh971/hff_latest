import React,{useEffect,useState} from 'react'
import Element from '../Element/Element'
import Spinner from '../../../Common/Spinner/Spinner'
import styles from '../WhyWeStarted/WhyWeStarted.module.scss';

const WhatWeAimToDo = ({Data}) => {
  	const [SectionData,SetSectionData] = useState(null)
  
	useEffect(() => {
		SetSectionData(Data.child.filter(val => val.slug.includes('what-we-aim-to-do'))[0])
	}, [Data])

	return (
		<div className={styles.dynamic_content}>
			{
				SectionData ?
				<>
					{
						SectionData.sections.map(item => {
							return <Element data={item} key={item.id} />
						})
					}
				</> : <Spinner />
			}
		</div>
	)
}

export default WhatWeAimToDo