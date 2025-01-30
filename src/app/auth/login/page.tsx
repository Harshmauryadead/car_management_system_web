"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { useActionState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Button, { buttonVariants } from "@/components/Button";

export default function LoginPage() {
	const router = useRouter();
	const [, setToken] = useLocalStorage<string>("token");

	const handleSubmit = async (previousState: string | null, formData: FormData) => {
		const email = formData.get("email");
		const password = formData.get("password");

		try {
			const response = await axios.post("/api/auth/login", { email, password });
			setToken(response.data.token);
			router.push("/");
		} catch (err) {
			if (axios.isAxiosError(err) && err.response) {
				return err.response.data.error as string;
			}
			return "An unknown client-side error occurred";
		}

		return null;
	};

	const [error, submitForm, isPending] = useActionState(handleSubmit, null);

	return (
		<div className='h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700'>
			<form
				action={submitForm}
				className='w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl'>
				<h1 className='text-3xl font-bold text-white text-center mb-4'>Welcome Back</h1>

				<div className='space-y-4'>
					<fieldset>
						<label className='block text-white/80 text-sm'>Email</label>
						<input
							type='email'
							name='email'
							autoComplete='username'
							required
							className='w-full p-3 rounded-lg border border-white/30 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
						/>
					</fieldset>

					<fieldset>
						<label className='block text-white/80 text-sm'>Password</label>
						<input
							type='password'
							name='password'
							autoComplete='current-password'
							required
							className='w-full p-3 rounded-lg border border-white/30 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
						/>
					</fieldset>
				</div>

				<div className='flex flex-col gap-4 mt-6'>
					<Button
						type='submit'
						disabled={isPending}
						className='bg-blue-500 hover:bg-blue-600'>
						{isPending ? "Logging in..." : "Login"}
					</Button>
					<Link
						href='/auth/signup'
						className={buttonVariants({ color: "secondary", size: "medium" })}>
						Create an Account
					</Link>
				</div>

				{error && <div className='text-red-400 text-sm text-center mt-4'>{error}</div>}
			</form>
		</div>
	);
}
