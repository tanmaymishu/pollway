<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePollRequest;
use App\Http\Requests\UpdatePollRequest;
use App\Models\Poll;
use Inertia\Inertia;

class PollController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $polls = Poll::query()
            ->withOwnVote()
            ->with(['options'])
            ->latest()
            ->simplePaginate(5);

        return Inertia::render('polls/index', ['polls' => $polls]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePollRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Poll $poll)
    {
        $poll = Poll::query()
            ->withOwnVote()
            ->with(['options'])
            ->where('id', $poll->id)
            ->first();

        return Inertia::render('polls/show', ['poll' => $poll]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Poll $poll)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePollRequest $request, Poll $poll)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Poll $poll)
    {
        //
    }
}
