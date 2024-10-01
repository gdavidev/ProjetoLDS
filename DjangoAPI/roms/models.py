from django.contrib.auth.hashers import make_password
from django.db import models

class User(models.Model):
    username = models.CharField(max_length=125, unique = True)
    email = models.EmailField()
    password = models.CharField(max_length=128)  
    admin = models.BooleanField(default=False)
    imagem_perfil = models.ImageField(upload_to='img-perfil/')
    wishlist = models.ManyToManyField('ROM', related_name='wishlist', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def set_password(self, password):
        self.password = make_password(password)

    def check_password(self, password):
        from django.contrib.auth.hashers import check_password
        return check_password(password, self.password)

class Emulador(models.Model):
    nome = models.CharField(max_length=125)
    console = models.CharField(max_length=125)

class Categoria_Jogo(models.Model):
    nome = models.CharField(max_length=125)

class ROM(models.Model):
    title = models.CharField(max_length=125)
    description = models.TextField()
    categoria = models.ForeignKey('Categoria_Jogo', on_delete=models.CASCADE)
    emulador = models.ForeignKey('Emulador', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='img/' , blank=True, null=True)
    file = models.FileField(upload_to='roms/', blank=True, null=True)
    qtd_download = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

#mensagens privadas
class Conversa(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ParticipantesCoversa(models.Model):
    id_conversa = models.ForeignKey('Conversa', on_delete=models.CASCADE)
    id_user = models.ForeignKey('User', on_delete=models.CASCADE)

class Mensagem(models.Model):
    id_conversa = models.ForeignKey('Conversa', on_delete=models.CASCADE)
    id_user = models.ForeignKey('User', on_delete=models.CASCADE)
    mensagem = models.TextField()
    lida = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

#forum
class Topico(models.Model):
    titulo = models.CharField(max_length=125)
    descricao = models.TextField()
    id_categoria = models.ForeignKey('Categoria_Forum', on_delete=models.CASCADE)
    id_user = models.ForeignKey('User', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Postagem(models.Model):
    titulo = models.CharField(max_length=125)
    descricao = models.TextField()
    id_topico = models.ForeignKey('Topico', on_delete=models.CASCADE)
    id_user = models.ForeignKey('User', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Categoria_Forum(models.Model):
    nome = models.CharField(max_length=125)