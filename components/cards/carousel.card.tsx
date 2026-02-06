import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface IProps {
	link: string
	image: string
	title: string
}

function CarouselCard({ link, image, title }: IProps) {
	const [imgSrc, setImgSrc] = useState(image)
	const pathname = usePathname()

	return (
		<Link
			href={`${pathname}/books/${link}`}
			className='flex flex-col gap-2 w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] shrink-0'
		>
			<div className='relative w-full aspect-[2/3] overflow-hidden rounded-lg group'>
				<Image
					src={imgSrc}
					alt={image.split('.')[0]}
					fill
					sizes='(max-width: 768px) 100vw, 200px'
					onError={() => setImgSrc('/assets/open-book.png')}
					className='object-cover group-hover:scale-105 transition-transform duration-300'
				/>
			</div>
			<p className='text-sm font-semibold text-center line-clamp-2'>{title}</p>
		</Link>
	)
}

export default CarouselCard
