<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $votes = auth()->user()->votes()->with('poll', 'option')->get();
        return Inertia::render('dashboard', ['votes' => $votes]);
    }
}
