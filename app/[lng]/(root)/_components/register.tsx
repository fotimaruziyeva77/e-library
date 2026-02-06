'use client'

import axios from 'axios'
import { APISERVICE } from '@/services/api-service'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { PhoneInput } from 'react-international-phone'
import { useState } from 'react'
import useTranslate from '@/hooks/use-translate'
import Cookies from 'js-cookie'

interface IProps {
	setWindow: (type: string) => void
	setPhone: (phone: string) => void
}

export default function Register({ setWindow, setPhone }: IProps) {
	const handleSet = () => {
		setWindow('login')
	}
	const [phoneNumber, setPhoneNumber] = useState<string>('+998')
	const t = useTranslate()

	const handleSubmit = async () => {
		const data = {
			library_id: Cookies.get('library_id'),
			phone_number: phoneNumber,
		}

		try {
			const res = await axios.post(APISERVICE.step1, data)

			toast.success(t('loginbutton.verifycode'), {
				position: 'top-center',
				richColors: true,
			})

			console.log(res)
			setWindow('verify')
			setPhone(phoneNumber)
		} catch (error: any) {
			if (axios.isAxiosError(error) && error.response?.data) {
				const errors = error.response.data

				if (Array.isArray(errors)) {
					errors.forEach((msg: string) => {
						toast.error(msg, {
							position: 'top-center',
							richColors: true,
						})
					})
				} else if (typeof errors === 'string') {
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
						} else if (typeof errors[key] === 'string') {
							toast.error(errors[key], {
								position: 'top-center',
								richColors: true,
							})
						}
					}
				}
			} else {
				toast.error(t('notification.unknownServerError'), {
					position: 'top-center',
					richColors: true,
				})
				console.error('Unknown error:', error)
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
						value={phoneNumber}
						onChange={phone => setPhoneNumber(phone)}
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

				<button
					className='px-4 py-2 text-base md:text-lg bg-[#3F51B5] hover:bg-[#3F51B5] text-white rounded-lg cursor-pointer my-10'
					onClick={handleSubmit}
				>
					{t('loginbutton.continue')}
				</button>
			</div>
			<div className='flex flex-col'>
				<p className='text-sm text-muted-foreground text-center font-medium'>
					{t('loginbutton.noaccount')}
				</p>
				<button
					onClick={handleSet}
					className='text-sm text-blue-500 cursor-pointer font-semibold underline'
				>
					{t('loginbutton.logintext')}
				</button>
			</div>
		</div>
	)
}
