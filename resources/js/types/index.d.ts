import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    ip: string;
    // quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    is_admin: boolean;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Poll {
    id: number;
    title: string;
    slug: string;
    description?: string;
    options: PollOption[];
    votes: PollVote[];
    own_vote: PollVote;
    own_vote_id: number;
    result_visible: boolean;
    withdrawable: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface PollOption {
    id: number;
    poll_id: number;
    vote_count: number;
    label: string;
    votes: PollVote[];
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface PollVote {
    id: number;
    poll_id: number;
    poll: Poll;
    option: PollOption;
    poll_option_id: number;
    user_id: number;
    ip_address: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface SimplePaginate<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    next_page_url: string;
    path: string;
    per_page: number;
    prev_page_url: string;
    to: number;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginationMeta {
    current_page: number;
    from: number;
    to: number;
    total: number;
    per_page: number;
    last_page: number;
}
