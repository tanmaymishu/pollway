import AppLayout from '@/layouts/app-layout';
import { Poll } from '@/types';
import { Link } from '@inertiajs/react';
import * as React from 'react';
import { Button } from '@/components/ui/button';

interface AdminPollsProps {
    polls: Poll[];
}

const AdminPolls: React.FC<AdminPollsProps> = ({ polls }) => {
    return (
        <AppLayout>
            <div>
                <Button asChild>
                    <Link href="/admin/polls/create">Create New Poll</Link>
                </Button>
            </div>
        </AppLayout>
    );
};

export default AdminPolls;
