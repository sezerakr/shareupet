import { PrimaryGeneratedColumn } from "typeorm";

export class CoreEntity<T> {
    @PrimaryGeneratedColumn()
    id: T;

    is_deleted: boolean;

    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;

    created_by: T;
    updated_by: T;
    deleted_by: T | null;
}

