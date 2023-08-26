import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  private isObj(obj: any): boolean {
    return typeof obj === 'object' && obj !== null;
  }
  private trim(values) {
    Object.keys(values).forEach((key) => {
      if (key !== 'password') {
        if (this.isObj(values[key])) {
          values[key] = this.trim(values[key]);
        } else {
          if (typeof values[key] === 'string') {
            values[key] = values[key].trim();
            const temp = values[key];
            if (temp.endsWith(',')) {
              values[key] = temp.slice(0, -1);
            }
          }
          if (key == 'username') {
            values[key] = values[key].toLowerCase();
          }
        }
      }
    });
    return values;
  }
  private trimeQuery(values) {
    Object.keys(values).forEach((key) => {
      if (values[key] === 'true') {
        values[key] = true;
      } else if (values[key] === 'false') {
        values[key] = false;
      } else {
        values[key] = values[key].trim();
      }
    });
    return values;
  }
  private trimParam(values) {
    if (typeof values === 'string') {
      values = values.trim();
    }
    // if (typeof values === 'string' && values.includes('-')) {
    //     const regex = new RegExp(/^[0-9(a-f|A-F)]{8}-[0-9(a-f|A-F)]{4}-4[0-9(a-f|A-F)]{3}-[89ab][0-9(a-f|A-F)]{3}-[0-9(a-f|A-F)]{12}$/i);
    //     if (!regex.test(values)) {
    //         throw new HttpException('invalid uuid', HttpStatus.BAD_REQUEST)
    //     }
    // }
    return values;
  }

  transform(values: any, metadata: ArgumentMetadata) {
    const { type } = metadata;
    if (this.isObj(values) && type === 'body') {
      return this.trim(values);
    }
    if (this.isObj(values) && type === 'query') {
      return this.trimeQuery(values);
    }
    // if (type === 'param') {
    //     return this.trimParam(values)
    // }
    return values;
  }
}
