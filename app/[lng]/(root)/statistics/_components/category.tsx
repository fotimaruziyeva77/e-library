import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import useTranslate from '@/hooks/use-translate'
import { CategoryStats, LibraryStatisticsTypes } from '@/interfaces'
import { APISERVICE } from '@/services/api-service'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Pie, Label, PieChart, Tooltip, ResponsiveContainer } from 'recharts'
import Cookies from 'js-cookie'
import { useParams } from 'next/navigation'

function Category() {
	const t = useTranslate()
	const library_id = Cookies.get('library_id')
	const [statistics, setStatistics] = useState<LibraryStatisticsTypes>()
	const { lng } = useParams()

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await axios.get(
					`${APISERVICE.libraryStatistics}/${library_id}/`,
					{
						headers: {
							'Accept-Language': lng === 'uz-Cyrl' ? 'cy' : lng,
						},
					}
				)
				setStatistics(res.data)
				console.log(res.data)
			} catch (err) {
				console.log(err)
			}
		}

		if (library_id) fetchData()
	}, [library_id])

	const colors = [
		'#7294ce',
		'#A6B7D4',
		'#FF92AE',
		'#6CC24A',
		'#FFD166',
		'#FF6F61',
		'#9B59B6',
		'#1ABC9C',
		'#E67E22',
		'#34495E',
	]

	const generateColor = (index: number) => {
		const hue = (index * 47) % 360
		return `hsl(${hue}, 70%, 50%)`
	}

	const categoryChartData =
		statistics?.category_stats
			?.filter(item => item.total > 0)
			.map((item: CategoryStats, index: number) => ({
				name: item.category__name,
				value: item.total,
				fill: colors[index % colors.length] || generateColor(index),
			})) ?? []

	return (
		<div className='mt-6'>
			<Card className='flex justify-around border border-solid border-[#00000025] w-auto'>
				<CardHeader className='flex items-center justify-center flex-col gap-4'>
					<CardTitle className='md:text-2xl text-xl'>
						{t('statistics.category')}
					</CardTitle>
				</CardHeader>

				<CardContent className='flex flex-wrap'>
					<div className='flex sm:items-center justify-center sm:gap-10 gap-3 sm:flex-row flex-col'>
						<div className='flex flex-wrap flex-col justify-center gap-4 mt-4'>
							{categoryChartData.map((cat, idx) => (
								<div key={idx} className='flex items-center gap-2'>
									<div
										className='w-4 h-4 rounded-full'
										style={{ backgroundColor: cat.fill }}
									></div>
									<span>
										{cat.name} ({cat.value})
									</span>
								</div>
							))}
						</div>
					</div>

					<div className='w-[400px] h-[400px] mx-auto'>
						<ResponsiveContainer>
							<PieChart>
								<Pie
									data={categoryChartData}
									dataKey='value'
									nameKey='name'
									innerRadius={100}
									strokeWidth={5}
								>
									<Label
										content={({ viewBox }) => {
											if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
												return (
													<text
														x={viewBox.cx}
														y={viewBox.cy}
														textAnchor='middle'
														dominantBaseline='middle'
													>
														<tspan
															x={viewBox.cx}
															y={viewBox.cy}
															className='fill-foreground text-3xl font-bold'
														>
															{statistics?.total_books}
														</tspan>
														<tspan
															x={viewBox.cx}
															y={(viewBox.cy || 0) + 24}
															className='fill-muted-foreground text-xl'
														>
															{t('statistics.all')}
														</tspan>
													</text>
												)
											}
										}}
									/>
								</Pie>
								<Tooltip
									formatter={(value, name) => [
										`${value} (${(
											((value as number) / (statistics?.total_books || 1)) *
											100
										).toFixed(1)}%)`,
										name,
									]}
								/>
							</PieChart>
						</ResponsiveContainer>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default Category
