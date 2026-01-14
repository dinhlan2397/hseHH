
import React from 'react';
import { TrainingResult, TrainingModule } from '../types';

interface TrainingResultsListProps {
  results: TrainingResult[];
  modules: TrainingModule[];
}

export const TrainingResultsList: React.FC<TrainingResultsListProps> = ({ results, modules }) => {
  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 md:p-10 rounded-3xl md:rounded-[40px] shadow-sm border border-slate-100 gap-4 text-center md:text-left">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter">Báo Cáo Đào Tạo</h2>
          <p className="text-xs md:text-sm text-slate-400 font-black uppercase tracking-widest mt-1">Lịch sử hoàn thành huấn luyện</p>
        </div>
        <button className="w-full md:w-auto bg-orange-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg text-xs uppercase">
          XUẤT DỮ LIỆU
        </button>
      </div>

      <div className="block md:hidden space-y-4">
        {results.slice().reverse().map((res, i) => {
           const module = modules.find(m => m.id === res.moduleId);
           return (
             <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                <div className={`absolute top-0 right-0 px-4 py-1 text-[8px] font-black uppercase ${res.score >= 90 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {res.score >= 90 ? 'ĐẠT' : 'CHƯA ĐẠT'}
                </div>
                <h4 className="font-black text-slate-900">{res.studentName}</h4>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Mã: {res.studentCccd}</p>
                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-end">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Khóa học</p>
                    <p className="text-xs font-bold text-slate-700 truncate max-w-[180px]">{module?.title || 'Đã xóa'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-orange-600">{res.score}%</p>
                    <p className="text-[8px] text-slate-300 font-bold">{new Date(res.completedAt).toLocaleDateString()}</p>
                  </div>
                </div>
             </div>
           );
        })}
      </div>

      <div className="hidden md:block bg-white rounded-[40px] shadow-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-[10px] uppercase tracking-[0.2em]">
                <th className="p-6 font-black">Học viên</th>
                <th className="p-6 font-black">CCCD</th>
                <th className="p-6 font-black">Khóa Huấn Luyện</th>
                <th className="p-6 font-black text-center">Kết Quả</th>
                <th className="p-6 font-black">Thời Gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {results.slice().reverse().map((res, idx) => {
                const module = modules.find(m => m.id === res.moduleId);
                return (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-6 font-black text-slate-900">{res.studentName}</td>
                    <td className="p-6 font-mono font-bold text-slate-500">{res.studentCccd}</td>
                    <td className="p-6 font-bold text-slate-700">{module?.title || 'Đã xóa'}</td>
                    <td className="p-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase ${res.score >= 90 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {Math.round(res.score)}% - {res.score >= 90 ? 'ĐẠT' : 'KHÔNG'}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="text-xs font-bold text-slate-600">{new Date(res.completedAt).toLocaleDateString('vi-VN')}</div>
                      <div className="text-[9px] text-slate-300 font-black">{new Date(res.completedAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {results.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100 text-slate-300 font-black uppercase text-xs">
          Chưa ghi nhận kết quả
        </div>
      )}
    </div>
  );
};
