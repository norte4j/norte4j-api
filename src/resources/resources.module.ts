import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthModule} from '../auth/auth.module';
import {ContactsController} from './contacts.controller';
import {ResourcesController} from './resources.controller';
import {ResourcesService} from './resources.service';
import {ContentResource} from './resource.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContentResource]), AuthModule],
  controllers: [ContactsController, ResourcesController],
  providers: [ResourcesService]
})
export class ResourcesModule {
}
