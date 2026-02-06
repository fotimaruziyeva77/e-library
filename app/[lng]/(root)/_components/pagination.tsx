'use client'

import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import { usePathname, useRouter } from 'next/navigation'

interface PaginationComponentProps {
	page: number
	setPage: (page: number) => void
	totalPages: number
}

const PaginationComponent = ({
	page,
	setPage,
	totalPages,
}: PaginationComponentProps) => {
	const pathname = usePathname()
	const router = useRouter()
	if (totalPages <= 1) return null

	const renderPages = () => {
		const items = []

		if (totalPages <= 3) {
			for (let i = 1; i <= totalPages; i++) {
				items.push(
					<PaginationItem key={i}>
						<PaginationLink
							href='#'
							size='sm'
							onClick={e => {
								e.preventDefault()
								router.push(`${pathname}?page=${i}`)
								setPage(i)
							}}
							isActive={page === i}
						>
							{i}
						</PaginationLink>
					</PaginationItem>
				)
			}
		} else {
			items.push(
				<PaginationItem key={1}>
					<PaginationLink
						href='#'
						size='sm'
						onClick={e => {
							e.preventDefault()
							router.push(`${pathname}?page=${1}`)
							setPage(1)
						}}
						isActive={page === 1}
					>
						1
					</PaginationLink>
				</PaginationItem>
			)

			if (page > 2) {
				items.push(
					<PaginationItem key='start-ellipsis'>
						<PaginationEllipsis />
					</PaginationItem>
				)
			}

			for (
				let i = Math.max(2, page - 1);
				i <= Math.min(totalPages - 1, page + 1);
				i++
			) {
				items.push(
					<PaginationItem key={i}>
						<PaginationLink
							href='#'
							size='sm'
							onClick={e => {
								e.preventDefault()
								router.push(`${pathname}?page=${i}`)
								setPage(i)
							}}
							isActive={page === i}
						>
							{i}
						</PaginationLink>
					</PaginationItem>
				)
			}

			if (page < totalPages - 2) {
				items.push(
					<PaginationItem key='end-ellipsis'>
						<PaginationEllipsis />
					</PaginationItem>
				)
			}

			items.push(
				<PaginationItem key={totalPages}>
					<PaginationLink
						href='#'
						size='sm'
						onClick={e => {
							e.preventDefault()
							router.push(`${pathname}?page=${totalPages}`)
							setPage(totalPages)
						}}
						isActive={page === totalPages}
					>
						{totalPages}
					</PaginationLink>
				</PaginationItem>
			)
		}

		return items
	}

	return (
		<Pagination className='sm:text-base text-sm mt-5'>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						href='#'
						className={page === 1 ? 'opacity-50 pointer-events-none' : ''}
						onClick={e => {
							e.preventDefault()
							router.push(`${pathname}?page=${page - 1}`)
							if (page > 1) setPage(page - 1)
						}}
					>
						Previous
					</PaginationPrevious>
				</PaginationItem>

				{renderPages()}

				<PaginationItem>
					<PaginationNext
						href='#'
						className={
							page === totalPages ? 'opacity-50 pointer-events-none' : ''
						}
						onClick={e => {
							e.preventDefault()
							router.push(`${pathname}?page=${page + 1}`)
							if (page < totalPages) setPage(page + 1)
						}}
					>
						Next
					</PaginationNext>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	)
}

export default PaginationComponent
