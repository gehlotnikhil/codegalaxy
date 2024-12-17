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
const express = require("express");
const dotenv = require("dotenv");
const app = express();
const { prismaMain } = require("./test");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
dotenv.config();
const PORT = process.env.PORT;
// const prisma = new PrismaClient();
console.log(PORT);
app.use(express.json());
app.get("/", (req, res) => {
    res.send({ success: true });
});
app.get("/test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const test1 = yield prisma.testing.create({
        data: {
            email: "nikhil.doe@example.com",
            title: "Hello World",
        },
    }, { unique: true });
    console.log("Test created:", test1);
    res.send({ success: true });
}));
app.listen(PORT, () => {
    console.log(`--> Server running at port ${PORT}`);
});
