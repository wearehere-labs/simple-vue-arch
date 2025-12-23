import { Todo, CreateTodoDto, UpdateTodoDto } from '../entities/Todo';

export interface ITodoRepository {
  findAll(): Promise<Todo[]>;
  findById(id: string): Promise<Todo | null>;
  create(dto: CreateTodoDto): Promise<Todo>;
  update(id: string, dto: UpdateTodoDto): Promise<Todo | null>;
  delete(id: string): Promise<boolean>;
}
