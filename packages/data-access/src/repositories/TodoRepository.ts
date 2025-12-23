import { Collection, ObjectId } from 'mongodb';
import { Todo, CreateTodoDto, UpdateTodoDto, ITodoRepository } from '@todo/domain';
import { getDatabase } from '../database/connection';

interface TodoDocument {
  _id: ObjectId;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class TodoRepository implements ITodoRepository {
  private get collection(): Collection<TodoDocument> {
    return getDatabase().collection<TodoDocument>('todos');
  }

  private mapToEntity(doc: TodoDocument): Todo {
    return {
      id: doc._id.toHexString(),
      title: doc.title,
      description: doc.description,
      completed: doc.completed,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  async findAll(): Promise<Todo[]> {
    const docs = await this.collection.find().sort({ createdAt: -1 }).toArray();
    return docs.map(doc => this.mapToEntity(doc));
  }

  async findById(id: string): Promise<Todo | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const doc = await this.collection.findOne({ _id: new ObjectId(id) });
    return doc ? this.mapToEntity(doc) : null;
  }

  async create(dto: CreateTodoDto): Promise<Todo> {
    const now = new Date();
    const doc: Omit<TodoDocument, '_id'> = {
      title: dto.title,
      description: dto.description,
      completed: false,
      createdAt: now,
      updatedAt: now
    };

    const result = await this.collection.insertOne(doc as TodoDocument);
    const created = await this.collection.findOne({ _id: result.insertedId });
    
    if (!created) {
      throw new Error('Failed to create todo');
    }

    return this.mapToEntity(created);
  }

  async update(id: string, dto: UpdateTodoDto): Promise<Todo | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const updateDoc: Partial<TodoDocument> = {
      ...dto,
      updatedAt: new Date()
    };

    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateDoc },
      { returnDocument: 'after' }
    );

    return result ? this.mapToEntity(result) : null;
  }

  async delete(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) {
      return false;
    }

    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
}
