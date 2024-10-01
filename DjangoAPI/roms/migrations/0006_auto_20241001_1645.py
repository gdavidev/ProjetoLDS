from django.db import migrations
from django.contrib.auth.hashers import make_password
from django.conf import settings

def create_admin_user(apps, schema_editor):
    User = apps.get_model('roms', 'User')
    admin_user = User(
        username='admin',
        email='admin@admin.com',
        password=make_password(settings.ADMIN_PASSWORD),
        admin=True,
    )
    admin_user.save()

class Migration(migrations.Migration):

    dependencies = [
        ('roms', '0005_remove_rom_emulador_rom_id_categoria_rom_id_emulador'),
    ]

    operations = [
        migrations.RunPython(create_admin_user),
    ]
