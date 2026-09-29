// Curated release notes shown in-app. Written for the people filling in time
// logs, not for developers — these are deliberately not raw commit messages.
// Add a new entry at the top and bump APP_VERSION and package.json together.

export type ChangelogTag = "feature" | "improvement" | "fix";

export type ChangelogEntry = {
  /** Semver, matching package.json. */
  version: string;
  /** YYYY-MM-DD. */
  date: string;
  title: string;
  tag: ChangelogTag;
  items: string[];
};

export const APP_VERSION = "2.7.0";

/** Newest first. */
export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "2.7.0",
    date: "2026-09-29",
    title: "A smoother dashboard that shows when a page is loading",
    tag: "improvement",
    items: [
      "A thin bar runs across the top of the window while a page or its data is loading",
      "Pages, dialogs, panels and messages now ease into place instead of appearing all at once",
      "The highlight in the sidebar glides to the section you pick, and the phone menu slides in and out",
      "If your device is set to reduce motion, everything fades instead of moving",
    ],
  },
  {
    version: "2.6.0",
    date: "2026-09-29",
    title: "One theme for the whole dashboard, and a clearer view of your access",
    tag: "improvement",
    items: [
      "Light, dark or match-your-device is now chosen once in the dashboard's Settings, and every app in it follows your choice",
      "The Time Logger's settings tab is now called App Settings and holds only the Time Logger's own options",
      "Your access in Settings now shows every permission in areas you can open and close, with what you have, what you don't, and anything added or removed just for you",
      "The dashboard's sidebar now stays in view while you scroll, and on phones it opens from a menu button instead of a sideways-scrolling strip",
      "Pages across the website now show where you are, with a trail of links back to the sections above",
    ],
  },
  {
    version: "2.5.0",
    date: "2026-09-29",
    title: "Your own dashboard, with the Time Logger as an app inside it",
    tag: "feature",
    items: [
      "Signing in now takes you to your dashboard, which shows only what your access includes",
      "The Time Logger has its own page inside the dashboard: open it from the Time Logger card on Home, and use Dashboard at the top to come back",
      "Your name, password and signed-in devices are now under Settings in the dashboard's sidebar",
      "People who write for the site get a new Insights editor for drafting, scheduling and publishing articles, with search settings, FAQs, calls to action and a table of contents built in",
      "Setting access is simpler: each person in Team has clear icon actions, and roles are edited one at a time with a switch for each whole area",
    ],
  },
  {
    version: "2.4.0",
    date: "2026-09-29",
    title: "One tracker, and a proper admin area to run it",
    tag: "feature",
    items: [
      "You'll be asked to sign in again once after this update",
      "The old Google Sheets version of the tracker has been retired, so everything now lives here",
      "A new Profile section in Settings lets you set the name shown for you, change your password, sign out your other devices and see exactly what your access allows",
      "Admins now have their own area for time logs, projects, the team and roles, where access is set per role with on/off switches and can be fine-tuned for any one person",
      "Entries can now be flagged for a closer look, with a short note saying why",
    ],
  },
  {
    version: "2.3.0",
    date: "2026-09-24",
    title: "Sounds you can switch on, and a set-up you can take with you",
    tag: "feature",
    items: [
      "New sound options in Settings: a ticking clock, a chime on every hour, and short cues when you save or delete an entry or start and stop the timer. All of them start off",
      "A new option keeps the stopwatch running after you save a timed session, starting it again on the same project so back-to-back work has no gaps",
      "Export your whole dashboard set-up to a file, and import it in another browser to get the same cards, layout and options straight away",
      "The Overview clock is now set in the same bold type as the rest of the site",
      "Cards now catch a faint glint of light when you hover over them, and the row of extra figures under your cards is gone. Click your cards to see them instead",
    ],
  },
  {
    version: "2.2.0",
    date: "2026-09-24",
    title: "See your whole day at a glance, on a cleaner Overview",
    tag: "feature",
    items: [
      "A new day timeline shows all 24 hours: green where you logged work, red where time passed with nothing logged, and grey for the hours still to come",
      "Pick a project above the timeline to pick out just its hours, and click any session to see what it was, when it ran and how long it took",
      "The top of the Overview now shows a big clock and today's date, with this week laid out beside it",
      "Your cards can now be minimised into a two-by-two square like every other section",
      "Extra cards no longer fold open beneath the top row. Click your cards to see them in a window instead, so the page keeps its shape",
    ],
  },
  {
    version: "2.1.1",
    date: "2026-09-24",
    title: "Monthly targets never ask for more than 160 hours",
    tag: "fix",
    items: [
      "Your expected hours for the month now stop at 160, even in months with more than twenty working days",
      "Month complete and Month pace measure against that capped target, so a long month no longer reads as falling behind",
    ],
  },
  {
    version: "2.1.0",
    date: "2026-09-09",
    title: "A fiercer fire behind your streak",
    tag: "improvement",
    items: [
      "The fire behind the streak card now fills far more of the card instead of pooling in one corner",
      "Its colour is deeper and stronger, so a long streak is obvious at a glance",
      "Embers now drift across most of the card's width, while the text on the right stays easy to read",
      "The streak number and its flame are both noticeably bigger, so the count carries the card",
    ],
  },
  {
    version: "2.0.0",
    date: "2026-09-09",
    title: "Settings of your own, and an Overview you can make yours",
    tag: "feature",
    items: [
      "A new Settings tab gathers the theme and time format that used to sit unlabelled in the top corner, each with a name and a line saying what it does",
      "Two new options there: have the stopwatch start on its own the moment you save an entry, and turn off scrolling over the calendar to change month",
      "Customise on the Overview is now a single button — pick which cards you see, drag the sections into any order, and hide the ones you never look at",
      "Every section has two sizes: maximised across the full width, or minimised to a square that sits two to a row",
      "The streak card is lit by its own fire, climbing higher and burning hotter the longer you keep going, with no top level to reach",
    ],
  },
  {
    version: "1.9.0",
    date: "2026-09-08",
    title: "Your logging streak, rebuilt",
    tag: "improvement",
    items: [
      "The streak now sits in its own strip under the calendar, so the calendar gets the full width of the page",
      "A flame that grows and burns hotter the longer your streak runs, and goes out when it breaks",
      "Your last ten working days are shown as a row of squares — logged, missed, or a day off — so you can see the shape of the fortnight at a glance",
      "Days you have not logged are named on one line instead of stacked in a list",
    ],
  },
  {
    version: "1.8.0",
    date: "2026-08-28",
    title: "Targets: what you owe the month, and whether you are keeping up",
    tag: "feature",
    items: [
      "Expected · this month and Expected · this week count your working days at eight hours each, so you can see the target itself",
      "Month complete and Week complete show how much of that target is done — a progress figure that fills up as the period runs",
      "Month pace and Week pace compare your hours against what was expected by today, so being behind shows up in amber or red while you can still do something about it",
      "Days you mark as Leave or Holiday come off the target rather than counting against you",
      "The card picker under Customise now groups every card by what it measures, shows each one's current value before you add it, and lets you filter by name",
    ],
  },
  {
    version: "1.7.0",
    date: "2026-08-20",
    title: "Choose your own Overview cards",
    tag: "feature",
    items: [
      "A new Yesterday card, plus Last working day, Last week, This year, Pending approval, Top project and eight more",
      "Customise in the top right lets you rearrange the cards in place — remove one from the tile itself, send it behind Show more, or tap a hidden card to add it back",
      "The grid reshapes itself to however many cards you have showing",
      "Your choices are remembered — on your account in the new tracker, in your browser in the legacy one",
    ],
  },
  {
    version: "1.6.0",
    date: "2026-08-12",
    title: "Entry totals, readable times and CSV export",
    tag: "feature",
    items: [
      "The Entries tab now summarises whatever your filters match — total hours, approved vs pending, average per day and your top project",
      "Export CSV on the Entries tab downloads every entry matching your filters",
      "A new switch in the header shows hours as 7h 30m instead of 7.5, everywhere in the tracker",
      "Tabs, cards and entries now animate as they change",
    ],
  },
  {
    version: "1.5.0",
    date: "2026-08-06",
    title: "Weeks start on Sunday",
    tag: "improvement",
    items: [
      "The calendar and your This week hours now run Sunday to Saturday",
      "A new Overview tile showing your total hours for last month",
    ],
  },
  {
    version: "1.4.0",
    date: "2026-07-23",
    title: "Leave, holidays and a month calendar",
    tag: "feature",
    items: [
      "Mark any day as leave or a holiday, straight from the calendar",
      "A month-at-a-glance calendar on the Overview tab",
      "Days off no longer count as missed logs, and never affect your hour totals",
    ],
  },
  {
    version: "1.3.0",
    date: "2026-07-23",
    title: "Quality of Life Changes",
    tag: "feature",
    items: [
      "Your dashboard is now organised into tabs",
      "New charts and weekly metrics on the Overview tab",
      "Faster ways to log your daily hours",
    ],
  },
  {
    version: "1.2.0",
    date: "2026-06-26",
    title: "Dark mode across the logger",
    tag: "improvement",
    items: [
      "Every logger page now follows your light or dark preference",
      "Date and number pickers match the theme too",
    ],
  },
  {
    version: "1.1.0",
    date: "2026-06-21",
    title: "Better entry descriptions",
    tag: "improvement",
    items: [
      "Add tools, areas, status and a reference to any entry",
      "Descriptions are formatted consistently for review",
    ],
  },
  {
    version: "1.0.0",
    date: "2026-06-11",
    title: "New backend, activity log and error handling",
    tag: "feature",
    items: [
      "Moved off Google Sheets onto a faster backend",
      "Clearer messages when something goes wrong",
      "A new Logs page for viewing recent activity",
    ],
  },
];

/** Negative if a < b, positive if a > b, 0 if equal. */
export function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i += 1) {
    const x = pa[i] ?? 0;
    const y = pb[i] ?? 0;
    if (x !== y) return x - y;
  }
  return 0;
}
