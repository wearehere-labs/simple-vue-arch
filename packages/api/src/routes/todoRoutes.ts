import express, { Request, Response, NextFunction } from 'express';
import { ITodoRepository } from '@todo/domain';
import { CreateTodoDto, UpdateTodoDto } from '@todo/domain';

export function createTodoRouter(todoRepository: ITodoRepository) {
  const router = express.Router();

  // GET /api/todos - Get all todos
  router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const todos = await todoRepository.findAll();
      res.json(todos);
    } catch (error) {
      next(error);
    }
  });

  // GET /api/todos/:id - Get a todo by id
  router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const todo = await todoRepository.findById(req.params.id);
      if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      res.json(todo);
    } catch (error) {
      next(error);
    }
  });

  // POST /api/todos - Create a new todo
  router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: CreateTodoDto = req.body;
      
      if (!dto.title || dto.title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
      }

      const todo = await todoRepository.create(dto);
      res.status(201).json(todo);
    } catch (error) {
      next(error);
    }
  });

  // PUT /api/todos/:id - Update a todo
  router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: UpdateTodoDto = req.body;
      const todo = await todoRepository.update(req.params.id, dto);
      
      if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      
      res.json(todo);
    } catch (error) {
      next(error);
    }
  });

  // DELETE /api/todos/:id - Delete a todo
  router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const success = await todoRepository.delete(req.params.id);
      
      if (!success) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  return router;
}
