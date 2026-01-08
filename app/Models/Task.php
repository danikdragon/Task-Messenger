<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Task extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'body',
        'user_id',
    ];

    /** @use HasFactory<\Database\Factories\TaskFactory> */
    use HasFactory;
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
