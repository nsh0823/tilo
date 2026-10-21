import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from '@tilo/ui/components/actionsheet';
import { Button, ButtonIcon, ButtonText } from '@tilo/ui/components/button';
import { Icon } from '@tilo/ui/components/icon';
import { Input, InputField, InputSlot } from '@tilo/ui/components/input';
import { SegmentedControl, SegmentedControlItem } from '@tilo/ui/components/segmented-control';
import { Text } from '@tilo/ui/components/text';
import { Clock, X } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

import { PRIORITY_LABEL, type Task, type TaskPriority } from './types';

type TaskDetailSheetProps = {
  /** The task being edited; `null` closes the sheet. */
  task: Task | null;
  onClose: () => void;
  onSave: (task: Task) => void;
};

export function TaskDetailSheet({ task, onClose, onSave }: TaskDetailSheetProps) {
  return (
    <Actionsheet isOpen={!!task} onClose={onClose}>
      <ActionsheetBackdrop />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="w-full"
      >
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          {/* Keyed so the form resets whenever a different task opens. */}
          {task ? <TaskForm key={task.id} task={task} onClose={onClose} onSave={onSave} /> : null}
        </ActionsheetContent>
      </KeyboardAvoidingView>
    </Actionsheet>
  );
}

function TaskForm({ task, onClose, onSave }: { task: Task } & Omit<TaskDetailSheetProps, 'task'>) {
  const [title, setTitle] = useState(task.title);
  const [dueTime, setDueTime] = useState(task.dueTime ?? '');
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [notes, setNotes] = useState(task.notes ?? '');

  const save = () => {
    onSave({
      ...task,
      title: title.trim(),
      dueTime: dueTime.trim() || undefined,
      priority,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <View className="gap-space-md">
      <View className="flex-row items-center justify-between">
        <Text variant="label-sm" className="uppercase text-muted-foreground">
          Task Details
        </Text>
        <Button variant="secondary" size="icon" onPress={onClose} accessibilityLabel="Close">
          <ButtonIcon as={X} className="text-muted-foreground" />
        </Button>
      </View>

      <Field label="Title">
        <Input variant="filled">
          <InputField value={title} onChangeText={setTitle} placeholder="Task title" />
        </Input>
      </Field>

      <Field label="Due Time">
        <Input variant="filled">
          <InputSlot>
            <Icon as={Clock} size="sm" className="text-muted-foreground" />
          </InputSlot>
          <InputField value={dueTime} onChangeText={setDueTime} placeholder="e.g. 3:30 PM" />
        </Input>
      </Field>

      <Field label="Priority">
        <SegmentedControl value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
          {(Object.keys(PRIORITY_LABEL) as TaskPriority[]).map((key) => (
            <SegmentedControlItem key={key} value={key}>
              {PRIORITY_LABEL[key]}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
      </Field>

      <Field label="Notes">
        <Input variant="filled" className="items-start py-2">
          <InputField
            value={notes}
            onChangeText={setNotes}
            placeholder="Add notes"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            className="min-h-16"
          />
        </Input>
      </Field>

      <Button onPress={save} isDisabled={!title.trim()} className="mt-space-sm">
        <ButtonText>Save Changes</ButtonText>
      </Button>
    </View>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View className="gap-1">
      <Text variant="label-sm" className="text-muted-foreground">
        {label}
      </Text>
      {children}
    </View>
  );
}
