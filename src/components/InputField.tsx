import { Component, JSX, Ref, splitProps } from 'solid-js'

const labelCss = `
  text-left
  block
  mb-1
  text-sm
  font-medium
  text-gray-900
  dark:text-white
`

const buttonCss = `
  bg-gray-50
  border
  border-gray-300
  text-gray-900
  text-sm
  rounded-lg
  focus:ring-blue-500
  focus:border-blue-500
  block
  w-full
  p-2
  h-10
  dark:bg-gray-700
  dark:border-gray-600
  dark:placeholder-gray-400
  dark:text-white
  dark:focus:ring-blue-500
  dark:focus:border-blue-500
`

interface InputFieldProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  for: string
  type?: string
  label: string
  labelClass?: string
  labelStyle?: string | JSX.CSSProperties | undefined
  placeholder: string
  required?: boolean
  ref: Ref<HTMLInputElement>
}

export const InputField: Component<InputFieldProps> = (props) => {
  const [, inputProps] = splitProps(props, ['label', 'ref', 'for', 'class', 'labelClass', 'labelStyle'])
  return (
    <>
      <label for={props.for} style={props.labelStyle} classList={{ [labelCss]: true, [props.labelClass ?? '']: true }}>
        {props.label}
      </label>
      <input
        {...inputProps}
        ref={props.ref}
        type={props.type ?? 'text'}
        id={props.for}
        classList={{
          [buttonCss]: true,
          [props.class ?? '']: true,
        }}
        placeholder={props.placeholder}
        required={props.required ?? false}
      />
    </>
  )
}
