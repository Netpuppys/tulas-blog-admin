export interface ICategoryType {
  id: string;
  name: string;
  created_at: Date;
  postCount: number;
}

export interface IPostCategoryType {
  id: string;
  name: string;
  created_at: Date;
}

export interface IPostType {
  id: string;
  title: string;
  meta_title: string;
  banner_img: string;
  content: string;
  tags: string[];
  meta_keywords: string[];
  short_description: string;
  meta_description: string;
  author_name: string;
  slug: string;
  category_id: string;
  created_at: Date;
  category: IPostCategoryType;
}
