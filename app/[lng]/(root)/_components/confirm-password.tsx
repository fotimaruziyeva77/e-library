'use client'

import axios from 'axios'
import Cookies from 'js-cookie'
import { toast } from 'sonner'
import { useState } from 'react'
import { APISERVICE } from '@/services/api-service'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useTranslate from '@/hooks/use-translate'
import { Eye, EyeOff } from 'lucide-react'

interface IProps {
	setClose: (close: boolean) => void
	user: number
}

export default function ConfirmPassword({ setClose, user }: IProps) {
	const [password, setPassword] = useState<string>('')
	const [confirmPassword, setConfirmPassword] = useState<string>('')
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const t = useTranslate()

	const handleSubmit = async () => {
		const data = {
			id: user,
			password: password,
			confirm_password: confirmPassword,
			library_id: Cookies.get('library_id'),
		}

		try {
			await axios.post(APISERVICE.resetPassword, data)

			setClose(true)

			toast.success(t('success.success'), {
				position: 'top-center',
				richColors: true,
			})
			if (window) window.location.reload()
		} catch (error: any) {
			if (axios.isAxiosError(error) && error.response?.data) {
				const errors = error.response.data

				if (typeof errors === 'string') {
					toast.error(errors, {
						position: 'top-center',
						richColors: true,
					})
				} else if (typeof errors === 'object') {
					for (const key in errors) {
						if (Array.isArray(errors[key])) {
							errors[key].forEach((msg: string) => {
								toast.error(msg, {
									position: 'top-center',
									richColors: true,
								})
							})
						}
					}
				}
			} else {
				toast.error(t('notification.unknownServerError'), {
					position: 'top-center',
					richColors: true,
				})
				console.error(error)
			}
		}
	}

	return (
		<div className='md:px-20 md:mt-10 p-0'>
			<div className='flex flex-col gap-3'>
				<div className='flex flex-col gap-1'>
					<div className='flex items-center justify-between'>
						<Label className='text-sm text-neutral-500 font-semibold'>
							{t('loginbutton.password')}
						</Label>
					</div>
					<div className='relative'>
						<Input
							type={showPassword ? 'text' : 'password'}
							placeholder={t('loginbutton.password')}
							onChange={e => setPassword(e.target.value)}
							className='border-[#00000050] pr-10'
						/>
						<div
							className='absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-gray-500'
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
						</div>
					</div>
				</div>
				<div className='flex flex-col gap-1'>
					<div className='flex items-center justify-between'>
						<Label className='text-sm text-neutral-500 font-semibold'>
							{t('loginbutton.password')}
						</Label>
					</div>
					<div className='relative'>
						<Input
							type={showConfirmPassword ? 'text' : 'password'}
							placeholder={t('loginbutton.password')}
							onChange={e => setConfirmPassword(e.target.value)}
							className='border-[#00000050] pr-10'
						/>
						<div
							className='absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-gray-500'
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
						>
							{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
						</div>
					</div>
				</div>
				<button
					className='px-4 py-2 text-base md:text-lg bg-[#3F51B5] hover:bg-[#3F51B5] text-white rounded-lg cursor-pointer my-10'
					onClick={handleSubmit}
				>
					{t('register.save')}
				</button>
			</div>
		</div>
	)
}
