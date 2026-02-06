'use client'

import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { APISERVICE } from '@/services/api-service'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import useTranslate from '@/hooks/use-translate'
import Cookies from 'js-cookie'

interface IProps {
	userId: number
	setClose: (close: boolean) => void
}

export default function FillInfo({ userId, setClose }: IProps) {
	const library_id = Cookies.get('library_id')

	const t = useTranslate()
	const formSchema = z.object({
		first_name: z.string().min(3).max(20),
		last_name: z.string().min(3).max(20),
		gender: z.string().min(3).max(20),
		telegram_username: z.string().min(3).max(20),
		password: z.string().min(3).max(20),
		birthday: z.string().min(3).max(20),
		verification_type: z.string().min(3).max(20),
		library: z.string(),
		document_number: z.string().length(9),
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			first_name: '',
			last_name: '',
			gender: '',
			telegram_username: '',
			password: '',
			birthday: '',
			verification_type: '',
			library: '',
			document_number: '',
		},
	})

	async function handleSubmit(values: z.infer<typeof formSchema>) {
		const data = {
			library: library_id,
			first_name: values.first_name,
			last_name: values.last_name,
			gender: values.gender,
			telegram_username: values.telegram_username,
			password: values.password,
			birth_date: values.birthday,
			verification_type: values.verification_type,
			document_number: values.document_number,
			user: userId,
		}

		console.log(data)

		try {
			await axios.post(APISERVICE.step2, data)
			toast.success(t('success.registerSuccess'), {
				position: 'top-center',
				richColors: true,
			})
			setClose(true)
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<Form {...form}>
			<form
				className='flex flex-col sm:gap-6 gap-3'
				onSubmit={form.handleSubmit(handleSubmit)}
			>
				<h1 className='font-roboto text-xl text-center'>
					{t('register.registertext')}
				</h1>
				<div className='sm:space-y-8 space-y-3'>
					<div className='grid grid-cols-1 md:grid-cols-2 sm:gap-4 gap-2'>
						<FormField
							control={form.control}
							name='first_name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('register.registername')}</FormLabel>
									<FormControl>
										<Input
											placeholder={t('register.registername')}
											{...field}
											className='w-full rounded-md placeholder:text-sm border border-gray-200 px-2 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400'
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='last_name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('register.registersurname')}</FormLabel>
									<FormControl>
										<Input
											placeholder={t('register.registersurname')}
											{...field}
											className='w-full rounded-md placeholder:text-sm border border-gray-200 px-2 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400'
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<FormField
							control={form.control}
							name='gender'
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('register.registergender')}</FormLabel>
									<Select value={field.value} onValueChange={field.onChange}>
										<FormControl>
											<SelectTrigger className='w-full border border-solid border-[#00000012]'>
												<SelectValue
													placeholder={t('register.registergender')}
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent className='bg-white'>
											<SelectItem value='male'>
												{t('register.registermale')}
											</SelectItem>
											<SelectItem value='female'>
												{t('register.registerfemale')}
											</SelectItem>
										</SelectContent>
									</Select>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='telegram_username'
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('register.registertusername')}</FormLabel>
									<FormControl>
										<Input
											placeholder={t('register.registertusername')}
											{...field}
											className='w-full rounded-md placeholder:text-sm border border-gray-200 px-2 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400'
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>

					{/* Password and Birthday */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('register.registerpassword')}</FormLabel>
									<FormControl>
										<Input
											placeholder={t('register.registerpassword')}
											{...field}
											className='w-full rounded-md placeholder:text-sm border border-gray-200 px-2 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400'
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='birthday'
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('register.registerdateofbirth')}</FormLabel>
									<FormControl>
										<Input
											type='date'
											{...field}
											placeholder='кк.оо.йййй'
											className='w-full rounded-md placeholder:text-sm border border-gray-200 px-2 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400'
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>

					{/* Document Type */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<FormField
							control={form.control}
							name='verification_type'
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('register.registerdocument')}</FormLabel>
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											defaultValue={field.value}
											className='flex items-center space-x-6'
										>
											<div className='flex items-center space-x-2'>
												<RadioGroupItem value='passport' id='passport' />
												<Label htmlFor='passport'>
													{t('register.registerdocument1')}
												</Label>
											</div>
											<div className='flex items-center space-x-2'>
												<RadioGroupItem
													value='birth_certificate'
													id='guvohnoma'
												/>
												<Label htmlFor='guvohnoma'>
													{t('register.registerdocument2')}
												</Label>
											</div>
										</RadioGroup>
									</FormControl>
								</FormItem>
							)}
						/>
							<FormField
								control={form.control}
								name='document_number'
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{t('register.registerdocumentnumber')}
										</FormLabel>
										<FormControl>
											<Input
												placeholder={t('register.registerdocumentnumber')}
												{...field}
												className='w-full rounded-md placeholder:text-sm border border-gray-200 px-2 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400'
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
					</div>
					
				
				<div className='pt-6 flex items-center justify-center'>
					<Button
						type='submit'
						className='w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm'
					>
						{t('register.save')}
					</Button>
				</div>
			</form>
		</Form>
	)
}
