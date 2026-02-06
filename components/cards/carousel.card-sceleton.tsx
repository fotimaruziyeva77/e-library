function CarouselCardSkeleton() {
	return (
		<div className='flex flex-col gap-2 w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] shrink-0 animate-pulse'>
			<div className='relative w-full aspect-[2/3] rounded-lg bg-gray-200 dark:bg-gray-700' />
			<div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 mx-auto' />
		</div>
	)
}

export default CarouselCardSkeleton
