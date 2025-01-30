"use client";

import Button, { buttonVariants } from "@/components/Button";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState } from "react";

export default function SignupPage() {
	const router = useRouter();

	const handleSubmit = async (previousState: string | null, formData: FormData) => {
		const email = formData.get("email");
		const password = formData.get("password");

		try {
			await axios.post("/api/auth/signup", { email, password });
			router.push("/auth/login");
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
				<h1 className='text-3xl font-bold text-white text-center mb-4'>
					Create an Account
				</h1>

				<div className='space-y-4'>
					<fieldset>
						<label className='block text-white/80 text-sm'>Email</label>
						<input
							type='email'
							name='email'
							autoComplete='email'
							required
							className='w-full p-3 rounded-lg border border-white/30 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
						/>
					</fieldset>

					<fieldset>
						<label className='block text-white/80 text-sm'>Password</label>
						<input
							type='password'
							name='password'
							autoComplete='new-password'
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
						{isPending ? "Signing up..." : "Signup"}
					</Button>
					<Link
						href='/auth/login'
						className={buttonVariants({ color: "secondary", size: "medium" })}>
						Already have an account? Login
					</Link>
				</div>

				{error && <div className='text-red-400 text-sm text-center mt-4'>{error}</div>}
			</form>
		</div>
	);
}
