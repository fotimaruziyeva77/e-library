'use client'

import { cn } from '@/lib/utils'
import { MessageSquareText } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Information from '../_components/Information'
import BookComment from '../_components/bookcomment'
import { BookTypes } from '@/interfaces'
import axios from 'axios'
import { APISERVICE } from '@/services/api-service'
import { useParams, usePathname, useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { toast } from 'sonner'
import 'react-image-gallery/styles/css/image-gallery.css'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
} from '@/components/ui/breadcrumb'
const ReactStars = dynamic(() => import('react-stars'), {
	ssr: false,
	loading: () => <div className='h-6 bg-gray-200 rounded w-24' />,
})

import BookCard from '@/components/cards/book.card'
import dynamic from 'next/dynamic'
import BookCardSkeleton from '@/components/cards/book.card-sceleton'
import BookDetailSkeleton from '../_components/book-detail-sceleton'
import useTranslate from '@/hooks/use-translate'
import Link from 'next/link'
function BookDetails() {
	const [activeTab, setActiveTab] = useState('tab1')
	const [book, setBook] = useState<BookTypes | null>(null)
	const [reservedBooks, setReservedBooks] = useState<boolean>(false)
	const library_id = Cookies.get('library_id')
	const token = Cookies.get('access')
	const [bookedTakenDate, setBookedTakenDate] = useState('')
	const pathname = usePathname()
	const [loading1, setLoading1] = useState(false)
	const t = useTranslate()
	const router = useRouter()
	const { lng } = useParams()

	const params = useParams()
	const slug = slugify(decodeURIComponent(params.slug as string))

	function slugify(text: string): string {
		return text
			.toLowerCase()
			.normalize('NFKD')
			.replace(/[‘’ʻ`]/g, "'")
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^a-z0-9'-]+/g, '-')
			.replace(/-+/g, '-')
			.replace(/^-+|-+$/g, '')
	}

	useEffect(() => {
		if (!library_id || !slug) return
		setLoading1(true)
		const fetchData = async () => {
			try {
				const res = await axios.get(
					`${APISERVICE.books}/${library_id}/${slug}/`,
					{
						headers: {
							'Accept-Language': lng === 'uz-Cyrl' ? 'cy' : lng,
						},
					}
				)
				setBook(res.data)
			} catch (err: any) {
				if (err.response?.status === 404) {
					toast.error(t('notfound.booknotfound'), {
						position: 'top-center',
						richColors: true,
					})
					router.push(`${pathname.slice(0, 3)}/books`)
				} else {
					console.error(err)
				}
			} finally {
				setLoading1(false)
			}
		}

		fetchData()
	}, [library_id, pathname, router, slug, t])

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await axios.get(
					`${APISERVICE.books}/${library_id}/reserve-book/`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				)
				const allData = res.data.results

				allData.map((item: { book: BookTypes; taken_at: string }) => {
					if (item.book.id === book?.id) {
						setReservedBooks(true)
						setBookedTakenDate(item.taken_at)
						console.log(item.book.id === book.id, item.taken_at)
					}
				})
			} catch (err) {
				console.error(err)
			}
		}
		if (token) fetchData()
	}, [library_id, reservedBooks, book?.id, token])

	const handleOrder = async () => {
		if (!token) {
			toast.error(t('notification.title'), {
				position: 'top-center',
				richColors: true,
			})
			return
		}
		await axios
			.post(
				`${APISERVICE.books}/${library_id}/reserve-book/`,
				{ book: book?.id },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then(res => {
				console.log(res.data)
				toast.success(t('success.bookssuccess'), {
					position: 'top-center',
					richColors: true,
				})
				setReservedBooks(true)
				setBook(prev =>
					prev ? { ...prev, available_count: prev.available_count - 1 } : prev
				)
			})
			.catch(err => console.log(err))
	}

	return (
		<div className='min-h-screen py-18'>
			<div className='w-full bg-white py-3 max-w-[1400px] m-auto border-y border-solid border-[#00000025] sm:border-none'>
				<Breadcrumb className='px-3 sm:px-0 '>
					<BreadcrumbList className='flex items-center flex-wrap'>
						<BreadcrumbItem>
							<BreadcrumbLink
								href={`/${lng}/`}
								className='text-[#3F51B5] sm:text-base text-sm font-semibold'
							>
								{t('nav-link.homepage')}
							</BreadcrumbLink>
						</BreadcrumbItem>
						<span className='text-neutral-600/75'>/</span>
						<BreadcrumbItem>
							<BreadcrumbLink
								href={`/${lng}/books`}
								className='text-[#3F51B5] sm:text-base text-sm font-semibold'
							>
								{t('nav-link.books')}
							</BreadcrumbLink>
						</BreadcrumbItem>
						<span className='text-neutral-600/75'>/</span>
						<BreadcrumbItem>
							<BreadcrumbPage className='sm:text-base text-sm font-semibold text-gray-500'>
								{book?.name}
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>

			<div className='mt-4 max-w-[1400px] m-auto w-full '>
				{loading1 ? (
					<BookDetailSkeleton />
				) : (
					<div className='w-full flex justify-around px-3 sm:px-0 flex-col md:flex-row gap-10'>
						<div className='w-full flex flex-col sm:flex-row items-start gap-4 p-4 rounded-lg bg-white border border-solid border-[#00000025]'>
							<div className='w-[250px] h-[300px] group overflow-hidden rounded-md shrink-0'>
								<Image
									src={book?.image || '/assets/book_not_found.png'}
									alt={'image'}
									className='w-64 h-[300px] object-cover group-hover:scale-110 duration-200'
									width={250}
									height={300}
								/>
							</div>
							<div className='flex flex-col gap-5 flex-auto justify-between place-self-stretch'>
								<div className='flex flex-col gap-3'>
									<div className='flex items-start justify-between flex-wrap h-full'>
										<div className='flex flex-col gap-1'>
											<h1 className='font-semibold text-lg'>{book?.name}</h1>
											<span className='uppercase text-sm text-blue-600'>
												<Link
													href={`/${lng}/books?category=${book?.category_slug}`}
												>
													{book?.category}
												</Link>
											</span>
										</div>
										<div className='flex flex-row items-center gap-1'>
											<ReactStars
												count={5}
												value={book?.rating ?? 0}
												edit={false}
												size={24}
												color2={'#ffd700'}
											/>

											<span className='flex items-center gap-2'>
												<p className='text-base font-semibold'>
													{book?.rating}
												</p>
												<MessageSquareText className='fill-blue-300 text-blue-700' />
												<p className='text-gray-400 text-sm'>
													{book?.reviews_count} {t('books.comments')}
												</p>
											</span>
										</div>
									</div>
									<div className='flex items-center w-full flex-1 '>
										<p className='text-sm text-justify line-clamp-10'>
											{pathname.slice(1, 3) === 'uz' && book?.description_uz}
											{pathname.slice(1, 3) === 'ru' && book?.description_ru}
											{pathname.slice(1, 3) === 'en' && book?.description_en}
										</p>
									</div>
								</div>
								<div className='flex sm:gap-10 gap-3 flex-wrap'>
									<div className='flex flex-col gap-1'>
										<p className='text-gray-400 text-sm'>
											{t('books.author')}{' '}
										</p>
										<h2 className='text-base font-semibold'>{book?.author}</h2>
									</div>
									<div className='flex flex-col gap-1'>
										<p className='text-gray-400 text-sm'>
											{t('books.publishing')}{' '}
										</p>
										<h2 className='text-base font-semibold'>
											{book?.publication}
										</h2>
									</div>
									<div className='flex flex-col gap-1'>
										<p className='text-gray-400 text-sm'>{t('books.year')} </p>
										<h2 className='text-base font-semibold'>
											{book?.published_date.split('-')[0]}
										</h2>
									</div>
								</div>
								<div className='w-full border border-dashed border-[#00000025]'></div>
								<div className='flex items-center gap-3 flex-wrap'>
									{book?.is_available || reservedBooks ? (
										<button
											className={cn(
												'py-2 px-10 bg-blue-700 text-white font-medium text-base rounded-lg cursor-pointer',
												reservedBooks && 'cursor-none bg-gray-300 text-gray-600'
											)}
											onClick={handleOrder}
											disabled={reservedBooks}
										>
											{reservedBooks ? bookedTakenDate : t('books.busy')}
										</button>
									) : (
										<p className='text-sm text-gray-500 py-4 px-5 border border-solid border-[#00000012] rounded-md'>
											{t('notification.booksbusy')}
										</p>
									)}
									<p
										className={cn(
											'text-sm text-muted-foreground',
											book?.available_count! > 3
												? 'text-black'
												: 'text-orange-500'
										)}
									>
										Qolgan: {book?.available_count} ta
									</p>
								</div>
							</div>
						</div>
					</div>
				)}

				<div className='grid grid-cols-1 md:grid-cols-3 gap-10 mt-10 max-w-[1400px] w-full m-auto sm:px-0 px-3'>
					<div className='md:col-span-2'>
						<div className='flex gap-6 border-b pb-2 text-lg font-medium'>
							<button
								className={cn(
									'flex items-center gap-3 py-1 px-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium  cursor-pointer',
									activeTab === 'tab1' ? 'text-blue-700' : 'text-gray-700'
								)}
								onClick={() => setActiveTab('tab1')}
							>
								{t('books.content')}
							</button>

							<button
								className={cn(
									'flex items-center gap-3 py-1 px-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium  cursor-pointer',
									activeTab === 'tab2' ? 'text-blue-700' : 'text-gray-700'
								)}
								onClick={() => setActiveTab('tab2')}
							>
								{t('books.comments')}
							</button>
						</div>
						<div>
							{activeTab === 'tab1' && <Information />}
							{activeTab === 'tab2' && (
								<BookComment
									bookId={book?.id!}
									score1={book?.rating_by_scores?.['5']?.percentage ?? 0}
									score2={book?.rating_by_scores?.['4']?.percentage ?? 0}
									score3={book?.rating_by_scores?.['3']?.percentage ?? 0}
									score4={book?.rating_by_scores?.['2']?.percentage ?? 0}
									score5={book?.rating_by_scores?.['1']?.percentage ?? 0}
									rating={book?.rating!}
									description={book?.description!}
								/>
							)}
						</div>
					</div>

					<div>
						<h2 className='sm:text-2xl text-xl font-semibold mb-4'>
							{t('books.similarbooks')}
						</h2>
						<div className='flex flex-col gap-3'>
							{loading1
								? [...Array(4)].map((_, i) => (
										<BookCardSkeleton key={i} type='small-rated' />
								  ))
								: book?.related_books.map(item => (
										<BookCard
											key={item.id}
											name={item.name}
											image={item.image || '/assets/book_not_found.png'}
											category={item.category}
											rating={item.rating ?? 0}
											reviews={item.reviews_count}
											type='small-rated'
											link={`/${pathname.split('/')[1]}/books/${item.slug}`}
											count={item.available_count}
											stock={item.stock}
										/>
								  ))}

							{/* <div className='flex items-center '>
							<Button className='mt-4 bg-[#EEF4FF] hover:bg-[#3F51B5] rounded-xl hover:text-white cursor-pointer text-[#3F51B5] sm:w-96 w-full p-6'>
								Ko'proq kitoblar
							</Button>
						</div> */}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default BookDetails
