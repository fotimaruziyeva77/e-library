'use client'

import { usePathname } from 'next/navigation'
import { Toaster } from 'sonner'
import { ReactNode } from 'react'
import Navbar from './navbar'
import MobileNavbar from './mobile-navbar'
import Footer from './footer'

interface Props {
	children: ReactNode
}

export default function LayoutWrapper({ children }: Props) {
	const pathname = usePathname()

	const isIntroPage = pathname.split('/')[2] === 'intro'

	return (
		<>
			{!isIntroPage && <Navbar />}
			{!isIntroPage && <MobileNavbar />}
			<Toaster />
			<main className='overflow-x-hidden'>{children}</main>
			{!isIntroPage && <Footer />}
		</>
	)
}
