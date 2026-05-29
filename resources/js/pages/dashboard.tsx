import { Head } from '@inertiajs/react';
import {
    Bot,
    MessageSquareMore,
    TrendingUp,
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import {
    CategoryScale,
    Chart,
    Filler,
    LineController,
    LineElement,
    LinearScale,
    PointElement,
    Tooltip,
    type ChartConfiguration,
} from 'chart.js';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard } from '@/routes';

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController,
    Tooltip,
    Filler,
);

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();
const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

const fakeChatbots = [
    {
        id: 1,
        name: 'Sales Concierge',
        monthlyRequests: [12, 18, 16, 22, 27, 20, 19, 25, 24, 21, 28, 32, 29, 34, 30, 36, 38, 35, 33, 31, 37, 39, 42, 40, 41, 43, 45, 44, 46, 48, 50],
    },
    {
        id: 2,
        name: 'Support Copilot',
        monthlyRequests: [8, 10, 13, 15, 14, 17, 18, 16, 20, 22, 21, 23, 24, 26, 25, 27, 29, 28, 30, 31, 32, 34, 33, 36, 35, 37, 39, 38, 40, 41, 43],
    },
    {
        id: 3,
        name: 'Onboarding Guide',
        monthlyRequests: [5, 7, 9, 8, 10, 11, 12, 13, 11, 14, 15, 16, 18, 17, 19, 20, 21, 20, 22, 23, 24, 25, 26, 24, 27, 28, 29, 30, 31, 32, 33],
    },
    {
        id: 4,
        name: 'Lead Qualifier',
        monthlyRequests: [4, 6, 5, 7, 8, 9, 11, 10, 12, 14, 13, 15, 16, 18, 17, 19, 20, 22, 21, 23, 24, 26, 25, 27, 28, 29, 30, 31, 29, 32, 34],
    },
].map((chatbot) => ({
    ...chatbot,
    monthlyRequests: chatbot.monthlyRequests.slice(0, daysInMonth),
}));

const totalChatbots = fakeChatbots.length;
const totalRequests = fakeChatbots.reduce(
    (sum, chatbot) =>
        sum +
        chatbot.monthlyRequests.reduce(
            (chatbotSum, requestCount) => chatbotSum + requestCount,
            0,
        ),
    0,
);

const topChatbot = fakeChatbots.reduce((best, chatbot) => {
    const bestCount = best.monthlyRequests.reduce((sum, count) => sum + count, 0);
    const chatbotCount = chatbot.monthlyRequests.reduce((sum, count) => sum + count, 0);

    return chatbotCount > bestCount ? chatbot : best;
});

const dailyLabels = Array.from({ length: daysInMonth }, (_, index) =>
    String(index + 1),
);

const dailyTotals = dailyLabels.map((_, index) =>
    fakeChatbots.reduce(
        (sum, chatbot) => sum + (chatbot.monthlyRequests[index] ?? 0),
        0,
    ),
);

const peakDayCount = Math.max(...dailyTotals);
const currentMonthLabel = now.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
});

function DashboardRequestChart() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }

        const chartConfig: ChartConfiguration<'line'> = {
            type: 'line',
            data: {
                labels: dailyLabels,
                datasets: [
                    {
                        label: 'Requests',
                        data: dailyTotals,
                        borderColor: '#171717',
                        backgroundColor: 'rgba(23, 23, 23, 0.08)',
                        fill: true,
                        tension: 0.32,
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: '#171717',
                        pointHoverBorderColor: '#ffffff',
                        pointHoverBorderWidth: 2,
                        borderWidth: 2,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        backgroundColor: '#171717',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        displayColors: false,
                        padding: 12,
                    },
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                        },
                        border: {
                            display: false,
                        },
                        ticks: {
                            color: '#737373',
                            maxTicksLimit: 8,
                        },
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(115, 115, 115, 0.12)',
                        },
                        border: {
                            display: false,
                        },
                        ticks: {
                            color: '#737373',
                            precision: 0,
                        },
                    },
                },
            },
        };

        const chart = new Chart(canvasRef.current, chartConfig);

        return () => {
            chart.destroy();
        };
    }, []);

    return (
        <div className="h-[320px] w-full md:h-[380px]">
            <canvas ref={canvasRef} />
        </div>
    );
}

export default function Dashboard() {
    const topChatbotRequests = topChatbot.monthlyRequests.reduce(
        (sum, count) => sum + count,
        0,
    );

    return (
        <>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-5 rounded-xl p-4 md:p-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Chatbot performance snapshot
                    </h1>
                </div>

                <div className="grid gap-4 xl:grid-cols-3">
                    <Card className="border-sidebar-border/70 bg-card/80">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0">
                            <div className="space-y-1">
                                <CardDescription>Total chatbots</CardDescription>
                                <CardTitle className="text-3xl">{totalChatbots}</CardTitle>
                            </div>
                            <div className="rounded-xl border border-border bg-background p-3">
                                <Bot className="size-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                        </CardContent>
                    </Card>

                    <Card className="border-sidebar-border/70 bg-card/80">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0">
                            <div className="space-y-1">
                                <CardDescription>Total requests</CardDescription>
                                <CardTitle className="text-3xl">
                                    {totalRequests.toLocaleString()}
                                </CardTitle>
                            </div>
                            <div className="rounded-xl border border-border bg-background p-3">
                                <MessageSquareMore className="size-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                        </CardContent>
                    </Card>

                    <Card className="border-sidebar-border/70 bg-card/80">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0">
                            <div className="space-y-1">
                                <CardDescription>Top chatbot</CardDescription>
                                <CardTitle className="text-2xl">
                                    {topChatbot.name}
                                </CardTitle>
                            </div>
                            <div className="rounded-xl border border-border bg-background p-3">
                                <TrendingUp className="size-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-sidebar-border/70 bg-card/80">
                    <CardHeader className="gap-4">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl">
                                    Monthly chatbot requests
                                </CardTitle>
                                <CardDescription>
                                    Daily request totals for all chatbots during{' '}
                                    {currentMonthLabel}.
                                </CardDescription>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3">
                                <div className="rounded-xl border border-border bg-background px-4 py-3">
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                        Peak day
                                    </p>
                                    <p className="mt-2 text-xl font-semibold">
                                        {peakDayCount}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-border bg-background px-4 py-3">
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                        Average / day
                                    </p>
                                    <p className="mt-2 text-xl font-semibold">
                                        {Math.round(totalRequests / daysInMonth)}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-border bg-background px-4 py-3">
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                        Top bot share
                                    </p>
                                    <p className="mt-2 text-xl font-semibold">
                                        {Math.round((topChatbotRequests / totalRequests) * 100)}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <DashboardRequestChart />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
