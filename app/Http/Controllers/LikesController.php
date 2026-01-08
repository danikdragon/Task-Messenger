<?php

namespace App\Http\Controllers;

use App\Models\Likes;
use App\Models\Comments;
use App\Models\News;
use App\Models\User;
use App\Http\Requests\ToggleLikesRequest;
use Illuminate\Support\Facades\Auth;

class LikesController extends Controller
{
    public function toggle(ToggleLikesRequest $request)
    {
        $data = $request->validated();

        /** @var User $user */
        $user_id = Auth::id();

        $model = match ($data['likeable_type']) {
            'news' => News::class,
            'comment' => Comments::class,
        };
        $target = $model::findOrFail($data['id']);
        $like = $target->likes()->where("user_id", $user_id)->first();
        if ($like) {
            $like->delete();
        } else {
            $target->likes()->create([
                'user_id' => $user_id,
            ]);
        }
        return back();
    }
}
