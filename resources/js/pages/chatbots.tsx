import { Head } from '@inertiajs/react';
import {
    Bot,
    Globe,
    KeyRound,
    MessageSquareText,
    Plus,
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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
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
    providerOptions,
    savedProviderProfiles,
    type SavedProviderProfileId,
} from '@/lib/mock-ai-providers';
import { chatbots } from '@/routes';

const chatbotTemplates = [
    {
        id: 'faq',
        label: 'FAQ',
        description: 'Fast answers for common product and policy questions.',
        systemPrompt:
            'You are a concise FAQ assistant. Answer using the approved knowledge base, stay accurate, and ask a clarifying question when the request is ambiguous.',
    },
    {
        id: 'customer-support',
        label: 'Customer Support',
        description: 'Helpful support guidance with clear next steps.',
        systemPrompt:
            'You are a customer support assistant. Be calm, empathetic, and practical. Resolve issues step by step, summarize the answer clearly, and escalate when account-specific help is required.',
    },
    {
        id: 'lead-qualification',
        label: 'Lead Qualification',
        description: 'Collect intent, urgency, and contact fit signals.',
        systemPrompt:
            'You are a lead qualification assistant. Ask short, relevant follow-up questions, identify the visitor intent, and guide qualified leads toward booking or contact submission.',
    },
] as const;

type TemplateId = (typeof chatbotTemplates)[number]['id'];

type ChatbotCard = {
    id: number;
    name: string;
    templateLabel: string;
    providerNickname: string;
    providerLabel: string;
    domain: string;
    prompt: string;
};

type ChatbotFormState = {
    chatbotName: string;
    selectedTemplate: TemplateId;
    selectedProviderProfile: SavedProviderProfileId;
    systemPrompt: string;
    allowedDomain: string;
};

const defaultTemplate = chatbotTemplates[0];
const defaultProviderProfile = savedProviderProfiles[0];

function getDefaultFormState(): ChatbotFormState {
    return {
        chatbotName: '',
        selectedTemplate: defaultTemplate.id,
        selectedProviderProfile: defaultProviderProfile.id,
        systemPrompt: defaultTemplate.systemPrompt,
        allowedDomain: '',
    };
}

export default function Chatbots() {
    const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
    const [draft, setDraft] = useState(getDefaultFormState);
    const [createdChatbots, setCreatedChatbots] = useState<ChatbotCard[]>([]);

    const activeTemplate =
        chatbotTemplates.find((template) => template.id === draft.selectedTemplate) ??
        defaultTemplate;
    const activeProviderProfile = useMemo(
        () =>
            savedProviderProfiles.find(
                (providerProfile) => providerProfile.id === draft.selectedProviderProfile,
            ) ?? defaultProviderProfile,
        [draft.selectedProviderProfile],
    );
    const activeProvider = useMemo(
        () =>
            providerOptions.find(
                (provider) => provider.id === activeProviderProfile.providerId,
            ) ?? providerOptions[0],
        [activeProviderProfile.providerId],
    );

    useEffect(() => {
        const openDrawer = () => {
            setIsCreateDrawerOpen(true);
        };

        window.addEventListener('chatbots:create', openDrawer);

        return () => {
            window.removeEventListener('chatbots:create', openDrawer);
        };
    }, []);

    const handleTemplateChange = (templateId: TemplateId) => {
        const template =
            chatbotTemplates.find((item) => item.id === templateId) ?? defaultTemplate;

        setDraft((currentDraft) => ({
            ...currentDraft,
            selectedTemplate: templateId,
            systemPrompt: template.systemPrompt,
        }));
    };

    const openCreateModal = () => {
        setIsCreateDrawerOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateDrawerOpen(false);
    };

    const handleCreateChatbot = () => {
        setCreatedChatbots((currentChatbots) => [
            {
                id: Date.now(),
                name: draft.chatbotName || 'Untitled chatbot',
                templateLabel: activeTemplate.label,
                providerNickname: activeProviderProfile.nickname,
                providerLabel: activeProvider.label,
                domain: draft.allowedDomain || 'No domain added',
                prompt: draft.systemPrompt,
            },
            ...currentChatbots,
        ]);

        setDraft(getDefaultFormState());
        setIsCreateDrawerOpen(false);
    };

    return (
        <>
            <Head title="Chatbots" />

            <Sheet open={isCreateDrawerOpen} onOpenChange={setIsCreateDrawerOpen}>
                <div className="flex h-full flex-1 flex-col gap-5 rounded-xl p-4 md:p-6">
                    {createdChatbots.length === 0 ? (
                        <Card className="border-sidebar-border/70 bg-card/80">
                            <CardContent className="flex min-h-[420px] flex-col items-center justify-center gap-6 text-center">
                                <div className="rounded-2xl border border-dashed border-border bg-background p-4">
                                    <Bot className="size-8" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-semibold tracking-tight">
                                        Create your first chatbot
                                    </h2>
                                    <p className="max-w-md text-sm leading-6 text-muted-foreground">
                                        Start with a template, tune the system prompt, assign
                                        one of your saved providers, then lock it to an
                                        allowed domain.
                                    </p>
                                </div>
                                <Button type="button" size="lg" onClick={openCreateModal}>
                                    <Plus className="size-4" />
                                    Create chatbot
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 xl:grid-cols-2">
                            {createdChatbots.map((chatbot) => (
                                <Card
                                    key={chatbot.id}
                                    className="border-sidebar-border/70 bg-card/80"
                                >
                                    <CardHeader className="gap-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="space-y-1">
                                                <CardDescription>Configured chatbot</CardDescription>
                                                <CardTitle className="text-2xl">
                                                    {chatbot.name}
                                                </CardTitle>
                                            </div>
                                            <div className="rounded-xl border border-border bg-background p-3">
                                                <Bot className="size-5" />
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="grid gap-3">
                                        <div className="rounded-xl border border-border bg-background px-4 py-3">
                                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                                <MessageSquareText className="size-3.5" />
                                                Template
                                            </div>
                                            <p className="mt-2 text-sm font-medium">
                                                {chatbot.templateLabel}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-border bg-background px-4 py-3">
                                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                                <KeyRound className="size-3.5" />
                                                Assigned provider
                                            </div>
                                            <p className="mt-2 text-sm font-medium">
                                                {chatbot.providerNickname}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {chatbot.providerLabel}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-border bg-background px-4 py-3">
                                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                                <Globe className="size-3.5" />
                                                Allowed domain
                                            </div>
                                            <p className="mt-2 text-sm font-medium">
                                                {chatbot.domain}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl border border-dashed border-border bg-background/80 p-4">
                                            <p className="line-clamp-4 text-sm leading-6 text-muted-foreground">
                                                {chatbot.prompt}
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
                            Create chatbot
                        </SheetTitle>
                        <SheetDescription>
                            Fill in the chatbot details here. This is UI-only for now, so
                            saving will preview the chatbot on this page.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="grid gap-4 p-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.95fr)]">
                        <Card className="border-sidebar-border/70 bg-card/80">
                            <CardHeader className="gap-2">
                                <CardTitle className="text-xl">Core configuration</CardTitle>
                            </CardHeader>

                            <CardContent className="grid gap-6">
                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="chatbot-name">Chatbot name</Label>
                                        <Input
                                            id="chatbot-name"
                                            value={draft.chatbotName}
                                            onChange={(event) =>
                                                setDraft((currentDraft) => ({
                                                    ...currentDraft,
                                                    chatbotName: event.target.value,
                                                }))
                                            }
                                            placeholder="Support Concierge"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="template">Choose a template</Label>
                                        <Select
                                            value={draft.selectedTemplate}
                                            onValueChange={(value: TemplateId) =>
                                                handleTemplateChange(value)
                                            }
                                        >
                                            <SelectTrigger id="template" className="w-full">
                                                <SelectValue placeholder="Select a template" />
                                            </SelectTrigger>
                                            <SelectContent align="start">
                                                {chatbotTemplates.map((template) => (
                                                    <SelectItem
                                                        key={template.id}
                                                        value={template.id}
                                                    >
                                                        {template.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-[12px] text-muted-foreground">
                                            {activeTemplate.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="system-prompt">System prompt</Label>
                                    <textarea
                                        id="system-prompt"
                                        value={draft.systemPrompt}
                                        onChange={(event) =>
                                            setDraft((currentDraft) => ({
                                                ...currentDraft,
                                                systemPrompt: event.target.value,
                                            }))
                                        }
                                        rows={7}
                                        className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-36 w-full rounded-md border bg-transparent px-3 py-3 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px]"
                                        placeholder="Define how the assistant should behave."
                                    />
                                    <p className="text-[12px] text-muted-foreground">
                                        Starts with the selected template and can be customized
                                        per chatbot.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="saved-provider">Saved provider</Label>
                                    <Select
                                        value={draft.selectedProviderProfile}
                                        onValueChange={(value: SavedProviderProfileId) =>
                                            setDraft((currentDraft) => ({
                                                ...currentDraft,
                                                selectedProviderProfile: value,
                                            }))
                                        }
                                    >
                                        <SelectTrigger id="saved-provider" className="w-full">
                                            <SelectValue placeholder="Select a saved provider" />
                                        </SelectTrigger>
                                        <SelectContent align="start">
                                            {savedProviderProfiles.map((providerProfile) => (
                                                <SelectItem
                                                    key={providerProfile.id}
                                                    value={providerProfile.id}
                                                >
                                                    {providerProfile.nickname}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-[12px] text-muted-foreground">
                                        Choose one of the provider nicknames created on the AI
                                        Provider page.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="allowed-domain">Allowed domain</Label>
                                    <Input
                                        id="allowed-domain"
                                        value={draft.allowedDomain}
                                        onChange={(event) =>
                                            setDraft((currentDraft) => ({
                                                ...currentDraft,
                                                allowedDomain: event.target.value,
                                            }))
                                        }
                                        placeholder="app.example.com"
                                    />
                                    <p className="text-[12px] text-muted-foreground">
                                        Restrict where this chatbot can be embedded or loaded.
                                    </p>
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
                                                {draft.chatbotName || 'Untitled chatbot'}
                                            </CardTitle>
                                        </div>
                                        <div className="rounded-xl border border-border bg-background p-3">
                                            <Bot className="size-5" />
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="grid gap-3">
                                    <div className="rounded-xl border border-border bg-background px-4 py-3">
                                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                            <MessageSquareText className="size-3.5" />
                                            Template
                                        </div>
                                        <p className="mt-2 text-sm font-medium">
                                            {activeTemplate.label}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-border bg-background px-4 py-3">
                                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                            <KeyRound className="size-3.5" />
                                            Saved provider
                                        </div>
                                        <p className="mt-2 text-sm font-medium">
                                            {activeProviderProfile.nickname}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {activeProvider.label}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-border bg-background px-4 py-3">
                                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                            <Globe className="size-3.5" />
                                            Allowed domain
                                        </div>
                                        <p className="mt-2 text-sm font-medium">
                                            {draft.allowedDomain || 'No domain entered yet'}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-sidebar-border/70 bg-card/80">
                                <CardHeader>
                                    <CardTitle className="text-xl">Prompt direction</CardTitle>
                                    <CardDescription>
                                        A quick read on how the current setup will shape
                                        chatbot behavior.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-2xl border border-dashed border-border bg-background/80 p-4">
                                        <p className="text-sm leading-6 text-muted-foreground">
                                            {draft.systemPrompt}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <SheetFooter className="border-t px-6 py-5 sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" onClick={closeCreateModal}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleCreateChatbot}>
                            Save chatbot
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
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
    headerActions: (
        <Button
            type="button"
            size="lg"
            onClick={() => window.dispatchEvent(new Event('chatbots:create'))}
        >
            <Plus className="size-4" />
            Create
        </Button>
    ),
};
