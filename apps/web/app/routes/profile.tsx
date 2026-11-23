import { useEffect, useState } from 'react'
import { BadgeCheck, Brush, Medal, Save } from 'lucide-react'
import { createAvatarCode } from '../../components/characters/registry'
import { AvatarPicker } from '../../components/landing/AvatarPicker'
import { Card } from '../../components/landing/primitives'
import { SubpageLayout } from '../../components/landing/SubpageLayout'
import { DEFAULT_PROFILE, type Profile } from '../../components/landing/types'

const STORAGE_KEY = 'crayonwars.profile'

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE)
    const [ready, setReady] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                const parsed = JSON.parse(stored) as Partial<Profile>
                setProfile({
                    name: typeof parsed.name === 'string' ? parsed.name.slice(0, 14) : DEFAULT_PROFILE.name,
                    tag: typeof parsed.tag === 'string' ? parsed.tag : DEFAULT_PROFILE.tag,
                    avatar: typeof parsed.avatar === 'string' && /^[0-9][0-2]$/.test(parsed.avatar)
                        ? createAvatarCode(Number(parsed.avatar[0]), Number(parsed.avatar[1]))
                        : DEFAULT_PROFILE.avatar,
                })
            }
        } catch (error) {
            console.error('Could not load saved profile:', error)
        }
        setReady(true)
    }, [])

    useEffect(() => {
        if (!ready) return
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
        } catch (error) {
            console.error('Could not save profile:', error)
        }
    }, [profile, ready])

    const updateProfile = (patch: Partial<Profile>) => {
        setProfile((current) => ({ ...current, ...patch }))
        setSaved(false)
    }

    const saveProfile = () => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
            setSaved(true)
        } catch (error) {
            console.error('Could not save profile:', error)
            setSaved(false)
        }
    }

    return (
        <SubpageLayout eyebrow="Your player card" title="Profile" description="Choose the face and name everyone sees in the lobby. Your edits are saved in this browser.">
            <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="flex flex-col gap-4">
                    <AvatarPicker
                        profile={profile}
                        onChange={updateProfile}
                        signedIn={false}
                        onRandomize={() => {
                            const colorIndex = Math.floor(Math.random() * 10)
                            const faceIndex = Math.floor(Math.random() * 3)
                            updateProfile({ avatar: `${colorIndex}${faceIndex}` as Profile['avatar'] })
                        }}
                    />
                    <button type="button" onClick={saveProfile} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800">
                        {saved ? <BadgeCheck className="size-4" /> : <Save className="size-4" />}
                        {saved ? 'Profile saved' : 'Save profile'}
                    </button>
                </div>
                <div className="flex flex-col gap-4">
                    <Card>
                        <div className="flex items-center gap-3">
                            <span className="grid size-10 place-items-center rounded-xl bg-sky-100"><Brush className="size-5" /></span>
                            <div>
                                <h2 className="font-extrabold">Your stats</h2>
                                <p className="text-xs font-semibold text-slate-500">A preview for your player card</p>
                            </div>
                        </div>
                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl bg-white p-4"><p className="text-xs font-bold text-slate-500">Games played</p><p className="mt-1 text-2xl font-black">12</p></div>
                            <div className="rounded-2xl bg-white p-4"><p className="text-xs font-bold text-slate-500">Best streak</p><p className="mt-1 text-2xl font-black">4</p></div>
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center gap-3">
                            <span className="grid size-10 place-items-center rounded-xl bg-amber-100"><Medal className="size-5 text-amber-800" /></span>
                            <div><h2 className="font-extrabold">Next badge</h2><p className="text-xs font-semibold text-slate-500">Sketch streak</p></div>
                        </div>
                        <p className="mt-4 text-sm leading-relaxed text-slate-600">Win 5 rounds in a row to earn your first streak badge. Sample profile stats are for UI preview only.</p>
                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white"><div className="h-full w-4/5 rounded-full bg-amber-400" /></div>
                        <p className="mt-2 text-right text-xs font-bold text-slate-500">4 / 5 wins</p>
                    </Card>
                </div>
            </div>
        </SubpageLayout>
    )
}
