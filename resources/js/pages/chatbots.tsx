import { Head } from '@inertiajs/react';
import {
    Bot,
    Globe,
    MessageSquareText,
    Orbit,
    Plus,
    Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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

const providerModels = {
    gemini: ['Gemini 2.5 Flash', 'Gemini 2.5 Pro'],
    gpt: ['GPT-4.1 mini', 'GPT-4.1', 'GPT-4o'],
} as const;

type TemplateId = (typeof chatbotTemplates)[number]['id'];
type ProviderId = keyof typeof providerModels;
type ProviderModel = (typeof providerModels)[ProviderId][number];

type ChatbotCard = {
    id: number;
    name: string;
    templateLabel: string;
    providerLabel: string;
    model: string;
    domain: string;
    prompt: string;
};

type ChatbotFormState = {
    chatbotName: string;
    selectedTemplate: TemplateId;
    selectedProvider: ProviderId;
    selectedModel: ProviderModel;
    systemPrompt: string;
    allowedDomain: string;
};

const defaultTemplate = chatbotTemplates[0];
const defaultProvider: ProviderId = 'gpt';

function getDefaultFormState(): ChatbotFormState {
    return {
        chatbotName: '',
        selectedTemplate: defaultTemplate.id,
        selectedProvider: defaultProvider,
        selectedModel: providerModels[defaultProvider][0],
        systemPrompt: defaultTemplate.systemPrompt,
        allowedDomain: '',
    };
}

export default function Chatbots() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [draft, setDraft] = useState(getDefaultFormState);
    const [createdChatbots, setCreatedChatbots] = useState<ChatbotCard[]>([]);

    const activeTemplate =
        chatbotTemplates.find((template) => template.id === draft.selectedTemplate) ??
        defaultTemplate;
    const availableModels = providerModels[draft.selectedProvider];

    const handleTemplateChange = (templateId: TemplateId) => {
        const template =
            chatbotTemplates.find((item) => item.id === templateId) ?? defaultTemplate;

        setDraft((currentDraft) => ({
            ...currentDraft,
            selectedTemplate: templateId,
            systemPrompt: template.systemPrompt,
        }));
    };

    const handleProviderChange = (provider: ProviderId) => {
        setDraft((currentDraft) => ({
            ...currentDraft,
            selectedProvider: provider,
            selectedModel: providerModels[provider][0],
        }));
    };

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const handleCreateChatbot = () => {
        setCreatedChatbots((currentChatbots) => [
            {
                id: Date.now(),
                name: draft.chatbotName || 'Untitled chatbot',
                templateLabel: activeTemplate.label,
                providerLabel: draft.selectedProvider.toUpperCase(),
                model: draft.selectedModel,
                domain: draft.allowedDomain || 'No domain added',
                prompt: draft.systemPrompt,
            },
            ...currentChatbots,
        ]);

        setDraft(getDefaultFormState());
        setIsCreateModalOpen(false);
    };

    return (
        <>
            <Head title="Chatbots" />

            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <div className="flex h-full flex-1 flex-col gap-5 rounded-xl p-4 md:p-6">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                        <div className="space-y-2">
                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                                <Sparkles className="size-3.5" />
                                Chatbot Builder
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-3xl font-semibold tracking-tight">
                                    Chatbots
                                </h1>
                                <p className="max-w-2xl text-sm text-muted-foreground">
                                    Create and preview chatbot setups that follow the same
                                    visual system as the rest of your workspace.
                                </p>
                            </div>
                        </div>

                        <Button type="button" size="lg" onClick={openCreateModal}>
                            <Plus className="size-4" />
                            Create
                        </Button>
                    </div>

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
                                        Start with a template, tune the system prompt, choose
                                        a provider and model, then lock it to an allowed
                                        domain.
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
                                                <Orbit className="size-3.5" />
                                                AI stack
                                            </div>
                                            <p className="mt-2 text-sm font-medium">
                                                {chatbot.providerLabel} / {chatbot.model}
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

                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
                    <DialogHeader className="space-y-2">
                        <DialogTitle className="text-2xl">
                            Create chatbot
                        </DialogTitle>
                        <DialogDescription>
                            Fill in the chatbot details here. This is UI-only for now, so
                            saving will preview the chatbot on this page.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.95fr)]">
                        <Card className="border-sidebar-border/70 bg-card/80">
                            <CardHeader className="gap-2">
                                <CardTitle className="text-xl">Core configuration</CardTitle>
                                <CardDescription>
                                    Define the chatbot identity, behavior, model choice, and
                                    website access scope.
                                </CardDescription>
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
                                        <p className="text-sm text-muted-foreground">
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
                                    <p className="text-sm text-muted-foreground">
                                        Starts with the selected template and can be customized
                                        per chatbot.
                                    </p>
                                </div>

                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="provider">AI provider</Label>
                                        <Select
                                            value={draft.selectedProvider}
                                            onValueChange={(value: ProviderId) =>
                                                handleProviderChange(value)
                                            }
                                        >
                                            <SelectTrigger id="provider" className="w-full">
                                                <SelectValue placeholder="Select a provider" />
                                            </SelectTrigger>
                                            <SelectContent align="start">
                                                <SelectItem value="gpt">GPT</SelectItem>
                                                <SelectItem value="gemini">Gemini</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="model">Model</Label>
                                        <Select
                                            value={draft.selectedModel}
                                            onValueChange={(value: ProviderModel) =>
                                                setDraft((currentDraft) => ({
                                                    ...currentDraft,
                                                    selectedModel: value,
                                                }))
                                            }
                                        >
                                            <SelectTrigger id="model" className="w-full">
                                                <SelectValue placeholder="Select a model" />
                                            </SelectTrigger>
                                            <SelectContent align="start">
                                                {availableModels.map((model) => (
                                                    <SelectItem key={model} value={model}>
                                                        {model}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
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
                                    <p className="text-sm text-muted-foreground">
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
                                            <Orbit className="size-3.5" />
                                            AI stack
                                        </div>
                                        <p className="mt-2 text-sm font-medium">
                                            {draft.selectedProvider.toUpperCase()} /{' '}
                                            {draft.selectedModel}
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

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={closeCreateModal}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleCreateChatbot}>
                            Save chatbot
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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
