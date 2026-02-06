'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface IProps {
	image: string
	name: string
	link: string
}

function CategoryCard({ image, name, link }: IProps) {
	const [imgSrc, setImgSrc] = useState(image)

	return (
		<Link
			href={link}
			className='relative overflow-hidden rounded-xl w-full h-40 sm:h-48 md:h-56 lg:h-60 xl:h-64 group block'
		>
			<Image
				src={imgSrc}
				alt='category icon'
				fill
				sizes='(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 20vw'
				className='object-cover group-hover:scale-105 transition-transform duration-500'
				onError={() => setImgSrc('/assets/open-book.png')}
			/>

			<div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent flex items-end p-4'>
				<h2 className='text-white text-lg font-semibold truncate w-full'>
					{name}
				</h2>
			</div>
		</Link>
	)
}

export default CategoryCard
