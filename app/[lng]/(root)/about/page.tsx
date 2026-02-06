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
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useParams } from 'next/navigation'
import { Sparkles, BookOpen, Users } from 'lucide-react'

function About() {
	const library_id = Cookies.get('library_id')
	const [data, setData] = useState<ContactTypes>()
	const { lng } = useParams()
	const t = useTranslate()

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
	}, [library_id, lng])

	return (
		<div className='min-h-screen w-full mt-20'>
			{/* BREADCRUMB */}
			<div className='bg-white py-3 border-b'>
				<Breadcrumb className='max-w-[1400px] mx-auto px-3'>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink
								href={`/${lng}/`}
								className='text-[#3F51B5] font-semibold'
							>
								{t('nav-link.homepage')}
							</BreadcrumbLink>
						</BreadcrumbItem>
						<span>/</span>
						<BreadcrumbItem>
							<BreadcrumbPage className='font-semibold text-gray-500'>
								{t('nav-link.about')}
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>

			{/* HERO IMAGE */}
			<div className='relative w-full h-[360px] md:h-[480px]'>
				<Image
					src={data?.image || '/about.png'}
					alt='About library'
					fill
					className='object-cover'
					priority
				/>
				<div className='absolute inset-0 bg-black/40 flex items-center justify-center'>
					<h1 className='text-white text-2xl md:text-4xl font-bold text-center px-4'>
						{data?.title}
					</h1>
				</div>
			</div>

			{/* CONTENT */}
			<div className='max-w-[1100px] mx-auto px-4 -mt-16 relative z-10'>
				<div className='bg-white rounded-2xl shadow-lg p-6 md:p-10'>
					<p className='text-gray-700 leading-relaxed text-base md:text-lg'>
						{data?.description}
					</p>

					{/* CREATIVE INFO BLOCK */}
					<div className='grid md:grid-cols-3 gap-6 mt-10'>
						<div className='flex gap-4 items-start'>
							<Sparkles className='text-[#3F51B5]' />
							<div>
								<h4 className='font-semibold text-gray-800'>
									Zamonaviy kutubxona
								</h4>
								<p className='text-sm text-gray-600'>
									Raqamli va an’anaviy bilimlar uyg‘unligi
								</p>
							</div>
						</div>

						<div className='flex gap-4 items-start'>
							<BookOpen className='text-[#3F51B5]' />
							<div>
								<h4 className='font-semibold text-gray-800'>
									Minglab kitoblar
								</h4>
								<p className='text-sm text-gray-600'>
									Turli janr va yo‘nalishlarda
								</p>
							</div>
						</div>

						<div className='flex gap-4 items-start'>
							<Users className='text-[#3F51B5]' />
							<div>
								<h4 className='font-semibold text-gray-800'>
									Faol o‘quvchilar
								</h4>
								<p className='text-sm text-gray-600'>
									Bilimga chanqoq jamoa
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default About
