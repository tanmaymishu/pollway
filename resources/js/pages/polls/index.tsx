import { AppHeader } from '@/components/app-header';
import SinglePoll from '@/components/polls/single-poll';
import { Button } from '@/components/ui/button';
import { useVote } from '@/hooks/use-vote';
import { Poll, SimplePaginate } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, ChartColumnBig } from 'lucide-react';
import * as React from 'react';

interface PollIndexProps {
    polls: SimplePaginate<Poll>;
}

const PollIndex: React.FC<PollIndexProps> = ({ polls }) => {
    const { handleVote, handleVoteWithdraw } = useVote();
    return (
        <section>
            <AppHeader />
            <div className="container mx-auto my-4 flex flex-col gap-2 p-4 sm:p-8">
                <section className="flex items-center gap-2 text-3xl text-primary sm:text-5xl">
                    <ChartColumnBig className="size-8 sm:size-11" />
                    Polls
                </section>
                <section className="text-sm">
                    You can only vote once from your IP. Rules may vary from poll to poll. Depending on the settings, some polls are
                    undo/withdrawable, and some have relaxed visibility.
                </section>
                <hr />
                <section className="flex flex-col gap-2">
                    {polls?.data?.length > 0 &&
                        polls?.data?.map((poll) => {
                            return (
                                <SinglePoll
                                    resultVisible={poll.result_visible}
                                    withdrawable={poll.withdrawable}
                                    key={poll.id}
                                    initialPoll={poll}
                                    handleVote={handleVote}
                                    handleVoteWithdraw={handleVoteWithdraw}
                                />
                            );
                        })}
                </section>
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                    {polls.prev_page_url ? (
                        <Button asChild className="w-full sm:w-auto">
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
                        <Button asChild className="w-full sm:w-auto">
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
            </div>
            <footer className="text-center">©{new Date().getFullYear()} PollWay.</footer>
        </section>
    );
};

export default PollIndex;
