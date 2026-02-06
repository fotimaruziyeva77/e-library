function BookDetailSkeleton() {
	return (
		<div className='w-full flex justify-around px-3 sm:px-0 flex-col md:flex-row gap-10 animate-pulse'>
			<div className='w-full flex flex-col sm:flex-row items-start gap-4 p-4 rounded-lg bg-white border border-solid border-[#00000025]'>
				<div className='w-[250px] h-[300px] bg-gray-200 dark:bg-gray-700 rounded-md shrink-0' />

				<div className='flex flex-col gap-5 flex-auto justify-between place-self-stretch w-full'>
					<div className='flex flex-col gap-3'>
						<div className='flex items-start justify-between flex-wrap'>
							<div className='flex flex-col gap-2 w-1/2'>
								<div className='h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded' />
								<div className='h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded' />
							</div>
							<div className='flex flex-col gap-2 items-end'>
								<div className='h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded' />
								<div className='h-3 w-36 bg-gray-200 dark:bg-gray-700 rounded' />
							</div>
						</div>

						<div className='h-24 w-full bg-gray-200 dark:bg-gray-700 rounded' />
					</div>

					<div className='flex sm:gap-10 gap-3 flex-wrap'>
						{[1, 2, 3].map(i => (
							<div key={i} className='flex flex-col gap-2'>
								<div className='h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded' />
								<div className='h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded' />
							</div>
						))}
					</div>

					<div className='w-full border border-dashed border-[#00000025]' />

					<div className='h-10 w-48 bg-gray-300 dark:bg-gray-600 rounded-lg' />
				</div>
			</div>
		</div>
	)
}

export default BookDetailSkeleton
