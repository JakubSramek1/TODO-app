import httpClient from './httpClient';
import type {CreateTodoPayload, TodoSummary, UpdateTodoPayload} from '../features/todos/types';

interface TodoListResponse {
  todos: TodoSummary[];
}

export const fetchTodos = async () => {
  const response = await httpClient.get<TodoListResponse>('/todo/list');
  return response.data.todos ?? [];
};

export const fetchTodo = async (todoId: string) => {
  const response = await httpClient.get<TodoSummary>(`/todo/${todoId}`);
  return response.data ?? null;
};

export const createTodo = async (payload: CreateTodoPayload) => {
  await httpClient.post('/todo', {
    title: payload.title,
    description: payload.description ?? '',
  });
};

export const updateTodo = async (payload: UpdateTodoPayload) => {
  await httpClient.put(`/todo/${payload.id}`, {
    title: payload.title,
    description: payload.description ?? '',
  });
};

export const toggleTodoStatus = async (id: string, completed: boolean) => {
  await httpClient.post(`/todo/${id}/${completed ? 'complete' : 'incomplete'}`);
};

export const deleteTodo = async (id: string) => {
  await httpClient.delete(`/todo/${id}`);
};
