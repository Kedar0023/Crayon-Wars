import type { ComponentType, SVGProps } from 'react'
import Happy from './Happy'
import LoveFace from './blushing'
import CoolFace from './cool'


type ColorDigit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type FaceDigit = 0 | 1 | 2

export type AvatarCode = `${ColorDigit}${FaceDigit}`

type AvatarFaceProps = SVGProps<SVGSVGElement> & {
    background?: string
    radius?: number
    followCursor?: boolean
}

type AvatarFace = {
    name: string
    component: ComponentType<AvatarFaceProps>
}

export const AVATAR_COLORS = [
    { name: 'Coral', value: '#F97373' },
    { name: 'Orange', value: '#FB923C' },
    { name: 'Sunshine', value: '#FACC15' },
    { name: 'Lime', value: '#A3E635' },
    { name: 'Mint', value: '#34D399' },
    { name: 'Cyan', value: '#22D3EE' },
    { name: 'Sky', value: '#60A5FA' },
    { name: 'Violet', value: '#A78BFA' },
    { name: 'Pink', value: '#F472B6' },
    { name: 'Slate', value: '#94A3B8' },
] as const

export const AVATAR_FACES: readonly AvatarFace[] = [
    { name: 'Happy', component: Happy },
    { name: 'Blushing', component: LoveFace },
    { name: 'Cool', component: CoolFace },
]

export const DEFAULT_AVATAR_CODE: AvatarCode = '00'

export function createAvatarCode(colorIndex: number, faceIndex: number): AvatarCode {
    if (
        !Number.isInteger(colorIndex) ||
        colorIndex < 0 ||
        colorIndex >= AVATAR_COLORS.length ||
        !Number.isInteger(faceIndex) ||
        faceIndex < 0 ||
        faceIndex >= AVATAR_FACES.length
    ) {
        throw new RangeError('Avatar color and face indexes are out of range')
    }

    return `${colorIndex}${faceIndex}` as AvatarCode
}

export function getAvatar(code: string) {
    if (!/^[0-9][0-2]$/.test(code)) {
        throw new RangeError(`Invalid avatar code: ${code}`)
    }

    const colorIndex = Number(code[0])
    const faceIndex = Number(code[1])
    const color = AVATAR_COLORS[colorIndex]
    const face = AVATAR_FACES[faceIndex]

    if (!color || !face) {
        throw new RangeError(`Unknown avatar code: ${code}`)
    }

    return { code: code as AvatarCode, colorIndex, faceIndex, color, face }
}
