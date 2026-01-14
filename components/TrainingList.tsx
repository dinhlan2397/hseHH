
import React from 'react';
import { TrainingModule } from '../types';

const modules: TrainingModule[] = [
  {
    id: '1',
    title: 'An Toàn Làm Việc Trên Cao',
    description: 'Quy tắc sử dụng dây đai an toàn và thang công tác theo chuẩn OSHA.',
    icon: 'fa-building',
    category: 'Làm Việc Trên Cao',
    mediaType: 'url',
    mediaUrl: '',
    commitmentUrl: '',
    questions: [],
    // Fix: Using allowedUserIds as defined in TrainingModule type
    allowedUserIds: []
  },
  {
    id: '2',
    title: 'Phòng Cháy Chữa Cháy (PCCC)',
    description: 'Hướng dẫn sử dụng các loại bình chữa cháy và quy trình thoát hiểm.',
    icon: 'fa-fire-extinguisher',
    category: 'PCCC',
    mediaType: 'url',
    mediaUrl: '',
    commitmentUrl: '',
    questions: [],
    // Fix: Using allowedUserIds as defined in TrainingModule type
    allowedUserIds: []
  },
  {
    id: '3',
    title: 'An Toàn Điện Hạ Thế',
    description: 'Kiến thức về cách điện, tiếp địa và xử lý sự cố phóng điện.',
    icon: 'fa-bolt',
    category: 'Điện',
    mediaType: 'url',
    mediaUrl: '',
    commitmentUrl: '',
    questions: [],
    // Fix: Using allowedUserIds as defined in TrainingModule type
    allowedUserIds: []
  },
  {
    id: '4',
    title: 'Quản Lý Hóa Chất Nguy Hiểm',
    description: 'Cách đọc bảng MSDS và quy trình lưu kho an toàn.',
    icon: 'fa-flask',
    category: 'Hóa Chất',
    mediaType: 'url',
    mediaUrl: '',
    commitmentUrl: '',
    questions: [],
    // Fix: Using allowedUserIds as defined in TrainingModule type
    allowedUserIds: []
  },
  {
    id: '5',
    title: 'Sơ Cấp Cứu Cơ Bản',
    description: 'Kỹ năng hồi sức tim phổi (CPR) và xử lý vết thương hở.',
    icon: 'fa-heartbeat',
    category: 'An Toàn Chung',
    mediaType: 'url',
    mediaUrl: '',
    commitmentUrl: '',
    questions: [],
    // Fix: Using allowedUserIds as defined in TrainingModule type
    allowedUserIds: []
  },
  {
    id: '6',
    title: 'Bảo Trì An Toàn (LOTO)',
    description: 'Quy trình khóa nguồn năng lượng khi thực hiện bảo trì.',
    icon: 'fa-lock',
    category: 'An Toàn Chung',
    mediaType: 'url',
    mediaUrl: '',
    commitmentUrl: '',
    questions: [],
    // Fix: Using allowedUserIds as defined in TrainingModule type
    allowedUserIds: []
  }
];

export const TrainingList: React.FC = () => {
  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Thư Viện Huấn Luyện</h1>
          <p className="text-slate-500">Các khóa học được biên soạn bởi chuyên gia 30 năm kinh nghiệm.</p>
        </div>
        <div className="flex space-x-2">
          <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-bold border border-orange-200">
            {modules.length} Khóa học
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map(module => (
          <div key={module.id} className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-orange-300 hover:shadow-xl transition-all cursor-pointer relative overflow-hidden">
            <div className="bg-slate-50 w-14 h-14 rounded-xl flex items-center justify-center text-orange-600 mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
              <i className={`fas ${module.icon || 'fa-graduation-cap'} text-2xl`}></i>
            </div>
            <h3 className="text-xl font-bold mb-2 text-slate-800">{module.title}</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              {module.description}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded">
                {module.category || 'General'}
              </span>
              <button className="text-orange-600 font-bold flex items-center group-hover:translate-x-1 transition-transform">
                Bắt đầu <i className="fas fa-arrow-right ml-2 text-sm"></i>
              </button>
            </div>
            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <i className="fas fa-bookmark text-orange-200"></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
