import useTranslate from '@/hooks/use-translate'
import Image from 'next/image'

function Page() {
	const t = useTranslate()
	return (
		<div>
			<div className='flex flex-col items-center justify-center h-screen'>
				<h1 className='text-center text-4xl font-medium uppercase'>
					{t('notfound.error')}
				</h1>{' '}
				<Image
					src={'/assets/notfound.png'}
					alt='Not Found'
					width={800}
					height={900}
					className='mx-auto'
				/>{' '}
				<h2 className='text-center text-4xl font-medium  uppercase'>
					{t('notfound.page')}
				</h2>
			</div>
		</div>
	)
}

export default Page
