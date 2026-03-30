import { NextResponse } from "next/server";

export async function GET() {
  const mockEvents = [
    { id: "1", name: "Cesar Chavez Senior Walk", date: "April 3", location: "Phoenix, AZ", category: "Fitness" },
    { id: "2", name: "Tempe Senior Expo", date: "April 14", location: "Tempe, AZ", category: "Social" },
    { id: "3", name: "Silver Linings Senior Expo", date: "April 18", location: "Sun Lakes, AZ", category: "Social" },
    { id: "4", name: "Uptown Farmers Market Meetup", date: "April 22", location: "Phoenix, AZ", category: "Social" },
  ];

  return NextResponse.json({ events: mockEvents });
}
