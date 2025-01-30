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
			router.push("/cars");
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
		<div className='h-dvh w-full grid place-items-center'>
			<form action={submitForm} className='p-4 rounded-lg bg-zinc-800 space-y-2'>
				<h1 className='text-2xl font-bold'>Login</h1>

				<fieldset>
					<label className='block'>Email</label>
					<input
						type='email'
						name='email'
						autoComplete='username'
						required
						className='w-full rounded p-2 text-black border'
					/>
				</fieldset>

				<fieldset>
					<label className='block'>Password</label>
					<input
						type='password'
						name='password'
						autoComplete='current-password'
						required
						className='w-full rounded p-2 text-black border'
					/>
				</fieldset>

				<div className='flex gap-2'>
					<Button type='submit' disabled={isPending} className='bg-green-700'>
						{isPending ? "Logging in..." : "Login"}
					</Button>
					<Link href='/auth/signup' className={buttonVariants()}>
						Signup
					</Link>
				</div>

				{error && <div className='text-red-500 text-sm text-center'>{error}</div>}
			</form>
		</div>
	);
}
