import { UserRepository } from "./user_repository"

export interface TestableUserRepository extends UserRepository{
    findTestPair() : Promise<{subjectId: string, observerId: string}>;
}