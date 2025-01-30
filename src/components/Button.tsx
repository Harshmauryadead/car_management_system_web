import React from "react";
import { cva } from "class-variance-authority";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

// Define button variants using class-variance-authority (CVA)
export const buttonVariants = cva(
	"inline-flex items-center justify-center w-full rounded-md transition-all focus:outline-none active:scale-95",
	{
		variants: {
			color: {
				primary: "bg-blue-600 text-white hover:bg-blue-700",
				secondary: "bg-gray-600 text-white hover:bg-gray-700",
				danger: "bg-red-600 text-white hover:bg-red-700",
				success: "bg-green-600 text-white hover:bg-green-700",
			},
			size: {
				small: "px-4 py-2 text-sm",
				medium: "px-6 py-3 text-base",
				large: "px-8 py-4 text-lg",
			},
			variant: {
				filled: "",
				outlined: "border-2 border-current bg-transparent",
				text: "bg-transparent text-current",
			},
			disabled: {
				true: "opacity-50 cursor-not-allowed",
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
