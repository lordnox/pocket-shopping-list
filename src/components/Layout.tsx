import { Component, createEffect, Match, ParentComponent, Show, Switch } from 'solid-js'
import { navigation } from '~/roots/navigation'
import { Navigation } from './navigation/Navigation'

export const Title: Component<{ children: string }> = (props) => {
  createEffect(() => navigation.setTitle(props.children))
  return null
}

export const Layout: ParentComponent = (props) => {
  return (
    <>
      <Navigation />
      <div class="pt-[74px] transition-all">{props.children}</div>
    </>
  )
}
