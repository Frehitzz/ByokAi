import { Head } from '@inertiajs/react';
import { chatbots } from '@/routes';

export default function Chatbots() {
    return (
        <>
            <Head title="Chatbots" />

            <div className="flex h-full flex-1 flex-col gap-5 rounded-xl p-4 md:p-6">
                <div className="flex gap-2 space justify-between">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Chatbots
                    </h1>
                    <button>
                        Create +
                    </button>
                </div>

                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h3 className="text-2xl font-bold tracking-tight">
                            You have no chatbots
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            You can start managing your chatbots here.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

Chatbots.layout = {
    breadcrumbs: [
        {
            title: 'Chatbots',
            href: chatbots(),
        },
    ],
};
