"use client";

import Button from "@/components/Button";
import { useReadLocalStorage } from "@/hooks/useLocalStorage";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useActionState } from "react";

export default function CarCreatePage() {
	const router = useRouter();
	const token = useReadLocalStorage<string>("token");

	const handleSubmit = async (currentState: string | null, formData: FormData) => {
		if (!token) {
			return "Unauthorized!";
		}

		const { title, description, images, tags } = Object.fromEntries(formData);

		if (!title) {
			return "Title is required";
		}

		const formattedImages = images ? (images as string).split("\n").filter(Boolean) : [];
		const formattedTags = tags ? (tags as string).split("\n").filter(Boolean) : [];

		try {
			const response = await axios.post(
				`/api/cars`,
				{
					title,
					description,
					images: formattedImages,
					tags: formattedTags,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);

			router.push(`/cars/${response.data.car.id}`);
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
		<main className='px-8 py-4'>
			<h1 className='text-3xl mb-2'>Add New Car</h1>

			<form action={submitForm} className='flex flex-col gap-4 p-6 rounded shadow-md'>
				<fieldset className='flex flex-col gap-2'>
					<label htmlFor='title' className='block font-semibold'>
						Title<sup className='text-red-500'>*</sup>
					</label>
					<input
						type='text'
						id='title'
						name='title'
						className='rounded py-2 px-3 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
				</fieldset>

				<fieldset className='flex flex-col gap-2'>
					<label htmlFor='description' className='block font-semibold'>
						Description
					</label>
					<textarea
						id='description'
						name='description'
						className='rounded py-2 px-3 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
				</fieldset>

				<fieldset className='flex flex-col gap-2'>
					<label htmlFor='images' className='block font-semibold'>
						Images <span className='text-sm'>(public image url)</span>
					</label>
					<textarea
						id='images'
						name='images'
						placeholder={`https://host.com/image1.jpg
https://host.com/image2.jpg`}
						className='rounded py-2 px-3 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
				</fieldset>

				<fieldset className='flex flex-col gap-2'>
					<label htmlFor='tags' className='block font-semibold'>
						Tags <span className='text-sm'>(space serperated)</span>
					</label>
					<textarea
						id='tags'
						name='tags'
						placeholder={`racing
fast`}
						className='rounded py-2 px-3 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
				</fieldset>

				{error && <div className='text-red-500 text-sm text-center'>{error}</div>}

				<Button type='submit' disabled={isPending} className='mt-4'>
					{isPending ? "Adding..." : "Add Car"}
				</Button>
			</form>
		</main>
	);
}
