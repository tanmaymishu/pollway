<?php

namespace App\Http\Controllers;

use App\Models\Poll;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminPollController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/polls/index');
    }

    public function create()
    {
        return Inertia::render('admin/polls/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => ['required'],
            'description' => ['sometimes', 'nullable'],
            'options' => ['required', 'array'],
            'options.*' => ['required', 'string'],
        ]);

        $originalSlug = Str::slug($request->title);
        $slug = Str::slug($request->title);

        while (Poll::query()->where('slug', $slug)->exists()) {
            $slug = $originalSlug . Str::random(4);
        }

        $poll = auth()->user()->polls()->create([
            'title' => $request->title,
            'description' => $request->description,
            'slug' => $slug,
        ]);

        $poll->options()->createMany(collect($request->options)->map(fn($option) => ['label' => $option]));

        return back();
    }
}
