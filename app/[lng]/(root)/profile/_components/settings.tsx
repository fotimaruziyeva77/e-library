import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useEffect, useState } from 'react'

import axios from 'axios'
import { toast } from 'sonner'
import Cookies from 'js-cookie'
import { APISERVICE } from '@/services/api-service'
import useTranslate from '@/hooks/use-translate'


interface IProps {
	imageId?: number | null
	setRating: (rate: string) => void
}

function Settings({ imageId, setRating }: IProps) {
	const token = Cookies.get('access')
	const library_id = Cookies.get('library_id')
	const t = useTranslate()
	const [verified, setVerified] = useState(true)
	const [userData, setUserData] = useState({
		name: '',
		surname: '',
		phone: '',
		username: '',
		gender: '',
		birthdate: '',
		docnumber: '',
		doctype: '',
		photo: imageId ?? null,
		image1: '',
		image2: '',
	})
	const [refresh, setRefresh] = useState(false)

	useEffect(() => {
		const fetchData = async () => {
			await axios
				.get(`${APISERVICE.profile}/${library_id}/`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then(res => {
					setUserData({
						name: res.data.first_name || '',
						surname: res.data.last_name || '',
						phone: res.data.phone_number || '',
						username: res.data.telegram_username || '',
						gender: res.data.gender || '',
						birthdate: res.data.birth_date || '',
						docnumber: res.data.document_number || '',
						doctype: res.data.verification_type || '',
						photo: res.data.photo_path || '/photo.png',
						image1: res.data.document_file1_path || null,
						image2: res.data.document_file2_path || null,
					})
					setRating(res.data.rating)
					setVerified(res.data.is_verified)
				})
				.catch(err => console.log(err))
		}
		if (token) fetchData()
	}, [refresh, token, library_id, setRating])

	const handleSave = async () => {

		const data = {
			first_name: userData.name,
			last_name: userData.surname,
			gender: userData.gender,
			telegram_username: userData.username,
			birth_date: userData.birthdate,
			verification_type: userData.doctype,
			document_number: userData.docnumber,
		}

		try {
			await axios.patch(`${APISERVICE.profile}/${library_id}/`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			toast.success(t('success.updateprofile'), {
				position: 'top-center',
				richColors: true,
			})
			setRefresh(!refresh)
		} catch (error: any) {
			console.log(error)
			const errorData = error?.response?.data
			if (errorData) {
				Object.entries(errorData).forEach(([key, value]) => {
					const msg = Array.isArray(value) ? value.join(', ') : value
					toast.error(`${msg}`, {
						position: 'top-center',
						richColors: true,
					})
					console.log(`${key}: ${msg}`)
				})
			} else {
				toast.error(t('Error: Something wrong!'), {
					position: 'top-center',
					richColors: true,
				})
			}
		}
	}

	return (
		<div className='w-full'>
			<div className='bg-white rounded-xl border border-solid border-[#00000012] sm:p-6 p-4 md:p-8'>
				<h1 className='sm:text-2xl text-xl md:text-3xl font-bold text-gray-800 mb-6'>
					{t('profile.profilesettings')}
				</h1>

				<div className='space-y-6'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label className='text-gray-700'>
								{' '}
								{t('register.registername')}
							</Label>
							<Input
								className='w-full p-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-black'
								value={userData.name}
								onChange={e =>
									setUserData(prev => ({ ...prev, name: e.target.value }))
								}
							/>
						</div>
						<div className='space-y-2'>
							<Label className='text-gray-700'>
								{t('register.registersurname')}
							</Label>
							<Input
								className='w-full p-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-black'
								value={userData.surname}
								onChange={e =>
									setUserData(prev => ({ ...prev, surname: e.target.value }))
								}
							/>
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label className='text-gray-700'>
								{t('register.registerphone')}
							</Label>
							<Input
								className='w-full p-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-black'
								value={userData.phone}
								onChange={e =>
									setUserData(prev => ({ ...prev, phone: e.target.value }))
								}
							/>
						</div>
						<div className='space-y-2'>
							<Label className='text-gray-700'>
								{t('register.registertusername')}
							</Label>
							<Input
								className='w-full p-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-black'
								value={userData.username}
								onChange={e =>
									setUserData(prev => ({ ...prev, username: e.target.value }))
								}
							/>
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label className='text-gray-700'>
								{t('register.registergender')}
							</Label>
							<Select
								value={userData.gender}
								onValueChange={value =>
									setUserData(prev => ({ ...prev, gender: value }))
								}
							>
								<SelectTrigger className='w-full p-3 border border-solid border-[#00000025]'>
									<SelectValue placeholder='Жинси' />
								</SelectTrigger>
								<SelectContent className='bg-white'>
									<SelectItem value='male'>
										{t('register.registermale')}
									</SelectItem>
									<SelectItem value='female'>
										{t('register.registerfemale')}
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className='space-y-2'>
							<Label className='text-gray-700'>
								{t('register.registerdateofbirth')}
							</Label>
							<Input
								type='date'
								className='w-full p-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-black'
								value={userData.birthdate}
								onChange={e =>
									setUserData(prev => ({ ...prev, birthdate: e.target.value }))
								}
							/>
						</div>
					</div>

					{!verified ? (
						<>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label className='text-gray-700'>
										{t('register.registerdocumentnumber')}
									</Label>
									<Input
										className='w-full p-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-black uppercase'
										maxLength={10}
										value={userData.docnumber}
										onChange={e => {
											setUserData(prev => ({
												...prev,
												docnumber: e.target.value,
											}))
										}}
									/>
								</div>
							</div>

							<div className='space-y-4'>
								<Label className='text-gray-700'>
									{t('register.registerdocument')}
								</Label>
								<RadioGroup
									value={userData.doctype}
									onValueChange={value =>
										setUserData(prev => ({ ...prev, doctype: value }))
									}
								>
									<div className='flex items-center space-x-2'>
										<RadioGroupItem value='passport' id='option-one' />
										<Label htmlFor='option-one' className='text-gray-700'>
											{t('register.registerdocument1')}
										</Label>
									</div>
									<div className='flex items-center space-x-2'>
										<RadioGroupItem value='birth_certificate' id='option-two' />
										<Label htmlFor='option-two' className='text-gray-700'>
											{t('register.registerdocument2')}
										</Label>
									</div>
								</RadioGroup>
							</div>
							<div>
								
							</div>
						</>
					) : (
						<>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label className='text-gray-700'>
										{t('register.registerdocumentnumber')}
									</Label>
									<Input
										className='w-full p-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-black uppercase'
										maxLength={10}
										value={userData.docnumber}
										disabled
									/>
								</div>
									<div className='space-y-4'>
								<Label className='text-gray-700'>
									{t('register.registerdocument')}
								</Label>
								<RadioGroup value={userData.doctype} disabled>
									<div className='flex items-center space-x-2'>
										<RadioGroupItem value='passport' id='option-one' />
										<Label htmlFor='option-one' className='text-gray-700'>
											{t('register.registerdocument1')}
										</Label>
									</div>
									<div className='flex items-center space-x-2'>
										<RadioGroupItem value='birth_certificate' id='option-two' />
										<Label htmlFor='option-two' className='text-gray-700'>
											{t('register.registerdocument2')}
										</Label>
									</div>
								</RadioGroup>
							</div>
							</div>

						
							
						</>
					)}

					<div className='pt-6 flex items-center justify-center'>
						<Button
							className='w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm'
							onClick={handleSave}
						>
							{t('register.save')}
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Settings
