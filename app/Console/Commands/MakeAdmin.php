<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class MakeAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:admin {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mark a user as an admin';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');

        if ($user = User::query()->firstWhere('email', $email)) {
            $user->update(['is_admin' => true]);
        } else {
            $this->info('User not found for the given e-mail.');
        }
    }
}
