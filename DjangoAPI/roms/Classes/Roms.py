from ..models import ROM
from django.core.files.storage import default_storage
from django.http import JsonResponse, Http404
from django.core.exceptions import ObjectDoesNotExist
from ..serializer import ROMSerializer

class Roms (self):
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
        data = [
            {
                'id': rom.id,
                'title': rom.title,
                'description': rom.description,
                'emulador': rom.emulador,
                'image_base64': encode_image_to_base64(rom.image) if rom.image and default_storage.exists(rom.image.name) else None,
            }
            for rom in roms
        ]
        return data

    def rom_detail(self, id_rom):
        try:
            rom = ROM.objects.get(id=rom_id)
        except ROM.DoesNotExist:
            raise NotFound()

        data = {
            'id': rom.id,
            'title': rom.title,
            'description': rom.description,
            'emulador': rom.emulador,
            'image_base64': encode_image_to_base64(rom.image) if rom.image and default_storage.exists(rom.image.name) else None,
        }

    def most_played()
        roms = ROM.objects.order_by('-qtd_download')[:4]
        data = [
            {
                'id': rom.id,
                'title': rom.title,
                'description': rom.description,
                'emulador': rom.emulador,
                'image_base64': encode_image_to_base64(rom.image) if rom.image and default_storage.exists(rom.image.name) else None,
            }
            for rom in roms
        ]
    

    
