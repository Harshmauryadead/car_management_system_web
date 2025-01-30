"use client";

import Button from "@/components/Button";
import { useReadLocalStorage } from "@/hooks/useLocalStorage";
import type { Car } from "@prisma/client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CarDetailPage() {
	const [car, setCar] = useState<Car | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState<Partial<Car>>({});
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [editting, setEditting] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const router = useRouter();
	const { id: carId } = useParams();

	const token = useReadLocalStorage<string>("token");

	useEffect(() => {
		if (token === undefined) {
			return;
		}

		if (token === null) {
			router.push("/auth/login");
			return;
		}

		const fetchCarDetails = async () => {
			try {
				setLoading(true);
				const response = await axios.get(`/api/cars/${carId}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setCar(response.data);
				setFormData(response.data);
			} catch {
				setError("Failed to load car details.");
			} finally {
				setLoading(false);
			}
		};

		fetchCarDetails();
	}, [carId, token, router]);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleDelete = async () => {
		setDeleting(true);

		if (!window.confirm("Are you sure you want to delete this car?")) return;

		try {
			await axios.delete(`/api/cars/${carId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			router.push("/cars");
		} catch {
			setError("Failed to delete car.");
		} finally {
			setDeleting(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		setEditting(true);

		try {
			const data = {
				title: formData.title!,
				description: formData.description || "",
				images: formData.images || "",
				tags: formData.tags || "",
			};

			await axios.put(`/api/cars/${carId}`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setIsEditing(false);
			setError(null);
			setCar(
				(_car) =>
					_car && {
						..._car,
						...data,
						images: Array.isArray(data.images) ? data.images : [],
						tags: Array.isArray(data.tags) ? data.tags : [],
					}
			);
		} catch {
			setError("Failed to update car.");
		} finally {
			setEditting(false);
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!car) {
		return <div>Car not found</div>;
	}

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>Car Detail</h1>
			{error && <div className='text-red-500 mb-4'>{error}</div>}
			{isEditing ? (
				<form onSubmit={handleSubmit} className='space-y-4'>
					<label className='block'>
						<span>
							Title<sup className='text-red-500'>*</sup>
						</span>
						<input
							type='text'
							value={formData.title || ""}
							required
							onChange={(e) => setFormData({ ...formData, title: e.target.value })}
							className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black p-2'
						/>
					</label>
					<label className='block'>
						<span>Description</span>
						<textarea
							value={formData.description || ""}
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
							className='mt-1 text-black p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
						/>
					</label>
					<label className='block'>
						<span>Images</span>
						<textarea
							value={formData.images?.join("\n") || ""}
							onChange={(e) =>
								setFormData({
									...formData,
									images: e.target.value.split("\n").map((url) => url.trim()),
								})
							}
							className='mt-1 block w-full text-black p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
						/>
					</label>
					<label className='block'>
						<span>Tags</span>
						<textarea
							value={formData.tags?.join("\n") || ""}
							onChange={(e) =>
								setFormData({
									...formData,
									tags: e.target.value.split("\n").map((tag) => tag.trim()),
								})
							}
							className='mt-1 block w-full text-black p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
						/>
					</label>
					<Button type='submit'>Update Car</Button>
				</form>
			) : (
				<div className='flex flex-col md:flex-row'>
					<div className='md:w-1/2'>
						<h2 className='text-xl font-semibold mb-2'>{car.title}</h2>
						<p className='mb-4'>{car.description}</p>
						<div className='mb-4'>
							<strong>Tags:</strong> {car.tags.join(", ")}
						</div>
						<div className='flex gap-2'>
							<Button onClick={handleEdit} disabled={editting}>
								{editting ? "Editting" : "Edit"}
							</Button>
							<Button onClick={handleDelete} disabled={deleting}>
								{deleting ? "Deleting" : "Delete"}
							</Button>
						</div>
					</div>
					<div className='md:w-1/2 md:pl-4'>
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
							{car.images.map((image, idx) => (
								<div key={idx} className='aspect-w-16 aspect-h-9'>
									<img
										src={image}
										alt={`Car image ${idx + 1}`}
										className='object-cover w-full h-full rounded-md'
									/>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
