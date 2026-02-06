'use client'

import BookCard from '@/components/cards/book.card'
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import useTranslate from '@/hooks/use-translate'
import { ReservedBookTypes } from '@/interfaces'
import { APISERVICE } from '@/services/api-service'
import axios from 'axios'
import Cookies from 'js-cookie'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

function Saved() {
	const library_id = Cookies.get('library_id')
	const token = Cookies.get('access')
	const [books, setBooks] = useState<ReservedBookTypes[]>([])
	const [page, setPage] = useState<number>(1)
	const [totalPages, setTotalPages] = useState<number>(0)
	const [refresh, setRefresh] = useState(false)
	const t = useTranslate()
	const pathname = usePathname()
	useEffect(() => {
		const fetchData = async () => {
			await axios
				.get(`${APISERVICE.books}/${library_id}/reserve-book/?limit=3`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then(res => {
					const savedBooks = res.data.results.filter(
						(book: ReservedBookTypes) => book.status === 'booked'
					)

					setBooks(savedBooks)
					setTotalPages(Math.ceil(res.data.count / 3))
				})
		}
		if (token) fetchData()
	}, [library_id, token, refresh])

	const handleCancel = async (id: number) => {
		await axios
			.put(
				`${APISERVICE.books}/${library_id}/reserved-book/${id}/cancel/`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then(res => {
				toast.success(res.data.message, {
					position: 'top-center',
					richColors: true,
				})
				setRefresh(!refresh)
			})
			.catch(err => console.log(err))
	}
	return (
		<div className='w-full'>
			<div className='bg-white rounded-xl p-6 flex flex-col gap-4'>
				{books.length > 0 ? (
					<div className='grid grid-cols-1 sm:grid-cols-2  gap-6'>
						{books.map(item => (
							<div className='relative' key={item.book.id}>
								<BookCard
									name={item.book.name}
									image={item.book.image}
									category={item.book.category}
									rating={item.book.rating}
									reviews={item.book.reviews_count}
									type='small-rated'
									link={`/${pathname.split('/')[1]}/books/${item.book.slug}`}
									count={item.available_count}
									stock={item.stock}
								/>
								<button
									className='absolute top-2 right-2 cursor-pointer'
									onClick={() => handleCancel(item.id)}
								>
									<Trash2 className='text-sm text-red-500' size={16} />
								</button>
							</div>
						))}
					</div>
				) : (
					<div className='w-full py-24 flex items-center justify-center'>
						<div className='flex flex-col gap-5 items-center'>
							<Image
								src={'/assets/book_not_found.png'}
								alt='image'
								width={250}
								height={150}
								className='w-64 h-36 aspect-video'
							/>
							<p className='text-gray-400 text-sm'>
								{t('notfound.profilenotfound')}
							</p>
						</div>
					</div>
				)}
			</div>

			{/* Pagination: faqat 3+ kitob bo‘lsa ko‘rsatilsin */}
			{books.length > 3 && totalPages > 1 && (
				<Pagination className='sm:text-base text-sm mt-6'>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								href='#'
								className={page === 1 ? 'opacity-50 pointer-events-none' : ''}
								onClick={() => page > 1 && setPage(page - 1)}
							>
								Previous
							</PaginationPrevious>
						</PaginationItem>

						{(() => {
							const items = []

							if (totalPages <= 3) {
								for (let i = 1; i <= totalPages; i++) {
									items.push(
										<PaginationItem key={i}>
											<PaginationLink
												size='sm'
												href='#'
												onClick={() => setPage(i)}
												isActive={page === i}
											>
												{i}
											</PaginationLink>
										</PaginationItem>
									)
								}
							} else {
								items.push(
									<PaginationItem key={1}>
										<PaginationLink
											size='sm'
											href='#'
											onClick={() => setPage(1)}
											isActive={page === 1}
										>
											1
										</PaginationLink>
									</PaginationItem>
								)
								if (page > 2) {
									items.push(
										<PaginationItem key='start-ellipsis'>
											<PaginationEllipsis />
										</PaginationItem>
									)
								}

								for (
									let i = Math.max(2, page - 1);
									i <= Math.min(totalPages - 1, page + 1);
									i++
								) {
									items.push(
										<PaginationItem key={i}>
											<PaginationLink
												size='sm'
												href='#'
												onClick={() => setPage(i)}
												isActive={page === i}
											>
												{i}
											</PaginationLink>
										</PaginationItem>
									)
								}

								if (page < totalPages - 2) {
									items.push(
										<PaginationItem key='end-ellipsis'>
											<PaginationEllipsis />
										</PaginationItem>
									)
								}

								items.push(
									<PaginationItem key={totalPages}>
										<PaginationLink
											size='sm'
											href='#'
											onClick={() => setPage(totalPages)}
											isActive={page === totalPages}
										>
											{totalPages}
										</PaginationLink>
									</PaginationItem>
								)
							}

							return items
						})()}

						<PaginationItem>
							<PaginationNext
								href='#'
								className={
									page === totalPages ? 'opacity-50 pointer-events-none' : ''
								}
								onClick={() => page < totalPages && setPage(page + 1)}
							>
								Next
							</PaginationNext>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	)
}

export default Saved
