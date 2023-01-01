export const classes = (...classes: (string | undefined | null)[]) => classes.filter(Boolean).join(' ')
