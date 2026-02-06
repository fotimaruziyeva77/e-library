export interface BookTypes {
	id: number
	name: string
	slug: string
	author: string
	category: string
	category_slug: string
	image: string
	description: string
	isbn: string
	publication: string
	published_date: string
	language: string
	page_count: number
	booked_count: number
	related_books: RelatedBook[]
	rating: number
	reviews_count: number
	description_uz: string
	description_en: string
	description_ru: string
	rating_by_scores: Ratingbyscores
	is_available: boolean
	available_count: number
	stock: number
}

export interface ReservedBookTypes {
	id: number
	book: BookTypes
	due_date: string | null
	returned_at: string | null
	status: 'booked' | 'cancelled' | 'taken' | 'returned'
	taken_at: 'string' | null
	available_count: number
	stock: number
}

export interface _1 {
	percentage: number
}

export interface Ratingbyscores {
	'1': _1
	'2': _1
	'3': _1
	'4': _1
	'5': _1
}
export interface RelatedBook {
	id: number
	name: string
	author: string
	image: string
	publication: string
	published_date: string
	category: string
	rating: number
	slug: string
	reviews_count: number
	available_count: number
	stock: number
}
export interface Image {
	id: number
	image: string
}
export interface UserVerification {
	first_name: string
	last_name: string
	gender: 'male' | 'female' | string
	telegram_username: string
	birth_date: string
	document_number: string
	document_file1: number
	document_file2: number
	photo: number
	verification_type: 'passport' | 'id_card' | string
	password: string
	rating: string
	is_verified: boolean
	phone_number: string
	document_file1_path: Record<string, any>
	document_file2_path: Record<string, any>
	photo_path: Record<string, any>
}

export interface CategoryTypes {
	id?: number
	name?: string
	icon?: string
	slug?: string
}

export interface ReviewTypes {
	score: string
	review: string
	created_at: string
	library_member: {
		id: number
		first_name: string
		last_name: string
		middle_name?: any
		photo?: string
	}
}

export interface UserTypes {
	first_name: string
	last_name: string
	gender: string
	telegram_username: string
	birth_date: string
	document_number: string
	document_file1: number
	document_file2: number
	photo: number
	verification_type: string
	password: string
	rating: string
	is_verified: boolean
	phone_number: string
	document_file1_path: string | null
	document_file2_path: string | null
	photo_path: string | null
}

export interface DeficientBookTypes {
	name: string
	image: string
	author: string
	publication: string
	published_date: string
	stock: number
	booked_count: number
}

export interface Last30daysstatistic {
	date: string
	taken_books: number
	returned_books: number
}
export interface LibraryStatisticsTypes {
	total_members: number
	male_members: number
	female_members: number
	total_books: number
	available_books: number
	active_reservations: number
	overdue_books: number
	total_reservations: number
	reservations_last_day: number
	reservations_last_week: number
	reservations_last_month: number
	average_reservations_per_day: number
	top_reserved_books_last_week: any[]
	top_books: any[]
	top_readers: any[]
	last_30_days_statistics: Last30daysstatistic[]
	category_stats: CategoryStats[]
}
export interface CategoryStats {
	category__id: number
	category__name: string
	total: number
}
export interface ContactTypes {
	id: number
	image: string
	library_name: string
	title: string
	description: string
	address: string
	phone1: string
	phone2: string
	email: string
	instagram?: any
	telegram: string
	youtube: string
	facebook: string
	twitter: string
}

export interface ContributionTypes {
	id: number
	image: string
	card_number1: string
	card_number2: string
	description: string
}
