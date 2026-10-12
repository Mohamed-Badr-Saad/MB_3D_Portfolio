# Mohamed Badr — portfolio

Personal site for Mohamed Badr, instrumentation & control engineer and full-stack developer.
Live at https://mohamed-badr-nine.vercel.app/

## Stack

- React 19, TypeScript, Vite, Tailwind CSS
- React Three Fiber + drei for 3D, rendered through **one** fixed canvas with `<View>`s
- EmailJS for the contact form
- Self-hosted fonts: Archivo (variable width) and JetBrains Mono

## Editing content

- **Text, experience, projects, education:** `src/data/content.ts`.
- **Skills:** `src/data/skills.ts`. Each skill has a group, a keyboard shortcut, a ball size and a "used in" line.
  Logos come from the `simple-icons` package.
- **Skills style:** `SKILLS_MODE` at the top of `src/components/Skills.tsx` switches between `"orbit"` (current),
  `"keyboard"` and `"balls"`. All three still work.
- **Project details pop-up:** each project's `highlights` (and optional `gallery` screenshots) in `content.ts`.
- **Monitor screens next to the robot:** the `screens` list in `content.ts`.
- **CV download:** put your PDF in `public/` (e.g. `public/Mohamed_Badr_CV.pdf`) and set `profile.cv` to `"/Mohamed_Badr_CV.pdf"`.
- **EmailJS keys:** optional `.env` overrides: `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`.

## 3D

Everything three.js is in `src/three/` and loads lazily after the page has painted. One fixed canvas
renders all scenes through drei `<View>`s.

- `Robot.tsx`: the hero. Robot model by Quaternius (CC0), compressed with meshopt to 183 KB.
  Hover to wave, click for emotes with a speech bubble, drag to spin; the head follows the cursor.
  The floating monitor cycles project screenshots, and clicking it skips to the next one.
- `SkillOrbit.tsx`: the skills orbit. Logo planets circle a glowing MB core, one ring per group.
  Hover a planet to pause its ring, click it to fly the camera in, and drag empty space to turn the system.
  Picking a group highlights its ring and makes it swell.
- `SkillKeyboard.tsx` (backup): the skills keyboard. Each keycap is a skill. Hover lifts it, and clicking or typing its letter
  presses it with a spring bounce. Keys rise in a wave when the section appears, and picking a group
  "types" that group's keys. The spacebar jumps to Contact.
- `SkillBalls.tsx` (backup): the skills ball pit. A small hand-written physics sim (gravity, walls,
  ball-to-ball collisions, cursor pushing, grab and throw). Resting balls turn their logo to face you.
- `Globe.tsx`: the draggable dotted globe in Contact. Land dots come from Natural Earth 110m (`landPoints.ts`).

## Scripts

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build
npm run lint
```
