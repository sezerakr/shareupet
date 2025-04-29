import { UUID } from "crypto";

export interface Entity {
    id: UUID;

    is_deleted: boolean;

    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;

    created_by: UUID;
    updated_by: UUID;
    deleted_by: UUID | null;
}

