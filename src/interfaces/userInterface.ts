export interface IUser {
    telegram_id: number;
    seed: string;
    role: "admin" | "user" | "whitelist";
}