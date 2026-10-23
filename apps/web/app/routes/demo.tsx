import CoolFace from '@/components/characters/cool'
import LoveFace from '@/components/characters/blushing'
import Happy from '@/components/characters/Happy'

const demo = () => {
    return (
        <div className="flex items-center justify-center h-screen gap-5">
            <Happy radius={20} background="#E7A3B3" className="size-16" />
            <CoolFace radius={10} className="size-16" />
            <LoveFace radius={10} className="size-16" />
        </div>
    )
}

export default demo
