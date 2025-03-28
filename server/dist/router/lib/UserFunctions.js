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
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const isUserExist = (email) => __awaiter(void 0, void 0, void 0, function* () {
    let check1 = yield prisma.user.findFirst({ where: { email } });
    if (check1 === null) {
        return false;
    }
    return true;
});
const isUserNameExist = (userName) => __awaiter(void 0, void 0, void 0, function* () {
    let check1 = yield prisma.user.findFirst({ where: { userName } });
    if (check1 === null) {
        return false;
    }
    return true;
});
const UserFunctions = { isUserExist, isUserNameExist };
exports.default = UserFunctions;
