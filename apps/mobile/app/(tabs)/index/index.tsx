import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTrigger,
} from '@tilo/ui/components/accordion';
import { Badge, BadgeText } from '@tilo/ui/components/badge';
import { Button, ButtonIcon } from '@tilo/ui/components/button';
import { Card } from '@tilo/ui/components/card';
import { Chip, ChipIcon, ChipText } from '@tilo/ui/components/chip';
import { Input, InputField } from '@tilo/ui/components/input';
import { Progress, ProgressFilledTrack } from '@tilo/ui/components/progress';
import { Text } from '@tilo/ui/components/text';
import { useRouter } from 'expo-router';
import { ChevronDown, ChevronRight, Clock, Flag, NotebookText, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { TaskDetailSheet } from '@/components/tasks/TaskDetailSheet';
import { TaskRow } from '@/components/tasks/TaskRow';
import { SAMPLE_TASKS, type Task } from '@/components/tasks/types';

const QUICK_CHIPS = [
  { label: 'Due', icon: Clock },
  { label: 'Priority', icon: Flag },
  { label: 'Notes', icon: NotebookText },
] as const;

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function TasksScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);
  const [draft, setDraft] = useState('');
  const [editing, setEditing] = useState<Task | null>(null);

  const active = tasks.filter((task) => !task.completedAt);
  const completed = tasks.filter((task) => task.completedAt);
  const percentDone = tasks.length ? (completed.length / tasks.length) * 100 : 0;
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const toggle = (task: Task) =>
    setTasks((current) =>
      current.map((t) =>
        t.id === task.id
          ? { ...t, completedAt: t.completedAt ? undefined : formatTime(new Date()) }
          : t,
      ),
    );

  const save = (task: Task) => {
    setTasks((current) =>
      current.some((t) => t.id === task.id)
        ? current.map((t) => (t.id === task.id ? task : t))
        : [...current, task],
    );
    setEditing(null);
    setDraft('');
  };

  const newTask = (): Task => ({ id: String(Date.now()), title: draft.trim(), priority: 'normal' });

  const addDraft = () => {
    if (draft.trim()) save(newTask());
  };

  return (
    <>
      <ScrollView
        className="flex-1 bg-background"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="gap-space-lg px-margin-mobile pb-space-xl pt-space-sm"
      >
        <View className="flex-row items-end justify-between">
          <View>
            <Text variant="label-sm" className="uppercase text-muted-foreground">
              Today
            </Text>
            <Text variant="headline-lg-mobile">{today}</Text>
          </View>
          <View className="items-end">
            <Text variant="headline-sm" className="tabular-nums">
              {completed.length} of {tasks.length}
            </Text>
            <Text variant="label-sm" className="text-muted-foreground">
              Completed
            </Text>
          </View>
        </View>

        <Progress value={percentDone} accessibilityLabel="Tasks completed">
          <ProgressFilledTrack />
        </Progress>

        <Card>
          <View className="flex-row items-center gap-space-sm">
            <Input variant="unstyled" className="flex-1">
              <InputField
                value={draft}
                onChangeText={setDraft}
                placeholder="Add a task..."
                returnKeyType="done"
                onSubmitEditing={addDraft}
              />
            </Input>
            <Button
              size="icon"
              onPress={addDraft}
              isDisabled={!draft.trim()}
              accessibilityLabel="Create task"
            >
              <ButtonIcon as={Plus} />
            </Button>
          </View>
          <View className="flex-row gap-space-xs">
            {QUICK_CHIPS.map(({ label, icon }) => (
              <Chip key={label} onPress={() => setEditing(newTask())}>
                <ChipIcon as={icon} />
                <ChipText>{label}</ChipText>
              </Chip>
            ))}
          </View>
        </Card>

        <View className="gap-space-sm">
          <View className="flex-row items-center justify-between">
            <Text variant="label-md" className="uppercase text-muted-foreground">
              Today&apos;s Focus
            </Text>
            <Text variant="label-sm" className="text-muted-foreground">
              {active.length} Remaining
            </Text>
          </View>
          <View className="gap-space-xs">
            {active.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={toggle}
                onPress={setEditing}
                onFocus={(t) => router.navigate({ pathname: '/focus', params: { task: t.title } })}
              />
            ))}
          </View>
        </View>

        {completed.length ? (
          <Accordion type="single" isCollapsible defaultValue={['completed']}>
            <AccordionItem value="completed">
              <AccordionHeader>
                <AccordionTrigger>
                  {({ isExpanded }: { isExpanded: boolean }) => (
                    <>
                      <View className="flex-row items-center gap-space-xs">
                        <Text variant="label-md" className="uppercase text-muted-foreground">
                          Completed
                        </Text>
                        <Badge variant="muted" className="h-5 min-w-5">
                          <BadgeText className="text-muted-foreground">
                            {completed.length}
                          </BadgeText>
                        </Badge>
                      </View>
                      <AccordionIcon as={isExpanded ? ChevronDown : ChevronRight} />
                    </>
                  )}
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent className="gap-space-xs">
                {completed.map((task) => (
                  <TaskRow key={task.id} task={task} onToggle={toggle} />
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : null}
      </ScrollView>

      <TaskDetailSheet task={editing} onClose={() => setEditing(null)} onSave={save} />
    </>
  );
}
