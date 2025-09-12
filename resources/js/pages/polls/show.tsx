import { Poll, SharedData } from '@/types';
import * as React from 'react';
import { AppHeader } from '@/components/app-header';
import SinglePoll from '@/components/polls/single-poll';
import { usePage } from '@inertiajs/react';

interface PollShowProps {
    poll: Poll;
}

const PollShow: React.FC<PollShowProps> = ({ poll }) => {
    const ip = usePage<SharedData>().props.ip;

    return (
        <section className="container mx-auto">
            <AppHeader/>
            <SinglePoll resultVisible={poll.result_visible} withdrawable={poll.withdrawable} initialPoll={poll} handleVote={()=>{}} handleVoteWithdraw={()=>{}} ip={ip}/>
        </section>
    );
};

export default PollShow;
