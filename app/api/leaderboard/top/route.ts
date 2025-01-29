import { docClient } from "@/app/lib/dynamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

export interface LeaderboardItem {
  username: string;
  score: number;
  datetime: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeFrame = searchParams.get("timeFrame") as "daily" | "monthly" | "yearly";
    const date = new Date(searchParams.get("date") ?? Date.now());
    const limit = parseInt(searchParams.get("limit") || "10");

    const indexName = `${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)}LeaderboardIndex`;
    const partitionValue = formatPartitionValue(timeFrame, date);

    const { Items } = await docClient.send(new QueryCommand({
      TableName: "Leaderboard",
      IndexName: indexName,
      KeyConditionExpression: `${timeFrame}_partition = :partition`,
      ExpressionAttributeValues: {
        ":partition": partitionValue,
      },
      ScanIndexForward: false, // Descending order (highest scores first)
      Limit: limit,
    }));

    const formattedItems = (Items || []).map((item: any) => ({
      username: item.username,
      score: item.score,
      datetime: item.datetime,
    } as LeaderboardItem));

    return NextResponse.json({ success: true, data: formattedItems });
  } catch (error) {
    console.error("Error fetching top results:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch top results" }, { status: 500 });
  }
}

function formatPartitionValue(timeFrame: string, date: Date): string {
  const iso = date.toISOString();
  switch (timeFrame) {
    case "daily": return iso.split('T')[0];
    case "monthly": return iso.slice(0, 7);
    case "yearly": return iso.slice(0, 4);
    default: throw new Error("Invalid time frame");
  }
}