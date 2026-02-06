import useTranslate from '@/hooks/use-translate'
import { LibraryStatisticsTypes } from '@/interfaces'
import { APISERVICE } from '@/services/api-service'
import axios from 'axios'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

function MostRead() {
	const t = useTranslate()
	const library_id = Cookies.get('library_id')
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
		<>
			{statistics?.top_books && statistics?.top_books.length > 0 && (
				<div className='w-full overflow-x-auto sm:px-0 px-3 mt-6'>
					<h1 className='sm:text-2xl text-xl sm:px-0 px-3 mt-6 mb-7 font-semibold'>
						{t('statistics.statisticsbooks')}
					</h1>
					<table className='w-max min-w-full table-auto border-collapse shadow-lg rounded-lg overflow-hidden'>
						<thead>
							<tr className='bg-gray-100 '>
								<th className='p-4 text-left font-semibold text-gray-700'>№</th>
								<th className='p-4 text-center font-semibold text-gray-700'>
									{t('essentialbooks.essentialbooksimage')}
								</th>
								<th className='p-4 text-center font-semibold text-gray-700'>
									{t('essentialbooks.essentialbooksname')}
								</th>
								<th className='p-4 text-center font-semibold text-gray-700'>
									{t('essentialbooks.essentialbooksauthor')}
								</th>
								<th className='p-4 text-center font-semibold text-gray-700'>
									{t('essentialbooks.essentialbooksyears')}
								</th>

								<th className='p-4 text-center font-semibold text-gray-700'>
									{t('essentialbooks.essentialbooksnumberavailable')}
								</th>
							</tr>
						</thead>
						<tbody>
							{statistics?.top_books.map((item, idx) => (
								<tr
									className='border-b  border-solid border-gray-200'
									key={idx}
								>
									<td className='p-4 text-left text-gray-600'>{idx + 1}</td>
									<td className='p-4 text-left'>
										<Image
											src={
												`http://library.sifatdev.uz/media/${item.image_path}` ||
												'/1984.png'
											}
											alt='book'
											width={80}
											height={80}
											className='rounded-md shadow-md'
										/>
									</td>
									<td className='p-4 text-center text-base font-medium text-gray-800'>
										{item.book__name}
									</td>
									<td className='p-4 text-center text-sm text-gray-600'>
										{item.book__author}
									</td>
									<td className='p-4 text-center text-sm text-gray-600'>
										{item.book__published_date}
									</td>
									<td className='p-4 text-center text-sm text-gray-600'>
										{item.total}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</>
	)
}

export default MostRead
