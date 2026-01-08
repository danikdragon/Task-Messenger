<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comments extends Model
{
    /** @use HasFactory<\Database\Factories\CommentsFactory> */
    use HasFactory;
    protected $fillable = [
        "user_id",
        "text",
    ];
    public function commentable()
    {
        return $this->morphTo();
    }

    public function likes()
    {
        return $this->morphMany(Likes::class, 'likeable');
    }
    public function comments()
    {
        return $this->morphMany(Comments::class, 'commentable');
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
