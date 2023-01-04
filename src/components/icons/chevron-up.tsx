import { JSX } from 'solid-js'

export const ChevronUp = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
  <svg
    class="h-6 w-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
  </svg>
)
