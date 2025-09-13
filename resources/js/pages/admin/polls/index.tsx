import AdminPollController from '@/actions/App/Http/Controllers/AdminPollController';
import PollController from '@/actions/App/Http/Controllers/PollController';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Poll, SimplePaginate } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, ExternalLink, PlusIcon, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import * as React from 'react';

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
                                <TableCell>
                                    {typeof window !== 'undefined' && (
                                        <Button
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${window.location.host}/polls/${poll.slug}`);
                                                toast.success('Link copied to clipboard');
                                            }}
                                            variant="outline"
                                            size="sm"
                                            className="w-full sm:w-auto"
                                        >
                                            <Share2 className="h-4 w-4" />
                                            <span className="ml-2 hidden sm:inline">Copy Link</span>
                                            <span className="ml-2 sm:hidden">Share</span>
                                        </Button>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">{poll.votes.length}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>


                </Table>
                <div className="flex justify-between flex-row">
                    {polls.prev_page_url ? (
                        <Button asChild size="sm" className="w-full sm:w-auto">
                            <Link href={polls.prev_page_url}>
                                <ArrowLeft className="size-4" />
                                <span className="hidden sm:inline">Prev Page</span>
                                <span className="sm:hidden">Previous</span>
                            </Link>
                        </Button>
                    ) : (
                        <div className="hidden sm:block"></div>
                    )}
                    {polls.next_page_url ? (
                        <Button size="sm" asChild className="w-full sm:w-auto">
                            <Link href={polls.next_page_url}>
                                <span className="hidden sm:inline">Next Page</span>
                                <span className="sm:hidden">Next</span>
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    ) : (
                        <div className="hidden sm:block"></div>
                    )}
                </div>
            </section>
        </AppLayout>
    );
}
