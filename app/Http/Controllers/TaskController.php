<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $tasks = $user->tasks()->latest()->get();

        return Inertia::render('tasks', [
            "tasks" => $tasks
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $user->tasks()->create($request->validated());

        return back()
            ->with('message', 'Задача успешно создана!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        abort_if($task->user_id !== Auth::id(), 403);

        return Inertia::render('dashboard/tasks/show', [
            'task' => $task
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        abort_if($task->user_id !== Auth::id(), 403);

        $task->update($request->validated());

        return back()->with('message', 'Задача обновлена');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        abort_if($task->user_id !== Auth::id(), 403);

        $task->delete();

        return back()->with('message', 'Задача удалена');
    }
}
