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
            <div className="container mx-auto my-4 flex flex-col gap-2 p-8">
                <section className="flex text-5xl text-primary">
                    <ChartColumnBig size={45} />
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
                <div className="flex justify-between">
                    {polls.prev_page_url ? (
                        <Button asChild>
                            <Link href={polls.prev_page_url}>
                                <ArrowLeft />
                                Prev Page
                            </Link>
                        </Button>
                    ) : (
                        <div></div>
                    )}
                    {polls.next_page_url ? (
                        <Button asChild>
                            <Link href={polls.next_page_url}>
                                Next Page
                                <ArrowRight />
                            </Link>
                        </Button>
                    ) : (
                        <div></div>
                    )}
                </div>
            </div>
            <footer className="text-center">©{new Date().getFullYear()} PollWay.</footer>
        </section>
    );
};

export default PollIndex;
