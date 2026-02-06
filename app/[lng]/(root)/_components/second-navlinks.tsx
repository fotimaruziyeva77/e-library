import { Separator } from '@/components/ui/separator'
import useTranslate from '@/hooks/use-translate'
import {
	BadgeInfo,
	BookX,
	ChartLine,
	ContactRound,
	HandCoins,
	LibraryBig,
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

function SecondNavlinks() {
	const t = useTranslate()
	const { lng } = useParams()
	return (
		<div className='hidden md:block w-full border-y border-solid border-[#00000012] py-4'>
			<ul className='flex items-center gap-3 xl:max-w-[1400px] xl:px-0 px-5 m-auto w-full font-semibold'>
				<li className='md:text-base text-sm'>
					<Link
						href={`/${lng}/contribute`}
						className='flex items-center gap-1.5'
					>
						<HandCoins /> {t('nav-link.contribution')}
					</Link>
				</li>
				<Separator orientation='vertical' />
				<li className='md:text-base text-sm'>
					<Link href={`/${lng}/books`} className='flex items-center gap-1.5'>
						<LibraryBig /> {t('nav-link.books')}
					</Link>
				</li>
				<Separator orientation='vertical' />
				<li className='md:text-base text-sm'>
					<Link
						href={`/${lng}/essentialbook`}
						className='flex items-center gap-1.5'
					>
						<BookX /> {t('nav-link.necessary_books')}
					</Link>
				</li>
				<Separator orientation='vertical' />
				<li className='md:text-base text-sm'>
					<Link
						href={`/${lng}/statistics`}
						className='flex items-center gap-1.5'
					>
						<ChartLine /> {t('nav-link.statistics')}
					</Link>
				</li>
				<Separator orientation='vertical' />
				<li className='md:text-base text-sm'>
					<Link href={`/${lng}/contact`} className='flex items-center gap-1.5'>
						<ContactRound /> {t('nav-link.contacts')}
					</Link>
				</li>
				<Separator orientation='vertical' />
				<li className='md:text-base text-sm'>
					<Link href={`/${lng}/about`} className='flex items-center gap-1.5'>
						<BadgeInfo /> {t('nav-link.about')}
					</Link>
				</li>
			</ul>
		</div>
	)
}

export default SecondNavlinks
