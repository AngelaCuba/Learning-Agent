import { randomUUID } from 'crypto';

export class Question {
  constructor(
    public readonly id: string,
    public readonly content: string,
    public readonly createdAt: Date,
  ) {
    if (!content || content.trim().length === 0) {
      throw new Error('Question content cannot be empty');
    }
  }

  static create(content: string): Question {
    return new Question(randomUUID(), content, new Date());
  }
}
