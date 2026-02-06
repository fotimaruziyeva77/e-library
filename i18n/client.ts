'use client'

import { useEffect } from 'react'
import i18next from 'i18next'
import {
	initReactI18next,
	useTranslation as useTranslationOrg,
} from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resourcesToBackend from 'i18next-resources-to-backend'
import { getOptions, languages } from './settings'

const runsOnServerSide = typeof window === 'undefined'

i18next
	.use(initReactI18next)
	.use(LanguageDetector)
	.use(
		resourcesToBackend(
			(language: string) => import(`../locales/${language}.json`)
		)
	)
	.init({
		...getOptions(),
		detection: {
			order: ['path', 'cookie', 'htmlTag', 'navigator'],
			lookupCookie: 'NEXT_LOCALE',
			lookupFromPathIndex: 0,
			caches: ['cookie'],
		},
		preload: runsOnServerSide ? languages : [],
	})

export function useTranslation(lng: string) {
	const ret = useTranslationOrg()
	const { i18n } = ret

	useEffect(() => {
		if (i18n.language !== lng) {
			i18n.changeLanguage(lng)
		}
	}, [lng, i18n])

	return ret
}
