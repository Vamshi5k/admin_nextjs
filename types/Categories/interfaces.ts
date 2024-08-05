export interface ChildCategory {
    id: number;
    name: string;
    description: string;
}

export interface Subcategory {
    id: number;
    name: string;
    description: string;
    childCategories?: ChildCategory[];
}

export interface Category {
    id: number;
    name: string;
    subcategories?: Subcategory[];
}

export interface CategoriesData {
    categories: Category[];
}