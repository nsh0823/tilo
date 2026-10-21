export type TaskPriority = 'high' | 'medium' | 'normal';

export type Task = {
  id: string;
  title: string;
  dueTime?: string;
  priority: TaskPriority;
  notes?: string;
  completedAt?: string;
};

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  high: 'High',
  medium: 'Medium',
  normal: 'Normal',
};

// Placeholder content from the Stitch Tasks screen until tasks are stored in Supabase.
export const SAMPLE_TASKS: Task[] = [
  {
    id: '1',
    title: 'Deep Work: Architecture specification',
    dueTime: '10:30 AM',
    priority: 'high',
    notes: 'Drafting protocol serialization specs and streaming buffer limits.',
  },
  {
    id: '2',
    title: 'Draft user research questions',
    dueTime: '1:00 PM',
    priority: 'medium',
    notes: 'Interview 5 senior software engineers regarding cognitive friction.',
  },
  {
    id: '3',
    title: 'Review PR #142 in interval audio core',
    dueTime: '3:30 PM',
    priority: 'normal',
    notes: 'Check WebAudio oscillator release envelopes and clipping safeguards.',
  },
  { id: '4', title: 'Inbox zero & daily triage', priority: 'normal', completedAt: '9:15 AM' },
  { id: '5', title: 'Client design system sync', priority: 'normal', completedAt: '9:45 AM' },
  { id: '6', title: 'Morning hydration & vitamins', priority: 'normal', completedAt: '8:00 AM' },
];
