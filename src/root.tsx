// @refresh reload
import { Body, FileRoutes, Head, Html, Meta, Routes, Scripts, Title, Link } from 'solid-start'
import './root.css'
import { Layout } from './components/Layout'
import { Suspense } from 'solid-js'

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>Home Server</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Link rel="icon" type="image/svg+xml" href="/assets/images/favicon.svg" />
        <Link rel="icon" type="image/png" href="/assets/images/favicon.png" />
        <Link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <Link rel="manifest" href="/site.webmanifest" />
      </Head>
      <Body>
        <Layout>
          <Suspense>
            <Routes>
              <FileRoutes />
            </Routes>
          </Suspense>
        </Layout>

        <Scripts />
      </Body>
    </Html>
  )
}
