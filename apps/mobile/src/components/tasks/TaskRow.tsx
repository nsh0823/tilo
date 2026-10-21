import { Badge, BadgeText } from '@tilo/ui/components/badge';
import { Button, ButtonIcon } from '@tilo/ui/components/button';
import { Card } from '@tilo/ui/components/card';
import { Checkbox, CheckboxIcon, CheckboxIndicator } from '@tilo/ui/components/checkbox';
import { Icon } from '@tilo/ui/components/icon';
import { Text } from '@tilo/ui/components/text';
import { Check, CheckCheck, Clock, FileText, Focus } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { PRIORITY_LABEL, type Task } from './types';

type TaskRowProps = {
  task: Task;
  onToggle: (task: Task) => void;
  onPress?: (task: Task) => void;
  onFocus?: (task: Task) => void;
};

export function TaskRow({ task, onToggle, onPress, onFocus }: TaskRowProps) {
  const isDone = !!task.completedAt;

  return (
    <Pressable
      onPress={onPress ? () => onPress(task) : undefined}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      className="active:opacity-80"
    >
      <Card className={isDone ? 'flex-row items-center opacity-75' : 'flex-row items-start'}>
        <View className="min-w-0 flex-1 flex-row items-start gap-space-md">
          <Checkbox
            value={task.id}
            isChecked={isDone}
            onChange={() => onToggle(task)}
            accessibilityLabel={isDone ? 'Mark task incomplete' : 'Mark task complete'}
            className="mt-px"
          >
            <CheckboxIndicator>
              <CheckboxIcon as={Check} />
            </CheckboxIndicator>
          </Checkbox>

          <View className="min-w-0 flex-1 gap-1">
            <Text
              variant="body-md"
              numberOfLines={1}
              className={isDone ? 'text-muted-foreground line-through' : 'font-geist-medium'}
            >
              {task.title}
            </Text>
            {isDone ? (
              <Text variant="label-sm" className="text-subtle">
                Finished {task.completedAt}
              </Text>
            ) : (
              <View className="flex-row flex-wrap items-center gap-space-sm">
                {task.dueTime ? (
                  <View className="flex-row items-center gap-0.5">
                    <Icon as={Clock} size="2xs" className="text-muted-foreground" />
                    <Text variant="label-sm" className="text-muted-foreground tabular-nums">
                      {task.dueTime}
                    </Text>
                  </View>
                ) : null}
                <Badge variant={task.priority === 'normal' ? 'secondary' : 'muted'}>
                  <BadgeText
                    className={task.priority === 'medium' ? 'text-muted-foreground' : undefined}
                  >
                    {PRIORITY_LABEL[task.priority]}
                  </BadgeText>
                </Badge>
                {task.notes ? (
                  <Icon as={FileText} size="2xs" className="text-muted-foreground" />
                ) : null}
              </View>
            )}
          </View>
        </View>

        {isDone ? (
          <Icon as={CheckCheck} size="sm" className="text-subtle" />
        ) : onFocus ? (
          <Button
            variant="secondary"
            size="icon"
            onPress={() => onFocus(task)}
            accessibilityLabel={`Start focus on ${task.title}`}
          >
            <ButtonIcon as={Focus} className="text-muted-foreground" />
          </Button>
        ) : null}
      </Card>
    </Pressable>
  );
}
