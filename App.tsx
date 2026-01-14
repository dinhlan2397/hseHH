
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AIQuiz } from './components/AIQuiz';
import { RiskAnalyzer } from './components/RiskAnalyzer';
import { Dashboard } from './components/Dashboard';
import { AdminPanel } from './components/AdminPanel';
import { StudentPlayer } from './components/StudentPlayer';
import { TrainingResultsList } from './components/TrainingResultsList';
import { UserProfile } from './components/UserProfile';
import { TrainingModule, User, TrainingResult } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showForgot, setShowForgot] = useState(false);
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [users, setUsers] = useState<User[]>([
    { 
      id: 'admin-001', 
      username: 'admin',
      password: 'admin123',
      passwordLevel2: '0306',
      fullName: 'Admin Hoàng Hà', 
      cccd: '000000000', 
      birthYear: '1980', 
      gender: 'Nam', 
      phone: '0988888888', 
      position: 'Giám đốc HSE', 
      company: 'HSE Hoàng Hà', 
      role: 'admin',
      isFirstLogin: false
    }
  ]);
  const [results, setResults] = useState<TrainingResult[]>([]);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [forgotForm, setForgotForm] = useState({ username: '', level2: '', newPass: '', confirmPass: '' });
  const [currentModuleForPlay, setCurrentModuleForPlay] = useState<TrainingModule | null>(null);

  useEffect(() => {
    const savedModules = localStorage.getItem('hh_modules');
    if (savedModules) setModules(JSON.parse(savedModules));
    
    const savedUsers = localStorage.getItem('hh_users');
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    
    const savedResults = localStorage.getItem('hh_results');
    if (savedResults) setResults(JSON.parse(savedResults));

    const savedUser = localStorage.getItem('hh_current_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setActiveTab(user.role === 'admin' ? 'dashboard' : 'training');
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === loginForm.username && u.password === loginForm.password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('hh_current_user', JSON.stringify(user));
      if (user.isFirstLogin) {
        setActiveTab('profile');
      } else {
        setActiveTab(user.role === 'admin' ? 'dashboard' : 'training');
      }
    } else {
      alert("ID hoặc mật khẩu không chính xác.");
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotForm.newPass !== forgotForm.confirmPass) return alert("Mật khẩu mới không khớp.");
    
    const userIdx = users.findIndex(u => u.username === forgotForm.username && u.passwordLevel2 === forgotForm.level2);
    if (userIdx > -1) {
      const newUsers = [...users];
      newUsers[userIdx].password = forgotForm.newPass;
      setUsers(newUsers);
      localStorage.setItem('hh_users', JSON.stringify(newUsers));
      alert("Đổi mật khẩu thành công! Hãy đăng nhập lại.");
      setShowForgot(false);
      setForgotForm({ username: '', level2: '', newPass: '', confirmPass: '' });
    } else {
      alert("Thông tin xác thực (ID hoặc MK cấp 2) không chính xác.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('hh_current_user');
    setLoginForm({ username: '', password: '' });
  };

  const handleUpdateProfile = (updatedUser: User) => {
    const newUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(newUsers);
    setCurrentUser(updatedUser);
    localStorage.setItem('hh_users', JSON.stringify(newUsers));
    localStorage.setItem('hh_current_user', JSON.stringify(updatedUser));
    alert("Cập nhật thông tin thành công!");
    if (!updatedUser.isFirstLogin) setActiveTab('training');
  };

  const handleSaveModule = (module: TrainingModule) => {
    const updated = modules.some(m => m.id === module.id) 
      ? modules.map(m => m.id === module.id ? module : m)
      : [...modules, module];
    setModules(updated);
    localStorage.setItem('hh_modules', JSON.stringify(updated));
    alert("Cập nhật khóa học thành công!");
    setActiveTab('training');
  };

  const handleSaveUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem('hh_users', JSON.stringify(newUsers));
  };

  const onTrainingFinish = (score: number) => {
    if (!currentUser || !currentModuleForPlay) return;
    const result: TrainingResult = {
      userId: currentUser.id,
      studentName: currentUser.fullName,
      moduleId: currentModuleForPlay.id,
      score,
      completedAt: new Date().toISOString()
    };
    const updatedResults = [...results, result];
    setResults(updatedResults);
    localStorage.setItem('hh_results', JSON.stringify(updatedResults));
    setCurrentModuleForPlay(null);
    setActiveTab('training');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-200 animate-slideUp">
          <div className="bg-slate-900 p-10 text-center">
            <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <i className="fas fa-hard-hat text-2xl text-white"></i>
            </div>
            <h1 className="text-xl font-black text-white uppercase tracking-tighter">HSE HOÀNG HÀ</h1>
            <p className="text-slate-500 text-[8px] font-bold uppercase tracking-[0.3em] mt-2">Safety Training System</p>
          </div>
          
          {!showForgot ? (
            <form onSubmit={handleLogin} className="p-10 space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">ID Tài khoản</label>
                <input 
                  type="text" required
                  className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 font-black focus:border-slate-900 outline-none transition-all shadow-sm"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Mật khẩu</label>
                <input 
                  type="password" required
                  className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 font-black focus:border-slate-900 outline-none transition-all shadow-sm"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm hover:bg-orange-600 transition-all uppercase tracking-widest shadow-xl">
                ĐĂNG NHẬP HỆ THỐNG
              </button>
              <div className="text-center pt-2">
                <button type="button" onClick={() => setShowForgot(true)} className="text-[10px] font-black text-slate-400 hover:text-orange-600 uppercase tracking-widest">
                  Quên mật khẩu? Click vào đây
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleForgot} className="p-10 space-y-4 animate-fadeIn">
              <h2 className="text-center font-black text-slate-900 uppercase text-xs mb-6 tracking-widest border-b pb-4">Khôi phục mật khẩu</h2>
              <input 
                type="text" placeholder="ID tài khoản..." required
                className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-black text-slate-900 outline-none"
                value={forgotForm.username} onChange={e => setForgotForm({...forgotForm, username: e.target.value})}
              />
              <input 
                type="password" placeholder="Mã bảo mật (Cấp 2)..." required
                className="w-full p-4 bg-white border-2 border-orange-500 rounded-2xl text-sm font-black text-orange-600 outline-none"
                value={forgotForm.level2} onChange={e => setForgotForm({...forgotForm, level2: e.target.value})}
              />
              <input 
                type="password" placeholder="Mật khẩu mới..." required
                className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-black text-slate-900 outline-none"
                value={forgotForm.newPass} onChange={e => setForgotForm({...forgotForm, newPass: e.target.value})}
              />
              <input 
                type="password" placeholder="Xác nhận mật khẩu mới..." required
                className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-black text-slate-900 outline-none"
                value={forgotForm.confirmPass} onChange={e => setForgotForm({...forgotForm, confirmPass: e.target.value})}
              />
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-orange-600">
                XÁC NHẬN ĐỔI MẬT KHẨU
              </button>
              <button type="button" onClick={() => setShowForgot(false)} className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2">
                Quay lại màn hình đăng nhập
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 overflow-x-hidden pb-10">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        role={currentUser.role} 
        userName={currentUser.fullName}
        onLogout={handleLogout}
      />
      
      <main className="flex-grow container mx-auto px-4 py-6 md:py-10">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'profile' && (
            <UserProfile 
              user={currentUser} 
              onUpdate={handleUpdateProfile} 
            />
          )}

          {activeTab === 'dashboard' && currentUser.role === 'admin' && (
            <Dashboard onNavigate={setActiveTab} modules={modules} results={results} />
          )}
          
          {activeTab === 'training' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 md:p-10 rounded-[40px] shadow-sm border border-slate-200 gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter">Bài Giảng HSE</h2>
                  <p className="text-xs md:text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Đào tạo an toàn chuẩn quốc tế</p>
                </div>
                <div className="flex items-center space-x-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setActiveTab('profile')}>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-slate-900 uppercase">{currentUser.fullName}</p>
                      <p className="text-[8px] text-orange-600 font-black uppercase tracking-widest">Hồ sơ cá nhân</p>
                   </div>
                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm">
                      <i className="fas fa-user-circle text-xl text-slate-400"></i>
                   </div>
                </div>
              </div>

              {currentModuleForPlay ? (
                <StudentPlayer 
                  module={currentModuleForPlay} 
                  student={currentUser} 
                  onFinish={onTrainingFinish} 
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {modules.map(m => (
                    <div key={m.id} className="group bg-white p-8 rounded-[40px] shadow-sm border border-slate-200 hover:border-slate-900 hover:shadow-xl transition-all flex flex-col h-full relative">
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900 text-xl font-black mb-6 border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all">
                        {m.title.charAt(0)}
                      </div>
                      <h3 className="font-black text-xl mb-3 text-slate-900 group-hover:text-orange-600 transition-colors">{m.title}</h3>
                      <p className="text-xs text-slate-400 font-medium mb-8 flex-grow">{m.description}</p>
                      <button 
                        onClick={() => setCurrentModuleForPlay(m)}
                        className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-orange-600 transition-all shadow-lg flex items-center justify-center space-x-2 text-xs uppercase tracking-widest"
                      >
                        <span>VÀO HỌC NGAY</span>
                        <i className="fas fa-play text-[8px]"></i>
                      </button>
                    </div>
                  ))}
                  {modules.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-[40px] bg-white">
                       <i className="fas fa-layer-group text-slate-200 text-4xl mb-4 block"></i>
                       <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Hệ thống chưa có bài giảng mới</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'results' && currentUser.role === 'admin' && (
            <TrainingResultsList results={results} modules={modules} />
          )}

          {activeTab === 'quiz' && <AIQuiz />}
          {activeTab === 'risk' && <RiskAnalyzer />}

          {activeTab === 'admin' && currentUser.role === 'admin' && (
            <AdminPanel 
              onSaveModule={handleSaveModule} 
              users={users} 
              onSaveUsers={handleSaveUsers}
            />
          )}
        </div>
      </main>
    </div>
  );
}
