import { JSX } from 'solid-js'
export const ShoppingBagIcon = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
  <svg
    class="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    ></path>
  </svg>
)
