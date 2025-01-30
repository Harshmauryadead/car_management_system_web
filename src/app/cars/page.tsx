"use client";

import { buttonVariants } from "@/components/Button";
import { useReadLocalStorage } from "@/hooks/useLocalStorage";
import type { Car } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CarsPage() {
	const [cars, setCars] = useState<Car[]>([]);
	const [filterredCars, setFilterredCars] = useState<Car[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	const token = useReadLocalStorage<string>("token");

	useEffect(() => {
		// token not yet loaded
		if (token === undefined) {
			return;
		}

		// user is not logged in
		if (token === null) {
			router.push("/auth/login");
			return;
		}

		const fetchCars = async () => {
			try {
				setLoading(true);
				const response = await axios.get("/api/cars", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setCars(response.data.cars);
				setFilterredCars(response.data.cars);
			} catch {
				setError("Failed to load cars.");
			} finally {
				setLoading(false);
			}
		};

		fetchCars();
	}, [token, router]);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<main className='flex flex-col gap-2 h-dvh px-8 py-4 overflow-hidden'>
			<h1 className='text-3xl'>Cars List</h1>

			<div className='mb-4'>
				<input
					type='text'
					placeholder='Search cars...'
					className='border p-2 rounded w-full text-black'
					onChange={(e) => {
						const searchTerm = e.target.value.toLowerCase();
						setFilterredCars(
							cars.filter(
								(car) =>
									car.title.toLowerCase().includes(searchTerm) ||
									car.description.toLowerCase().includes(searchTerm) ||
									car.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
							)
						);
					}}
				/>
			</div>

			{error && <div className='error'>{error}</div>}

			<div className='flex-1 overflow-auto rounded'>
				{cars.length === 0 && (
					<div className='h-full w-full grid place-items-center text-xl'>No cars yet</div>
				)}

				{filterredCars.map((car) => (
					<div
						key={car.id}
						className='border rounded p-4 mb-4 shadow-md flex gap-4 max-h-60'>
						<div className='flex-1'>
							<h2 className='text-2xl font-bold mb-2'>{car.title}</h2>
							<p className='mb-2'>{car.description}</p>
							<div className='mb-2'>
								<strong>Tags:</strong> {car.tags.join(", ")}
							</div>
							<Link
								href={`/cars/${car.id}`}
								className='text-blue-500 hover:underline'>
								View Details
							</Link>
						</div>

						<div className='flex-1 flex gap-2 overflow-auto'>
							{car.images.length > 0 ? (
								car.images.map((image, idx) => (
									<img
										key={idx}
										src={image}
										alt={`Car image ${idx + 1}`}
										className='h-full rounded'
									/>
								))
							) : (
								<span>No images available</span>
							)}
						</div>
					</div>
				))}
			</div>

			<Link href='/cars/create' className={buttonVariants()}>
				Add New Car
			</Link>
		</main>
	);
}
