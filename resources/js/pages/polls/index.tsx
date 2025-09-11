import PollController from '@/actions/App/Http/Controllers/PollController';
import { AppHeader } from '@/components/app-header';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Poll, PollOption, SharedData, SimplePaginate } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { LineChart } from 'lucide-react';
import * as React from 'react';

interface PollIndexProps {
    polls: SimplePaginate<Poll>;
}

const PollIndex: React.FC<PollIndexProps> = ({ polls }) => {
    const ip = usePage<SharedData>().props.ip;

    function handleVote(option: PollOption) {
        router.post('/api/polls/' + option.poll_id + '/votes', {poll_option_id: option.id});
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
                                <div key={poll.id} className="flex flex-col gap-4">
                                    <section className="text-4xl hover:underline">
                                        <Link href={PollController.show(poll.slug)}>
                                            #{poll.id} - {poll.title}
                                        </Link>
                                    </section>
                                    <RadioGroup defaultValue={poll.votes.find(p => p.ip_address === ip)?.poll_option_id.toString()}>
                                        {poll?.options?.map((o) => {
                                            return (
                                                <section key={o.id} className="flex items-center justify-between">
                                                    <Label
                                                        htmlFor={`poll_${o.poll_id}_opt_${o.id}`}
                                                        className="flex w-1/2 cursor-pointer items-center gap-3 rounded-md border px-4 py-4"
                                                    >
                                                        <RadioGroupItem
                                                            disabled={poll.votes.filter(p => p.ip_address === ip).length > 0}
                                                            onClick={() => handleVote(o)}
                                                            value={o.id.toString()}
                                                            id={`poll_${o.poll_id}_opt_${o.id}`}
                                                            className="cursor-pointer"
                                                        />
                                                        {o.label} {o.votes.length}
                                                    </Label>
                                                </section>
                                            );
                                        })}
                                    </RadioGroup>
                                </div>
                            );
                        })}
                </section>
            </div>
        </section>
    );
};

export default PollIndex;
