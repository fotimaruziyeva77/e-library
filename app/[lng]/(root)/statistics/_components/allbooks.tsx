import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
} from '@/components/ui/chart'
import useTranslate from '@/hooks/use-translate'
import { LibraryStatisticsTypes } from '@/interfaces'
import { APISERVICE } from '@/services/api-service'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Pie, Label, PieChart } from 'recharts'
import Cookies from 'js-cookie'

const chartConfig = {
	male: {
		label: "Ayni vaqtda o'qiladigan kitoblar",
		color: '#FF92AE',
	},
	female: {
		label: 'Kelishilgan vaqtda qaytarilmagan kitoblar',
		color: '#A6B7D4',
	},
	other: {
		label: 'Kelishilgan vaqtda qaytarilmagan kitoblar',
		color: '#7294ce',
	},
} satisfies ChartConfig

function AllBooks() {
	const t = useTranslate()
	const library_id = Cookies.get('library_id')
	const [statistics, setStatistics] = useState<LibraryStatisticsTypes>()
	useEffect(() => {
		const fetchData = async () => {
			await axios
				.get(`${APISERVICE.libraryStatistics}/${library_id}/`)
				.then(res => {
					setStatistics(res.data)
					console.log(res.data)
				})
				.catch(err => console.log(err))
		}

		if (library_id) fetchData()
	}, [library_id])

	const chartData = [
		{
			browser: t('statistics.sametimebooks'),
			visitors: statistics?.active_reservations,
			fill: '#FF92AE',
		},
		{
			browser: t('statistics.agreedtimebooks'),
			visitors: statistics?.overdue_books,
			fill: '#A6B7D4',
		},
		{
			browser: t('statistics.booksAvailable'),
			visitors: statistics?.available_books ?? 0,
			fill: '#7294ce',
		},
	]
	return (
		<div>
			<Card className='flex flex-col border border-solid border-[#00000025] w-auto'>
				<CardHeader className='flex items-center justify-center flex-col gap-4 '>
					<CardTitle className='md:text-2xl text-xl'>
						{t('statistics.allbooks')}
					</CardTitle>
					<div className='flex sm:items-center justify-center sm:gap-10 gap-3 sm:flex-row flex-col'>
						<div className='flex flex-col'>
							<div className='flex gap-2'>
								<Button className='bg-[#7294ce] hover:bg-[#7294ce] w-6 h-6 p-0  rounded-full'></Button>
								<span>{statistics?.available_books ?? 0}</span>
							</div>
							<span>{t('statistics.booksAvailable')}</span>
						</div>
						<div className='flex flex-col'>
							<div className='flex gap-2'>
								<Button className='bg-[#A6B7D4] hover:bg-[#A6B7D4] w-6 h-6 p-0  rounded-full'></Button>
								<span>{statistics?.overdue_books ?? 0}</span>
							</div>
							<span>{t('statistics.agreedtimebooks')}</span>
						</div>
						<div className='flex flex-col'>
							<div className='flex gap-2'>
								<Button className='bg-[#FF92AE] hover:bg-[#FF92AE] w-6 h-6 p-0  rounded-full'></Button>
								<span>{statistics?.active_reservations}</span>
							</div>
							<span>{t('statistics.sametimebooks')}</span>
						</div>
					</div>
				</CardHeader>
				<CardContent className=' pb-0'>
					<ChartContainer
						config={chartConfig}
						className='mx-auto  aspect-square max-h-[250px]'
					>
						<PieChart>
							<ChartTooltip
								cursor={false}
								contentStyle={{
									backgroundColor: 'white',
									border: '1px solid #ccc',
									borderRadius: '4px',
								}}
							/>
							<Pie
								data={chartData}
								dataKey='visitors'
								nameKey='browser'
								innerRadius={75}
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
						</PieChart>
					</ChartContainer>
				</CardContent>
			</Card>
		</div>
	)
}

export default AllBooks
