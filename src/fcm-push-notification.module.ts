import { Global, Module, DynamicModule, Logger } from '@nestjs/common';
import { FcmPushNotificationOptions } from './interfaces/fcm-push-notification-options.interface';
import { FCM_PUSH_NOTIFICATION_OPTIONS } from './utils/fcm-push-notification.constants';
import { ValueProvider } from '@nestjs/common/interfaces/modules/provider.interface';
import { FcmPushNotificationService } from './fcm-push-notification.service';

@Global()
@Module({})
export class FcmPushNotificationModule {
  static forRoot(options: FcmPushNotificationOptions): DynamicModule {
    const optionsProvider: ValueProvider = {
      provide: FCM_PUSH_NOTIFICATION_OPTIONS,
      useValue: options,
    };
    const logger = options.logger ? options.logger : new Logger('FcmPushNotificationService');
    return {
      module: FcmPushNotificationModule,
      providers: [
        { provide: Logger, useValue: logger },
        FcmPushNotificationService,
        optionsProvider,
      ],
      exports: [FcmPushNotificationService],
    };
  }
}
