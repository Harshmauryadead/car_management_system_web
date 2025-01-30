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
	const [filteredCars, setFilteredCars] = useState<Car[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	const token = useReadLocalStorage<string>("token");

	useEffect(() => {
		if (token === undefined) return;
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
				setFilteredCars(response.data.cars);
			} catch {
				setError("Failed to load cars.");
			} finally {
				setLoading(false);
			}
		};

		fetchCars();
	}, [token, router]);

	if (loading) {
		return (
			<div className='h-screen flex items-center justify-center text-white'>Loading...</div>
		);
	}

	return (
		<main className='min-h-screen px-6 py-8 bg-gradient-to-br from-gray-900 to-gray-700 text-white'>
			<div className='max-w-4xl mx-auto'>
				<h1 className='text-4xl font-bold text-center mb-6'>Available Cars</h1>

				<div className='mb-6'>
					<input
						type='text'
						placeholder='Search cars...'
						className='w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500'
						onChange={(e) => {
							const searchTerm = e.target.value.toLowerCase();
							setFilteredCars(
								cars.filter(
									(car) =>
										car.title.toLowerCase().includes(searchTerm) ||
										car.description.toLowerCase().includes(searchTerm) ||
										car.tags.some((tag) =>
											tag.toLowerCase().includes(searchTerm)
										)
								)
							);
						}}
					/>
				</div>

				{error && <div className='text-red-400 text-center mb-4'>{error}</div>}

				<div className='grid md:grid-cols-2 gap-6'>
					{filteredCars.length === 0 ? (
						<div className='col-span-2 text-center text-xl'>No cars available</div>
					) : (
						filteredCars.map((car) => (
							<div
								key={car.id}
								className='bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl shadow-lg hover:scale-[1.02] transition-all'>
								<div className='mb-4'>
									<h2 className='text-2xl font-bold'>{car.title}</h2>
									<p className='text-white/80'>{car.description}</p>
								</div>

								<div className='text-sm mb-3'>
									<strong>Tags:</strong> {car.tags.join(", ")}
								</div>

								<div className='flex gap-2 overflow-x-auto'>
									{car.images.length > 0 ? (
										car.images.map((image, idx) => (
											<img
												key={idx}
												src={image}
												alt={`Car image ${idx + 1}`}
												className='h-32 w-48 rounded-lg object-cover border border-white/30'
											/>
										))
									) : (
										<span className='text-white/60'>No images available</span>
									)}
								</div>

								<div className='mt-4 flex justify-between items-center'>
									<Link
										href={`/${car.id}`}
										className='text-blue-400 hover:underline'>
										View Details
									</Link>
								</div>
							</div>
						))
					)}
				</div>

				<div className='mt-6 text-center'>
					<Link href='/create' className={buttonVariants({ color: "primary" })}>
						Add New Car
					</Link>
				</div>
			</div>
		</main>
	);
}
