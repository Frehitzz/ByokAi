import { Head } from '@inertiajs/react';
import {
    BadgeCheck,
    Globe,
    KeyRound,
    Layers3,
    Plus,
    ShieldCheck,
    TestTube2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    providerOptions,
    type ProviderOptionId,
} from '@/lib/mock-ai-providers';
import { aiProviders } from '@/routes';

type ConnectionStatus = 'idle' | 'success';

type ProviderFormState = {
    providerName: ProviderOptionId;
    nickname: string;
    apiKey: string;
};

type ProviderCard = {
    id: number;
    providerLabel: string;
    access: string;
    nickname: string;
    apiKeyPreview: string;
    connectionStatus: ConnectionStatus;
};

const defaultProvider = providerOptions[0];

function getDefaultFormState(): ProviderFormState {
    return {
        providerName: defaultProvider.id,
        nickname: '',
        apiKey: '',
    };
}

export default function AiProviders() {
    const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
    const [form, setForm] = useState(getDefaultFormState);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
    const [createdProviders, setCreatedProviders] = useState<ProviderCard[]>([]);

    const activeProvider = useMemo(
        () =>
            providerOptions.find((provider) => provider.id === form.providerName) ??
            defaultProvider,
        [form.providerName],
    );

    useEffect(() => {
        const openDrawer = () => {
            setIsCreateDrawerOpen(true);
        };

        window.addEventListener('ai-providers:create', openDrawer);

        return () => {
            window.removeEventListener('ai-providers:create', openDrawer);
        };
    }, []);

    const handleCreateProvider = () => {
        setCreatedProviders((currentProviders) => [
            {
                id: Date.now(),
                providerLabel: activeProvider.label,
                access: activeProvider.access,
                nickname: form.nickname || 'Unnamed provider',
                apiKeyPreview: form.apiKey ? 'Connected key added' : 'No key entered',
                connectionStatus,
            },
            ...currentProviders,
        ]);

        setForm(getDefaultFormState());
        setConnectionStatus('idle');
        setIsCreateDrawerOpen(false);
    };

    return (
        <>
            <Head title="AI Provider" />

            <Sheet open={isCreateDrawerOpen} onOpenChange={setIsCreateDrawerOpen}>
                <div className="flex h-full flex-1 flex-col gap-5 rounded-xl p-4 md:p-6">
                    {createdProviders.length === 0 ? (
                        <Card className="border-sidebar-border/70 bg-card/80">
                            <CardContent className="flex min-h-[420px] flex-col items-center justify-center gap-6 text-center">
                                <div className="rounded-2xl border border-dashed border-border bg-background p-4">
                                    <KeyRound className="size-8" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-semibold tracking-tight">
                                        Create AI providers to connect on your chatbot
                                    </h2>
                                    <p className="max-w-md text-sm leading-6 text-muted-foreground">
                                        Add a provider, give it a nickname for chatbot
                                        assignment, test the connection, and save the setup.
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    size="lg"
                                    onClick={() => setIsCreateDrawerOpen(true)}
                                >
                                    <Plus className="size-4" />
                                    Create provider
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 xl:grid-cols-2">
                            {createdProviders.map((provider) => (
                                <Card
                                    key={provider.id}
                                    className="border-sidebar-border/70 bg-card/80"
                                >
                                    <CardHeader className="gap-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="space-y-1">
                                                <CardDescription>Configured provider</CardDescription>
                                                <CardTitle className="text-2xl">
                                                    {provider.nickname}
                                                </CardTitle>
                                            </div>
                                            <div className="rounded-xl border border-border bg-background p-3">
                                                <KeyRound className="size-5" />
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="grid gap-3">
                                        <div className="rounded-xl border border-border bg-background px-4 py-3">
                                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                                <Layers3 className="size-3.5" />
                                                Provider
                                            </div>
                                            <p className="mt-2 text-sm font-medium">
                                                {provider.providerLabel}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-border bg-background px-4 py-3">
                                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                                <BadgeCheck className="size-3.5" />
                                                Access type
                                            </div>
                                            <p className="mt-2 text-sm font-medium">
                                                {provider.access}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-border bg-background px-4 py-3">
                                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                                <ShieldCheck className="size-3.5" />
                                                Connection state
                                            </div>
                                            <p className="mt-2 text-sm font-medium">
                                                {provider.connectionStatus === 'success'
                                                    ? 'Ready for chatbot assignment'
                                                    : 'Awaiting connection test'}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {provider.apiKeyPreview}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                <SheetContent
                    side="right"
                    className="w-full overflow-y-auto border-l p-0 sm:max-w-3xl"
                >
                    <SheetHeader className="space-y-2 border-b px-6 py-5 text-left">
                        <SheetTitle className="text-2xl">
                            Create AI provider
                        </SheetTitle>
                        <SheetDescription>
                            Fill in the provider details here. This is UI-only for now, so
                            saving will preview the provider on this page.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="grid gap-4 p-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.95fr)]">
                        <Card className="border-sidebar-border/70 bg-card/80">
                            <CardHeader className="gap-2">
                                <CardTitle className="text-xl">Provider setup</CardTitle>
                            </CardHeader>

                            <CardContent className="grid gap-6">
                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="provider-name">Provider name</Label>
                                        <Select
                                            value={form.providerName}
                                            onValueChange={(value: ProviderOptionId) => {
                                                setForm((currentForm) => ({
                                                    ...currentForm,
                                                    providerName: value,
                                                }));
                                                setConnectionStatus('idle');
                                            }}
                                        >
                                            <SelectTrigger id="provider-name" className="w-full">
                                                <SelectValue placeholder="Choose a provider" />
                                            </SelectTrigger>
                                            <SelectContent align="start">
                                                {providerOptions.map((provider) => (
                                                    <SelectItem
                                                        key={provider.id}
                                                        value={provider.id}
                                                    >
                                                        {provider.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-[12px] text-muted-foreground">
                                            {activeProvider.access} • {activeProvider.description}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="nickname">Nickname</Label>
                                        <Input
                                            id="nickname"
                                            value={form.nickname}
                                            onChange={(event) => {
                                                setForm((currentForm) => ({
                                                    ...currentForm,
                                                    nickname: event.target.value,
                                                }));
                                                setConnectionStatus('idle');
                                            }}
                                            placeholder="Portfolio chatbot"
                                        />
                                        <p className="text-[12px] text-muted-foreground">
                                            Use a nickname the chatbot page can show when this
                                            provider is assigned to one chatbot only.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="api-key">API key</Label>
                                    <Input
                                        id="api-key"
                                        type="password"
                                        value={form.apiKey}
                                        onChange={(event) => {
                                            setForm((currentForm) => ({
                                                ...currentForm,
                                                apiKey: event.target.value,
                                            }));
                                            setConnectionStatus('idle');
                                        }}
                                        placeholder="Paste provider API key"
                                    />
                                    <p className="text-[12px] text-muted-foreground">
                                        This field is visual only right now and does not save
                                        or validate any real credentials.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-dashed border-border bg-background/80 p-4">
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <TestTube2 className="size-4" />
                                                Test connection
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Run a mock connection check for the selected
                                                provider and the entered key.
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                            <div className="rounded-full border border-border bg-background px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                                {connectionStatus === 'success'
                                                    ? 'Connection healthy'
                                                    : 'Not tested'}
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setConnectionStatus('success')}
                                            >
                                                Test connection
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid gap-4">
                            <Card className="border-sidebar-border/70 bg-card/80">
                                <CardHeader className="gap-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="space-y-1">
                                            <CardDescription>Live summary</CardDescription>
                                            <CardTitle className="text-2xl">
                                                {form.nickname || 'Unnamed provider'}
                                            </CardTitle>
                                        </div>
                                        <div className="rounded-xl border border-border bg-background p-3">
                                            <KeyRound className="size-5" />
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="grid gap-3">
                                    <div className="rounded-xl border border-border bg-background px-4 py-3">
                                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                            <Layers3 className="size-3.5" />
                                            Provider
                                        </div>
                                        <p className="mt-2 text-sm font-medium">
                                            {activeProvider.label}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-border bg-background px-4 py-3">
                                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                            <BadgeCheck className="size-3.5" />
                                            Access type
                                        </div>
                                        <p className="mt-2 text-sm font-medium">
                                            {activeProvider.access}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-border bg-background px-4 py-3">
                                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                            <ShieldCheck className="size-3.5" />
                                            Connection state
                                        </div>
                                        <p className="mt-2 text-sm font-medium">
                                            {connectionStatus === 'success'
                                                ? 'Ready for chatbot assignment'
                                                : 'Awaiting connection test'}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-sidebar-border/70 bg-card/80">
                                <CardHeader>
                                    <CardTitle className="text-xl">Nickname usage</CardTitle>
                                    <CardDescription>
                                        This nickname is the label that can appear on the
                                        chatbot page when the provider is assigned to a
                                        specific bot.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-2xl border border-dashed border-border bg-background/80 p-4">
                                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                            <Globe className="size-3.5" />
                                            Chatbot-facing nickname
                                        </div>
                                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                            {form.nickname ||
                                                'Add a nickname to see how this provider will appear in chatbot setup.'}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <SheetFooter className="border-t px-6 py-5 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsCreateDrawerOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleCreateProvider}>
                            Save provider
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    );
}

AiProviders.layout = {
    breadcrumbs: [
        {
            title: 'AI Provider',
            href: aiProviders(),
        },
    ],
    headerActions: (
        <Button
            type="button"
            size="lg"
            onClick={() => window.dispatchEvent(new Event('ai-providers:create'))}
        >
            <Plus className="size-4" />
            Create
        </Button>
    ),
};
