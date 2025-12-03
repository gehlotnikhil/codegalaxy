// import {getPrisma} from "./lib/prisma.js"
// const prisma =  getPrisma();

// export async  function prismaMain() {
//   // Create a new test
//   const test1 = await prisma.testing.create({
//     data: {
//         email: "john.doe@example.com",
//         title: "Hello World",
//     },
//   },{unique:true});

//   console.log("Test created:", test1);
//   await prisma.$disconnect()
  // Retrieve all tests
//   const getTest1 = await prisma.testing.findMany();
//   console.log("All tests:", getTest1);

  // Update a test
//   const updatedTest = await prisma.testing.update({
//     where: { email: "john.doe@example.com" },
//     data: { title: "John Updated" },
//   });
//   console.log("Updated test:", updatedTest);

  // Delete a test
//   const deletedtest = await prisma.testing.delete({
//     where: { email: "john.doe@example.com" },
//   });
//   console.log("Deleted test:", deletedtest);
// }

