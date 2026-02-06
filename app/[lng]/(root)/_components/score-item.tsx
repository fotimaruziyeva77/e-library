import { Progress } from '@/components/ui/progress'
import { Star } from 'lucide-react'
import React from 'react'

interface IProps {
	num: number
	score?: number
}

function ScoreItem({ score, num }: IProps) {
	console.log(typeof score)
	return (
		<div className='flex items-center gap-3 py-1'>
			<div className='flex items-center gap-1 w-8'>
				<Star className='w-4 h-4 text-orange-400 fill-orange-400' />
				<span className='text-sm font-semibold'>{num}</span>
			</div>

			<div className='w-40'>
				<Progress
					value={parseFloat(String(score)) || 0}
					className='h-2 bg-muted'
					style={{ '--progress-bar': '#3F51B5' } as React.CSSProperties}
				/>
			</div>

			<span className='text-sm w-10 text-right'>{score} %</span>
		</div>
	)
}

export default ScoreItem
