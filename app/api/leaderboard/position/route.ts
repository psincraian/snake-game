import { docClient } from "@/app/lib/dynamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username")!;
    const score = parseInt(searchParams.get("score")!);
    const datetime = searchParams.get("datetime")!;

    const date = new Date(datetime);

    const positions = {
      daily: await getTimeFramePosition("daily", date, score),
      monthly: await getTimeFramePosition("monthly", date, score),
      yearly: await getTimeFramePosition("yearly", date, score),
    };

    return NextResponse.json({ success: true, data: positions });
  } catch (error) {
    console.error("Error fetching score position:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch score position" }, { status: 500 });
  }
}

async function getTimeFramePosition(timeFrame: "daily" | "monthly" | "yearly", date: Date, score: number): Promise<number> {
  const indexName = `${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)}LeaderboardIndex`;
  const partitionValue = formatPartitionValue(timeFrame, date);

  let count = 0;
  let lastEvaluatedKey: any = undefined;

  do {
    const { Count, LastEvaluatedKey } = await docClient.send(new QueryCommand({
      TableName: "Leaderboard",
      IndexName: indexName,
      KeyConditionExpression: `${timeFrame}_partition = :partition AND score > :score`,
      ExpressionAttributeValues: {
        ":partition": partitionValue,
        ":score": score,
      },
      Select: "COUNT",
      ExclusiveStartKey: lastEvaluatedKey,
    }));

    count += Count || 0;
    lastEvaluatedKey = LastEvaluatedKey;
  } while (lastEvaluatedKey);

  return count + 1; // Position is count + 1
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