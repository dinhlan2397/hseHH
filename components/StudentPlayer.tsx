
import React, { useState, useEffect, useRef, useMemo } from 'react';
// Fix: Import User instead of Student as it is not exported from types.ts
import { TrainingModule, User, QuizQuestion } from '../types';

interface StudentPlayerProps {
  module: TrainingModule;
  student: User;
  onFinish: (score: number) => void;
}

interface ShuffledQuestion extends QuizQuestion {
  originalIndex: number;
  shuffledOptions: { text: string; originalIdx: number }[];
}

export const StudentPlayer: React.FC<StudentPlayerProps> = ({ module, student, onFinish }) => {
  const [step, setStep] = useState<'intro' | 'learning' | 'commitment' | 'quiz' | 'result'>('intro');
  const [canProceed, setCanProceed] = useState(false);
  const [isCommitted, setIsCommitted] = useState(false);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finalScore, setFinalScore] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Xáo trộn câu hỏi và đáp án NGAY KHI chuyển sang bước 'quiz'
  // Sử dụng state thay vì useMemo đơn thuần để đảm bảo chỉ xáo trộn 1 lần duy nhất khi bắt đầu thi
  const [shuffledQuestions, setShuffledQuestions] = useState<ShuffledQuestion[]>([]);

  useEffect(() => {
    if (step === 'quiz' && shuffledQuestions.length === 0) {
      // Logic trộn Fish-Yates cho câu hỏi
      const questions = module.questions.map((q, idx) => ({ ...q, originalIndex: idx }));
      const shuffled = [...questions].sort(() => Math.random() - 0.5);

      // Trộn đáp án cho từng câu hỏi
      const finalShuffled = shuffled.map(q => {
        const optionsWithIndices = q.options.map((opt, i) => ({ text: opt, originalIdx: i }));
        return {
          ...q,
          shuffledOptions: optionsWithIndices.sort(() => Math.random() - 0.5)
        } as ShuffledQuestion;
      });
      setShuffledQuestions(finalShuffled);
    }
  }, [step, module.questions, shuffledQuestions.length]);

  useEffect(() => {
    if (step === 'learning' && module.mediaType === 'file') {
      const timer = setInterval(() => {
        if (videoRef.current) {
          if (videoRef.current.ended || videoRef.current.currentTime >= videoRef.current.duration - 1) {
            setCanProceed(true);
            clearInterval(timer);
          }
        }
      }, 1000);
      return () => clearInterval(timer);
    } else if (step === 'learning' && module.mediaType === 'url') {
      const timer = setTimeout(() => setCanProceed(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [step, module]);

  const handleSubmitQuiz = () => {
    let correct = 0;
    shuffledQuestions.forEach((q, i) => {
      const selectedShuffledIdx = answers[i];
      if (selectedShuffledIdx !== undefined) {
        const selectedOriginalIdx = q.shuffledOptions[selectedShuffledIdx].originalIdx;
        if (selectedOriginalIdx === q.correctAnswer) {
          correct++;
        }
      }
    });
    const scorePercent = (correct / module.questions.length) * 100;
    setFinalScore(scorePercent);
    setStep('result');
  };

  const handleNextQuiz = () => {
    if (currentQuizIdx < shuffledQuestions.length - 1) {
      setCurrentQuizIdx(currentQuizIdx + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIdx(0);
    setAnswers([]);
    setShuffledQuestions([]); // Reset để xáo trộn lại đề mới
    setStep('quiz');
  };

  const isPassed = finalScore >= 90;

  return (
    <div className="max-w-5xl mx-auto bg-white min-h-[700px] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100 animate-fadeIn">
      <div className="bg-slate-900 text-white p-6 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight">{module.title}</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            <i className="fas fa-user-circle mr-2 text-orange-500"></i>
            {student.fullName} | {student.company}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="bg-orange-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter">
            An toàn là trên hết
          </span>
        </div>
      </div>

      <div className="flex-grow p-8 md:p-12 flex flex-col">
        {step === 'intro' && (
          <div className="text-center space-y-8 animate-fadeIn my-auto">
            <div className="w-24 h-24 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-sm">
               <i className="fas fa-info-circle"></i>
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 uppercase">Thông tin khóa huấn luyện</h3>
              <p className="text-slate-500 font-medium mt-2 max-w-lg mx-auto leading-relaxed">{module.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
               <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Số câu hỏi</p>
                  <p className="text-2xl font-black text-slate-900">{module.questions.length}</p>
               </div>
               <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Yêu cầu đạt</p>
                  <p className="text-2xl font-black text-green-600">90% +</p>
               </div>
               <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Cơ chế bảo mật</p>
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">XÁO TRỘN ĐỀ & ĐÁP ÁN</p>
               </div>
            </div>
            <button 
              onClick={() => setStep('learning')}
              className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-xl shadow-slate-200"
            >
              BẮT ĐẦU HỌC TẬP <i className="fas fa-play-circle ml-3"></i>
            </button>
          </div>
        )}

        {step === 'learning' && (
          <div className="space-y-8 flex flex-col h-full">
            <div className="w-full flex-grow bg-black rounded-3xl overflow-hidden shadow-2xl relative min-h-[400px]">
              {module.mediaType === 'file' ? (
                <video ref={videoRef} src={module.mediaUrl} controls className="w-full h-full object-contain" />
              ) : (
                <iframe src={module.mediaUrl} className="w-full h-full" allowFullScreen />
              )}
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
               <div className="flex items-center space-x-3 text-slate-600">
                  <i className={`fas ${canProceed ? 'fa-check-circle text-green-500' : 'fa-spinner fa-spin text-orange-500'} text-xl`}></i>
                  <p className="text-sm font-bold uppercase tracking-wide">
                    {canProceed ? 'Bạn đã hoàn thành phần học tập!' : 'Vui lòng xem hết tài liệu để tiếp tục...'}
                  </p>
               </div>
               <button 
                disabled={!canProceed}
                onClick={() => setStep('commitment')}
                className={`w-full md:w-auto px-10 py-4 rounded-xl font-black uppercase transition-all shadow-md ${canProceed ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
               >
                 TIẾP THEO <i className="fas fa-arrow-right ml-3"></i>
               </button>
            </div>
          </div>
        )}

        {step === 'commitment' && (
          <div className="max-w-2xl mx-auto space-y-10 animate-fadeIn my-auto">
            <div className="text-center">
              <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Ký cam kết điện tử</h3>
              <p className="text-slate-500 mt-2 font-medium">Bằng việc xác nhận, bạn chịu trách nhiệm hoàn toàn về các hành vi an toàn của mình.</p>
            </div>
            <div className="bg-white p-10 rounded-3xl border-2 border-slate-200 shadow-sm flex flex-col items-center group hover:border-orange-500 transition-all">
               <div className="w-20 h-20 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 text-4xl">
                 <i className="fas fa-file-pdf"></i>
               </div>
               <p className="text-center font-bold text-slate-700 mb-8 px-4">Đọc kỹ nội dung chi tiết trong văn bản cam kết trước khi tiến hành bước cuối cùng.</p>
               <a 
                href={module.commitmentUrl} 
                download="Cam_ket_an_toan.pdf"
                className="bg-white border-2 border-slate-900 px-10 py-3 rounded-xl font-black text-slate-900 hover:bg-slate-900 hover:text-white transition-all flex items-center shadow-sm"
               >
                 <i className="fas fa-download mr-3"></i> XEM CHI TIẾT VĂN BẢN
               </a>
            </div>
            <div className="flex items-start space-x-4 p-6 bg-orange-50 rounded-3xl border-2 border-orange-200">
               <input 
                type="checkbox" id="commit" className="mt-1 w-6 h-6 rounded accent-orange-600 cursor-pointer" 
                onChange={(e) => setIsCommitted(e.target.checked)}
               />
               <label htmlFor="commit" className="text-sm font-black text-orange-950 cursor-pointer leading-relaxed">
                 TÔI XÁC NHẬN ĐÃ ĐỌC, HIỂU RÕ VÀ CAM KẾT TUÂN THỦ TOÀN BỘ CÁC QUY ĐỊNH AN TOÀN ĐÃ NÊU.
               </label>
            </div>
            <button 
              disabled={!isCommitted}
              onClick={() => setStep('quiz')}
              className={`w-full py-5 rounded-2xl font-black text-xl transition-all shadow-xl ${isCommitted ? 'bg-slate-900 text-white hover:bg-black shadow-slate-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
            >
              TIẾN HÀNH KIỂM TRA <i className="fas fa-edit ml-3"></i>
            </button>
          </div>
        )}

        {step === 'quiz' && (
          <div className="space-y-10 animate-slideUp flex flex-col h-full">
             <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-slate-900 font-black uppercase text-xs tracking-widest">Câu hỏi số {currentQuizIdx + 1} / {shuffledQuestions.length || module.questions.length}</span>
                <div className="h-3 w-48 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                   <div className="h-full bg-orange-500 transition-all duration-500" style={{width: `${((currentQuizIdx+1)/(shuffledQuestions.length || module.questions.length))*100}%`}}></div>
                </div>
             </div>
             
             {shuffledQuestions.length > 0 ? (
               <div className="flex-grow flex flex-col justify-center space-y-10">
                  <h4 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight text-center max-w-3xl mx-auto italic">
                     "{shuffledQuestions[currentQuizIdx].question}"
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto w-full">
                    {shuffledQuestions[currentQuizIdx].shuffledOptions.map((opt, i) => (
                      <button 
                        key={i}
                        onClick={() => {
                          const newAns = [...answers];
                          newAns[currentQuizIdx] = i;
                          setAnswers(newAns);
                        }}
                        className={`text-left p-6 rounded-2xl border-2 transition-all font-bold flex items-center space-x-4 shadow-sm ${answers[currentQuizIdx] === i ? 'border-orange-600 bg-orange-50 text-orange-900' : 'border-slate-100 bg-white text-slate-900 hover:border-slate-300'}`}
                      >
                        <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${answers[currentQuizIdx] === i ? 'border-orange-600 bg-orange-600 text-white' : 'border-slate-300 text-slate-400'}`}>
                           {String.fromCharCode(65 + i)}
                        </span>
                        <span className="text-lg">{opt.text}</span>
                      </button>
                    ))}
                  </div>
               </div>
             ) : (
               <div className="flex-grow flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">
                  Đang chuẩn bị đề thi ngẫu nhiên...
               </div>
             )}

             <div className="flex justify-between items-center pt-8 border-t-2 border-slate-100">
                <button 
                  disabled={currentQuizIdx === 0}
                  onClick={() => setCurrentQuizIdx(currentQuizIdx - 1)}
                  className="px-8 py-3 font-black text-slate-500 disabled:opacity-20 hover:text-slate-900 transition-colors uppercase tracking-widest text-sm"
                >
                  <i className="fas fa-chevron-left mr-2"></i> Quay lại
                </button>
                <button 
                  disabled={answers[currentQuizIdx] === undefined}
                  onClick={handleNextQuiz}
                  className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-black hover:bg-black hover:scale-105 transition-all shadow-xl shadow-slate-200 uppercase tracking-widest"
                >
                  {currentQuizIdx === (shuffledQuestions.length || module.questions.length) - 1 ? 'Gửi kết quả' : 'Tiếp tục'} <i className="fas fa-chevron-right ml-3"></i>
                </button>
             </div>
          </div>
        )}

        {step === 'result' && (
          <div className="text-center space-y-10 animate-fadeIn my-auto max-w-2xl mx-auto">
            {isPassed ? (
              <>
                <div className="w-32 h-32 bg-green-100 text-green-600 rounded-[40px] flex items-center justify-center mx-auto text-6xl shadow-2xl shadow-green-100 animate-bounce">
                  <i className="fas fa-trophy"></i>
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Chúc mừng!</h2>
                  <p className="text-xl font-bold text-slate-600">Bạn đã vượt qua bài kiểm tra với kết quả <span className="text-green-600 font-black text-2xl">{Math.round(finalScore)}%</span></p>
                  <p className="text-slate-400 font-medium">Bạn đã hoàn thành khóa học "{module.title}". Kết quả đã được ghi nhận vào hệ thống HSE.</p>
                </div>
                <button 
                  onClick={() => onFinish(finalScore)}
                  className="bg-slate-900 text-white px-16 py-6 rounded-3xl font-black text-xl hover:bg-black transition-all shadow-2xl shadow-slate-200 uppercase tracking-widest"
                >
                  Xác nhận và kết thúc
                </button>
              </>
            ) : (
              <>
                <div className="w-32 h-32 bg-red-100 text-red-600 rounded-[40px] flex items-center justify-center mx-auto text-6xl shadow-2xl shadow-red-100">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Chưa đạt yêu cầu</h2>
                  <p className="text-xl font-bold text-slate-600">Kết quả của bạn là <span className="text-red-600 font-black text-2xl">{Math.round(finalScore)}%</span></p>
                  <p className="text-slate-500 font-medium bg-red-50 p-6 rounded-3xl border border-red-100 italic">
                    "Yêu cầu tối thiểu để hoàn thành khóa học là <span className="font-black">90%</span>. Bạn chưa hoàn thành khóa học và cần thực hiện lại bài kiểm tra."
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={resetQuiz}
                    className="bg-orange-600 text-white px-16 py-6 rounded-3xl font-black text-xl hover:bg-orange-700 transition-all shadow-2xl shadow-orange-100 uppercase tracking-widest"
                  >
                    Thực hiện lại bài thi <i className="fas fa-redo ml-3"></i>
                  </button>
                  <button 
                    onClick={() => setStep('learning')}
                    className="text-slate-400 font-black uppercase text-sm tracking-widest hover:text-slate-900 transition-colors"
                  >
                    Xem lại tài liệu huấn luyện
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
