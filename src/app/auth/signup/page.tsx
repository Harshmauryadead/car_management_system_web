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
		<div className='h-dvh w-full grid place-items-center'>
			<form action={submitForm} className='p-4 rounded-lg bg-zinc-800 space-y-2'>
				<h1 className='text-2xl font-bold'>Signup</h1>

				<fieldset>
					<label className='block'>Email</label>
					<input
						type='email'
						name='email'
						autoComplete='email'
						required
						className='w-full rounded p-2 text-black border'
					/>
				</fieldset>

				<fieldset>
					<label className='block'>Password</label>
					<input
						type='password'
						name='password'
						autoComplete='new-password'
						required
						className='w-full rounded p-2 text-black border'
					/>
				</fieldset>

				<div className='flex gap-2'>
					<Button type='submit' disabled={isPending} className='bg-green-700'>
						{isPending ? "Signin up..." : "Signup"}
					</Button>
					<Link href='/auth/login' className={buttonVariants()}>
						Login
					</Link>
				</div>

				{error && <div className='text-red-500 text-sm text-center'>{error}</div>}
			</form>
		</div>
	);
}
