import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  ShieldAlert, 
  HelpCircle, 
  Terminal, 
  RefreshCw,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { copilotService } from '../../services/copilotService';
import { scanService } from '../../services/scanService';
import { useToast } from '../../context/ToastContext';

export const SecurityCopilotPage = () => {
  const { addToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => `session_${Date.now()}`);
  const [recentScans, setRecentScans] = useState([]);
  const [selectedScanContext, setSelectedScanContext] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadCopilotData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadCopilotData = async () => {
    try {
      const [historyRes, scanRes] = await Promise.all([
        copilotService.getHistory(sessionId),
        scanService.getThreatHistory()
      ]);

      if (historyRes.data?.messages && historyRes.data.messages.length > 0) {
        setMessages(historyRes.data.messages);
      } else {
        setMessages([
          {
            _id: 'init_welcome',
            role: 'assistant',
            content: `### 🤖 JARVIS AI Security Assistant Online\n\nI am your autonomous SOC threat copilot powered by Google Gemini. I can assist you with:\n\n- **Analyzing suspicious phishing emails, links, & QR codes**\n- **Explaining complex threat indicators & risk scores**\n- **Step-by-step incident response & containment protocols**\n- **Configuring 2FA/MFA and privacy hardening strategies**\n\nSelect a prompt pill below or type any cybersecurity question!`,
            suggestedFollowups: [
              "What should I do if I clicked a phishing link?",
              "How does AegisAI score domain threat risks?",
              "Explain how 2FA defends against credential leaks"
            ]
          }
        ]);
      }

      const scanList = scanRes.data?.logs || scanRes.logs || (Array.isArray(scanRes) ? scanRes : []);
      if (Array.isArray(scanList)) {
        setRecentScans(scanList.slice(0, 5));
      }
    } catch (err) {
      console.error('Copilot init error', err);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const queryText = textToSend || prompt;
    if (!queryText.trim() || loading) return;

    const userMsg = {
      _id: 'temp_u_' + Date.now(),
      role: 'user',
      content: queryText
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setPrompt('');
    setLoading(true);

    try {
      const res = await copilotService.sendMessage({
        prompt: queryText,
        sessionId,
        scanContextId: selectedScanContext || null
      });

      if (res.data?.assistantMessage) {
        setMessages(prev => [...prev, res.data.assistantMessage]);
      }
    } catch (err) {
      addToast('DANGER', 'Failed to reach AI Copilot engine');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowupClick = (questionText) => {
    handleSendMessage(questionText);
  };

  const handleNewSession = () => {
    const newId = `session_${Date.now()}`;
    setSessionId(newId);
    setMessages([
      {
        _id: 'init_welcome_' + Date.now(),
        role: 'assistant',
        content: `### 🤖 New Copilot Session Initiated\n\nHow can I assist with your cybersecurity posture today?`,
        suggestedFollowups: [
          "Explain phishing red flags",
          "What is an OTP scam?",
          "How to configure security settings?"
        ]
      }
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="neu-raised p-6 rounded-2xl border border-[#34291b] bg-[#17130e] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#d1693a] uppercase tracking-widest mb-1 font-bold">
            <Bot className="w-4 h-4 text-[#d1693a] animate-pulse" />
            <span>JARVIS AI SECURITY ASSISTANT</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#f2e8d8] font-heading">AI Security Copilot</h1>
          <p className="text-xs text-[#b8a892] mt-1">
            Real-time cybersecurity guidance, threat breakdowns, & remediation steps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {recentScans.length > 0 && (
            <select
              value={selectedScanContext}
              onChange={(e) => setSelectedScanContext(e.target.value)}
              className="bg-[#0d0b08] border border-[#34291b] text-xs text-[#d98a3d] font-mono rounded-xl p-2.5 focus:outline-none"
            >
              <option value="">No Scan Context Selected</option>
              {recentScans.map(s => (
                <option key={s._id} value={s._id}>
                  Context: {s.moduleType} ({s.threatLevel})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handleNewSession}
            className="px-3.5 py-2.5 rounded-xl bg-[#0d0b08] text-[#b8a892] hover:text-[#f2e8d8] border border-[#34291b] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* Main Chat Layout */}
      <div className="neu-raised rounded-2xl border border-[#34291b] flex flex-col h-[650px] overflow-hidden bg-[#17130e]">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg._id || index}
                className={`flex gap-4 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Floating Avatar Icon */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                  isUser 
                    ? 'bg-[#d98a3d]/15 border-[#d98a3d]/40 text-[#d98a3d]' 
                    : 'bg-[#b3542e]/15 border-[#b3542e]/40 text-[#d1693a] shadow-glow-secondary'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Content Bubble */}
                <div className="space-y-3">
                  <div className={`p-5 rounded-2xl border text-xs leading-relaxed ${
                    isUser 
                      ? 'bg-[#d98a3d]/15 border-[#d98a3d]/30 text-[#f2e8d8] rounded-tr-none' 
                      : 'neu-inset border-[#34291b] text-[#f2e8d8] rounded-tl-none font-mono'
                  }`}>
                    {msg.content.split('\n').map((line, lIdx) => {
                      if (line.startsWith('### ')) {
                        return <h3 key={lIdx} className="text-sm font-bold text-[#f2e8d8] mb-2 font-heading">{line.replace('### ', '')}</h3>;
                      }
                      if (line.startsWith('#### ')) {
                        return <h4 key={lIdx} className="text-xs font-bold text-[#d1693a] mt-2 mb-1 font-mono">{line.replace('#### ', '')}</h4>;
                      }
                      if (line.startsWith('- ')) {
                        return <li key={lIdx} className="ml-4 list-disc text-[#b8a892] mb-1">{line.replace('- ', '')}</li>;
                      }
                      return <p key={lIdx} className="mb-1">{line}</p>;
                    })}
                  </div>

                  {/* Suggested Followups */}
                  {!isUser && msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {msg.suggestedFollowups.map((q, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={() => handleFollowupClick(q)}
                          className="px-3 py-1.5 rounded-lg bg-[#0d0b08] border border-[#d98a3d]/30 hover:border-[#d98a3d] text-[11px] text-[#d98a3d] font-mono transition-all text-left flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 shrink-0 text-[#d98a3d]" />
                          <span>{q}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-4 max-w-xl">
              <div className="w-9 h-9 rounded-xl bg-[#b3542e]/15 border border-[#b3542e]/40 flex items-center justify-center text-[#d1693a]">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl neu-inset border-[#b3542e]/30 text-xs text-[#d1693a] font-mono flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#d1693a] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#d1693a] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#d1693a] animate-bounce [animation-delay:0.4s]" />
                </div>
                <span>JARVIS is evaluating threat vector telemetry...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#34291b] bg-[#0d0b08]/90 backdrop-blur-xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask JARVIS AI Copilot a security question..."
              className="flex-1 bg-[#1f1a13] border border-[#34291b] rounded-xl py-3 px-4 text-xs text-[#f2e8d8] placeholder-[#6e6151] focus:outline-none focus:border-[#d1693a] font-mono transition-all neu-inset"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="btn-copilot-green px-5 py-3 rounded-xl text-xs font-bold shadow-glow-secondary flex items-center gap-2 disabled:opacity-40 cursor-pointer"
            >
              <span>Ask Copilot</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SecurityCopilotPage;
