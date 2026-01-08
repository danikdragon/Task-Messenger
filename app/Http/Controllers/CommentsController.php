<?php

namespace App\Http\Controllers;

use App\Models\Comments;
use App\Http\Requests\StoreCommentsRequest;
use App\Http\Requests\UpdateCommentsRequest;
use App\Models\News;
use Illuminate\Support\Facades\Auth;

class CommentsController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCommentsRequest $request)
    {
        $data = $request->validated();

        $modelClass = match ($data['commentable_type']) {
            'news' => News::class,
            'comment' => Comments::class,
        };

        $target = $modelClass::findOrFail($data['id']);

        $target->comments()->create([
            'user_id' => Auth::id(),
            'text' => $data['text'],
        ]);

        return back()->with('message', 'Комментарий добавлен!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCommentsRequest $request, Comments $comments)
    {
        abort_if($comments->user_id !== Auth::id(), 403);

        $comments->update($request->validate());

        return back()->with('message', 'Новость удалена');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comments $comments)
    {
        abort_if($comments->user_id !== Auth::id(), 403);

        $comments->delete();

        return back()->with('message', 'Новость удалена');
    }
}
