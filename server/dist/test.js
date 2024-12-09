"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaMain = prismaMain;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
function prismaMain() {
    return __awaiter(this, void 0, void 0, function* () {
        // Create a new test
        const test1 = yield prisma.testing.create({
            data: {
                email: "john.doe@example.com",
                title: "Hello World",
            },
        }, { unique: true });
        console.log("Test created:", test1);
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
    });
}
