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
			router.push("/");
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
		return <div className='flex justify-center items-center h-screen text-lg'>Loading...</div>;
	}

	if (!car) {
		return <div className='flex justify-center items-center h-screen text-lg text-gray-500'>Car not found</div>;
	}

	return (
		<div className='max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg'>
			<h1 className='text-3xl font-semibold mb-6'>Car Details</h1>
			{error && <div className='text-red-500 mb-4'>{error}</div>}
			{isEditing ? (
				<form onSubmit={handleSubmit} className='space-y-6'>
					<div>
						<label className='block text-gray-700'>Title *</label>
						<input
							type='text'
							value={formData.title || ""}
							required
							onChange={(e) => setFormData({ ...formData, title: e.target.value })}
							className='w-full mt-1 p-3 border rounded-md shadow-sm focus:ring focus:ring-indigo-300'
						/>
					</div>
					<div>
						<label className='block text-gray-700'>Description</label>
						<textarea
							value={formData.description || ""}
							onChange={(e) => setFormData({ ...formData, description: e.target.value })}
							className='w-full mt-1 p-3 border rounded-md shadow-sm focus:ring focus:ring-indigo-300'
						/>
					</div>
					<Button type='submit' className='w-full bg-indigo-600 text-white py-2 rounded-lg'>Update Car</Button>
				</form>
			) : (
				<div>
					<h2 className='text-2xl font-bold'>{car.title}</h2>
					<p className='text-gray-600'>{car.description}</p>
					<div className='flex gap-4 mt-4'>
						<Button onClick={handleEdit} disabled={editting} className='bg-blue-500 text-white px-4 py-2 rounded-md'>
							{editting ? "Editing..." : "Edit"}
						</Button>
						<Button onClick={handleDelete} disabled={deleting} className='bg-red-500 text-white px-4 py-2 rounded-md'>
							{deleting ? "Deleting..." : "Delete"}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
