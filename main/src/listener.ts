import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqps://ckghtqun:E8HCL6oWWIy2gA3_OdrHN3XsbGQO6Ksj@codfish.rmq.cloudamqp.com/ckghtqun'],
      queue: 'main_queue',
      queueOptions: {
        durable: false
      },
    },
  })

  await app.listen()
}
bootstrap();
