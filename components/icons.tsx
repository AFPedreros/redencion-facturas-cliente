import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOffIcon,
  FileText,
  Loader2,
  MailWarning,
  MoreHorizontal,
  PenLine,
  PlusSquare,
  Receipt,
  Send,
  Trash,
  Upload,
  User,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  receipt: Receipt,
  spinner: Loader2,
  plusSquare: PlusSquare,
  eye: Eye,
  eyeClose: EyeOffIcon,
  arrowLeft: ChevronLeft,
  arrowRight: ChevronRight,
  fileText: FileText,
  mailWarning: MailWarning,
  user: User,
  send: Send,
  edit: PenLine,
  trash: Trash,
  camera: Camera,
  upload: Upload,
  dotsHorizontal: MoreHorizontal,
  facebook: ({ ...props }: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" {...props}>
      <path
        fill="currentColor"
        d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
      />
    </svg>
  ),
};
