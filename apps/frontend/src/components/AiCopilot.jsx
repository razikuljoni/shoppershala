import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, MessageCircle, X } from 'lucide-react';

export default function AiCopilot({ currentUser }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!currentUser) return null;

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transition-transform hover:scale-105 active:scale-95"
        aria-label="AI Assistant"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 flex h-96 w-80 flex-col overflow-hidden rounded-2xl border border-white/10 bg-gray-900/95 shadow-2xl shadow-black/30 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/20">
                <Bot className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Shoppershala AI</p>
                <p className="text-xs text-gray-400">Ask me anything!</p>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 items-center justify-center p-6 text-center">
              <div>
                <Bot className="mx-auto h-12 w-12 text-gray-600" />
                <p className="mt-3 text-sm text-gray-400">
                  Hi {currentUser?.name || 'there'}! I can help you find products, track orders, and
                  more.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
