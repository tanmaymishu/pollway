import PollVoteController from '@/actions/App/Http/Controllers/Api/V1/PollVoteController';
import { PollOption, PollVote } from '@/types';
import { useCallback } from 'react';
import { toast } from 'sonner';

export function useVote() {
    const handleVote = useCallback(async (option: PollOption) => {
        try {
            const response = await fetch(PollVoteController.store({ poll: option.poll_id }).url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ poll_option_id: option.id }),
            });

            if (response.status === 403) {
                toast.error('Your vote has already been casted!');
                return false;
            }

            if (!response.ok) {
                toast.error('Failed to cast vote. Please try again.');
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error casting vote:', error);
            toast.error('Failed to cast vote. Please try again.');
            return false;
        }
    }, []);
    const handleVoteWithdraw = useCallback(async (pv: PollVote) => {
        try {
            const response = await fetch(PollVoteController.destroy(pv.id).url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 403) {
                toast.error('IP Misuse!');
                return false;
            }

            if (!response.ok) {
                toast.error('Failed to withdraw vote. Please try again.');
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error withdrawing vote:', error);
            toast.error('Failed to withdraw vote. Please try again.');
            return false;
        }
    }, []);

    return { handleVote, handleVoteWithdraw };
}
