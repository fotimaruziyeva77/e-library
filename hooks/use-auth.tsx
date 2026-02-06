import { APISERVICE } from '@/services/api-service'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const getAccessToken = () => Cookies.get('access')
const getRefreshToken = () => Cookies.get('refresh')

const library_id = Cookies.get('library_id')

export const refreshAccessToken = async () => {
	try {
		const refreshToken = getRefreshToken()
		if (!refreshToken) throw new Error('No refresh token available')

		const response = await axios.post(APISERVICE.refresh, {
			refresh_token: refreshToken,
		})
		const { access_token } = response.data
		Cookies.set('access', response.data.access)
		Cookies.set('refresh', response.data.refresh)

		return access_token
	} catch (error: any) {
		throw new Error(
			'Failed to refresh access token: ' + (error?.message || 'Unknown error')
		)
	}
}

const useAuth = () => {
	const [data, setData] = useState<any>(null)
	const router = useRouter()

	useEffect(() => {
		const fetchData = async () => {
			const accessToken = getAccessToken()

			try {
				const response = await axios.get(
					`${APISERVICE.profile}/${library_id}/`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				)
				setData(response.data)
			} catch (error: any) {
				if (error.response && error.response.status === 401) {
					try {
						const newAccessToken = await refreshAccessToken()
						const retryResponse = await axios.get(
							`${APISERVICE.profile}/${library_id}/`,
							{
								headers: {
									Authorization: `Bearer ${newAccessToken}`,
								},
							}
						)
						setData(retryResponse.data)
					} catch (refreshError: any) {
						console.log(refreshError)
					}
				} else {
					console.log(error?.message || 'An unknown error occurred')
				}
			}
		}

		fetchData()
	}, [router])

	return { data }
}

export default useAuth
