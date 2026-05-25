import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Bot,
    KeyRound,
    MessageSquareText,
    ShieldCheck,
} from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { home, login, register } from '@/routes';

const setupSteps = [
    {
        title: 'Bring your API key',
        description:
            'Stay in control of provider access, billing, and model usage by connecting your own key.',
        icon: KeyRound,
    },
    {
        title: 'Paste the generated code',
        description:
            'Use the code produced by ByokAi as the integration layer for your chatbot inside your app.',
        icon: MessageSquareText,
    },
    {
        title: 'Launch your chatbot',
        description:
            'Move from setup to a working assistant experience without rebuilding the entire chat foundation.',
        icon: Bot,
    },
];

const overviewItems = [
    'Built for users who want to own their chatbot setup.',
    'Homepage first, dashboard experience next.',
    'Simple black-and-white UI aligned with auth screens.',
];

const statusPanels = [
    {
        label: 'Project title',
        value: 'ByokAi',
        note: 'Bring Your Own Apikey',
    },
    {
        label: 'Current priority',
        value: 'Landing + auth entry UI',
        note: 'Dashboard UI is being shaped from the homepage outward.',
    },
    {
        label: 'Integration model',
        value: 'Own key + generated code',
        note: 'Users configure the key first, then paste the supplied code.',
    },
];

export default function Welcome() {
    return (
        <>
            <Head title="ByokAi" />

            <div className="min-h-svh bg-background text-foreground">
                <div className="mx-auto flex min-h-svh w-full max-w-7xl flex-col px-6 py-6 md:px-10">
                    <header className="animate-in fade-in slide-in-from-top-3 flex items-center justify-between border-b border-border pb-5 duration-500">
                        <Link
                            href={home()}
                            className="flex items-center gap-3 font-medium"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card">
                                <AppLogoIcon className="size-8 fill-current text-[var(--foreground)] dark:text-white" />
                            </div>
                            <div className="leading-none">
                                <p className="text-sm font-medium">ByokAi</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Bring Your Own Apikey
                                </p>
                            </div>
                        </Link>

                        <div className="flex items-center gap-3">
                            <Button asChild variant="ghost" className="rounded-md">
                                <Link href={login()}>Login</Link>
                            </Button>
                            <Button asChild className="rounded-md">
                                <Link href={register()}>Register</Link>
                            </Button>
                        </div>
                    </header>

                    <main className="flex flex-1 items-center py-8 md:py-12">
                        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1.2fr)_380px]">
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid gap-6 lg:grid-cols-[90px_minmax(0,1fr)]">
                                    <div className="hidden lg:flex">
                                        <div className="flex w-full flex-col justify-between border-r border-border pr-4">
                                            <span className="text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
                                                01
                                            </span>
                                            <span className="[writing-mode:vertical-rl] rotate-180 text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
                                                Intro
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
                                            <ShieldCheck className="size-3.5" />
                                            Black and white landing experience
                                        </div>

                                        <div className="space-y-5">
                                            <h1 className="max-w-4xl text-5xl font-medium tracking-[-0.05em] text-balance sm:text-6xl lg:text-7xl">
                                                Bring your own key. Paste the
                                                code. Launch your own chatbot.
                                            </h1>
                                            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                                                ByokAi is a focused setup system
                                                for users who want to create a
                                                chatbot with their own API key and
                                                integrate the code generated by
                                                the platform into their own
                                                product.
                                            </p>
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
                                            <div className="rounded-xl border border-border bg-card p-5">
                                                <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                                                    Project overview
                                                </p>
                                                <div className="mt-4 space-y-3">
                                                    {overviewItems.map((item) => (
                                                        <div
                                                            key={item}
                                                            className="border-b border-border pb-3 text-sm leading-6 text-foreground last:border-b-0 last:pb-0"
                                                        >
                                                            {item}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="rounded-xl border border-border bg-card p-5">
                                                <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                                                    Entry
                                                </p>
                                                <div className="mt-4 flex flex-col gap-3">
                                                    <Button asChild size="lg" className="w-full rounded-md">
                                                        <Link
                                                            href={register()}
                                                            className="inline-flex items-center justify-center gap-2"
                                                        >
                                                            Register
                                                            <ArrowRight className="size-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        asChild
                                                        size="lg"
                                                        variant="outline"
                                                        className="w-full rounded-md"
                                                    >
                                                        <Link href={login()}>Login</Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-[1.25rem] border border-border bg-card p-4 sm:p-5">
                                            <div className="flex items-center justify-between border-b border-border pb-3">
                                                <p className="text-sm font-medium">
                                                    Setup path
                                                </p>
                                                <span className="text-xs text-muted-foreground">
                                                    3 steps
                                                </span>
                                            </div>

                                            <div className="mt-4 grid gap-3">
                                                {setupSteps.map((step, index) => {
                                                    const Icon = step.icon;

                                                    return (
                                                        <div
                                                            key={step.title}
                                                            className="group grid gap-3 rounded-xl border border-border bg-background p-4 transition-transform duration-300 hover:-translate-y-0.5 sm:grid-cols-[52px_minmax(0,1fr)]"
                                                        >
                                                            <div className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-card">
                                                                <Icon className="size-4" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">
                                                                    Step {index + 1}
                                                                </p>
                                                                <h2 className="mt-2 text-base font-medium">
                                                                    {step.title}
                                                                </h2>
                                                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                                                    {step.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <aside className="animate-in fade-in slide-in-from-bottom-5 duration-500">
                                <div className="flex h-full flex-col rounded-[1.5rem] border border-border bg-card">
                                    <div className="border-b border-border p-5">
                                        <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                                            Dashboard preview
                                        </p>
                                        <h2 className="mt-3 text-2xl font-medium tracking-tight">
                                            Homepage first. Product direction clear.
                                        </h2>
                                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                            This screen introduces the system before
                                            users move into login, registration, and
                                            later dashboard actions.
                                        </p>
                                    </div>

                                    <div className="flex flex-1 flex-col gap-3 p-5">
                                        {statusPanels.map((panel) => (
                                            <div
                                                key={panel.label}
                                                className="rounded-xl border border-border bg-background p-4"
                                            >
                                                <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">
                                                    {panel.label}
                                                </p>
                                                <p className="mt-2 text-base font-medium text-foreground">
                                                    {panel.value}
                                                </p>
                                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                                    {panel.note}
                                                </p>
                                            </div>
                                        ))}

                                        <div className="mt-auto rounded-xl border border-border bg-background p-4">
                                            <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">
                                                About this project
                                            </p>
                                            <p className="mt-3 text-sm leading-7 text-muted-foreground">
                                                The goal is to let a user create
                                                their own chatbot by configuring an
                                                API key and then integrating the
                                                code provided by ByokAi into their
                                                application.
                                            </p>
                                            <p className="mt-4 text-sm leading-7 text-muted-foreground">
                                                Login and register remain UI entry
                                                points for now while the broader
                                                dashboard experience is built out.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </main>

                    <footer className="animate-in fade-in duration-500">
                        <div className="flex flex-col gap-2 border-t border-border pt-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                            <p>ByokAi helps users launch chatbots with their own API keys.</p>
                            <TextLink href={register()}>Create your account</TextLink>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}
