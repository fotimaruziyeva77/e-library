interface BookCardSkeletonProps {
	type: 'card' | 'list' | 'small-rated'
}

function BookCardSkeleton({ type }: BookCardSkeletonProps) {
	if (type === 'card') {
		return (
			<div className='max-w-96 md:w-64 w-full flex flex-col gap-5 bg-white rounded-lg md:p-4 p-2 border border-[#00000025] animate-pulse'>
				<div className='w-full h-[250px] bg-gray-200 dark:bg-gray-700 rounded-md' />
				<div className='flex flex-col gap-2'>
					<div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4' />
					<div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2' />
					<div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4' />
				</div>
			</div>
		)
	}

	if (type === 'list') {
		return (
			<div className='w-full flex items-center gap-4 p-4 rounded-lg bg-white animate-pulse'>
				<div className='w-[200px] h-[250px] bg-gray-200 dark:bg-gray-700 rounded-md shrink-0' />
				<div className='flex flex-col gap-5 flex-auto'>
					<div className='flex flex-col gap-3'>
						<div className='flex items-start justify-between'>
							<div className='flex flex-col gap-2 w-2/3'>
								<div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-full' />
								<div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3' />
							</div>
							<div className='flex flex-col gap-2 items-end'>
								<div className='h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded' />
								<div className='h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded' />
							</div>
						</div>
						<div className='h-16 bg-gray-200 dark:bg-gray-700 rounded w-full' />
					</div>
					<div className='flex gap-10'>
						{[1, 2, 3].map(i => (
							<div className='flex flex-col gap-2' key={i}>
								<div className='h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded' />
								<div className='h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded' />
							</div>
						))}
					</div>
				</div>
			</div>
		)
	}

	if (type === 'small-rated') {
		return (
			<div className='w-full flex flex-row gap-5 bg-white rounded-lg p-4 animate-pulse'>
				<div className='w-36 h-[200px] bg-gray-200 dark:bg-gray-700 rounded-md' />
				<div className='flex flex-col gap-2 w-full'>
					<div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3' />
					<div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3' />
					<div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2' />
				</div>
			</div>
		)
	}

	return null
}

export default BookCardSkeleton
