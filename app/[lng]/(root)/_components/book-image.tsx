import Image from 'next/image'
import { useState } from 'react'

interface IProps {
	src: string
}

const BookImage = ({ src }: IProps) => {
	const [imgSrc, setImgSrc] = useState(src)

	return (
		<Image
			src={imgSrc || '/assets/open-book.png'}
			alt='book'
			width={80}
			height={80}
			className='rounded-md'
			onError={() => setImgSrc('/assets/open-book.png')}
		/>
	)
}

export default BookImage
