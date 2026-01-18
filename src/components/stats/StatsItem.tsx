import { ReactNode, JSX } from "react"

interface StatsItemProps {
  label: string
  value: string | number
  icon: ReactNode
  iconBgColor: string
}

export function StatsItem({
  label,
  value,
  icon,
  iconBgColor,
}: StatsItemProps): JSX.Element {
  return (
    <div className="w-full h-29 flex border-1 border-neutral900 rounded-12 overflow-hidden bg-white">
      <div className="w-3/4 flex flex-col gap-3 justify-center border-r-1 border-neutral900">
        <p className="text-preset4 font-poppins text-neutral900 px-5">
          {label}
        </p>
        <p className="text-preset1 font-poppins text-neutral900 px-5 leading-none">
          {value}
        </p>
      </div>

      <div className={`w-1/4 flex justify-center items-center ${iconBgColor}`}>
        {icon}
      </div>
    </div>
  )
}
