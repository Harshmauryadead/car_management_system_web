import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

const SECRET_KEY = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
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

		const car = await db.car.create({
			data: {
				title,
				description,
				images,
				tags,
				userId: decoded.userId,
			},
		});

		return Response.json({ message: "Car created successfully", car }, { status: 201 });
	} catch {
		return Response.json({ error: "Something went wrong" }, { status: 500 });
	}
}

export async function GET(req: Request) {
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

		const cars = await db.car.findMany({
			where: { userId: decoded.userId },
			orderBy: { createdAt: "desc" },
		});

		return Response.json({ cars }, { status: 200 });
	} catch {
		return Response.json({ error: "Something went wrong" }, { status: 500 });
	}
}
