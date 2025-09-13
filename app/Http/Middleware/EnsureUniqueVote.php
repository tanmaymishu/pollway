<?php

namespace App\Http\Middleware;

use App\Models\PollVote;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUniqueVote
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $poll = $request->route()->parameter('poll');

        if (empty($poll)) {
            abort(404);
        }

        if (!empty(auth()->id()) && PollVote::whereNotNull('user_id')->where(['poll_id' => $poll->id, 'user_id' => auth()->id()])->exists()) {
            abort(403, 'Already casted vote for this poll!');
        }

        if (PollVote::where(['poll_id' => $poll->id, 'ip_address' => $request->ip()])->exists()) {
            abort(403, 'Already casted vote for this poll from this IP!');
        }

        return $next($request);
    }
}
