
import React, { useState } from 'react';
import { analyzeRiskAI } from '../geminiService';

export const RiskAnalyzer: React.FC = () => {
  const [scenario, setScenario] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!scenario) return;
    setLoading(true);
    try {
      const result = await analyzeRiskAI(scenario);
      setAnalysis(result);
    } catch (e) {
      alert("Lỗi khi phân tích. Vui lòng kiểm tra lại kịch bản.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-3">AI Risk Expert</h1>
        <p className="text-slate-500">Mô tả tình huống công việc, AI sẽ đóng vai chuyên gia HSE 30 năm kinh nghiệm để tư vấn cho bạn.</p>
      </header>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-1 bg-gradient-to-r from-orange-400 via-red-500 to-purple-600"></div>
        <div className="p-8 md:p-12">
          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Mô tả kịch bản làm việc</label>
            <textarea
              className="w-full h-40 p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none text-lg resize-none"
              placeholder="Ví dụ: Công nhân đang hàn cắt kim loại tại khu vực gần kho chứa xăng dầu, trời đang mưa nhẹ và có gió mạnh..."
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
            />
          </div>
          
          <button
            onClick={handleAnalyze}
            disabled={loading || !scenario}
            className="w-full bg-slate-900 hover:bg-black disabled:opacity-50 text-white py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 text-xl transition-all shadow-xl"
          >
            {loading ? (
              <>
                <i className="fas fa-brain fa-spin"></i>
                <span>Chuyên gia đang phân tích...</span>
              </>
            ) : (
              <>
                <i className="fas fa-shield-virus"></i>
                <span>Bắt Đầu Phân Tích Chuyên Sâu</span>
              </>
            )}
          </button>
        </div>

        {analysis && (
          <div className="bg-slate-50 p-8 md:p-12 border-t border-slate-200 animate-slideUp">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center text-white shadow-lg">
                <i className="fas fa-user-tie text-xl"></i>
              </div>
              <div>
                <h4 className="font-bold text-xl text-slate-800">Kết Quả Phân Tích</h4>
                <p className="text-xs text-slate-400 font-medium">Báo cáo được tạo tự động bởi AI Expert Engine</p>
              </div>
              <button 
                onClick={() => window.print()}
                className="ml-auto bg-white border border-slate-200 p-2 rounded-lg text-slate-500 hover:text-slate-900"
              >
                <i className="fas fa-download"></i>
              </button>
            </div>
            
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed bg-white p-8 rounded-2xl border border-slate-100 shadow-sm whitespace-pre-wrap">
              {analysis}
            </div>
            
            <div className="mt-8 flex items-center justify-center space-x-2 text-slate-400 text-sm">
              <i className="fas fa-info-circle"></i>
              <span>Kết quả này mang tính chất tham khảo, hãy luôn tuân thủ quy trình thực tế tại nhà máy.</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 text-xl">
               <i className="fas fa-search-location"></i>
            </div>
            <h5 className="font-bold mb-2">Xác định rủi ro</h5>
            <p className="text-xs text-slate-500">Tìm kiếm các mối nguy tiềm ẩn trong môi trường làm việc.</p>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 text-xl">
               <i className="fas fa-balance-scale"></i>
            </div>
            <h5 className="font-bold mb-2">Đánh giá mức độ</h5>
            <p className="text-xs text-slate-500">Phân loại theo tần suất và mức độ nghiêm trọng.</p>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 text-xl">
               <i className="fas fa-hard-hat"></i>
            </div>
            <h5 className="font-bold mb-2">Biện pháp kiểm soát</h5>
            <p className="text-xs text-slate-500">Đề xuất PPE và các rào chắn kỹ thuật cần thiết.</p>
         </div>
      </div>
    </div>
  );
};
