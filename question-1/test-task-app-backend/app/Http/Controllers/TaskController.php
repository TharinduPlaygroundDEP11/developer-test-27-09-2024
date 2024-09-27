<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Mail\TaskCompleted;
use Illuminate\Support\Facades\Mail;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Auth::user()->tasks;
        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $task = Task::create([
            'name' => $request->name,
            'description' => $request->description,
            'user_id' => Auth::id(),
        ]);

        return response()->json($task, 201);
    }

    public function update(Request $request, Task $task)
    {
        if ($task->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $task->update($request->all());
        return response()->json($task);
    }

    public function destroy(Task $task)
    {
        if ($task->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->delete();
        return response()->json(null, 204);
    }

    public function markComplete(Task $task)
    {
        if ($task->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->update(['is_completed' => true]);

        Mail::to('admin@test.com')->send(new TaskCompleted($task));

        return response()->json($task);
    }
}
