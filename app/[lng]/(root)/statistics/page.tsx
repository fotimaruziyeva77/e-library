'use client'

import React from 'react'
import Month from './_components/month'
import AllBooks from './_components/allbooks'
import Readers from './_components/readers'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import useTranslate from '@/hooks/use-translate'
import MostRead from './_components/mostread'
import { useParams } from 'next/navigation'
import Category from './_components/category'

function Statistics() {
	const t = useTranslate()
	const { lng } = useParams()
	return (
		<div className='min-h-screen h-full sm:py-18 py-17 w-full'>
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
								{t('nav-link.statistics')}
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
			<div className='w-full max-w-[1400px] m-auto py-4'>
				<div className='grid md:grid-cols-2 grid-cols-1 gap-4 sm:px-0 px-3'>
					<Readers />
					<AllBooks />
				</div>
				<div className='sm:px-0 px-3'>
					<Category />
				</div>
				<div className='mt-6'>
					<h1 className='sm:text-2xl text-xl sm:px-0 px-3 mt-6 mb-7 font-semibold'>
						{t('statistics.statisticstext')}
					</h1>
					<Month />
				</div>
				<div>
					<MostRead />
				</div>
			</div>
		</div>
	)
}

export default Statistics
