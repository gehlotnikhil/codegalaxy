import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function exportDatabase() {
  try {
    // Get all collections using raw queries
    const collections = [
      { name: 'users', collection: 'User' },
      { name: 'contests', collection: 'Contest' },
      { name: 'problemSets', collection: 'ProblemSet' },
      { name: 'practiceProblems', collection: 'PraticeProblem' },
      { name: 'dailyNewProblems', collection: 'DailyNewProblem' },
      { name: 'contestProblems', collection: 'ContestProblem' },
      { name: 'leaderboards', collection: 'LeaderBoard' },
      { name: 'oneToOneLeaderboards', collection: 'OneToOneCompeteLeaderboard' },
    ];

    const cleanData: any = {};

    for (const { name, collection } of collections) {
      const result = await prisma.$runCommandRaw({
        find: collection,
        filter: {}
      });
      
      const docs = (result as any).cursor.firstBatch;
      cleanData[name] = docs.map(({ _id, ...rest }: any) => rest);
    }

    const filePath = path.join(__dirname, "../seed-data.json");
    fs.writeFileSync(filePath, JSON.stringify(cleanData, null, 2));

    console.log("📦 Database exported to seed-data.json");
    console.log(`   users: ${cleanData.users.length}`);
    console.log(`   contests: ${cleanData.contests.length}`);
    console.log(`   problemSets: ${cleanData.problemSets.length}`);
    console.log(`   practiceProblems: ${cleanData.practiceProblems.length}`);
    console.log(`   dailyNewProblems: ${cleanData.dailyNewProblems.length}`);
    console.log(`   contestProblems: ${cleanData.contestProblems.length}`);
    console.log(`   leaderboards: ${cleanData.leaderboards.length}`);
    console.log(`   oneToOneLeaderboards: ${cleanData.oneToOneLeaderboards.length}`);
  } catch (err) {
    console.error("❌ Export failed", err);
  } finally {
    await prisma.$disconnect();
  }
}

exportDatabase();