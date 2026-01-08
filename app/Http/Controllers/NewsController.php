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
        $news = News::with([
            'user:id,name',
            'comments' => function ($query) {
                $query->with([
                    'user:id,name',
                    'comments.user:id,name'
                ])
                    ->withCount('likes', 'comments')
                    ->withExists(['likes as is_liked' => function ($q) {
                        $q->where('user_id', Auth::id());
                    }]);
            }
        ])
            ->withCount('likes', 'comments')
            ->withExists(['likes as is_liked' => function ($query) {
                $query->where('user_id', Auth::id());
            }])
            ->latest()
            ->get();


        return Inertia::render('news', [
            "news" => $news,
            "user_id" => Auth::id()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNewsRequest $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $user->news()->create($request->validated());

        return back()
            ->with('message', 'Новость успешно создана!');
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
        abort_if($news->user_id !== Auth::id(), 403);

        $news->update($request->validated());

        return back()->with('message', 'Новость обновлена');
    }

    public function destroy(News $news)
    {
        abort_if($news->user_id !== Auth::id(), 403);

        $news->delete();

        return back()->with('message', 'Новость удалена');
    }
}
