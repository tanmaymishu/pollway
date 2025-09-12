import { PollOption, PollVote } from '@/types';
import { useCallback } from 'react';
import { toast } from 'sonner';

export function useVote() {
    const handleVote = useCallback(async (option: PollOption) => {
        const response = await fetch('/api/polls/' + option.poll_id + '/votes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ poll_option_id: option.id }),
        });

        if (response.status === 403) {
            toast('Your vote has already been casted!');
        }
    }, []);
    const handleVoteWithdraw = useCallback(async (pv: PollVote) => {
        const response = await fetch(`/api/poll-votes/${pv.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 403) {
            toast('IP Misuse!');
        }
    }, []);

    return {handleVote, handleVoteWithdraw};
}
