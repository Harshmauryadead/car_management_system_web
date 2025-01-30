import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
	try {
		const { email, password } = await req.json();

		if (!email || !password) {
			return Response.json({ error: "Email and password are required" }, { status: 400 });
		}

		// Find user
		const user = await db.user.findUnique({ where: { email } });
		if (!user) {
			return Response.json({ error: "Invalid credentials" }, { status: 401 });
		}

		// Verify password
		const isValid = await bcrypt.compare(password, user.password);
		if (!isValid) {
			return Response.json({ error: "Invalid credentials" }, { status: 401 });
		}

		// Generate JWT token
		const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, {
			expiresIn: "7d",
		});

		return Response.json({ message: "Login successful", token }, { status: 200 });
	} catch {
		return Response.json({ error: "Something went wrong" }, { status: 500 });
	}
}
