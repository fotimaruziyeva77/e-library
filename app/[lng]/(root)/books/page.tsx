'use client'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { BookTypes, CategoryTypes } from '@/interfaces'
import { APISERVICE } from '@/services/api-service'
import axios from 'axios'
import {
	ArrowDownNarrowWideIcon,
	LayoutDashboard,
	LayoutGrid,
	LayoutList,
	Menu,
	RotateCcw,
	Search,
	Star,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import BookCard from '@/components/cards/book.card'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import useTranslate from '@/hooks/use-translate'
import BookCardSkeleton from '@/components/cards/book.card-sceleton'
import PaginationComponent from '../_components/pagination'
import Cookies from 'js-cookie'
import { toast } from 'sonner'

function Book() {
	const [books, setBooks] = useState<BookTypes[]>([])
	const [categories, setCategories] = useState<CategoryTypes[]>([])
	const library_id = Cookies.get('library_id')
	const [viewType, setViewType] = useState<'card' | 'list' | 'small-rated'>(
		'card'
	)
	const [orderType, setOrderType] = useState('id')
	const [rating, setRating] = useState('')
	const [date, setDate] = useState('')
	const searchParams = useSearchParams()
	const category = searchParams.get('category')
	const currentPage = searchParams.get('page')
	const [page, setPage] = useState<number>(Number(currentPage) ?? 1)
	const [totalPages, setTotalPages] = useState<number>(0)
	const [isLoading, setIsLoading] = useState(false)
	const t = useTranslate()
	const { lng } = useParams()
	const categoryIdFromQuery = searchParams.get('category')
	const [selectedCategory, setSelectedCategory] =
		useState<CategoryTypes | null>(null)
	const [keyword, setKeyword] = useState('')
	const router = useRouter()

	useEffect(() => {
		if (!categoryIdFromQuery) {
			setSelectedCategory(null)
			return
		}
		const found =
			categories.find(cty => String(cty.slug) === categoryIdFromQuery) || null
		setSelectedCategory(found)
	}, [categoryIdFromQuery, categories])

	useEffect(() => {
		const fetchData = async () => {
			await axios
				.get(`${APISERVICE.books}/${library_id}/categories/`, {
					headers: {
						'Accept-Language': lng === 'uz-Cyrl' ? 'cy' : lng,
					},
				})
				.then(res => setCategories(res.data.results))
				.catch(err => console.log(err))
		}

		fetchData()
	}, [library_id])

	const onCategoryChange = (value: string) => {
		const searchParams = new URLSearchParams(window.location.search)

		if (!value) {
			searchParams.delete('category')
		} else {
			searchParams.set('category', value)
		}

		const newQuery = searchParams.toString()
		const newUrl = `${window.location.pathname}?${newQuery}`

		router.replace(newUrl)
	}

	useEffect(() => {
		setIsLoading(true)
		const fetchData = async () => {
			try {
				const categoryQuery = category ? category : ''
				const pageQuery = currentPage ? page : 1
				console.log(pageQuery)
				const res = await axios.get(
					`${
						APISERVICE.books
					}/${library_id}/?ordering=${orderType}&rating=${rating}&year=${date}&search=${keyword}&category=${categoryQuery}&limit=12&offset=${
						12 * (pageQuery - 1)
					}`
				)
				setBooks(res.data.results)

				setTotalPages(Math.ceil(res.data.count / 12))
			} catch (error: any) {
				if (axios.isAxiosError(error) && error.response?.data) {
					const errors = error.response.data

					if (Array.isArray(errors)) {
						errors.forEach((msg: string) => {
							toast.error(msg, {
								position: 'top-center',
								richColors: true,
							})
						})
					} else if (typeof errors === 'string') {
						toast.error(errors, {
							position: 'top-center',
							richColors: true,
						})
					} else if (typeof errors === 'object') {
						for (const key in errors) {
							if (Array.isArray(errors[key])) {
								errors[key].forEach((msg: string) => {
									toast.error(msg, {
										position: 'top-center',
										richColors: true,
									})
								})
							} else if (typeof errors[key] === 'string') {
								toast.error(errors[key], {
									position: 'top-center',
									richColors: true,
								})
							}
						}
					}
				} else {
					toast.error(t('notification.unknownServerError'), {
						position: 'top-center',
						richColors: true,
					})
					console.error('Unknown error:', error)
				}
			} finally {
				setIsLoading(false)
			}
		}

		fetchData()
	}, [
		library_id,
		orderType,
		rating,
		date,
		page,
		category,
		currentPage,
		keyword,
		selectedCategory,
	])

	useEffect(() => {
		const fetchData = async () => {
			await axios
				.get(`${APISERVICE.books}/${library_id}/categories/`)
				.then(res => {
					setCategories(res.data.results)
					console.log(categories)
				})
				.catch(err => console.log(err))
		}

		fetchData()
	}, [library_id])

	const handleReset = (mode: string) => {
		setDate('')
		setRating('')
		setKeyword('')
		setSelectedCategory(null)
		const params = new URLSearchParams(searchParams.toString())
		params.delete('category')

		const newQuery = params.toString()
		const newUrl = `${window.location.pathname}?${newQuery}`

		router.replace(newUrl)
		if (mode == 'mobile') setOrderType('id')
	}

	return (
		<div className='min-h-screen h-full sm:py-18 py-14 w-full bg-gray-50'>
			<div className='w-full bg-white py-3 px-3 sm:px-0 border border-solid border-[#00000025] sm:border-none'>
				<Breadcrumb className='max-w-[1400px] m-auto'>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink
								href={`/${lng}/`}
								className='text-[#3F51B5] text-base font-semibold'
							>
								{t('nav-link.homepage')}
							</BreadcrumbLink>
						</BreadcrumbItem>
						<span>/</span>
						<BreadcrumbItem>
							<BreadcrumbPage className='text-base font-semibold text-gray-500'>
								{t('nav-link.books')}
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
			<div className='m-auto w-full max-w-[1400px] flex flex-col items-center'>
				<div className='w-full flex sm:mt-5'>
					<div className='basis-1/5 mt-[110px] bg-transparent sm:flex hidden flex-col gap-4'>
						<Accordion
							type='multiple'
							className='px-3 rounded-lg bg-white border border-solid border-[#00000012]'
						>
							<AccordionItem value='item-1'>
								<AccordionTrigger className='font-semibold cursor-pointer text-base'>
									{t('books.booksyearsfilter')}
								</AccordionTrigger>
								<AccordionContent className='flex flex-col gap-2 p-1'>
									<Input value={date} onChange={e => setDate(e.target.value)} />
								</AccordionContent>
							</AccordionItem>
						</Accordion>
						<Accordion
							type='multiple'
							className='px-3 rounded-lg bg-white border border-solid border-[#00000012]'
						>
							<AccordionItem value='item-1'>
								<AccordionTrigger className='font-semibold cursor-pointer text-base'>
									{t('books.booksratingfilter')}
								</AccordionTrigger>
								<AccordionContent className='flex flex-col gap-2'>
									<div
										className='flex items-center gap-3'
										onClick={() => setRating('5')}
									>
										<Input
											type='radio'
											name='rate'
											className='w-4'
											id='star_5'
											readOnly
											checked={rating === '5'}
										/>
										<Label htmlFor='star_5' className='text-base'>
											<Star
												size={18}
												fill='oklch(66.6% 0.179 58.318)'
												className='text-orange-400'
											/>
											<Star
												size={18}
												fill='oklch(66.6% 0.179 58.318)'
												className='text-orange-400'
											/>
											<Star
												size={18}
												fill='oklch(66.6% 0.179 58.318)'
												className='text-orange-400'
											/>
											<Star
												size={18}
												fill='oklch(66.6% 0.179 58.318)'
												className='text-orange-400'
											/>
											<Star
												size={18}
												fill='oklch(66.6% 0.179 58.318)'
												className='text-orange-400'
											/>
										</Label>
									</div>
									<div
										className='flex items-center gap-3'
										onClick={() => setRating('4')}
									>
										<Input
											type='radio'
											name='rate'
											className='w-4'
											id='star_4'
											readOnly
											checked={rating === '4'}
										/>
										<Label htmlFor='star_4' className='text-base'>
											<Star
												size={18}
												fill='oklch(66.6% 0.179 58.318)'
												className='text-orange-400'
											/>
											<Star
												size={18}
												fill='oklch(66.6% 0.179 58.318)'
												className='text-orange-400'
											/>
											<Star
												size={18}
												fill='oklch(66.6% 0.179 58.318)'
												className='text-orange-400'
											/>
											<Star
												size={18}
												fill='oklch(66.6% 0.179 58.318)'
												className='text-orange-400'
											/>
											<Star size={18} className='text-gray-300 fill-gray-200' />
										</Label>
									</div>
									<div
										className='flex items-center gap-3'
										onClick={() => setRating('3')}
									>
										<Input
											type='radio'
											name='rate'
											className='w-4'
											id='star_3'
											readOnly
											checked={rating === '3'}
										/>
										<Label htmlFor='star_3' className='text-base'>
											<Star
												size={18}
												fill='oklch(66.6% 0.179 58.318)'
												className='text-orange-400'
											/>
											<Star
												size={18}
												fill='oklch(66.6% 0.179 58.318)'
												className='text-orange-400'
											/>
											<Star
												size={18}
												fill='oklch(66.6% 0.179 58.318)'
												className='text-orange-400'
											/>
											<Star size={18} className='text-gray-300 fill-gray-200' />
											<Star size={18} className='text-gray-300 fill-gray-200' />
										</Label>
									</div>
									<div
										className='flex items-center gap-3'
										onClick={() => setRating('2')}
									>
										<Input
											type='radio'
											name='rate'
											className='w-4'
											id='star_2'
											readOnly
											checked={rating === '2'}
										/>
										<Label htmlFor='star_2' className='text-base'>
											<Star
												size={18}
												fill='oklch(66.6% 0.179 58.318)'
												className='text-orange-400'
											/>
											<Star
												size={18}
												fill='oklch(66.6% 0.179 58.318)'
												className='text-orange-400'
											/>
											<Star size={18} className='text-gray-300 fill-gray-200' />
											<Star size={18} className='text-gray-300 fill-gray-200' />
											<Star size={18} className='text-gray-300 fill-gray-200' />
										</Label>
									</div>
									<div
										className='flex items-center gap-3'
										onClick={() => setRating('1')}
									>
										<Input
											type='radio'
											name='rate'
											className='w-4'
											id='star_1'
											readOnly
											checked={rating === '1'}
										/>
										<Label htmlFor='star_1' className='text-base'>
											<Star
												size={18}
												fill='oklch(66.6% 0.179 58.318)'
												className='text-orange-400'
											/>
											<Star size={18} className='text-gray-300 fill-gray-200' />
											<Star size={18} className='text-gray-300 fill-gray-200' />
											<Star size={18} className='text-gray-300 fill-gray-200' />
											<Star size={18} className='text-gray-300 fill-gray-200' />
										</Label>
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
						<Button
							className='w-full mt-4 bg-blue-500 cursor-pointer text-md font-semibold hover:bg-blue-500 text-white'
							onClick={() => handleReset('desktop')}
						>
							{t('books.clearbooks')}
						</Button>
					</div>

					<div className='sm:basis-4/5 sm:p-4 p-0 m-auto w-full'>
						<div className='w-full m-auto'>
							<div className='w-full sm:p-4 py-2 '>
								<div className='w-full px-1 sm:px-0'>
									<div className='flex justify-between bg-white rounded-md border border-solid border-[#00000012] p-2 sm:px-5 mb-6 items-center'>
										<h2 className='text-xl font-semibold sm:block hidden'>
											{t('nav-link.books')}
										</h2>
										<div className='sm:flex sm:flex-row sm:justify-end grid grid-cols-2 w-full sm:gap-6 gap-3 items-center'>
											<div className='p-1 bg-neutral-100/75 rounded-md sm:flex hidden items-center gap-2'>
												<span
													className={cn(
														viewType == 'list' &&
															'text-blue-500 bg-neutral-200/75',
														'cursor-pointer p-1 rounded-sm'
													)}
												>
													<Menu onClick={() => setViewType('list')} />
												</span>
												<span
													className={cn(
														viewType == 'small-rated' &&
															'text-blue-500 bg-neutral-200/75',
														'cursor-pointer p-1 rounded-sm'
													)}
												>
													<LayoutList
														onClick={() => setViewType('small-rated')}
													/>
												</span>
												<span
													className={cn(
														viewType == 'card' &&
															'text-blue-500 bg-neutral-200/75',
														'cursor-pointer p-1 rounded-sm'
													)}
												>
													<LayoutDashboard
														onClick={() => setViewType('card')}
													/>
												</span>
											</div>

											<Select
												onValueChange={value => setOrderType(value)}
												value={orderType}
											>
												<SelectTrigger className='sm:w-[200px] w-full border border-solid border-[#00000025]'>
													<ArrowDownNarrowWideIcon className='mr-2 h-6 w-8' />
													<SelectValue placeholder={t('books.idbooks')} />
												</SelectTrigger>
												<SelectContent className='bg-white'>
													<SelectItem value='id'>
														{t('books.idbooks')}
													</SelectItem>
													<SelectItem value='published_date'>
														{t('books.release_date')}
													</SelectItem>
													<SelectItem value='created_at'>
														{t('books.added_date')}
													</SelectItem>
												</SelectContent>
											</Select>

											<Input
												value={date}
												onChange={e => setDate(e.target.value)}
												placeholder="Yil bo'yicha qidirish"
												className='placeholder:text-sm max-w-64 sm:hidden flex border border-solid border-[#00000012]'
											/>

											<div className='flex flex-col col-span-2 sm:hidden'>
												<div className='flex flex-col gap-1'>
													<div className='rounded-md border-[1.5px] border-black/15'>
														<Select
															value={
																selectedCategory
																	? String(selectedCategory.slug)
																	: ''
															}
															onValueChange={onCategoryChange}
														>
															<SelectTrigger className='w-full text-[#3F51B5] border-none flex items-center gap-2 bg-[#fafafa]'>
																{selectedCategory ? (
																	<div className='flex items-center justify-start gap-3'>
																		{selectedCategory.icon ? (
																			<Image
																				src={selectedCategory.icon}
																				alt='icon'
																				width={24}
																				height={24}
																				className='w-6 h-6 rounded-md object-cover'
																			/>
																		) : (
																			<LayoutGrid className='text-[#3F51B5]' />
																		)}
																		<span className='text-sm font-medium text-black'>
																			{selectedCategory.name}
																		</span>
																	</div>
																) : (
																	<div className='flex items-center gap-3'>
																		<LayoutGrid className='text-[#3F51B5]' />
																		<span className='text-sm font-medium text-[#3F51B5]'>
																			{t('navbar.categories')}
																		</span>
																	</div>
																)}
															</SelectTrigger>

															<SelectContent className='bg-white max-h-64 overflow-y-auto border border-solid border-[#00000025]'>
																{categories.map(cty => (
																	<SelectItem
																		key={cty.id}
																		value={String(cty.slug)}
																		className='hover:text-[#3F51B5] cursor-pointer'
																	>
																		<div className='flex items-center gap-2'>
																			{cty.icon ? (
																				<Image
																					src={cty.icon}
																					alt='icon'
																					width={24}
																					height={24}
																					className='w-6 h-6 rounded-md object-cover'
																				/>
																			) : (
																				<LayoutGrid className='text-[#3F51B5]' />
																			)}
																			<p className='font-semibold text-sm'>
																				{cty.name}
																			</p>
																		</div>
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													</div>
													<div className='flex flex-col gap-1'>
														<div className='flex items-center rounded-md border border-solid border-[#00000025] overflow-hidden bg-[#fafafa] w-full relative mt-2'>
															<Input
																type='text'
																placeholder={t('navbar.search')}
																className='flex-1 border-none ring-0 shadow-none py-0 h-auto placeholder:text-[#ccc] placeholder:text-sm'
																value={keyword}
																onChange={e => setKeyword(e.target.value)}
															/>
															<Button
																variant='ghost'
																className='px-5 border-l-[1.5px] border-solid border-[#00000025] rounded-none cursor-pointer'
															>
																<Search className='w-4 h-4' />
															</Button>
														</div>
													</div>
												</div>
											</div>
											<div className='sm:hidden w-full col-span-2 flex items-center gap-3 '>
												<Select
													onValueChange={value => setRating(value)}
													value={rating}
												>
													<SelectTrigger className='basis-5/6 border border-solid border-[#00000025]'>
														<SelectValue
															placeholder={t('books.booksratingfilter')}
														/>
													</SelectTrigger>
													<SelectContent className='bg-white'>
														<SelectItem value='5'>
															{[1, 2, 3, 4, 5].map(i => (
																<Star
																	key={i}
																	size={18}
																	fill='oklch(66.6% 0.179 58.318)'
																	className='text-orange-400 inline'
																/>
															))}
														</SelectItem>
														<SelectItem value='4'>
															{[1, 2, 3, 4].map(i => (
																<Star
																	key={i}
																	size={18}
																	fill='oklch(66.6% 0.179 58.318)'
																	className='text-orange-400 inline'
																/>
															))}
															<Star
																size={18}
																className='text-gray-300 fill-gray-200 inline'
															/>
														</SelectItem>
														<SelectItem value='3'>
															{[1, 2, 3].map(i => (
																<Star
																	key={i}
																	size={18}
																	fill='oklch(66.6% 0.179 58.318)'
																	className='text-orange-400 inline'
																/>
															))}
															{[1, 2].map(i => (
																<Star
																	key={i + 3}
																	size={18}
																	className='text-gray-300 fill-gray-200 inline'
																/>
															))}
														</SelectItem>
														<SelectItem value='2'>
															{[1, 2].map(i => (
																<Star
																	key={i}
																	size={18}
																	fill='oklch(66.6% 0.179 58.318)'
																	className='text-orange-400 inline'
																/>
															))}
															{[1, 2, 3].map(i => (
																<Star
																	key={i + 2}
																	size={18}
																	className='text-gray-300 fill-gray-200 inline'
																/>
															))}
														</SelectItem>
														<SelectItem value='1'>
															<Star
																size={18}
																fill='oklch(66.6% 0.179 58.318)'
																className='text-orange-400 inline'
															/>
															{[1, 2, 3, 4].map(i => (
																<Star
																	key={i + 1}
																	size={18}
																	className='text-gray-300 fill-gray-200 inline'
																/>
															))}
														</SelectItem>
													</SelectContent>
												</Select>
												<button
													className='border border-solid border-[#00000025] basis-1/6 py-[5px] flex items-center justify-center rounded-md'
													onClick={() => handleReset('mobile')}
												>
													<RotateCcw className='text-neutral-400' />
												</button>
											</div>
										</div>
									</div>
								</div>

								<div
									className={cn(
										'gap-4 w-full',
										viewType === 'card' &&
											'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2  xl:grid-cols-4 px-1 sm:px-0',
										viewType === 'small-rated' &&
											'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 px-1 sm:px-0',
										viewType === 'list' && 'flex flex-col'
									)}
								>
									{isLoading
										? [...Array(12)].map((_, i) => (
												<BookCardSkeleton key={i} type={viewType} />
										  ))
										: books.map(book => (
												<BookCard
													type={viewType}
													key={book.id}
													image={book.image}
													link={`/${lng}/books/${book.slug}`}
													name={book.name}
													category={book.category}
													rating={book.rating}
													author={book.author}
													description={book.description}
													publication={book.publication}
													publishedDate={book.published_date}
													reviews={book.reviews_count}
													count={book.available_count}
													stock={book.stock}
												/>
										  ))}
								</div>

								{books.length === 0 && (
									<div className='w-full  py-24 flex items-center justify-center'>
										<div className='flex flex-col gap-5 items-center'>
											<Image
												src={'/assets/book_not_found.png'}
												alt='image'
												width={250}
												height={150}
												className='w-64 h-36 aspect-video'
											/>
											<p className='text-gray-400 text-sm'>
												{t('notfound.message')}
											</p>
										</div>
									</div>
								)}
								<PaginationComponent
									page={page}
									setPage={setPage}
									totalPages={totalPages}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
export default Book
