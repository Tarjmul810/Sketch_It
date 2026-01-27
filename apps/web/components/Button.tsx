
let variants = {
    primary: "bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform",
    secondary: "text-black bg-white"
}

interface ButtonProps {
    variant?: "primary" | "secondary";
    children: React.ReactNode
    className?: string
    onClick?: () => void
    disabled?: boolean
}

export function Button({ 
    variant = "primary", 
    children, 
    className = "", 
    onClick, 
    disabled 
}: ButtonProps) {
    return (
        <button 
            className={`${variants[variant]} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}