import AdminPollController from '@/actions/App/Http/Controllers/AdminPollController';
import PollController from '@/actions/App/Http/Controllers/PollController';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Poll, SimplePaginate } from '@/types';
import { Link } from '@inertiajs/react';
import { ExternalLink, PlusIcon } from 'lucide-react';

interface AdminPollIndexProps {
    polls: SimplePaginate<Poll>;
}

export default function AdminPollIndex({ polls }: AdminPollIndexProps) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Polls', href: AdminPollController.index().url }]}>
            <section className="mx-16 mt-4 flex flex-col gap-2 py-4">
                <div className="flex gap-2 self-end">
                    <Button asChild size="sm">
                        <Link href={AdminPollController.create()}>
                            <PlusIcon />
                            Create New Poll
                        </Link>
                    </Button>
                    <Button asChild size="sm">
                        <Link href={PollController.index()}>
                            <ExternalLink />
                            View Public Page
                        </Link>
                    </Button>
                </div>
                <Table>
                    <TableCaption>A list of your polls.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="">Poll Title</TableHead>
                            <TableHead>Withdrawable</TableHead>
                            <TableHead>Result Visible</TableHead>
                            <TableHead>Link</TableHead>
                            <TableHead className="text-right">Vote Count</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {polls.data.map((poll) => (
                            <TableRow key={poll.id}>
                                <TableCell className="font-medium">{poll.title}</TableCell>
                                <TableCell>{poll.withdrawable ? 'Yes' : 'No'}</TableCell>
                                <TableCell>{poll.result_visible ? 'Yes' : 'No'}</TableCell>
                                <TableCell></TableCell>
                                <TableCell className="text-right">{poll.votes.length}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </section>
        </AppLayout>
    );
}
