import PollController from '@/actions/App/Http/Controllers/PollController';
import { Result } from '@/components/polls/result';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Poll, PollOption, PollVote, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
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
    const ip = usePage<SharedData>().props.ip;

    const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
    const [options, setOptions] = useState<PollOption[]>(initialPoll.options);
    const [selectedOption, setSelectedOption] = useState<PollOption | undefined>(
        initialPoll.options.find((o) => o.id == initialPoll?.own_vote?.poll_option_id),
    );
    const [poll, setPoll] = useState<Poll>(initialPoll);
    const [voted, setVoted] = useState(Boolean(initialPoll.own_vote_id));

    useEchoPublic<{ pollVote: PollVote; ip: string }>(`poll.${initialPoll.id}`, '.poll.voted', (e) => {
        console.log('Vote received:', e);

        // Always update vote counts for all users (this is public information)
        setOptions((prev) => {
            const updatedOptions = [...prev];
            const optionIndex = updatedOptions.findIndex((po) => po.id === e.pollVote.poll_option_id);
            if (optionIndex !== -1) {
                // Update the vote count for this option
                updatedOptions[optionIndex] = {
                    ...updatedOptions[optionIndex],
                    vote_count: e.pollVote.option.vote_count,
                };
            }
            return updatedOptions;
        });

        // Only update personal voting state for the user who voted
        if (e.pollVote.ip_address === ip) {
            setVoted(true);
            setAwaitingConfirmation(false);
            setSelectedOption(e.pollVote.option);
            // Update poll with the user's own vote information
            setPoll((prevPoll) => ({
                ...prevPoll,
                own_vote: e.pollVote,
                own_vote_id: e.pollVote.id,
            }));
            toast.success('Thank you, your vote has been casted!');
        }
    });

    useEchoPublic<{ poll: Poll; ip: string }>(`poll.${initialPoll.id}`, '.poll.unvoted', (e) => {
        console.log('Vote withdrawn:', e);

        // Always update vote counts for all users (this is public information)
        setOptions((prev) => {
            // Update all options with new vote counts from the withdrawn vote
            return prev.map((option) => {
                const updatedOption = e.poll.options.find((o) => o.id === option.id);
                return updatedOption ? { ...option, vote_count: updatedOption.vote_count } : option;
            });
        });

        // Only update personal voting state for the user who withdrew
        if (ip === e.ip) {
            setVoted(false);
            setAwaitingConfirmation(false);
            setSelectedOption(undefined);
            // Clear the user's own vote information
            setPoll((prevPoll) => ({
                ...prevPoll,
                own_vote: null,
                own_vote_id: null,
            }));
            toast.success('Thank you, your vote has been withdrawn!');
        }
    });
    return (
        <Card className="flex flex-col rounded-sm p-4 sm:p-6 md:p-10">
            <CardContent className="border-b">
                <section className="flex flex-col gap-6 py-2 lg:flex-row lg:justify-between lg:gap-4">
                    <div key={poll.id} className="flex flex-col gap-4 lg:w-1/2">
                        <section className="text-lg hover:underline sm:text-xl lg:text-2xl">
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
                                            className="flex w-full cursor-pointer items-center gap-3 rounded-md border px-3 py-3 sm:px-4 sm:py-4"
                                        >
                                            <RadioGroupItem
                                                disabled={awaitingConfirmation || voted}
                                                onClick={async () => {
                                                    setSelectedOption(o);
                                                    setAwaitingConfirmation(true);
                                                    const success = await handleVote(o);
                                                    if (!success) {
                                                        // Reset state if vote failed
                                                        setAwaitingConfirmation(false);
                                                        setSelectedOption(
                                                            voted ? options.find((opt) => opt.id == poll?.own_vote?.poll_option_id) : undefined,
                                                        );
                                                    }
                                                }}
                                                value={o.id.toString()}
                                                id={`poll_${o.poll_id}_opt_${o.id}`}
                                                className="cursor-pointer"
                                            />
                                            {
                                                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                    <section className="flex flex-wrap items-center gap-2">
                                                        <p className="text-sm sm:text-base">{o.label}</p>
                                                        {poll?.own_vote?.poll_option_id === o.id && (
                                                            <Badge className="bg-green-200 text-xs text-gray-600">✅ Your Vote</Badge>
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
                                                                        onClick={async () => {
                                                                            setAwaitingConfirmation(true);
                                                                            const success = await handleVoteWithdraw(poll.own_vote);
                                                                            if (!success) {
                                                                                // Reset state if withdrawal failed
                                                                                setAwaitingConfirmation(false);
                                                                            }
                                                                        }}
                                                                        className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                                                                    >
                                                                        <Undo className="h-4 w-4" />
                                                                        <span className="sr-only sm:not-sr-only sm:ml-2">Withdraw</span>
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
                    <div className="flex flex-col justify-center lg:w-1/2">
                        {poll.result_visible || voted ? (
                            <Result options={options} />
                        ) : (
                            <p className="text-center text-sm sm:text-base">Result will be published once you vote</p>
                        )}
                    </div>
                </section>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 self-center sm:flex-row">
                {typeof window !== 'undefined' && window.location.pathname === '/polls' ? (
                    <Button variant="outline" asChild className="w-full sm:w-auto">
                        <Link href={PollController.show(poll.slug)}>
                            <Eye className="h-4 w-4" />
                            <span className="ml-2">View</span>
                        </Link>
                    </Button>
                ) : (
                    <Button variant="outline" asChild className="w-full sm:w-auto">
                        <Link href={PollController.index()}>
                            <Eye className="h-4 w-4" />
                            <span className="ml-2 hidden sm:inline">View All Polls</span>
                            <span className="ml-2 sm:hidden">All Polls</span>
                        </Link>
                    </Button>
                )}

                {typeof window !== 'undefined' && (
                    <Button
                        onClick={() => {
                            navigator.clipboard.writeText(`${window.location.host}/polls/${poll.slug}`);
                            toast.success('Link copied to clipboard');
                        }}
                        variant="outline"
                        className="w-full sm:w-auto"
                    >
                        <Share2 className="h-4 w-4" />
                        <span className="ml-2 hidden sm:inline">Share Poll Link</span>
                        <span className="ml-2 sm:hidden">Share</span>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

export default SinglePoll;
