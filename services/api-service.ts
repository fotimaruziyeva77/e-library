const baseUrl = process.env.NEXT_PUBLIC_API_URL

export const APISERVICE = {
	step1: `${baseUrl}/account/register/step1/`,
	verify: `${baseUrl}/account/register/verify/`,
	step2: `${baseUrl}/account/register/step2/`,
	forgotPassword: `${baseUrl}/account/forgot-password/`,
	forgotPasswordVerify: `${baseUrl}/account/forgot-password/verify/`,
	resetPassword: `${baseUrl}/account/reset-password/`,
	newVerifyCode: `${baseUrl}/account/new-verify-code/`,
	mediaUpload: `${baseUrl}/common/media/upload/`,
	login: `${baseUrl}/account/login/`,
	refresh: `${baseUrl}/account/token/refresh/`,
	profile: `${baseUrl}/account/profile`,
	books: `${baseUrl}/books`,
	about: `${baseUrl}/common/about-us`,
	contributions: `${baseUrl}/common/contributions`,
	library: `${baseUrl}/account/library`,

	//statistics

	libraryMonthlyStatistics: `${baseUrl}/account/library-monthly-statistics`,
	libraryStatistics: `${baseUrl}/account/library-statistics`,
}
