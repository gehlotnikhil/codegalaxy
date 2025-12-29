import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface SeedData {
  users: any[];
  contests: any[];
  problemSets: any[];
  practiceProblems: any[];
  dailyNewProblems: any[];
  contestProblems: any[];
  leaderboards: any[];
  oneToOneLeaderboards: any[];
}

async function seed() {
  try {
    console.log("🌱 Starting database seeding...");

    // Read the seed data file
    const filePath = path.join(__dirname, "../seed-data.json");
    
    if (!fs.existsSync(filePath)) {
      throw new Error("seed-data.json not found! Please run export-db.js first.");
    }

    const seedData: SeedData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      console.log(`📝 Seeding ${seedData.users.length} users...`);
    await prisma.$runCommandRaw({
      insert: 'User',
      documents: seedData.users
    });

    console.log(`🏆 Seeding ${seedData.contests.length} contests...`);
    if (seedData.contests.length > 0) {
      await prisma.$runCommandRaw({
        insert: 'Contest',
        documents: seedData.contests
      });
    }

    console.log(`📚 Seeding ${seedData.problemSets.length} problem sets...`);
    if (seedData.problemSets.length > 0) {
      await prisma.$runCommandRaw({
        insert: 'ProblemSet',
        documents: seedData.problemSets
      });
    }

    console.log(`💪 Seeding ${seedData.practiceProblems.length} practice problems...`);
    if (seedData.practiceProblems.length > 0) {
      await prisma.$runCommandRaw({
        insert: 'PraticeProblem',
        documents: seedData.practiceProblems
      });
    }

    console.log(`📅 Seeding ${seedData.dailyNewProblems.length} daily problems...`);
    if (seedData.dailyNewProblems.length > 0) {
      await prisma.$runCommandRaw({
        insert: 'DailyNewProblem',
        documents: seedData.dailyNewProblems
      });
    }

    console.log(`🎯 Seeding ${seedData.contestProblems.length} contest problems...`);
    if (seedData.contestProblems.length > 0) {
      await prisma.$runCommandRaw({
        insert: 'ContestProblem',
        documents: seedData.contestProblems
      });
    }

    console.log(`🥇 Seeding ${seedData.leaderboards.length} leaderboards...`);
    if (seedData.leaderboards.length > 0) {
      await prisma.$runCommandRaw({
        insert: 'LeaderBoard',
        documents: seedData.leaderboards
      });
    }

    console.log(`⚔️  Seeding ${seedData.oneToOneLeaderboards.length} 1v1 leaderboards...`);
    if (seedData.oneToOneLeaderboards.length > 0) {
      await prisma.$runCommandRaw({
        insert: 'OneToOneCompeteLeaderboard',
        documents: seedData.oneToOneLeaderboards
      });
    }
    

    console.log(" Database seeding completed successfully!");
    console.log("\n Summary:");
    console.log(`   Users: ${seedData.users.length}`);
    console.log(`   Contests: ${seedData.contests.length}`);
    console.log(`   Problem Sets: ${seedData.problemSets.length}`);
    console.log(`   Practice Problems: ${seedData.practiceProblems.length}`);
    console.log(`   Daily Problems: ${seedData.dailyNewProblems.length}`);
    console.log(`   Contest Problems: ${seedData.contestProblems.length}`);
    console.log(`   Leaderboards: ${seedData.leaderboards.length}`);
    console.log(`   1v1 Leaderboards: ${seedData.oneToOneLeaderboards.length}`);

  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();