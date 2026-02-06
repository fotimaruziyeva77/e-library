'use client'
import { useEffect, useState } from 'react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { langs } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

function LanguageDropdown() {
	const [mounted, setMounted] = useState(false)
	const { lng } = useParams()
	const pathname = usePathname()
	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) return null

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild className='!outline-none'>
				<button
					className='btn-i-primary rounded-full py-1 px-2 flex items-center'
					aria-label='Globe'
				>
					<Image
						src={`/assets/${lng}.png`}
						alt={'lng'}
						width={30}
						height={30}
					/>
					<span className='ml-2 uppercase font-semibold text-base'>
						{lng === 'uz-Cyrl' && 'Ўз'}
						{lng === 'uz' && "O'z"}
						{lng === 'en' && 'En'}
						{lng === 'ru' && 'Ру'}
					</span>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='bg-white'>
				{langs
					.filter(item => item.route !== lng)
					.map(item => (
						<Link
							key={item.route}
							href={`/${item.route}${pathname.replace(`/${lng}`, '')}`}
						>
							<DropdownMenuItem className='cursor-pointer'>
								<Image
									src={`/assets/${item.route}.png`}
									alt={item.label}
									width={30}
									height={30}
								/>
								<span className='ml-2 font-medium'>{item.label}</span>
							</DropdownMenuItem>
						</Link>
					))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default LanguageDropdown
