import { Component, JSX, ParentComponent, Ref, splitProps } from 'solid-js'
import { classes } from '~/utils/classes'
import styles from '~/styles/input.module.css'

interface InputFieldProps extends InputProps {
  for: string
  label: string
  labelClass?: string
  labelStyle?: string | JSX.CSSProperties | undefined
}
interface LabelProps extends JSX.InputHTMLAttributes<HTMLLabelElement> {
  for: string
}
interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  type?: string
  placeholder: string
  required?: boolean
  ref: Ref<HTMLInputElement>
  border?: 'LEFT' | 'RIGHT' | 'BOTH'
}
export const Label: ParentComponent<LabelProps> = (props) => (
  <label {...props} class={classes(styles.label, props.class)} />
)

export const Input: Component<InputProps> = (props) => {
  const [, inputProps] = splitProps(props, ['border'])
  return (
    <input
      {...inputProps}
      type={props.type ?? 'text'}
      id={props.id}
      class={classes(styles.input, props.class)}
      classList={{
        'border-l rounded-l-lg': props.border && ['LEFT'].includes(props.border),
        'border-r rounded-r-lg': props.border && ['RIGHT'].includes(props.border),
        'border rounded-lg': !props.border || ['BOTH'].includes(props.border),
      }}
    />
  )
}

export const InputField: Component<InputFieldProps> = (props) => {
  const [, inputProps] = splitProps(props, ['label', 'ref', 'for', 'class', 'labelClass', 'labelStyle'])
  return (
    <>
      <Label for={props.for} style={props.labelStyle} class={classes(styles.label, props.labelClass)}>
        {props.label}
      </Label>
      <Input {...inputProps} ref={props.ref} type={props.type ?? 'text'} id={props.for} class={props.class} />
    </>
  )
}
