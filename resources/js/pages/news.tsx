import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog'; // Используем твой Radix
import { dashboard } from '@/routes';
import { index as newsRoute } from '@/routes/dashboard/news';
// Интерфейсы
interface User {
    name: string;
}
interface News {
    id: number;
    user_id: number;
    user: User;
    title: string;
    body: string | null;
    created_at: string;
    updated_at: string;
}

interface NewsProps {
    user_id: number
    news: News[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.url(),
    },
    {
        title: 'News',
        href: newsRoute.url(),
    }
];

export default function News({ news, user_id }: NewsProps) {
    // Форма создания
    const createForm = useForm({ title: '', body: '' });

    // Состояние для редактируемой задачи
    const [editingNews, setEditingNews] = useState<News | null>(null);

    // Форма редактирования
    const editForm = useForm({
        title: '',
        body: '',
    });

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(newsRoute.url(), {
            onSuccess: () => createForm.reset(),
        });
    };

    // Открытие модалки и предзаполнение данных
    const openEditModal = (news: News) => {
        setEditingNews(news);
        editForm.setData({
            title: news.title,
            body: news.body || '',
        });
    };

    const submitUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingNews) return;

        // Отправляем PATCH/PUT запрос
        editForm.patch(`/dashboard/news/${editingNews.id}`, {
            onSuccess: () => {
                setEditingNews(null);
                editForm.reset();
            },
        });
    };

    const deleteNews = (id: number) => {
        if (confirm('Вы уверены?')) {
            router.delete(`/dashboard/news/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Новости" />

            <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto w-full">

                {/* --- СЕКЦИЯ СОЗДАНИЯ --- */}
                <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <h2 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">Новая новость</h2>
                    <form onSubmit={submitCreate} className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Что нужно сделать?"
                            value={createForm.data.title}
                            onChange={e => createForm.setData('title', e.target.value)}
                            className="w-full rounded-lg border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 focus:ring-black"
                        />
                        <textarea
                            placeholder="Описание"
                            value={createForm.data.body || ''}
                            onChange={e => createForm.setData('body', e.target.value)}
                            className="w-full rounded-lg border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 focus:ring-black"
                            rows={2}
                        />
                        <button type="submit" disabled={createForm.processing} className="rounded-lg bg-black px-4 py-2 text-white dark:bg-white dark:text-black">
                            Добавить новость
                        </button>
                    </form>
                </div>

                {/* --- СПИСОК ЗАДАЧ --- */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {news.map((post) => (
                        <div key={post.id} className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">

                            <div className="mb-4">
                                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-500 line-clamp-3">Автор: {post.user.name}</p>
                                <h3 className="font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-tight">{post.title}</h3>
                                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3">{post.body}</p>
                            </div>

                            <div className="flex items-center justify-between border-t border-neutral-50 pt-4 dark:border-neutral-800">
                                {user_id === post.user_id && (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => openEditModal(post)}
                                            className="text-xs font-bold text-blue-500 hover:text-blue-600 uppercase"
                                        >
                                            Изменить
                                        </button>
                                        <button
                                            onClick={() => deleteNews(post.id)}
                                            className="text-xs font-bold text-red-500 hover:text-red-600 uppercase"
                                        >
                                            Удалить
                                        </button>

                                    </div>
                                )}
                                <time className="text-[10px] text-neutral-400 font-medium">
                                    {new Date(post.created_at).toLocaleDateString()}
                                </time>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- МОДАЛКА РЕДАКТИРОВАНИЯ (Radix Dialog) --- */}
            <Dialog.Root open={!!editingNews} onOpenChange={() => setEditingNews(null)}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 p-4">
                        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 animate-in fade-in zoom-in duration-200">
                            <Dialog.Title className="text-lg font-bold mb-4 dark:text-white uppercase tracking-tight">
                                Редактировать новость
                            </Dialog.Title>

                            <form onSubmit={submitUpdate} className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    value={editForm.data.title}
                                    onChange={e => editForm.setData('title', e.target.value)}
                                    className="w-full rounded-lg border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 focus:ring-black dark:text-white"
                                />
                                {editForm.errors.title && <p className="text-red-500 text-xs">{editForm.errors.title}</p>}

                                <textarea
                                    value={editForm.data.body || ''}
                                    onChange={e => editForm.setData('body', e.target.value)}
                                    className="w-full rounded-lg border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 focus:ring-black dark:text-white"
                                    rows={4}
                                />

                                <div className="flex gap-3 mt-2">
                                    <button
                                        type="submit"
                                        disabled={editForm.processing}
                                        className="flex-1 rounded-lg bg-black py-2 text-sm font-bold text-white dark:bg-white dark:text-black"
                                    >
                                        {editForm.processing ? 'Сохранение...' : 'Обновить'}
                                    </button>
                                    <Dialog.Close asChild>
                                        <button type="button" className="flex-1 rounded-lg border border-neutral-200 py-2 text-sm font-bold dark:border-neutral-700 dark:text-white">
                                            Отмена
                                        </button>
                                    </Dialog.Close>
                                </div>
                            </form>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </AppLayout>
    );
}