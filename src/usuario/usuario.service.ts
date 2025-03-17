import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListaUsuarioDTO } from './dto/ListaUsuario.dto';
import { UsuarioEntity } from './usuario.entity';
import { AtualizaUsuarioDTO } from './dto/AtualizaUsuario.dto';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { CriaUsuarioDTO } from './dto/CriaUsuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>
  ) {}

  public async criaUsuario(dadosDoUsuario: CriaUsuarioDTO) {
    if (await this.existeComEmail(dadosDoUsuario.email)) {
      throw new ConflictException('Já existe um usuário com este e-mail')
    }
    const usuarioEntity: UsuarioEntity = new UsuarioEntity();

    Object.assign(usuarioEntity, dadosDoUsuario as UsuarioEntity);

    await this.usuarioRepository.save(usuarioEntity);

    return usuarioEntity;
  }

  public async listaUsuario() {
    const usuariosSalvos = await this.usuarioRepository.find();
    const usuariosLista = usuariosSalvos.map(
      (usuario) => new ListaUsuarioDTO(usuario.id, usuario.nome)
    );

    return usuariosLista;
  }

  private async buscaPorId(id: string) {
    if (!isUUID(id)) {
      throw new NotFoundException('Usuário não existe');
    }

    const possivelUsuario = await this.usuarioRepository.findOne({
      where: { id }
    });

    if (!possivelUsuario) {
      throw new NotFoundException('Usuário não existe');
    }

    return possivelUsuario;
  }

  public async atualizaUsuario(id: string, novosDados: AtualizaUsuarioDTO) {
    await this.buscaPorId(id);
    return await this.usuarioRepository.update(id, novosDados);
  }

  public async removeUsuario(id: string) {
    await this.buscaPorId(id);
    return await this.usuarioRepository.delete(id);
  }

  public async existeComEmail(email: string) {
    const possiveisUsuarios = await this.usuarioRepository.find({
      where: {
        email: email
      }
    });

    return possiveisUsuarios.length > 0;
  }
}