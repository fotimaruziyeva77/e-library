import type { Metadata } from 'next'
import { Crete_Round, Work_Sans, Roboto } from 'next/font/google'
import './globals.css'
import { ChildProps } from '@/types'
import { dir } from 'i18next'
import ClientWrapper from '@/components/client-wrapper'
import LayoutWrapper from './(root)/_components/layout-wrapper'
import NextTopLoader from 'nextjs-toploader'

const creteRound = Crete_Round({
	weight: ['400'],
	variable: '--font-creteRound',
	subsets: ['latin'],
})

const workSans = Work_Sans({
	weight: ['500', '600'],
	variable: '--font-workSans',
	subsets: ['latin'],
})
const roboto = Roboto({
	subsets: ['latin'],
	weight: ['400', '500', '700'],
	variable: '--font-roboto',
})

export const metadata: Metadata = {
	title: 'KUTUBXONA',
	description: 'Avtomatlashtirilgan kutubxona platformasi',
	icons: {
		icon: '/logo.png',
	},
}

interface Props extends ChildProps {
	params: { lng: string }
}

export default async function RootLayout({ children, params }: Props) {
	const { lng } = await params

	return (
		<html lang={lng} dir={dir(lng)} suppressHydrationWarning>
			<body
				className={`${creteRound.variable} ${workSans.variable} ${roboto.className} antialiased`}
				suppressHydrationWarning
			>
				<div className='overflow-x-hidden max-w-screen w-full overflow-y-auto custom-scrollbar'>
					<NextTopLoader showSpinner={false} />
					<ClientWrapper>
						<LayoutWrapper>{children}</LayoutWrapper>
					</ClientWrapper>
				</div>
			</body>
		</html>
	)
}
