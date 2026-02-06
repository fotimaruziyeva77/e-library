import { Card, CardContent } from '@/components/ui/card'
import { LibraryStatisticsTypes } from '@/interfaces'
import { APISERVICE } from '@/services/api-service'
import axios from 'axios'
import { useEffect, useState } from 'react'
import {
	Bar,
	BarChart,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import Cookies from 'js-cookie'
import useTranslate from '@/hooks/use-translate'

function Month() {
	const library_id = Cookies.get('library_id')
	const t=useTranslate()
	const [statistics, setStatistics] = useState<LibraryStatisticsTypes>()
	useEffect(() => {
		const fetchData = async () => {
			await axios
				.get(`${APISERVICE.libraryStatistics}/${library_id}/`)
				.then(res => {
					setStatistics(res.data)
					console.log(res.data)
				})
				.catch(err => console.log(err))
		}

		if (library_id) fetchData()
	}, [library_id])

	return (
		<div className='sm:px-0 px-3'>
			<Card className='flex flex-col border border-solid border-[#00000025] w-auto h-[430px]'>
				<CardContent className='p-2'>
					<h2 className='mb-4 sm:text-lg text-base'>
						{t('statistics.title')}
					</h2>
					<ResponsiveContainer width='100%' height={300} className={'w-full'}>
						<BarChart data={statistics?.last_30_days_statistics}>
							<XAxis dataKey='date' className='text-sm' />
							<YAxis />
							<Tooltip />
							<Legend />
							<Bar
								dataKey='returned_books'
								fill='#A78BFA'
								name={t('statistics.bookresend')}
							/>
							<Bar
								dataKey='taken_books'
								fill='#F472B6'
								name={t('statistics.booktitle')}
							/>
						</BarChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>{' '}
		</div>
	)
}

export default Month
