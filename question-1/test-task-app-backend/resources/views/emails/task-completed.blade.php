<!DOCTYPE html>
<html>
<head>
    <title>Task Completed</title>
</head>
<body>
    <h1>Your Task is Completed!</h1>
    <p>The task "{{ $task->name }}" has been marked as completed.</p>
    <p>Description: {{ $task->description }}</p>
</body>
</html>
