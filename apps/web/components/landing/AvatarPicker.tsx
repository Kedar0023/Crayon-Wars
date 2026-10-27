import { createAvatarCode, getAvatar, AVATAR_COLORS, AVATAR_FACES } from "../characters/registry";
import { Dices } from "lucide-react";
import type { Profile } from "./types";
import { Avatar, Card, Divider, Tag } from "./primitives";

type AvatarPickerProps = {
  profile: Profile;
  onChange: (patch: Partial<Profile>) => void;
  signedIn: boolean;
  onRandomize: () => void;
};

export function AvatarPicker({ profile, onChange, signedIn, onRandomize }: AvatarPickerProps) {
  const selected = getAvatar(profile.avatar);
  const ring = "ring-4 ring-black ring-offset-2 ring-offset-[#F4F4F4]";

  return (
    <Card>
      <div className="flex items-center gap-5">
        <Avatar code={profile.avatar} className="size-32 sm:size-40" />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            {signedIn ? <Tag>Member</Tag> : <Tag tone="cyan">Guest</Tag>}
            <button
              onClick={onRandomize}
              className="ml-auto inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold text-black/60 hover:bg-black/5 hover:text-black"
            >
              <Dices className="size-4" /> Randomize
            </button>
          </div>
          <input
            aria-label="Display name"
            value={profile.name}
            maxLength={14}
            placeholder="Your name"
            onChange={(event) => onChange({ name: event.target.value })}
            className="w-full border-b-2 border-dashed border-black/20 bg-transparent pb-1 text-3xl font-extrabold tracking-[-0.03em] outline-none placeholder:text-black/25 focus:border-black sm:text-4xl"
          />
          <p className="mt-1 text-sm font-semibold text-black/45">{profile.tag}</p>
        </div>
      </div>

      <Divider />

      <p className="mb-3 text-sm font-bold">Color</p>
      <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Avatar color">
        {AVATAR_COLORS.map((color, colorIndex) => (
          <button
            key={color.name}
            role="radio"
            aria-checked={selected.colorIndex === colorIndex}
            aria-label={color.name}
            onClick={() => onChange({ avatar: createAvatarCode(colorIndex, selected.faceIndex) })}
            style={{ backgroundColor: color.value }}
            className={`size-9 rounded-full transition active:scale-90 ${selected.colorIndex === colorIndex ? ring : "hover:scale-110"}`}
          />
        ))}
      </div>

      <p className="mb-3 mt-6 text-sm font-bold">Emote</p>
      <div className="grid grid-cols-4 gap-3" role="radiogroup" aria-label="Avatar emote">
        {AVATAR_FACES.map((face, faceIndex) => {
          const code = createAvatarCode(selected.colorIndex, faceIndex);

          return (
            <button
              key={face.name}
              role="radio"
              aria-checked={selected.faceIndex === faceIndex}
              title={face.name}
              aria-label={face.name}
              onClick={() => onChange({ avatar: code })}
              className={`rounded-[22%] transition active:scale-95 ${selected.faceIndex === faceIndex ? ring : "hover:-translate-y-0.5"}`}
            >
              <Avatar code={code} className="w-full" />
            </button>
          );
        })}
      </div>
    </Card>
  );
}