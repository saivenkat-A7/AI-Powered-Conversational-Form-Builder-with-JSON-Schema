import { create } from 'zustand';

const useStore = create((set) => ({
  messages: [],
  isLoading: false,
  schema: null,
  previousSchema: null,
  formData: {},
  conversationId: null,
  error: null,

  // Actions
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setIsLoading: (isLoading) => set({ isLoading }),
  setSchema: (schema) => set({ schema }),
  setPreviousSchema: (previousSchema) => set({ previousSchema }),
  setFormData: (formData) => set({ formData }),
  setConversationId: (conversationId) => set({ conversationId }),
  setError: (error) => set({ error }),

  clearChat: () =>
    set({
      messages: [],
      schema: null,
      previousSchema: null,
      formData: {},
      conversationId: null,
      error: null,
    }),
}));

export default useStore;
