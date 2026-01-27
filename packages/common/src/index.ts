import { z } from "zod"

export const signupSchema = z.object({
    email: z.email(),
    password: z.string().min(4),
    name: z.string().max(30)
})

export const signinSchema = z.object({
    email: z.email(),
    password: z.string().min(4)
})