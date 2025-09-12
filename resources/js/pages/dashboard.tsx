import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import PollController from '@/actions/App/Http/Controllers/PollController';
import { BarChart2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const user = usePage<SharedData>().props?.auth?.user

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <p className="text-xl text-center">Welcome, {user?.name}</p>
                {!user?.is_admin && <p className="text-sm text-center">Want to become an admin and create polls? Contact site owner.</p>}
                {!user?.is_admin && <Button className="w-1/3 self-center" asChild><Link href={PollController.index()}><BarChart2/>Keep Voting</Link></Button> }
            </div>
        </AppLayout>
    );
}
