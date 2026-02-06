import { BookTypes, ReservedBookTypes } from '@/interfaces'
import { APISERVICE } from '@/services/api-service'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import Image from 'next/image'
import useTranslate from '@/hooks/use-translate'
import BookCard from '@/components/cards/book.card'
import { useParams } from 'next/navigation'

function UserBooks() {
	const library_id = Cookies.get('library_id')
	const token = Cookies.get('access')
	const [books, setBooks] = useState<BookTypes[]>([])
	const t = useTranslate()
	const { lng } = useParams()
	useEffect(() => {
		const fetchData = async () => {
			await axios
				.get(`${APISERVICE.books}/${library_id}/reserve-book/`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then(res => {
					const savedBooks = res.data.results
						.filter((item: ReservedBookTypes) => item.status === 'taken')
						.map((item: ReservedBookTypes) => item.book)
					setBooks(savedBooks)
				})
		}
		if (token) fetchData()
	}, [library_id, token])

	return (
		<div>
			<div className='bg-white rounded-xl p-6 flex flex-col gap-4'>
				<div className='w-full'>
					{books.length > 0 ? (
						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-10'>
							{books.map(book => (
								<BookCard
									key={book.id}
									image={book.image}
									link={`${lng}/books/${book.slug}`}
									name={book.name}
									type='card'
									author={book.author}
									category={book.category}
									description={book.description}
									publication={book.publication}
									publishedDate={book.published_date}
									rating={book.rating}
									reviews={book.reviews_count}
									count={book.available_count}
									stock={book.stock}
								/>
							))}
						</div>
					) : (
						<div className='w-full py-24 flex items-center justify-center'>
							<div className='flex flex-col ml-12 gap-5 items-center w-full'>
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
			</div>
		</div>
	)
}

export default UserBooks
