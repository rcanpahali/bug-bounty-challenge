export const issues = [
  {
    id: "key-prop-error",
    icon: "🐞",
    isSolved: true,
    title: 'Console error: Warning: Each child in a list should have a unique "key" prop.',
    description: "Hope you are able to find what is causing this error, as it is annoying."
  },
  {
    id: "bold-known-text",
    icon: "🐞",
    isSolved: true,
    title: 'The word "known" should be displayed bold in the introduction text.',
    description: "When implementing a solution, please ensure to not change the i18n text."
  },
  {
    id: "missing-user-avatar",
    icon: "🐞",
    isSolved: true,
    title: "User avatar in app bar is missing, although user should be fetched on app start correctly.",
    description:
      "On app start we load the current user object via a MobX store, but for any reason the user avatar is not displayed in the top right of the app bar. Attention: When solving this issue, you might will be confronted with a second bug."
  },
  {
    id: "broken-countdown",
    icon: "🐞",
    isSolved: false,
    title: "Optional: Countdown is broken sometimes (hard to reproduce).",
    description:
      "Some developers mentioned that the countdown in the app header behaves strange sometimes, but unfortunately they were not able to reproduce this glitch reliably, maybe you find the root cause."
  },
  {
    id: "language-switcher",
    icon: "⭐️",
    isSolved: false,
    title: "Optional: It would be great to be able to switch the language.",
    description: "Please add a language select control in the app bar to switch the UI language between english and german."
  }
];
