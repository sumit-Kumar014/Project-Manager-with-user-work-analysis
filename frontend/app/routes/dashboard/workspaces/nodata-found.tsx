import { Button } from '@/components/ui/button'
import { CirclePlus, LayoutGrid } from 'lucide-react'

interface Props {
  title: string
  description: string
  buttonText: string
  buttonAction: () => void
}

const NoDataFound = ({ title, description, buttonText, buttonAction }: Props) => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center text-center py-16 2xl:py-28 bg-muted/30 rounded-2xl border border-dashed border-muted-foreground/20 shadow-sm">
      {/* Icon */}
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted-foreground/10 text-muted-foreground">
        <LayoutGrid className="w-8 h-8" />
      </div>

      {/* Title */}
      <h3 className="mt-6 text-lg font-semibold tracking-tight">{title}</h3>

      {/* Description */}
      <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
        {description}
      </p>

      {/* Action Button */}
      <Button
        onClick={buttonAction}
        className="mt-6 flex items-center gap-2 rounded-xl px-5 shadow-sm"
      >
        <CirclePlus className="w-4 h-4" />
        {buttonText}
      </Button>
    </div>
  )
}

export default NoDataFound
