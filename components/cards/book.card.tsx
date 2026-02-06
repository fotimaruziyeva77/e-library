import useTranslate from '@/hooks/use-translate'
import { Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import ReactStars from 'react-stars'

interface IProps {
	link: string
	image: string
	name: string
	category?: string
	rating?: number
	description?: string
	author?: string
	publication?: string
	publishedDate?: string
	reviews?: number
	type: 'card' | 'list' | 'small-rated'
	count: number
	stock: number
}

function BookCard({
	link,
	image,
	name,
	category,
	rating,
	type,
	description,
	author,
	publication,
	publishedDate,
	reviews,
	count,
}: IProps) {
	const [imgSrc, setImgSrc] = useState(image)
	const t = useTranslate()
	return (
		<>
			{type === 'card' && (
				<Link
					href={link}
					className='max-w-96 md:w-64 w-full flex flex-col gap-5 bg-white rounded-lg md:p-4 p-2 border border-solid border-[#00000025]'
				>
					<div className='relative w-full h-[250px]  group overflow-hidden rounded-md'>
						<Image
							src={imgSrc}
							alt={'book-image'}
							className='w-full h-64 object-cover group-hover:scale-110 duration-200'
							width={240}
							height={250}
							onError={() => setImgSrc('/assets/open-book.png')}
							loading='lazy'
						/>
					</div>
					<div className='flex flex-col justify-between  gap-2'>
						<div className='flex flex-col'>
							<div className='flex items-center justify-end'>
								{count === 0 && (
									<span className='bg-red-600 text-white text-xs px-2 py-1 rounded'>
										{t('books.notleft')}
									</span>
								)}
								{count > 0 && count <= 3 && (
									<span className='bg-yellow-500 text-white text-xs px-2 py-1 rounded'>
										{t('books.available')} {count}
									</span>
								)}
								{count > 3 && (
									<span className='bg-green-500 text-white text-xs px-2 py-1 rounded'>
										{t('books.available')} {count}
									</span>
								)}
							</div>
							<h3 className='text-base font-semibold line-clamp-2'>{name}</h3>
						</div>
						<div className='flex flex-col'>
							<span className='text-sm  text-blue-600'>{category}</span>
							<span className='flex items-center gap-2 text-amber-600 font-semibold'>
								<Star size={18} fill='oklch(66.6% 0.179 58.318)' />{' '}
								{Math.round(rating!)}
							</span>
						</div>
					</div>
				</Link>
			)}
			{type === 'list' && (
				<Link
					href={link}
					className='w-full flex items-center gap-4 p-4 rounded-lg bg-white'
				>
					<div className='relative w-[200px] h-[250px] group overflow-hidden rounded-md shrink-0'>
						<Image
							src={image}
							alt={'book image'}
							className='w-52 h-64 object-cover group-hover:scale-110 duration-200'
							width={200}
							height={250}
							loading='lazy'
						/>
					</div>

					<div className='flex flex-col gap-5 flex-auto justify-between place-self-stretch'>
						<div className='flex flex-col gap-3'>
							<div className='flex items-start justify-between h-full'>
								<div className='flex flex-col gap-1'>
									<h1 className='font-semibold text-lg line-clamp-2'>{name}</h1>
									<span className='uppercase text-sm text-blue-600'>
										{category}
									</span>
								</div>
								<div className='flex flex-col gap-1'>
									<ReactStars
										count={5}
										value={rating}
										edit={false}
										size={24}
										color2={'#ffd700'}
									/>
									<span className='flex items-center gap-2'>
										<p className='text-base font-semibold'>
											{rating && Math.ceil(rating)}
										</p>
										<p className='text-gray-400 text-sm'>
											{reviews} {t('books.comments')}
										</p>
									</span>
									<div className='flex items-center'>
										{count === 0 && (
											<span className='bg-red-600 text-white text-xs px-2 py-1 rounded'>
												QOLMADI
											</span>
										)}
										{count > 0 && count <= 3 && (
											<span className='bg-yellow-500 text-white text-xs px-2 py-1 rounded'>
												{t('books.available')} {count}
											</span>
										)}
										{count > 3 && (
											<span className='bg-green-500 text-white text-xs px-2 py-1 rounded'>
												{t('books.available')} {count}
											</span>
										)}
									</div>
								</div>
							</div>
							<div className='flex items-center w-full flex-1'>
								<p className='text-sm'>
									{description && description.length > 500
										? `${description.slice(0, 500)}...`
										: description}
								</p>
							</div>
						</div>
						<div className='flex gap-10'>
							<div className='flex flex-col gap-2'>
								<p className='text-gray-400 text-sm'>{t('books.author')}</p>
								<h2 className='text-base font-semibold'>{author}</h2>
							</div>
							<div className='flex flex-col gap-2'>
								<p className='text-gray-400 text-sm'>{t('books.publishing')}</p>
								<h2 className='text-base font-semibold'>{publication}</h2>
							</div>
							<div className='flex flex-col gap-2'>
								<p className='text-gray-400 text-sm'>{t('books.year')}</p>
								<h2 className='text-base font-semibold'>
									{publishedDate?.split('-')[0]}
								</h2>
							</div>
						</div>
					</div>
				</Link>
			)}

			{type === 'small-rated' && (
				<Link
					href={link}
					className='w-full flex flex-row gap-5 bg-white rounded-lg p-4 border border-solid border-[#00000025]'
				>
					<div className='relative w-36 h-[200px] group overflow-hidden rounded-md'>
						<Image
							src={image}
							alt={'book image'}
							className='w-36 h-50 object-cover group-hover:scale-110 duration-200'
							width={150}
							height={200}
							loading='lazy'
						/>
					</div>

					<div className='flex flex-col gap-2'>
						<h3 className='text-lg font-semibold line-clamp-2'>{name}</h3>
						<span className='text-sm text-blue-600'>{category}</span>
						<span className='flex items-center gap-2 text-amber-600 font-semibold'>
							<Star size={18} fill='oklch(66.6% 0.179 58.318)' /> {rating}
							<p className='text-gray-400 text-sm'>
								{reviews} {t('books.comments')}
							</p>
						</span>
						<div>
							{count === 0 && (
								<span className='bg-red-600 text-white text-xs px-2 py-1 rounded'>
									QOLMADI
								</span>
							)}
							{count > 0 && count <= 3 && (
								<span className='bg-yellow-500 text-white text-xs px-2 py-1 rounded'>
									{t('books.available')} {count}
								</span>
							)}
							{count > 3 && (
								<span className='bg-green-500 text-white text-xs px-2 py-1 rounded'>
									{t('books.available')} {count}
								</span>
							)}
						</div>
					</div>
				</Link>
			)}
		</>
	)
}

export default BookCard
