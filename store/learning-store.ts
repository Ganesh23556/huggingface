"use client";

import { create } from "zustand";

type LearningState = {
  selectedVideoId: number | null;
  courseTitle: string | null;
  lessonTitle: string | null;
  setSelectedVideoId: (id: number | null) => void;
  setContext: (course: string | null, lesson: string | null) => void;
};

export const useLearningStore = create<LearningState>((set) => ({
  selectedVideoId: null,
  courseTitle: null,
  lessonTitle: null,
  setSelectedVideoId: (selectedVideoId) => set({ selectedVideoId }),
  setContext: (courseTitle, lessonTitle) => set({ courseTitle, lessonTitle }),
}));
