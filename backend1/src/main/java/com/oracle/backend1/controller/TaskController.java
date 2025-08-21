package com.oracle.backend1.controller;


import com.oracle.backend1.entity.Task;
import com.oracle.backend1.Repository.TaskRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskRepository taskRepository;

    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // GET /api/tasks → return all tasks
    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }
}
