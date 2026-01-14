
import React, { useState } from 'react';
import { User, Gender } from '../types';

interface UserProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState<User>(user);
  const [passForm, setPassForm] = useState({ oldLevel2: '', newPass: '', confirmPass: '' });
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  // Đối với lần đầu đăng nhập, mặc định cho phép nhập phone
  const canEditPhoneDirectly = user.isFirstLogin;

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.cccd || !formData.phone) {
      alert("Vui lòng không để trống các trường thông tin quan trọng (Họ tên, CCCD, SĐT).");
      return;
    }
    // Chuyển isFirstLogin thành false sau lần lưu đầu tiên
    onUpdate({ ...formData, isFirstLogin: false });
    setIsEditingPhone(false);
  };

  const handleChangePass = () => {
    if (!passForm.oldLevel2) return alert("Vui lòng nhập mật khẩu cấp 2 để xác thực.");
    if (passForm.oldLevel2 !== user.passwordLevel2) return alert("Mật khẩu cấp 2 không chính xác.");
    if (passForm.newPass !== passForm.confirmPass) return alert("Mật khẩu mới và xác nhận không khớp.");
    if (passForm.newPass.length < 6) return alert("Mật khẩu mới phải từ 6 ký tự trở lên.");
    
    onUpdate({ ...user, password: passForm.newPass });
    setPassForm({ oldLevel2: '', newPass: '', confirmPass: '' });
    alert("Đổi mật khẩu thành công.");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-10 border-b border-slate-100 pb-6">
             <div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Hồ sơ nhân sự</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 flex items-center">
                  <i className="fas fa-id-card mr-2 text-orange-600"></i> Thông tin định danh cá nhân
                </p>
             </div>
             {user.isFirstLogin && (
               <div className="bg-orange-600 text-white px-5 py-2 rounded-2xl text-[10px] font-black animate-pulse shadow-lg shadow-orange-200">
                 LẦN ĐẦU: VUI LÒNG NHẬP THÔNG TIN
               </div>
             )}
          </div>

          <form onSubmit={handleSaveInfo} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
               <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest px-1">Họ và Tên</label>
                 <input 
                  type="text" className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl font-black text-slate-900 focus:border-slate-900 outline-none transition-all"
                  value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})}
                 />
               </div>
               
               <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest px-1">Số CCCD</label>
                 <input 
                  type="text" className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl font-black text-slate-900 focus:border-slate-900 outline-none transition-all"
                  value={formData.cccd} onChange={e => setFormData({...formData, cccd: e.target.value})}
                 />
               </div>

               <div className="space-y-2 md:col-span-2">
                 <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest px-1">Số điện thoại liên hệ</label>
                 <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-grow">
                      <input 
                        disabled={!canEditPhoneDirectly && !isEditingPhone}
                        type="text" 
                        placeholder="09xx xxx xxx"
                        className={`w-full p-4 bg-white border-2 rounded-2xl font-black transition-all ${(isEditingPhone || canEditPhoneDirectly) ? 'border-orange-500 text-orange-600 ring-4 ring-orange-50' : 'border-slate-200 text-slate-900'}`}
                        value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                      {(!canEditPhoneDirectly && !isEditingPhone) && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                          <i className="fas fa-lock text-xs"></i>
                        </div>
                      )}
                    </div>
                    
                    {!canEditPhoneDirectly && (
                      isEditingPhone ? (
                        <div className="flex gap-2">
                          <button type="submit" className="bg-orange-600 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-700 shadow-lg transition-all">
                            CẬP NHẬT MỚI
                          </button>
                          <button type="button" onClick={() => {setIsEditingPhone(false); setFormData({...formData, phone: user.phone})}} className="bg-slate-100 text-slate-500 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest">
                            HỦY
                          </button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => setIsEditingPhone(true)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black shadow-xl transition-all flex items-center justify-center">
                          <i className="fas fa-edit mr-2"></i> THAY ĐỔI SỐ ĐIỆN THOẠI
                        </button>
                      )
                    )}
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest px-1">Giới tính</label>
                 <select 
                  className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl font-black text-slate-900 outline-none focus:border-slate-900 appearance-none"
                  value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as Gender})}
                 >
                   <option value="Nam">Nam</option>
                   <option value="Nữ">Nữ</option>
                   <option value="Khác">Khác</option>
                 </select>
               </div>

               <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest px-1">Năm sinh</label>
                 <input 
                  type="text" className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl font-black text-slate-900 focus:border-slate-900 outline-none"
                  value={formData.birthYear} onChange={e => setFormData({...formData, birthYear: e.target.value})}
                 />
               </div>
            </div>
            
            <div className="pt-6">
              <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-orange-600 transition-all text-sm">
                LƯU THÔNG TIN HỒ SƠ
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-200">
           <div className="flex items-center space-x-3 mb-8 border-b border-slate-100 pb-4">
              <i className="fas fa-shield-alt text-orange-600"></i>
              <h3 className="text-xs font-black uppercase text-slate-900 tracking-widest">Bảo mật tài khoản</h3>
           </div>
           
           <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest px-1">Mã xác thực cấp 2</label>
                <input 
                  type="password" placeholder="Nhập mã 4-6 số..."
                  className="w-full p-4 bg-white border-2 border-orange-500 rounded-2xl text-sm font-black text-orange-600 focus:border-orange-600 outline-none"
                  value={passForm.oldLevel2} onChange={e => setPassForm({...passForm, oldLevel2: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Mật khẩu mới</label>
                <input 
                  type="password"
                  className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-black text-slate-900 outline-none"
                  value={passForm.newPass} onChange={e => setPassForm({...passForm, newPass: e.target.value})}
                />
              </div>
              <button onClick={handleChangePass} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-[10px] uppercase shadow-xl hover:bg-orange-600 transition-all">
                ĐỔI MẬT KHẨU
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
