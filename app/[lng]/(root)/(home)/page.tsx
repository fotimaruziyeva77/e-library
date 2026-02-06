'use client'

import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'

import useTranslate from '@/hooks/use-translate'
import { useEffect, useRef, useState } from 'react'
import { BookTypes, CategoryTypes } from '@/interfaces'
import { useParams, usePathname, useRouter } from 'next/navigation'
import axios from 'axios'
import { APISERVICE } from '@/services/api-service'
import BookCard from '@/components/cards/book.card'
import ReactAliceCarousel from 'react-alice-carousel'
import CategoryCard from '@/components/cards/category.card'
import PaginationComponent from '../_components/pagination'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
import CarouselCard from '@/components/cards/carousel.card'
import SecondNavlinks from '../_components/second-navlinks'
import CarouselCardSkeleton from '@/components/cards/carousel.card-sceleton'
import CategoryCardSkeleton from '@/components/cards/category.card-sceleton'
import BookCardSkeleton from '@/components/cards/book.card-sceleton'
import Head from 'next/head'
import Cookies from 'js-cookie'
import { toast } from 'sonner'
import Link from 'next/link'

function Home() {
	const t = useTranslate()
	const [books, setBooks] = useState<BookTypes[]>([])
	const library_id = Cookies.get('library_id')
	const [page, setPage] = useState<number>(1)
	const [totalPages, setTotalPages] = useState<number>(0)
	const pathname = usePathname()
	const carouselRef = useRef<any>(null)
	const handleDragStart = (e: any) => e.preventDefault()
	const [categories, setCategories] = useState<CategoryTypes[]>([])
	const [loader1, setLoader1] = useState(false)
	const [loader2, setLoader2] = useState(false)
	const [loader3, setLoader3] = useState(false)
	const prevRef = useRef(null)
	const nextRef = useRef(null)
	const swiperRef = useRef<any>(null)
	const [mostReadBooks, setMostReadBooks] = useState<BookTypes[]>([])
	const router = useRouter()
	const { lng } = useParams()
	const [libraryId, setLibraryId] = useState<string | null>(null)

	useEffect(() => {
		const id = Cookies.get('library_id')
		if (id) {
			setLibraryId(id)
		}
	}, [])

	useEffect(() => {
		const domain = window.location.host
		const fetchData = async () => {
			await axios
				.get(`${APISERVICE.library}/${domain}/`)
				.then(res => {
					Cookies.set('library_id', res.data.library)
				})
				.catch((err: any) => {
					toast.error(err?.response?.detail, {
						position: 'top-center',
						richColors: true,
					})
					router.push('/intro')
				})
		}
		if (domain !== 'localhost:3000') fetchData()
		if (domain === 'localhost:3000')
			Cookies.set('library_id', 'f236a639-d597-453b-8507-2c8d2e70186b')
		
	}, [router])

	useEffect(() => {
		setLoader1(true)
		const fetchData = async () => {
			try {
				const res = await axios.get(
					`${APISERVICE.books}/${library_id}/?limit=15&offset=${
						15 * (page - 1)
					}`,
					{
						headers: {
							'Accept-Language': lng === 'uz-Cyrl' ? 'cy' : lng,
						},
					}
				)
				setBooks(res.data.results)
				setTotalPages(Math.ceil(res.data.count / 15))
			} catch (err) {
				console.error(err)
			} finally {
				setLoader1(false)
			}
		}

		fetchData()
	}, [page, library_id])

	useEffect(() => {
		setLoader2(true)
		const fetchData = async () => {
			try {
				const res = await axios.get(
					`${APISERVICE.books}/${library_id}/?most_read=true`,
					{
						headers: {
							'Accept-Language': lng === 'uz-Cyrl' ? 'cy' : lng,
						},
					}
				)
				setMostReadBooks(res.data.results)
			} catch (err) {
				console.log(err)
			} finally {
				setLoader2(false)
			}
		}

		fetchData()
	}, [library_id])

	useEffect(() => {
		if (
			swiperRef.current &&
			swiperRef.current.params &&
			swiperRef.current.params.navigation
		) {
			swiperRef.current.params.navigation.prevEl = prevRef.current
			swiperRef.current.params.navigation.nextEl = nextRef.current
			swiperRef.current.navigation.init()
			swiperRef.current.navigation.update()
		}
	}, [books])

	useEffect(() => {
		setLoader3(true)
		const fetchData = async () => {
			await axios
				.get(`${APISERVICE.books}/${library_id}/categories/`, {
					headers: {
						'Accept-Language': lng === 'uz-Cyrl' ? 'cy' : lng,
					},
				})
				.then(res => setCategories(res.data.results))
				.catch(err => console.log(err))
				.finally(() => setLoader3(false))
		}

		fetchData()
	}, [library_id])

	return (
		<div className='mt-18 w-full '>
			<Head>
				<title>Kutubxona | Bepul kitoblar dunyosi</title>
				<meta
					name='description'
					content='Sifatli kitoblar va xizmatlar bilan tanishing.'
				/>
				<meta property='og:title' content='Sifatli kitoblar' />
				<meta
					property='og:description'
					content='Barcha kitoblar hammasi bir joyda!'
				/>
				<meta property='og:image' content='/logo.png' />
			</Head>
			<SecondNavlinks />

			<div className=' mt-2 w-full'>
				<div className='xl:max-w-[1400px] sm:px-5 px-3 xl:px-0 w-full m-auto mb-5'>
					<div className='w-full max-w-[1400px] flex flex-col md:flex-row justify-between gap-4 md:h-[400px] h-screen'>
						<div className='md:bg-[#EEF4FF] rounded-2xl flex md:flex-row flex-col flex-auto md:basis-4/5 basis-3/5 w-full overflow-hidden relative'>
							<div className='relative basis-1/3 flex md:items-start md:justify-start justify-end gap-5 bg-[#EEF4FF] md:bg-none p-3 md:p-0 md:rounded-none rounded-md min-w-80'>
								<h1 className='md:text-3xl text-2xl font-semibold md:p-10 p-3 text-left w-2/3 md:w-full'>
									{t('main.widelyread')}
								</h1>

								<Image
									src={'/person.png'}
									alt='person'
									width={250}
									height={250}
									className='absolute bottom-0 left-0 z-10 md:w-64 md:h-64 w-32 '
								/>
							</div>

							<div className='md:flex-auto md:px-4 px-2 md:py-0 py-2 flex items-center relative overflow-hidden mt-3 h-min bg-[#EEF4FF] md:bg-none rounded-lg'>
								<button
									ref={prevRef}
									className='absolute top-1/2 sm:block hidden left-0 z-10 -translate-y-1/2 p-2 bg-[#3F51B5] hover:text-black text-white rounded-full shadow hover:bg-gray-200 transition cursor-pointer'
								>
									<ChevronLeft size={24} />
								</button>

								<Swiper
									modules={[Navigation]}
									spaceBetween={20}
									slidesPerView={3}
									ref={swiperRef}
									navigation={{
										prevEl: prevRef.current,
										nextEl: nextRef.current,
									}}
									autoplay
									breakpoints={{
										320: { slidesPerView: 2 },
										640: { slidesPerView: 2 },
										1024: { slidesPerView: 3 },
									}}
									className='w-full'
								>
									{loader2
										? [...Array(6)].map((_, i) => (
												<SwiperSlide
													key={i}
													className='!h-auto !flex justify-center'
												>
													<CarouselCardSkeleton />
												</SwiperSlide>
										  ))
										: mostReadBooks.map(book => (
												<SwiperSlide
													key={book.id}
													className='!h-auto !flex justify-center'
												>
													<CarouselCard
														image={book.image}
														title={book.name}
														link={book.slug}
													/>
												</SwiperSlide>
										  ))}
								</Swiper>

								<button
									ref={nextRef}
									className='absolute sm:block hidden top-1/2 right-0 z-10 -translate-y-1/2 p-2 bg-[#3F51B5] hover:text-black text-white rounded-full shadow hover:bg-gray-200 transition'
								>
									<ChevronRight size={24} />
								</button>
							</div>
						</div>

						<div className='w-full md:basis-1/5 basis-2/5 rounded-lg bg-[#3F51B5] text-white relative overflow-hidden'>
							<div className='w-full h-full absolute top-0 left-0 z-10 px-4 md:py-5 py-3 flex flex-col gap-3 items-center text-center'>
								<h2 className='text-2xl md:text-3xl font-semibold'>
									{t('main.maintext')}
								</h2>
								<p className='text-sm md:text-base font-semibold mt-4'>
									{t('main.maindescription')}
								</p>
								{libraryId ? (
									<Link
										href={`https://t.me/sifatlibrary_bot/?start=${libraryId}`}
										className='flex gap-2 items-center px-6 py-3 rounded-xl bg-white text-black text-base mt-6 cursor-pointer hover:bg-gray-200 font-semibold'
									>
										<Heart size={20} />
										{t('main.subscribe')}
									</Link>
								) : (
									<button className='flex gap-2 items-center px-6 py-3 rounded-xl bg-white text-black text-base mt-6 cursor-pointer hover:bg-gray-200 font-semibold'>
										<Heart size={20} />
										{t('main.subscribe')}
									</button>
								)}
							</div>
							<div className='absolute w-full h-full z-0'>
								<Image
									src='/assets/card_mask.png'
									alt='bg'
									width={300}
									height={400}
									className='w-full h-full object-cover'
								/>
							</div>
						</div>
					</div>

					<section>
						<div className='w-full'>
							<div className='flex items-center justify-between'>
								<h1
									id='featured-categories-heading'
									className='md:text-2xl text-xl font-bold my-8'
								>
									{t('navbar.categories')}
								</h1>

								<div className='flex items-center gap-4'>
									<button
										onClick={() => carouselRef.current?.slidePrev()}
										className='w-8 h-8 rounded-full bg-[#3F51B5] text-white cursor-pointer aspect-square flex items-center justify-center'
									>
										<ChevronLeft size={16} />{' '}
									</button>
									<button
										onClick={() => carouselRef.current?.slideNext()}
										className='w-8 h-8 rounded-full bg-[#3F51B5] text-white cursor-pointer aspect-square flex items-center justify-center'
									>
										<ChevronRight size={16} />{' '}
									</button>
								</div>
							</div>
							<div className='flex items-center gap-4'>
								<ReactAliceCarousel
									mouseTracking
									ref={carouselRef}
									disableDotsControls
									disableButtonsControls
									infinite
									autoPlay
									animationDuration={500}
									animationType='fadeout'
									autoPlayInterval={2000}
									responsive={{
										0: { items: 1 },
										1140: { items: 4 },
										1400: { items: 6 },
									}}
									items={
										loader3
											? [...Array(6)].map((_, i) => (
													<div
														key={i}
														onDragStart={handleDragStart}
														className='mx-4'
													>
														<CategoryCardSkeleton />
													</div>
											  ))
											: categories.map(item => (
													<div
														key={item.id}
														onDragStart={handleDragStart}
														className='mx-4'
													>
														<CategoryCard
															image={item.icon ?? ''}
															link={`/${lng}/books?category=${item.slug}`}
															name={item.name ?? ''}
														/>
													</div>
											  ))
									}
								/>
							</div>
						</div>
					</section>

					<section aria-labelledby='new-arrivals-heading'>
						<div className='mx-auto mt-10'>
							<h2
								id='new-arrivals-heading'
								className='md:text-2xl text-xl font-bold my-4'
							>
								{t('main.newadditions')}
							</h2>
							<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5'>
								{loader1
									? [...Array(15)].map((_, i) => (
											<BookCardSkeleton key={i} type='card' />
									  ))
									: books.map(book => (
											<BookCard
												key={book.id}
												type='card'
												image={book.image}
												name={book.name}
												link={`${pathname}/books/${book.slug}`}
												rating={book.rating}
												category={book.category}
												count={book.available_count}
												stock={book.stock}
											/>
									  ))}
							</div>

							<PaginationComponent
								page={page}
								setPage={setPage}
								totalPages={totalPages}
							/>
						</div>
					</section>
				</div>
			</div>
		</div>
	)
}

export default Home
