import {HStack, Skeleton, SkeletonCircle, SkeletonText, Stack} from '@chakra-ui/react';

const HeaderSkeleton = () => (
  <Stack display="flex" flexDirection="row" justifyContent="space-between">
    <HStack width="full" maxW="sm">
      <SkeletonText noOfLines={2} />
    </HStack>
    <Skeleton height="40px" width="120px" />
  </Stack>
);

const TaskSectionSkeleton = () => (
  <Stack gap="10">
    <HStack width="full" maxW="xs">
      <SkeletonText noOfLines={1} />
    </HStack>
    <HStack width="full">
      <SkeletonCircle size="10" />
      <SkeletonText noOfLines={2} />
    </HStack>
    <HStack width="full">
      <SkeletonCircle size="10" />
      <SkeletonText noOfLines={2} />
    </HStack>
  </Stack>
);

const TodosListSkeleton = () => (
  <Stack gap="16" display="flex" flexDirection="column">
    <HeaderSkeleton />
    <TaskSectionSkeleton />
    <TaskSectionSkeleton />
  </Stack>
);

export default TodosListSkeleton;
