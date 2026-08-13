export type HColorContrastOptions = {
    color: string
    overrideColor?: string
}

export function h_color_contrast({color, overrideColor}: HColorContrastOptions): string {
    if (overrideColor) {
        return overrideColor
    }

    const hex = color.replace('#', '')
    if (!/^[0-9a-f]{6}$/i.test(hex)) return '#ffffff'

    const [red, green, blue] = [0, 2, 4]
        .map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255)
        .map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
    const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722
    const whiteContrast = 1.05 / (luminance + 0.05)
    const blackContrast = (luminance + 0.05) / 0.05

    return blackContrast >= whiteContrast ? '#000000' : '#ffffff'
}

export type HColorAdjustStrategy = 'lighten' | 'darken' | 'auto'
export type HColorAdjustment = number | 'auto'

export type HColorAdjustOptions = {
    color: string
    strategy?: HColorAdjustStrategy
    adjustment?: HColorAdjustment
    basisColor?: string
}

export function h_color_adjust({
    color,
    strategy = 'auto',
    adjustment = 'auto',
    basisColor,
}: HColorAdjustOptions): string {
    const hex = color.replace('#', '')
    if (!/^[0-9a-f]{6}$/i.test(hex)) return color

    const channels = [0, 2, 4].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16))
    const linearChannels = channels
        .map((channel) => channel / 255)
        .map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
    const luminance = linearChannels[0] * 0.2126 + linearChannels[1] * 0.7152 + linearChannels[2] * 0.0722
    const basisHex = basisColor?.replace('#', '')
    const basisChannels = basisHex && /^[0-9a-f]{6}$/i.test(basisHex)
        ? [0, 2, 4].map((offset) => Number.parseInt(basisHex.slice(offset, offset + 2), 16))
        : null
    const basisLuminance = basisChannels
        ? basisChannels
            .map((channel) => channel / 255)
            .map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
            .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0)
        : null
    const resolvedStrategy = strategy === 'auto'
        ? basisLuminance === null
            ? luminance < 0.5 ? 'lighten' : 'darken'
            : basisLuminance > luminance ? 'darken' : 'lighten'
        : strategy
    let adjustmentAmount = adjustment === 'auto'
        ? 0.15 + Math.abs(luminance - 0.5) * 0.4
        : Math.min(1, Math.max(0, adjustment))

    if (adjustment === 'auto' && basisLuminance !== null) {
        for (let amount = 0; amount <= 1; amount += 0.01) {
            const candidateChannels = channels.map((channel) => resolvedStrategy === 'lighten'
                ? channel + (255 - channel) * amount
                : channel * (1 - amount))
            const candidateLinearChannels = candidateChannels
                .map((channel) => channel / 255)
                .map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
            const candidateLuminance = candidateLinearChannels[0] * 0.2126
                + candidateLinearChannels[1] * 0.7152
                + candidateLinearChannels[2] * 0.0722
            const contrastRatio = (Math.max(candidateLuminance, basisLuminance) + 0.05)
                / (Math.min(candidateLuminance, basisLuminance) + 0.05)

            if (contrastRatio >= 4.5) {
                adjustmentAmount = amount
                break
            }
        }
    }
    const adjustedChannels = channels.map((channel) => resolvedStrategy === 'lighten'
        ? channel + (255 - channel) * adjustmentAmount
        : channel * (1 - adjustmentAmount))

    return `#${adjustedChannels
        .map((channel) => Math.round(channel).toString(16).padStart(2, '0'))
        .join('')}`
}
