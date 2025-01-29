import { docClient } from "@/app/lib/dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, score } = await request.json();

    const datetime = new Date();
    const item = {
      username,
      datetime: datetime.toISOString(),
      score,
      daily_partition: datetime.toISOString().split('T')[0], // YYYY-MM-DD
      monthly_partition: datetime.toISOString().slice(0, 7), // YYYY-MM
      yearly_partition: datetime.toISOString().slice(0, 4),  // YYYY
    };

    await docClient.send(new PutCommand({
      TableName: "Leaderboard",
      Item: item,
    }));

    return NextResponse.json({ success: true, message: "Result saved" });
  } catch (error) {
    console.error("Error saving result:", error);
    return NextResponse.json({ success: false, message: "Failed to save result" }, { status: 500 });
  }
}