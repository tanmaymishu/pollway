import PollController from '@/actions/App/Http/Controllers/PollController';
import { Result } from '@/components/polls/result';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Poll, PollOption, PollVote } from '@/types';
import { Link } from '@inertiajs/react';
import { useEchoPublic } from '@laravel/echo-react';
import { Eye, Share2, Undo } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface PollProps {
    resultVisible: boolean;
    withdrawable: boolean;
    initialPoll: Poll;
    handleVote: (o: PollOption) => void;
    handleVoteWithdraw: (pv: PollVote) => void;
}

function SinglePoll({ initialPoll, handleVote, handleVoteWithdraw }: PollProps) {
    const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
    const [options, setOptions] = useState<PollOption[]>(initialPoll.options);
    const [selectedOption, setSelectedOption] = useState<PollOption | undefined>(
        initialPoll.options.find((o) => o.id == initialPoll?.own_vote?.poll_option_id),
    );
    const [poll, setPoll] = useState<Poll>(initialPoll);
    const [voted, setVoted] = useState(Boolean(initialPoll.own_vote_id));

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
        e.pollVote.poll.own_vote = e.pollVote;
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
        <Card className="flex flex-col rounded-sm p-10">
            <CardContent className="border-b">
                <section className="justify-between gap-4 py-2 sm:flex">
                    <div key={poll.id} className="flex flex-col gap-4 sm:w-full md:w-1/2">
                        <section className="text-2xl hover:underline">
                            <Link href={PollController.show(poll.slug)} className="text-gray-600">
                                {poll.id}. {poll.title}
                            </Link>
                        </section>
                        <RadioGroup value={selectedOption?.id.toString()}>
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
                                                        {poll?.own_vote?.poll_option_id === o.id && (
                                                            <Badge className="bg-green-200 text-gray-600">✅ Your Vote</Badge>
                                                        )}
                                                    </section>
                                                    <section>
                                                        {poll.own_vote?.poll_option_id === o.id && Boolean(poll.withdrawable) && (
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="destructive"
                                                                        size="sm"
                                                                        disabled={awaitingConfirmation}
                                                                        onClick={() => {
                                                                            setAwaitingConfirmation(true);
                                                                            handleVoteWithdraw(poll.own_vote);
                                                                        }}
                                                                    >
                                                                        <Undo />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Withdraw this vote</p>
                                                                </TooltipContent>
                                                            </Tooltip>
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
                    <div className="flex flex-col justify-center sm:w-full md:w-1/2">
                        {poll.result_visible || voted ? (
                            <Result options={options} />
                        ) : (
                            <p className="text-center">Result will be published once you vote</p>
                        )}
                    </div>
                </section>
            </CardContent>
            <CardFooter className="flex gap-2 self-center">
                {window.location.pathname === '/polls' ? (
                    <Button variant="outline" asChild>
                        <Link href={PollController.show(poll.slug)}>
                            <Eye />
                            View
                        </Link>
                    </Button>
                ) : (
                    <Button variant="outline" asChild>
                        <Link href={PollController.index()}>
                            <Eye />
                            View All Polls
                        </Link>
                    </Button>
                )}

                <Button
                    onClick={() => {
                        navigator.clipboard.writeText(`${window.location.host}/polls/${poll.slug}`);
                        toast.success('Link copied to clipboard');
                    }}
                    variant="outline"
                >
                    <Share2 />
                    Share Poll Link
                </Button>
            </CardFooter>
        </Card>
    );
}

export default SinglePoll;
