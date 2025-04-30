interface ApiResponseBase {
    success: boolean;
    // You can add common metadata here if needed
    // e.g., requestId: string;
}

export interface ApiSuccessResponse<T> extends ApiResponseBase {
    success: true;
    data: T;
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ApiErrorDetails {
    message: string;
    code?: string | number;
    details?: any;
}

export interface ApiErrorResponse extends ApiResponseBase {
    success: false;
    error: ApiErrorDetails;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;