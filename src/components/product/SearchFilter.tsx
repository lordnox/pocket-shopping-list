import { Component, onCleanup } from 'solid-js'

export const ShoppingSearch: Component<{
  onSearch: (val: string) => void
  label: string
  placeholder: string
  buttonText?: string
  debounce?: number
}> = (props) => {
  let input: HTMLInputElement
  let timer: ReturnType<typeof setTimeout>

  const onInput = () => {
    clearTimeout(timer)
    timer = setTimeout(() => props.onSearch(input.value), props.debounce ?? 250)
  }
  onCleanup(() => clearTimeout(timer))
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        props.onSearch(input.value)
        clearTimeout(timer)
      }}
      class="my-4"
    >
      <label for="default-search" class="sr-only mb-2 text-sm font-medium text-primary-900 dark:text-white">
        {props.label}
      </label>
      <div class="relative">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            aria-hidden="true"
            class="h-5 w-5 text-primary-500 dark:text-primary-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          ref={input!}
          onInput={onInput}
          type="search"
          id="default-search"
          class="block w-full rounded-lg border border-primary-300 bg-primary-50 p-4 pl-10 text-sm text-primary-900 focus:border-secondary-500 focus:ring-secondary-500 dark:border-primary-600 dark:bg-primary-700 dark:text-white dark:placeholder-primary-400 dark:focus:border-secondary-500 dark:focus:ring-secondary-500"
          placeholder={props.placeholder}
          required
        />
        <button
          type="submit"
          class="absolute right-2.5 bottom-2.5 rounded-lg bg-secondary-700 px-4 py-2 text-sm font-medium text-white hover:bg-secondary-800 focus:outline-none focus:ring-4 focus:ring-secondary-300 dark:bg-secondary-600 dark:hover:bg-secondary-700 dark:focus:ring-secondary-800"
        >
          {props.buttonText ?? 'Suchen'}
        </button>
      </div>
    </form>
  )
}
