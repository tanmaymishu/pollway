import { AppHeader } from '@/components/app-header';
import SinglePoll from '@/components/polls/single-poll';
import { Button } from '@/components/ui/button';
import { Poll, PollOption, PollVote, SharedData, SimplePaginate } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LineChart } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

interface PollIndexProps {
    polls: SimplePaginate<Poll>;
}

const PollIndex: React.FC<PollIndexProps> = ({ polls }) => {
    const ip = usePage<SharedData>().props.ip;

    async function handleVote(option: PollOption) {
        const response = await fetch('/api/polls/' + option.poll_id + '/votes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ poll_option_id: option.id }),
        });

        // if (response.status === 201) {
        //     toast('Thank you, your vote has been casted!');
        // }

        if (response.status === 403) {
            toast('Your vote has already been casted!');
        }
    }

    async function handleVoteWithdraw(pv: PollVote) {
        const response = await fetch(`/api/poll-votes/${pv.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // if (response.status === 204) {
        //     toast('Thank you, your vote has been withdrawn!');
        // }

        if (response.status === 403) {
            toast('IP Misuse!');
        }
    }
    return (
        <section>
            <AppHeader />
            <div className="container mx-auto my-4 flex flex-col gap-2 p-8">
                <section className="flex text-5xl text-primary">
                    <LineChart size={45} />
                    Polls
                </section>
                <section className="text-sm">
                    You can vote on a poll only once. Once you vote, it cannot be withdrawn. To prevent bias, the total votes will only be visible
                    after you have voted.
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
                                    ip={ip}
                                />
                            );
                        })}
                </section>
                <div className="flex justify-between">
                    {polls.prev_page_url ? <Button variant="link" asChild>
                        <Link href={polls.prev_page_url}>Prev</Link>
                    </Button>: <div></div>}
                    {polls.next_page_url ? <Button variant="link" asChild>
                        <Link href={polls.next_page_url}>Next</Link>
                    </Button> : <div></div>}
                </div>
            </div>
            <footer className="text-center">©{new Date().getFullYear()} PollWay.</footer>
        </section>
    );
};

export default PollIndex;
