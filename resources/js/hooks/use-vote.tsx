import { PollOption, PollVote } from '@/types';
import { useCallback } from 'react';
import { toast } from 'sonner';
import PollVoteController from '@/actions/App/Http/Controllers/Api/V1/PollVoteController';

export function useVote() {
    const handleVote = useCallback(async (option: PollOption) => {
        const response = await fetch(PollVoteController.store({poll: option.poll_id}).url, {
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
        const response = await fetch(PollVoteController.destroy(pv.id).url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 403) {
            toast('IP Misuse!');
        }
    }, []);

    return { handleVote, handleVoteWithdraw };
}
