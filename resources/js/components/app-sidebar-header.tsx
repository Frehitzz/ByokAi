import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import type { ReactNode } from 'react';

export function AppSidebarHeader({
    breadcrumbs = [],
    headerActions,
}: {
    breadcrumbs?: BreadcrumbItemType[];
    headerActions?: ReactNode;
}) {
    const currentTitle = breadcrumbs[breadcrumbs.length - 1]?.title;

    return (
        <header className="border-b border-sidebar-border/50 px-6 py-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-auto md:px-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 items-start gap-2">
                    <SidebarTrigger className="-ml-1 mt-1" />
                    <div className="min-w-0">
                        {breadcrumbs.length > 1 && (
                            <div className="mb-1 text-sm text-muted-foreground">
                                <Breadcrumbs breadcrumbs={breadcrumbs} />
                            </div>
                        )}
                        {currentTitle && (
                            <h1 className="text-3xl font-semibold tracking-tight">
                                {currentTitle}
                            </h1>
                        )}
                    </div>
                </div>

                {headerActions && (
                    <div className="flex shrink-0 items-center gap-2">
                        {headerActions}
                    </div>
                )}
            </div>
        </header>
    );
}
