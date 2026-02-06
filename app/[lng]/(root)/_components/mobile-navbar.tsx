'use client'

import { cn } from '@/lib/utils'

import {
	BadgeInfo,
	BookX,
	ChartLine,
	ContactRound,
	HandCoins,
	LibraryBig,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { RiApps2Fill, RiApps2Line } from 'react-icons/ri'
import UserManagment from './user-management'
import AuthDialog from './auth'
import useAuth from '@/hooks/use-auth'
import LanguageDropdown from './language-dropdown'
import useTranslate from '@/hooks/use-translate'

const MobileNavbar = () => {
	const [active, setActive] = useState(false)
	const router = useRouter()
	const pathname = usePathname()
	const { data } = useAuth()
	const [open, setOpen] = useState(false)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const t = useTranslate()
	const { lng } = useParams()

	useEffect(() => {
		setIsAuthenticated(data !== null)
	}, [data])

	const handleRedirect = (path: string) => {
		setActive(false)
		router.push(path)
	}

	return (
		<div
			className={cn(
				'w-full flex md:hidden flex-col bg-white fixed top-0 left-0 z-50 max-h-dvh',
				active ? 'h-full' : 'h-14'
			)}
		>
			<div className='flex w-full items-center justify-between px-3 py-2'>
				<Link href={`/${lng}/`} className='flex items-center gap-3'>
					<div className='w-10 h-10'>
						<Image
							src='/assets/logo.png'
							alt='Sifat Library'
							width={40}
							height={40}
							className='w-full h-full object-contain'
						/>
					</div>
				</Link>
				<div className='flex items-center gap-4'>
					<LanguageDropdown />
					{isAuthenticated ? (
						<UserManagment />
					) : (
						<button
							className='px-4 py-2 text-sm bg-[#3F51B5] hover:bg-[#3F51B5] text-white rounded-xl cursor-pointer'
							onClick={() => setOpen(true)}
						>
							{t('navbar.login')}
						</button>
					)}

					<AuthDialog open={open} setOpen={setOpen} />

					<div className='h-full aspect-square p-1.5 flex items-center rounded-md bg-neutral-200/75 backdrop-blur-sm'>
						<RiApps2Line
							className={cn(!active ? 'block' : 'hidden')}
							onClick={() => setActive(true)}
							size={24}
						/>

						<RiApps2Fill
							className={cn(
								'text-blue-500 stroke-blue-900',
								active ? 'block' : 'hidden'
							)}
							onClick={() => setActive(false)}
							size={24}
						/>
					</div>
				</div>
			</div>
			<div
				className={cn(
					'w-full flex-auto h-full z-50 bg-white flex flex-col gap-3 p-5',
					active ? 'flex' : 'hidden'
				)}
			>
				<ul className='flex flex-col gap-3 w-full font-semibold'>
					<li className='md:text-base text-sm'>
						<p
							onClick={() => handleRedirect(`/${lng}/application`)}
							className={cn(
								'flex items-center gap-1.5',
								pathname.split('/')[2] === 'application' &&
									'text-blue-500 font-semibold'
							)}
						>
							<HandCoins /> {t('nav-link.contribution')}
						</p>
					</li>
					<li className='md:text-base text-sm'>
						<p
							onClick={() => handleRedirect(`/${lng}/books`)}
							className={cn(
								'flex items-center gap-1.5',
								pathname.split('/')[2] === 'books' &&
									'text-blue-500 font-semibold'
							)}
						>
							<LibraryBig /> {t('nav-link.books')}
						</p>
					</li>
					<li className='md:text-base text-sm'>
						<p
							onClick={() => handleRedirect(`/${lng}/essentialbook`)}
							className={cn(
								'flex items-center gap-1.5',
								pathname.split('/')[2] === 'essentialbook' &&
									'text-blue-500 font-semibold'
							)}
						>
							<BookX /> {t('nav-link.necessary_books')}
						</p>
					</li>

					<li className='md:text-base text-sm'>
						<p
							onClick={() => handleRedirect(`/${lng}/statistics`)}
							className={cn(
								'flex items-center gap-1.5',
								pathname.split('/')[2] === 'statistics' &&
									'text-blue-500 font-semibold'
							)}
						>
							<ChartLine /> {t('nav-link.statistics')}
						</p>
					</li>
					<li className='md:text-base text-sm'>
						<p
							onClick={() => handleRedirect(`/${lng}/contact`)}
							className={cn(
								'flex items-center gap-1.5',
								pathname.split('/')[2] === 'contact' &&
									'text-blue-500 font-semibold'
							)}
						>
							<ContactRound /> {t('nav-link.contacts')}
						</p>
					</li>
					<li className='md:text-base text-sm'>
						<p
							onClick={() => handleRedirect(`/${lng}/about`)}
							className={cn(
								'flex items-center gap-1.5',
								pathname.split('/')[2] === 'about' &&
									'text-blue-500 font-semibold'
							)}
						>
							<BadgeInfo /> {t('nav-link.about')}
						</p>
					</li>
				</ul>
			</div>
		</div>
	)
}

export default MobileNavbar
