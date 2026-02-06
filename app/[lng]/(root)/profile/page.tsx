'use client'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import {
	BookMarkedIcon,
	ImagePlus,
	Save,
	SettingsIcon,
	Star,
} from 'lucide-react'
import Settings from './_components/settings'
import Saved from './_components/saved'
import { cn } from '@/lib/utils'
import useAuth from '@/hooks/use-auth'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { APISERVICE } from '@/services/api-service'
import UserBooks from './_components/user-books'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import axios from 'axios'
import useTranslate from '@/hooks/use-translate'

function Profile() {
	const [activeTab, setActiveTab] = useState('tab1')
	const { data } = useAuth()
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [preview, setPreview] = useState<string | null>(null)
	const [imageId, setImageId] = useState<number | null>(null)
	const [ratingScore, setRatingScore] = useState('')
	const router = useRouter()
	const token = Cookies.get('access')
	const libraryId = Cookies.get('library_id')
	const t = useTranslate()

	useEffect(() => {
		const fetchData = async () => {
			await axios
				.get(`${APISERVICE.profile}/${libraryId}/`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then(() => {})
				.catch((err: any) => {
					if (err?.response?.status === 401) {
						toast.error('Iltimos oldin tizimga kiring!', {
							position: 'top-center',
							richColors: true,
						})
						router.push('/?mode=auth')
					} else {
						console.error(err)
						toast.error('Xatolik yuz berdi!', {
							position: 'top-center',
							richColors: true,
						})
						router.push('/')
					}
				})
		}
		fetchData()
	}, [data, libraryId, router, token])

	const handleUploadClick = () => {
		fileInputRef.current?.click()
	}

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		const localUrl = URL.createObjectURL(file)
		setPreview(localUrl)

		await uploadImage(file)
	}

	const uploadImage = async (file: File) => {
		const formData = new FormData()
		formData.append('file', file)
		formData.append('type', 'image')

		try {
			const response = await fetch(APISERVICE.mediaUpload, {
				method: 'POST',
				body: formData,
			})

			if (!response.ok) {
				throw new Error('Failed to upload image')
			}

			const data = await response.json()
			const uploadedId = parseInt(data.id)
			setImageId(uploadedId)
		} catch (error) {
			console.error('Upload error:', error)
		}
	}

	return (
		<div className='min-h-screen h-full sm:py-18 py-14 w-full'>
			<div className='w-full bg-white py-3 sm:border-none border-y border-solid border-[#00000025] sm:px-0 px-3'>
				<Breadcrumb className='max-w-[1400px] m-auto'>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink
								href='/'
								className='text-[#3F51B5] text-base font-semibold'
							>
								{t('nav-link.homepage')}
							</BreadcrumbLink>
						</BreadcrumbItem>
						<span>/</span>
						<BreadcrumbItem>
							<BreadcrumbPage className='text-base font-semibold text-gray-500'>
								{t('nav-link.profile')}
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
			<div className='max-w-[1400px] m-auto w-full sm:py-6 py-3 px-3 sm:px-0'>
				<div className='bg-white rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 border border-solid border-[#00000012]'>
					<div className='relative w-32 h-32 md:w-40 md:h-40'>
						<Image
							src={preview || data?.photo_path || '/assets/profile.png'}
							alt='person'
							fill
							className='rounded-full object-cover '
						/>
						<input
							type='file'
							accept='image/*'
							className='hidden'
							ref={fileInputRef}
							onChange={handleFileChange}
						/>
						<button
							className={cn(
								'absolute bottom-0 right-0 -translate-1/3 p-1.5 rounded-full aspect-square bg-blue-700 text-white cursor-pointer',
								activeTab !== 'tab1' && 'hidden'
							)}
							onClick={handleUploadClick}
						>
							<ImagePlus size={18} />
						</button>
					</div>
					<div className='text-center md:text-left'>
						<h1 className='text-2xl md:text-3xl font-bold text-gray-800'>
							{data?.first_name} {data?.last_name}
						</h1>
						<p className='text-gray-600 mt-2'></p>
						<div className='mt-3'>
							<div className='flex items-center gap-1'>
								<p> {t('profile.profileratings')}:</p> {ratingScore}{' '}
								<span className='flex items-center gap-2 text-amber-600 font-semibold'>
									<Star size={18} fill='oklch(66.6% 0.179 58.318)' />
								</span>
							</div>
						</div>
					</div>
				</div>
				<div className='flex flex-col md:flex-row gap-6 mt-8 '>
					<div className='w-full md:basis-1/4'>
						<div className='bg-white rounded-xl border border-solid border-[#00000012] py-3 space-y-4'>
							<button
								className={cn(
									'flex items-center gap-3 p-3 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium w-full cursor-pointer',
									activeTab === 'tab1'
										? 'text-blue-700 border-l-[3px] border-blue-700'
										: 'text-gray-700'
								)}
								onClick={() => setActiveTab('tab1')}
							>
								<SettingsIcon className='w-5 h-5' />
								{t('profile.profilesettings')}
							</button>
							<button
								className={cn(
									'flex items-center gap-3 p-3 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium w-full cursor-pointer',
									activeTab === 'tab2'
										? 'text-blue-700 border-l-[3px] border-blue-700'
										: 'text-gray-700'
								)}
								onClick={() => setActiveTab('tab2')}
							>
								<BookMarkedIcon className='w-5 h-5' />
								{t('profile.profilebooks')}
							</button>
							<button
								className={cn(
									'flex items-center gap-3 p-3 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium w-full cursor-pointer',
									activeTab === 'tab3'
										? 'text-blue-700 border-l-[3px] border-blue-700'
										: 'text-gray-700'
								)}
								onClick={() => setActiveTab('tab3')}
							>
								<Save className='w-5 h-5' />
								{t('profile.profileOccupied')}
							</button>
						</div>
					</div>
					{activeTab === 'tab1' && (
						<div className='basis-3/4 w-full '>
							<Settings
								imageId={imageId && imageId}
								setRating={rate => setRatingScore(rate)}
							/>
						</div>
					)}
					{activeTab === 'tab2' && (
						<div className='basis-3/4 w-full '>
							<UserBooks />
						</div>
					)}
					{activeTab === 'tab3' && (
						<div className='basis-3/4 w-full'>
							<Saved />
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default Profile
