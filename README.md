V189 — Citadel material refinement: object-space procedural surface grain, balanced warm/cool studio illumination, toned-down earth/stone specularity, refined metallic response, and softer highlight clipping. No geometry or object changes.

V188: Removed redundant small decorative cottages and hamlet clusters from the Citadel 3D map. Landmark architecture, roads, interactions, and V187 idle rotation are retained.

# Zack Pond — Interactive Fantasy Portfolio (V25)

## Quick start
Extract this entire folder. Open `index.html` in a modern browser, or serve the folder through a static local server such as VS Code Live Server. All internal pages use relative paths.

## Approved image integration
- `assets/home-art.png` is an **unaltered copy** of `zack-kingdom-subtly-cooler.png`, the exact cooler-toned artwork approved in the conversation.
- **The banner rune and cape rune are part of that background image**. No other rune is overlaid there, preventing double/offset emblems.
- The full luminous panda crest is retained in the upper-left brand area (separate editable asset).
- Navigation, hero lettering, five destination banners, recent project cards, and featured-project carousel remain live HTML/UI layered above the text-free painting.
- The four featured slides are in `featured.js`, and project information is in `data.js`.
- Projects use concept illustrations for now; replace with actual screenshots/video when ready.
- The user's LinkedIn, YouTube and email are still awaiting verified details. itch.io is linked.

## Contents
- `index.html` homepage; additional `.html` pages for games, software, web, media, about, contact and project details.
- `site.css`: styling, positioning and hover effects.
- `home.js`: menu, magic effects and interaction behavior.
- `featured.js`: homepage project carousel.
- `page.js` + `data.js`: interior pages and project data.

## Developer notes
The main image uses a fixed 3:2 aspect ratio with interface elements positioned relative to the scene. On narrower screens the scene can scroll horizontally to preserve label-to-landmark alignment. Future mobile redesigns can add a dedicated composition without altering the background art.


V26 ornamental UI pass:
- Unmodified, approved V25 background (exact SHA256 identity preserved).
- The original 1254px crest preserved as `assets/official-panda-crest-original.png`; newly extracted luminous foreground in `official-crest-clear-v26.png`, derived pixel-by-pixel without any generative redraw.
- Header and destination silhouettes in independent SVGs with silver inlay, gently warm brass details and icy-blue hover states.
- `ornate-v26.css` is a separate, clearly scoped design layer above the historical CSS; individual elements remain fully editable.
- Working links and featured-project carousel unchanged.


V27: Corrected the muted header logo. The `official-crest-v27-vivid.png` asset is a losslessly cropped derivative of the supplied unmodified 1254×1254 original: the white, cyan and electric blue RGB channels are preserved; only a thin, nearly black outer background margin was faded to blend with the header. No blur, denoising, desaturation or brightness filter is applied to the normal logo. All existing background art, category plaques, menu behavior and carousel remain unchanged.


V28: All interior pages now share the full luminous crest, ornamental game-navigation shell, destination artwork headers, illustrated icons, richer hover/focus states, project archive counter, and mobile menu. Original homepage/index.html and its art are unchanged.


## V29 — Interior environmental backgrounds

- Games / Arena: Crimson Banners Over the Grand Arena.
- Software / Citadel: approved noble blue Citadel interior.
- Web / Workshop: latest workbench- and gadget-filled Workshop environment.
- Media / Hall of Visions: frontal blue stained-glass hall.
- About and Contact / Archives: quiet, smooth archive library.
- Projects / Realm index: Skybound Arcane Observatory.
- Project detail pages inherit their respective discipline's environment.
- Homepage retained without edits. All images are stored locally as optimized WebP assets.
- Environment is drawn behind all page content, not in a small hero strip. Subtle overlays and darker interactive panels preserve legibility.


V30 — Brighter environments and consistent navigation:
- Reduced the full-screen dark overlay on all environment pages (stronger local contrast maintained behind text).
- Interior header now uses the same six major navigation choices, labels, and heraldic icons as the approved homepage.
- Restored matching itch.io, LinkedIn-info, and YouTube-info shortcuts; Archives and Contact remain separately accessible.
- Preserves the approved homepage and all environment paintings without retouching them.

V31: Interior header matches homepage bounded brand/navigation widths; socials are visually separated at right. Homepage unchanged.

V32: Interior pages now render the exact same crest/nav/social markup and source CSS as the homepage, with a consistent size determined from its 3:2 scene geometry. Responsive fallback preserved.

V33 adds separate Archives and About pages and consistent secondary header links.

V34: Clean secondary navigation; differentiated Archives, About, and Contact. No unpublished contact details displayed as broken links.


V35 — Combined all-work directory into The Archives. Removed The Realm from desktop/mobile navigation, made Archives a main navigation entry, made About and Contact secondary links, linked homepage CTAs/recent directory to Archives. Legacy projects.html redirects to archives.html for bookmarks.


V36: Removed homepage Explore the Archives button, moved intro panel immediately beneath header, and expanded intro to explain Arena, Citadel, Workshop, Hall of Visions, and Archives.

V37: Homepage intro shortened to a single sentence; removed featured carousel, recent projects shelf, and their controls from the homepage. The landscape is unobstructed across the lower area, with a softened lower vignette. All projects are still available via Archives and destination pages.


V38: Homepage constrained to one desktop viewport; hero description reduced and positioned clear of Citadel banner. Interior pages unchanged.


V39: Moved the homepage introductory panel to lower-left; deepened navy backdrop and retained single-screen desktop layout.

V40: Standardized shared header HTML and header-v40.css across all pages, About and Contact integrated into right hand header section.


V41 update:
- Folded About and Contact into the main header navigation.
- Converted all navigation tabs (except the brand block) into pointed hex-style menu tabs.
- Removed the separate About/Contact header capsule so every page uses the same header structure.

V42: Added Behind the Crest doorway above the panda on homepage, linked to About. Gave first Home navigation tab the same gap as all other navigation tabs on every page.

V43 — Behind the Crest homepage signplate now uses the shared destination plaque dimensions and medallion, and the About header label is renamed Behind the Crest across homepage and interior pages.

V44: Renamed the About destination to The Architect in desktop/mobile navigation and homepage banner; added matching original architect-compass drafting icon for both placements. The panda crest is unchanged.

V45: Added an isolated transparent blue-purple portal below the connecting bridge between the Arena and Hall of Visions on homepage, linking to Contact.

V46: Stationary decorative Contact portal and standard heraldic Gateway banner (with Contact subtitle), matching other homepage destinations.

V47: Header Architect subtitle About Zack; Gateway icon/name and Contact subtitle, consistent on homepage and inner pages.

V48: Raised the medallion icon on every homepage destination banner by 6px to avoid touching the title text. Other layout and behavior unchanged.


## V49
- Fine-tuned homepage destination medallions: Arena lowered, Citadel lowered slightly, Workshop lowered and shifted left, Hall of Visions lowered and shifted right, Archives lowered slightly.

## V50
Reverted V49's per-emblem offsets to V48 behavior. Adjusted the **whole** homepage destination plaques: Arena downward; Citadel slightly downward; Hall of Visions downward/right; Workshop downward/left; Archives slightly downward. No other visual changes.

V51: Interior pages simplified. Removed breadcrumb Home trails, Select Your Path ornaments, category filter bars, project inventory bars, and footer information. Primary shared navigation, page content, and project cards retained.


V52 — Arena Carousel
- The Arena uses a carousel of all game projects; selecting any game updates the title, summary, player region, development challenges, approach, outcome, and tools together.
- The player stays on the page; changing games removes the previous game iframe to stop it.
- Exact itch.io playable iframe URLs are not yet available. Add each trusted official URL to the `embeds` mapping in `page.js` to activate a playable frame.
- Until connected, the game section intentionally displays a placeholder and links to the existing itch.io profile rather than falsely claiming a playable embed.


## V53 — Arena cylinder
- Replaced horizontal game list with an eight-face 3D cylindrical gallery.
- Each 45-degree rotation reveals a new complete game display (title, description, player, development challenges).
- Previous/next arrows and keyboard controls; reduced-motion support.
- Playable itch.io embed URLs remain to be connected.


V54: The Arena cylinder now sits behind a single-face-width viewport mask. Neighboring faces cannot remain visible at either side while a game is selected; the 45-degree cylinder rotation remains intact.

## V55 - Paradox embed
- The Arena's Project Paradox face loads the itch.io playable iframe at https://itch.io/embed-upload/19989361?color=04006a.
- The linked source page for Paradox is https://zdp35nauedu.itch.io/paradox.
- Other games still await playable embed URLs.

## V56 — itch.io links
- Browser players: Paradox, Jellyfish Boid Drift, Lantern Drift.
- itch.io promotional cards (not playable iframes): Dante's TimeSlip, Zombie Pitfall, Apple Picker, MissionDemolition.
- Minigame Royale remains without an embed.
- The existing eight-face Arena layout and cylinder rotation remain unchanged.


## V57 — playable itch.io players
- Converted Apple Picker, Dante's TimeSlip, Zombie Pitfall and MissionDemolition from promotional widgets to the exact playable iframe URLs supplied by the creator.
- All seven games with browser embeds now use playable players. Minigame Royale remains without a browser embed.


V58: Replaced Minigame Royale with Iron Tide in the eight-game Arena carousel and Archives project listings. Iron Tide links to its public GitHub repository. Its GitHub Pages URL could not be confirmed, so its player is intentionally not embedded yet.


V59: Iron Tide is embedded from its live GitHub Pages Unity WebGL URL on the eighth face of The Arena. Unity loading/runtime and iframe compatibility should be checked in a browser.

V60: Iron Tide launches in a large overlay outside the clipped 3D carousel; overlay fullscreen and direct-open actions are provided. Unity upstream has a fixed 960×600 canvas.


V61: Expanded summaries and Challenge/Approach/Result case studies for all eight Arena games. Enlarged content panels to accommodate the expanded text; game iframe and full player mechanics retained. Details for Dante's TimeSlip remain intentionally non-speculative.


V62: Updated all eight Arena tags with verified engines (Godot, Unity, Construct, Twine); corrected and expanded Paradox's two-player split-screen, independently traveled three-arena artifact-capture experience. Rewrote Dante's TimeSlip using its published Twine game description.


V64: Workshop Loki Voli model swapped to the newly provided `Loki Voli1.glb` (served as `assets/loki-voli-v64.glb` for cache avoidance). No engine, lighting, or layout changes, enabling a clean visual comparison. Viewer still relies on online model-viewer CDN.


V65 Workshop 3D test: Loki Voli2.glb with converted fur mesh is the active viewer asset (assets/loki-voli-fur.glb). This is an unoptimized 160 MB / 2.18 million triangle test model. Older model removed from bundle to limit download size. Compare visually before optimizing, and serve site over localhost or HTTPS.

V66: Optimized fur trial: retain one strand in six; black fur trial on arm and upper-face meshes. All other portfolio pages unchanged.


V67: Tests explicit PBR materials for black/charcoal fur meshes and localized eyebrow fur colors. Uses cache-busted GLB; trims unused 153 MB backup from ZIP. The dark eyebrow placement needs visual evaluation.

V68: Replaces guessed V67 palette with materials from creator-exported Loki Voli3.glb. Keeps optimized ~419K triangles (fur strands ~1/6 density) and originals for body mesh materials. Browser appearance remains to be tested.


V69: Restored original vertex-color mesh channels that were removed from V68. Retains the optimized V66 fur topology and original base geometry. Adds browser-friendly PBR materials without overriding vertex colors. This is a visual verification build; precise fur coloration may still need Blender color assignment.


V70: Paused Loki Voli. Replaced featured Workshop 3D project with the supplied Head Bust.glb (67 MB, ~2.4M triangles). Source file unmodified, no color textures or vertex colors; may load slowly.

V71: Reduced model-viewer exposure 1.0 to 0.55 and strengthened shadow-intensity to 1.6 on Workshop feature and model detail to improve Head Bust surface contrast. No model editing.


## V72 — per-model 3D viewing presets
Every Workshop model may declare `viewingMode: 'object'` or `viewingMode: 'material'` in `data.js`. Object mode preserves Head Bust's V71 exposure (0.55) and shadow intensity (1.6). Material mode defaults to exposure 1.0 and shadow intensity 0.9. Optional `viewerSettings` on each project can override exposure/shadowIntensity/autoRotate/rotationPerSecond for individual models. Both featured and project-detail views read the same preset. No visitor-facing toggle has been added. Presets adjust browser lighting only, not the GLB geometry or materials.


V73: Added selectable Workshop gallery: Head Bust, Panda, Loki Voli, Ball Into Castle, Blender Robot. Each model uses Object lighting by default; change viewingMode to 'material' per model when desired. The viewer unmounts the prior GLB when switching to reduce rendering load. Head Bust(1).glb matched existing Head Bust byte-for-byte and was not duplicated.


V74: Panda model replaced from panda(1).glb, Ball Into Castle replaced from Ball_into_castle(1).glb. Ball Into Castle autoplays its SphereAction and loops with a Pause/Play control. Panda's EmptyAction is present and can be started with a Play control (no autoplay). Object lighting remains default. Model-viewer uses a CDN and must be previewed from a local web server or deployed site; double-clicking file:// pages may prevent GLB loading.


## V75 — animated model correction
- Panda is an updated replacement static model (retained the uploaded panda-v74.glb). Its EmptyAction is ignored intentionally; no play/pause control appears.
- Ball Into Castle retains its latest GLB, which contains SphereAction keyframes from 0.0417 to 0.8333 seconds, about 0.79 s of recorded motion. The player now uses timeScale=0.35 to slow the short clip for inspection; this does not restore missing animation frames.
- Export the complete Blender timeline / action to make the full animation play; slow playback is a temporary workaround.
- Object viewing preset remains the default. Other pages are unchanged.


V76: Panda refreshed using panda(2).glb; deliberately displayed as a static model. Ball Into Castle refreshed with Ball_into_castle(2).glb, new six-plus-second Scene clip auto-played at normal speed and looped. Both use Object presentation preset.

V110 Citadel: transparent WebGL background, unobtrusive overlay, side-mounted arrows, terrain-aware label hiding, widened viewing stage.


V115: Simplified terrain, reduced tree and incidental settlement density, six clearer illuminated miniature architectures with pulsing emissive windows, ground runes and world-space anchored labels.


## V116: attached landmark highlights and label refinements
- Building-centered warm aura tracks each 3D landmark.
- Namecards are separate labels floating directly above the corresponding glow.
- Raised emissive window material and improved landmark visibility while rotating.


## V127: outer roads and border terrain
- Added outward roads from the six software landmarks toward border gates, watchposts, hamlets, and a ford so the map edges feel inhabited.
- Introduced a subtle outer ring road tying edge destinations together.
- Added extra edge details including rocky shelves, tree clusters, and small field walls to break up the plain brown perimeter.


## V128: mountain ranges and road logic
- Broadened the southern mountain system into thicker connected ridges so it reads as a range.
- Added subtle mountain passes to keep travel believable.
- Replaced the most obvious straight-line roads with hand-routed roads that follow valleys, passes, and gentler terrain.
- Adjusted border exit roads so they point more naturally toward gates, hamlets, and watchposts.


## V129: mountain pass routing
- Removed the perimeter ring road that was reading like paint strokes across the mountain face.
- Reworked the road network so cross-range travel funnels through one broad central mountain pass.
- Kept local northern and southern roads local, with long-distance travel using the king's pass.
- Adjusted the terrain carving to reinforce a single believable pass corridor.


## V130: smooth mountain palette and road-free slopes
- Terrain uses per-vertex interpolated colors rather than hard bands across terrain quads.
- Road meshes are omitted on high/steep mountain ground to eliminate brush-like mountainside ribbons; lowland segments remain.
- Structures, landscape geometry, lighting, labels, and rotation retained.


## V131 — Architectural finishing pass
- Added building-specific roof profiles, entrances, stonework, trim and details to the six Citadel structures.
- Kept landmark coordinates, label tracking, emissive systems, mountains, road routing and cloud-free scene unchanged.


## V132: river tunnel
- The eastern watercourse disappears under the hillside and re-emerges through two masonry arches.
- Each portal has individual archstones, a keystone, retaining walls, and a short visible water channel.
- Removed the bridge that formerly sat above the buried river section.


## V137 — Citadel selected-project dossier layout
- Selecting a map landmark highlights it and offers an Explore Project action.
- Explore Project smoothly scrolls to a single project dossier; no other dossiers are displayed.
- Navy/silver dossier: app title, screenshot gallery with arrows, dots, keyboard and swipe navigation, technical overview on the right and full narrative below.
- A Back to map arrow scrolls to the war table without resetting rotation.
- Gallery frames are clearly marked screenshot placeholders until genuine app captures are supplied.


## V138 — Software Citadel interaction fix

- The Explore Project prompt overlays the 3D war table instead of sitting underneath it.
- Corrected the signed yaw target for all six landmark rotations; selecting side landmarks now brings the structure forward.
- Existing single-project dossier, gallery, and back-to-map behavior retained.

### V139 — landmark-facing and on-site action
- D&D Companion and Shorts Clip Studio use the front-facing view of their closest neighboring landmark, avoiding the mountain-facing reverse view.
- Explore Project is positioned in the map at the selected landmark's projected screen position, tracks during table rotation, and stays inside the map bounds.
- Existing dossier and navigation behavior is unchanged.


### V140 — Click-only landmark action
The Explore Project button is shown only after a direct landmark click (not orbit controls), contains only that label, and is positioned directly beneath the projected landmark nameplate.


### V142 — Citadel application content
Embedded 15 genuine application screenshots into all six navy/silver dossiers; tailored mobile portrait display for Digital Deckbox. Added verified-by-owner technical roles, technologies, project scope, capabilities and extended descriptions. Fixed Shorts Clip Studio preferred viewing orientation to match its other adjacent valley-facing landmark; preserved the D&D Companion viewing orientation.


V144: Citadel heading expanded to a large proper page title; shortened WebGL viewport to bring the war table directly beneath the introduction while maintaining projected marker alignment and scene controls.

V145: Increased Software & Systems heading, slightly reduced The Citadel heading, and lifted the war table closer below the intro (with mobile spacing).

V146: Shared tight destination headings on all interior tabs except Home; existing Citadel War Table layout remains unchanged.


## V147 changes
- Removed Hall of Visions from navigation and its standalone page.
- Repositioned the Home Gateway / Contact destination to the former Hall of Visions landmark.
- Removed the earlier center-bottom Gateway portal image and media placeholder project.

V148: Archives replaced with interactive scroll shelves, text-only animated parchment dossiers and project links.


V149: The Archives now displays one mixed, tightly packed collection of end-facing scrolls, with circular rolled parchment and plaques; categorised shelves removed. Opening/closing full-screen parchment remains unchanged.

V150: Ancient mixed-age scroll pile, variable diameters and irregular stacking; archive scroll modal scroll fixes.

V151: Archives scroll dialog is now portaled to body, opens directly below the fixed/sticky header with responsive offset, and animates faster. Links at bottom of scroll always navigate to Arena, Citadel, or Workshop instead of project players.


V152: Archives scroll hover interaction responds immediately (85ms transform only); removed costly hover filter/brightness animations.


## V153 — Workshop titles and DeO consolidation
Renamed nine Workshop exhibits as requested. The DeO Homepage, Project, and Timeline now share one Workshop gear/Archives scroll with separate preview buttons and direct page links; asset URLs and existing project IDs are preserved for other projects.


V155 The Architect refinements:
- Removed bolded emphasis in the About page body and highlight values.
- Removed SolidWorks certification claim and formal Blender training duration.
- Changed reading interest to high-fantasy novels.
- Updated highlights to show graduation GPA 3.62/4.00 and the Dean’s List threshold of 3.5+ semester GPA for six consecutive semesters.
- Converted Architect interactive decorative gold details to silver.


## V156 — Gateway contact page
- Replaced placeholder contact page with a functional HTML form (name, reply-to email, subject, message), styled in cool silver.
- Added direct LinkedIn profile link labeled for messaging and resume download.
- Does not display the portfolio owner's email address in visible page text. Note that the email address exists in HTML form action and is visible in source code.
- FormSubmit (third-party delivery) requires first-time confirmation by the inbox owner. Once deployed to an HTTP(S) site, send one test message and approve the activation email before relying on message delivery. Check spam folder if needed.
- Form submissions may go to FormSubmit's hosted confirmation / captcha page. No submit tests were performed to avoid sending real email or initiating confirmation without the owner's action.


## V157 — Gateway portal
Added a silver-blue, CSS-animated magical portal behind the contact layout, with slow swirling light, a glowing runic ring, floating particles, responsive sizing, and reduced-motion support. Contact form and other sections unchanged.


## V158 — Portal visibility fix

The Gateway portal is now in a dedicated visible stage above the contact form. V157 had placed its animation behind almost opaque form cards, leaving the portal largely invisible. The new stage preserves the blue/silver motion and reduced-motion handling.


V159: Portal enlarged and relocated as an animated background behind the Gateway contact panels. Includes luminous rings, pulsing halo and 72 moving particles, with reduced-motion support.


## V160 — Gateway portal refinement
- Removed the boxed background treatment from The Gateway so the portal is the only background element.
- Reshaped the portal into a large vertical oval with stronger pulsing glow, larger rings, more visible particles, and overflow beyond the previous container.


## V161 — Gateway visual refinement
- Removed the orbiting ring/arc effect behind the contact page portal.
- Shifted the portal to darker blue tones with a moodier glow.
- Moved the résumé / connection panel upward to sit closer to the title area and better match the page rhythm.


## V162 — Gateway polish
- Lifted both contact boxes upward and aligned their top edges.
- Removed the hard portal outline and shifted the effect to darker blues.
- Reduced and constrained the particles so the oversized lower-right spark no longer appears.

## V163 — Dark-blue portal luminosity
- Increased the luminous intensity of the portal approximately threefold while keeping the midnight/deep-blue color palette.
- Removed clockwise motion from the core and replaced radial rotating spark trajectories with small, straight upward drifting sparks.
- Kept the form panels and resume positioning unchanged.


## V164 — Gateway single-screen form
- Contact form now uses the full available width with the LinkedIn and resume panel beneath it.
- Desktop layout fits the viewport without scrolling at normal desktop viewport sizes (921px+ wide and 720px+ high); smaller or zoomed views retain scrolling so form fields never become inaccessible.
- Portal stays behind the contact form, sized independently of content height.


## V165 — Citadel initial load and header order
- Removed visibility of the old SVG map fallback while the WebGL war table initializes; use a simple loading message instead.
- Hide temporary fallback-positioned station markers until the current WebGL scene is ready.
- Reordered desktop and mobile navigation: Home, Citadel, Arena, Workshop, Archives, The Architect, The Gateway.


## V166 — Citadel Table
- Renamed war-table instructions to Table.
- Increased table render scale approximately 40% using a closer WebGL camera.
- Replaced side-arrow rotation controls with drag-to-rotate interaction on the table canvas.


## V167 — Table drag and viewer adjustments
- Reversed drag rotation to follow pointer direction and reduced speed from .0085 to .0037 radians/pixel.
- Reduced displayed table scale around 10% using camera-distance adjustment.
- Increased viewer vertical size across desktop, tablet and mobile viewports.

## V168 — Citadel viewer clipping fix
- Expanded the viewer width and height to allow the tabletop base and high terrain to fit within the rendered area.
- Kept the V167 camera distance, drag sensitivity/direction, map geometry, and project markers unchanged.


## V169 — Stable table scale
- Compensated the 3D camera field of view for the enlarged V168 viewer, restoring the on-screen table size from V167 while keeping the larger viewing window.


## V170 — Citadel framing
- Reduced projected table size by 10% by modifying FOV while preserving camera position, project label projection, and drag response.
- Raised the viewer relative to the title so the table sits higher on the page.

## V172 — Citadel vertical positioning correction
- Restored the heading and page layout positioning from V170.
- Raised only the Citadel 3D viewer/table by 56px desktop, 36px tablet, 16px mobile.
- Left camera, model scale, viewer dimensions, and drag controls unchanged.

## V173 — Citadel viewer position
- Moved only the Citadel 3D viewer upward by an additional 180px on desktop versus V172 (110px tablet; 50px mobile), leaving titles and 3D camera/scale alone. Intentionally strong adjustment for visual review.


## V174 — Workshop navigation
- Selecting an exhibit turns the gear before smoothly scrolling to the selected exhibit viewer.
- Scroll targets account for the fixed header; reduced-motion preferences are respected.
- Repeated selections cancel pending scrolls and navigate to the most recently selected exhibit.

## V175 — Active navigation banners
- Active desktop destination now extends downward as a hanging, pointed banner rather than enlarging into an octagonal tab.
- Inactive destination tabs, navigation order, and content areas remain unchanged.


## V176 — Home introduction
- Removed the Menu and Magic Effects toggle controls from the Home page.
- Repurposed the lower-left information box as a concise introduction to Zack and the portfolio realm, rather than a featured project or duplicate navigation.


## V177 — Homepage background
Replaced assets/home-art.png with the user-provided Floating Kingdom illustration (1536x1024). Existing homepage links, markers, overlays, and layout are unchanged.


## V178 — Home refinement
- Reduced the lower-left introduction card dimensions and padding.
- Added tight, dark-blue mouse-following particles on desktop home only; no pointer capture and respects reduced motion.
- Removed the old large cursor halo.


## V179 — Home intro and cursor effects
- Increased welcome text legibility; widened and reduced padding of the box for a shorter profile.
- Brightened and slightly enlarged the blue cursor particles while preserving their tight trail.

## V180 — Homepage landmark placement
- Lowered Citadel, Arena, Workshop, Archives and Gateway destination plaques to avoid obscuring the architecture in the new Floating Kingdom artwork.
- Preserved the header, portrait, intro panel, cursor particles and all destinations.

## V181 — Homepage landmark fine-tuning
- Centered the Architect banner horizontally over the panda adventurer.
- Raised the Citadel banner from 37% to 34.8% to create more separation from the Arena.
- Other landmark placements and pages unchanged.


## V182 — Homepage travel transition and particle brightness
- Homepage destination links fade quickly to deep navy before navigation; keyboard modifiers, downloads, external/new-tab links and reduced-motion settings retain normal behavior.
- Increased the cursor motes’ visible light output through stronger glow, larger illuminated particles and a brighter inner core while preserving blue coloring and their compact grouping.


## V183 — Homepage particle contrast
- Replaced pale cursor particles with midnight-blue outer bodies and vivid blue-white luminous centers.
- Increased visual contrast and brightness while retaining the existing compact trail and travel transition.


## V184 — Lighter homepage motes, faster global travel fade
- Lightened the navy tones of the homepage cursor particle bodies by approximately half while retaining a bright central core.
- Added a faster 140ms transition for same-site navigation from every page, including header tabs; preserves modified clicks, external links, downloads, reduced-motion behavior, and same-page links.

V187: Citadel terrain material lighting, enhanced hillside textures and miniature accents, finished compass bezel, and gentle automatic idle orbit with hover/focus/drag interruption.


## V192 hotfix
Fixes Citadel map failing to render in V191 by deferring landmark pad height evaluation until river tunnel geometry and smoothing helpers have initialized. Building-clipping adjustments from V191 retained.


## V193 roof intersection cleanup
Removed duplicate mill/vault roofs; lifted the fortress central tower above its supporting keep; eliminated observatory horizontal rings slicing the dome; adjusted roof heights and associated trim to reduce coplanar and interpenetrating roof geometry. No changes to project links or camera behavior.


V195: Citadel WebGL material textures amplified roughly 3x versus V194 (200% more contrast), with clamped albedo; no geometry, landmark, or interaction changes.
\n\nV198: Taller snow summit; wispy white cloud bands; brighter snow shader; tunnel mouth reconstructed as an open stone arch with recessed throat and level flowing water.\n
V199: chimney smoke animation, flowing water shader, rebuilt open barrel-vault water tunnels.


V202: Based on user-supplied V199. Removed raised bright-blue river apron geometry at tunnel mouths and matched recessed interior water to dark river color.


V204: Removed Ironworks chimney smoke; replaced the six interior page backgrounds with the corresponding simplified environment PNGs from the supplied archive.


V205: Replaced six page environment backgrounds with the user-supplied clean full-frame versions; preserves V204 Citadel and smoke removal.


V206: Six user-supplied 1672×941 backgrounds matched to Archives, Arena, Citadel, Workshop, Hall/About, Observatory/Contact. Corrected About and Contact routing to avoid reusing the Archives background; project details retain category-specific backgrounds.
