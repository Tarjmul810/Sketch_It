interface ButtonProps {
    className?: string
    icon: React.ReactNode
    onClick?: () => void
    activated?: boolean
}

export function Icon ({className, icon, onClick, activated}: ButtonProps) {
   
    return (
       <div className={`rounded-full p-2 m-2 outline-2 cursor-pointer ${activated ? "text-red-600" : "text-black"}`} onClick={onClick}>
            {icon}
        </div>
    )
}