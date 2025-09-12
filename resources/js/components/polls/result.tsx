import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PollOption } from '@/types';

const chartConfig = {
    votes: {
        label: 'Votes',
        color: 'var(--primary)',
    },
    label: {
        color: 'var(--background)',
    },
} satisfies ChartConfig;

interface ResultProps {
    options: PollOption[];
}

export function Result({ options }: ResultProps) {
    return (
        <div>
            <ChartContainer className="min-h-[200px] w-full" config={chartConfig}>
                <BarChart
                    // barCategoryGap="30%"
                    accessibilityLayer
                    data={options.map((o) => ({ option: o.label, votes: o.vote_count }))}
                    layout="vertical"
                    margin={{
                        right: 16,
                    }}
                >
                    <CartesianGrid horizontal={false} />
                    <YAxis
                        dataKey="option"
                        type="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                        hide
                    />
                    <XAxis dataKey="votes" type="number" hide />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                    <Bar dataKey="votes" layout="vertical" fill="#8E51FF" radius={4} barSize={30}>
                        <LabelList dataKey="option" position="insideLeft" offset={8} className="fill-(--color-label)" fontSize={12} />
                        <LabelList dataKey="option" position="right" offset={8} className="fill-foreground" fontSize={12} />
                    </Bar>
                </BarChart>
            </ChartContainer>
            <p className="mt-1 text-center text-lg">Poll Result</p>
        </div>
    );
}
