function CategoryCardSkeleton() {
	return (
		<div className='relative overflow-hidden rounded-xl w-full h-40 sm:h-48 md:h-56 lg:h-60 xl:h-64 bg-gray-200 dark:bg-gray-700 animate-pulse'>
			<div className='absolute inset-0 bg-gradient-to-t from-black/30 via-black/20 to-transparent flex items-end p-4'>
				<div className='h-5 w-3/4 bg-gray-300 dark:bg-gray-600 rounded' />
			</div>
		</div>
	)
}

export default CategoryCardSkeleton
