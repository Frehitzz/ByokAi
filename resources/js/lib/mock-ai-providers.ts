export const providerOptions = [
    {
        id: 'openai',
        label: 'OpenAI',
        access: 'Paid API key',
        description: 'Well-known GPT provider for production chat experiences.',
    },
    {
        id: 'google-gemini',
        label: 'Google Gemini',
        access: 'Free and paid API key',
        description: 'Flexible Gemini models with starter-friendly access tiers.',
    },
    {
        id: 'groq',
        label: 'Groq',
        access: 'Free and paid API key',
        description: 'Fast inference options with a developer-friendly entry point.',
    },
    {
        id: 'openrouter',
        label: 'OpenRouter',
        access: 'Free and paid API key',
        description: 'One API surface for working across multiple model providers.',
    },
    {
        id: 'anthropic',
        label: 'Anthropic',
        access: 'Paid API key',
        description: 'Claude models focused on high-quality reasoning and safety.',
    },
    {
        id: 'cohere',
        label: 'Cohere',
        access: 'Paid API key',
        description: 'Enterprise-friendly language models and embeddings.',
    },
] as const;

export type ProviderOptionId = (typeof providerOptions)[number]['id'];

export const savedProviderProfiles = [
    {
        id: 'portfolio-openai',
        providerId: 'openai',
        nickname: 'Portfolio chatbot',
        apiKeyPreview: 'sk-proj-••••••••',
    },
    {
        id: 'support-gemini',
        providerId: 'google-gemini',
        nickname: 'Customer support bot',
        apiKeyPreview: 'AIzaSy••••••••',
    },
    {
        id: 'landing-groq',
        providerId: 'groq',
        nickname: 'Landing page assistant',
        apiKeyPreview: 'gsk_••••••••',
    },
] as const;

export type SavedProviderProfileId = (typeof savedProviderProfiles)[number]['id'];
