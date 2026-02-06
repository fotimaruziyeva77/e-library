import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'

interface ImageUploaderProps {
	apiEndpoint: string
	defaultValue?: string | null
	isDelete?: boolean
	productId?: number
	imageId?: number
	resetImage?: boolean
	onUploadSuccess: (id: number) => void
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
	apiEndpoint,
	onUploadSuccess,
	defaultValue,
	resetImage,
}) => {
	const [previewImage, setPreviewImage] = useState<string | null>(
		defaultValue || null
	)

	useEffect(() => {
		setPreviewImage(defaultValue || null) 
	}, [defaultValue])
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		const maxFileSizeMB = 2
		if (file) {
			if (file.size / 1024 / 1024 > maxFileSizeMB) {
				toast.warning(`File size exceeds ${maxFileSizeMB}MB limit.`, {
					position: 'top-center',
					richColors: true,
				})
				return
			}
			const reader = new FileReader()
			reader.onloadend = () => {
				setPreviewImage(reader.result as string)
			}
			reader.readAsDataURL(file)

			uploadImage(file)
		}
	}

	const uploadImage = async (file: File) => {
		const formData = new FormData()
		formData.append('file', file)
		formData.append('type', 'image')

		try {
			const response = await fetch(apiEndpoint, {
				method: 'POST',
				body: formData,
			})

			if (!response.ok) {
				throw new Error('Failed to upload image')
			}

			const data = await response.json()
			const uploadedId = parseInt(data.id)
			onUploadSuccess(uploadedId)
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		if (resetImage) {
			setPreviewImage(null)
		}
	}, [resetImage])

	const triggerFileInput = () => {
		fileInputRef.current?.click()
	}

	return (
		<div className='flex flex-col items-center  justify-around gap-1'>
			<div
				onClick={triggerFileInput}
				className='flex size-20 cursor-pointer items-center justify-center overflow-hidden rounded-sm border border-solid border-[#00000012] p-3'
			>
				{previewImage ? (
					<Image
						src={previewImage}
						alt='Uploaded Image'
						width={96}
						height={96}
						className='h-full w-auto min-w-max object-cover'
					/>
				) : (
					<Image
						src={'/assets/camera.png'}
						alt='Camera Placeholder'
						width={96}
						height={96}
					/>
				)}
			</div>

			<input
				type='file'
				accept='image/jpg,image/jpeg,image/png'
				className='hidden'
				ref={fileInputRef}
				onChange={handleImageChange}
			/>
		</div>
	)
}

export default ImageUploader
