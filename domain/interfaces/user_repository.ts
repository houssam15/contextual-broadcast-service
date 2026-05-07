export abstract class  UserRepository {
     abstract findById(id: string): Promise<any>;
     abstract getRelatedUserIds(userId: string): Promise<string[]>;
}