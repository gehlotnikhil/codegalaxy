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
// const {prismaMain} = require("./test")
// import { PrismaClient } from "@prisma/client";
dotenv.config();
const PORT = process.env.PORT;
// const prisma = new PrismaClient();
console.log(PORT);
app.use(express.json());
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // prismaMain()
    // .catch((e:any) => {
    // console.error(e)
    // })
    // .finally(async () => await prisma.$disconnect());
    res.send({ success: true });
}));
app.listen(PORT, () => {
    console.log(`-Server running at port ${PORT}`);
});
