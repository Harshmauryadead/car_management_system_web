import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
	try {
		const { email, password } = await req.json();

		if (!email || !password) {
			return Response.json({ error: "Email and password are required" }, { status: 400 });
		}

		// Check if user already exists
		const existingUser = await db.user.findUnique({ where: { email } });
		if (existingUser) {
			return Response.json({ error: "User already exists" }, { status: 400 });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create user
		const user = await db.user.create({
			data: {
				email,
				password: hashedPassword,
			},
		});

		return Response.json(
			{ message: "User created successfully", userId: user.id },
			{ status: 201 }
		);
	} catch {
		return Response.json({ error: "Something went wrong" }, { status: 500 });
	}
}
