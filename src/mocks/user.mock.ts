import { User } from "../users/user.schema"

const mockedUser: User = {

    username: 'mockTestUser',
    password: 'mockTestPass',
    lastFailedAttempts: null,
    failedAttemps: 0,
    lastLoginAt: null,
    createdAt: null,
    isLocked: false

}

export default mockedUser;