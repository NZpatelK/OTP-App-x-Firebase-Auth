import { NextRequest, NextResponse} from "next/server";
import { User, userData} from "@/app/lib/userData";;

export async function GET() {
    return NextResponse.json(userData);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    userData.push(body);
    return NextResponse.json(userData);
}

export async function PUT(request: NextRequest) {
    const body = await request.json();
    const index = userData.findIndex((user: User ) => user.id === body.id);

    if (index === -1) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    userData[index] = body;
    return NextResponse.json(userData);
}

export async function DELETE(request: NextRequest) {
    const body = await request.json();
    const index = userData.findIndex((user: User ) => user.id === body.id);

    if (index === -1) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    userData.splice(index, 1);
    return NextResponse.json(userData);
}