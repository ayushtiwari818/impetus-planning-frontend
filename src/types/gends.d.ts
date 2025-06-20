declare module 'gends' {
  import * as React from 'react';

  // Button component
  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    asChild?: boolean;
    appearance?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
    prefixIcon?: React.ReactNode;
    suffixIcon?: React.ReactNode;
    loading?: boolean;
  }
  export const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;

  // Text component
  export interface TextProps extends React.HTMLAttributes<HTMLElement> {
    variant?: 'headingLarge' | 'headingMedium' | 'headingSmall' | 'bodyLarge' | 'bodyMedium' | 'bodySmall' | 'labelLarge' | 'labelMedium' | 'labelSmall';
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  }
  export const Text: React.ForwardRefExoticComponent<TextProps & React.RefAttributes<HTMLElement>>;

  // IconButton component
  export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    appearance?: 'primary' | 'secondary' | 'danger' | 'ghost';
    'aria-label': string;
  }
  export const IconButton: React.ForwardRefExoticComponent<IconButtonProps & React.RefAttributes<HTMLButtonElement>>;

  // Badge component
  export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  }
  export const Badge: React.ForwardRefExoticComponent<BadgeProps & React.RefAttributes<HTMLDivElement>>;

  // DataTable component
  export interface DataTableProps {
    data: any[];
    columns: any[];
    enableSorting?: boolean;
    enableColumnFilters?: boolean;
    enableGlobalFilter?: boolean;
    enablePagination?: boolean;
    pageSize?: number;
    className?: string;
    loading?: boolean;
    enableRowSelection?: boolean;
    enableMultiRowSelection?: boolean;
    onRowSelectionChange?: (selectedRows: any[]) => void;
    selectedRowIds?: string[];
    pageIndex?: number;
    onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
    sorting?: any[];
    onSortingChange?: (sorting: any[]) => void;
    columnFilters?: any[];
    onColumnFiltersChange?: (filters: any[]) => void;
    globalFilter?: string;
    onGlobalFilterChange?: (filter: string) => void;
    globalFilterPlaceholder?: string;
    enableVirtualization?: boolean;
    estimateRowHeight?: number;
    emptyStateMessage?: string;
    emptyStateDescription?: string;
  }
  export const DataTable: React.FC<DataTableProps>;

  // Input component
  export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    prefixIcon?: React.ReactNode;
    suffixIcon?: React.ReactNode;
    variant?: 'default' | 'filled' | 'outlined';
  }
  export const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;

  // DropdownOption type definition
  export type DropdownOption = {
    id: number | string;
    label: string;
    icon?: JSX.Element;
    type?: string;
    helpText?: string;
    groupId?: string | number;
    disabled?: boolean;
  }

  // DropdownGroup type definition
  export type DropdownGroup = {
    id: string | number;
    label?: string;
  }

  // DropdownClassNames type definition
  export type DropdownClassNames = {
    popoverContainerClasses?: string;
    popoverTriggerClasses?: string;
    popoverContentClasses?: string;
    scrollAreaClasses?: string;
    footerClasses?: string;
    inputSearchClasses?: string;
    itemClasses?: string;
  };

  // Dropdown component
  export interface DropdownProps {
    options: DropdownOption[];
    value?: string | number;
    onChange?: (option: DropdownOption) => void;
    placeholder?: string;
    className?: string;
    searchable?: boolean;
    clearable?: boolean;
    label?: string;
    disabled?: boolean;
    groups?: DropdownGroup[];
    classNames?: DropdownClassNames;
  }
  export const Dropdown: React.FC<DropdownProps>;

  // TitleBar component
  export interface TitleBarProps {
    title: string;
    subtitle?: string;
    breadcrumbs?: Array<{ label: string; href?: string }>;
    actions?: React.ReactNode;
  }
  export const TitleBar: React.FC<TitleBarProps>;

  // Pagination component
  export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showPageSizeSelector?: boolean;
    pageSizeOptions?: number[];
    pageSize?: number;
    onPageSizeChange?: (size: number) => void;
    totalItems?: number;
  }
  export const Pagination: React.FC<PaginationProps>;

  // Export all other components as any for now
  export const Accordion: any;
  export const Avatar: any;
  export const Calendar: any;
  export const Carousel: any;
  export const Checkbox: any;
  export const DatePicker: any;
  export const FileUpload: any;
  export const FilterPill: any;
  export const FilterPills: any;
  export const BadgeTab: any;
  export const Modal: any;
  
  // Icons (sample - there are many more)
  export const IcAdd: any;
  export const IcEdit: any;
  export const IcDelete: any;
  export const IcSearch: any;
  export const IcDownload: any;
  export const IcUpload: any;
  export const IcFilter: any;
  export const IcClear: any;
} 