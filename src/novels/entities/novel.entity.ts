import { UUID } from "crypto";
import { Entity } from "src/core/entities/entity";

export interface Novel extends Entity {
    author_id: UUID;
    title: string;
    description: string;
    cover: string;

    is_published: boolean | false;
    is_featured: boolean;
    is_free: boolean;
    is_completed: boolean;

    published_at: Date | null;
    completed_at: Date | null;
}

