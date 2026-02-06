import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { toast } from 'sonner'
import axios from 'axios'
import { APISERVICE } from '@/services/api-service'
import useAuth from '@/hooks/use-auth'
import ReactStars from 'react-stars'
import { useParams } from 'next/navigation'
import { ReviewTypes } from '@/interfaces'
import { cn } from '@/lib/utils'
import CommentCardSkeleton from '@/components/cards/comment.card-sceleton'
import useTranslate from '@/hooks/use-translate'
import { Star } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface IProps {
	bookId: number
	score1?: number
	score2?: number
	score3?: number
	score4?: number
	score5?: number
	rating: number
	description: string
}

function BookComment({
	bookId,
	score1,
	score2,
	score3,
	score4,
	score5,
	rating,
}: IProps) {
	const library_id = Cookies.get('library_id')
	const token = Cookies.get('access')
	const [review, setReview] = useState('')
	const [score, setScore] = useState(0)
	const [comments, setComments] = useState<ReviewTypes[]>([])
	const [topReview, setTopReview] = useState<ReviewTypes | null>(null)
	const { data } = useAuth()
	const { slug } = useParams()
	const [count, setCount] = useState(3)
	const [isCommented, setIsCommented] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const t = useTranslate()
	const [imageError, setImageError] = useState(false)

	const total =
		(score1 ?? 0) +
		(score2 ?? 0) +
		(score3 ?? 0) +
		(score4 ?? 0) +
		(score5 ?? 0)

	const scoreList = [
		{ value: total ? ((score1 ?? 0) / total) * 100 : 0, star: 5 },
		{ value: total ? ((score2 ?? 0) / total) * 100 : 0, star: 4 },
		{ value: total ? ((score3 ?? 0) / total) * 100 : 0, star: 3 },
		{ value: total ? ((score4 ?? 0) / total) * 100 : 0, star: 2 },
		{ value: total ? ((score5 ?? 0) / total) * 100 : 0, star: 1 },
	]

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await axios.get(
					`${APISERVICE.books}/${library_id}/${slug}/reviews/`
				)

				const userId = data?.id
				const reviews = res.data.results

				if (Array.isArray(reviews) && reviews.length > 0) {
					const highest = reviews.reduce(
						(max: ReviewTypes, current: ReviewTypes) =>
							parseFloat(current.score) > parseFloat(max.score) ? current : max
					)
					setTopReview(highest)
				}

				const userHasCommented = reviews.some((review: ReviewTypes) => {
					const reviewMemberId = review.library_member?.id
					return reviewMemberId === userId
				})
				setIsCommented(userHasCommented)
			} catch (err) {
				console.error(err)
			}
		}

		fetchData()
	}, [library_id, slug, data])

	useEffect(() => {
		setIsLoading(true)
		const fetchData = async () => {
			try {
				const res = await axios.get(
					`${APISERVICE.books}/${library_id}/${slug}/reviews/?limit=${count}`
				)

				setComments(res.data.results)
			} catch (err) {
				console.error(err)
			} finally {
				setIsLoading(false)
			}
		}

		fetchData()
	}, [library_id, slug, count, isCommented])

	const handleSubmit = async () => {
		if (!review || score === 0) {
			toast.warning('Iltimos, fikr va bahoni kiriting.', {
				position: 'top-center',
				richColors: true,
			})
			return
		}

		const data = {
			review,
			score,
			book: bookId,
		}

		try {
			await axios.post(`${APISERVICE.books}/${library_id}/reviews/`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			toast.success(t('success.commentsuccess'), {
				position: 'top-center',
				richColors: true,
			})

			setReview('')
			setScore(0)
		} catch (err: any) {
			if (err.response?.status === 401) {
				toast.error(t('notification.ratingbooks'), {
					position: 'top-center',
					richColors: true,
				})
			} else {
				console.error(err)
				toast.error(t('notification.error'), {
					position: 'top-center',
					richColors: true,
				})
			}
		}
	}

	return (
		<div>
			<div className='flex'>
				<Card className=' w-full mt-3 border border-solid border-[#00000012]'>
					<CardContent className='flex justify-between flex-wrap gap-10'>
						<div>
							<h2 className='text-[#11142D] text-2xl font-bold mb-2'>
								{t('books.rating')}
							</h2>
							<p className='text-sm text-muted-foreground mb-6'>
								{topReview?.review}
							</p>
						</div>
						{score1 || score2 || score3 || score4 || score5 ? (
							<>
								<div className='flex flex-col justify-center w-full gap-2'>
									{scoreList.map(({ value, star }, i) => (
										<div key={i} className='flex items-center gap-3 py-1'>
											<div className='flex items-center gap-1 w-8 min-w-[30px]'>
												<Star className='w-4 h-4 text-orange-400 fill-orange-400' />
												<span className='text-sm font-semibold'>{star}</span>
											</div>

											<div className='flex-1'>
												<Progress value={value} className='h-2' />
											</div>

											<span className='text-sm w-12 text-right text-muted-foreground'>
												{value.toFixed(1)}%
											</span>
										</div>
									))}
								</div>

								<div className='flex flex-col justify-center w-full'>
									<h1 className='text-2xl font-bold'>{rating} </h1>
									<ReactStars
										count={5}
										value={rating || 5}
										edit={false}
										size={24}
										color2={'#ffd700'}
									/>
								</div>
							</>
						) : (
							<p className='flex-auto flex ite-center justify-center  text-center text-gray-500'>
								{t('notfound.nocomment')}
							</p>
						)}
					</CardContent>
				</Card>
			</div>
			<div className={cn(isCommented && 'hidden')}>
				<Card className='w-full mt-3 border border-solid border-[#00000012]'>
					<CardContent>
						<h1 className='text-[#11142D] text-2xl font-bold'>
							{t('books.comment')}
						</h1>{' '}
						<div className='flex'>
							<ReactStars
								count={5}
								value={score}
								edit
								onChange={e => setScore(e)}
								size={36}
								color2={'#ffd700'}
							/>
						</div>
						<Textarea
							className='mt-4 resize-y'
							value={review}
							onChange={e => setReview(e.target.value)}
						/>
						<Button
							className='bg-[#3F51B5] hover:bg-blue-600 text-white px-4 py-2 mt-4 rounded-md'
							onClick={handleSubmit}
						>
							{t('books.send')}
						</Button>
					</CardContent>
				</Card>
			</div>
			<div className='mt-4'>
				{isLoading
					? [...Array(3)].map((_, i) => <CommentCardSkeleton key={i} />)
					: comments.map((item, idx) => (
							<Card className='border-none mt-10' key={idx}>
								<CardContent>
									<div className='flex justify-between'>
										<div className='flex gap-4'>
											<Image
												src={
													imageError
														? '/assets/user.png'
														: ((item.library_member.photo ??
																'/assets/user.png') as string)
												}
												alt='image'
												width={60}
												height={60}
												className='rounded-full w-[60px] h-[60px]'
												loading='lazy'
												onError={() => setImageError(true)}
											/>
											<div className='flex flex-col'>
												<h1 className='text-base font-semibold'>
													{item.library_member.first_name}{' '}
													{item.library_member.last_name}
												</h1>
												<p className='text-gray-400 text-sm'>
													{item.created_at.split('T')[0]},{' '}
													{item.created_at.split('T')[1].slice(0, 5)}
												</p>
												<div className='flex sm:hidden flex-row gap-1'>
													<ReactStars
														count={5}
														value={Number(item.score)}
														edit={false}
														size={15}
														color2={'#ffd700'}
													/>
													<h1 className='text-base font-bold mb-2 sm:text-left text-right'>
														{item?.score}
													</h1>
												</div>
											</div>
										</div>
										<div className='sm:flex hidden flex-col sm:gap-5 gap-1'>
											<ReactStars
												count={5}
												value={Number(item.score)}
												edit={false}
												size={24}
												color2={'#ffd700'}
											/>
											<h1 className='sm:text-2xl text-xl font-bold mb-2 sm:text-left text-right'>
												{item?.score}
											</h1>
										</div>
									</div>
									<CardDescription className='mt-4 text-base'>
										{item.review}
									</CardDescription>
								</CardContent>
							</Card>
					  ))}
			</div>
			{review.length > 3 && (
				<div className='flex items-center justify-center w-full'>
					<Button
						className='mt-4 bg-[#EEF4FF] hover:bg-[#3F51B5] hover:text-white text-base cursor-pointer text-[#3F51B5] w-full p-6'
						onClick={() => setCount(count + 3)}
					>
						{t('books.more')}
					</Button>
				</div>
			)}
		</div>
	)
}

export default BookComment
