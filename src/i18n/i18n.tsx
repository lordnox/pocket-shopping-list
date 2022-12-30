import { createSignal, onMount } from 'solid-js'
import { createContext, ParentComponent, useContext } from 'solid-js'
import { i18n } from '~/i18n/config'
import i18next from 'i18next'

export const I18nContext = createContext<typeof i18next>()

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new ReferenceError('I18nContext')
  return context
}

export const I18nProvider: ParentComponent = (props) => {
  const [loaded, setLoaded] = createSignal(false)

  onMount(async () => {
    await i18n
    setLoaded(true)
  })

  return <I18nContext.Provider value={i18next}>{props.children}</I18nContext.Provider>
}
