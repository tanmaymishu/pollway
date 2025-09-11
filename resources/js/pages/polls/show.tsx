import { Poll } from '@/types';
import * as React from 'react';
import { AppHeader } from '@/components/app-header';
import { Input } from '@/components/ui/input';

interface PollShowProps {
    poll: Poll;
}

const PollShow: React.FC<PollShowProps> = ({ poll }) => {
    return (
        <section>
            <AppHeader/>
            <div className="flex flex-col container p-8 mx-auto gap-2 my-4">
                <section className="text-4xl">Polls</section>
                <hr/>
                <section>
                    <div key={poll.id}>
                        {poll.title}
                        {poll?.options?.map(o => {
                            return <section key={o.id} className="flex justify-between items-center">
                                <label>{o.label}</label>
                                <Input type="radio" value={o.id} name={`poll_${o.poll_id}`}/>
                            </section>
                        })}
                    </div>
                </section>
            </div>
        </section>
    );
};

export default PollShow;
