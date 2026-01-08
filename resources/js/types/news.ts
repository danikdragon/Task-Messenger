export interface User {
    id: number;
    name: string;
}

export interface Comment {
    id: number;
    user_id: number;
    user: User;
    text: string;
    likes_count: number;
    comments_count: number;
    is_liked: boolean;
    created_at: string;
    comments?: Comment[];
}

export interface NewsData {
    id: number;
    user_id: number;
    user: User;
    title: string;
    body: string | null;
    likes_count: number;
    comments_count: number;
    is_liked: boolean;
    comments: Comment[];
    created_at: string;
}