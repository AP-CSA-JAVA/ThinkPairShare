# Think · Pair · Share

A live classroom tool: students **think** about a topic, **pair** up to discuss it, **write** a group response, and the teacher **shares** chosen responses with the class. One file (`index.html`), no install, hosts on GitHub Pages.

## What it does

| Teacher | Students |
|---|---|
| Posts a topic/prompt (updates live) | Join with a 5-letter code and their name |
| Runs phases: **Lobby → Think → Pair → Write → Share** | See the phase, instructions, and countdown |
| Adjustable timer per phase: ±15 s steppers, click a time to type it, ±30 s live, pause/reset, optional chime | Private notes box for the Think phase (stays on their device) |
| **Random pairs** (odd class size → one trio) or pick students by hand | See their partner(s) |
| Force a third student into any pair (max 3 per group) | One student types for the group; the others watch it live and can tap **I'll type instead** |
| **Share with class** puts a group's response on every screen and the projector; names can be hidden | Shared response appears at the top of their page |
| Profanity filter, extra blocked words, **See original** on flagged responses | Warned when a word will be hidden |
| Lock typing, New round (keeps groups), Export CSV, remove a student | Rejoin automatically if they refresh |

Class size is capped at **40**. Change `MAX_STUDENTS` near the top of `index.html` if needed.

### Profanity filter
Masks school-inappropriate words with `****` everywhere a response is shown (partner view, teacher board, projector, CSV). It catches leetspeak (`sh!t`, `@ss`), stretched letters (`fuuuck`), and spaced or dotted spelling (`f u c k`), while leaving words like *assess*, *Dickens*, *cocktail*, and *Scunthorpe* alone. It also blocks inappropriate names at join. Add your own words in **Settings** (they also block any word that starts with them). No filter is perfect, so the teacher reviews before sharing; flagged cards are outlined in red.

## Try it right now (demo mode)
Open `index.html` in a browser. With no Firebase settings it runs in **demo mode**: open one tab as the teacher and a few more tabs as students, all on the same computer. Good for testing; real classes need the live setup below.

## Live setup for a class (about 10 minutes, free)
Students on different devices need a shared, real-time database. This uses Google Firebase's free plan (100 simultaneous connections, plenty for 40 students + teacher + projector).

1. Go to **console.firebase.google.com** → **Add project** (Google Analytics not needed).
2. **Build → Realtime Database → Create database**. Pick a US location, start in **locked mode**.
3. Open the **Rules** tab, paste this, and **Publish**:

```json
{
  "rules": {
    ".read": false,
    ".write": false,
    "rooms": {
      "$room": {
        ".read": true,
        ".write": true,
        ".validate": "$room.length <= 6",
        "groups": { "$g": { "raw": { ".validate": "newData.isString() && newData.val().length <= 1000" } } },
        "students": { "$s": { "name": { ".validate": "newData.isString() && newData.val().length <= 30" } } }
      }
    }
  }
}
```

4. **Project settings (gear) → General → Your apps → Web (`</>`)**. Register an app (no hosting needed) and copy the `firebaseConfig` object.
5. In `index.html`, replace `const FIREBASE_CONFIG = null;` with your config, e.g.

```js
const FIREBASE_CONFIG = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  appId: "1:123:web:abc"
};
```

Make sure `databaseURL` is included (copy it from the Realtime Database page if the snippet doesn't show it). This key is safe to put in a public page; the rules above are what protect the data.

6. Upload `index.html` to a repo in the **ap-csa-java** organization (e.g. `think-pair-share`) using the GitHub web editor, then **Settings → Pages → Deploy from branch → main / root**.

## Using it in class
- **Teacher:** open `https://ap-csa-java.github.io/think-pair-share/?teacher`. A new session code is created. Click **Projector view ↗** and drag that window to the projector; in the Lobby it shows the join code in giant letters.
- **Students:** go to `ap-csa-java.github.io/think-pair-share` (or use **Copy join link** and post it in Canvas), tap **I'm a student**, enter the code and name.
- Suggested flow: post the topic → **Think** → make pairs → **Pair** → **Write** → **Share** a few groups → **New round**.
- **Before the first class**, test on the school network from a student Chromebook. The app needs `gstatic.com` and `firebaseio.com`; if the filter blocks them, ask IT to allow both.

## Privacy notes
- Anyone with the session code can read that session's data, so codes are random and short-lived. Click **End session** when done; it deletes everything from the database.
- Responses aren't kept after a session ends unless you **Export CSV** first (the CSV includes every round and the original text of filtered responses).
