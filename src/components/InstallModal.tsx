import React, { useState, useEffect } from 'react';
import { Smartphone, Download, CheckCircle2, X, ExternalLink, ShieldCheck } from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs select-none">
      <div className="max-w-md w-full bg-slate-900 border border-emerald-500/50 rounded-2xl p-6 text-right shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">نصب روی گوشی اندروید (APK / PWA)</h3>
            <p className="text-xs text-slate-400">اجرای تمام‌صفحه و آفلاین بدون نیاز به اینترنت</p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-2.5 mb-5 bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>تبدیل خودکار به اپلیکیشن بومی اندروید (WebAPK) با گرافیک سه‌بعدی کامل ۶۰ فریم.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>دارای جوی‌استیک لمسی و دکمه‌های شمشیر و سپر بهینه‌شده برای صفحات لمسی.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>نصب مستقیم و بدون نیاز به دور زدن فیلتر یا دانلود فایل‌های حجیم ناامن.</span>
          </div>
        </div>

        {/* Step by Step Guide for Android Chrome */}
        <div className="mb-6 text-xs text-slate-300">
          <div className="font-bold text-amber-400 mb-2">راهنمای نصب در مرورگر کروم اندروید:</div>
          <ol className="list-decimal list-inside space-y-1.5 text-slate-400 pr-1">
            <li>روی علامت سه نقطه (<strong className="text-white">⋮</strong>) در بالای مرورگر کروم ضربه بزنید.</li>
            <li>گزینه <strong className="text-emerald-300">«نصب برنامه» (Install App)</strong> یا <strong className="text-emerald-300">«افزودن به صفحه اصلی» (Add to Home screen)</strong> را انتخاب کنید.</li>
            <li>آیکون بازی با نام «پاسداران ایران» روی صفحه گوشی شما ظاهر می‌شود و به‌صورت بازی مستقل باز خواهد شد!</li>
          </ol>
        </div>

        {/* Action Button */}
        {deferredPrompt ? (
          <button
            onClick={handleInstallClick}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mb-2"
          >
            <Download className="w-5 h-5" />
            <span>نصب فوری روی دستگاه</span>
          </button>
        ) : (
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            <span>متوجه شدم، بازگشت به بازی</span>
          </button>
        )}
      </div>
    </div>
  );
};
