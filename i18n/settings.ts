export const fallbackLng = 'uz'
export const languages = [fallbackLng, 'en', 'ru', 'uz-Cyrl']
export const cookieName = 'NEXT_LOCALE'

export function getOptions(lng = fallbackLng) {
	return {
		supportedLngs: languages,
		fallbackLng,
		lng,
	}
}
