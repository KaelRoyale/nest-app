import { User } from "../../user.schema"

export const userStub = (): User => {
  return {
    username: "testUser",
    password: "testPassword",
    createdAt: new Date(),
    failedAttemps: 0,
    isLocked: false,
    lastLoginAt: undefined,
    lastFailedAttempts: undefined
  }
}