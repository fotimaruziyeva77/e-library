'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import image from '@/public/assets/logo.png'
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	BookOpen,
	Users,
	Settings,
	BarChart3,
	Clock,
	Shield,
	Smartphone,
	Phone,
	Globe,
	Database,
	UserCheck,
	MapPinHouse,
} from 'lucide-react'
import { FaTelegram } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'
import LanguageDropdown from '../_components/language-dropdown'
import useTranslate from '@/hooks/use-translate'

export default function Intro() {
	const t = useTranslate()
	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
			<header className='border-b border-[#00000025] bg-white/80 backdrop-blur-sm fixed w-full top-0 z-50'>
				<div className='container mx-auto px-4 py-2 flex items-center justify-between max-w-7xl'>
					<Link
						href='/'
						className='flex items-center gap-3  focus-visible:outline-blue-500 focus-visible:rounded-lg'
						aria-label='Sifat Library - Bosh sahifa'
					>
						<div className='w-12 h-12 sm:w-10 sm:h-10'>
							<Image
								src={image}
								alt='Sifat Library logotipi'
								className='w-full h-full object-contain'
								width={40}
								height={40}
								loading='lazy'
							/>
						</div>
						<div className='flex flex-col'>
							<span className='font-semibold text-lg md:flex hidden'>
								Sifat Library
							</span>
						</div>
					</Link>
					<nav className=' flex items-center gap-8'>
						<div className='bg-blue-50 rounded-xl overflow-hidden'>
							<LanguageDropdown />
						</div>
						<Link
							href='/ariza'
							className='bg-blue-500 py-2 px-4 rounded-lg text-white   hover:bg-blue-600 transition-colors duration-200  focus-visible:outline-blue-700'
						>
							{t('intro.leaveApplication')}
						</Link>
					</nav>
				</div>
			</header>

			<section className='max-w-7xl w-full mt-16 mx-auto px-4 py-20 text-center'>
				<Badge
					className='mb-6 bg-blue-100 text-blue-700 hover:bg-blue-100'
					variant='secondary'
				>
					{t('intro.hero.badge')}
				</Badge>
				<h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight'>
					{t('intro.heroTitle.line1')}
					<br />
					<span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'>
						{t('intro.heroTitle.line2')}
					</span>
				</h1>
				<p className='text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed'>
					{t('intro.hero.description')}
				</p>
				<div className='flex flex-col sm:flex-row gap-4 justify-center'>
					<Link
						href={'/'}
						className='bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3 text-white flex items-center justify-center gap-1 rounded-lg'
					>
						{t('intro.hero.applyButton')}
					</Link>
					<Link
						href={'/'}
						className='text-lg px-8 py-3 flex items-center justify-center gap-1 rounded-lg'
					>
						<Play className='mr-2 h-5 w-5' />
						{t('intro.hero.demoButton')}
					</Link>
				</div>
			</section>

			<section className='max-w-7xl w-full mx-auto py-20'>
				<div className='text-center mb-16'>
					<h2 className='text-4xl font-bold text-gray-900 mb-4'>
						{t('intro.solutions.title')}
					</h2>
					<p className='text-xl text-gray-600 max-w-2xl mx-auto'>
						{t('intro.solutions.description')}
					</p>
				</div>

				<div className='grid md:grid-cols-3 gap-6'>
					<Card className='group transition-all duration-300 pb-10 hover:-translate-y-1 hover:shadow-xl border-none bg-gradient-to-tr from-blue-50 to-white'>
						<CardHeader className='flex flex-col items-start'>
							<div className='w-14 h-14 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors flex items-center justify-center mb-4'>
								<Globe className='h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform' />
							</div>
							<CardTitle className='text-xl font-semibold text-blue-700'>
								{t('intro.features.domain.title')}
							</CardTitle>
							<CardDescription className='mt-2 text-sm text-gray-600'>
								{t('intro.features.domain.description')}
							</CardDescription>
						</CardHeader>
					</Card>
					<Card className='group transition-all pb-10 duration-300 hover:-translate-y-1 hover:shadow-xl border-none bg-gradient-to-tr from-green-50 to-white'>
						<CardHeader className='flex   flex-col items-start'>
							<div className='w-14 h-14 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors flex items-center justify-center mb-4'>
								<Settings className='h-6 w-6 text-green-600 group-hover:scale-110 transition-transform' />
							</div>
							<CardTitle className='text-xl font-semibold text-green-700'>
								{t('intro.features.librarian.title')}
							</CardTitle>
							<CardDescription className='mt-2 text-sm text-gray-600'>
								{t('intro.features.librarian.description')}
							</CardDescription>
						</CardHeader>
					</Card>
					<Card className='group  pb-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-none bg-gradient-to-tr from-purple-50 to-white'>
						<CardHeader className='flex flex-col items-start'>
							<div className='w-14 h-14 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors flex items-center justify-center mb-4'>
								<UserCheck className='h-6 w-6 text-purple-600 group-hover:scale-110 transition-transform' />
							</div>
							<CardTitle className='text-xl font-semibold text-purple-700'>
								{t('intro.features.admin.title')}
							</CardTitle>
							<CardDescription className='mt-2 text-sm text-gray-600'>
								{t('intro.features.admin.description')}
							</CardDescription>
						</CardHeader>
					</Card>
				</div>
			</section>

			<section className='bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20'>
				<div className='max-w-7xl w-full mx-auto'>
					<div className='text-center mb-16'>
						<h2 className='text-4xl font-bold mb-4'>{t('intro.why.title')}</h2>
						<p className='text-xl text-blue-100 max-w-2xl mx-auto'>
							{t('intro.why.description')}
						</p>
					</div>
					<div className='grid md:grid-cols-3 gap-8'>
						<div className='text-center'>
							<div className='w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6'>
								<Clock className='h-8 w-8' />
							</div>
							<h3 className='text-2xl font-semibold mb-4'>
								{t('intro.why.speed.title')}
							</h3>
							<p className='text-blue-100 leading-relaxed'>
								{t('intro.why.speed.description')}
							</p>
						</div>

						<div className='text-center'>
							<div className='w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6'>
								<Database className='h-8 w-8' />
							</div>
							<h3 className='text-2xl font-semibold mb-4'>
								{t('intro.why.centralized.title')}
							</h3>
							<p className='text-blue-100 leading-relaxed'>
								{t('intro.why.centralized.description')}
							</p>
						</div>

						<div className='text-center'>
							<div className='w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6'>
								<BarChart3 className='h-8 w-8' />
							</div>
							<h3 className='text-2xl font-semibold mb-4'>
								{t('intro.why.analytics.title')}
							</h3>
							<p className='text-blue-100 leading-relaxed'>
								{t('intro.why.analytics.description')}
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className='max-w-7xl w-full mx-auto py-20'>
				<div className='text-center mb-16'>
					<h2 className='text-4xl font-bold text-gray-900 mb-4'>
						{t('intro.extras.title')}
					</h2>
					<p className='text-xl text-gray-600'>
						{t('intro.extras.description')}
					</p>
				</div>

				<div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
					<div className='text-center p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow'>
						<Smartphone className='h-10 w-10 text-blue-600 mx-auto mb-4' />
						<h4 className='font-semibold mb-2'>
							{' '}
							{t('intro.extras.mobile.title')}
						</h4>
						<p className='text-sm text-gray-600'>
							{t('intro.extras.mobile.description')}
						</p>
					</div>

					<div className='text-center p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow'>
						<Shield className='h-10 w-10 text-green-600 mx-auto mb-4' />
						<h4 className='font-semibold mb-2'>
							{t('intro.extras.security.title')}
						</h4>
						<p className='text-sm text-gray-600'>
							{t('intro.extras.security.description')}
						</p>
					</div>

					<div className='text-center p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow'>
						<Users className='h-10 w-10 text-purple-600 mx-auto mb-4' />
						<h4 className='font-semibold mb-2'>
							{t('intro.extras.multiUser.title')}
						</h4>
						<p className='text-sm text-gray-600'>
							{t('intro.extras.multiUser.description')}
						</p>
					</div>

					<div className='text-center p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow'>
						<BookOpen className='h-10 w-10 text-orange-600 mx-auto mb-4' />
						<h4 className='font-semibold mb-2'>
							{t('intro.extras.catalog.title')}
						</h4>
						<p className='text-sm text-gray-600'>
							{t('intro.extras.catalog.description')}
						</p>
					</div>
				</div>
			</section>

			<section className='bg-gray-50 py-20'>
				<div className='max-w-7xl w-full mx-auto px-4 text-center'>
					<h2 className='text-4xl font-bold text-gray-900 mb-4'>
						{t('intro.contact.title')}
					</h2>
					<p className='text-xl text-gray-600 mb-8'>
						{t('intro.contact.subtitle')}
					</p>

					<div className='grid md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
						<Card className='text-center hover:shadow-lg transition-shadow pb-10 pt-4 border border-solid border-[#00000025]'>
							<CardHeader>
								<div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
									<Phone className='h-6 w-6 text-blue-600' />
								</div>
								<CardTitle>{t('intro.contact.phone.title')}</CardTitle>
								<CardDescription>
									+998 88 378 08 08
									<br />
									{t('intro.contact.phone.info')}
								</CardDescription>
							</CardHeader>
						</Card>

						<Card className='text-center hover:shadow-lg pb-10 pt-4 transition-shadow border border-solid border-[#00000025]'>
							<CardHeader>
								<div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
									<FaTelegram className='h-6 w-6 text-green-600' />
								</div>
								<CardTitle>{t('intro.contact.telegram.title')}</CardTitle>
								<CardDescription>
									@sd_khaydarov
									<br />
									{t('intro.contact.telegram.info')}
								</CardDescription>
							</CardHeader>
						</Card>
					</div>

					<div className='mt-12'>
						<Button
							size='lg'
							className='bg-blue-600 hover:bg-blue-700 text-lg px-12 py-6 text-white cursor-pointer'
						>
							{t('intro.contact.cta')}
						</Button>
					</div>
				</div>
			</section>

			<footer className='bg-gray-900 text-white py-12'>
				<div className='max-w-7xl w-full mx-auto px-4'>
					<div className='grid md:grid-cols-2 gap-20'>
						<div>
							<div className='flex items-center space-x-2 mb-4'>
								<BookOpen className='h-6 w-6' />
								<span className='text-xl font-bold'>Sifat Library</span>
							</div>
							<p className='text-gray-400 leading-relaxed'>
								{t('intro.footer.description')}
							</p>
						</div>

						<div>
							<h4 className='font-semibold mb-4'>
								{t('intro.footer.contact.title')}
							</h4>
							<ul className='space-y-4 text-gray-400'>
								<li className='flex'>
									<span>
										<MapPinHouse />
									</span>
									{t('intro.footer.contact.address')}
								</li>
								<li className='flex'>
									<span>
										<Phone />
									</span>{' '}
									+998 90 123 45 67
								</li>
							</ul>
						</div>
					</div>

					<div className='border-t border-gray-800 mt-8 pt-8 text-center text-gray-400'>
						<p>{t('intro.footer.copyright')}</p>
					</div>
				</div>
			</footer>
		</div>
	)
}

function Play({ className }: { className?: string }) {
	return (
		<svg className={className} fill='currentColor' viewBox='0 0 20 20'>
			<path d='M6.3 2.841A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.269l9.344-5.89a1.5 1.5 0 0 0 0-2.538L6.3 2.84Z' />
		</svg>
	)
}
