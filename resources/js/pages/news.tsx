import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import * as Dialog from '@radix-ui/react-dialog';
import AppLayout from '@/layouts/app-layout';
import { NewsData } from '@/types/news';
import NewsItem from '@/components/News/NewsItem';
import { index as newsRoute } from '@/routes/dashboard/news';

interface NewsProps {
    user_id: number;
    news: NewsData[];
}

export default function NewsPage({ news, user_id }: NewsProps) {
    const [editingNews, setEditingNews] = useState<NewsData | null>(null);

    const createForm = useForm({ title: '', body: '' });
    const editForm = useForm({ title: '', body: '' });

    const deleteItem = (url: string) => {
        if (confirm('Вы уверены?')) router.delete(url, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Лента', href: '#' }]}>
            <Head title="Новости" />

            <div className="min-h-screen py-6 dark:bg-black">
                <div className="max-w-[600px] mx-auto w-full flex flex-col gap-4">

                    {/* --- ФОРМА СОЗДАНИЯ --- */}
                    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-sm">
                        <form onSubmit={(e) => { e.preventDefault(); createForm.post(newsRoute.url(), { onSuccess: () => createForm.reset() }); }}>
                            <input
                                placeholder="Заголовок новости"
                                className="w-full mb-2 bg-transparent border-none font-bold focus:ring-0 dark:text-white"
                                value={createForm.data.title}
                                onChange={e => createForm.setData('title', e.target.value)}
                            />
                            <textarea
                                placeholder="Что нового?"
                                className="w-full bg-transparent border-none resize-none focus:ring-0 dark:text-neutral-300"
                                value={createForm.data.body || ''}
                                onChange={e => createForm.setData('body', e.target.value)}
                                rows={2}
                            />
                            <div className="flex justify-end pt-2 border-t border-neutral-100 dark:border-neutral-800">
                                <button type="submit" disabled={createForm.processing} className="bg-black dark:bg-white dark:text-black text-white px-4 py-1.5 rounded-lg text-sm font-medium">Опубликовать</button>
                            </div>
                        </form>
                    </div>

                    {/* --- СПИСОК НОВОСТЕЙ --- */}
                    {news.map((post) => (
                        <NewsItem
                            key={post.id}
                            post={post}
                            userId={user_id}
                            onEdit={setEditingNews}
                            onDelete={deleteItem}
                        />
                    ))}

                </div>
            </div>

            {/* --- МОДАЛКА РЕДАКТИРОВАНИЯ --- */}
            <Dialog.Root open={!!editingNews} onOpenChange={() => setEditingNews(null)}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 p-4">
                        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-2xl border dark:border-neutral-800">
                            <Dialog.Title className="text-lg font-bold mb-4 dark:text-white">Редактировать запись</Dialog.Title>
                            <form onSubmit={(e) => { e.preventDefault(); editForm.patch(`/dashboard/news/${editingNews?.id}`, { onSuccess: () => setEditingNews(null) }); }} className="flex flex-col gap-4">
                                <input
                                    className="w-full rounded-xl border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                                    defaultValue={editingNews?.title}
                                    onChange={e => editForm.setData('title', e.target.value)}
                                    onFocus={() => { if (editingNews && !editForm.data.title) editForm.setData({ title: editingNews.title, body: editingNews.body || '' }) }}
                                    placeholder="Нажмите для загрузки данных..."
                                />
                                <textarea
                                    className="w-full rounded-xl border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                                    rows={4}
                                    defaultValue={editingNews?.body || ''}
                                    onChange={e => editForm.setData('body', e.target.value)}
                                />
                                <div className="flex gap-2">
                                    <button type="submit" className="flex-1 bg-black text-white dark:bg-white dark:text-black py-2 rounded-xl font-bold">Сохранить</button>
                                    <button type="button" onClick={() => setEditingNews(null)} className="flex-1 border border-neutral-200 dark:border-neutral-700 dark:text-white py-2 rounded-xl font-bold">Отмена</button>
                                </div>
                            </form>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </AppLayout>
    );
}