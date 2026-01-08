<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use Illuminate\Auth\Events\Validated;
use Illuminate\Foundation\Auth\User as AuthUser;
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
        // Данные уже проверены внутри StoreTaskRequest
        /** @var User $user */
        $user = Auth::user();

        // Создаем через связь (user_id подставится сам)
        $user->tasks()->create($request->validated());

        // Перенаправляем обратно на список (Inertia обновит данные)
        return redirect()->route('dashboard.tasks.index')
            ->with('message', 'Задача успешно создана!');;
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
        // Защита: проверяем, что задача принадлежит юзеру
        // В идеале это делается через Policy, но можно и так:
        abort_if($task->user_id !== Auth::id(), 403);

        $task->update($request->validated());

        return back()->with('message', 'Задача обновлена');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        // Защита от удаления чужой задачи
        abort_if($task->user_id !== Auth::id(), 403);

        $task->delete();

        // back() просто вернет на ту же страницу
        return back()->with('message', 'Задача удалена');
    }
}
