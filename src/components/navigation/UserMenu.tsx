import { signIn, signOut } from '@solid-auth/next/client'
import { Component } from 'solid-js'
import { session } from '~/utils/auth'
import { Avatar } from '../Basics'
import { useDropdownContext, Dropdown, DropdownItem, DropdownLink } from '../Dropdown'

export const UserMenu = () => {
  const [open, context, close] = useDropdownContext()
  return (
    <>
      <Avatar type="button" onClick={open}>
        <img class="h-full w-full" src={session()?.user?.image ?? ''} alt="Rounded avatar" />
      </Avatar>

      <Dropdown context={context} onClose={close}>
        <DropdownItem onClick={signOut}>Sign out</DropdownItem>
        <DropdownLink href="/products">Produkte</DropdownLink>
      </Dropdown>
    </>
  )
}

export const LoginButton: Component = () => {
  return (
    <button class="mr-4 ml-auto transition dark:text-primary-400 dark:hover:text-white " onClick={(event) => signIn()}>
      Login
    </button>
  )
}
