import React from "react";
import { cva } from "class-variance-authority";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

// Define button variants using class-variance-authority (CVA)
export const buttonVariants = cva(
	"inline-flex items-center justify-center w-full rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 shadow-sm",
	{
		variants: {
			color: {
				primary: "bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-indigo-400",
				secondary: "bg-gray-700 text-white hover:bg-gray-800 focus:ring-gray-500",
				danger: "bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-400",
				success: "bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-400",
			},
			size: {
				small: "px-3 py-1.5 text-sm font-medium",
				medium: "px-5 py-2 text-base font-semibold",
				large: "px-7 py-3 text-lg font-bold",
			},
			variant: {
				filled: "",
				outlined: "border-2 border-current bg-transparent hover:bg-opacity-10",
				text: "bg-transparent text-current hover:underline",
			},
			disabled: {
				true: "opacity-50 cursor-not-allowed pointer-events-none",
				false: "",
			},
		},
		defaultVariants: {
			color: "primary",
			size: "medium",
			variant: "filled",
			disabled: false,
		},
	}
);

// Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	color?: "primary" | "secondary" | "danger" | "success";
	size?: "small" | "medium" | "large";
	variant?: "filled" | "outlined" | "text";
	disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
	color = "primary",
	size = "medium",
	variant = "filled",
	disabled = false,
	className,
	children,
	...props
}) => {
	// Combine the button variant classes with any custom className passed
	const buttonClass = twMerge(
		clsx(buttonVariants({ color, size, variant, disabled }), className)
	);

	return (
		<button className={buttonClass} disabled={disabled} {...props}>
			{children}
		</button>
	);
};

export default Button;
