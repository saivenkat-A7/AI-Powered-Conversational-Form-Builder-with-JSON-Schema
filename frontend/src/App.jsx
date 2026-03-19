import React from 'react';
import ChatPane from './components/ChatPane';
import FormRendererPane from './components/FormRendererPane';
import SchemaDiffPanel from './components/SchemaDiffPanel';
import { generateForm } from './api';
import useStore from './store/useStore';

function App() {
  const {
    messages,
    isLoading,
    schema,
    previousSchema,
    formData,
    conversationId,
    error,
    addMessage,
    setMessages,
    setIsLoading,
    setSchema,
    setPreviousSchema,
    setFormData,
    setConversationId,
    setError,
    clearChat,
  } = useStore();

  const handleSendMessage = async (text) => {
    const userMessage = { role: 'user', text };
    addMessage(userMessage);
    setIsLoading(true);
    setError(null);

    try {
      const response = await generateForm(text, conversationId);
      
      if (response.status === 'clarification_needed') {
        addMessage({ role: 'model', text: "I need some clarification:", questions: response.questions });
        if (response.conversationId) setConversationId(response.conversationId);
      } else if (response.schema) {
        setPreviousSchema(schema);
        setSchema(response.schema);
        setConversationId(response.formId || response.conversationId); // tracking session
        
        addMessage({ role: 'model', text: "I have updated the form schema based on your request!" });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'An error occurred');
      addMessage({ role: 'model', text: "Sorry, I encountered an error while updating the form." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    clearChat();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50/50 to-purple-100 p-4 sm:p-6 lg:p-8 font-sans text-gray-900">
      <header className="max-w-7xl mx-auto mb-8 flex items-center justify-between bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm px-8 py-5 rounded-3xl relative z-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
            AI Form Builder
          </h1>
          <p className="text-gray-500 font-medium text-sm mt-1">Intelligent Conversational Interface for JSON Schemas</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8 lg:h-[calc(100vh-180px)] relative z-10 pb-8 lg:pb-0">
        {/* Left Pane: Chat */}
        <div className="w-full lg:w-1/3 h-full flex flex-col">
          <ChatPane 
            onSendMessage={handleSendMessage} 
          />
        </div>

        {/* Right Pane: Form & Diff */}
        <div className="w-full lg:w-2/3 h-full flex flex-col gap-6">
          <FormRendererPane />
          
          <SchemaDiffPanel />
        </div>
      </main>
    </div>
  );
}

export default App;
