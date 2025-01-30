import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET as string;

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const authHeader = req.headers.get("authorization");
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}

		const token = authHeader.split(" ")[1];
		let decoded;
		try {
			decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
		} catch {
			return Response.json({ error: "Invalid token" }, { status: 401 });
		}

		const { id } = await params;

		const car = await db.car.findUnique({
			where: { id },
		});

		if (!car) {
			return Response.json({ error: "Car not found" }, { status: 404 });
		}

		// Ensure the user is authorized to access this car
		if (car.userId !== decoded.userId) {
			return Response.json({ error: "Forbidden" }, { status: 403 });
		}

		return Response.json(car, { status: 200 });
	} catch {
		return Response.json({ error: "Something went wrong" }, { status: 500 });
	}
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const authHeader = req.headers.get("authorization");
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}

		const token = authHeader.split(" ")[1];
		let decoded;
		try {
			decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
		} catch {
			return Response.json({ error: "Invalid token" }, { status: 401 });
		}

		const { title, description, images, tags } = await req.json();

		if (!title || !description || !images || !Array.isArray(images) || images.length > 10) {
			return Response.json(
				{ error: "Invalid input: Title, description, and up to 10 images are required." },
				{ status: 400 }
			);
		}

		const { id } = await params;

		const car = await db.car.findUnique({ where: { id } });

		if (!car) {
			return Response.json({ error: "Car not found" }, { status: 404 });
		}

		// Ensure the user is authorized to edit this car
		if (car.userId !== decoded.userId) {
			return Response.json({ error: "Forbidden" }, { status: 403 });
		}

		const updatedCar = await db.car.update({
			where: { id },
			data: {
				title,
				description,
				images,
				tags,
			},
		});

		return Response.json(updatedCar, { status: 200 });
	} catch {
		return Response.json({ error: "Something went wrong" }, { status: 500 });
	}
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const authHeader = req.headers.get("authorization");
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}

		const token = authHeader.split(" ")[1];
		let decoded;
		try {
			decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
		} catch {
			return Response.json({ error: "Invalid token" }, { status: 401 });
		}

		const { id } = await params;

		const car = await db.car.findUnique({ where: { id } });

		if (!car) {
			return Response.json({ error: "Car not found" }, { status: 404 });
		}

		// Ensure the user is authorized to delete this car
		if (car.userId !== decoded.userId) {
			return Response.json({ error: "Forbidden" }, { status: 403 });
		}

		await db.car.delete({ where: { id } });

		return Response.json({ message: "Car deleted successfully" }, { status: 200 });
	} catch {
		return Response.json({ error: "Something went wrong" }, { status: 500 });
	}
}
