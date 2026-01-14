
import React, { useState } from 'react';
import { TrainingModule, User, QuizQuestion, Gender } from '../types';

interface AdminPanelProps {
  onSaveModule: (module: TrainingModule) => void;
  users: User[];
  onSaveUsers: (users: User[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onSaveModule, users, onSaveUsers }) => {
  const [subTab, setSubTab] = useState<'modules' | 'users'>('modules');
  
  const [module, setModule] = useState<Partial<TrainingModule>>({
    id: Date.now().toString(),
    title: '',
    description: '',
    mediaType: 'url',
    mediaUrl: '',
    questions: [],
    allowedUserIds: []
  });

  const [newUser, setNewUser] = useState<Partial<User>>({
    username: '',
    password: '',
    passwordLevel2: '',
    fullName: '',
    birthYear: '',
    cccd: '',
    gender: 'Nam',
    phone: '',
    position: '',
    company: 'HSE Hoàng Hà',
    role: 'user',
    isFirstLogin: true
  });

  const handleAddUser = () => {
    if (!newUser.username || !newUser.password || !newUser.passwordLevel2) {
      alert("Vui lòng điền đủ ID, Mật khẩu và MK cấp 2");
      return;
    }
    if (users.some(u => u.username === newUser.username)) {
      alert("ID đăng nhập đã tồn tại.");
      return;
    }
    const userToAdd: User = {
      ...newUser as User,
      id: `USER-${Date.now()}`
    };
    onSaveUsers([...users, userToAdd]);
    setNewUser({ username: '', password: '', passwordLevel2: '', fullName: '', birthYear: '', cccd: '', gender: 'Nam', phone: '', position: '', company: 'HSE Hoàng Hà', role: 'user', isFirstLogin: true });
    alert("Tạo tài khoản thành công!");
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex space-x-2 p-1 bg-slate-200 rounded-2xl w-fit">
        <button 
          onClick={() => setSubTab('modules')}
          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${subTab === 'modules' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <i className="fas fa-layer-group mr-2"></i> Khóa Học
        </button>
        <button 
          onClick={() => setSubTab('users')}
          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${subTab === 'users' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <i className="fas fa-user-shield mr-2"></i> Quản Lý Tài Khoản
        </button>
      </div>

      {subTab === 'modules' ? (
        <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-200 space-y-8">
           <h2 className="text-xl font-black uppercase text-slate-900 border-b pb-4">Thiết lập khóa học mới</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase px-2">Tên bài giảng</label>
                <input 
                  type="text" placeholder="Nhập tên khóa học..." 
                  className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl font-black text-slate-900 focus:border-slate-900 outline-none"
                  onChange={e => setModule({...module, title: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase px-2">Link Video (Youtube/Vimeo)</label>
                <input 
                  type="text" placeholder="Dán URL video..." 
                  className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl font-black text-slate-900 focus:border-slate-900 outline-none"
                  onChange={e => setModule({...module, mediaUrl: e.target.value})}
                />
              </div>
           </div>
           <button onClick={() => onSaveModule(module as TrainingModule)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase shadow-xl hover:bg-orange-600 transition-all">Phát hành khóa học</button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-200">
            <h3 className="text-lg font-black uppercase text-slate-800 mb-6 border-b pb-4">Tạo Tài Khoản Hệ Thống</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <div className="space-y-1">
                 <label className="text-[9px] font-black text-slate-400 uppercase px-2">ID Tài khoản *</label>
                 <input 
                  type="text" className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl font-black text-slate-900 focus:border-slate-900 outline-none"
                  value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})}
                 />
               </div>
               <div className="space-y-1">
                 <label className="text-[9px] font-black text-slate-400 uppercase px-2">Mật khẩu *</label>
                 <input 
                  type="text" className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl font-black text-slate-900 focus:border-slate-900 outline-none"
                  value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})}
                 />
               </div>
               <div className="space-y-1">
                 <label className="text-[9px] font-black text-slate-400 uppercase px-2">Mật khẩu cấp 2 *</label>
                 <input 
                  type="text" className="w-full p-4 bg-white border-2 border-orange-500 rounded-2xl font-black text-orange-600 focus:border-orange-600 outline-none"
                  value={newUser.passwordLevel2} onChange={e => setNewUser({...newUser, passwordLevel2: e.target.value})}
                  placeholder="Mã số 4-6 ký tự"
                 />
               </div>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 mb-8">
               <p className="text-[10px] font-black text-slate-500 uppercase mb-6 tracking-widest"><i className="fas fa-info-circle mr-2"></i>Thông tin hồ sơ khởi tạo</p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input 
                    placeholder="Họ và tên nhân viên..." 
                    className="p-4 bg-white border-2 border-slate-200 rounded-2xl text-xs font-black text-slate-900 outline-none"
                    value={newUser.fullName} onChange={e => setNewUser({...newUser, fullName: e.target.value})}
                  />
                  <select 
                    className="p-4 bg-white border-2 border-slate-200 rounded-2xl text-xs font-black text-slate-900 outline-none"
                    value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as any})}
                  >
                    <option value="user">Nhân viên (Chỉ được học & tra cứu)</option>
                    <option value="admin">Quản trị viên (Toàn quyền thiết lập)</option>
                  </select>
               </div>
            </div>
            <button 
              onClick={handleAddUser}
              className="w-full md:w-auto bg-slate-900 text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-orange-600 transition-all"
            >
              KÍCH HOẠT TÀI KHOẢN
            </button>
          </div>

          <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden">
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-900 text-white text-[9px] uppercase tracking-widest font-black">
                      <th className="p-6">ID Truy Cập</th>
                      <th className="p-6">Họ Tên</th>
                      <th className="p-6">MK Cấp 2</th>
                      <th className="p-6">Trạng Thái</th>
                      <th className="p-6">Hành Động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-6 font-black text-slate-900 text-sm">{u.username}</td>
                        <td className="p-6 font-bold text-slate-600 text-xs">{u.fullName || 'Chưa cập nhật'}</td>
                        <td className="p-6 font-mono font-black text-orange-600">***{u.passwordLevel2?.slice(-1)}</td>
                        <td className="p-6">
                           {u.isFirstLogin ? (
                             <span className="text-[8px] font-black text-red-500 uppercase bg-red-50 border border-red-100 px-2 py-1 rounded">Đợi cập nhật hồ sơ</span>
                           ) : (
                             <span className="text-[8px] font-black text-green-500 uppercase bg-green-50 border border-green-100 px-2 py-1 rounded">Đã kích hoạt</span>
                           )}
                        </td>
                        <td className="p-6">
                           {u.username !== 'admin' && (
                             <button onClick={() => onSaveUsers(users.filter(usr => usr.id !== u.id))} className="text-slate-300 hover:text-red-500 transition-colors">
                               <i className="fas fa-trash-alt"></i>
                             </button>
                           )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
