import { StudentLevel } from '../enum/student.level';
import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class StudentLevelValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    StudentLevel.JUNIOR,
    StudentLevel.MIDDLE,
    StudentLevel.SENIOR,
  ];

  // this function must be used with value argument
  transform(value: any, metadata: ArgumentMetadata) {
    // value will be whatever input we provide as  a status .
    value = value.toUpperCase();

    if (!this.isStatusValid(value))
      throw new BadRequestException(`${value} is an invalid status`);

    return value; // this is the main return
  }

  private isStatusValid(status: any) {
    const index = this.allowedStatuses.indexOf(status);
    return index !== -1;
    // indexOf will return -1 if nothing found
    // and it will return true if index !== -1
  }
}
