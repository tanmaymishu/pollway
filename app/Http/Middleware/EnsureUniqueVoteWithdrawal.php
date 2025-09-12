<?php

namespace App\Http\Middleware;

use App\Models\PollVote;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUniqueVoteWithdrawal
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $pollVote = $request->route()->parameter('pollVote');

        if (empty($pollVote)) {
            abort(404);
        }

        if (PollVote::where(['id' => $pollVote->id, 'ip_address' => $request->ip()])->doesntExist()) {
            abort(403, 'This vote can be withdrawn from the IP you used while voting.');
        }

        return $next($request);
    }
}
