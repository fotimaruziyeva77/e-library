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
import { useEffect, useState } from 'react'
import { Pie, Label, PieChart } from 'recharts'
import Cookies from 'js-cookie'

const chartConfig = {
	readers: {
		label: 'Readers',
	},
	male: {
		label: 'Erkaklar',
		color: '#FF92AE',
	},
	female: {
		label: 'Ayollar',
		color: '#A6B7D4',
	},
} satisfies ChartConfig
function Readers() {
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
	return (
		<div>
			<Card className='flex flex-col border border-solid border-[#00000025] w-auto h-[430px]'>
				<CardHeader className='flex items-center justify-center flex-col gap-4 '>
					<CardTitle className='md:text-2xl text-xl'>
						{t('statistics.statisticsreaders')}
					</CardTitle>
					<div className='flex items-center justify-center gap-10'>
						<div className='flex flex-col'>
							<div className='flex gap-2'>
								<Button className='bg-[#A6B7D4] hover:bg-[#A6B7D4]  w-6 h-6 p-0  rounded-full'></Button>
								<span>{statistics?.male_members}</span>
							</div>
							<span>{t('statistics.male')}</span>
						</div>
						<div className='flex flex-col'>
							<div className='flex gap-2'>
								<Button className='bg-[#FF92AE] hover:bg-[#FF92AE] w-6 h-6 p-0  rounded-full'></Button>
								<span>{statistics?.female_members}</span>
							</div>
							<span>{t('statistics.female')}</span>
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
								data={[
									{
										visitorType: t('statistics.male'),
										visitors: statistics?.male_members ?? 0,
										fill: 'var(--color-chrome)',
									},
									{
										visitorType: t('statistics.female'),
										visitors: statistics?.female_members ?? 0,
										fill: 'var(--color-safari)',
									},
								]}
								dataKey='visitors'
								nameKey='visitorType'
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
														{statistics?.total_members}
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

export default Readers
