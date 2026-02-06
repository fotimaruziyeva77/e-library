'use client'

import axios from 'axios'
import Cookies from 'js-cookie'
import { toast } from 'sonner'
import { PhoneInput } from 'react-international-phone'
import { useState } from 'react'
import { APISERVICE } from '@/services/api-service'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useTranslate from '@/hooks/use-translate'
import { Eye, EyeOff } from 'lucide-react'

interface IProps {
	setWindow: (type: string) => void
	setClose: (close: boolean) => void
}

export default function LoginForm({ setWindow, setClose }: IProps) {
	const [phone, setPhone] = useState<string>('+998')
	const [password, setPassword] = useState<string>('')
	const [showPassword, setShowPassword] = useState(false)
	const t = useTranslate()
	const handleSet = (mode: string) => {
		setWindow(mode)
	}

	const handleSubmit = async () => {
		const data = {
			phone_number: phone,
			password: password,
			library_id: Cookies.get('library_id'),
		}

		try {
			const res = await axios.post(APISERVICE.login, data)

			Cookies.set('refresh', res.data.refresh)
			Cookies.set('access', res.data.access)
			Cookies.set('user_id', res.data.user_id)
			Cookies.set('phone_number', res.data.phone_number)

			setClose(true)

			toast.success(t('success.loginSuccess'), {
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
					<Label className='text-sm text-neutral-500 font-semibold'>
						{t('loginbutton.phone')}
					</Label>

					<PhoneInput
						defaultCountry='uz'
						value={phone}
						onChange={phone => setPhone(phone)}
						inputStyle={{
							padding: '5px 10px',
							border: '1px solid #00000050',
							borderRadius: '7px',
							width: '100%',
							outline: 'none',
							marginTop: '0',
						}}
						hideDropdown
					/>
				</div>
				<div className='flex flex-col gap-1'>
					<div className='flex items-center justify-between'>
						<Label className='text-sm text-neutral-500 font-semibold'>
							{t('loginbutton.password')}
						</Label>
						<button
							onClick={() => handleSet('reset-password')}
							className='text-xs text-blue-500 cursor-pointer font-semibold underline italic'
						>{t('loginbutton.forgotpassword')}
						</button>
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
				<button
					className='px-4 py-2 text-base md:text-lg bg-[#3F51B5] hover:bg-[#3F51B5] text-white rounded-lg cursor-pointer my-10'
					onClick={handleSubmit}
				>
					{t('loginbutton.login')}
				</button>
			</div>
			<div className='flex flex-col'>
				<p className='text-sm text-muted-foreground text-center font-medium'>
					{t('loginbutton.noaccount')}
				</p>
				<button
					onClick={() => handleSet('register')}
					className='text-sm text-blue-500 cursor-pointer font-semibold underline'
				>
					{t('register.registertext')}
				</button>
			</div>
		</div>
	)
}
