import React, { useEffect, useState } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import axios from 'axios'
import { APISERVICE } from '@/services/api-service'
import Cookies from 'js-cookie'
import useTranslate from '@/hooks/use-translate'
import { BookTypes } from '@/interfaces'

function Information() {
	const [book, setBook] = useState<BookTypes | null>(null)
	const library_id = Cookies.get('library_id')
	const { slug } = useParams()
	const t = useTranslate()
	const pathname = usePathname()
	const router = useRouter()

	useEffect(() => {
		if (!library_id || !slug) return
		const fetchData = async () => {
			try {
				const res = await axios.get(
					`${APISERVICE.books}/${library_id}/${slug}/`
				)
				setBook(res.data)
				console.log('Book data:', res.data)
			} catch (err: any) {
				if (err.response?.status === 404) {
					router.push(`${pathname.slice(0, 3)}/books`)
				} else {
					console.error(err)
				}
			}
		}

		fetchData()
	}, [library_id, slug, pathname, router])

	return (
		<div>
			<div className='flex justify-between border-b border-dotted border-gray-500 py-2'>
				<span>{t('books.isbn')}</span>
				<span className='text-neutral-500 font-medium'>{book?.isbn}</span>
			</div>

			<div className='flex justify-between border-b border-dotted border-gray-500 py-2'>
				<span>{t('books.languages')}</span>
				<span className='text-neutral-500 font-medium'>{book?.language}</span>
			</div>
			<div className='flex justify-between border-b border-dotted border-gray-500 py-2'>
				<span>{t('books.pages')}</span>
				<span className='text-neutral-500 font-medium'>{book?.page_count}</span>
			</div>
			<div className='flex justify-between border-b border-dotted border-gray-500 py-2'>
				<span>{t('books.booknumber')}</span>
				<span className='text-neutral-500 font-medium'>{book?.stock}</span>
			</div>
		</div>
	)
}

export default Information
