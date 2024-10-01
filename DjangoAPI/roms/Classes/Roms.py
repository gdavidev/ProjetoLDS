from ..models import ROM, Categoria_Jogo, Emulador
from django.core.files.storage import default_storage
from django.http import JsonResponse, Http404
from django.core.exceptions import ObjectDoesNotExist
from ..serializer import ROMSerializer
import base64
import asyncio


class Roms():
    def __init__(self):
        pass

    def encode_image_to_base64(image):
        try:
            with image.open('rb') as img_file:
                return base64.b64encode(img_file.read()).decode('utf-8')
        except Exception as e:
            logger.error(f"Error encoding image: {e}")
            return None

    def get_roms(self):
        roms = ROM.objects.all()
        data = []
        for rom in roms:
            categoria = Categoria_Jogo.objects.get(id=rom.categoria_id)
            emulador = Emulador.objects.get(id=rom.emulador_id)
            jogo = self.create_data(rom.id, rom.title, rom.description, emulador.nome, categoria.nome, encode_image_to_base64(rom.image))
            data.append(jogo)
        print(data)
        return data

    def rom_detail(self, id_rom):
        try:
            rom = ROM.objects.get(id=rom_id)
            categoria = Categoria_Jogo.objects.get(id=rom.categoria_id)
            emulador = Emulador.objects.get(id=rom.emulador_id)
            data = self.create_data(rom.id, rom.title, rom.description, emulador.nome, categoria.nome, encode_image_to_base64(rom.image))
            return data
        except ROM.DoesNotExist:
            raise NotFound()
       

    def most_played(self):
        roms = ROM.objects.order_by('-qtd_download')[:4]
        data = []

        try:
            for rom in roms:
                categoria = Categoria_Jogo.objects.get(id=rom.categoria_id)
                emulador = Emulador.objects.get(id=rom.emulador_id)
                jogo = self.create_data(rom.id, rom.title, rom.description, emulador.nome, categoria.nome, encode_image_to_base64(rom.image))
                data.append(jogo)
            return data
        except ROM.DoesNotExist:
            raise NotFound()
    
    def create_data(self, id_rom, title, description, emulador, categoria, image_base64):
        rom = {
            'id': id_rom,
            'title': title,
            'description': description,
            'emulador': emulador,
            'categoria': categoria,
            'image_base64': image_base64,
        }
        return rom