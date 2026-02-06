'use client'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import useTranslate from '@/hooks/use-translate'
import { ContributionTypes } from '@/interfaces'
import { APISERVICE } from '@/services/api-service'
import axios from 'axios'
import { Copy } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useParams } from 'next/navigation'

function Application() {
	const t = useTranslate()
	const library_id = Cookies.get('library_id')
	const [data, setData] = useState<ContributionTypes>()
	const { lng } = useParams()

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
		<div className='min-h-screen h-full sm:py-18 py-14  w-full bg-gray-50'>
			<div className='w-full bg-white py-3 sm:border-none border-y border-solid border-[#00000025] sm:px-0 px-3'>
				<Breadcrumb className='max-w-[1400px] m-auto'>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink
								href={`/${lng}/`}
								className='text-[#3F51B5] sm:text-base text-sm font-semibold'
							>
								{t('nav-link.homepage')}
							</BreadcrumbLink>
						</BreadcrumbItem>
						<span>/</span>
						<BreadcrumbItem>
							<BreadcrumbPage className='text-base font-semibold text-gray-500'>
								{t('nav-link.contribution')}
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>

			<div className='max-w-[1400px] m-auto w-full px-3 sm:py-6 py-3 md:px-6'>
				<div className='flex flex-col lg:flex-row gap-6 items-center lg:items-start'>
					<Image
						src={data?.image || "/hissa_qo'shish.png"}
						alt='Kutubxona'
						width={350}
						height={400}
						className='rounded-lg object-cover'
					/>

					<div className='p-0 md:p-8 rounded-lg md:border border-solid border-[#00000012] w-full'>
						<h2 className='text-lg font-semibold mb-4'>
							{t('application.applicationtext')}
						</h2>
						<div className='flex flex-col md:flex-row gap-6 mb-6'>
							{data?.card_number1 && (
								<div>
									<p className='text-sm text-gray-500'>
										{t('application.applicationcard')}
									</p>
									<p className='font-semibold flex gap-2 items-center'>
										{data?.card_number1}
										<Copy size={18} className='cursor-pointer' />
									</p>
								</div>
							)}
							{data?.card_number2 && (
								<div>
									<p className='text-sm text-gray-500'>Karta</p>
									<p className='font-semibold flex gap-2 items-center'>
										{data?.card_number2}
										<Copy size={18} className='cursor-pointer' />
									</p>
								</div>
							)}
						</div>

						<p className='text-sm text-gray-700 leading-relaxed w-full text-justify indent-5'>
							{data?.description}
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Application
