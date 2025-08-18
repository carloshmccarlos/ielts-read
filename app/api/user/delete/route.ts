import { auth } from "@/lib/auth/auth";
import { deleteUserByEmail } from "@/lib/actions/articles-with-user";
import { NextResponse } from "next/server";
 
export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await deleteUserByEmail(session.user.email);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user account:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

