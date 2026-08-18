import { NextResponse } from "next/server";
import courses from "@/data/courses.json";

export async function GET() {
  return NextResponse.json(courses);
}
