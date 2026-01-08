import { useState, useMemo } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Heart, MessageCircle, Pencil, Send, Trash2, X } from 'lucide-react';
import { NewsData, Comment } from '@/types/news';
import CommentItem from '@/components/News/CommentItem';

interface Props {
    post: NewsData;
    userId: number;
    onEdit: (post: NewsData) => void;
    onDelete: (url: string) => void;
}
const calculateTotalComments = (comments: Comment[] | undefined): number => {
    if (!comments) return 0;
    return comments.reduce((acc, curr) => {
        return acc + 1 + calculateTotalComments(curr.comments);
    }, 0);
};

export default function NewsItem({ post, userId, onEdit, onDelete }: Props) {
    const [replyingTo, setReplyingTo] = useState<{ id: number, name: string } | null>(null);

    const totalCommentsCount = useMemo(() => calculateTotalComments(post.comments), [post.comments]);

    const commentForm = useForm({
        text: '',
        id: post.id,
        commentable_type: 'news' as 'news' | 'comment'
    });

    const handleLike = (id: number, type: 'news' | 'comment') => {
        router.post('/likes/toggle', { id, likeable_type: type }, { preserveScroll: true });
    };

    const submitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentForm.data.text.trim()) return;

        const targetId = replyingTo ? replyingTo.id : post.id;
        const type = replyingTo ? 'comment' : 'news';

        commentForm.transform((data) => ({
            ...data,
            id: targetId,
            commentable_type: type
        }));

        commentForm.post('/comments', {
            preserveScroll: true,
            onSuccess: () => {
                commentForm.reset('text');
                setReplyingTo(null);
            }
        });
    };

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden mb-4">
            {/* Шапка */}
            <div className="p-4 flex justify-between items-start">
                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800" />
                    <div>
                        <h4 className="font-bold text-sm dark:text-white">{post.user.name}</h4>
                        <p className="text-xs text-neutral-500">{new Date(post.created_at).toLocaleString()}</p>
                    </div>
                </div>
                {userId === post.user_id && (
                    <div className="flex gap-2">
                        <button onClick={() => onEdit(post)} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition text-neutral-400">
                            <Pencil size={16} />
                        </button>
                        <button onClick={() => onDelete(`/dashboard/news/${post.id}`)} className="p-2 hover:bg-red-50 text-red-400 rounded-full transition">
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* Контент */}
            <div className="px-4 pb-4">
                <h3 className="text-lg font-bold mb-1 dark:text-white">{post.title}</h3>
                <p className="text-sm leading-relaxed dark:text-neutral-300 whitespace-pre-wrap">{post.body}</p>
            </div>

            {/* Лайки и Счетчики */}
            <div className="px-2 py-1 flex gap-2 border-t border-neutral-50 dark:border-neutral-800">
                <button
                    onClick={() => handleLike(post.id, 'news')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${post.is_liked ? 'text-red-500 bg-red-50 dark:bg-red-900/10' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
                >
                    <Heart size={20} fill={post.is_liked ? "currentColor" : "none"} />
                    <span className="text-sm font-bold">{post.likes_count}</span>
                </button>

                {/* ИСПРАВЛЕНО: Теперь показываем totalCommentsCount, а не post.comments_count */}
                <div className="flex items-center gap-2 px-3 py-2 text-neutral-500">
                    <MessageCircle size={20} />
                    <span className="text-sm font-bold">{totalCommentsCount}</span>
                </div>
            </div>

            {/* Секция Комментариев */}
            <div className="bg-neutral-50/50 dark:bg-neutral-950/30 border-t border-neutral-50 dark:border-neutral-800">
                <div className="flex flex-col gap-4 p-4 pb-0">
                    {post.comments?.map(comment => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            userId={userId}
                            postAuthorId={post.user_id}
                            onReply={(id, name) => setReplyingTo({ id, name })}
                            onDelete={onDelete}
                            onLike={(id) => handleLike(id, 'comment')}
                        />
                    ))}
                </div>

                {/* Форма ввода */}
                <div className="p-3 border-t border-neutral-100 dark:border-neutral-800 mt-2">
                    {replyingTo && (
                        <div className="flex justify-between items-center mb-2 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded text-xs animate-in fade-in slide-in-from-top-1">
                            <span className="dark:text-blue-300">Ответ для <b>{replyingTo.name}</b></span>
                            <button onClick={() => setReplyingTo(null)} className="text-neutral-500 hover:text-black dark:hover:text-white"><X size={14} /></button>
                        </div>
                    )}
                    <div className="flex gap-3 items-center">
                        <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex-shrink-0" />
                        <form className="flex-1 relative" onSubmit={submitComment}>
                            <input
                                placeholder={replyingTo ? "Напишите ответ..." : "Написать комментарий..."}
                                className="w-full bg-neutral-100 dark:bg-neutral-800 border-none rounded-xl py-2 px-4 pr-10 text-sm focus:ring-1 focus:ring-neutral-300 dark:text-white"
                                value={commentForm.data.text}
                                onChange={e => commentForm.setData('text', e.target.value)}
                            />
                            <button type="submit" disabled={commentForm.processing || !commentForm.data.text} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black dark:hover:text-white transition">
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}