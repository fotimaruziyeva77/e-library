'use client'
import { useState } from 'react'
import {Dialog,DialogContent,DialogHeader,DialogTitle,} from '@/components/ui/dialog'
import LoginForm from './loginform'
import VerifyForm from './verify'
import { X } from 'lucide-react'
import FillInfo from './fill-info'
import Register from './register'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import useTranslate from '@/hooks/use-translate'
import ResetPassword from './reset-password'
import ConfirmPassword from './confirm-password'
import ResetVerifyForm from './reset-verify'
export default function AuthDialog({
	open,
	setOpen,
}: {
	open: boolean
	setOpen: (val: boolean) => void
}) {
	const [step, setStep] = useState<string>('login')
	const [phoneNumber, setPhoneNumber] = useState('')
	const [userId, setUserId] = useState<number>()
	const router = useRouter()
	const searchParams = useSearchParams()
	const path = usePathname()
	const t = useTranslate()
	const handleClose = () => {
		const params = new URLSearchParams(searchParams.toString())
		params.delete('mode')
		const newQuery = params.toString()
		const newUrl = newQuery ? `${path}?${newQuery}` : path

		router.replace(newUrl)
		setStep('login')
		setOpen(false)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='sm:max-w-[700px] bg-white overflow-x-auto max-h-dvh'>
				<DialogHeader>
					<DialogTitle className='text-center md:text-2xl text-lg'>
						{step === 'login' && t('navbar.login')}
						{step === 'verify' && t('loginbutton.confirmcode')}
						{step === 'register' && t('register.registertext')}
					</DialogTitle>
				</DialogHeader>

				{step === 'login' && (
					<LoginForm
						setWindow={(type: string) => setStep(type)}
						setClose={(close: boolean) => setOpen(!close)}
					/>
				)}
				{step === 'register' && (
					<Register
						setPhone={phone => setPhoneNumber(phone)}
						setWindow={(type: string) => setStep(type)}
					/>
				)}
				{step === 'reset-password' && (
					<ResetPassword
						setPhone={phone => setPhoneNumber(phone)}
						setWindow={(type: string) => setStep(type)}
					/>
				)}
				{step === 'confirm-password' && (
					<ConfirmPassword
						setClose={(close: boolean) => setOpen(!close)}
						user={userId!}
					/>
				)}
				{step === 'reset-verify' && (
					<ResetVerifyForm
						phone={phoneNumber}
						setWindow={(type: string) => setStep(type)}
						setUserId={(id: number) => setUserId(id)}
					/>
				)}
				{step === 'verify' && (
					<VerifyForm
						phone={phoneNumber}
						setWindow={(type: string) => setStep(type)}
						setUserId={(id: number) => setUserId(id)}
					/>
				)}
				{step === 'fill-info' && (
					<FillInfo
						userId={userId!}
						setClose={(close: boolean) => setOpen(!close)}
					/>
				)}

				<button
					className='fixed top-2 right-2 z-10 cursor-pointer'
					onClick={handleClose}
				>
					<X className='md:text-2xl text-lg' />
				</button>
			</DialogContent>
		</Dialog>
	)
}
