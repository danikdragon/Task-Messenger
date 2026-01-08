import { Heart, Trash2 } from 'lucide-react';
import { Comment } from '@/types/news';

interface Props {
    comment: Comment;
    userId: number;
    postAuthorId: number;
    onReply: (id: number, name: string) => void;
    onDelete: (url: string) => void;
    onLike: (id: number) => void;
    depth?: number;
}

export default function CommentItem({
    comment,
    userId,
    postAuthorId,
    onReply,
    onDelete,
    onLike,
    depth = 0
}: Props) {

    const nestedPadding = depth === 0 ? "pl-8 md:pl-12 border-l-2 border-transparent" : "";

    return (
        <div className="flex flex-col mt-3 first:mt-0">
            <div className="flex gap-3 group relative">
                {/* Аватар */}
                <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex-shrink-0 z-10" />

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                            {comment.user.name}
                        </span>

                        {(userId === comment.user_id || userId === postAuthorId) && (
                            <button
                                onClick={() => onDelete(`/comments/${comment.id}`)}
                                className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                            >
                                <Trash2 size={12} />
                            </button>
                        )}
                    </div>

                    {/* Текст комментария */}
                    <p className="text-sm dark:text-neutral-300 mt-0.5 leading-snug break-words">
                        {comment.text}
                    </p>

                    {/* Кнопки действий */}
                    <div className="flex items-center gap-4 mt-1.5">
                        <button
                            onClick={() => onReply(comment.id, comment.user.name)}
                            className="text-xs font-bold text-neutral-500 hover:underline"
                        >
                            Ответить
                        </button>

                        <button
                            onClick={() => onLike(comment.id)}
                            className={`flex items-center gap-1 text-xs font-bold ${comment.is_liked ? 'text-red-500' : 'text-neutral-400 hover:text-neutral-600'}`}
                        >
                            <Heart size={12} fill={comment.is_liked ? "currentColor" : "none"} />
                            {comment.likes_count}
                        </button>
                    </div>
                </div>
            </div>

            {comment.comments && comment.comments.length > 0 && (
                <div className={`flex flex-col ${nestedPadding} mt-2`}>
                    {comment.comments.map(reply => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            userId={userId}
                            postAuthorId={postAuthorId}
                            onReply={onReply}
                            onDelete={onDelete}
                            onLike={onLike}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}