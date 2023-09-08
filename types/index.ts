import { type FileWithPath } from "react-dropzone";

export type SidebarNavItem = {
  title: string;
  href: string;
  icon: string;
  disabled?: boolean;
};

export type FileWithPreview = FileWithPath & {
  preview: string;
};
