import {
  Body,
  Catch,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { CriaUsuarioDTO } from './dto/CriaUsuario.dto';
import { AtualizaUsuarioDTO } from './dto/AtualizaUsuario.dto';
import { UsuarioService } from './usuario.service';
import { ListaUsuarioDTO } from './dto/ListaUsuario.dto';

@Controller('/usuarios')
@Catch()
export class UsuarioController {
  constructor(private usuarioService: UsuarioService) {}

  @Post()
  public async criaUsuario(@Body() dadosDoUsuario: CriaUsuarioDTO) {
    const usuarioCriado = await this.usuarioService.criaUsuario(dadosDoUsuario);

    return {
      usario: new ListaUsuarioDTO(usuarioCriado.id, usuarioCriado.nome),
      mensagem: 'usuário criado com sucesso'
    };
  }

  @Get()
  public async listaUsuario() {
    return this.usuarioService.listaUsuario();
  }

  @Put('/:id')
  public async atualizaUsuario(@Param('id') id: string, @Body() novosDados: AtualizaUsuarioDTO) {
    const usuarioAtualizado = await this.usuarioService.atualizaUsuario(id, novosDados);

    return {
      usuario: usuarioAtualizado,
      mensagem: 'usuário atualizado com sucesso'
    };
  }

  @Delete('/:id')
  public async removeUsuario(@Param('id') id: string) {
    const usuarioRemovido = await this.usuarioService.removeUsuario(id);

    return {
      usuario: usuarioRemovido,
      mensagem: 'usuário removido com sucesso'
    };
  }

  catch(excecao: unknown) {
    console.error(excecao);
  }
}
