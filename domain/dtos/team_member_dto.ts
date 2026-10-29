export class TeamMemberDto{
    private id:string;
    private name:string;
    private role?: string | null;
    private isOnline?: boolean;
    private avatarUrl?: string | null;
    private status?: string | null;
    constructor({
        id,
        name,
        role,
        isOnline,
        avatarUrl,
        status
    }: {
        id: string;
        name: string;
        role?: string | null;
        isOnline?: boolean;
        avatarUrl?: string | null;
        status?: string | null;
    }) {
        this.id = id;
        this.name = name;
        this.role = role ?? null;
        this.isOnline = isOnline ?? false;
        this.avatarUrl = avatarUrl ?? null;
        this.status = status ?? null;
    }

    toJson(): Record<string, any> {
        return {
            id: this.id,
            name: this.name,
            role: this.role,
            isOnline: this.isOnline,
            avatarUrl: this.avatarUrl,
            status: this.status
        };
    }

    public getId(): string {
        return this.id;
    }

    public getOnline(): boolean{
        return this.isOnline == true;
    }

    public getAvatarUrl(): string | null | undefined {
        return this.avatarUrl;
    }
    public setOnline(isOnline: boolean): void {
        this.isOnline = isOnline;
    }

    public setRole(role: string): void {
        this.role = role;
    }

    public setStatus(status: string): void {
        this.status = status;
    }

    public setAvatarUrl(avatarUrl: string): void {
        this.avatarUrl = avatarUrl;
    }
}