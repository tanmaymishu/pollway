import { AppHeader } from '@/components/app-header';
import SinglePoll from '@/components/polls/single-poll';
import { useVote } from '@/hooks/use-vote';
import { Poll } from '@/types';
import * as React from 'react';

interface PollShowProps {
    poll: Poll;
}

const PollShow: React.FC<PollShowProps> = ({ poll }) => {
    const { handleVote, handleVoteWithdraw } = useVote();

    return (
        <div>
            <AppHeader />
            <section className="container mx-auto mt-4">
                <SinglePoll
                    resultVisible={poll.result_visible}
                    withdrawable={poll.withdrawable}
                    initialPoll={poll}
                    handleVote={handleVote}
                    handleVoteWithdraw={handleVoteWithdraw}
                />
            </section>
        </div>
    );
};

export default PollShow;
