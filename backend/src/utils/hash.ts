
import bcrypt from "bcryptjs"


export const hashPassword = async( plainPassword : string) : Promise<string>=>{
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(plainPassword, salt);
}

export const comparedPassword = async(plain: string , hash : string): Promise<boolean> =>{
    return bcrypt.compare(plain, hash )
}