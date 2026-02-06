'use client'

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { ContactTypes } from '@/interfaces'
import { APISERVICE } from '@/services/api-service'
import axios from 'axios'
import useTranslate from '@/hooks/use-translate'
import Image from 'next/image'
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
import { useParams } from 'next/navigation'

function Page() {
	const library_id = Cookies.get('library_id')
	const [data, setData] = useState<ContactTypes>()
	const { lng } = useParams()

	useEffect(() => {
		const fetchData = async () => {
			await axios
				.get(`${APISERVICE.about}/${library_id}/`, {
					headers: {
						'Accept-Language': lng === 'uz-Cyrl' ? 'cy' : lng,
					},
				})
				.then(res => setData(res.data))
				.catch(err => console.log(err))
		}

		fetchData()
	}, [library_id])

	const t = useTranslate()
	return (
		<div className='min-h-screen h-full sm:py-18 py-14 w-full'>
			<div className='w-full bg-white py-3 sm:border-none border-y border-solid border-[#00000025] sm:px-0 px-3'>
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
								{t('nav-link.contacts')}
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>

			<div className='max-w-[1400px] m-auto w-full sm:py-6 py-3 px-3 sm:px-0'>
				<div className='flex  flex-col lg:flex-row gap-6 items-center lg:items-start'>
					<Image
						src={data?.image || "/hissa_qo'shish.png"}
						alt='Kutubxona'
						width={400}
						height={550}
						className='rounded-lg object-cover'
					/>

					<div className='p-0 md:p-8 rounded-lg w-full flex flex-col gap-5'>
						<h2 className='text-2xl font-semibold '>{data?.title}</h2>
						<div className='flex items-start flex-wrap md:gap-20 gap-5'>
							<div>
								<h2 className='text-[#AAAAAA]'>{t('common.location')}</h2>
								<p>{data?.address}</p>
							</div>
							<div>
								<h2 className='text-[#AAAAAA]'>{t('common.phone')}</h2>
								<p>{data?.phone1}</p>
								<p>{data?.phone2}</p>
							</div>
							<div>
								<h2 className='text-[#AAAAAA]'>{t('common.email')}</h2>
								<p>{data?.email}</p>
							</div>
						</div>
						<div className='flex flex-col gap-4'>
							<h1 className='text-md text-[#AAAAAA]'>{t('common.socials')}</h1>
							<div className='flex gap-4'>
								<Link href={data?.facebook ?? ''}>
									<FaFacebook size={24} className='cursor-pointer' />
								</Link>
								<Link href={data?.youtube ?? ''}>
									<FaYoutube size={24} className='cursor-pointer' />
								</Link>
								<Link href={data?.twitter ?? ''}>
									<FaTwitter size={24} className='cursor-pointer' />
								</Link>
								<Link href={data?.telegram ?? ''}>
									<FaTelegram size={24} className='cursor-pointer' />
								</Link>
								<Link href={data?.instagram ?? ''}>
									<FaInstagram size={24} className='cursor-pointer' />
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Page
