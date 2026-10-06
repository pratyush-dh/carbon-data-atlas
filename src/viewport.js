// Side panels start open on desktop and closed on phones, where they would push the content off screen.
export const startsOpen = () => typeof window === 'undefined' || window.matchMedia('(min-width: 861px)').matches
