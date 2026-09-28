import {Injectable, OnModuleInit, UnauthorizedException} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
import {InjectRepository} from '@nestjs/typeorm';
import {compare, hash} from 'bcryptjs';
import {Repository} from 'typeorm';
import {LoginDto} from './auth.dto';
import {User} from './user.entity';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {
  }

  async onModuleInit() {
    const email = this.config.get<string>('ADMIN_EMAIL')?.toLowerCase();
    const password = this.config.get<string>('ADMIN_PASSWORD');
    if (email && password && !(await this.users.findOneBy({email}))) await this.users.save(this.users.create({
      name: 'Administrador Norte4j',
      email,
      passwordHash: await hash(password, 12)
    }));
  }

  async login(dto: LoginDto) {
    const user = await this.users.createQueryBuilder('user').addSelect('user.passwordHash').where('LOWER(user.email) = LOWER(:email)', {email: dto.email}).getOne();
    if (!user || !user.active || !(await compare(dto.password, user.passwordHash))) throw new UnauthorizedException('Credenciais inválidas');
    return {
      accessToken: await this.jwt.signAsync({sub: user.id, email: user.email, role: user.role}),
      user: this.publicUser(user)
    };
  }

  async findById(id: string) {
    const user = await this.users.findOneBy({id, active: true});
    if (!user) throw new UnauthorizedException();
    return this.publicUser(user);
  }

  private publicUser(user: User) {
    return {id: user.id, name: user.name, email: user.email, role: user.role};
  }
}
