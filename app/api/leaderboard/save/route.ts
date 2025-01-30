import { docClient } from "@/app/lib/dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, score } = await request.json();

    // Validate username
    const usernameRegex = /^[\w\s\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+$/u;
    if (!usernameRegex.test(username)) {
      return NextResponse.json({ success: false, message: "Invalid username. Only alphanumeric characters and emojis are allowed." }, { status: 400 });
    }

    if (score < 1) {
      return NextResponse.json({ success: false, message: "Invalid score. Score must be a positive integer." }, { status: 400 });
    }

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