'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Inbox, LayoutGrid, Search, Star } from 'lucide-react'
import AuthDialog from './auth'
import UserManagment from './user-management'
import useAuth from '@/hooks/use-auth'
import { useEffect, useState } from 'react'
import { BookTypes, CategoryTypes } from '@/interfaces'
import axios from 'axios'
import { APISERVICE } from '@/services/api-service'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
	useParams,
	usePathname,
	useRouter,
	useSearchParams,
} from 'next/navigation'
import useTranslate from '@/hooks/use-translate'
import LanguageDropdown from './language-dropdown'
import Cookies from 'js-cookie'

export default function Navbar() {
	const [open, setOpen] = useState(false)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const { data } = useAuth()
	const [categories, setCategories] = useState<CategoryTypes[]>([])
	const library_id = Cookies.get('library_id')
	const [selectedCategory, setSelectedCategory] =
		useState<CategoryTypes | null>(null)
	const [books, setBooks] = useState<BookTypes[]>([])
	const [keyword, setKeyword] = useState('')
	const router = useRouter()
	const searchParams = useSearchParams()
	const categoryIdFromQuery = searchParams.get('category')
	const modeFromQuery = searchParams.get('mode')
	const pathname = usePathname()
	const t = useTranslate()
	const { lng } = useParams()

	useEffect(() => {
		setKeyword('')
	}, [pathname])

	useEffect(() => {
		if (modeFromQuery === 'auth') {
			setOpen(true)
		}
	}, [modeFromQuery])

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

	useEffect(() => {
		setIsAuthenticated(data !== null)
	}, [data])

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await axios.get(
					`${APISERVICE.books}/${library_id}/?search=${keyword}`
				)
				setBooks(res.data.results)
			} catch (err) {
				console.error(err)
			}
		}

		fetchData()
	}, [library_id, keyword])

	const onCategoryChange = (value: string) => {
		const params = new URLSearchParams(Array.from(searchParams.entries()))
		if (!value) {
			params.delete('category')
			router.push(`/${lng}/books?${params.toString()}`)
			setSelectedCategory(null)
		} else {
			params.set('category', value)
			router.push(`/${lng}/books?${params.toString()}`)
		}
	}

	return (
		<nav className='fixed top-0 left-0 right-0 z-50 py-2 bg-white w-full shadow md:flex hidden'>
			<div className='max-w-[1400px] w-full m-auto flex items-center justify-between gap-14'>
				<Link href={`/${lng}/`} className='flex items-center gap-3'>
					<div className='w-14 h-14'>
						<Image
							src='/assets/logo.png'
							alt='Sifat Library'
							width={56}
							height={56}
							className='w-full h-full object-contain'
						/>
					</div>
					<div className='flex flex-col'>
						<span className='font-semibold text-xl sm:text-base md:text-lg'>
							Sifat Library
						</span>
						<span className='text-xs'>{t('navbar.subtitle')}</span>
					</div>
				</Link>

				<div className='flex items-center gap-1 flex-auto'>
					<div className='flex items-center gap-1 flex-auto w-auto'>
						<div className='rounded-tl-xl rounded-bl-xl border-[1.5px] border-black/15'>
							<Select
								value={selectedCategory ? String(selectedCategory.slug) : ''}
								onValueChange={onCategoryChange}
							>
								<SelectTrigger className='w-[220px] text-[#3F51B5] border-none flex items-center gap-2'>
									{selectedCategory ? (
										<>
											<Image
												src={selectedCategory.icon!}
												alt='icon'
												width={24}
												height={24}
												className='w-6 h-6 rounded-md object-cover'
											/>
											<span className='text-sm font-medium text-black'>
												{selectedCategory.name}
											</span>
										</>
									) : (
										<>
											<LayoutGrid className='text-[#3F51B5]' />
											<span className='text-sm font-medium text-[#3F51B5]'>
												{t('navbar.categories')}
											</span>
										</>
									)}
								</SelectTrigger>

								<SelectContent className='bg-white max-h-64 overflow-y-auto'>
									{Array.isArray(categories) &&
										categories.map(cty => (
											<SelectItem
												key={cty.id}
												value={String(cty.slug)}
												className='hover:text-[#3F51B5] cursor-pointer'
											>
												<div className='flex items-center gap-2'>
													<Image
														src={cty.icon!}
														alt='icon'
														width={50}
														height={50}
														className='w-12 h-12 aspect-square rounded-md object-cover'
													/>
													<p className='font-semibold text-sm'>{cty.name}</p>
												</div>
											</SelectItem>
										))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className='flex items-center rounded-tr-xl rounded-br-xl border-[1.5px] border-solid border-[#00000025] overflow-hidden bg-[#fafafa] flex-auto w-full relative'>
						<Input
							type='text'
							placeholder={t('navbar.search')}
							className='flex-1 border-none ring-0 shadow-none py-0 h-auto placeholder:text-[#ccc]'
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
				<div className='flex items-center gap-2'>
					<div className='bg-blue-50 rounded-xl overflow-hidden'>
						<LanguageDropdown />
					</div>
					{isAuthenticated ? (
						<UserManagment />
					) : (
						<button
							className='px-4 py-2 text-sm bg-[#3F51B5] hover:bg-[#3F51B5] text-white rounded-xl cursor-pointer'
							onClick={() => setOpen(true)}
						>
							{t('navbar.login')}
						</button>
					)}

					<AuthDialog open={open} setOpen={setOpen} />
				</div>
			</div>
			{keyword.length > 0 && (
				<div className='absolute top-14 shadow-lg border border-solid border-[#00000012] left-1/2 -translate-x-1/3 w-[650px] m-auto max-h-96 bg-white z-50 p-5 rounded-md flex flex-col gap-2 overflow-y-auto custom-scrollbar'>
					{books.map(item => (
						<Link
							key={item.id}
							href={`${pathname.slice(0, 3)}/books/${encodeURIComponent(
								item.slug
							)}`}
							className='flex items-center gap-3'
						>
							<div className='w-20 h-24 rounded-md overflow-hidden'>
								<Image
									src={item.image}
									alt='image'
									width={80}
									height={100}
									className='w-full h-full aspect-auto'
									loading='lazy'
								/>
							</div>
							<div className='flex flex-col gap-4 flex-auto'>
								<div className='flex flex-col gap-1'>
									<div className='flex items-center justify-between'>
										<h1 className='text-lg font-semibold'>{item.name}</h1>
									</div>
									<div className='flex items-center justify-between'>
										<p className='text-sm font-semibold'>
											{item.published_date.split('-')[0]}
										</p>
									</div>
									<div className='flex items-center justify-between'>
										<h2 className='text-[12px] text-blue-700 uppercase'>
											{item.category}
										</h2>
										<span className='flex items-center gap-2 text-amber-600 font-semibold'>
											<Star size={18} fill='oklch(66.6% 0.179 58.318)' />{' '}
											{item.rating}
										</span>
									</div>
								</div>
							</div>
						</Link>
					))}
					{books.length === 0 && (
						<p className='text-gray-500 font-medium text-sm text-center shadow-none p-0 flex items-center justify-center gap-2'>
							<Inbox color='gray' size={24} />
							{t('notfound.profilenotfound')}
						</p>
					)}
				</div>
			)}
		</nav>
	)
}
