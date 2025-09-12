import PollController from '@/actions/App/Http/Controllers/PollController';
import { Result } from '@/components/polls/result';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Poll, PollOption, PollVote } from '@/types';
import { Link } from '@inertiajs/react';
import { useEchoPublic } from '@laravel/echo-react';
import { Undo } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface PollProps {
    resultVisible: boolean;
    withdrawable: boolean;
    initialPoll: Poll;
    handleVote: (o: PollOption) => void;
    handleVoteWithdraw: (pv: PollVote) => void;
    ip: string;
}

function SinglePoll({ initialPoll, handleVote, handleVoteWithdraw, ip }: PollProps) {
    const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
    const [options, setOptions] = useState<PollOption[]>(initialPoll.options);
    const [selectedOption, setSelectedOption] = useState<PollOption | undefined>(
        initialPoll.options.find((o) => o.id == initialPoll.votes.find((pv) => pv.ip_address === ip)?.poll_option_id),
    );
    const [poll, setPoll] = useState<Poll>(initialPoll);
    const [voted, setVoted] = useState(initialPoll.votes.filter((v) => v.ip_address === ip).length > 0);

    useEchoPublic<{ pollVote: PollVote }>(`poll.${initialPoll.id}`, '.poll.voted', (e) => {
        setOptions((prev) => {
            prev.splice(
                prev.findIndex((po) => po.id === e.pollVote.poll_option_id),
                1,
                e.pollVote.option,
            );
            return [...prev];
        });

        setVoted(true);
        setAwaitingConfirmation(false);
        setSelectedOption(e.pollVote.option);
        setPoll(e.pollVote.poll);
        toast.success('Thank you, your vote has been casted!');
    });

    useEchoPublic<{ poll: Poll }>(`poll.${initialPoll.id}`, '.poll.unvoted', (e) => {
        setVoted(false);
        setAwaitingConfirmation(false);
        setOptions(e.poll.options);
        setSelectedOption(undefined);
        setPoll(e.poll);
        toast.success('Thank you, your vote has been withdrawn!');
    });
    return (
        <section className="sm:flex gap-4 justify-between border-b-1 py-2">
            <div key={poll.id} className="flex sm:w-full md:w-1/2 flex-col gap-4">
                <section className="text-4xl hover:underline">
                    <Link href={PollController.show(poll.slug)}>
                        {poll.id}. {poll.title}
                    </Link>
                </section>
                <RadioGroup value={selectedOption?.id.toString()} >
                    {options?.map((o) => {
                        return (
                            <section key={o.id} className="flex items-center">
                                <Label
                                    htmlFor={`poll_${o.poll_id}_opt_${o.id}`}
                                    className="flex w-full cursor-pointer items-center gap-3 rounded-md border px-4 py-4"
                                >
                                    <RadioGroupItem
                                        disabled={awaitingConfirmation || voted}
                                        onClick={() => {
                                            setSelectedOption(o);
                                            setAwaitingConfirmation(true);
                                            handleVote(o);
                                        }}
                                        value={o.id.toString()}
                                        id={`poll_${o.poll_id}_opt_${o.id}`}
                                        className="cursor-pointer"
                                    />
                                    {
                                        <div className="flex w-full items-center justify-between">
                                            <section className="flex items-center gap-2">
                                                <p>{o.label}</p>
                                                {poll.votes.filter((p) => p.ip_address === ip && p.poll_option_id == o.id).length > 0 && (
                                                    <Badge className="bg-green-200 text-gray-600">✅ Your Vote</Badge>
                                                )}
                                            </section>
                                            <section>
                                                {poll.votes.filter((p) => p.ip_address === ip && p.poll_option_id == o.id).length > 0 &&
                                                    Boolean(poll.withdrawable) && (
                                                        <Button variant="destructive" size="sm" disabled={awaitingConfirmation} onClick={() => {
                                                            setAwaitingConfirmation(true);
                                                            handleVoteWithdraw(poll.votes.filter(pv => o.id === pv.poll_option_id)[0])
                                                        }}>
                                                            <Undo />
                                                            Withdraw
                                                        </Button>
                                                    )}
                                            </section>
                                        </div>
                                    }
                                </Label>
                            </section>
                        );
                    })}
                </RadioGroup>
            </div>
            <div className="flex sm:w-full md:w-1/2 flex-col justify-center">
                {poll.result_visible || voted ? <Result options={options} /> : <p className="text-center">Result will be published once you vote</p>}
            </div>
        </section>
    );
}

export default SinglePoll;
