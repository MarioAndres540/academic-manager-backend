export interface IGrade {
  _id?: string;
  studentName: string;
  subjectId:
    | string
    | {
        _id: string;
        name: string;
        description?: string;
        createdAt?: Date;
        updatedAt?: Date;
      };

  score: number;
  createdAt?: Date;
  updatedAt?: Date;
}

