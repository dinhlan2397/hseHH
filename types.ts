
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export type UserRole = 'admin' | 'user';
export type Gender = 'Nam' | 'Nữ' | 'Khác';

export interface User {
  id: string;
  username: string; // ID đăng nhập
  password?: string;
  passwordLevel2?: string; // Mật khẩu cấp 2 (Mã bảo mật)
  fullName: string;
  birthYear: string;
  cccd: string;
  gender: Gender;
  phone: string;
  position: string;
  company: string;
  role: UserRole;
  isFirstLogin: boolean; // Trạng thái bắt buộc cập nhật thông tin
}

export interface HSESource {
  id: string;
  name: string;
  type: 'url' | 'file';
  path: string; // URL hoặc tên file
  content?: string; // Nội dung giả lập nếu là file
  isActive: boolean;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  mediaType: 'file' | 'url';
  mediaUrl: string; 
  commitmentUrl: string;
  questions: QuizQuestion[];
  allowedUserIds: string[];
  icon?: string;
  category?: string;
}

export interface TrainingResult {
  userId: string;
  studentName: string;
  moduleId: string;
  score: number;
  completedAt: string;
}
