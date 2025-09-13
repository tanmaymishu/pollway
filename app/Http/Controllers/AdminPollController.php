<?php

namespace App\Http\Controllers;

use App\Models\Poll;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminPollController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/polls/index', ['polls' => Poll::with(['votes', 'options'])->latest()->simplePaginate(10)]);
    }

    public function create()
    {
        return Inertia::render('admin/polls/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => ['required'],
            'result_visible' => ['required', 'boolean'],
            'withdrawable' => ['required', 'boolean'],
            'options' => ['required', 'array', 'min:2'],
            'options.*' => ['required', 'string'],
        ]);

        $originalSlug = Str::slug($request->title);
        $slug = Str::slug($request->title);

        while (Poll::query()->where('slug', $slug)->exists()) {
            $slug = $originalSlug.'-'.Str::random(4);
        }

        $poll = auth()->user()->polls()->create(
            $request->merge(['slug' => $slug])->only(['title', 'description', 'result_visible', 'withdrawable', 'slug'])
        );

        $poll->options()->createMany(collect($request->options)->map(fn ($option) => ['label' => $option]));

        return redirect()->route('admin.polls.index');
    }
}
