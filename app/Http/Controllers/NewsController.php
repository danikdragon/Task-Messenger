<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Http\Requests\StoreNewsRequest;
use App\Http\Requests\UpdateNewsRequest;
use Inertia\Inertia;

class NewsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $news = News::latest()->get();

        return Inertia::render('news', [
            "news" => $news
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNewsRequest $request)
    {
        // Данные уже проверены внутри StoreNewsRequest
        /** @var User $user */
        $user = Auth::user();

        // Создаем через связь (user_id подставится сам)
        $user->news()->create($request->validated());

        // Перенаправляем обратно на список (Inertia обновит данные)
        return redirect()->route('dashboard.news.index')
            ->with('message', 'Новость успешно создана!');;
    }

    /**
     * Display the specified resource.
     */
    public function show(News $news)
    {
        return Inertia::render('dashboard/news/show', [
            'news' => $news
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNewsRequest $request, News $news)
    {
        // Защита: проверяем, что задача принадлежит юзеру
        // В идеале это делается через Policy, но можно и так:
        abort_if($news->user_id !== Auth::id(), 403);

        $news->update($request->validated());

        return back()->with('message', 'Новость обновлена');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(News $news)
    {
        // Защита от удаления чужой задачи
        abort_if($news->user_id !== Auth::id(), 403);

        $news->delete();

        // back() просто вернет на ту же страницу
        return back()->with('message', 'Новость удалена');
    }
}
