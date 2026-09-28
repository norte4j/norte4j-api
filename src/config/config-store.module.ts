import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthModule} from '../auth/auth.module';
import {ConfigStoreController} from './config-store.controller';
import {ConfigStoreService} from './config-store.service';
import {SiteConfig} from './site-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SiteConfig]), AuthModule],
  controllers: [ConfigStoreController],
  providers: [ConfigStoreService],
})
export class ConfigStoreModule {}
