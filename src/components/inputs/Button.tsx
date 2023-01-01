import { JSX, ParentComponent } from 'solid-js'
import buttonStyles from '~/styles/button.module.css'
import { classes } from '~/utils/classes'

export const Button: ParentComponent<JSX.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
  <button {...props} class={classes(props.class, buttonStyles.button, buttonStyles.updateColors)} />
)
