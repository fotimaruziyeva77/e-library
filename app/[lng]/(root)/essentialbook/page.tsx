'use client'

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { CategoryTypes, DeficientBookTypes } from '@/interfaces'
import axios from 'axios'
import { APISERVICE } from '@/services/api-service'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import Cookies from 'js-cookie'
import Image from 'next/image'
import useTranslate from '@/hooks/use-translate'
import { useParams } from 'next/navigation'
import PaginationComponent from '../_components/pagination'

function Page() {
	const library_id = Cookies.get('library_id')
	const [deficientBooks, setDeficientBooks] = useState<DeficientBookTypes[]>([])
	const [page, setPage] = useState<number>(1)
	const [totalPages, setTotalPages] = useState<number>(0)
	const [categories, setCategories] = useState<CategoryTypes[]>([])
	const [selectedCategory, setSelectedCategory] = useState('')
	const t = useTranslate()
	const { lng } = useParams()

	useEffect(() => {
		const fetchData = async () => {
			await axios
				.get(`${APISERVICE.books}/${library_id}/categories/`)
				.then(res => {
					setCategories(res.data.results)
				})
				.catch(err => console.log(err))
		}

		fetchData()
	}, [library_id])

	useEffect(() => {
		const fetchData = async () => {
			await axios
				.get(
					`${APISERVICE.books}/${library_id}/deficient-books/?limit=5&offset=${page}&category=${selectedCategory}`
				)
				.then(res => {
					setDeficientBooks(res.data.results)
					setTotalPages(Math.ceil(res.data.count / 5))
				})
		}

		fetchData()
	}, [library_id, page, selectedCategory])

	return (
		<div className='min-h-screen h-full sm:py-18 py-14 w-full'>
			<div className='w-full bg-white py-3 sm:border-none border-y border-solid border-[#00000025] sm:px-0 px-3'>
				<Breadcrumb className='max-w-[1400px] m-auto'>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink
								href={`/${lng}/`}
								className='text-[#3F51B5] sm:text-base text-sm font-semibold'
							>
								{t('nav-link.homepage')}
							</BreadcrumbLink>
						</BreadcrumbItem>
						<span>/</span>
						<BreadcrumbItem>
							<BreadcrumbPage className='sm:text-base text-sm font-semibold text-gray-500'>
								{t('nav-link.necessary_books')}
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
			<div className='max-w-[1400px] m-auto w-full sm:py-6 py-3 px-3 sm:px-0'>
				<div className='flex gap-4 sm:flex-row flex-col'>
					<div className='basis-1/4 bg-white '>
						<div className='w-full'>
							<Select
								onValueChange={value => setSelectedCategory(value)}
								value={selectedCategory}
							>
								<SelectTrigger className='w-full'>
									<SelectValue
										placeholder={t('essentialbooks.essentialbookstext')}
									/>
								</SelectTrigger>
								<SelectContent className='bg-white'>
									{categories.map(item => (
										<SelectItem
											key={item.id}
											value={`${item.id}`}
											className='cursor-pointer'
										>
											{item.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<Button
							className='w-full mt-4 bg-blue-400 text-black hover:bg-blue-500 cursor-pointer'
							onClick={() => setSelectedCategory('')}
						>
							{t('common.clear')}
						</Button>
					</div>

					<div className='basis-3/4 bg-white  flex flex-col gap-10 pb-10 '>
						<div className='w-full overflow-x-auto'>
							<table className='w-full table-auto border-collapse rounded-lg overflow-hidden'>
								<thead>
									<tr className='bg-gray-100 '>
										<th className='p-4 text-left font-semibold text-gray-700'>
											№
										</th>
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
											{t('essentialbooks.essentialbooksnumber')}
										</th>
										<th className='p-4 text-center font-semibold text-gray-700'>
											{t('essentialbooks.essentialbooksnumberavailable')}
										</th>
									</tr>
								</thead>
								<tbody>
									{deficientBooks.map((item, idx) => (
										<tr className='border-b' key={idx}>
											<td className='p-4 text-left text-gray-600'>{idx + 1}</td>
											<td className='p-4 text-left'>
												<Image
													src={item.image || '/assets/open-book.png'}
													alt='book'
													width={80}
													height={80}
													className='rounded-md'
												/>
											</td>
											<td className='p-4 text-center text-base font-semibold text-gray-800'>
												{item.name}
											</td>
											<td className='p-4 text-center text-gray-600'>
												{item.author}
											</td>
											<td className='p-4 text-center text-gray-600'>
												{item.published_date}
											</td>
											<td className='p-4 text-center text-gray-600'>
												{item.booked_count}
											</td>
											<td className='p-4 text-center text-gray-600'>
												{item.stock}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						{totalPages > 1 && (
							<PaginationComponent
								page={page}
								setPage={setPage}
								totalPages={totalPages}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Page
