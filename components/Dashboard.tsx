
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrainingModule, TrainingResult } from '../types';

interface DashboardProps {
  onNavigate: (tab: any) => void;
  modules: TrainingModule[];
  results: TrainingResult[];
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, modules, results }) => {
  const totalStudents = Array.from(new Set(modules.flatMap(m => m.allowedStudents.map(s => s.cccd)))).length;
  const completedCount = results.length;
  const completionRate = totalStudents > 0 ? Math.round((completedCount / totalStudents) * 100) : 0;
  const totalHours = completedCount * 2; 

  const chartData = [
    { name: 'T2', complete: 4 },
    { name: 'T3', complete: 7 },
    { name: 'T4', complete: 5 },
    { name: 'T5', complete: 12 },
    { name: 'T6', complete: completedCount || 0 },
    { name: 'T7', complete: 2 },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Hệ Thống HSE Hoàng Hà</h1>
          <p className="text-slate-500 text-sm font-medium italic">"An toàn để sản xuất - Sản xuất phải an toàn"</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-2 shrink-0">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Real-time Sync</span>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <StatCard title="Giờ đào tạo" value={`${totalHours}h`} icon="fa-hourglass-half" color="bg-blue-600" />
        <StatCard title="Tỷ lệ đạt" value={`${completionRate}%`} icon="fa-chart-pie" color="bg-green-600" />
        <StatCard title="Hoàn thành" value={completedCount.toString()} icon="fa-user-graduate" color="bg-orange-600" />
        <StatCard title="Bài giảng" value={modules.length.toString()} icon="fa-book" color="bg-slate-900" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-white p-5 md:p-8 rounded-3xl md:rounded-[40px] shadow-sm border border-slate-100">
          <h3 className="text-sm md:text-lg font-black mb-6 flex items-center uppercase tracking-tight text-slate-800">
            <i className="fas fa-chart-bar mr-3 text-orange-600"></i>
            Tiến độ tuần hiện tại
          </h3>
          <div className="h-60 md:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800, fontSize: '12px'}}
                />
                <Bar dataKey="complete" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 4 ? '#ea580c' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-8 md:p-10 rounded-3xl md:rounded-[40px] shadow-xl flex flex-col justify-between overflow-hidden relative group">
          <div className="relative z-10">
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">CÔNG CỤ THÔNG MINH</span>
            <h3 className="text-xl md:text-2xl font-black mt-2 mb-4">Sổ Tay HSE AI</h3>
            <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed mb-8">Tra cứu nhanh quy chuẩn an toàn nội bộ dựa trên tệp PDF và NotebookLM của doanh nghiệp.</p>
            <button 
              onClick={() => onNavigate('quiz')}
              className="w-full bg-white text-slate-900 px-6 py-4 rounded-xl font-black text-xs hover:bg-orange-600 hover:text-white transition-all"
            >
              MỞ SỔ TAY AI <i className="fas fa-bolt ml-2 text-orange-500"></i>
            </button>
          </div>
          <i className="fas fa-robot absolute -bottom-8 -right-8 text-8xl opacity-5 transform rotate-12 transition-transform group-hover:rotate-0"></i>
        </div>
      </div>

      <section className="bg-white rounded-3xl md:rounded-[40px] shadow-sm border border-slate-100 p-6 md:p-10">
         <div className="flex justify-between items-center mb-8">
            <h3 className="text-base md:text-xl font-black uppercase tracking-tight text-slate-800">Hoạt động gần đây</h3>
            <button onClick={() => onNavigate('results')} className="text-orange-600 text-[10px] font-black uppercase tracking-widest border-b-2 border-orange-100 hover:border-orange-600 transition-all pb-1">Xem chi tiết</button>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {results.slice(-4).reverse().map((res, i) => {
              const module = modules.find(m => m.id === res.moduleId);
              return (
                <div key={i} className="flex items-center justify-between p-4 md:p-6 bg-slate-50 rounded-2xl md:rounded-3xl border border-transparent hover:border-slate-200 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white flex items-center justify-center border text-green-500 shrink-0 shadow-sm">
                      <i className="fas fa-check-circle text-lg"></i>
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-slate-800 text-xs md:text-sm truncate">{res.studentName || 'Học viên'}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate max-w-[120px] md:max-w-none">
                        {module?.title || 'Khóa học'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-lg text-[9px] font-black border border-green-200 block md:inline-block">
                      Đạt {Math.round(res.score)}%
                    </span>
                    <p className="text-[8px] text-slate-300 mt-1 font-bold">{new Date(res.completedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>
              );
            })}
            {results.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-300 font-bold italic border-2 border-dashed border-slate-100 rounded-3xl text-sm uppercase tracking-widest">
                Chưa có dữ liệu huấn luyện
              </div>
            )}
         </div>
      </section>
    </div>
  );
};

const StatCard: React.FC<{ title: string, value: string, icon: string, color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[32px] shadow-sm border border-slate-100 flex items-center space-x-3 md:space-x-5 hover:shadow-lg transition-all group overflow-hidden">
    <div className={`${color} text-white w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0`}>
      <i className={`fas ${icon} text-sm md:text-xl`}></i>
    </div>
    <div className="min-w-0">
      <p className="text-slate-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest truncate">{title}</p>
      <p className="text-base md:text-2xl font-black text-slate-900 tracking-tighter truncate">{value}</p>
    </div>
  </div>
);
