export interface NASAApodRequest {
    date?: string; // YYYY-MM-DD, якщо не вказано - сьогоднішня дата
}

export interface NASAApodResponse {
    copyright?: string;
    date: string;
    explanation: string;
    hdurl?: string;
    media_type: string;
    service_version: string;
    title: string;
    url: string;
    thumbnail_url?: string;
}

export interface NASAErrorResponse {
    error: {
        code: string;
        message: string;
    };
}
