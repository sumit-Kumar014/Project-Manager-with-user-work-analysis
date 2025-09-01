import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"

export const BackButton = () => {
    const navigate = useNavigate()

    return (
        <Button variant={"outline"} onClick={() => navigate(-1)} size={"sm"} className="px-4 mr-4">
            ← back
        </Button>
    )
}