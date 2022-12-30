import i18next from 'i18next'
import HttpApi from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { UnwrapPromise } from '@prisma/client'

export const i18n = i18next
  .use(HttpApi)
  .use(LanguageDetector)
  .init(
    {
      fallbackLng: 'en',
      preload: ['de', 'en'],
      ns: 'translations',
      defaultNS: 'translations',
      fallbackNS: false,
      debug: true,
      detection: {
        order: ['querystring', 'navigator', 'htmlTag'],
        lookupQuerystring: 'lang',
      },
      backend: {
        loadPath: '/api/i18n/{{lng}}-{{ns}}',
      },
    },
    (err, t) => {
      if (err) return console.error(err)
    },
  )

export type I18n = UnwrapPromise<typeof i18n>

export default i18n
