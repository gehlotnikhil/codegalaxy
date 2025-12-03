import { Request, Response } from "express"
import { getPrisma } from "../../lib/prisma.js"
const isUserExist = async (email: string) => {
    const prisma = getPrisma();
    try {
        let check1 = await prisma.user.findFirst({ where: { email } })
        if (check1 === null) {
            return false
        }
    } catch (error) {
    } finally {
        await prisma.$disconnect()
    }

    return true
}
const isUserNameExist = async (userName: string) => {
    const prisma = getPrisma();
    try {
        let check1 = await prisma.user.findFirst({ where: { userName } })
        if (check1 === null) {
            return false
        }
    } catch (error) {
    } finally {
        await prisma.$disconnect()
    }
    return true
}



const UserFunctions = { isUserExist, isUserNameExist }
export default UserFunctions