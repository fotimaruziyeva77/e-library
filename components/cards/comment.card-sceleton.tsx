import { Card, CardContent, CardDescription } from '@/components/ui/card'

function CommentCardSkeleton() {
	return (
		<Card className='border-none mt-10 animate-pulse'>
			<CardContent>
				<div className='flex justify-between'>
					{/* Profile info */}
					<div className='flex gap-4'>
						<div className='rounded-full bg-gray-200 dark:bg-gray-700 w-[60px] h-[60px]' />
						<div className='flex flex-col gap-2'>
							<div className='h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded' />
							<div className='h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded' />
						</div>
					</div>

					{/* Rating */}
					<div className='flex flex-row gap-10 items-center'>
						<div className='h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded' />
						<div className='h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded' />
					</div>
				</div>

				{/* Review text */}
				<CardDescription className='mt-4'>
					<div className='h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2' />
					<div className='h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded' />
				</CardDescription>
			</CardContent>
		</Card>
	)
}

export default CommentCardSkeleton
