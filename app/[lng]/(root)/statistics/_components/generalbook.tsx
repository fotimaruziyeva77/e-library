import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '@/components/ui/card'
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart'
import useTranslate from '@/hooks/use-translate'
import React from 'react'
import { CartesianGrid, YAxis, XAxis, Bar, LabelList, BarChart } from 'recharts'

const chartdata = [
	{ desktop: 500235, mobile: 300 },
	{ desktop: 235300, mobile: 200000 },
	{ desktop: 213405, mobile: 120 },
	{ desktop: 403124, mobile: 190 },
	{ desktop: 213147, mobile: 130 },
]

const chartConfigs = {
	desktop: {
		label: 'Desktop',
		color: 'hsl(var(--chart-1))',
	},
	mobile: {
		label: 'Mobile',
		color: 'hsl(var(--chart-2))',
	},
	label: {
		color: 'hsl(var(--background))',
	},
} satisfies ChartConfig
function Generalbook() {
	const t = useTranslate()
	return (
		<div>
			<Card className='flex flex-col border border-solid border-[#00000025] w-auto h-[430px]'>
				<CardHeader>
					<CardTitle>{t('statistics.allbooknumber')}</CardTitle>
					<CardDescription>January - June 2024</CardDescription>
				</CardHeader>
				<CardContent>
					<ChartContainer config={chartConfigs}>
						<BarChart
							accessibilityLayer
							data={chartdata}
							layout='vertical'
							margin={{
								right: 16,
							}}
						>
							<CartesianGrid horizontal={false} />
							<YAxis
								dataKey='month'
								type='category'
								tickLine={false}
								tickMargin={10}
								axisLine={false}
								tickFormatter={value => value.slice(0, 3)}
								hide
							/>
							<XAxis dataKey='desktop' type='number' hide />
							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent indicator='line' />}
							/>
							<Bar
								dataKey='desktop'
								layout='vertical'
								fill='var(--color-desktop)'
								radius={4}
							>
								<LabelList
									dataKey='month'
									position='insideLeft'
									offset={8}
									className='fill-[--color-label]'
									fontSize={12}
								/>
								<LabelList
									dataKey='desktop'
									position='right'
									offset={8}
									className='fill-foreground'
									fontSize={12}
								/>
							</Bar>
						</BarChart>
					</ChartContainer>
				</CardContent>
			</Card>
		</div>
	)
}

export default Generalbook
