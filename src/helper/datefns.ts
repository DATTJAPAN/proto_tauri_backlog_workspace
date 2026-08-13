import {format as dateFnsFormat, isBefore, isValid, parseISO, startOfDay} from 'date-fns'
import type {Locale} from 'date-fns'

type HDateFnsValue = string | number | Date | null | undefined

export type HDateFnsOptions = {
    value: HDateFnsValue
    format?: string
    locale?: Locale
    fallback?: string
}

const DEFAULT_FALLBACK = '—'

export function h_datefns_date({
    value,
    format = 'PP',
    locale,
    fallback = DEFAULT_FALLBACK,
}: HDateFnsOptions): string {
    return h_datefns_format({value, format, locale, fallback})
}

export function h_datefns_time({
    value,
    format = 'p',
    locale,
    fallback = DEFAULT_FALLBACK,
}: HDateFnsOptions): string {
    return h_datefns_format({value, format, locale, fallback})
}

export function h_datefns_datetime({
    value,
    format = 'PP p',
    locale,
    fallback = DEFAULT_FALLBACK,
}: HDateFnsOptions): string {
    return h_datefns_format({value, format, locale, fallback})
}

export function h_datefns_is_overdue({
    value,
    referenceDate = new Date(),
}: {
    value: HDateFnsValue
    referenceDate?: Date
}): boolean {
    if (value === null || value === undefined || value === '') return false

    const dueDate = typeof value === 'string' ? parseISO(value) : new Date(value)
    if (!isValid(dueDate) || !isValid(referenceDate)) return false

    return isBefore(startOfDay(dueDate), startOfDay(referenceDate))
}

function h_datefns_format({value, format, locale, fallback = DEFAULT_FALLBACK}: Required<Pick<HDateFnsOptions, 'format'>> & Omit<HDateFnsOptions, 'format'>): string {
    if (value === null || value === undefined || value === '') return fallback

    const date = typeof value === 'string' ? parseISO(value) : new Date(value)
    if (!isValid(date)) return typeof value === 'string' ? value : fallback

    return dateFnsFormat(date, format, {locale})
}
