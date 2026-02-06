'use client'

import { ContactTypes } from '@/interfaces'
import { APISERVICE } from '@/services/api-service'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {
	FaFacebook,
	FaInstagram,
	FaTelegram,
	FaTwitter,
	FaYoutube,
} from 'react-icons/fa'
import Cookies from 'js-cookie'
import useTranslate from '@/hooks/use-translate'

function Footer() {
	const library_id = Cookies.get('library_id')
	const [data, setData] = useState<ContactTypes>()
	const t=useTranslate()
	useEffect(() => {
		const fetchData = async () => {
			await axios
				.get(`${APISERVICE.about}/${library_id}/`)
				.then(res => setData(res.data))
				.catch(err => console.log(err))
		}

		fetchData()
	}, [library_id])

	return (
		<footer className='bg-gray-900 text-white w-full   p-6'>
			<div className='flex flex-col md:flex-row w-full justify-between gap-6 max-w-[1400px] m-auto'>
				<div className='flex flex-col gap-3'>
					<h3 className='text-xl font-semibold'>{t('footer.browser')}</h3>
					<div className='flex gap-5 text-gray-400 hover:text-gray-300'>
						<Link href={data?.facebook ?? 'https://www.instagram.com/sifat_up/'}>
							<FaFacebook size={24} className='cursor-pointer' />
						</Link>
						<Link href={data?.youtube ?? 'https://www.instagram.com/sifat_up/'}>
							<FaYoutube size={24} className='cursor-pointer' />
						</Link>
						<Link href={data?.twitter ?? 'https://www.instagram.com/sifat_up/'}>
							<FaTwitter size={24} className='cursor-pointer' />
						</Link>
						<Link href={data?.telegram ?? 'https://www.instagram.com/sifat_up/'}>
							<FaTelegram size={24} className='cursor-pointer' />
						</Link>
						<Link href={data?.instagram ?? 'https://www.instagram.com/sifat_up/'}>
							<FaInstagram size={24} className='cursor-pointer' />
						</Link>
					</div>
				</div>

				<div className='flex flex-col'>
					<h2 className='text-xl font-semibold'>{t('footer.callme')}</h2>
					<p className='text-gray-400'>{data?.phone1}</p>
					<p className='text-gray-400'>{data?.email}</p>
				</div>
			</div>
		</footer>	
	)
}

export default Footer
