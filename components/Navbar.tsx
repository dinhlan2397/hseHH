
import React from 'react';
import { UserRole } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  role: UserRole;
  onLogout: () => void;
  userName: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, role, onLogout, userName }) => {
  const allTabs = [
    { id: 'dashboard', label: 'Tổng Quan', icon: 'fa-chart-line', roles: ['admin'] },
    { id: 'training', label: 'Huấn Luyện', icon: 'fa-graduation-cap', roles: ['admin', 'user'] },
    { id: 'results', label: 'Kết Quả', icon: 'fa-file-signature', roles: ['admin'] },
    { id: 'quiz', label: 'Sổ Tay AI', icon: 'fa-book-medical', roles: ['admin', 'user'] },
    { id: 'risk', label: 'Rủi Ro', icon: 'fa-shield-alt', roles: ['admin', 'user'] },
    { id: 'admin', label: 'Thiết Lập', icon: 'fa-cog', roles: ['admin'] },
  ];

  const filteredTabs = allTabs.filter(tab => tab.roles.includes(role));

  return (
    <nav className="bg-white shadow-lg border-b border-slate-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center py-3 md:h-20 gap-4">
          <div className="flex items-center space-x-3 cursor-pointer group w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center space-x-3" onClick={() => setActiveTab(role === 'admin' ? 'dashboard' : 'training')}>
              <div className="bg-slate-900 p-2 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
                <i className="fas fa-hard-hat text-lg text-orange-500"></i>
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-800 uppercase">
                HSE <span className="text-orange-600">Hoàng Hà</span>
              </span>
            </div>
            <button onClick={onLogout} className="md:hidden text-slate-400 hover:text-red-500">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>

          <div className="flex space-x-1 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0 px-2 scroll-smooth">
            {filteredTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white font-bold shadow-md'
                    : 'text-slate-500 hover:bg-slate-50 font-bold'
                }`}
              >
                <i className={`fas ${tab.icon} text-xs ${activeTab === tab.id ? 'text-orange-500' : ''}`}></i>
                <span className="text-[10px] uppercase tracking-wider">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-4">
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">{userName}</p>
                <p className="text-[8px] font-bold text-orange-500 uppercase tracking-widest">{role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}</p>
             </div>
             <button 
              onClick={onLogout}
              className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-red-50 hover:text-red-500 text-slate-400 flex items-center justify-center transition-all border border-slate-100"
             >
                <i className="fas fa-power-off text-xs"></i>
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
