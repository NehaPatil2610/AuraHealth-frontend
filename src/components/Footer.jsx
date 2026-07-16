import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, FileText, HelpCircle } from 'lucide-react';

export default function Footer() {
    const [activeModal, setActiveModal] = useState(null);

    const Modal = ({ title, icon: Icon, children, onClose }) => (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                    onClick={onClose}
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-[#27272a]"
                >
                    <div className="px-6 py-4 flex items-center justify-between border-b shrink-0 border-zinc-200 dark:border-[#27272a]">
                        <div className="flex items-center gap-2">
                            <Icon className="w-5 h-5 text-[#10b981]" />
                            <h3 className="font-bold text-zinc-900 dark:text-white">{title}</h3>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-lg cursor-pointer transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-6 overflow-y-auto custom-scrollbar max-h-[70vh] text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-4">
                        {children}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );

    return (
        <>
            <footer className="mt-auto bg-zinc-900/10 dark:bg-[#09090b]/40 backdrop-blur-sm border-t border-zinc-200/50 dark:border-zinc-800/20 py-6 w-full">
                <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-6 text-xs text-zinc-500 gap-4 md:gap-0">
                    
                    {/* Left side text */}
                    <div>
                        © 2026 AuraHealth Technologies. All rights reserved.
                    </div>

                    {/* Gateway Connected Status */}
                    <div className="flex items-center gap-2">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                        <span className="font-medium text-zinc-600 dark:text-zinc-400">Gateway Connected</span>
                    </div>

                    {/* Right side links */}
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-4 md:mt-0">
                        <button onClick={() => setActiveModal('privacy')} className="hover:text-emerald-400 transition-colors cursor-pointer">Privacy & Policies</button>
                        <button onClick={() => setActiveModal('terms')} className="hover:text-emerald-400 transition-colors cursor-pointer">Terms of Service</button>
                        <button onClick={() => setActiveModal('help')} className="hover:text-emerald-400 transition-colors cursor-pointer">Help & Support</button>
                    </div>
                </div>
            </footer>

            {activeModal === 'privacy' && (
                <Modal title="Privacy & Policies" icon={Shield} onClose={() => setActiveModal(null)}>
                    <h4 className="font-bold text-zinc-900 dark:text-white text-base mb-2">Your Privacy is our Priority</h4>
                    <p>At AuraHealth, we adhere to strict HIPAA compliance and robust encryption standards to ensure your medical data is completely secure.</p>
                    <p>We do not share your personal health information with unauthorized third parties without your explicit consent.</p>
                </Modal>
            )}

            {activeModal === 'terms' && (
                <Modal title="Terms of Service" icon={FileText} onClose={() => setActiveModal(null)}>
                    <h4 className="font-bold text-zinc-900 dark:text-white text-base mb-2">Usage Agreement</h4>
                    <p>By using the AuraHealth platform, you agree to our terms of service which include responsible usage of the telehealth video consults and truthful submission of medical data.</p>
                    <p>Any abuse of the system or practitioners may result in account termination.</p>
                </Modal>
            )}

            {activeModal === 'help' && (
                <Modal title="Help & Support" icon={HelpCircle} onClose={() => setActiveModal(null)}>
                    <h4 className="font-bold text-zinc-900 dark:text-white text-base mb-2">We're here to help</h4>
                    <p>If you're experiencing technical difficulties, please reach out to our support team.</p>
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 mt-4">
                        <p className="font-medium text-zinc-900 dark:text-zinc-300">Support Email: <a href="mailto:support@aurahealth.com" className="text-[#10b981]">support@aurahealth.com</a></p>
                        <p className="font-medium text-zinc-900 dark:text-zinc-300">Live Chat: <span className="text-[#10b981]">Available 9 AM - 5 PM EST</span></p>
                    </div>
                </Modal>
            )}
        </>
    );
}
