import { Logger } from '@nestjs/common';

export function LogMethod(): MethodDecorator {
  return function decorator(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): void {
    const method = descriptor.value;

    descriptor.value = async function wrapper(...args: any[]) {
      const logger = new Logger();
      try {
        logger.log(`[START] ${target?.constructor?.name} - ${propertyKey}`);

        if (Object.getPrototypeOf(method).constructor.name == 'AsyncFunction')
          return await method.apply(this, args);
        else return method.apply(this, args);
      } catch (error) {
        logger.error(
          `[ERROR] ${target?.constructor?.name} - ${propertyKey}`,
          error,
        );
        throw error;
      } finally {
        logger.log(`[END] ${target?.constructor?.name} - ${propertyKey}`);
      }
    };
  };
}
