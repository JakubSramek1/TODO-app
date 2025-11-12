import httpClient from './httpClient';
import type {CreateTodoPayload, TodoSummary} from '../features/todos/types';

interface TodoListResponse {
  todos: TodoSummary[];
}

export const fetchTodos = async () => {
  const response = await httpClient.get<TodoListResponse>('/todo/list');
  return response.data.todos ?? [];
};

export const createTodo = async (payload: CreateTodoPayload) => {
  await httpClient.post('/todo', {
    title: payload.title,
    description: payload.description ?? '',
  });
};

export const updateTodo = async (id: string, payload: CreateTodoPayload) => {
  await httpClient.put(`/todo/${id}`, {
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
