import PollController from '@/actions/App/Http/Controllers/PollController';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, PollVote, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { BarChart2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardProps {
    votes: PollVote[];
}

export default function Dashboard({votes}: DashboardProps) {
    const user = usePage<SharedData>().props?.auth?.user;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <p className="text-xl">Welcome, {user?.name}</p>
                {!user?.is_admin && <p className="text-sm">Want to become an admin and create polls? Contact site owner.</p>}
                {!user?.is_admin && (
                    <Button className="w-1/3" asChild>
                        <Link href={PollController.index()}>
                            <BarChart2 />
                            Keep Voting
                        </Link>
                    </Button>
                )}
                <section>
                    <p className="text-lg">Polls you have participated in:</p>
                    <hr/>
                    {votes.map(v => {
                        return <div key={v.id} className="flex items-center">
                            <Button variant="link" asChild className="-ml-4">
                                <Link href={PollController.show({poll: v.poll.slug}).url}>{v.poll.title}</Link>
                            </Button>
                            <p className="text-xs">Your vote: <span className="font-semibold">{v.option.label}</span> ✅</p>
                        </div>
                    })}
                </section>
            </div>
        </AppLayout>
    );
}
