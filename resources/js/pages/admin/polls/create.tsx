import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import polls from '@/routes/admin/polls';
import { Link, useForm, usePage } from '@inertiajs/react';
import * as React from 'react';
import { useState } from 'react';
import { ArrowLeft, CheckCircle, PlusIcon, SendToBack, StepBack, TrashIcon } from 'lucide-react';
import AdminPollController from '@/actions/App/Http/Controllers/AdminPollController';
import { Checkbox } from '@/components/ui/checkbox';

const CreatePoll: React.FC = () => {
    const [newOptions, setNewOptions] = useState<string[]>([]);
    const {data, setData, post} = useForm({
        title: '',
        withdrawable: false,
        result_visible: false,
        options: [] as string[],
    });
    const errors = usePage().props.errors;

    function handleAddNewOption() {
        setNewOptions(prev => {
            return [...prev, ""];
        })
    }

    function handleNewOptionChange(index: number, value: string) {
        setNewOptions(prev => {
            prev[index] = value;
            return [...prev];
        })
    }

    function handleDeleteNewOption(index: number) {
        setNewOptions(prev => {
            return prev.filter((o, i) => i != index);
        })
    }

    function handleSubmit() {
        data.options = newOptions;
        post(AdminPollController.store().url)
    }

    return (
        <AppLayout>
            <div className="px-16 py-4 flex flex-col gap-4">
                <Button asChild variant="outline" className="self-start">
                    <Link href={polls.index()}><ArrowLeft/>Back</Link>
                </Button>
                <form className="flex flex-col gap-4">
                    <section className="">
                        <label htmlFor="title">Title:</label>
                        <Input value={data.title} onChange={e => setData('title', e.target.value)} type="text" id="title" name="title" placeholder="Poll title" required />
                        {errors?.title && <p className="text-xs text-red-500">{errors.title}</p>}
                    </section>
                    <section className="flex gap-2 items-center">
                        <Checkbox onClick={e => setData('withdrawable', e.currentTarget.ariaChecked !== 'true')}></Checkbox>
                        <label htmlFor="withdrawable">Vote can be withdrawn</label>
                    </section>
                    <section className="flex gap-2 items-center">
                        <Checkbox onClick={e => setData('result_visible', e.currentTarget.ariaChecked !== 'true')}></Checkbox>
                        <label htmlFor="result_visible">Result is visible</label>
                    </section>
                    <section className='flex flex-col gap-2'>
                        {newOptions?.map((no, index) => {
                            return <div key={index} className='flex flex-col gap-1'>
                                <label htmlFor={`option_${index}`} className="flex justify-between">
                                    <p className='text-xs'>Option {index + 1}:</p>
                                    <p className='text-sm text-red-500 cursor-pointer'><TrashIcon onClick={() => handleDeleteNewOption(index)}/></p>
                                </label>
                                <Input autoFocus={newOptions.length - 1 === index} onKeyUp={e => e.key === 'Enter' && newOptions[newOptions.length-1] !== '' ? handleAddNewOption() : undefined} onChange={e => handleNewOptionChange(index, e.target.value)} type="text" id="option" name="title" placeholder="Option Label" required value={no} />
                            </div>
                        })}
                        <Button className="w-50" type="button" variant="outline" disabled={newOptions[newOptions.length-1] === ''} size="sm" onClick={handleAddNewOption} ><PlusIcon/>Add Option</Button>
                        {errors?.options && <p className="text-xs text-red-500">{errors.options}</p>}
                    </section>
                    <section>
                        <Button type="button" onClick={handleSubmit}><CheckCircle/>Save Poll</Button>
                    </section>
                </form>
            </div>
        </AppLayout>
    );
};

export default CreatePoll;
