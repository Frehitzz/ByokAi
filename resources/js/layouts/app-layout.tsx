import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    breadcrumbs = [],
    headerActions,
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    headerActions?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <AppLayoutTemplate
            breadcrumbs={breadcrumbs}
            headerActions={headerActions}
        >
            {children}
        </AppLayoutTemplate>
    );
}
