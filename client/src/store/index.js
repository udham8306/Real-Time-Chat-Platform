import { create } from 'zustand';
import { createAuthSlice } from './slice/authSlice';
import { createChatSlice } from './slice/chatSlice';

const useAppStore = create((...a) => ({
  ...createAuthSlice(...a),
  ...createChatSlice(...a),
}));

export default useAppStore;
