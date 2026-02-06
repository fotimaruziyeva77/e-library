'use client'
import { useState, useEffect, useRef } from 'react'
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from '@/components/ui/input-otp'
import axios from 'axios'
import { APISERVICE } from '@/services/api-service'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { RefreshCcw } from 'lucide-react'
import useTranslate from '@/hooks/use-translate'
import Cookies from 'js-cookie'
import { cn } from '@/lib/utils'

interface IProps {
	setWindow: (type: string) => void
	phone: string
	setUserId: (id: number) => void
}

export default function VerifyForm({ setWindow, phone, setUserId }: IProps) {
	const library_id = Cookies.get('library_id')
	const [code, setCode] = useState('')
	const [timeLeft, setTimeLeft] = useState(120)
	const timerRef = useRef<NodeJS.Timeout | null>(null)
	const t = useTranslate()
	useEffect(() => {
		timerRef.current = setInterval(() => {
			setTimeLeft(prev => {
				if (prev <= 1 && timerRef.current) {
					clearInterval(timerRef.current)
					return 0
				}
				return prev - 1
			})
		}, 1000)

		return () => {
			if (timerRef.current) clearInterval(timerRef.current)
		}
	}, [timeLeft])

	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60)
			.toString()
			.padStart(2, '0')
		const s = (seconds % 60).toString().padStart(2, '0')
		return `${m}:${s}`
	}

	const handleVerify = async () => {
		const data = {
			phone_number: phone,
			library_id,
			otp_code: code,
		}
		console.log(data)

		try {
			await axios
				.post(APISERVICE.verify, data)
				.then(res => setUserId(res.data.user_id))
			toast.success(t('success.confirmationSuccess'), {
				position: 'top-center',
				richColors: true,
			})

			setWindow('fill-info')
		} catch (error) {
			console.log(error)
			toast.error(t('notification.confirmationError'), {
				position: 'top-center',
				richColors: true,
			})
		}
	}

	function handleSubmit() {
		const data = {
			phone_number: phone,
			library_id,
		}

		try {
			axios.post(APISERVICE.step1, data).then(res => {
				toast.success(t('loginbutton.verifycode'), {
					position: 'top-right',
					richColors: true,
				})
				setTimeLeft(120)
				console.log(res)
			})
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className='flex flex-col gap-4 md:p-4 p-0 w-full max-w-sm mx-auto'>
			<div className='flex items-center justify-center'>
				<InputOTP maxLength={6} onChange={value => setCode(value)}>
					<InputOTPGroup className='flex gap-2'>
						<InputOTPSlot
							index={0}
							className='md:size-12 size-10 text-xl border-2 border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
						/>
						<InputOTPSlot
							index={1}
							className='md:size-12 size-10 text-xl border-2 border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
						/>
						<InputOTPSlot
							index={2}
							className='md:size-12 size-10 text-xl border-2 border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
						/>
						<InputOTPSlot
							index={3}
							className='md:size-12 size-10 text-xl border-2 border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
						/>
						<InputOTPSlot
							index={4}
							className='md:size-12 size-10 text-xl border-2 border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
						/>
						<InputOTPSlot
							index={5}
							className='md:size-12 size-10 text-xl border-2 border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
						/>
					</InputOTPGroup>
				</InputOTP>
			</div>
			<span className='text-center text-gray-600 font-medium'>
				{formatTime(timeLeft)}
			</span>
			<button
				onClick={handleSubmit}
				disabled={timeLeft > 0}
				className={cn(
					'text-blue-600 text-center font-semibold py-1.5 px-2 rounded-md md:text-base text-sm bg-neutral-400/25 backdrop-blur-md cursor-pointer flex items-center justify-center gap-1',
					timeLeft !== 0 ? 'text-gray-600 cursor-not-allowed' : 'text-blue-600'
				)}
			>
				<RefreshCcw size={16} />

				{t('loginbutton.sendBack')}
			</button>
			<Button
				onClick={handleVerify}
				className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition md:text-base text-sm'
			>
				{t('loginbutton.confirm')}
			</Button>
		</div>
	)
}
